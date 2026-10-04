"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, LoginCard } from "@/features/auth";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export default function LoginPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "in") {
      router.replace("/today");
    }
  }, [status, router]);

  if (status === "loading" || status === "in") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-4 h-full bg-[var(--bg)]">
        <div className="animate-pulse bg-[var(--skipped)] w-12 h-12 rounded-full" />
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center p-4 bg-[var(--bg)] min-h-screen relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <LoginCard />
    </main>
  );
}
