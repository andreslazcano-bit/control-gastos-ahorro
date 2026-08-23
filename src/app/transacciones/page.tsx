"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import MonthSelector from "@/components/MonthSelector";
import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";

export default function TransactionsPage() {
  const { ready } = useAppData();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [showAllMonths, setShowAllMonths] = useState(false);

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text-primary">Transacciones</h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={showAllMonths}
              onChange={(e) => setShowAllMonths(e.target.checked)}
              className="h-4 w-4 rounded border-border-strong accent-[var(--accent)]"
            />
            Ver todos los meses
          </label>
          {!showAllMonths && (
            <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
          )}
        </div>
      </div>

      <TransactionForm />

      <TransactionsList year={year} month={month} showAllMonths={showAllMonths} />
    </div>
  );
}
