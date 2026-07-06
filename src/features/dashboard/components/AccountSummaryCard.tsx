import { useCallback, useEffect, useRef, useState } from 'react';
import type { Account } from '@/types';
import styles from './AccountSummaryCard.module.css';

interface AccountSummaryCardProps {
  account: Account;
}

const BALANCE_FORMATTER = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

function truncateIban(iban: string): string {
  if (iban.length <= 12) return iban;
  return `${iban.slice(0, 10)}...${iban.slice(-4)}`;
}

export default function AccountSummaryCard({ account }: AccountSummaryCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(account.balance);

  /* Simula variazione saldo ogni 30s */
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentBalance((prev) => {
        const delta = Math.round((Math.random() - 0.5) * 20 * 100) / 100;
        return prev + delta;
      });
    }, 30_000);

    return () => clearInterval(id);
  }, []);

  /* Pulsante refresh: loading 1s */
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, 1_000);
  }, [isRefreshing]);

  /* Cleanup timeout su unmount */
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  const formattedBalance = BALANCE_FORMATTER.format(currentBalance);

  return (
    <article className={styles.card} aria-label={`Riepilogo conto ${account.label}`}>
      <div className={styles.top}>
        <h3 className={styles.name}>{account.label}</h3>
        <span
          className={`${styles.badge} ${account.accountType === 'BUSINESS' ? styles.business : styles.private}`}
          aria-label={`Tipo conto ${account.accountType}`}
        >
          {account.accountType}
        </span>
      </div>

      <p className={styles.balance} aria-label={`Saldo ${formattedBalance}`}>
        {formattedBalance}
      </p>

      <p className={styles.iban} title={account.iban} aria-label={`IBAN ${account.iban}`}>
        {truncateIban(account.iban)}
      </p>

      <button
        type="button"
        className={styles.refreshBtn}
        onClick={handleRefresh}
        disabled={isRefreshing}
        aria-label={`Aggiorna saldo conto ${account.label}`}
      >
        {isRefreshing ? 'Aggiornamento...' : '\u{1F504} Aggiorna'}
      </button>
    </article>
  );
}
