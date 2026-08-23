"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import { formatCLP } from "@/lib/format";
import MoneyInput from "./MoneyInput";
import ConfirmDialog from "./ConfirmDialog";

interface GoalDraft {
  name: string;
  targetAmount: number;
  savedAmount: number;
  dueDate: string;
  protectedFlag: boolean;
}

const emptyDraft: GoalDraft = {
  name: "",
  targetAmount: 0,
  savedAmount: 0,
  dueDate: "",
  protectedFlag: false,
};

export default function GoalManager() {
  const { data, addGoal, updateGoal, deleteGoal } = useAppData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<GoalDraft>(emptyDraft);

  function startAdd() {
    setDraft(emptyDraft);
    setAdding(true);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">Metas de ahorro</h2>
        {!adding && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-lg border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            + Nueva meta
          </button>
        )}
      </div>

      <div className="flex flex-col divide-y divide-[var(--border)]">
        {data.goals.map((goal) =>
          editingId === goal.id ? (
            <GoalEditForm
              key={goal.id}
              initial={{
                name: goal.name,
                targetAmount: goal.targetAmount,
                savedAmount: goal.savedAmount,
                dueDate: goal.dueDate ?? "",
                protectedFlag: goal.protected,
              }}
              onSave={(d) => {
                updateGoal(goal.id, {
                  name: d.name.trim(),
                  targetAmount: d.targetAmount,
                  savedAmount: d.savedAmount,
                  dueDate: d.dueDate || undefined,
                  protected: d.protectedFlag,
                });
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={goal.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                  {goal.name}
                  {goal.protected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 text-accent">
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  )}
                </p>
                <p className="text-xs text-text-muted">
                  {formatCLP(goal.savedAmount)} de {formatCLP(goal.targetAmount)}
                  {goal.dueDate ? ` · vence ${goal.dueDate}` : ""}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(goal.id)}
                  className="rounded-md p-1.5 text-text-muted hover:bg-surface-card-hover hover:text-text-primary"
                  aria-label="Editar meta"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(goal.id)}
                  className="rounded-md p-1.5 text-text-muted hover:bg-critical/10 hover:text-critical"
                  aria-label="Eliminar meta"
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
          <GoalEditForm
            initial={draft}
            onSave={(d) => {
              setDraft(d);
              addGoal({
                name: d.name.trim(),
                targetAmount: d.targetAmount,
                savedAmount: d.savedAmount,
                dueDate: d.dueDate || undefined,
                protected: d.protectedFlag,
              });
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>

      <ConfirmDialog
        open={deletingId !== null}
        title="Eliminar meta"
        description="Se eliminará la meta y su historial de aportes. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (deletingId) deleteGoal(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

function GoalEditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: GoalDraft;
  onSave: (draft: GoalDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initial);

  return (
    <div className="flex flex-col gap-3 py-3">
      <input
        type="text"
        autoFocus
        value={draft.name}
        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        placeholder="Nombre de la meta"
        className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">
            Monto objetivo
          </label>
          <MoneyInput
            value={draft.targetAmount}
            onChange={(v) => setDraft((d) => ({ ...d, targetAmount: v }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">
            Monto acumulado
          </label>
          <MoneyInput
            value={draft.savedAmount}
            onChange={(v) => setDraft((d) => ({ ...d, savedAmount: v }))}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">
          Fecha límite (opcional)
        </label>
        <input
          type="date"
          value={draft.dueDate}
          onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
          className="w-full rounded-lg border border-border-strong bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-accent sm:w-52"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={draft.protectedFlag}
          onChange={(e) => setDraft((d) => ({ ...d, protectedFlag: e.target.checked }))}
          className="h-4 w-4 rounded border-border-strong accent-[var(--accent)]"
        />
        Meta protegida (pide confirmación antes de reducir el acumulado)
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => draft.name.trim() && onSave(draft)}
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
