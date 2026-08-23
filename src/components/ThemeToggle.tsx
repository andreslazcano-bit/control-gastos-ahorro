"use client";

import { useEffect, useState } from "react";
import {
  getStoredThemePreference,
  setStoredThemePreference,
  type ThemePreference,
} from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Sistema" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

function ThemeIcon({ theme }: { theme: ThemePreference }) {
  if (theme === "light") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  if (theme === "dark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Deferred to a mount effect so the server-rendered icon (always
    // "system", since localStorage isn't available server-side) matches the
    // client's first render, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getStoredThemePreference());
  }, []);

  function choose(next: ThemePreference) {
    setTheme(next);
    setStoredThemePreference(next);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-text-secondary hover:bg-surface-card-hover hover:text-text-primary"
        aria-label="Cambiar tema"
      >
        <ThemeIcon theme={theme} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-border bg-surface-card p-1 shadow-lg">
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(option.value)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium ${
                  theme === option.value
                    ? "bg-accent-soft text-accent"
                    : "text-text-secondary hover:bg-surface-card-hover hover:text-text-primary"
                }`}
              >
                <ThemeIcon theme={option.value} />
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
