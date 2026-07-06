import { memo } from 'react';
import type { Movement } from '@/types';
import styles from './TransactionItem.module.css';

interface TransactionItemProps {
  movement: Movement;
}

/* ── Icone SVG per categoria (restaurate) ── */

function CategoryIcon({ category }: { category: string }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24' as const,
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  };

  switch (category) {
    case 'salary':
      return (
        <svg {...props}>
          <path d="M12 2v4M6 6h12l-1.5 12H7.5L6 6z" />
          <circle cx="12" cy="16" r="2" />
        </svg>
      );
    case 'shopping':
      return (
        <svg {...props}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      );
    case 'food':
      return (
        <svg {...props}>
          <path d="M18 8h1a3 3 0 010 6h-1M3 8h12v8a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" />
          <path d="M15 8V3M19 8V5" />
        </svg>
      );
    case 'utilities':
      return (
        <svg {...props}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'transfer':
      return (
        <svg {...props}>
          <path d="M17 2l4 4-4 4" />
          <path d="M3 12h18" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 12v4a2 2 0 01-2 2H5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M4 2h16v20l-8-4-8 4V2z" />
        </svg>
      );
  }
}

/* ── Component map per badge categoria ── */

const BADGE_CLASS_MAP: Record<string, string> = {
  salary: styles.badgeSalary,
  shopping: styles.badgeShopping,
  food: styles.badgeFood,
  utilities: styles.badgeUtilities,
  transfer: styles.badgeTransfer,
};

const BADGE_LABEL_MAP: Record<string, string> = {
  salary: 'Stipendio',
  shopping: 'Acquisto',
  food: 'Cibo',
  utilities: 'Utenze',
  transfer: 'Bonifico',
};

/* ── Component map per direzione ── */

interface DirectionBadgeConfig {
  className: string;
  label: string;
}

const DIRECTION_MAP: Record<string, DirectionBadgeConfig> = {
  credit: { className: styles.directionCredit, label: '↑ Entrata' },
  debit: { className: styles.directionDebit, label: '↓ Uscita' },
};

/* ── Formatter ── */

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const amountFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

/* ── Componente ── */

function TransactionItem({ movement }: TransactionItemProps) {
  const isCredit = movement.direction === 'credit';
  const formattedDate = dateFormatter.format(new Date(movement.executedAt));
  const formattedAmount = amountFormatter.format(movement.amount);
  const directionCfg = DIRECTION_MAP[movement.direction];
  const badgeClass = BADGE_CLASS_MAP[movement.category] ?? styles.badgeDefault;
  const badgeLabel = BADGE_LABEL_MAP[movement.category] ?? movement.category;

  return (
    <article
      className={styles.card}
      aria-label={`${movement.description}, ${isCredit ? 'accredito' : 'addebito'} ${formattedAmount}, ${formattedDate}`}
    >
      <span className={styles.icon}>
        <CategoryIcon category={movement.category} />
      </span>

      <span className={styles.info}>
        <span className={styles.description}>{movement.description}</span>
        <span className={styles.meta}>
          <span className={styles.date}>{formattedDate}</span>
          <span className={`${styles.directionBadge} ${directionCfg.className}`}>
            {directionCfg.label}
          </span>
          <span className={`${styles.badge} ${badgeClass}`}>
            {badgeLabel}
          </span>
        </span>
      </span>

      <span className={`${styles.amount} ${isCredit ? styles.credit : styles.debit}`}>
        {isCredit ? '+' : '-'}
        {formattedAmount}
      </span>
    </article>
  );
}

export default memo(TransactionItem);
