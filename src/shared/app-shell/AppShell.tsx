"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { features } from "@/registry";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Extract all nav items from all features
  const navItems = [
    { label: "Today", href: "/today" }, // Hardcode Today as it's the main route
    ...features.flatMap((f) => f.nav || []),
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[var(--bg)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--skipped)] bg-[var(--surface)]">
        <div className="p-6">
          <h1 className="text-xl font-bold text-[var(--ink)]">Habit Tracker</h1>
        </div>
        <nav className="flex flex-col flex-1 px-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-[8px] font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[var(--skipped)] flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--muted)]">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--skipped)] bg-[var(--surface)]">
          <h1 className="text-lg font-bold text-[var(--ink)]">Habit Tracker</h1>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0 relative">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--skipped)] flex justify-around p-2 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-2 rounded-[8px] text-sm font-medium ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)] hover:bg-[var(--bg)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
