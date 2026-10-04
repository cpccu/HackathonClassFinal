"use client";
import { useState } from "react";
import { signInWithGoogle } from "./actions";

export function LoginCard() {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error?.code === "auth/popup-closed-by-user") {
        // do nothing
      } else if (error?.code === "auth/popup-blocked") {
        setErrorMsg(
          "Your browser blocked the sign-in window. Allow pop-ups for this site and try again."
        );
      } else {
        setErrorMsg("Sign-in failed. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] p-8 rounded-[12px] w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6">Habit Tracker</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-[var(--accent)] text-white py-3 rounded-[6px] font-medium"
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
      {errorMsg && (
        <p className="mt-4 text-[var(--danger)] text-sm">{errorMsg}</p>
      )}
    </div>
  );
}
