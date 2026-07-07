// === Step 3: Policy Details — CF, tipo, importo ===
import { useFormContext } from "react-hook-form";
import type { PolicyFormData } from "./schemas";
import s from "../StepForm.module.css";

const POLICY_TYPES = [
  { value: "vita", label: "Vita" },
  { value: "infortuni", label: "Infortuni" },
  { value: "malattia", label: "Malattia" },
] as const;

export function Step3PolicyDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PolicyFormData>();

  const e = errors.policyDetails;

  return (
    <fieldset className={s.fieldset}>
      <div className={s.grid2}>
        {/* Policy Type */}
        <div className={s.field}>
          <label className={s.label} htmlFor="policyType">Policy Type</label>
          <select
            id="policyType"
            className={`${s.select} ${e?.type ? s.inputError : ""}`}
            {...register("policyDetails.type")}
          >
            <option value="">Select…</option>
            {POLICY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <p className={s.error}>{e?.type?.message}</p>
        </div>

        {/* Coverage Amount */}
        <div className={s.field}>
          <label className={s.label} htmlFor="coverageAmount">Coverage Amount (€)</label>
          <input
            id="coverageAmount"
            type="number"
            min={10000}
            max={5_000_000}
            step={1000}
            className={`${s.input} ${e?.coverageAmount ? s.inputError : ""}`}
            {...register("policyDetails.coverageAmount")}
            placeholder="100000"
          />
          <p className={s.error}>{e?.coverageAmount?.message}</p>
        </div>

        {/* Codice Fiscale */}
        <div className={`${s.field} ${s.fieldFull}`}>
          <label className={s.label} htmlFor="cf">Codice Fiscale</label>
          <input
            id="cf"
            className={`${s.input} ${e?.cf ? s.inputError : ""}`}
            {...register("policyDetails.cf")}
            placeholder="RSSMRA80A01H501U"
            maxLength={16}
            style={{ textTransform: "uppercase" }}
          />
          <p className={s.error}>{e?.cf?.message}</p>
        </div>
      </div>
    </fieldset>
  );
}
