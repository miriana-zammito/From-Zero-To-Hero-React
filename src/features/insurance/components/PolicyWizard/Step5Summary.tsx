// === Step 5: Summary — watch() + submit finale ===
import { useFormContext, useWatch } from "react-hook-form";
import type { PolicyFormData } from "./schemas";
import s from "../StepForm.module.css";

const RELATIONSHIP_LABELS: Record<string, string> = {
  coniuge: "Coniuge",
  figlio: "Figlio",
  genitore: "Genitore",
  fratello: "Fratello",
  sorella: "Sorella",
  altro: "Altro",
};

const POLICY_TYPE_LABELS: Record<string, string> = {
  vita: "Vita",
  infortuni: "Infortuni",
  malattia: "Malattia",
};

const EURO = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export function Step5Summary() {
  const { formState } = useFormContext<PolicyFormData>();

  const data = useWatch<PolicyFormData>() as PolicyFormData;

  return (
    <fieldset className={s.fieldset}>
      {/* Personal Data */}
      <div className={s.riepilogoSection}>
        <h3>Personal Data</h3>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Name</span>
          <span className={s.riepilogoValue}>{data.personalData?.firstName} {data.personalData?.lastName}</span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Email</span>
          <span className={s.riepilogoValue}>{data.personalData?.email}</span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Birth Date</span>
          <span className={s.riepilogoValue}>{data.personalData?.birthDate}</span>
        </div>
      </div>

      {/* Beneficiaries */}
      <div className={s.riepilogoSection}>
        <h3>Beneficiaries</h3>
        {data.beneficiaries?.length > 0 ? (
          data.beneficiaries.map((b, i) => (
            <div key={i} className={s.riepilogoRow}>
              <span className={s.riepilogoLabel}>
                {i + 1}. {b.name} ({RELATIONSHIP_LABELS[b.relationship] ?? b.relationship})
              </span>
              <span className={s.riepilogoValue}>{b.percentage}%</span>
            </div>
          ))
        ) : (
          <p className={s.riepilogoLabel}>No beneficiaries added</p>
        )}
      </div>

      {/* Policy Details */}
      <div className={s.riepilogoSection}>
        <h3>Policy Details</h3>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Type</span>
          <span className={s.riepilogoValue}>{POLICY_TYPE_LABELS[data.policyDetails?.type] ?? data.policyDetails?.type}</span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Coverage</span>
          <span className={s.riepilogoValue}>{EURO.format(data.policyDetails?.coverageAmount ?? 0)}</span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>CF</span>
          <span className={s.riepilogoValue}>{data.policyDetails?.cf}</span>
        </div>
      </div>

      {/* PIN (nascosto) */}
      <div className={s.riepilogoSection}>
        <h3>Security</h3>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>PIN</span>
          <span className={s.riepilogoValue}>••••••</span>
        </div>
      </div>

      {/* Errori riepilogo */}
      {formState.errors.beneficiaries && (
        <p className={s.error} role="alert">
          {formState.errors.beneficiaries.message ?? "Check beneficiaries"}
        </p>
      )}
    </fieldset>
  );
}
