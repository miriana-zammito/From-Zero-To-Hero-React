// === LoginPage — mock login con redirect-back ===
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("mario.rossi@email.it");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  // Se già autenticato, reindirizza subito
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from
      ?.pathname || "/dashboard";
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email e password obbligatorie");
      return;
    }

    try {
      await login(email, password);
      // Dopo login OK, redirect a from oppure dashboard
      const from = (location.state as { from?: { pathname: string } })?.from
        ?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch {
      setError("Credenziali non valide");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--color-bg)",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 32,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
        }}
      >
        <h1
          style={{
            margin: "0 0 24px",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
            textAlign: "center",
          }}
        >
          Accedi
        </h1>

        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: "0.875rem",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              boxSizing: "border-box",
            }}
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: "0.875rem",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              boxSizing: "border-box",
            }}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p
            role="alert"
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-danger, #c00)",
              margin: "0 0 16px",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: isLoading ? "not-allowed" : "pointer",
            background: "var(--color-primary)",
            color: "var(--color-white, #fff)",
            border: "none",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>
    </div>
  );
}
