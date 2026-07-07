import { useEffect, useState, useCallback } from "react";

// ── Interfaccia errore normalizzato ─────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}

// ── Tipo del risultato del hook ─────────────────────────────────

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

// ── Hook ────────────────────────────────────────────────────────

export function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => {
    setTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    // Skip vuoto
    if (!url) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw {
            message: body
              ? `HTTP ${res.status}: ${body.slice(0, 200)}`
              : `HTTP ${res.status} ${res.statusText}`,
            statusCode: res.status,
            timestamp: new Date().toISOString(),
          } satisfies ApiError;
        }
        return res.json() as Promise<T>;
      })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === "AbortError") return;

        // Errore già normalizzato (throw in !res.ok)
        if (isApiError(err)) {
          setError(err);
        } else {
          // Errore di rete / inaspettato
          setError({
            message: err instanceof Error ? err.message : "Errore sconosciuto",
            statusCode: 0,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, trigger]);

  return { data, isLoading, error, refetch };
}

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    "message" in err &&
    "timestamp" in err
  );
}
