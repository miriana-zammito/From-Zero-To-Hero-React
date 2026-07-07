// === Errore HTTP normalizzato per tutta l'app banking ===

export class ApiError extends Error {
  /** HTTP status (0 = network error, 401, 403, 422, 500, …) */
  readonly status: number;

  /** Codice errore di business dal body (es. "INSUFFICIENT_FUNDS") */
  readonly code: string | null;

  /** Dettagli validazione / errori di campo */
  readonly details: Record<string, string[]> | null;

  /** Timestamp ISO dell'errore */
  readonly timestamp: string;

  /** Risposta HTTP originale (per debug) */
  readonly response: Response | null;

  constructor({
    message,
    status = 0,
    code = null,
    details = null,
    response = null,
  }: {
    message: string;
    status?: number;
    code?: string | null;
    details?: Record<string, string[]> | null;
    response?: Response | null;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.response = response;
  }
}
