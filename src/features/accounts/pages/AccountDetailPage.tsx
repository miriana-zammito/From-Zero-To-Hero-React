// === AccountDetailPage — useParams + useApi + breadcrumb ===
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "@/hooks";
import type { Account } from "@/types";

export default function AccountDetailPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  // Guard: se accountId mancante → redirect
  if (!accountId) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const { data: account, isLoading, error } = useApi<Account>(
    `/api/accounts/${accountId}`,
  );

  if (isLoading) {
    return (
      <div style={{ padding: 24, color: "var(--color-text-secondary)" }}>
        Caricamento conto...
      </div>
    );
  }

  if (error || !account) {
    return (
      <div style={{ padding: 24 }}>
        <p
          style={{
            color: "var(--color-danger, #c00)",
            fontSize: "0.875rem",
          }}
          role="alert"
        >
          {error?.message ?? "Conto non trovato"}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            background: "transparent",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Torna alla Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "var(--font-sans, sans-serif)" }}>
      {/* Breadcrumb */}
      <nav
        style={{
          fontSize: "0.8125rem",
          color: "var(--color-text-secondary)",
          marginBottom: 24,
        }}
      >
        <Link
          to="/dashboard"
          style={{ color: "var(--color-primary)", textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <span style={{ margin: "0 8px" }}>&gt;</span>
        <span>Conto {account.iban}</span>
      </nav>

      {/* Intestazione conto */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
            margin: "0 0 8px",
          }}
        >
          {account.name ?? account.iban}
        </h1>
        <p
          style={{
            fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
            fontSize: "0.8125rem",
            color: "var(--color-muted)",
            margin: "0 0 16px",
          }}
        >
          {account.iban}
        </p>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          {account.balance?.toLocaleString("it-IT", {
            style: "currency",
            currency: "EUR",
          }) ?? "N/D"}
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          background: "transparent",
          color: "var(--color-text-secondary)",
          border: "1px solid var(--color-border)",
        }}
      >
        ← Torna indietro
      </button>
    </div>
  );
}
