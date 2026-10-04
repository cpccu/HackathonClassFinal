"use client";
import { useState } from "react";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "./actions";

export function LoginCard() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password") {
        setErrorMsg("Invalid email or password.");
      } else if (error?.code === "auth/email-already-in-use") {
        setErrorMsg("An account with this email already exists.");
      } else if (error?.code === "auth/weak-password") {
        setErrorMsg("Password should be at least 6 characters.");
      } else if (error?.message) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await signInWithGoogle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[12px] w-full max-w-sm border border-[var(--skipped)] shadow-sm">
      <h1 className="text-2xl font-bold mb-2">
        {mode === "login" ? "Welcome back" : "Create an account"}
      </h1>
      <p className="text-[var(--muted)] text-sm mb-6">
        {mode === "login" 
          ? "Enter your details to access your habits." 
          : "Start tracking your habits today."}
      </p>

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[var(--skipped)] rounded-[6px] px-3 py-2.5 bg-transparent focus:outline-none focus:border-[var(--accent)] text-sm"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[var(--skipped)] rounded-[6px] px-3 py-2.5 bg-transparent focus:outline-none focus:border-[var(--accent)] text-sm"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--ink)] text-[var(--bg)] py-2.5 rounded-[6px] font-medium mt-2 hover:opacity-90 disabled:opacity-70 transition-opacity"
        >
          {loading ? "Please wait..." : (mode === "login" ? "Log in" : "Sign up")}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-x-0 h-px bg-[var(--skipped)]"></div>
        <span className="relative bg-[var(--surface)] px-4 text-xs text-[var(--muted)] uppercase font-medium tracking-wider">
          Or
        </span>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full bg-[var(--bg)] border border-[var(--skipped)] text-[var(--ink)] py-2.5 rounded-[6px] font-medium hover:bg-[var(--skipped)] hover:bg-opacity-30 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      {errorMsg && (
        <p className="mt-4 text-[var(--danger)] text-sm text-center">{errorMsg}</p>
      )}

      <div className="mt-6 text-center text-sm">
        <p className="text-[var(--muted)]">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setErrorMsg("");
            }}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
