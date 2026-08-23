"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { isEmailAllowed } from "@/lib/allowedEmails";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser && !isEmailAllowed(nextUser.email)) {
        setError("Esta cuenta no está autorizada para usar esta app.");
        firebaseSignOut(auth).catch(() => {});
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function signInWithGoogle() {
    setError(null);
    signInWithPopup(auth, googleProvider).catch((err) => {
      // Popups blocked or closed by the user aren't real errors worth showing.
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request")
      ) {
        return;
      }
      console.error("Google sign-in failed", err);
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    });
  }

  function signOut() {
    firebaseSignOut(auth).catch(() => {
      // Nothing actionable if sign-out itself fails locally.
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
