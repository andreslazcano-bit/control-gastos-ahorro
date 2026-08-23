"use client";

import { useState } from "react";
import type { MonthPoint } from "@/lib/calculations";
import { formatCLP, monthShortLabel } from "@/lib/format";

interface Props {
  points: MonthPoint[];
}

export default function TrendChart({ points }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...points.map((p) => p.total));

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-4">
      <h2 className="mb-4 font-semibold text-text-primary">
        Gasto total por mes
      </h2>
      <div className="flex h-48 items-end gap-2 sm:gap-3">
        {points.map((p, i) => {
          const heightPct = (p.total / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={`${p.year}-${p.month}`}
              className="relative flex flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              {isHovered && (
                <div className="absolute -top-9 z-10 whitespace-nowrap rounded-md border border-border bg-surface-card px-2 py-1 text-xs font-medium text-text-primary shadow-md">
                  {formatCLP(p.total)}
                </div>
              )}
              <div
                className="w-full rounded-t-[4px] transition-colors"
                style={{
                  height: `${Math.max(heightPct, p.total > 0 ? 2 : 0)}%`,
                  backgroundColor: isHovered ? "var(--series-1)" : "var(--accent)",
                  minHeight: p.total > 0 ? 4 : 0,
                }}
              />
              <span className="mt-2 text-[11px] capitalize text-text-muted">
                {monthShortLabel(p.year, p.month)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
