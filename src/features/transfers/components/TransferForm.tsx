import { type FormEvent, useState } from "react";
import { useApiMutation } from "@/hooks";
import type { Movement } from "@/types";

// ── Types specific to the transfer form ──────────────────────────

interface TransferBody {
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  counterpartIban: string;
  counterpartName: string;
}

interface TransferFormProps {
  accountId: string;
  currency: string;
}

// ── Component ────────────────────────────────────────────────────

export function TransferForm({ accountId, currency }: TransferFormProps) {
  const [amount, setAmount] = useState("");
  const [iban, setIban] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutate, isLoading, error, reset } = useApiMutation<
    TransferBody,
    Movement
  >({
    url: "/api/movements",
    method: "POST",
    onSuccess: (movement) => {
      setSuccessMsg(`Bonifico ${movement.id} eseguito — €${movement.amount}`);
      setAmount("");
      setIban("");
      setName("");
      setDescription("");
    },
    onError: (err) => {
      console.error("Transfer failed:", err);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    reset();

    mutate({
      accountId,
      amount: Number.parseFloat(amount),
      currency,
      description,
      counterpartIban: iban,
      counterpartName: name,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isLoading}>
        <legend>Nuovo bonifico</legend>

        <label>
          Importo (€)
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <label>
          IBAN destinatario
          <input
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder="IT60X0542811101000000123456"
            required
          />
        </label>

        <label>
          Intestatario
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Causale
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Invio in corso…" : "Invia bonifico"}
        </button>
      </fieldset>

      {error && <p role="alert">Errore: {error.message}</p>}
      {successMsg && <p role="status">{successMsg}</p>}
    </form>
  );
}
