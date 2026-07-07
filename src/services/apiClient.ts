// === Axios instance configurata per app banking ===

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "./ApiError";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./tokenStore";

// ── Istanza ─────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string | undefined ?? "/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ─────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

// ── 401 → refresh → retry ───────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<unknown>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Non è un 401 o manca config → errore secco
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(normalizeError(error));
    }

    // Già ritentato → non ciclare
    if (originalRequest._retry) {
      clearTokens();
      return Promise.reject(normalizeError(error));
    }

    // È la chiamata di refresh fallita → stop
    if (originalRequest.url?.includes("/auth/refresh")) {
      clearTokens();
      return Promise.reject(normalizeError(error));
    }

    // Primo 401: prova refresh
    if (!isRefreshing) {
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post<{
          accessToken: string;
          refreshToken?: string;
        }>("/api/auth/refresh", { refreshToken });

        setTokens(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);

        // Retry originale con nuovo token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        return Promise.reject(normalizeError(refreshError as AxiosError));
      } finally {
        isRefreshing = false;
      }
    }

    // Refresh in corso: accoda richiesta
    return new Promise<string | null>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }
      return Promise.reject(normalizeError(error));
    });
  },
);

// ── Normalizzazione errori ──────────────────────────────────────

function normalizeError(error: AxiosError<unknown>): ApiError {
  if (error instanceof ApiError) return error;

  const status = error.response?.status ?? 0;
  const body = error.response?.data as
    | { message?: string; code?: string; details?: Record<string, string[]> }
    | undefined;

  // Errore di rete (nessuna risposta)
  if (!error.response) {
    return new ApiError({
      message: error.message ?? "Errore di rete — server non raggiungibile",
      status: 0,
      response: null,
    });
  }

  return new ApiError({
    message: body?.message ?? error.message ?? `HTTP ${status}`,
    status,
    code: body?.code ?? null,
    details: body?.details ?? null,
    response: { status, statusText: error.response.statusText } as Response,
  });
}

export { apiClient };
