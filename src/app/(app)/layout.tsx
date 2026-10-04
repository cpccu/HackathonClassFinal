"use client";
import { AuthGate } from "@/features/auth";
import { AppShell } from "@/shared/app-shell/AppShell";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <AppShell>
        {children}
      </AppShell>
    </AuthGate>
  );
}
