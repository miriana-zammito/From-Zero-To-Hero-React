// === Step 4: PIN + Confirm — cross-field validation via schema .refine ===
import { useFormContext } from "react-hook-form";
import type { PolicyFormData } from "./schemas";
import s from "../StepForm.module.css";

export function Step4PinConfirm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PolicyFormData>();

  const e = errors.pinConfirmation;

  return (
    <fieldset className={s.fieldset}>
      <div className={s.grid2}>
        {/* PIN */}
        <div className={s.field}>
          <label className={s.label} htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            className={`${s.input} ${e?.pin ? s.inputError : ""}`}
            {...register("pinConfirmation.pin")}
            placeholder="123456"
            autoComplete="new-password"
          />
          <p className={s.error}>{e?.pin?.message}</p>
        </div>

        {/* Confirm PIN */}
        <div className={s.field}>
          <label className={s.label} htmlFor="confirmPin">Confirm PIN</label>
          <input
            id="confirmPin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            className={`${s.input} ${e?.confirmPin ? s.inputError : ""}`}
            {...register("pinConfirmation.confirmPin")}
            placeholder="Re-enter PIN"
            autoComplete="new-password"
          />
          <p className={s.error}>{e?.confirmPin?.message}</p>
        </div>
      </div>
    </fieldset>
  );
}
