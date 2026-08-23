"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import { todayIso } from "@/lib/format";
import MoneyInput from "./MoneyInput";

const INCOME_LABEL_SUGGESTIONS = ["Sueldo", "Otro"];

export default function TransactionForm() {
  const { data, addExpense, addIncome } = useAppData();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [date, setDate] = useState(todayIso());
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState(data.categories[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [label, setLabel] = useState("");
  const [feedback, setFeedback] = useState(false);

  const canSubmit = amount > 0 && (type === "income" || categoryId);

  function reset() {
    setAmount(0);
    setNote("");
    setLabel("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (type === "expense") {
      addExpense({ date, categoryId, amount, note: note || undefined });
    } else {
      addIncome({ date, amount, label: label || undefined });
    }
    reset();
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-card p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Registro rápido</h2>
        <div className="flex gap-1 rounded-lg border border-border-strong p-1">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              type === "expense" ? "bg-critical text-white" : "text-text-secondary"
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              type === "income" ? "bg-good text-white" : "text-text-secondary"
            }`}
          >
            Ingreso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="tx-date" className="mb-1 block text-sm font-medium text-text-secondary">
            Fecha
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="tx-amount" className="mb-1 block text-sm font-medium text-text-secondary">
            Monto
          </label>
          <MoneyInput id="tx-amount" value={amount} onChange={setAmount} />
        </div>

        {type === "expense" ? (
          <div className="col-span-2">
            <label htmlFor="tx-category" className="mb-1 block text-sm font-medium text-text-secondary">
              Categoría
            </label>
            <select
              id="tx-category"
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
        ) : (
          <div className="col-span-2">
            <label htmlFor="tx-label" className="mb-1 block text-sm font-medium text-text-secondary">
              Etiqueta (opcional)
            </label>
            <input
              id="tx-label"
              list="income-label-suggestions"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Sueldo, Otro..."
              className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
            <datalist id="income-label-suggestions">
              {INCOME_LABEL_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        )}

        {type === "expense" && (
          <div className="col-span-2">
            <label htmlFor="tx-note" className="mb-1 block text-sm font-medium text-text-secondary">
              Nota (opcional)
            </label>
            <input
              id="tx-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Agregar {type === "expense" ? "gasto" : "ingreso"}
        </button>
        {feedback && (
          <span className="text-sm text-good-text">Guardado ✓</span>
        )}
      </div>
    </form>
  );
}
