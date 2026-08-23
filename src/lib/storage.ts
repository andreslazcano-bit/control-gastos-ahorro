import { generateId } from "./id";
import type { AppData, ExportedData } from "@/types";
import { DATA_VERSION } from "@/types";

export const STORAGE_KEY = "gastos-ahorro:data";

export function defaultData(): AppData {
  const catArriendo = generateId();
  const catComunes = generateId();
  const catComida = generateId();
  const catServicios = generateId();
  const catExtras = generateId();

  return {
    incomes: [],
    categories: [
      {
        id: catArriendo,
        name: "Arriendo",
        monthlyBudget: 490_000,
        color: "var(--series-1)",
      },
      {
        id: catComunes,
        name: "Gastos comunes",
        monthlyBudget: 90_000,
        color: "var(--series-2)",
      },
      {
        id: catComida,
        name: "Comida",
        monthlyBudget: 300_000,
        color: "var(--series-3)",
      },
      {
        id: catServicios,
        name: "Servicios básicos",
        monthlyBudget: 100_000,
        color: "var(--series-4)",
      },
      {
        id: catExtras,
        name: "Gastos extras",
        monthlyBudget: 400_000,
        color: "var(--series-5)",
      },
    ],
    expenses: [],
    goals: [
      {
        id: generateId(),
        name: "Postgrado",
        targetAmount: 4_000_000,
        savedAmount: 1_000_000,
        dueDate: "2026-12-31",
        protected: false,
      },
      {
        id: generateId(),
        name: "Pie departamento",
        targetAmount: 13_000_000,
        savedAmount: 13_000_000,
        protected: true,
      },
    ],
    goalContributions: [],
    recurringIncome: null,
  };
}

/**
 * Removes data left over in localStorage from before Firestore sync existed.
 * It's no longer read for anything (a shared device could otherwise leak one
 * person's leftover local data into a different person's new account), so
 * this just clears the stale key.
 */
export function clearLegacyLocalData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportDataToFile(data: AppData): void {
  const payload: ExportedData = {
    ...data,
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `control-gastos-ahorro-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedFile(text: string): AppData {
  const parsed = JSON.parse(text) as Partial<ExportedData>;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Archivo inválido.");
  }
  return {
    incomes: parsed.incomes ?? [],
    categories: parsed.categories ?? [],
    expenses: parsed.expenses ?? [],
    goals: parsed.goals ?? [],
    goalContributions: parsed.goalContributions ?? [],
    recurringIncome: parsed.recurringIncome ?? null,
  };
}
