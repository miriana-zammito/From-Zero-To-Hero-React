import { useCallback, useState } from "react";
import { useApi } from "@/hooks";
import type { Account, Movement } from "@/types";
import styles from "./AccountBalanceCard.module.css";

interface AccountBalanceCardProps {
  account: Account;
  onRefreshBalance?: () => void;
}

export default function AccountBalanceCard({
  account,
  onRefreshBalance,
}: AccountBalanceCardProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [showMovements, setShowMovements] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const {
    data: movements,
    isLoading: movLoading,
    error: movError,
    refetch: refetchMovements,
  } = useApi<Movement[]>(
    expanded ? `/api/movements?accountId=${account.id}` : "",
  );

  const formattedBalance = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(account.balance);

  const handleRefresh = useCallback(async () => {
    if (!onRefreshBalance) return;
    setRefreshing(true);
    try {
      onRefreshBalance();
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshBalance]);

  const handleViewMovements = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      setShowMovements(true);
    } else {
      setShowMovements((prev) => !prev);
    }
  }, [expanded]);

  const badgeClass =
    account.type === "BUSINESS" ? styles.business : styles.private;

  return (
    <article className={styles.card} aria-label={`Conto ${account.name}`}>
      <div className={styles.header}>
        <h3 className={styles.label}>{account.name}</h3>
        <span
          className={`${styles.badge} ${badgeClass}`}
          aria-label={`Tipo conto ${account.type}`}
        >
          {account.type}
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
          aria-label={`Aggiorna saldo conto ${account.name}`}
        >
          {refreshing ? "Aggiornamento..." : "Aggiorna saldo"}
        </button>
        <button
          type="button"
          className={styles.movementsBtn}
          onClick={handleViewMovements}
          aria-expanded={showMovements}
          aria-controls={`movements-${account.id}`}
          aria-label={`Visualizza movimenti conto ${account.name}`}
        >
          {showMovements ? "Nascondi movimenti" : "Vedi movimenti"}
        </button>
      </div>

      {/* Movimenti inline */}
      {showMovements && (
        <div id={`movements-${account.id}`} className={styles.movementsList}>
          {movLoading && (
            <p className={styles.movLoading} aria-busy="true">
              Caricamento movimenti…
            </p>
          )}

          {movError && (
            <p role="alert" className={styles.movError}>
              {movError.message}
              <button
                type="button"
                className={styles.movRetryBtn}
                onClick={refetchMovements}
              >
                Riprova
              </button>
            </p>
          )}

          {!movLoading && !movError && movements && movements.length === 0 && (
            <p className={styles.movEmpty}>Nessun movimento per questo conto.</p>
          )}

          {!movLoading && !movError && movements && movements.length > 0 && (
            <ul className={styles.movListSimple}>
              {movements.map((mov: Movement) => (
                <li key={mov.id} className={styles.movItemSimple}>
                  <span className={styles.movDescSimple}>{mov.description}</span>
                  <span className={mov.type === "CREDIT" ? styles.movCredit : styles.movDebit}>
                    {mov.type === "CREDIT" ? "+" : "-"}{Math.abs(mov.amount).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
