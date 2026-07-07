// === Step 1: Anagrafici ===
import { useFormContext } from "react-hook-form";
import type { InsuranceFormData } from "../schemas/insuranceSchema";
import { CodiceFiscaleField } from "./CodiceFiscaleField";
import s from "./StepForm.module.css";

export function StepAnagrafici() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InsuranceFormData>();

  const e = errors.anagrafici;

  return (
    <fieldset className={s.fieldset}>
      <div className={s.grid2}>
        {/* Nome */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.nome">
            Nome
          </label>
          <input
            id="anagrafici.nome"
            className={`${s.input} ${e?.nome ? s.inputError : ""}`}
            {...register("anagrafici.nome")}
            placeholder="Mario"
          />
          <p className={s.error}>{e?.nome?.message}</p>
        </div>

        {/* Cognome */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.cognome">
            Cognome
          </label>
          <input
            id="anagrafici.cognome"
            className={`${s.input} ${e?.cognome ? s.inputError : ""}`}
            {...register("anagrafici.cognome")}
            placeholder="Rossi"
          />
          <p className={s.error}>{e?.cognome?.message}</p>
        </div>

        {/* Codice Fiscale (con validazione asincrona) */}
        <CodiceFiscaleField />

        {/* Data Nascita */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.dataNascita">
            Data Nascita
          </label>
          <input
            id="anagrafici.dataNascita"
            type="date"
            className={`${s.input} ${e?.dataNascita ? s.inputError : ""}`}
            {...register("anagrafici.dataNascita")}
          />
          <p className={s.error}>{e?.dataNascita?.message}</p>
        </div>

        {/* Sesso */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.sesso">
            Sesso
          </label>
          <select
            id="anagrafici.sesso"
            className={`${s.select} ${e?.sesso ? s.inputError : ""}`}
            {...register("anagrafici.sesso")}
          >
            <option value="">Seleziona…</option>
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
          </select>
          <p className={s.error}>{e?.sesso?.message}</p>
        </div>

        {/* Comune Nascita */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.comuneNascita">
            Comune di Nascita
          </label>
          <input
            id="anagrafici.comuneNascita"
            className={`${s.input} ${e?.comuneNascita ? s.inputError : ""}`}
            {...register("anagrafici.comuneNascita")}
            placeholder="Roma"
          />
          <p className={s.error}>{e?.comuneNascita?.message}</p>
        </div>

        {/* Provincia Nascita */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.provinciaNascita">
            Provincia
          </label>
          <input
            id="anagrafici.provinciaNascita"
            className={`${s.input} ${e?.provinciaNascita ? s.inputError : ""}`}
            {...register("anagrafici.provinciaNascita")}
            placeholder="RM"
            maxLength={2}
            style={{ textTransform: "uppercase" }}
          />
          <p className={s.error}>{e?.provinciaNascita?.message}</p>
        </div>

        {/* Indirizzo */}
        <div className={`${s.field} ${s.fieldFull}`}>
          <label className={s.label} htmlFor="anagrafici.indirizzoResidenza">
            Indirizzo Residenza
          </label>
          <input
            id="anagrafici.indirizzoResidenza"
            className={`${s.input} ${e?.indirizzoResidenza ? s.inputError : ""}`}
            {...register("anagrafici.indirizzoResidenza")}
            placeholder="Via Roma 1, 00100 Roma"
          />
          <p className={s.error}>{e?.indirizzoResidenza?.message}</p>
        </div>

        {/* Telefono */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.telefono">
            Telefono
          </label>
          <input
            id="anagrafici.telefono"
            type="tel"
            className={`${s.input} ${e?.telefono ? s.inputError : ""}`}
            {...register("anagrafici.telefono")}
            placeholder="+391234567890"
          />
          <p className={s.error}>{e?.telefono?.message}</p>
        </div>

        {/* Email */}
        <div className={s.field}>
          <label className={s.label} htmlFor="anagrafici.email">
            Email
          </label>
          <input
            id="anagrafici.email"
            type="email"
            className={`${s.input} ${e?.email ? s.inputError : ""}`}
            {...register("anagrafici.email")}
            placeholder="mario.rossi@email.it"
          />
          <p className={s.error}>{e?.email?.message}</p>
        </div>
      </div>
    </fieldset>
  );
}
