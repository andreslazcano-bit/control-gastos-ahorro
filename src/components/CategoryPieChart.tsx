"use client";

import { useState } from "react";
import type { CategorySpend } from "@/lib/calculations";
import { formatCLP } from "@/lib/format";

interface Props {
  categorySpend: CategorySpend[];
}

const SIZE = 160;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CategoryPieChart({ categorySpend }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = categorySpend.reduce((sum, c) => sum + c.spent, 0);
  const withSpend = categorySpend.filter((c) => c.spent > 0);

  const gap = withSpend.length > 1 ? 2 : 0;
  const dashLengths = withSpend.map((c) =>
    Math.max((total > 0 ? c.spent / total : 0) * CIRCUMFERENCE - gap, 0),
  );
  const cumulativeOffsets = dashLengths.map((_, i) =>
    dashLengths.slice(0, i).reduce((sum, d) => sum + d + gap, 0),
  );
  const segments = withSpend.map((c, i) => ({
    ...c,
    index: i,
    dasharray: `${dashLengths[i]} ${CIRCUMFERENCE - dashLengths[i]}`,
    dashoffset: -cumulativeOffsets[i],
    percent: total > 0 ? (c.spent / total) * 100 : 0,
  }));

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-4">
      <h2 className="mb-4 font-semibold text-text-primary">
        Distribución de gasto por categoría
      </h2>
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          Aún no hay gastos registrados este mes.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="var(--grid)"
                strokeWidth={STROKE}
              />
              {segments.map((seg) => (
                <circle
                  key={seg.category.id}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={seg.category.color}
                  strokeWidth={hovered === seg.index ? STROKE + 4 : STROKE}
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  opacity={hovered === null || hovered === seg.index ? 1 : 0.45}
                  style={{ transition: "opacity 150ms, stroke-width 150ms" }}
                  onMouseEnter={() => setHovered(seg.index)}
                  onMouseLeave={() => setHovered((h) => (h === seg.index ? null : h))}
                />
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-text-muted">Total</span>
              <span className="text-sm font-semibold tabular-nums text-text-primary">
                {formatCLP(total)}
              </span>
            </div>
          </div>

          <ul className="flex w-full flex-col gap-2">
            {segments
              .slice()
              .sort((a, b) => b.spent - a.spent)
              .map((seg) => (
                <li
                  key={seg.category.id}
                  onMouseEnter={() => setHovered(seg.index)}
                  onMouseLeave={() => setHovered((h) => (h === seg.index ? null : h))}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-sm transition-colors ${
                    hovered === seg.index ? "bg-surface-card-hover" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 text-text-primary">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: seg.category.color }}
                    />
                    {seg.category.name}
                  </span>
                  <span className="tabular-nums text-text-secondary">
                    {seg.percent.toFixed(0)}%
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
