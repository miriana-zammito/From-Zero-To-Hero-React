import { memo, useCallback, useState, useEffect } from 'react';
import type { TransactionFiltersAction, TransactionFiltersState } from '../TransactionList/TransactionList';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  filters: TransactionFiltersState;
  dispatch: React.Dispatch<TransactionFiltersAction>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

function FilterPanel({ filters, dispatch, searchInputRef }: FilterPanelProps) {
  /* ── Stato locale per date/amount (commit su blur) ── */
  const [dateStart, setDateStart] = useState(filters.dateRange?.start ?? '');
  const [dateEnd, setDateEnd] = useState(filters.dateRange?.end ?? '');
  const [amountMin, setAmountMin] = useState(
    filters.amountRange?.min !== undefined ? String(filters.amountRange.min) : '',
  );
  const [amountMax, setAmountMax] = useState(
    filters.amountRange?.max !== undefined ? String(filters.amountRange.max) : '',
  );

  /* Sincronizza esterno → locale quando il genitore resetta */
  useEffect(() => {
    setDateStart(filters.dateRange?.start ?? '');
    setDateEnd(filters.dateRange?.end ?? '');
  }, [filters.dateRange]);

  useEffect(() => {
    setAmountMin(
      filters.amountRange?.min !== undefined ? String(filters.amountRange.min) : '',
    );
    setAmountMax(
      filters.amountRange?.max !== undefined ? String(filters.amountRange.max) : '',
    );
  }, [filters.amountRange]);

  /* ── Handler useCallback ── */

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'SET_SEARCH_TEXT', payload: e.target.value });
    },
    [dispatch],
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: 'SET_TYPE', payload: e.target.value as TransactionFiltersState['type'] });
    },
    [dispatch],
  );

  const handleSortByChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: 'SET_SORT_BY', payload: e.target.value as TransactionFiltersState['sortBy'] });
    },
    [dispatch],
  );

  const handleToggleOrder = useCallback(() => {
    dispatch({
      type: 'SET_SORT_ORDER',
      payload: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  }, [dispatch, filters.sortOrder]);

  const handleDateStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDateStart(e.target.value),
    [],
  );

  const handleDateEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDateEnd(e.target.value),
    [],
  );

  const commitDateRange = useCallback(() => {
    const start = dateStart || '';
    const end = dateEnd || '';
    dispatch({
      type: 'SET_DATE_RANGE',
      payload: !start && !end ? null : { start, end },
    });
  }, [dateStart, dateEnd, dispatch]);

  const handleAmountMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setAmountMin(e.target.value),
    [],
  );

  const handleAmountMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setAmountMax(e.target.value),
    [],
  );

  const commitAmountRange = useCallback(() => {
    const min = amountMin !== '' ? Number(amountMin) : NaN;
    const max = amountMax !== '' ? Number(amountMax) : NaN;
    dispatch({
      type: 'SET_AMOUNT_RANGE',
      payload: isNaN(min) && isNaN(max) ? null : { min: isNaN(min) ? 0 : min, max: isNaN(max) ? Infinity : max },
    });
  }, [amountMin, amountMax, dispatch]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
    searchInputRef.current?.focus();
  }, [dispatch, searchInputRef]);

  const isDefault =
    filters.searchText === '' &&
    filters.type === 'all' &&
    filters.dateRange === null &&
    filters.amountRange === null &&
    filters.sortBy === 'date' &&
    filters.sortOrder === 'desc';

  return (
    <div className={styles.panel}>
      {/* Riga 1: ricerca + tipo + ordinamento */}
      <div className={styles.row}>
        <input
          ref={searchInputRef}
          type="search"
          className={styles.input}
          placeholder="Cerca movimento..."
          aria-label="Cerca per descrizione"
          value={filters.searchText}
          onChange={handleSearchChange}
        />

        <select
          className={styles.select}
          value={filters.type}
          onChange={handleTypeChange}
          aria-label="Filtra per tipo"
        >
          <option value="all">Tutti</option>
          <option value="CREDIT">Accrediti</option>
          <option value="DEBIT">Addebiti</option>
        </select>

        <select
          className={styles.select}
          value={filters.sortBy}
          onChange={handleSortByChange}
          aria-label="Ordina per"
        >
          <option value="date">Data</option>
          <option value="amount">Importo</option>
        </select>

        <button
          type="button"
          className={styles.orderBtn}
          onClick={handleToggleOrder}
          aria-label={filters.sortOrder === 'asc' ? 'Ordine crescente' : 'Ordine decrescente'}
          title={filters.sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
        >
          {filters.sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Riga 2: data range + amount range + reset */}
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Da data</span>
          <input
            type="date"
            className={styles.input}
            value={dateStart}
            onChange={handleDateStartChange}
            onBlur={commitDateRange}
            aria-label="Data inizio"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>A data</span>
          <input
            type="date"
            className={styles.input}
            value={dateEnd}
            onChange={handleDateEndChange}
            onBlur={commitDateRange}
            aria-label="Data fine"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Importo min</span>
          <input
            type="number"
            className={styles.input}
            placeholder="0"
            min={0}
            step={0.01}
            value={amountMin}
            onChange={handleAmountMinChange}
            onBlur={commitAmountRange}
            aria-label="Importo minimo"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Importo max</span>
          <input
            type="number"
            className={styles.input}
            placeholder="∞"
            min={0}
            step={0.01}
            value={amountMax}
            onChange={handleAmountMaxChange}
            onBlur={commitAmountRange}
            aria-label="Importo massimo"
          />
        </label>

        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleReset}
          disabled={isDefault}
          aria-label="Azzera filtri"
        >
          Azzera
        </button>
      </div>
    </div>
  );
}

export default memo(FilterPanel);
