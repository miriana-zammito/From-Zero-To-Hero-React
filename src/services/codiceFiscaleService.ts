// === Servizio mock verifica Codice Fiscale ===

export interface CodiceFiscaleResult {
  valid: boolean;
  message?: string;
}

/**
 * Simula una chiamata API per verificare la validità di un Codice Fiscale.
 * Delay 1-1.5s. Regole deterministiche per CF noti, altrimenti random.
 */
export async function checkCodiceFiscale(cf: string): Promise<CodiceFiscaleResult> {
  // Simula latenza di rete
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));

  if (cf === "RSSMRA80A01H501U") {
    return { valid: true };
  }

  if (cf === "AAAAAA00A00A000A") {
    return {
      valid: false,
      message: "Codice Fiscale non trovato nell'anagrafe tributaria",
    };
  }

  if (cf === "ZZZZZZ00Z00Z000Z") {
    throw new Error("Servizio di verifica CF temporaneamente non disponibile");
  }

  // 80% validi, 20% no
  return Math.random() > 0.2
    ? { valid: true }
    : { valid: false, message: "Il codice fiscale non corrisponde ai dati anagrafici" };
}
