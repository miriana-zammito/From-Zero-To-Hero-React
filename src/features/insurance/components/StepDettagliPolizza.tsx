// === Step 3: Dettagli Polizza ===
import { useFormContext } from "react-hook-form";
import type { InsuranceFormData } from "../schemas/insuranceSchema";
import s from "./StepForm.module.css";

export function StepDettagliPolizza() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<InsuranceFormData>();

  const e = errors.dettagliPolizza;
  const tipo = watch("dettagliPolizza.tipoPolizza");

  return (
    <fieldset className={s.fieldset}>
      <div className={s.grid2}>
        {/* Tipo Polizza */}
        <div className={s.field}>
          <label className={s.label} htmlFor="dettagliPolizza.tipoPolizza">
            Tipo Polizza
          </label>
          <select
            id="dettagliPolizza.tipoPolizza"
            className={`${s.select} ${e?.tipoPolizza ? s.inputError : ""}`}
            {...register("dettagliPolizza.tipoPolizza")}
          >
            <option value="">Seleziona…</option>
            <option value="vita">Vita</option>
            <option value="infortuni">Infortuni</option>
            <option value="malattia">Malattia</option>
            <option value="auto">Auto</option>
            <option value="casa">Casa</option>
          </select>
          <p className={s.error}>{e?.tipoPolizza?.message}</p>
        </div>

        {/* Importo Assicurato */}
        <div className={s.field}>
          <label className={s.label} htmlFor="dettagliPolizza.importoAssicurato">
            Importo Assicurato (€)
          </label>
          <input
            id="dettagliPolizza.importoAssicurato"
            type="number"
            min={1000}
            step={1000}
            className={`${s.input} ${e?.importoAssicurato ? s.inputError : ""}`}
            {...register("dettagliPolizza.importoAssicurato")}
            placeholder="50000"
          />
          <p className={s.error}>{e?.importoAssicurato?.message}</p>
        </div>

        {/* Durata Anni */}
        <div className={s.field}>
          <label className={s.label} htmlFor="dettagliPolizza.durataAnni">
            Durata (anni)
          </label>
          <input
            id="dettagliPolizza.durataAnni"
            type="number"
            min={1}
            max={50}
            className={`${s.input} ${e?.durataAnni ? s.inputError : ""}`}
            {...register("dettagliPolizza.durataAnni")}
            placeholder="10"
          />
          <p className={s.error}>{e?.durataAnni?.message}</p>
        </div>

        {/* Premio Annuale */}
        <div className={s.field}>
          <label className={s.label} htmlFor="dettagliPolizza.premioAnnuale">
            Premio Annuale (€)
          </label>
          <input
            id="dettagliPolizza.premioAnnuale"
            type="number"
            min={1}
            step={10}
            className={`${s.input} ${e?.premioAnnuale ? s.inputError : ""}`}
            {...register("dettagliPolizza.premioAnnuale")}
            placeholder="1200"
          />
          <p className={s.error}>{e?.premioAnnuale?.message}</p>
        </div>

        {/* Data Decorrenza */}
        <div className={s.field}>
          <label className={s.label} htmlFor="dettagliPolizza.dataDecorrenza">
            Decorrenza
          </label>
          <input
            id="dettagliPolizza.dataDecorrenza"
            type="date"
            className={`${s.input} ${e?.dataDecorrenza ? s.inputError : ""}`}
            {...register("dettagliPolizza.dataDecorrenza")}
          />
          <p className={s.error}>{e?.dataDecorrenza?.message}</p>
        </div>

        {/* Data Scadenza */}
        <div className={s.field}>
          <label className={s.label} htmlFor="dettagliPolizza.dataScadenza">
            Scadenza
          </label>
          <input
            id="dettagliPolizza.dataScadenza"
            type="date"
            className={`${s.input} ${e?.dataScadenza ? s.inputError : ""}`}
            {...register("dettagliPolizza.dataScadenza")}
          />
          <p className={s.error}>
            {e?.dataScadenza?.message || e?.root?.message}
          </p>
        </div>

        {/* Modalità Pagamento */}
        <div className={`${s.field} ${s.fieldFull}`}>
          <label className={s.label} htmlFor="dettagliPolizza.modalitaPagamento">
            Modalità Pagamento
          </label>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            {(["annuale", "semestrale", "trimestrale", "mensile"] as const).map(
              (mod) => (
                <label
                  key={mod}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    cursor: "pointer",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  <input
                    type="radio"
                    value={mod}
                    {...register("dettagliPolizza.modalitaPagamento")}
                  />
                  {mod.charAt(0).toUpperCase() + mod.slice(1)}
                </label>
              ),
            )}
          </div>
          <p className={s.error}>{e?.modalitaPagamento?.message}</p>
        </div>
      </div>

      {/* Riepilogo dinamico */}
      {tipo && (
        <div
          style={{
            marginTop: "var(--space-3)",
            padding: "var(--space-3)",
            background: "var(--color-primary-light)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          <strong>Polizza {tipo}</strong> — riepilogo visibile allo step 5.
        </div>
      )}
    </fieldset>
  );
}
