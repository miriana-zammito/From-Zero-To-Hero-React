import { useCallback, useState } from "react";
import type { Account } from "@/types";
import styles from "./AccountBalanceCard.module.css";

interface AccountBalanceCardProps {
  account: Account;
  onViewTransactions: (accountId: string) => void;
  onRefreshBalance: (accountId: string) => Promise<void> | void;
}

export default function AccountBalanceCard({
  account,
  onViewTransactions,
  onRefreshBalance,
}: AccountBalanceCardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const formattedBalance = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: account.currency,
  }).format(account.balance);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefreshBalance(account.id);
    } finally {
      setRefreshing(false);
    }
  }, [account.id, onRefreshBalance]);

  const handleViewTransactions = useCallback(() => {
    onViewTransactions(account.id);
  }, [account.id, onViewTransactions]);

  const badgeClass =
    account.accountType === "BUSINESS" ? styles.business : styles.private;

  return (
    <article className={styles.card} aria-label={`Conto ${account.label}`}>
      <div className={styles.header}>
        <h3 className={styles.label}>{account.label}</h3>
        <span className={`${styles.badge} ${badgeClass}`} aria-label={`Tipo conto ${account.accountType}`}>
          {account.accountType}
        </span>
      </div>

      <p className={styles.balance} aria-label={`Saldo ${formattedBalance}`}>
        {formattedBalance}
      </p>

      <p className={styles.iban} aria-label={`IBAN ${account.iban}`}>
        {account.iban}
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label={`Aggiorna saldo conto ${account.label}`}
        >
          {refreshing ? "Aggiornamento..." : "Aggiorna saldo"}
        </button>
        <button
          type="button"
          className={styles.movementsBtn}
          onClick={handleViewTransactions}
          aria-label={`Visualizza movimenti conto ${account.label}`}
        >
          Movimenti
        </button>
      </div>
    </article>
  );
}
