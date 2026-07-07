import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorBoundary from '@/shared/components/GlobalErrorBoundary';
import AppShell from '@/core/layout/AppShell/AppShell';
import { AuthProvider, ThemeProvider } from '@/store';
import { NotificationProvider } from '@/features/notifications';
import ErrorFallback from '@/shared/components/ErrorFallback';
import { ProtectedRoute } from '@/core/routing/ProtectedRoute';

// ── Lazy pages ──────────────────────────────────────────────────────────

// Pubbliche (no AppShell)
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.default }))
);

const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.default }))
);

// Clienti (protette, dentro AppShell)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.default }))
);

const AccountDetailPage = lazy(() =>
  import('@/features/accounts/pages/AccountDetailPage').then((m) => ({ default: m.default }))
);

const InvestmentsPage = lazy(() =>
  import('@/features/investments/pages/InvestmentsPage').then((m) => ({ default: m.default }))
);

const InsurancePage = lazy(() =>
  import('@/features/insurance/pages/InsurancePage').then((m) => ({ default: m.default }))
);

const NewInsurancePage = lazy(() =>
  import('@/features/insurance/pages/NewInsurancePage').then((m) => ({ default: m.default }))
);

// ── Loading ──────────────────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <div
      style={{
        padding: 48,
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}
    >
      Caricamento...
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <Routes>
                {/* ── Area pubblica (no AppShell) ─────────────────── */}
                <Route path="/login" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LoginPage />
                  </Suspense>
                } />

                {/* ── Area clienti (protetta, con AppShell) ───────── */}
                <Route element={
                  <AppShell>
                    <ErrorBoundary
                      FallbackComponent={(props) => <ErrorFallback {...props} title="Errore pagina" />}
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute />
                      </Suspense>
                    </ErrorBoundary>
                  </AppShell>
                }>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
                  <Route path="/investments" element={<InvestmentsPage />} />
                  <Route path="/policies" element={<InsurancePage />} />
                  <Route path="/insurance" element={<NewInsurancePage />} />
                </Route>

                {/* ── Area admin (protetta + ruolo ADMIN) ─────────── */}
                <Route element={
                  <AppShell>
                    <ErrorBoundary
                      FallbackComponent={(props) => <ErrorFallback {...props} title="Errore pagina" />}
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <ProtectedRoute requiredRole="ADMIN" />
                      </Suspense>
                    </ErrorBoundary>
                  </AppShell>
                }>
                  <Route path="/admin/users" element={<div style={{ padding: 24 }}>Admin Users Page</div>} />
                </Route>

                {/* ── Catch-all 404 ────────────────────────────────── */}
                <Route path="*" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <NotFoundPage />
                  </Suspense>
                } />
              </Routes>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
