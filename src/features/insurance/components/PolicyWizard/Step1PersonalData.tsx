// === Step 1: Personal Data ===
import { useFormContext } from "react-hook-form";
import type { PolicyFormData } from "./schemas";
import s from "../StepForm.module.css";

export function Step1PersonalData() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PolicyFormData>();

  const e = errors.personalData;

  return (
    <fieldset className={s.fieldset}>
      <div className={s.grid2}>
        {/* First Name */}
        <div className={s.field}>
          <label className={s.label} htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            className={`${s.input} ${e?.firstName ? s.inputError : ""}`}
            {...register("personalData.firstName")}
            placeholder="Mario"
          />
          <p className={s.error}>{e?.firstName?.message}</p>
        </div>

        {/* Last Name */}
        <div className={s.field}>
          <label className={s.label} htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            className={`${s.input} ${e?.lastName ? s.inputError : ""}`}
            {...register("personalData.lastName")}
            placeholder="Rossi"
          />
          <p className={s.error}>{e?.lastName?.message}</p>
        </div>

        {/* Email */}
        <div className={s.field}>
          <label className={s.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={`${s.input} ${e?.email ? s.inputError : ""}`}
            {...register("personalData.email")}
            placeholder="mario.rossi@email.it"
          />
          <p className={s.error}>{e?.email?.message}</p>
        </div>

        {/* Birth Date */}
        <div className={s.field}>
          <label className={s.label} htmlFor="birthDate">Birth Date</label>
          <input
            id="birthDate"
            type="date"
            className={`${s.input} ${e?.birthDate ? s.inputError : ""}`}
            {...register("personalData.birthDate")}
          />
          <p className={s.error}>{e?.birthDate?.message}</p>
        </div>
      </div>
    </fieldset>
  );
}
