"use client";
import { useStats } from "./useStats";

export function StatsWidget() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return <div className="animate-pulse bg-[var(--skipped)] w-full h-32 rounded-[12px]" />;
  }

  if (error) {
    return null;
  }

  const weeklyPercentage = stats.totalThisWeek > 0 
    ? Math.round((stats.completedThisWeek / stats.totalThisWeek) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[var(--surface)] border border-[var(--skipped)] p-4 rounded-[12px] flex flex-col justify-center items-center text-center">
        <p className="text-sm text-[var(--muted)] font-medium mb-1">Current Streak</p>
        <p className="text-3xl font-bold text-[var(--ink)]">
          {stats.currentStreak} <span className="text-xl">🔥</span>
        </p>
      </div>
      
      <div className="bg-[var(--surface)] border border-[var(--skipped)] p-4 rounded-[12px] flex flex-col justify-center items-center text-center">
        <p className="text-sm text-[var(--muted)] font-medium mb-1">Best Streak</p>
        <p className="text-3xl font-bold text-[var(--ink)]">
          {stats.bestStreak} <span className="text-xl">🏆</span>
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--skipped)] p-4 rounded-[12px] flex flex-col justify-center items-center text-center col-span-2 md:col-span-2">
        <p className="text-sm text-[var(--muted)] font-medium mb-1">Last 7 Days</p>
        <p className="text-3xl font-bold text-[var(--ink)]">
          {stats.completedThisWeek} <span className="text-xl text-[var(--muted)] font-medium">/ {stats.totalThisWeek}</span>
        </p>
        <div className="w-full bg-[var(--skipped)] h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-[var(--accent)] transition-all duration-500" 
            style={{ width: `${weeklyPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
