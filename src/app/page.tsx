"use client";

import { useMemo, useState } from "react";
import { useAppData } from "@/context/DataContext";
import { getExpenseTrend, getMonthSummary } from "@/lib/calculations";
import MonthSelector from "@/components/MonthSelector";
import StatCard from "@/components/StatCard";
import CategoryBar from "@/components/CategoryBar";
import TransactionForm from "@/components/TransactionForm";
import TrendChart from "@/components/TrendChart";
import CategoryPieChart from "@/components/CategoryPieChart";

export default function DashboardPage() {
  const { data, ready } = useAppData();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [trendMonths, setTrendMonths] = useState(6);

  const summary = useMemo(
    () => getMonthSummary(data, year, month),
    [data, year, month],
  );
  const trend = useMemo(
    () => getExpenseTrend(data, year, month, trendMonths),
    [data, year, month, trendMonths],
  );

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ingreso del mes" amount={summary.totalIncome} />
        <StatCard label="Gasto del mes" amount={summary.totalExpense} tone="critical" />
        <StatCard
          label="Capacidad de ahorro teórica"
          amount={summary.theoreticalSavingsCapacity}
          hint="Ingreso menos presupuesto total"
        />
        <StatCard
          label="Ahorro real del mes"
          amount={summary.actualSavings}
          tone={summary.actualSavings >= 0 ? "good" : "critical"}
          hint="Ingreso menos gasto real"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-card p-4">
          <h2 className="font-semibold text-text-primary">
            Gasto real vs. presupuestado por categoría
          </h2>
          <div className="flex flex-col gap-4">
            {summary.categorySpend.map((cs) => (
              <CategoryBar key={cs.category.id} {...cs} />
            ))}
          </div>
        </div>

        <TransactionForm />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-end gap-1">
            {[6, 12].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTrendMonths(n)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  trendMonths === n
                    ? "bg-accent-soft text-accent"
                    : "text-text-muted hover:bg-surface-card-hover"
                }`}
              >
                {n} meses
              </button>
            ))}
          </div>
          <TrendChart points={trend} />
        </div>
        <CategoryPieChart categorySpend={summary.categorySpend} />
      </div>
    </div>
  );
}
