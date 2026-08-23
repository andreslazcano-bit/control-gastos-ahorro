import { formatCLP } from "@/lib/format";

interface Props {
  label: string;
  amount: number;
  tone?: "default" | "good" | "critical";
  hint?: string;
}

const TONE_CLASS: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-text-primary",
  good: "text-good-text",
  critical: "text-critical",
};

export default function StatCard({ label, amount, tone = "default", hint }: Props) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface-card p-4">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <span
        className={`text-2xl font-semibold tabular-nums ${TONE_CLASS[tone]}`}
      >
        {formatCLP(amount)}
      </span>
      {hint && <span className="text-xs text-text-muted">{hint}</span>}
    </div>
  );
}
