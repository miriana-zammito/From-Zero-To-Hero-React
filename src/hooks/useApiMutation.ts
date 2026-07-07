import { useState, useCallback, useRef } from "react";

export interface UseApiMutationOptions<TResponse> {
  /** Endpoint URL (e.g. "/api/movements") */
  url: string;
  /** HTTP method — default "POST" */
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  /** Callback on 2xx response */
  onSuccess?: (data: TResponse) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Extra headers merged over defaults */
  headers?: Record<string, string>;
}

export interface UseApiMutationResult<TBody, TResponse> {
  /** Fire the mutation. Returns the parsed response body, or undefined on error. */
  mutate: (body: TBody) => Promise<TResponse | undefined>;
  /** True while the request is in-flight */
  isLoading: boolean;
  /** Last error, or null if none */
  error: Error | null;
  /** Clear error and reset loading state */
  reset: () => void;
}

/**
 * Generic hook for POST / PUT / PATCH / DELETE mutations.
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useApiMutation<TransferBody, Movement>({
 *   url: "/api/movements",
 *   method: "POST",
 *   onSuccess: (movement) => console.log("Created", movement.id),
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * mutate({ amount: 100, iban: "IT60X0542811101000000123456", … });
 * ```
 */
export function useApiMutation<TBody, TResponse>(
  options: UseApiMutationOptions<TResponse>,
): UseApiMutationResult<TBody, TResponse> {
  const { url, method = "POST", onSuccess, onError, headers } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const mutate = useCallback(
    async (body: TBody): Promise<TResponse | undefined> => {
      // Cancel any in-flight request from the same hook instance
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: method === "DELETE" ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `HTTP ${response.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
          );
        }

        // Handle 204 No Content (DELETE typical response)
        const data: TResponse =
          response.status === 204
            ? (undefined as unknown as TResponse)
            : ((await response.json()) as TResponse);

        onSuccess?.(data);
        return data;
      } catch (err) {
        // Ignore abort errors from cancellation
        if (err instanceof DOMException && err.name === "AbortError") {
          return undefined;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, headers, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return { mutate, isLoading, error, reset };
}
