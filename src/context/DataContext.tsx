"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  AppData,
  Category,
  Expense,
  Goal,
  GoalContribution,
  Income,
} from "@/types";
import { generateId } from "@/lib/id";
import { defaultData, loadData, saveData } from "@/lib/storage";

interface DataContextValue {
  data: AppData;
  ready: boolean;
  replaceData: (data: AppData) => void;
  resetToDefaults: () => void;

  addIncome: (income: Omit<Income, "id">) => void;
  updateIncome: (id: string, patch: Partial<Omit<Income, "id">>) => void;
  deleteIncome: (id: string) => void;

  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, patch: Partial<Omit<Expense, "id">>) => void;
  deleteExpense: (id: string) => void;

  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, patch: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;

  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Omit<Goal, "id">>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (
    goalId: string,
    amount: number,
    note?: string,
  ) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Deferred to a mount effect (not a lazy useState initializer) so the
    // server-rendered markup (no localStorage) matches the client's first
    // render, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadData());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveData(data);
  }, [data, ready]);

  const replaceData = useCallback((next: AppData) => setData(next), []);
  const resetToDefaults = useCallback(() => setData(defaultData()), []);

  const addIncome = useCallback((income: Omit<Income, "id">) => {
    setData((d) => ({
      ...d,
      incomes: [...d.incomes, { ...income, id: generateId() }],
    }));
  }, []);

  const updateIncome = useCallback(
    (id: string, patch: Partial<Omit<Income, "id">>) => {
      setData((d) => ({
        ...d,
        incomes: d.incomes.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      }));
    },
    [],
  );

  const deleteIncome = useCallback((id: string) => {
    setData((d) => ({ ...d, incomes: d.incomes.filter((i) => i.id !== id) }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setData((d) => ({
      ...d,
      expenses: [...d.expenses, { ...expense, id: generateId() }],
    }));
  }, []);

  const updateExpense = useCallback(
    (id: string, patch: Partial<Omit<Expense, "id">>) => {
      setData((d) => ({
        ...d,
        expenses: d.expenses.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      }));
    },
    [],
  );

  const deleteExpense = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      expenses: d.expenses.filter((e) => e.id !== id),
    }));
  }, []);

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    setData((d) => ({
      ...d,
      categories: [...d.categories, { ...category, id: generateId() }],
    }));
  }, []);

  const updateCategory = useCallback(
    (id: string, patch: Partial<Omit<Category, "id">>) => {
      setData((d) => ({
        ...d,
        categories: d.categories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }));
    },
    [],
  );

  const deleteCategory = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      categories: d.categories.filter((c) => c.id !== id),
      expenses: d.expenses.filter((e) => e.categoryId !== id),
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    setData((d) => ({
      ...d,
      goals: [...d.goals, { ...goal, id: generateId() }],
    }));
  }, []);

  const updateGoal = useCallback(
    (id: string, patch: Partial<Omit<Goal, "id">>) => {
      setData((d) => ({
        ...d,
        goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
    },
    [],
  );

  const deleteGoal = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      goals: d.goals.filter((g) => g.id !== id),
      goalContributions: d.goalContributions.filter((c) => c.goalId !== id),
    }));
  }, []);

  const contributeToGoal = useCallback(
    (goalId: string, amount: number, note?: string) => {
      setData((d) => {
        const contribution: GoalContribution = {
          id: generateId(),
          goalId,
          date: new Date().toISOString().slice(0, 10),
          amount,
          note,
        };
        return {
          ...d,
          goals: d.goals.map((g) =>
            g.id === goalId
              ? { ...g, savedAmount: g.savedAmount + amount }
              : g,
          ),
          goalContributions: [...d.goalContributions, contribution],
        };
      });
    },
    [],
  );

  return (
    <DataContext.Provider
      value={{
        data,
        ready,
        replaceData,
        resetToDefaults,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        addGoal,
        updateGoal,
        deleteGoal,
        contributeToGoal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAppData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAppData must be used within DataProvider");
  return ctx;
}
