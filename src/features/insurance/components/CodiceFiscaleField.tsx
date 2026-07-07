// === Campo Codice Fiscale con validazione asincrona Zod + debounce ===
import { useEffect, useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDebounce } from "../../../hooks/useDebounce";
import type { InsuranceFormData } from "../schemas/insuranceSchema";
import stepStyles from "./StepForm.module.css";
import fieldStyles from "./CodiceFiscaleField.module.css";

type CfStatus = "idle" | "verifying" | "verified" | "error";

export function CodiceFiscaleField() {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<InsuranceFormData>();

  const [cfStatus, setCfStatus] = useState<CfStatus>("idle");
  const latestRunRef = useRef(0);

  const fieldValue = useWatch<InsuranceFormData>({
    name: "anagrafici.codiceFiscale",
  });
  const debouncedValue = useDebounce(fieldValue, 400);

  const fieldError = errors.anagrafici?.codiceFiscale;

  // Resetta status visivo quando l'utente ricomincia a digitare
  useEffect(() => {
    if (cfStatus === "verified" || cfStatus === "error") {
      setCfStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);

  // Dopo debounce: trigger validazione asincrona Zod → mock API
  useEffect(() => {
    if (debouncedValue.length !== 16) return;
    if (!/^[A-Z0-9]{16}$/.test(debouncedValue)) return;

    const runId = ++latestRunRef.current;

    const validate = async () => {
      setCfStatus("verifying");
      // trigger esegue lo Zod schema completo, incluse le async superRefine
      const valid = await trigger("anagrafici.codiceFiscale");

      // Ignora se nel frattempo è partita una nuova validazione
      if (runId !== latestRunRef.current) return;

      setCfStatus(valid ? "verified" : "error");
    };

    validate();
  }, [debouncedValue, trigger]);

  const inputClass = [
    stepStyles.input,
    fieldStyles.input,
    fieldError ? stepStyles.inputError : "",
    cfStatus === "verified" && !fieldError ? fieldStyles.inputSuccess : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stepStyles.field}>
      <label className={stepStyles.label} htmlFor="anagrafici.codiceFiscale">
        Codice Fiscale
      </label>

      <div className={fieldStyles.inputWrapper}>
        <input
          id="anagrafici.codiceFiscale"
          className={inputClass}
          {...register("anagrafici.codiceFiscale")}
          placeholder="RSSMRA80A01H501U"
          maxLength={16}
          style={{ textTransform: "uppercase" }}
          aria-describedby="cf-status"
        />

        <span id="cf-status" className={fieldStyles.statusIcon} aria-live="polite">
          {cfStatus === "verifying" && (
            <span className={fieldStyles.spinner} aria-label="Verifica in corso" />
          )}
          {cfStatus === "verified" && (
            <span className={fieldStyles.check} aria-label="Codice Fiscale valido">
              ✓
            </span>
          )}
        </span>
      </div>

      <p className={stepStyles.error}>{fieldError?.message}</p>
    </div>
  );
}
