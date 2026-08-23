"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, error, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page">
        <p className="text-sm text-text-muted">Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
        <div className="flex w-full max-w-xs flex-col items-center gap-6 rounded-2xl border border-border bg-surface-card p-8 shadow-sm">
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-text-primary">
              Control de gastos
            </h1>
            <p className="text-sm text-text-secondary">
              Inicia sesión para ver y sincronizar tus datos.
            </p>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface-page px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-card-hover"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.07.72-2.45 1.15-4.05 1.15-3.11 0-5.74-2.1-6.68-4.92H1.32v3.09A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.3A7.2 7.2 0 0 1 4.95 12c0-.8.14-1.57.37-2.3V6.61H1.32A12 12 0 0 0 0 12c0 1.94.46 3.77 1.32 5.39l4-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.32 6.61l4 3.09C6.26 6.86 8.89 4.75 12 4.75z"
              />
            </svg>
            Iniciar sesión con Google
          </button>

          {error && <p className="text-sm text-critical">{error}</p>}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
