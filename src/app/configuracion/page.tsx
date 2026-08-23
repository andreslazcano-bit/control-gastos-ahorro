"use client";

import { useAppData } from "@/context/DataContext";
import CategoryManager from "@/components/CategoryManager";
import GoalManager from "@/components/GoalManager";
import ExportImportBar from "@/components/ExportImportBar";
import RecurringIncomeManager from "@/components/RecurringIncomeManager";
import AccountManager from "@/components/AccountManager";

export default function ConfiguracionPage() {
  const { ready } = useAppData();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Configuración</h1>

      <RecurringIncomeManager />

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-card p-4">
        <h2 className="font-semibold text-text-primary">Respaldo de datos</h2>
        <p className="text-sm text-text-secondary">
          Tus datos se sincronizan solos vía Firestore, pero puedes descargar
          un respaldo manual en cualquier momento.
        </p>
        <div className="mt-2">
          <ExportImportBar />
        </div>
      </div>

      <CategoryManager />
      <GoalManager />
      <AccountManager />
    </div>
  );
}
