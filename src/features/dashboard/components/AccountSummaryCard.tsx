import type { Account } from "@/types";
import styles from "./AccountSummaryCard.module.css";

interface AccountSummaryCardProps {
  account: Account;
}

function truncateIban(iban: string): string {
  if (iban.length <= 12) return iban;
  return `${iban.slice(0, 10)}...${iban.slice(-4)}`;
}

export default function AccountSummaryCard({
  account,
}: AccountSummaryCardProps) {
  const formattedBalance = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: account.currency,
  }).format(account.balance);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.name}>{account.label}</h3>
        <span
          className={`${styles.badge} ${account.accountType === "BUSINESS" ? styles.business : styles.private}`}
        >
          {account.accountType}
        </span>
      </div>

      <p className={styles.balance}>{formattedBalance}</p>

      <p className={styles.iban} title={account.iban}>
        {truncateIban(account.iban)}
      </p>
    </article>
  );
}
