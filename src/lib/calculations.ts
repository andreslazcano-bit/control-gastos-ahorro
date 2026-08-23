import type { AppData, Category, Expense } from "@/types";
import { isInMonth } from "./format";

export interface CategorySpend {
  category: Category;
  spent: number;
  remaining: number;
  percent: number;
  overBudget: boolean;
}

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
  totalBudget: number;
  theoreticalSavingsCapacity: number;
  actualSavings: number;
  categorySpend: CategorySpend[];
}

export function getMonthSummary(
  data: AppData,
  year: number,
  month: number,
): MonthSummary {
  const totalIncome = data.incomes
    .filter((i) => isInMonth(i.date, year, month))
    .reduce((sum, i) => sum + i.amount, 0);

  const monthExpenses: Expense[] = data.expenses.filter((e) =>
    isInMonth(e.date, year, month),
  );

  const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const totalBudget = data.categories.reduce(
    (sum, c) => sum + c.monthlyBudget,
    0,
  );

  const categorySpend: CategorySpend[] = data.categories.map((category) => {
    const spent = monthExpenses
      .filter((e) => e.categoryId === category.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const remaining = category.monthlyBudget - spent;
    const percent =
      category.monthlyBudget > 0
        ? (spent / category.monthlyBudget) * 100
        : spent > 0
          ? 100
          : 0;
    return {
      category,
      spent,
      remaining,
      percent,
      overBudget: spent > category.monthlyBudget,
    };
  });

  return {
    totalIncome,
    totalExpense,
    totalBudget,
    theoreticalSavingsCapacity: totalIncome - totalBudget,
    actualSavings: totalIncome - totalExpense,
    categorySpend,
  };
}

export interface MonthPoint {
  year: number;
  month: number;
  total: number;
}

/** Total expense per month for the last `count` months, ending at year/month (inclusive). */
export function getExpenseTrend(
  data: AppData,
  year: number,
  month: number,
  count: number,
): MonthPoint[] {
  const points: MonthPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const total = data.expenses
      .filter((e) => isInMonth(e.date, y, m))
      .reduce((sum, e) => sum + e.amount, 0);
    points.push({ year: y, month: m, total });
  }
  return points;
}
