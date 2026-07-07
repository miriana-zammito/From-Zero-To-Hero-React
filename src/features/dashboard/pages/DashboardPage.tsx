import { useCallback } from 'react';
import { useApi } from '@/hooks';
import type { Account, Movement } from '@/types';
import AccountBalanceCard from '@/features/dashboard/components/AccountBalanceCard/AccountBalanceCard';
import TransactionList from '@/features/dashboard/components/TransactionList/TransactionList';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const {
    data: accounts,
    isLoading: accLoading,
    error: accError,
    refetch: refetchAccounts,
  } = useApi<Account[]>('/api/accounts');

  const {
    data: movements,
    isLoading: movLoading,
  } = useApi<Movement[]>('/api/movements');

  const handleRefreshBalance = useCallback(() => {
    refetchAccounts();
  }, [refetchAccounts]);

  // ── Loading ────────────────────────────────────────────────
  if (accLoading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Dashboard</h1>
        <section className={styles.cards} aria-busy="true" aria-label="Caricamento conti">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skelLabel} />
              <div className={styles.skelBalance} />
              <div className={styles.skelIban} />
              <div className={styles.skelActions}>
                <div className={styles.skelBtn} />
                <div className={styles.skelBtn} />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (accError) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Dashboard</h1>
        <section className={styles.centerMessage}>
          <p role="alert" className={styles.errorText}>
            {accError.message}
          </p>
          <button type="button" className={styles.retryBtn} onClick={refetchAccounts}>
            Riprova
          </button>
        </section>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      {(!accounts || accounts.length === 0) ? (
        <section className={styles.centerMessage}>
          <p className={styles.emptyText}>Nessun conto disponibile.</p>
        </section>
      ) : (
        <section className={styles.cards}>
          {accounts.map((acc) => (
            <AccountBalanceCard
              key={acc.id}
              account={acc}
              onRefreshBalance={handleRefreshBalance}
            />
          ))}
        </section>
      )}

      <section className={styles.movements}>
        <h2 className={styles.sectionTitle}>Movimenti recenti</h2>
        <TransactionList movements={movements ?? []} isLoading={movLoading} />
      </section>
    </div>
  );
}
