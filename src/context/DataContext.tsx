"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import type {
  AppData,
  Category,
  Expense,
  Goal,
  GoalContribution,
  Income,
  RecurringIncome,
} from "@/types";
import { generateId } from "@/lib/id";
import { defaultData, loadLegacyLocalData } from "@/lib/storage";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

interface DataContextValue {
  data: AppData;
  ready: boolean;
  error: string | null;
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

  setRecurringIncome: (recurringIncome: RecurringIncome | null) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [data, setData] = useState<AppData>(defaultData());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      // Signed out: stop showing synced data from a previous session.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(false);
      return;
    }

    setReady(false);
    setError(null);
    const ref = doc(db, "users", uid);
    let cancelled = false;

    getDoc(ref)
      .then((snap) => {
        if (!cancelled && !snap.exists()) {
          return setDoc(ref, loadLegacyLocalData());
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? `No se pudieron cargar tus datos: ${err.message}`
              : "No se pudieron cargar tus datos.",
          );
          setReady(true);
        }
      });

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData(snap.data() as AppData);
        }
        setReady(true);
      },
      (err) => {
        setError(`No se pudieron cargar tus datos: ${err.message}`);
        setReady(true);
      },
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [uid]);

  const writeData = useCallback(
    (updater: (current: AppData) => AppData) => {
      if (!uid) return;
      const next = updater(data);
      setData(next);
      setDoc(doc(db, "users", uid), next).catch(() => {
        // Offline persistence queues the write locally; it'll sync once
        // back online, so a rejected promise here isn't actionable.
      });
    },
    [uid, data],
  );

  const replaceData = useCallback(
    (next: AppData) => writeData(() => next),
    [writeData],
  );
  const resetToDefaults = useCallback(
    () => writeData(() => defaultData()),
    [writeData],
  );

  const addIncome = useCallback(
    (income: Omit<Income, "id">) => {
      writeData((d) => ({
        ...d,
        incomes: [...d.incomes, { ...income, id: generateId() }],
      }));
    },
    [writeData],
  );

  const updateIncome = useCallback(
    (id: string, patch: Partial<Omit<Income, "id">>) => {
      writeData((d) => ({
        ...d,
        incomes: d.incomes.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      }));
    },
    [writeData],
  );

  const deleteIncome = useCallback(
    (id: string) => {
      writeData((d) => ({ ...d, incomes: d.incomes.filter((i) => i.id !== id) }));
    },
    [writeData],
  );

  const addExpense = useCallback(
    (expense: Omit<Expense, "id">) => {
      writeData((d) => ({
        ...d,
        expenses: [...d.expenses, { ...expense, id: generateId() }],
      }));
    },
    [writeData],
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<Omit<Expense, "id">>) => {
      writeData((d) => ({
        ...d,
        expenses: d.expenses.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      }));
    },
    [writeData],
  );

  const deleteExpense = useCallback(
    (id: string) => {
      writeData((d) => ({
        ...d,
        expenses: d.expenses.filter((e) => e.id !== id),
      }));
    },
    [writeData],
  );

  const addCategory = useCallback(
    (category: Omit<Category, "id">) => {
      writeData((d) => ({
        ...d,
        categories: [...d.categories, { ...category, id: generateId() }],
      }));
    },
    [writeData],
  );

  const updateCategory = useCallback(
    (id: string, patch: Partial<Omit<Category, "id">>) => {
      writeData((d) => ({
        ...d,
        categories: d.categories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }));
    },
    [writeData],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      writeData((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== id),
        expenses: d.expenses.filter((e) => e.categoryId !== id),
      }));
    },
    [writeData],
  );

  const addGoal = useCallback(
    (goal: Omit<Goal, "id">) => {
      writeData((d) => ({
        ...d,
        goals: [...d.goals, { ...goal, id: generateId() }],
      }));
    },
    [writeData],
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Omit<Goal, "id">>) => {
      writeData((d) => ({
        ...d,
        goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
    },
    [writeData],
  );

  const deleteGoal = useCallback(
    (id: string) => {
      writeData((d) => ({
        ...d,
        goals: d.goals.filter((g) => g.id !== id),
        goalContributions: d.goalContributions.filter((c) => c.goalId !== id),
      }));
    },
    [writeData],
  );

  const contributeToGoal = useCallback(
    (goalId: string, amount: number, note?: string) => {
      writeData((d) => {
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
    [writeData],
  );

  const setRecurringIncome = useCallback(
    (recurringIncome: RecurringIncome | null) => {
      writeData((d) => ({ ...d, recurringIncome }));
    },
    [writeData],
  );

  return (
    <DataContext.Provider
      value={{
        data,
        ready,
        error,
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
        setRecurringIncome,
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
