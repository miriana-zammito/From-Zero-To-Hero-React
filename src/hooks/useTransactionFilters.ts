import { useReducer, useCallback, useMemo } from 'react';
import type { Movement } from '@/types';

/* ── State ── */

export interface TransactionFiltersState {
  searchText: string;
  type: 'all' | 'credit' | 'debit';
  dateRange: { start: string; end: string } | null;
  amountRange: { min: number; max: number } | null;
  sortBy: 'date' | 'amount' | 'description';
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
  | { type: 'SET_SORT'; payload: { sortBy: TransactionFiltersState['sortBy']; sortOrder: TransactionFiltersState['sortOrder'] } }
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
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'RESET_FILTERS':
      return { ...INITIAL_FILTERS };
    default:
      return state;
  }
}

/* ── Hook ── */

export function useTransactionFilters(initial?: Partial<TransactionFiltersState>) {
  const [filters, dispatch] = useReducer(
    filtersReducer,
    { ...INITIAL_FILTERS, ...initial },
  );

  const setSearchText = useCallback(
    (payload: string) => dispatch({ type: 'SET_SEARCH_TEXT', payload }),
    [],
  );

  const setType = useCallback(
    (payload: TransactionFiltersState['type']) => dispatch({ type: 'SET_TYPE', payload }),
    [],
  );

  const setDateRange = useCallback(
    (payload: TransactionFiltersState['dateRange']) => dispatch({ type: 'SET_DATE_RANGE', payload }),
    [],
  );

  const setAmountRange = useCallback(
    (payload: TransactionFiltersState['amountRange']) => dispatch({ type: 'SET_AMOUNT_RANGE', payload }),
    [],
  );

  const setSortBy = useCallback(
    (payload: TransactionFiltersState['sortBy']) => dispatch({ type: 'SET_SORT_BY', payload }),
    [],
  );

  const setSortOrder = useCallback(
    (payload: TransactionFiltersState['sortOrder']) => dispatch({ type: 'SET_SORT_ORDER', payload }),
    [],
  );

  const setSort = useCallback(
    (payload: { sortBy: TransactionFiltersState['sortBy']; sortOrder: TransactionFiltersState['sortOrder'] }) =>
      dispatch({ type: 'SET_SORT', payload }),
    [],
  );

  const resetFilters = useCallback(
    () => dispatch({ type: 'RESET_FILTERS' }),
    [],
  );

  return {
    filters,
    dispatch,
    setSearchText,
    setType,
    setDateRange,
    setAmountRange,
    setSortBy,
    setSortOrder,
    setSort,
    resetFilters,
  };
}

/* ── Utility: applica filtri + ordinamento a un array di movimenti ── */

export function applyFilters(
  movements: Movement[],
  filters: TransactionFiltersState,
): Movement[] {
  return movements
    .filter((m) => {
      /* searchText (case-insensitive su description) */
      if (filters.searchText) {
        const q = filters.searchText.toLowerCase();
        if (!m.description.toLowerCase().includes(q)) return false;
      }

      /* direction */
      if (filters.type !== 'all' && m.direction !== filters.type) return false;

      /* dateRange */
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

      /* amountRange */
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
        case 'description':
          return a.description.localeCompare(b.description) * dir;
        case 'date':
        default:
          return (new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime()) * dir;
      }
    });
}
