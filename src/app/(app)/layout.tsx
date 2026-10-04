"use client";
import { AuthGate } from "@/features/auth";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="flex flex-col h-full">
        {/* AppShell will go here in Phase 3 */}
        {children}
      </div>
    </AuthGate>
  );
}
