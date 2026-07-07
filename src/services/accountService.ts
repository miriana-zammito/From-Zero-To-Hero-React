import type { Account, Movement } from "@/types";

// ── Service ─────────────────────────────────────────────────────
// I chiamanti passano signal da AbortController per gestire race condition.
// Ogni fetch controlla response.ok e normalizza gli errori HTTP.

interface ServiceError {
  message: string;
  status: number;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw { message: text || `HTTP ${res.status}`, status: res.status } satisfies ServiceError;
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const accountService = {
  getAll: (signal?: AbortSignal): Promise<Account[]> =>
    fetch("/api/accounts", { signal }).then(handleResponse<Account[]>),

  getById: (id: string, signal?: AbortSignal): Promise<Account> =>
    fetch(`/api/accounts/${id}`, { signal }).then(handleResponse<Account>),

  getMovements: (accountId: string, signal?: AbortSignal): Promise<Movement[]> =>
    fetch(`/api/movements?accountId=${encodeURIComponent(accountId)}`, { signal })
      .then(handleResponse<Movement[]>),
};
