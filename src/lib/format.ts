const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatCLP(amount: number): string {
  return clpFormatter.format(Math.round(amount));
}

/** Parses a user-typed CLP string (with dots, spaces, $) back into a number. */
export function parseCLP(value: string): number {
  const digits = value.replace(/[^0-9-]/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function monthShortLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month].slice(0, 3)} ${String(year).slice(2)}`;
}

/** True if the given ISO date falls within the given year/month (month is 0-indexed). */
export function isInMonth(iso: string, year: number, month: number): boolean {
  if (!iso) return false;
  const [y, m] = iso.split("-").map(Number);
  return y === year && m - 1 === month;
}

export function daysRemaining(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const due = new Date(y, (m ?? 1) - 1, d ?? 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}
