// === InsuranceWizard — FormProvider padre con navigazione step ===
import { useState, useCallback, type PropsWithChildren } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insuranceFormSchema,
  type InsuranceFormData,
  defaultInsuranceFormValues,
} from "../schemas/insuranceSchema";
import { StepAnagrafici } from "./StepAnagrafici";
import { StepBeneficiari } from "./StepBeneficiari";
import { StepDettagliPolizza } from "./StepDettagliPolizza";
import { StepPin } from "./StepPin";
import { StepRiepilogo } from "./StepRiepilogo";
import styles from "./InsuranceWizard.module.css";

// ── Step labels ─────────────────────────────────────────────────────
const STEPS = [
  "Anagrafici",
  "Beneficiari",
  "Dettagli Polizza",
  "PIN",
  "Riepilogo",
] as const;

// Campi da validare per step (trigger valida solo questi)
const STEP_FIELDS: Record<number, (keyof InsuranceFormData)[]> = {
  0: ["anagrafici"],
  1: ["beneficiari"],
  2: ["dettagliPolizza"],
  3: ["pin"],
  4: [],
};

// ── Componente ──────────────────────────────────────────────────────

export function InsuranceWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState<InsuranceFormData | null>(null);

  const methods = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: defaultInsuranceFormValues,
    mode: "onBlur",
  });

  const { trigger, handleSubmit, formState } = methods;

  const goToStep = useCallback(
    async (step: number) => {
      if (step < 0 || step >= STEPS.length) return;

      if (step > currentStep) {
        const fields = STEP_FIELDS[currentStep] as (keyof InsuranceFormData)[];
        const isValid = await trigger(fields);
        if (!isValid) return;
      }

      setCurrentStep(step);
    },
    [currentStep, trigger],
  );

  const nextStep = useCallback(
    () => goToStep(currentStep + 1),
    [currentStep, goToStep],
  );
  const prevStep = useCallback(
    () => goToStep(currentStep - 1),
    [currentStep, goToStep],
  );

  const onSubmit = useCallback((data: InsuranceFormData) => {
    setSubmitted(data);
    console.log("✅ Polizza inviata:", data);
  }, []);

  // ── Render step corrente ──────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepAnagrafici />;
      case 1:
        return <StepBeneficiari />;
      case 2:
        return <StepDettagliPolizza />;
      case 3:
        return <StepPin />;
      case 4:
        return <StepRiepilogo />;
      default:
        return null;
    }
  };

  // ── Schermata di conferma ─────────────────────────────────────────

  if (submitted) {
    return (
      <div className={styles.success}>
        <h2>✅ Polizza presentata con successo!</h2>
        <p className={styles.successId}>
          Codice pratica: <strong>POL-{Date.now().toString(36).toUpperCase()}</strong>
        </p>
        <pre className={styles.successData}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => {
            setSubmitted(null);
            setCurrentStep(0);
            methods.reset(defaultInsuranceFormValues);
          }}
        >
          Nuova polizza
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.wizard} noValidate>
        {/* ── Stepper ─────────────────────────────────────────────── */}
        <nav className={styles.stepper} aria-label="Avanzamento polizza">
          {STEPS.map((label, i) => (
            <button
              type="button"
              key={label}
              className={`${styles.stepDot} ${i === currentStep ? styles.active : ""} ${i < currentStep ? styles.completed : ""}`}
              onClick={() => goToStep(i)}
              disabled={i > currentStep + 1}
              aria-current={i === currentStep ? "step" : undefined}
            >
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepLabel}>{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Contenuto step ──────────────────────────────────────── */}
        <div className={styles.content}>
          <h2 className={styles.stepTitle}>
            Step {currentStep + 1}: {STEPS[currentStep]}
          </h2>
          {renderStep()}
        </div>

        {/* ── Errori globali ──────────────────────────────────────── */}
        {Object.keys(formState.errors).length > 0 && (
          <div className={styles.globalErrors}>
            {Object.entries(formState.errors).map(([key, err]) => (
              <p key={key} className={styles.globalError}>
                {err?.message as string}
              </p>
            ))}
          </div>
        )}

        {/* ── Navigazione ─────────────────────────────────────────── */}
        <div className={styles.navButtons}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={styles.btnSecondary}
          >
            ← Indietro
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button type="button" onClick={nextStep} className={styles.btnPrimary}>
              Avanti →
            </button>
          ) : (
            <button type="submit" className={styles.btnPrimary}>
              Invia Polizza
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
