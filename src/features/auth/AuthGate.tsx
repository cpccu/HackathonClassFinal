"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "out") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "out") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse bg-[var(--skipped)] w-12 h-12 rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
