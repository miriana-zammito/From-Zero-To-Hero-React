import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  'aria-label'?: string;
}

export default function SearchBar({
  value: externalValue,
  onChange,
  delay = 300,
  placeholder = 'Cerca...',
  'aria-label': ariaLabel = 'Cerca',
}: SearchBarProps) {
  /* Stato locale per input reattivo immediato */
  const [local, setLocal] = useState(externalValue);
  const debounced = useDebounce(local, delay);

  /* Sincronizza esterno → locale quando il genitore resetta */
  useEffect(() => {
    setLocal(externalValue);
  }, [externalValue]);

  /* Notifica il genitore solo dopo debounce */
  useEffect(() => {
    if (debounced !== externalValue) {
      onChange(debounced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocal(e.target.value);
    },
    [],
  );

  return (
    <input
      type="search"
      className={styles.input}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={local}
      onChange={handleChange}
    />
  );
}
