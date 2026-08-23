import type { Goal } from "@/types";
import { daysRemaining, formatCLP, formatDate } from "@/lib/format";

interface Props {
  goal: Goal;
  onContribute: () => void;
}

export default function GoalCard({ goal, onContribute }: Props) {
  const percent = goal.targetAmount > 0
    ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
    : 0;
  const missing = Math.max(0, goal.targetAmount - goal.savedAmount);
  const missingPercent = goal.targetAmount > 0 ? (missing / goal.targetAmount) * 100 : 0;
  const complete = goal.savedAmount >= goal.targetAmount;
  const remaining = goal.dueDate ? daysRemaining(goal.dueDate) : null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-primary">{goal.name}</h3>
          {goal.protected && (
            <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Protegida
            </span>
          )}
        </div>
        {complete && (
          <span className="rounded-full bg-good/15 px-2 py-0.5 text-xs font-medium text-good-text">
            Completa
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-grid">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="tabular-nums font-medium text-text-primary">
            {formatCLP(goal.savedAmount)}
          </span>
          <span className="tabular-nums text-text-muted">
            de {formatCLP(goal.targetAmount)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
        <span>
          {complete
            ? "Meta alcanzada"
            : `Faltan ${formatCLP(missing)} (${missingPercent.toFixed(0)}%)`}
        </span>
        {goal.dueDate && remaining !== null && (
          <span className={remaining < 0 ? "text-critical" : undefined}>
            {remaining < 0
              ? `Venció el ${formatDate(goal.dueDate)}`
              : `${remaining} días restantes · ${formatDate(goal.dueDate)}`}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onContribute}
        className="mt-1 self-start rounded-lg border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft"
      >
        Agregar aporte
      </button>
    </div>
  );
}
