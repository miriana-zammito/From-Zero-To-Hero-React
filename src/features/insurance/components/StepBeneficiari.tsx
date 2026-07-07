// === Step 2: Beneficiari — useFieldArray + superRefine somma 100% ===
import { useFormContext, useFieldArray } from "react-hook-form";
import type { InsuranceFormData } from "../schemas/insuranceSchema";
import s from "./StepForm.module.css";

export function StepBeneficiari() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<InsuranceFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiari",
  });

  const errArray = errors.beneficiari;

  return (
    <div className={s.arrayContainer}>
      {fields.length === 0 && (
        <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-sm)" }}>
          Nessun beneficiario. Aggiungine almeno uno.
        </p>
      )}

      {fields.map((field, index) => {
        const itemErr = errArray?.[index];

        return (
          <div key={field.id} className={s.arrayItem}>
            <div className={s.arrayItemHeader}>
              <span className={s.arrayItemTitle}>
                Beneficiario #{index + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  className={s.removeBtn}
                  onClick={() => remove(index)}
                  aria-label={`Rimuovi beneficiario ${index + 1}`}
                >
                  ✕
                </button>
              )}
            </div>

            <div className={s.grid2}>
              {/* Nome */}
              <div className={s.field}>
                <label
                  className={s.label}
                  htmlFor={`beneficiari.${index}.nome`}
                >
                  Nome
                </label>
                <input
                  id={`beneficiari.${index}.nome`}
                  className={`${s.input} ${itemErr?.nome ? s.inputError : ""}`}
                  {...register(`beneficiari.${index}.nome`)}
                  placeholder="Luigi"
                />
                <p className={s.error}>{itemErr?.nome?.message}</p>
              </div>

              {/* Cognome */}
              <div className={s.field}>
                <label
                  className={s.label}
                  htmlFor={`beneficiari.${index}.cognome`}
                >
                  Cognome
                </label>
                <input
                  id={`beneficiari.${index}.cognome`}
                  className={`${s.input} ${itemErr?.cognome ? s.inputError : ""}`}
                  {...register(`beneficiari.${index}.cognome`)}
                  placeholder="Verdi"
                />
                <p className={s.error}>{itemErr?.cognome?.message}</p>
              </div>

              {/* Percentuale */}
              <div className={s.field}>
                <label
                  className={s.label}
                  htmlFor={`beneficiari.${index}.percentuale`}
                >
                  Percentuale %
                </label>
                <input
                  id={`beneficiari.${index}.percentuale`}
                  type="number"
                  min={1}
                  max={100}
                  className={`${s.input} ${itemErr?.percentuale ? s.inputError : ""}`}
                  {...register(`beneficiari.${index}.percentuale`)}
                  placeholder="50"
                />
                <p className={s.error}>{itemErr?.percentuale?.message}</p>
              </div>

              {/* Parentela */}
              <div className={s.field}>
                <label
                  className={s.label}
                  htmlFor={`beneficiari.${index}.parentela`}
                >
                  Parentela
                </label>
                <input
                  id={`beneficiari.${index}.parentela`}
                  className={`${s.input} ${itemErr?.parentela ? s.inputError : ""}`}
                  {...register(`beneficiari.${index}.parentela`)}
                  placeholder="Figlio"
                />
                <p className={s.error}>{itemErr?.parentela?.message}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Errore globale array (superRefine somma %) */}
      {typeof errArray?.message === "string" && (
        <p className={s.error}>{errArray.message}</p>
      )}

      {errArray?.root?.message && (
        <p className={s.error}>{errArray.root.message}</p>
      )}

      {/* Pulsante aggiungi */}
      <button
        type="button"
        className={s.addBtn}
        onClick={() =>
          append({ nome: "", cognome: "", percentuale: 0 as any, parentela: "" })
        }
      >
        + Aggiungi beneficiario
      </button>
    </div>
  );
}
