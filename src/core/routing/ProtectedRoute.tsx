// === ProtectedRoute — auth guard + role check ===
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store";

interface ProtectedRouteProps {
  requiredRole?: "CUSTOMER" | "ADMIN";
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();

  // Loading: spinner, non redirigere
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <span>Caricamento...</span>
        </div>
      </div>
    );
  }

  // Non autenticato → redirect a /login con state.from
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check: se requiredRole non matcha → redirect a /dashboard
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={user} />;
}
