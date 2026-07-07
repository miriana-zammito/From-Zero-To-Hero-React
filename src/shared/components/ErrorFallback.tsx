import type { FallbackProps } from "react-error-boundary";

interface ErrorFallbackProps extends FallbackProps {
  title?: string;
}

const cardStyle: React.CSSProperties = {
  padding: "var(--space-6)",
  border: "1px solid var(--color-danger)",
  borderRadius: "var(--radius-lg)",
  background: "var(--color-danger-bg)",
  color: "var(--color-danger)",
  fontFamily: "var(--font-sans)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "var(--font-size-lg)",
  fontWeight: 700,
  marginBottom: "var(--space-2)",
};

const preStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  fontSize: "var(--font-size-sm)",
  marginBottom: "var(--space-4)",
  color: "var(--color-text)",
  lineHeight: 1.5,
};

const btnStyle: React.CSSProperties = {
  padding: "var(--space-2) var(--space-4)",
  fontSize: "var(--font-size-sm)",
  fontWeight: 600,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-danger)",
  cursor: "pointer",
  background: "transparent",
  color: "var(--color-danger)",
  transition: "background var(--transition-fast), color var(--transition-fast)",
};

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <div role="alert" style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <pre style={preStyle}>
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <button
        onClick={resetErrorBoundary}
        style={btnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-danger)";
          e.currentTarget.style.color = "var(--color-white)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-danger)";
        }}
      >
        Riprova
      </button>
    </div>
  );
}
