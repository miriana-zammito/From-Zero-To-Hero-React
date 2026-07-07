import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Branch } from "@/types";

// ── Constants ──────────────────────────────────────────────────

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

// ── Props ───────────────────────────────────────────────────────

interface BranchSearchProps {
  /** Called when user selects a branch from results */
  onSelect?: (branch: Branch) => void;
  /** Placeholder for the search input */
  placeholder?: string;
}

// ── Component ───────────────────────────────────────────────────

export function BranchSearch({
  onSelect,
  placeholder = "Cerca filiale per città o nome...",
}: BranchSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Fetch al cambio del debounced query ─────────────────────

  useEffect(() => {
    // Sotto soglia — resetta e ferma
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Cancella richiesta precedente
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setActiveIndex(-1);

    fetch(
      `/api/branches?q=${encodeURIComponent(debouncedQuery)}`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json() as Promise<Branch[]>;
      })
      .then((data) => {
        setResults(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // ── Keyboard navigation ────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          onSelect?.(results[activeIndex]);
          setQuery("");
          setResults([]);
        }
        break;
      case "Escape":
        setQuery("");
        setResults([]);
        inputRef.current?.blur();
        break;
    }
  };

  // ── Stato per messaggio ─────────────────────────────────────

  const showMinChars = query.length > 0 && query.length < MIN_QUERY_LENGTH;
  const showLoading = isLoading;
  const showError = !isLoading && error !== null;
  const showEmpty =
    !isLoading && !error && debouncedQuery.length >= MIN_QUERY_LENGTH && results.length === 0;
  const showResults = results.length > 0 && !isLoading;

  // ── Annuncio per screen reader ──────────────────────────────

  const announcement = showLoading
    ? "Ricerca in corso"
    : showError
      ? `Errore: ${error}`
      : showEmpty
        ? `Nessuna filiale trovata per "${debouncedQuery}"`
        : showResults
          ? `${results.length} filiale${results.length === 1 ? "" : "s"} trovata${results.length === 1 ? "" : "e"}`
          : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (branch: Branch) => {
    onSelect?.(branch);
    setQuery("");
    setResults([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <label htmlFor="branch-search" style={{ display: "none" }}>
        Cerca filiale
      </label>
      <input
        ref={inputRef}
        id="branch-search"
        type="search"
        role="combobox"
        aria-expanded={showResults}
        aria-controls="branch-results"
        aria-activedescendant={
          activeIndex >= 0 ? `branch-option-${activeIndex}` : undefined
        }
        aria-label="Cerca filiale"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: "0.45rem 0.65rem",
          border: "1px solid var(--color-border, #ccc)",
          borderRadius: "6px",
          fontSize: "0.875rem",
          background: "var(--color-surface, #fff)",
          color: "var(--color-text, #111)",
          boxSizing: "border-box",
        }}
      />

      {/* aria-live region — annuncio ai lettori di schermo */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {announcement}
      </div>

      {/* Messaggi di stato */}
      {showLoading && (
        <p
          style={{
            margin: "0.25rem 0",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary, #666)",
          }}
        >
          Ricerca in corso…
        </p>
      )}
      {showMinChars && (
        <p
          style={{
            margin: "0.25rem 0",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary, #666)",
          }}
        >
          Inserisci almeno {MIN_QUERY_LENGTH} caratteri
        </p>
      )}
      {showError && (
        <p
          role="alert"
          style={{
            margin: "0.25rem 0",
            fontSize: "0.8rem",
            color: "var(--color-danger, #c00)",
          }}
        >
          {error}
        </p>
      )}
      {showEmpty && (
        <p
          style={{
            margin: "0.25rem 0",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary, #666)",
          }}
        >
          Nessuna filiale trovata per "{debouncedQuery}"
        </p>
      )}

      {/* Risultati */}
      {showResults && (
        <ul
          id="branch-results"
          role="listbox"
          aria-label="Risultati filiali"
          style={{
            listStyle: "none",
            margin: "4px 0 0",
            padding: "4px 0",
            border: "1px solid var(--color-border, #ccc)",
            borderRadius: "6px",
            background: "var(--color-surface, #fff)",
            position: "absolute",
            width: "100%",
            zIndex: 10,
            boxSizing: "border-box",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          {results.map((branch, index) => (
            <li
              key={branch.id}
              id={`branch-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => handleSelect(branch)}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                background:
                  index === activeIndex
                    ? "var(--color-focus-bg, #e8f0fe)"
                    : "transparent",
              }}
            >
              <strong>{branch.name}</strong>
              <span
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  color: "var(--color-text-secondary, #666)",
                }}
              >
                {branch.city} — {branch.address}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
