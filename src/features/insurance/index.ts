export { default as InsurancePage } from "./pages/InsurancePage";
export { InsuranceWizard } from "./components/InsuranceWizard";
export { StepAnagrafici } from "./components/StepAnagrafici";
export { CodiceFiscaleField } from "./components/CodiceFiscaleField";
export { StepBeneficiari } from "./components/StepBeneficiari";
export { StepDettagliPolizza } from "./components/StepDettagliPolizza";
export { StepPin } from "./components/StepPin";
export { StepRiepilogo } from "./components/StepRiepilogo";

export {
  insuranceFormSchema,
  anagraficiSchema,
  beneficiarioSchema,
  pinSchema,
  dettagliPolizzaSchema,
  defaultInsuranceFormValues,
} from "./schemas/insuranceSchema";

export type {
  InsuranceFormData,
  AnagraficiData,
  BeneficiarioData,
  DettagliPolizzaData,
  PinData,
} from "./schemas/insuranceSchema";
