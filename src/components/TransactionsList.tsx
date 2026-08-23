"use client";

import { useMemo, useState } from "react";
import { useAppData } from "@/context/DataContext";
import { formatCLP, formatDate, isInMonth } from "@/lib/format";
import ConfirmDialog from "./ConfirmDialog";
import EditTransactionModal from "./EditTransactionModal";

type Row =
  | { kind: "expense"; id: string; date: string; amount: number; categoryId: string; note?: string }
  | { kind: "income"; id: string; date: string; amount: number; label?: string };

interface Props {
  year: number;
  month: number;
  showAllMonths: boolean;
}

export default function TransactionsList({ year, month, showAllMonths }: Props) {
  const { data, deleteExpense, deleteIncome } = useAppData();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const categoryById = useMemo(
    () => new Map(data.categories.map((c) => [c.id, c])),
    [data.categories],
  );

  const rows: Row[] = useMemo(() => {
    const expenseRows: Row[] = data.expenses.map((e) => ({
      kind: "expense",
      id: e.id,
      date: e.date,
      amount: e.amount,
      categoryId: e.categoryId,
      note: e.note,
    }));
    const incomeRows: Row[] = data.incomes.map((i) => ({
      kind: "income",
      id: i.id,
      date: i.date,
      amount: i.amount,
      label: i.label,
    }));
    return [...expenseRows, ...incomeRows]
      .filter((r) => showAllMonths || isInMonth(r.date, year, month))
      .filter((r) => {
        if (categoryFilter === "all") return true;
        if (categoryFilter === "income") return r.kind === "income";
        return r.kind === "expense" && r.categoryId === categoryFilter;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [data.expenses, data.incomes, year, month, showAllMonths, categoryFilter]);

  function handleDelete(row: Row) {
    if (row.kind === "expense") deleteExpense(row.id);
    else deleteIncome(row.id);
    setDeleting(null);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-text-primary">Historial de transacciones</h2>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border-strong bg-surface-page px-3 py-1.5 text-sm text-text-primary outline-none focus:border-accent"
        >
          <option value="all">Todas las categorías</option>
          <option value="income">Ingresos</option>
          {data.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          No hay transacciones para este filtro.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="py-2 pr-2 font-medium">Fecha</th>
                <th className="py-2 pr-2 font-medium">Categoría / Etiqueta</th>
                <th className="py-2 pr-2 font-medium">Nota</th>
                <th className="py-2 pr-2 text-right font-medium">Monto</th>
                <th className="py-2 pl-2 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const category = row.kind === "expense" ? categoryById.get(row.categoryId) : null;
                return (
                  <tr key={`${row.kind}-${row.id}`} className="border-b border-border last:border-0">
                    <td className="py-2 pr-2 tabular-nums text-text-secondary">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-2 pr-2">
                      {row.kind === "expense" ? (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: category?.color ?? "var(--text-muted)" }}
                          />
                          {category?.name ?? "Sin categoría"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-good/15 px-2 py-0.5 text-xs font-medium text-good-text">
                          {row.label || "Ingreso"}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-2 text-text-muted">
                      {row.kind === "expense" ? row.note ?? "—" : "—"}
                    </td>
                    <td
                      className={`py-2 pr-2 text-right tabular-nums font-medium ${
                        row.kind === "expense" ? "text-critical" : "text-good-text"
                      }`}
                    >
                      {row.kind === "expense" ? "-" : "+"}
                      {formatCLP(row.amount)}
                    </td>
                    <td className="py-2 pl-2">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(row)}
                          aria-label="Editar"
                          className="rounded-md p-1.5 text-text-muted hover:bg-surface-card-hover hover:text-text-primary"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(row)}
                          aria-label="Eliminar"
                          className="rounded-md p-1.5 text-text-muted hover:bg-critical/10 hover:text-critical"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditTransactionModal row={editing} onClose={() => setEditing(null)} />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar transacción"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
        onConfirm={() => deleting && handleDelete(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export type { Row };
