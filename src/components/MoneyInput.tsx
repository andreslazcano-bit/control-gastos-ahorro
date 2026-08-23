"use client";

interface Props {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  id?: string;
  autoFocus?: boolean;
}

export default function MoneyInput({ value, onChange, placeholder, id, autoFocus }: Props) {
  const display = value ? new Intl.NumberFormat("es-CL").format(value) : "";

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
        $
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoFocus={autoFocus}
        value={display}
        placeholder={placeholder ?? "0"}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChange(digits ? parseInt(digits, 10) : 0);
        }}
        className="w-full rounded-lg border border-border-strong bg-surface-page py-2 pl-7 pr-3 text-sm text-text-primary outline-none focus:border-accent"
      />
    </div>
  );
}
