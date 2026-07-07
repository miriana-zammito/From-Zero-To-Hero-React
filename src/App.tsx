import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorBoundary from '@/shared/components/GlobalErrorBoundary';
import AppShell from '@/core/layout/AppShell/AppShell';
import { AuthProvider, ThemeProvider } from '@/store';
import { NotificationProvider } from '@/features/notifications';
import ErrorFallback from '@/shared/components/ErrorFallback';

const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({
    default: m.default,
  }))
);

const InvestmentsPage = lazy(() =>
  import('@/features/investments/pages/InvestmentsPage').then((m) => ({
    default: m.default,
  }))
);

const InsurancePage = lazy(() =>
  import('@/features/insurance/pages/InsurancePage').then((m) => ({
    default: m.default,
  }))
);

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

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <AppShell>
                <ErrorBoundary
                  FallbackComponent={(props) => <ErrorFallback {...props} title="Errore pagina" />}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/investments" element={<InvestmentsPage />} />
                      <Route path="/policies" element={<InsurancePage />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </AppShell>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
