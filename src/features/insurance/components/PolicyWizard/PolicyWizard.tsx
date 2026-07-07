// === PolicyWizard — parent con FormProvider, step 1-5 ===
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { policyFormSchema, type PolicyFormData, defaultPolicyFormValues } from './schemas';
import { Step1PersonalData } from './Step1PersonalData';
import { Step2Beneficiaries } from './Step2Beneficiaries';
import { Step3PolicyDetails } from './Step3PolicyDetails';
import { Step4PinConfirm } from './Step4PinConfirm';
import { Step5Summary } from './Step5Summary';
import styles from '../InsuranceWizard.module.css';

// ── Step labels ───────────────────────────────────────────────────────
const STEPS = ['Personal Data', 'Beneficiaries', 'Policy Details', 'PIN', 'Summary'] as const;

// Campi da validare per step
const STEP_FIELDS: Record<number, (keyof PolicyFormData)[]> = {
  0: ['personalData'],
  1: ['beneficiaries'],
  2: ['policyDetails'],
  3: ['pinConfirmation'],
  4: [],
};

// ── Component ─────────────────────────────────────────────────────────

export function PolicyWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState<{ data: PolicyFormData; code: string } | null>(null);

  const methods = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: defaultPolicyFormValues,
    mode: 'onBlur',
  });

  const {
    trigger,
    handleSubmit,
    formState,
    formState: { errors },
  } = methods;

  // ── Step touched tracking ───────────────────────────────────────────
  // "touched" = user attempted to advance → validation ran for this step
  const [stepTouched, setStepTouched] = useState<Record<number, boolean>>({});

  // Has current step any errors in its registered fields?
  const hasCurrentStepErrors = useMemo(() => {
    const fields = STEP_FIELDS[currentStep];
    return fields.some((key) => errors[key] !== undefined);
  }, [currentStep, errors]);

  // Auto-trigger validation on step mount so Next button state is accurate
  useEffect(() => {
    const fields = STEP_FIELDS[currentStep];
    if (fields.length === 0) return;
    trigger(fields);
  }, [currentStep, trigger]);

  // ── Navigation ──────────────────────────────────────────────────────

  const goToStep = useCallback(
    async (step: number) => {
      if (step < 0 || step >= STEPS.length) return;

      if (step > currentStep) {
        setStepTouched((prev) => ({ ...prev, [currentStep]: true }));
        const fields = STEP_FIELDS[currentStep] as (keyof PolicyFormData)[];
        const isValid = await trigger(fields);
        if (!isValid) return;
      }

      setCurrentStep(step);
    },
    [currentStep, trigger]
  );

  const nextStep = useCallback(() => {
    setStepTouched((prev) => ({ ...prev, [currentStep]: true }));
    const fields = STEP_FIELDS[currentStep] as (keyof PolicyFormData)[];
    trigger(fields).then((valid) => {
      if (valid) setCurrentStep((c) => c + 1);
    });
  }, [currentStep, trigger]);

  const prevStep = useCallback(() => {
    setCurrentStep((c) => Math.max(0, c - 1));
  }, []);

  const onSubmit = useCallback((data: PolicyFormData) => {
    const code = `POL-${Date.now().toString(36).toUpperCase()}`;
    setSubmitted({ data, code });
    console.log('✅ Policy submitted:', data);
  }, []);

  // ── Is Next disabled? ───────────────────────────────────────────────
  const isNextDisabled =
    STEP_FIELDS[currentStep].length > 0 && stepTouched[currentStep] && hasCurrentStepErrors;

  // ── Render step corrente ────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1PersonalData />;
      case 1:
        return <Step2Beneficiaries />;
      case 2:
        return <Step3PolicyDetails />;
      case 3:
        return <Step4PinConfirm />;
      case 4:
        return <Step5Summary />;
      default:
        return null;
    }
  };

  // ── Schermata di conferma ───────────────────────────────────────────

  if (submitted) {
    return (
      <div className={styles.success}>
        <h2>✅ Policy submitted successfully!</h2>
        <p className={styles.successId}>
          Policy code: <strong>{submitted.code}</strong>
        </p>
        <pre className={styles.successData}>{JSON.stringify(submitted.data, null, 2)}</pre>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => {
            setSubmitted(null);
            setCurrentStep(0);
            setStepTouched({});
            methods.reset(defaultPolicyFormValues);
          }}
        >
          New Policy
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.wizard} noValidate>
        {/* ── Progress bar ──────────────────────────────────────────── */}
        <p className={styles.progressLabel}>
          Step {currentStep + 1} / {STEPS.length}
        </p>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* ── Stepper ───────────────────────────────────────────────── */}
        <nav className={styles.stepper} aria-label="Policy progress">
          {STEPS.map((label, i) => (
            <button
              type="button"
              key={label}
              className={`${styles.stepDot} ${i === currentStep ? styles.active : ''} ${i < currentStep ? styles.completed : ''}`}
              onClick={() => goToStep(i)}
              disabled={i > currentStep + 1}
              aria-current={i === currentStep ? 'step' : undefined}
            >
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepLabel}>{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Contenuto step ────────────────────────────────────────── */}
        <div className={styles.content}>
          <h2 className={styles.stepTitle}>
            Step {currentStep + 1}: {STEPS[currentStep]}
          </h2>
          {renderStep()}
        </div>

        {/* ── Errori globali ────────────────────────────────────────── */}
        {Object.keys(formState.errors).length > 0 && (
          <div className={styles.globalErrors}>
            {Object.entries(formState.errors).map(([key, err]) => (
              <p key={key} className={styles.globalError}>
                {err?.message as string}
              </p>
            ))}
          </div>
        )}

        {/* ── Navigazione ───────────────────────────────────────────── */}
        <div className={styles.navButtons}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={styles.btnSecondary}
          >
            ← Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isNextDisabled}
              className={styles.btnPrimary}
            >
              Next →
            </button>
          ) : (
            <button type="submit" className={styles.btnPrimary}>
              Submit Policy
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
