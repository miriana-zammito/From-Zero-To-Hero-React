import { useReducer, useMemo, useRef } from 'react';
import type { Movement } from '@/types';
import TransactionItem from '@/features/dashboard/components/TransactionItem/TransactionItem';
import FilterPanel from '@/features/dashboard/components/FilterPanel/FilterPanel';
import styles from './TransactionList.module.css';

/* ── State ── */

export interface TransactionFiltersState {
  searchText: string;
  type: 'all' | 'CREDIT' | 'DEBIT';
  dateRange: { start: string; end: string } | null;
  amountRange: { min: number; max: number } | null;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

const INITIAL_FILTERS: TransactionFiltersState = {
  searchText: '',
  type: 'all',
  dateRange: null,
  amountRange: null,
  sortBy: 'date',
  sortOrder: 'desc',
};

/* ── Actions (union type) ── */

export type TransactionFiltersAction =
  | { type: 'SET_SEARCH_TEXT'; payload: string }
  | { type: 'SET_TYPE'; payload: TransactionFiltersState['type'] }
  | { type: 'SET_DATE_RANGE'; payload: TransactionFiltersState['dateRange'] }
  | { type: 'SET_AMOUNT_RANGE'; payload: TransactionFiltersState['amountRange'] }
  | { type: 'SET_SORT_BY'; payload: TransactionFiltersState['sortBy'] }
  | { type: 'SET_SORT_ORDER'; payload: TransactionFiltersState['sortOrder'] }
  | { type: 'RESET_FILTERS' };

/* ── Reducer ── */

function filtersReducer(
  state: TransactionFiltersState,
  action: TransactionFiltersAction,
): TransactionFiltersState {
  switch (action.type) {
    case 'SET_SEARCH_TEXT':
      return { ...state, searchText: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_AMOUNT_RANGE':
      return { ...state, amountRange: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    case 'RESET_FILTERS':
      return { ...INITIAL_FILTERS };
    default:
      return state;
  }
}

/* ── Props ── */

interface TransactionListProps {
  movements: Movement[];
  isLoading?: boolean;
}

/* ── Componente ── */

export default function TransactionList({ movements, isLoading = false }: TransactionListProps) {
  const [filters, dispatch] = useReducer(filtersReducer, INITIAL_FILTERS);
  const searchRef = useRef<HTMLInputElement | null>(null);

  /* ── Early return: skeleton loader ── */
  if (isLoading) {
    return (
      <div className={styles.wrapper} aria-busy="true" aria-label="Caricamento movimenti">
        <div className={styles.skeletonFilter} />
        <div className={styles.skeletonLine} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    );
  }

  /* Filtra e ordina — useMemo */
  const filteredMovements = useMemo(() => {
    return movements
      .filter((m) => {
        /* Filtro testo (case-insensitive) */
        if (filters.searchText) {
          const q = filters.searchText.toLowerCase();
          if (!m.description.toLowerCase().includes(q)) return false;
        }
        /* Filtro tipo */
        if (filters.type !== 'all' && m.direction !== filters.type.toLowerCase()) return false;
        /* Filtro dateRange */
        if (filters.dateRange) {
          const t = new Date(m.executedAt).getTime();
          const start = filters.dateRange.start
            ? new Date(filters.dateRange.start).getTime()
            : -Infinity;
          const end = filters.dateRange.end
            ? new Date(filters.dateRange.end).getTime()
            : Infinity;
          if (t < start || t > end) return false;
        }
        /* Filtro amountRange */
        if (filters.amountRange) {
          const { min, max } = filters.amountRange;
          if (m.amount < min || m.amount > max) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = filters.sortOrder === 'asc' ? 1 : -1;
        switch (filters.sortBy) {
          case 'amount':
            return (a.amount - b.amount) * dir;
          case 'date':
          default:
            return (new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime()) * dir;
        }
      });
  }, [movements, filters]);

  /* Totali — useMemo */
  const totals = useMemo(() => {
    let credits = 0;
    let debits = 0;

    for (const m of filteredMovements) {
      if (m.direction === 'credit') credits += m.amount;
      else debits += m.amount;
    }

    return {
      credits,
      debits,
      count: filteredMovements.length,
    };
  }, [filteredMovements]);

  return (
    <div className={styles.wrapper}>
      <FilterPanel
        filters={filters}
        dispatch={dispatch}
        searchInputRef={searchRef}
      />

      {/* AND (&&): totali solo se ci sono movimenti filtrati */}
      {filteredMovements.length > 0 && (
        <p className={styles.summary}>
          {filteredMovements.length} di {movements.length} movimenti
          {' — '}
          Entrate: {totals.credits.toFixed(2)} €
          {' | '}
          Uscite: {totals.debits.toFixed(2)} €
        </p>
      )}

      {/* Lista */}
      <div className={styles.list}>
        {filteredMovements.length === 0 ? (
          <p className={styles.empty}>Nessun movimento trovato.</p>
        ) : (
          filteredMovements.map((mov) => (
            <TransactionItem
              key={mov.id}
              movement={mov}
            />
          ))
        )}
      </div>
    </div>
  );
}
