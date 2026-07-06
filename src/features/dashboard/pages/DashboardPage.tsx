import { useCallback } from 'react';
import type { Account, Movement } from '@/types';
import AccountBalanceCard from '@/features/dashboard/components/AccountBalanceCard/AccountBalanceCard';
import TransactionList from '@/features/dashboard/components/TransactionList/TransactionList';
import styles from './DashboardPage.module.css';

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    iban: 'IT60X0542811101000000123456',
    label: 'Conto Corrente',
    balance: 12450.8,
    currency: 'EUR',
    type: 'current',
    accountType: 'PRIVATE',
    status: 'active',
    openedAt: '2020-03-15',
  },
  {
    id: 'acc-2',
    iban: 'IT60X0542811101000000654321',
    label: 'Conto Risparmio',
    balance: 32000.0,
    currency: 'EUR',
    type: 'savings',
    accountType: 'PRIVATE',
    status: 'active',
    openedAt: '2021-07-01',
  },
  {
    id: 'acc-3',
    iban: 'IT60X0542811101000000999888',
    label: 'Conto Business',
    balance: 87500.5,
    currency: 'EUR',
    type: 'current',
    accountType: 'BUSINESS',
    status: 'active',
    openedAt: '2019-11-20',
  },
];

const MOCK_MOVEMENTS: Movement[] = [
  {
    id: 'mov-1',
    accountId: 'acc-1',
    amount: 2500.0,
    currency: 'EUR',
    direction: 'credit',
    description: 'Stipendio marzo',
    category: 'salary',
    status: 'completed',
    executedAt: '2026-03-01T08:00:00Z',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'mov-2',
    accountId: 'acc-1',
    amount: 89.99,
    currency: 'EUR',
    direction: 'debit',
    description: 'Amazon.it',
    category: 'shopping',
    status: 'completed',
    executedAt: '2026-02-28T14:30:00Z',
    createdAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'mov-3',
    accountId: 'acc-1',
    amount: 45.5,
    currency: 'EUR',
    direction: 'debit',
    description: 'Ristorante La Specola',
    category: 'food',
    status: 'completed',
    executedAt: '2026-02-27T20:15:00Z',
    createdAt: '2026-02-27T20:15:00Z',
  },
  {
    id: 'mov-4',
    accountId: 'acc-1',
    amount: 120.0,
    currency: 'EUR',
    direction: 'debit',
    description: 'Bolletta ENEL',
    category: 'utilities',
    status: 'pending',
    executedAt: '2026-03-05T10:00:00Z',
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'mov-5',
    accountId: 'acc-2',
    amount: 1500.0,
    currency: 'EUR',
    direction: 'credit',
    description: 'Bonifico da Mario Rossi',
    category: 'transfer',
    status: 'completed',
    executedAt: '2026-02-25T09:00:00Z',
    createdAt: '2026-02-25T09:00:00Z',
  },
];

export default function DashboardPage() {
  const handleViewTransactions = useCallback((accountId: string) => {
    console.log('Visualizza movimenti per conto:', accountId);
  }, []);

  const handleRefreshBalance = useCallback(async (accountId: string) => {
    console.log('Aggiornamento saldo per conto:', accountId);
    await new Promise((r) => setTimeout(r, 1000));
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      <section className={styles.cards}>
        {MOCK_ACCOUNTS.map((acc) => (
          <AccountBalanceCard
            key={acc.id}
            account={acc}
            onViewTransactions={handleViewTransactions}
            onRefreshBalance={handleRefreshBalance}
          />
        ))}
      </section>

      <section className={styles.movements}>
        <h2 className={styles.sectionTitle}>Movimenti recenti</h2>
        <TransactionList movements={MOCK_MOVEMENTS} />
      </section>
    </div>
  );
}
