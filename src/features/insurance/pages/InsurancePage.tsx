import { InsuranceWizard } from "../components/InsuranceWizard";

export default function InsurancePage() {
  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "var(--space-5)" }}>Nuova Polizza Assicurativa</h1>
      <InsuranceWizard />
    </div>
  );
}
