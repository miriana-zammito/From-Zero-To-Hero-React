import { useAuth } from "@/store";

export default function InsurancePage() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "24px" }}>
      <h1>Polizze Assicurative</h1>
      <p>Gestione polizze in costruzione.</p>
      <p><small>Utente: {user?.name}</small></p>
    </div>
  );
}
