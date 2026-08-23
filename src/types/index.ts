export type Id = string;

/** ISO date string, e.g. "2026-08-23" */
export type IsoDate = string;

export interface Income {
  id: Id;
  date: IsoDate;
  amount: number;
  label?: string;
}

export interface Category {
  id: Id;
  name: string;
  monthlyBudget: number;
  color: string;
}

export interface Expense {
  id: Id;
  date: IsoDate;
  categoryId: Id;
  amount: number;
  note?: string;
}

export interface Goal {
  id: Id;
  name: string;
  targetAmount: number;
  savedAmount: number;
  dueDate?: IsoDate;
  protected: boolean;
}

/** A contribution (positive) or withdrawal (negative) applied to a goal's savedAmount. */
export interface GoalContribution {
  id: Id;
  goalId: Id;
  date: IsoDate;
  amount: number;
  note?: string;
}

export interface AppData {
  incomes: Income[];
  categories: Category[];
  expenses: Expense[];
  goals: Goal[];
  goalContributions: GoalContribution[];
}

export const DATA_VERSION = 1;

export interface ExportedData extends AppData {
  version: number;
  exportedAt: string;
}
