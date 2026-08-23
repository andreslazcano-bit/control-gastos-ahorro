"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const CORRECT_PIN = "0556";
const PIN_LENGTH = 4;

export default function PinGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  if (unlocked) return <>{children}</>;

  function handleChange(index: number, value: string) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);

    if (clean && index < PIN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const pin = next.join("");
    if (pin.length !== PIN_LENGTH) return;
    if (pin === CORRECT_PIN) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => {
        setDigits(Array(PIN_LENGTH).fill(""));
        setError(false);
        inputsRef.current[0]?.focus();
      }, 500);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page px-4">
      <div className="w-full max-w-xs flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
            >
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-text-primary">
            Control de gastos
          </h1>
          <p className="text-sm text-text-secondary">
            Ingresa tu PIN para continuar
          </p>
        </div>

        <div className="flex gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-12 w-12 rounded-lg border text-center text-xl font-semibold outline-none transition-colors ${
                error
                  ? "border-critical text-critical"
                  : "border-border-strong text-text-primary focus:border-accent"
              } bg-surface-page`}
              aria-label={`Dígito ${i + 1} del PIN`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-critical">PIN incorrecto, intenta de nuevo.</p>
        )}
      </div>
    </div>
  );
}
