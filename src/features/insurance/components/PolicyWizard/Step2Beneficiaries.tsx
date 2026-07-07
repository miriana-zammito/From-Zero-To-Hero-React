// === Step 2: Beneficiaries — useFieldArray con append/remove, indicatore ===
import { useFormContext, useFieldArray } from "react-hook-form";
import type { PolicyFormData } from "./schemas";
import s from "../StepForm.module.css";

const RELATIONSHIPS = [
  { value: "coniuge", label: "Coniuge" },
  { value: "figlio", label: "Figlio" },
  { value: "genitore", label: "Genitore" },
  { value: "fratello", label: "Fratello" },
  { value: "sorella", label: "Sorella" },
  { value: "altro", label: "Altro" },
] as const;

export function Step2Beneficiaries() {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<PolicyFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiaries",
  });

  const percentages = watch("beneficiaries");
  const totalPct = percentages?.reduce((sum, b) => sum + (b.percentage || 0), 0) ?? 0;

  return (
    <fieldset className={s.fieldset}>
      <div className={s.arrayContainer}>
        {fields.map((field, i) => {
          const itemErrors = errors.beneficiaries?.[i];
          return (
            <div key={field.id} className={s.arrayItem}>
              <div className={s.arrayItemHeader}>
                <span className={s.arrayItemTitle}>Beneficiary {i + 1}</span>
                <button
                  type="button"
                  className={s.removeBtn}
                  onClick={() => remove(i)}
                  aria-label={`Remove beneficiary ${i + 1}`}
                >
                  ✕
                </button>
              </div>

              <div className={s.grid3}>
                {/* Name */}
                <div className={s.field}>
                  <label className={s.label} htmlFor={`benef-${i}-name`}>Name</label>
                  <input
                    id={`benef-${i}-name`}
                    className={`${s.input} ${itemErrors?.name ? s.inputError : ""}`}
                    {...register(`beneficiaries.${i}.name`)}
                    placeholder="Luigi Rossi"
                  />
                  <p className={s.error}>{itemErrors?.name?.message}</p>
                </div>

                {/* Relationship */}
                <div className={s.field}>
                  <label className={s.label} htmlFor={`benef-${i}-relation`}>Relationship</label>
                  <select
                    id={`benef-${i}-relation`}
                    className={`${s.select} ${itemErrors?.relationship ? s.inputError : ""}`}
                    {...register(`beneficiaries.${i}.relationship`)}
                  >
                    <option value="">Select…</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <p className={s.error}>{itemErrors?.relationship?.message}</p>
                </div>

                {/* Percentage */}
                <div className={s.field}>
                  <label className={s.label} htmlFor={`benef-${i}-pct`}>%</label>
                  <input
                    id={`benef-${i}-pct`}
                    type="number"
                    min={1}
                    max={100}
                    className={`${s.input} ${itemErrors?.percentage ? s.inputError : ""}`}
                    {...register(`beneficiaries.${i}.percentage`)}
                    placeholder="50"
                  />
                  <p className={s.error}>{itemErrors?.percentage?.message}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicatore somma percentuali */}
        {fields.length > 0 && (
          <p style={{
            fontSize: "0.8rem",
            fontWeight: totalPct === 100 ? 700 : 400,
            color: totalPct === 100 ? "var(--color-success)" : "var(--color-text-secondary)",
            margin: 0,
            textAlign: "right",
          }}>
            Total: {totalPct}%
          </p>
        )}

        {/* Add button */}
        <button
          type="button"
          className={s.addBtn}
          onClick={() => append({ name: "", relationship: "coniuge", percentage: undefined as unknown as number })}
        >
          + Add Beneficiary
        </button>
      </div>
    </fieldset>
  );
}
