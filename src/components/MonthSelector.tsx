"use client";

import { monthLabel } from "@/lib/format";

interface Props {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthSelector({ year, month, onChange }: Props) {
  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    onChange(d.getFullYear(), d.getMonth());
  }

  function goToday() {
    const d = new Date();
    onChange(d.getFullYear(), d.getMonth());
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => shift(-1)}
        aria-label="Mes anterior"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-text-secondary transition-colors hover:bg-surface-card-hover"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goToday}
        className="min-w-[10rem] rounded-lg border border-border-strong px-3 py-1.5 text-sm font-semibold capitalize text-text-primary hover:bg-surface-card-hover"
      >
        {monthLabel(year, month)}
      </button>
      <button
        type="button"
        onClick={() => shift(1)}
        aria-label="Mes siguiente"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-text-secondary transition-colors hover:bg-surface-card-hover"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
