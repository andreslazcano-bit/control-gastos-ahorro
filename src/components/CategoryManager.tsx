"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import { formatCLP } from "@/lib/format";
import MoneyInput from "./MoneyInput";
import ConfirmDialog from "./ConfirmDialog";

const PALETTE = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
];

export default function CategoryManager() {
  const { data, addCategory, updateCategory, deleteCategory } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftBudget, setDraftBudget] = useState(0);
  const [draftColor, setDraftColor] = useState(PALETTE[0]);

  function startAdd() {
    setAdding(true);
    setDraftName("");
    setDraftBudget(0);
    setDraftColor(PALETTE[data.categories.length % PALETTE.length]);
  }

  function confirmAdd() {
    if (!draftName.trim()) return;
    addCategory({ name: draftName.trim(), monthlyBudget: draftBudget, color: draftColor });
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Categorías de gasto</h2>
        {!adding && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-lg border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            + Nueva categoría
          </button>
        )}
      </div>

      <div className="flex flex-col divide-y divide-[var(--border)]">
        {data.categories.map((category) =>
          editingId === category.id ? (
            <CategoryEditRow
              key={category.id}
              name={category.name}
              budget={category.monthlyBudget}
              color={category.color}
              onSave={(name, budget, color) => {
                updateCategory(category.id, { name, monthlyBudget: budget, color });
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={category.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">{category.name}</p>
                  <p className="text-xs text-text-muted">
                    Presupuesto: {formatCLP(category.monthlyBudget)}/mes
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(category.id)}
                  className="rounded-md p-1.5 text-text-muted hover:bg-surface-card-hover hover:text-text-primary"
                  aria-label="Editar categoría"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(category.id)}
                  className="rounded-md p-1.5 text-text-muted hover:bg-critical/10 hover:text-critical"
                  aria-label="Eliminar categoría"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                  </svg>
                </button>
              </div>
            </div>
          ),
        )}

        {adding && (
          <div className="flex flex-col gap-3 py-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="text"
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
              />
              <div className="sm:w-40">
                <MoneyInput value={draftBudget} onChange={setDraftBudget} placeholder="Presupuesto" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setDraftColor(color)}
                  className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-[var(--surface-card)] ${
                    draftColor === color ? "ring-2 ring-accent" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label="Elegir color"
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={confirmAdd}
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deletingId !== null}
        title="Eliminar categoría"
        description="Se eliminará la categoría y todos los gastos registrados en ella. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deletingId) deleteCategory(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

function CategoryEditRow({
  name,
  budget,
  color,
  onSave,
  onCancel,
}: {
  name: string;
  budget: number;
  color: string;
  onSave: (name: string, budget: number, color: string) => void;
  onCancel: () => void;
}) {
  const [draftName, setDraftName] = useState(name);
  const [draftBudget, setDraftBudget] = useState(budget);
  const [draftColor, setDraftColor] = useState(color);

  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          autoFocus
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <div className="sm:w-40">
          <MoneyInput value={draftBudget} onChange={setDraftBudget} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setDraftColor(c)}
            className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-[var(--surface-card)] ${
              draftColor === c ? "ring-2 ring-accent" : ""
            }`}
            style={{ backgroundColor: c }}
            aria-label="Elegir color"
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => draftName.trim() && onSave(draftName.trim(), draftBudget, draftColor)}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
