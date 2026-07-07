// === Schemas Zod PolicyWizard ===
import { z, ZodIssueCode } from "zod";

// ── Step 1: Personal Data ─────────────────────────────────────────────

export const personalDataSchema = z.object({
  firstName: z.string().min(2, "Nome: almeno 2 caratteri"),
  lastName: z.string().min(2, "Cognome: almeno 2 caratteri"),
  email: z.string().email("Email non valida"),
  birthDate: z.string().min(1, "Data nascita obbligatoria").superRefine((val, ctx) => {
    if (!val) return;
    const birth = new Date(val);
    if (Number.isNaN(birth.getTime())) {
      ctx.addIssue({ code: ZodIssueCode.custom, message: "Data non valida" });
      return;
    }
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
        ? age - 1
        : age;
    if (actualAge < 18) ctx.addIssue({ code: ZodIssueCode.custom, message: "Devi essere maggiorenne (≥ 18 anni)" });
    if (actualAge > 90) ctx.addIssue({ code: ZodIssueCode.custom, message: "Età massima 90 anni" });
  }),
});

export type PersonalData = z.infer<typeof personalDataSchema>;

// ── Step 2: Beneficiaries ─────────────────────────────────────────────

export const relationshipEnum = z.enum([
  "coniuge",
  "figlio",
  "genitore",
  "fratello",
  "sorella",
  "altro",
] as const);

export const beneficiarySchema = z.object({
  name: z.string().min(3, "Nome: almeno 3 caratteri"),
  relationship: relationshipEnum,
  percentage: z.coerce
    .number({ invalid_type_error: "Inserisci un numero" })
    .min(1, "Minimo 1%")
    .max(100, "Massimo 100%"),
});

export type Beneficiary = z.infer<typeof beneficiarySchema>;

export const beneficiariesSchema = z
  .array(beneficiarySchema)
  .min(1, "Aggiungi almeno un beneficiario")
  .superRefine((vals, ctx) => {
    const totale = vals.reduce((sum, v) => sum + v.percentage, 0);
    if (totale !== 100) {
      const idx = vals.length > 0 ? vals.length - 1 : 0;
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Somma percentuali: ${totale}% (deve essere 100%)`,
        path: [idx, "percentage"],
      });
    }
  });

// ── Step 3: Policy Details ────────────────────────────────────────────

export const policyTypeEnum = z.enum(["vita", "infortuni", "malattia"] as const);

export const policyDetailsSchema = z.object({
  type: policyTypeEnum,
  coverageAmount: z.coerce
    .number({ invalid_type_error: "Inserisci importo" })
    .min(10000, "Minimo € 10.000")
    .max(5_000_000, "Massimo € 5.000.000"),
  cf: z
    .string()
    .length(16, "CF: 16 caratteri")
    .regex(/^[A-Z0-9]{16}$/, "CF: solo lettere maiuscole e numeri"),
});

export type PolicyDetails = z.infer<typeof policyDetailsSchema>;

// ── Step 4: PIN ───────────────────────────────────────────────────────

export const pinConfirmationSchema = z
  .object({
    pin: z.string().regex(/^\d{6}$/, "PIN: 6 cifre"),
    confirmPin: z.string().regex(/^\d{6}$/, "PIN: 6 cifre"),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "I PIN non coincidono",
    path: ["confirmPin"],
  });

export type PinConfirmation = z.infer<typeof pinConfirmationSchema>;

// ── Form completo ─────────────────────────────────────────────────────

export const policyFormSchema = z.object({
  personalData: personalDataSchema,
  beneficiaries: beneficiariesSchema,
  policyDetails: policyDetailsSchema,
  pinConfirmation: pinConfirmationSchema,
});

export type PolicyFormData = z.infer<typeof policyFormSchema>;

// ── Default values ────────────────────────────────────────────────────

export const defaultPolicyFormValues: PolicyFormData = {
  personalData: {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
  },
  beneficiaries: [],
  policyDetails: {
    type: undefined as unknown as PolicyFormData["policyDetails"]["type"],
    coverageAmount: undefined as unknown as number,
    cf: "",
  },
  pinConfirmation: {
    pin: "",
    confirmPin: "",
  },
};
