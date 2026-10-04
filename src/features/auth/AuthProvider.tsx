"use client";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/shared/firebase/client";

type AuthState = { user: User | null; status: "loading" | "in" | "out" };
export const AuthContext = createContext<AuthState>({
  user: null,
  status: "loading",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    status: "loading",
  });

  // Fires once on load with the restored session, then on every sign in/out.
  useEffect(() => {
    // If auth state takes too long (e.g. adblocker blocking iframe, offline),
    // fallback to "out" so the user isn't stuck on an infinite loading screen.
    const timeout = setTimeout(() => {
      setState((prev) => 
        prev.status === "loading" ? { user: null, status: "out" } : prev
      );
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout);
      setState({ user, status: user ? "in" : "out" });
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
