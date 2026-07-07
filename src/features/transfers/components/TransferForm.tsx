// === Bonifico bancario — form con IBAN validation, confirm, anti-double-click ===
import { type FormEvent, useState, useRef, useId } from "react";
import { useApiMutation } from "@/hooks";
import type { Movement } from "@/types";
import s from "./TransferForm.module.css";

// ── IBAN validation ───────────────────────────────────────────────────

const IBAN_REGEX = /^IT\d{2}[A-Z]\d{22}$/;

/**
 * Validazione base IBAN italiano: regex + checksum (IT + CIN + CIN + ABI + CAB + conto).
 * Calcola check digit secondo lo standard ISO 7064 mod 97-10.
 */
function validateItalianIban(iban: string): string | null {
  if (!/^[A-Z0-9]+$/.test(iban)) return "IBAN: solo lettere e numeri";
  if (iban.length !== 27) return "IBAN IT: 27 caratteri";

  const numeric = iban
    .slice(4)
    .concat(iban.slice(0, 4))
    .split("")
    .map((c) => (/[A-Z]/.test(c) ? c.charCodeAt(0) - 55 : c))
    .join("");

  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + Number.parseInt(numeric[i], 10)) % 97;
  }

  return remainder === 1 ? null : "IBAN non valido (check digit errato)";
}

// ── Types ─────────────────────────────────────────────────────────────

interface TransferBody {
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  counterpartIban: string;
  counterpartName: string;
}

interface TransferFormProps {
  accountId: string;
  currency: string;
}

// ── Helpers ───────────────────────────────────────────────────────────

type FieldErrors = Partial<Record<"iban" | "name" | "amount" | "amountConfirm" | "description", string>>;

const EURO_FORMATTER = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

// ── Component ─────────────────────────────────────────────────────────

export function TransferForm({ accountId, currency }: TransferFormProps) {
  const formId = useId();

  const [iban, setIban] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountConfirm, setAmountConfirm] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false); // anti-doppio click
  const submittedRef = useRef(false);

  const { mutate, isLoading, error, reset } = useApiMutation<
    TransferBody,
    Movement
  >({
    url: "/api/movements",
    method: "POST",
    onSuccess: (movement) => {
      setSuccessMsg(
        `Bonifico ${movement.id} eseguito — ${EURO_FORMATTER.format(movement.amount)}`,
      );
      setIban("");
      setName("");
      setAmount("");
      setAmountConfirm("");
      setDescription("");
      setSubmitted(false);
      submittedRef.current = false;
    },
    onError: () => {
      setSubmitted(false);
      submittedRef.current = false;
    },
  });

  // ── Validazione lato client ─────────────────────────────────────────

  const validate = (): boolean => {
    const e: FieldErrors = {};

    const trimmedIban = iban.replace(/\s+/g, "").toUpperCase();

    if (!trimmedIban) {
      e.iban = "IBAN obbligatorio";
    } else if (!IBAN_REGEX.test(trimmedIban)) {
      e.iban =
        "Formato IBAN IT non valido (es. IT60X0542811101000000123456)";
    } else {
      const ibanErr = validateItalianIban(trimmedIban);
      if (ibanErr) e.iban = ibanErr;
    }

    if (!name.trim()) e.name = "Intestatario obbligatorio";

    const parsedAmount = Number.parseFloat(amount);
    if (!amount) {
      e.amount = "Importo obbligatorio";
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      e.amount = "Importo deve essere > 0";
    }

    if (!amountConfirm) {
      e.amountConfirm = "Conferma importo obbligatoria";
    } else if (amount !== amountConfirm) {
      e.amountConfirm = "Gli importi non coincidono";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit con anti-doppio click ────────────────────────────────────

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (submittedRef.current) return; // doppio click → bloccato
    if (!validate()) return;

    setSubmitted(true);
    submittedRef.current = true;
    setSuccessMsg(null);
    reset();

    const trimmedIban = iban.replace(/\s+/g, "").toUpperCase();

    mutate({
      accountId,
      amount: Number.parseFloat(amount),
      currency,
      description,
      counterpartIban: trimmedIban,
      counterpartName: name.trim(),
    });
  };

  const busy = isLoading || submitted;

  // ── Helpers field ───────────────────────────────────────────────────

  const fieldClass = (fieldError?: string) =>
    [s.input, fieldError ? s.inputError : ""].filter(Boolean).join(" ");

  const isConfirmed =
    amount.length > 0 && amountConfirm.length > 0 && amount === amountConfirm;

  return (
    <form onSubmit={handleSubmit} className={s.card} noValidate>
      <fieldset className={s.fieldset} disabled={busy}>
        <legend className={s.legend}>Nuovo bonifico</legend>

        <div className={s.grid}>
          {/* ── Importo ──────────────────────────────────────────── */}
          <div className={s.field}>
            <label className={s.label} htmlFor={`${formId}-amount`}>
              Importo (€)
            </label>
            <input
              id={`${formId}-amount`}
              className={fieldClass(errors.amount)}
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? `${formId}-amount-err` : undefined}
              required
            />
            <p className={s.error} id={`${formId}-amount-err`} role="alert">
              {errors.amount ?? ""}
            </p>
          </div>

          {/* ── Conferma importo ─────────────────────────────────── */}
          <div className={s.field}>
            <label className={s.label} htmlFor={`${formId}-amount-confirm`}>
              Conferma importo (€)
            </label>
            <input
              id={`${formId}-amount-confirm`}
              className={`${fieldClass(errors.amountConfirm)} ${isConfirmed ? s.inputSuccess : ""}`}
              type="number"
              step="0.01"
              min="0.01"
              value={amountConfirm}
              onChange={(e) => setAmountConfirm(e.target.value)}
              aria-invalid={!!errors.amountConfirm}
              aria-describedby={
                errors.amountConfirm ? `${formId}-amount-confirm-err` : undefined
              }
              required
            />
            <p className={s.error} id={`${formId}-amount-confirm-err`} role="alert">
              {errors.amountConfirm ?? ""}
            </p>
          </div>

          {/* ── IBAN ─────────────────────────────────────────────── */}
          <div className={`${s.field} ${s.fieldFull}`}>
            <label className={s.label} htmlFor={`${formId}-iban`}>
              IBAN destinatario
            </label>
            <input
              id={`${formId}-iban`}
              className={fieldClass(errors.iban)}
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
              placeholder="IT60X0542811101000000123456"
              maxLength={27}
              aria-invalid={!!errors.iban}
              aria-describedby={
                errors.iban
                  ? `${formId}-iban-err`
                  : `${formId}-iban-hint`
              }
              required
            />
            <p className={s.error} id={`${formId}-iban-err`} role="alert">
              {errors.iban ?? ""}
            </p>
            <p className={s.helpText} id={`${formId}-iban-hint`}>
              IBAN italiano: 27 caratteri, solo lettere e numeri
            </p>
          </div>

          {/* ── Intestatario ─────────────────────────────────────── */}
          <div className={s.field}>
            <label className={s.label} htmlFor={`${formId}-name`}>
              Intestatario
            </label>
            <input
              id={`${formId}-name`}
              className={fieldClass(errors.name)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${formId}-name-err` : undefined}
              required
            />
            <p className={s.error} id={`${formId}-name-err`} role="alert">
              {errors.name ?? ""}
            </p>
          </div>

          {/* ── Causale ──────────────────────────────────────────── */}
          <div className={s.field}>
            <label className={s.label} htmlFor={`${formId}-description`}>
              Causale
            </label>
            <input
              id={`${formId}-description`}
              className={fieldClass(errors.description)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
            />
            <p className={s.error} id={`${formId}-description-err`} role="alert">
              {errors.description ?? ""}
            </p>
          </div>
        </div>

        {/* ── Conferma visiva importo match ───────────────────────── */}
        {isConfirmed && (
          <div className={s.confirmRow}>
            <span className={s.confirmIcon} aria-hidden="true">✓</span>
            <span className={s.confirmText}>
              Importo confermato: {EURO_FORMATTER.format(Number.parseFloat(amount))}
            </span>
          </div>
        )}
      </fieldset>

      {/* ── Actions ──────────────────────────────────────────────── */}
      <div className={s.actions}>
        <button
          type="submit"
          className={s.btnPrimary}
          disabled={busy}
        >
          {busy && <span className={s.spinner} aria-hidden="true" />}
          {busy ? "Invio in corso…" : "Invia bonifico"}
        </button>
      </div>

      {/* ── Messaggi ─────────────────────────────────────────────── */}
      {error && (
        <p className={`${s.alert} ${s.alertError}`} role="alert">
          Errore: {error.message}
        </p>
      )}
      {successMsg && (
        <p className={`${s.alert} ${s.alertSuccess}`} role="status">
          {successMsg}
        </p>
      )}
    </form>
  );
}
