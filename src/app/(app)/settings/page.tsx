"use client";
import Link from "next/link";
import { HabitList } from "@/features/habits";
import { useAuth, signOutUser } from "@/features/auth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Link href="/today" className="text-[var(--accent)] hover:underline font-medium">
          ← Back to Today
        </Link>
      </div>
      
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <div className="bg-[var(--surface)] p-6 rounded-[12px] border border-[var(--skipped)] flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.displayName || "User"}</p>
            <p className="text-sm text-[var(--muted)]">{user?.email}</p>
          </div>
          <button
            onClick={signOutUser}
            className="px-4 py-2 border border-[var(--skipped)] text-[var(--ink)] hover:bg-[var(--bg)] rounded-[6px] text-sm font-medium"
          >
            Sign out
          </button>
        </div>
      </section>

      <section>
        <HabitList />
      </section>
    </main>
  );
}
