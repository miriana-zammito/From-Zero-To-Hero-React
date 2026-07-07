// === Step 4: PIN — refine cross-field (pin === confermaPin) ===
import { useFormContext } from "react-hook-form";
import type { InsuranceFormData } from "../schemas/insuranceSchema";
import s from "./StepForm.module.css";

export function StepPin() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InsuranceFormData>();

  const e = errors.pin;

  return (
    <fieldset className={s.fieldset}>
      <div className={s.grid2}>
        {/* PIN */}
        <div className={s.field}>
          <label className={s.label} htmlFor="pin.pin">
            PIN (5 cifre)
          </label>
          <input
            id="pin.pin"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={5}
            className={`${s.input} ${e?.pin ? s.inputError : ""}`}
            {...register("pin.pin")}
            placeholder="•••••"
          />
          <p className={s.error}>{e?.pin?.message}</p>
        </div>

        {/* Conferma PIN */}
        <div className={s.field}>
          <label className={s.label} htmlFor="pin.confermaPin">
            Conferma PIN
          </label>
          <input
            id="pin.confermaPin"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={5}
            className={`${s.input} ${e?.confermaPin ? s.inputError : ""}`}
            {...register("pin.confermaPin")}
            placeholder="•••••"
          />
          <p className={s.error}>
            {/* Mostra errore field-level o errore refine (non coincidenza) */}
            {e?.confermaPin?.message}
          </p>
        </div>
      </div>

      {e?.root?.message && (
        <p className={s.error} style={{ marginTop: "var(--space-2)" }}>
          {e.root.message}
        </p>
      )}

      <p
        style={{
          marginTop: "var(--space-3)",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-muted)",
        }}
      >
        Il PIN sarà usato per autenticare le richieste di rimborso.
      </p>
    </fieldset>
  );
}
