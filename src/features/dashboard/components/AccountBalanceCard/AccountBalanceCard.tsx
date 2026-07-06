import type { Account } from "@/types";
import styles from "./AccountBalanceCard.module.css";

interface AccountBalanceCardProps {
  account: Account;
}

export default function AccountBalanceCard({
  account,
}: AccountBalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: account.currency,
  }).format(account.balance);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{account.label}</span>
        <span className={styles.type}>
          {account.accountType === "BUSINESS" ? "Aziendale" : "Personale"}
        </span>
      </div>
      <p className={styles.balance}>{formattedBalance}</p>
      <p className={styles.iban}>{account.iban}</p>
    </article>
  );
}
