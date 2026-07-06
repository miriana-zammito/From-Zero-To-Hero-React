import { useCallback } from "react";
import type { Movement } from "@/types";
import styles from "./MovementRow.module.css";

interface MovementRowProps {
  movement: Movement;
  onClick: (id: string) => void;
}

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const amountFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export default function MovementRow({ movement, onClick }: MovementRowProps) {
  const isCredit = movement.direction === "credit";
  const formattedDate = dateFormatter.format(new Date(movement.executedAt));
  const formattedAmount = amountFormatter.format(movement.amount);

  const handleClick = useCallback(() => {
    onClick(movement.id);
  }, [onClick, movement.id]);

  return (
    <button
      type="button"
      className={styles.row}
      onClick={handleClick}
      aria-label={`${movement.description}, ${isCredit ? "accredito" : "addebito"} ${formattedAmount}, ${formattedDate}`}
    >
      <div className={styles.left}>
        <span className={styles.description}>{movement.description}</span>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      <div className={styles.right}>
        <span
          className={`${styles.amount} ${isCredit ? styles.credit : styles.debit}`}
        >
          {isCredit ? "+" : "-"}
          {formattedAmount}
        </span>
        <span className={styles.category}>{movement.category}</span>
      </div>
    </button>
  );
}
