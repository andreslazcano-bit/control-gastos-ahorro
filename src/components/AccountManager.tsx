"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";

export default function AccountManager() {
  const { user, signOut } = useAuth();
  const [confirming, setConfirming] = useState(false);

  if (!user) return null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-card p-4">
      <h2 className="font-semibold text-text-primary">Cuenta</h2>
      <p className="text-sm text-text-secondary">
        Sesión iniciada como{" "}
        <span className="font-medium text-text-primary">{user.email}</span>.
      </p>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-2 self-start rounded-lg border border-critical px-3 py-1.5 text-sm font-medium text-critical hover:bg-critical/10"
      >
        Cerrar sesión
      </button>

      <ConfirmDialog
        open={confirming}
        title="Cerrar sesión"
        description="Vas a tener que volver a iniciar sesión con Google la próxima vez que abras la app."
        confirmLabel="Cerrar sesión"
        danger
        onConfirm={() => {
          setConfirming(false);
          signOut();
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
