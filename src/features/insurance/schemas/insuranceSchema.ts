// === Schema Zod polizza assicurativa — 5 step ===
import { z, ZodIssueCode } from "zod";
import { checkCodiceFiscale } from "../../../services/codiceFiscaleService";

// ── Step 1: Anagrafici ──────────────────────────────────────────────

export const anagraficiSchema = z.object({
  nome: z.string().min(2, "Nome: almeno 2 caratteri"),
  cognome: z.string().min(2, "Cognome: almeno 2 caratteri"),
  codiceFiscale: z
    .string()
    .length(16, "CF: deve essere 16 caratteri")
    .regex(/^[A-Z0-9]{16}$/, "CF: solo lettere maiuscole e numeri")
    .superRefine(async (val, ctx) => {
      if (val.length !== 16 || !/^[A-Z0-9]{16}$/.test(val)) return;
      try {
        const result = await checkCodiceFiscale(val);
        if (!result.valid) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: result.message ?? "Codice Fiscale non valido",
          });
        }
      } catch {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "Servizio di verifica CF temporaneamente non disponibile.",
        });
      }
    }),
  dataNascita: z.string().min(1, "Data nascita obbligatoria"),
  sesso: z.enum(["M", "F"], { required_error: "Seleziona sesso" }),
  comuneNascita: z.string().min(2, "Comune obbligatorio"),
  provinciaNascita: z
    .string()
    .length(2, "Provincia: 2 caratteri")
    .toUpperCase(),
  indirizzoResidenza: z.string().min(5, "Indirizzo: almeno 5 caratteri"),
  telefono: z.string().regex(/^\+?\d{8,15}$/, "Telefono non valido"),
  email: z.string().email("Email non valida"),
});

export type AnagraficiData = z.infer<typeof anagraficiSchema>;

// ── Step 2: Beneficiari ─────────────────────────────────────────────

export const beneficiarioSchema = z.object({
  nome: z.string().min(2, "Nome obbligatorio"),
  cognome: z.string().min(2, "Cognome obbligatorio"),
  percentuale: z.coerce
    .number({ invalid_type_error: "Inserisci un numero" })
    .min(1, "Minimo 1%")
    .max(100, "Massimo 100%"),
  parentela: z.string().min(2, "Parentela obbligatoria"),
});

export type BeneficiarioData = z.infer<typeof beneficiarioSchema>;

// ── Step 3: Dettagli Polizza ────────────────────────────────────────

export const dettagliPolizzaSchema = z
  .object({
    tipoPolizza: z.enum(
      ["vita", "infortuni", "malattia", "auto", "casa"] as const,
      { required_error: "Seleziona tipo polizza" },
    ),
    importoAssicurato: z.coerce
      .number({ invalid_type_error: "Inserisci importo" })
      .positive()
      .min(1000, "Minimo € 1.000"),
    durataAnni: z.coerce
      .number({ invalid_type_error: "Inserisci durata" })
      .int()
      .positive("Deve essere positivo")
      .max(50, "Massimo 50 anni"),
    dataDecorrenza: z.string().min(1, "Data decorrenza obbligatoria"),
    dataScadenza: z.string().min(1, "Data scadenza obbligatoria"),
    premioAnnuale: z.coerce
      .number({ invalid_type_error: "Inserisci premio" })
      .positive("Deve essere positivo"),
    modalitaPagamento: z.enum(
      ["annuale", "semestrale", "trimestrale", "mensile"] as const,
      { required_error: "Seleziona modalità" },
    ),
  })
  .refine(
    (data) =>
      !data.dataDecorrenza ||
      !data.dataScadenza ||
      data.dataScadenza > data.dataDecorrenza,
    {
      message: "Scadenza deve essere successiva alla decorrenza",
      path: ["dataScadenza"],
    },
  );

export type DettagliPolizzaData = z.infer<typeof dettagliPolizzaSchema>;

// ── Step 4: PIN ─────────────────────────────────────────────────────

export const pinSchema = z
  .object({
    pin: z.string().regex(/^\d{5}$/, "PIN: esattamente 5 cifre"),
    confermaPin: z
      .string()
      .regex(/^\d{5}$/, "PIN: esattamente 5 cifre"),
  })
  .refine((data) => data.pin === data.confermaPin, {
    message: "I PIN non coincidono",
    path: ["confermaPin"],
  });

export type PinData = z.infer<typeof pinSchema>;

// ── Step 5: Riepilogo (nessun campo — solo lettura) ─────────────────
// Nessuno schema dedicato, usiamo il form completo.

// ── Form completo ────────────────────────────────────────────────────

export const insuranceFormSchema = z.object({
  anagrafici: anagraficiSchema,
  beneficiari: z
    .array(beneficiarioSchema)
    .min(1, "Aggiungi almeno un beneficiario")
    .superRefine((vals, ctx) => {
      const totale = vals.reduce((sum, v) => sum + v.percentuale, 0);
      if (totale !== 100) {
        const idx = vals.length > 0 ? vals.length - 1 : 0;
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `Somma percentuali: ${totale}% (deve essere 100%)`,
          path: [idx, "percentuale"],
        });
      }
    }),
  dettagliPolizza: dettagliPolizzaSchema,
  pin: pinSchema,
});

export type InsuranceFormData = z.infer<typeof insuranceFormSchema>;

// ── Default values ──────────────────────────────────────────────────

export const defaultInsuranceFormValues: InsuranceFormData = {
  anagrafici: {
    nome: "",
    cognome: "",
    codiceFiscale: "",
    dataNascita: "",
    sesso: undefined as unknown as "M" | "F",
    comuneNascita: "",
    provinciaNascita: "",
    indirizzoResidenza: "",
    telefono: "",
    email: "",
  },
  beneficiari: [],
  dettagliPolizza: {
    tipoPolizza: undefined as unknown as DettagliPolizzaData["tipoPolizza"],
    importoAssicurato: undefined as unknown as number,
    durataAnni: undefined as unknown as number,
    dataDecorrenza: "",
    dataScadenza: "",
    premioAnnuale: undefined as unknown as number,
    modalitaPagamento: undefined as unknown as DettagliPolizzaData["modalitaPagamento"],
  },
  pin: {
    pin: "",
    confermaPin: "",
  },
};
