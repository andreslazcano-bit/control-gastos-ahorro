"use client";

import { useState } from "react";
import type { Goal } from "@/types";
import { formatCLP } from "@/lib/format";
import MoneyInput from "./MoneyInput";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  goal: Goal;
  onSubmit: (amount: number, note?: string) => void;
  onClose: () => void;
}

export default function ContributionModal({ goal, onSubmit, onClose }: Props) {
  const [mode, setMode] = useState<"add" | "withdraw">("add");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [confirmingProtectedWithdraw, setConfirmingProtectedWithdraw] = useState(false);

  const signedAmount = mode === "add" ? amount : -amount;
  const canSubmit = amount > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    if (mode === "withdraw" && goal.protected) {
      setConfirmingProtectedWithdraw(true);
      return;
    }
    onSubmit(signedAmount, note || undefined);
  }

  function handleConfirmedWithdraw() {
    setConfirmingProtectedWithdraw(false);
    onSubmit(signedAmount, note || undefined);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-text-primary">
          Aporte a &ldquo;{goal.name}&rdquo;
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Acumulado actual: {formatCLP(goal.savedAmount)}
        </p>

        <div className="mt-4 flex gap-1 rounded-lg border border-border-strong p-1">
          <button
            type="button"
            onClick={() => setMode("add")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "add" ? "bg-accent text-white" : "text-text-secondary"
            }`}
          >
            Aportar
          </button>
          <button
            type="button"
            onClick={() => setMode("withdraw")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "withdraw" ? "bg-critical text-white" : "text-text-secondary"
            }`}
          >
            Retirar
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="contrib-amount" className="mb-1 block text-sm font-medium text-text-secondary">
              Monto
            </label>
            <MoneyInput id="contrib-amount" value={amount} onChange={setAmount} autoFocus />
          </div>
          <div>
            <label htmlFor="contrib-note" className="mb-1 block text-sm font-medium text-text-secondary">
              Nota (opcional)
            </label>
            <input
              id="contrib-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>

          {mode === "withdraw" && goal.protected && (
            <p className="flex items-start gap-2 rounded-lg bg-critical/10 p-2 text-xs text-critical">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mt-0.5 h-3.5 w-3.5 shrink-0">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Esta es una meta protegida. Se te pedirá confirmación antes de reducir el acumulado.
            </p>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {mode === "add" ? "Agregar aporte" : "Retirar"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingProtectedWithdraw}
        title="Meta protegida"
        description={`"${goal.name}" está marcada como protegida. Estás por reducir el acumulado en ${formatCLP(amount)}. ¿Confirmas este movimiento?`}
        confirmLabel="Sí, reducir de todas formas"
        danger
        onConfirm={handleConfirmedWithdraw}
        onCancel={() => setConfirmingProtectedWithdraw(false)}
      />
    </div>
  );
}
