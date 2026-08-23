"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import { formatCLP } from "@/lib/format";
import MoneyInput from "./MoneyInput";
import ConfirmDialog from "./ConfirmDialog";

export default function RecurringIncomeManager() {
  const { data, setRecurringIncome } = useAppData();
  const recurring = data.recurringIncome;

  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(recurring?.amount ?? 0);
  const [label, setLabel] = useState(recurring?.label ?? "Sueldo");
  const [deleting, setDeleting] = useState(false);

  function startEdit() {
    setAmount(recurring?.amount ?? 0);
    setLabel(recurring?.label ?? "Sueldo");
    setEditing(true);
  }

  function save() {
    if (amount <= 0 || !label.trim()) return;
    setRecurringIncome({ amount, label: label.trim() });
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Sueldo mensual</h2>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            {recurring ? "Editar" : "+ Configurar"}
          </button>
        )}
      </div>

      {!editing && (
        <>
          {recurring ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{recurring.label}</span> ·{" "}
                {formatCLP(recurring.amount)} cada mes
              </p>
              <button
                type="button"
                onClick={() => setDeleting(true)}
                className="rounded-md p-1.5 text-text-muted hover:bg-critical/10 hover:text-critical"
                aria-label="Desactivar sueldo mensual"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                </svg>
              </button>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              Configura tu sueldo una vez y la app lo va a agregar como
              ingreso automáticamente cada vez que abras la app en un mes
              nuevo — no tienes que escribirlo cada vez.
            </p>
          )}
        </>
      )}

      {editing && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Monto mensual
            </label>
            <MoneyInput value={amount} onChange={setAmount} autoFocus />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-text-secondary">
              Etiqueta
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Sueldo"
              className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent sm:w-52"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleting}
        title="Desactivar sueldo mensual"
        description="Dejará de agregarse automáticamente cada mes. Los ingresos ya registrados no se borran."
        confirmLabel="Desactivar"
        danger
        onConfirm={() => {
          setRecurringIncome(null);
          setDeleting(false);
        }}
        onCancel={() => setDeleting(false)}
      />
    </div>
  );
}
