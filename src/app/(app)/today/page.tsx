"use client";
import Link from "next/link";
import { useAuth, signOutUser } from "@/features/auth";

export default function TodayPage() {
  const { user } = useAuth();
  
  return (
    <div className="p-8 w-full max-w-lg mx-auto flex flex-col flex-1">
      <h1 className="text-2xl font-bold mb-4">Today</h1>
      <p className="mb-4 text-[var(--muted)]">Signed in as {user?.email}</p>
      
      <div className="flex gap-4 mb-8">
        <Link 
          href="/settings"
          className="text-[var(--accent)] font-medium hover:underline"
        >
          Go to Settings
        </Link>
      </div>

      <button
        onClick={signOutUser}
        className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--skipped)] px-4 py-2 rounded-[6px]"
      >
        Sign out
      </button>
    </div>
  );
}
