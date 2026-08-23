"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataContext";
import GoalCard from "@/components/GoalCard";
import ContributionModal from "@/components/ContributionModal";

export default function GoalsPage() {
  const { data, ready, contributeToGoal } = useAppData();
  const [contributingGoalId, setContributingGoalId] = useState<string | null>(null);

  if (!ready) return null;

  const contributingGoal = data.goals.find((g) => g.id === contributingGoalId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Metas de ahorro</h1>

      {data.goals.length === 0 ? (
        <p className="text-sm text-text-muted">
          No tienes metas de ahorro configuradas. Agrega una en Configuración.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={() => setContributingGoalId(goal.id)}
            />
          ))}
        </div>
      )}

      {contributingGoal && (
        <ContributionModal
          goal={contributingGoal}
          onClose={() => setContributingGoalId(null)}
          onSubmit={(amount, note) => {
            contributeToGoal(contributingGoal.id, amount, note);
            setContributingGoalId(null);
          }}
        />
      )}
    </div>
  );
}
