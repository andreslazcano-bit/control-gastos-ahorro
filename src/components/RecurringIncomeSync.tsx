"use client";

import { useEffect } from "react";
import { useAppData } from "@/context/DataContext";
import { isInMonth, todayIso } from "@/lib/format";

/**
 * Auto-registers the configured monthly salary as an income the first time
 * the app is opened in a given month. Only runs client-side on mount/data
 * change — there's no server-side scheduler, so it fires on open, not on the
 * 1st at midnight.
 */
export default function RecurringIncomeSync() {
  const { data, ready, addIncome } = useAppData();
  const recurringIncome = data.recurringIncome;

  useEffect(() => {
    if (!ready || !recurringIncome) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const alreadyRegistered = data.incomes.some(
      (income) =>
        isInMonth(income.date, year, month) &&
        income.label === recurringIncome.label,
    );

    if (!alreadyRegistered) {
      addIncome({
        date: todayIso(),
        amount: recurringIncome.amount,
        label: recurringIncome.label,
      });
    }
  }, [ready, recurringIncome, data.incomes, addIncome]);

  return null;
}
