import { PolicyWizard } from "../components/PolicyWizard/PolicyWizard";

export default function NewInsurancePage() {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "var(--space-5)" }}>New Insurance Policy</h1>
      <PolicyWizard />
    </div>
  );
}
