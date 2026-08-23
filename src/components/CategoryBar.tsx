import { formatCLP } from "@/lib/format";
import type { CategorySpend } from "@/lib/calculations";

export default function CategoryBar({ category, spent, remaining, percent, overBudget }: CategorySpend) {
  const width = Math.min(100, Math.max(percent, 0));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="flex items-center gap-2 font-medium text-text-primary">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          {category.name}
        </span>
        <span className="tabular-nums text-text-secondary">
          {formatCLP(spent)}{" "}
          <span className="text-text-muted">/ {formatCLP(category.monthlyBudget)}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-grid">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${width}%`,
            backgroundColor: overBudget ? "var(--critical)" : category.color,
          }}
        />
      </div>
      {overBudget ? (
        <span className="flex items-center gap-1 text-xs font-medium text-critical">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          Sobre presupuesto por {formatCLP(spent - category.monthlyBudget)}
        </span>
      ) : (
        <span className="text-xs text-text-muted">
          Quedan {formatCLP(remaining)} este mes
        </span>
      )}
    </div>
  );
}
