// === NotFoundPage — catch-all 404 ===
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "var(--font-sans, sans-serif)",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: "var(--color-primary)",
          margin: "0 0 8px",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text-secondary)",
          margin: "0 0 24px",
        }}
      >
        Pagina non trovata
      </p>
      <Link
        to="/dashboard"
        style={{
          padding: "10px 24px",
          borderRadius: 8,
          fontSize: "0.875rem",
          fontWeight: 600,
          background: "var(--color-primary)",
          color: "var(--color-white, #fff)",
          textDecoration: "none",
        }}
      >
        Torna alla Dashboard
      </Link>
    </div>
  );
}
