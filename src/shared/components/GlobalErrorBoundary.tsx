import { Component, type ErrorInfo, type ReactNode } from "react";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const cardStyle: React.CSSProperties = {
  padding: "var(--space-10)",
  maxWidth: 560,
  margin: "80px auto",
  border: "2px solid var(--color-danger)",
  borderRadius: "var(--radius-xl)",
  background: "var(--color-danger-bg)",
  fontFamily: "var(--font-sans)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "var(--font-size-2xl)",
  fontWeight: 700,
  marginBottom: "var(--space-2)",
  color: "var(--color-danger)",
};

const preStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  fontSize: "var(--font-size-sm)",
  marginBottom: "var(--space-5)",
  color: "var(--color-text)",
  lineHeight: 1.6,
};

const btnStyle: React.CSSProperties = {
  padding: "var(--space-2) var(--space-5)",
  fontSize: "var(--font-size-sm)",
  fontWeight: 600,
  borderRadius: "var(--radius-md)",
  border: "none",
  cursor: "pointer",
  background: "var(--color-primary)",
  color: "var(--color-white)",
  transition: "opacity var(--transition-fast)",
};

export default class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      "[GlobalErrorBoundary] Uncaught error:",
      error,
      info.componentStack,
    );
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" style={cardStyle}>
          <h1 style={titleStyle}>Qualcosa è andato storto</h1>
          <pre style={preStyle}>
            {this.state.error?.message ?? "Errore sconosciuto"}
          </pre>
          <button
            onClick={this.handleReset}
            style={btnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Riprova
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
