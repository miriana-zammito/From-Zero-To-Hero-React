// === Token store in-memory per JWT ===
// AuthContext scrive qui dopo login/refresh; apiClient legge per l'header Authorization.
// Evita localStorage (XSS surface) e dipendenze circolari.

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshToken(token: string | null): void {
  refreshToken = token;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
}

export function setTokens(access: string | null, refresh?: string | null): void {
  accessToken = access;
  if (refresh !== undefined) refreshToken = refresh;
}
