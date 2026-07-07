// === Step 5: Riepilogo — sola lettura di tutti i dati ===
import { useFormContext } from "react-hook-form";
import type { InsuranceFormData } from "../schemas/insuranceSchema";
import s from "./StepForm.module.css";

// ── Helpers ─────────────────────────────────────────────────────────

const TIPO_POLIZZA_MAP: Record<string, string> = {
  vita: "Vita",
  infortuni: "Infortuni",
  malattia: "Malattia",
  auto: "Auto",
  casa: "Casa",
};

const MODALITA_MAP: Record<string, string> = {
  annuale: "Annuale",
  semestrale: "Semestrale",
  trimestrale: "Trimestrale",
  mensile: "Mensile",
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

function formatDate(d: string): string {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

// ── Componente ──────────────────────────────────────────────────────

export function StepRiepilogo() {
  const { getValues } = useFormContext<InsuranceFormData>();
  const data = getValues();

  return (
    <div>
      {/* ── Anagrafici ────────────────────────────────────────────── */}
      <section className={s.riepilogoSection}>
        <h3>📋 Anagrafici</h3>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Nome Completo</span>
          <span className={s.riepilogoValue}>
            {data.anagrafici.nome} {data.anagrafici.cognome}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Codice Fiscale</span>
          <span className={s.riepilogoValue}>{data.anagrafici.codiceFiscale}</span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Data Nascita</span>
          <span className={s.riepilogoValue}>
            {formatDate(data.anagrafici.dataNascita)}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Sesso</span>
          <span className={s.riepilogoValue}>
            {data.anagrafici.sesso === "M" ? "Maschio" : "Femmina"}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Luogo Nascita</span>
          <span className={s.riepilogoValue}>
            {data.anagrafici.comuneNascita} ({data.anagrafici.provinciaNascita})
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Residenza</span>
          <span className={s.riepilogoValue}>
            {data.anagrafici.indirizzoResidenza}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Telefono</span>
          <span className={s.riepilogoValue}>{data.anagrafici.telefono}</span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Email</span>
          <span className={s.riepilogoValue}>{data.anagrafici.email}</span>
        </div>
      </section>

      {/* ── Beneficiari ───────────────────────────────────────────── */}
      <section className={s.riepilogoSection}>
        <h3>👥 Beneficiari</h3>
        {data.beneficiari.length === 0 && (
          <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-sm)" }}>
            Nessun beneficiario inserito.
          </p>
        )}
        {data.beneficiari.map((b, i) => (
          <div key={i} className={s.riepilogoRow}>
            <span className={s.riepilogoLabel}>
              #{i + 1} {b.nome} {b.cognome} ({b.parentela})
            </span>
            <span className={s.riepilogoValue}>{b.percentuale}%</span>
          </div>
        ))}
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Totale</span>
          <span className={s.riepilogoValue}>
            <strong>
              {data.beneficiari.reduce((s, b) => s + b.percentuale, 0)}%
            </strong>
          </span>
        </div>
      </section>

      {/* ── Dettagli Polizza ──────────────────────────────────────── */}
      <section className={s.riepilogoSection}>
        <h3>📄 Dettagli Polizza</h3>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Tipo</span>
          <span className={s.riepilogoValue}>
            {TIPO_POLIZZA_MAP[data.dettagliPolizza.tipoPolizza] ?? "—"}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Importo Assicurato</span>
          <span className={s.riepilogoValue}>
            {formatCurrency(data.dettagliPolizza.importoAssicurato)}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Durata</span>
          <span className={s.riepilogoValue}>
            {data.dettagliPolizza.durataAnni} anni
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Decorrenza</span>
          <span className={s.riepilogoValue}>
            {formatDate(data.dettagliPolizza.dataDecorrenza)}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Scadenza</span>
          <span className={s.riepilogoValue}>
            {formatDate(data.dettagliPolizza.dataScadenza)}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Premio Annuale</span>
          <span className={s.riepilogoValue}>
            {formatCurrency(data.dettagliPolizza.premioAnnuale)}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Modalità Pagamento</span>
          <span className={s.riepilogoValue}>
            {MODALITA_MAP[data.dettagliPolizza.modalitaPagamento] ?? "—"}
          </span>
        </div>
      </section>

      {/* ── PIN (nascosto) ────────────────────────────────────────── */}
      <section className={s.riepilogoSection}>
        <h3>🔐 PIN</h3>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>PIN impostato</span>
          <span className={s.riepilogoValue}>
            {data.pin.pin ? "✅ Sì" : "❌ No"}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Conferma PIN</span>
          <span className={s.riepilogoValue}>
            {data.pin.confermaPin ? "✅ Sì" : "❌ No"}
          </span>
        </div>
        <div className={s.riepilogoRow}>
          <span className={s.riepilogoLabel}>Corrispondenza</span>
          <span className={s.riepilogoValue}>
            {data.pin.pin && data.pin.pin === data.pin.confermaPin
              ? "✅ Coincidono"
              : "❌ Non coincidono"}
          </span>
        </div>
      </section>
    </div>
  );
}
