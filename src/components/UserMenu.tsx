"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border-strong"
        aria-label="Cuenta"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element -- external Google avatar, not a local asset
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-xs font-semibold text-text-secondary">
            {(user.displayName ?? user.email ?? "?").slice(0, 1).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-surface-card p-2 shadow-lg">
            <p className="truncate px-2 py-1 text-sm font-medium text-text-primary">
              {user.displayName ?? "Cuenta"}
            </p>
            {user.email && (
              <p className="truncate px-2 pb-2 text-xs text-text-muted">{user.email}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full rounded-md px-2 py-1.5 text-left text-sm font-medium text-critical hover:bg-critical/10"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
