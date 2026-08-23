"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import MoneyInput from "./MoneyInput";
import type { Row } from "./TransactionsList";

export default function EditTransactionModal({
  row,
  onClose,
}: {
  row: Row;
  onClose: () => void;
}) {
  const { data, updateExpense, updateIncome } = useAppData();
  const [date, setDate] = useState(row.date);
  const [amount, setAmount] = useState(row.amount);
  const [categoryId, setCategoryId] = useState(
    row.kind === "expense" ? row.categoryId : "",
  );
  const [note, setNote] = useState(row.kind === "expense" ? row.note ?? "" : "");
  const [label, setLabel] = useState(row.kind === "income" ? row.label ?? "" : "");

  function handleSave() {
    if (row.kind === "expense") {
      updateExpense(row.id, { date, amount, categoryId, note: note || undefined });
    } else {
      updateIncome(row.id, { date, amount, label: label || undefined });
    }
    onClose();
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
          Editar {row.kind === "expense" ? "gasto" : "ingreso"}
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label htmlFor="edit-date" className="mb-1 block text-sm font-medium text-text-secondary">
              Fecha
            </label>
            <input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="edit-amount" className="mb-1 block text-sm font-medium text-text-secondary">
              Monto
            </label>
            <MoneyInput id="edit-amount" value={amount} onChange={setAmount} />
          </div>

          {row.kind === "expense" ? (
            <>
              <div>
                <label htmlFor="edit-category" className="mb-1 block text-sm font-medium text-text-secondary">
                  Categoría
                </label>
                <select
                  id="edit-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                >
                  {data.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-note" className="mb-1 block text-sm font-medium text-text-secondary">
                  Nota (opcional)
                </label>
                <input
                  id="edit-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="edit-label" className="mb-1 block text-sm font-medium text-text-secondary">
                Etiqueta (opcional)
              </label>
              <input
                id="edit-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
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
            onClick={handleSave}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
