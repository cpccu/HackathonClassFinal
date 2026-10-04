"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useHabits } from "@/features/habits";
import { useDay } from "./useDay";
import { addDays } from "@/shared/lib/date";

export function TodayChecklist() {
  const [offset, setOffset] = useState(0); // 0 = today, -1 = yesterday, etc.
  const activeDate = addDays(new Date(), offset);
  
  const { habits, loading: habitsLoading } = useHabits();
  const { day, loading: dayLoading, updateStatus } = useDay(activeDate);

  const prevDoneCountRef = useRef(day.doneCount);
  
  useEffect(() => {
    // Check if the doneCount increased and reached the total count
    if (
      prevDoneCountRef.current !== undefined &&
      day.doneCount > prevDoneCountRef.current &&
      day.totalCount > 0 &&
      day.doneCount === day.totalCount
    ) {
      const colors = ['#0F766E', '#2C9B90', '#39d353', '#f85149', '#FFFFFF'];
      const triggerConfetti = (x: number) => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.1, x },
          colors
        });
      };
      
      // Three explosions from different horizontal positions
      triggerConfetti(0.5); // Center
      setTimeout(() => triggerConfetti(0.2), 400); // Left
      setTimeout(() => triggerConfetti(0.8), 800); // Right
    }
    prevDoneCountRef.current = day.doneCount;
  }, [day.doneCount, day.totalCount]);

  // Allow up to 7 days in the past
  const goBack = () => {
    if (offset > -7) setOffset(offset - 1);
  };
  const goForward = () => {
    if (offset < 0) setOffset(offset + 1);
  };

  const loading = habitsLoading || dayLoading;

  if (loading) {
    return <div className="animate-pulse bg-[var(--skipped)] w-full h-48 rounded-[12px]" />;
  }

  const activeDayNum = activeDate.getDay();
  // Filter scheduled for this day
  const scheduledHabits = habits.filter(h => {
    if (h.days.length === 0) return true; // flexible/everyday
    return h.days.includes(activeDayNum);
  }).sort((a, b) => {
    // Sort: flexible first, then by time
    if (a.kind === "flexible" && b.kind === "scheduled") return -1;
    if (a.kind === "scheduled" && b.kind === "flexible") return 1;
    if (a.kind === "scheduled" && b.kind === "scheduled") {
      return (a.time || "").localeCompare(b.time || "");
    }
    return 0;
  });

  const scheduledIds = scheduledHabits.map(h => h.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between bg-[var(--surface)] p-4 rounded-[12px] border border-[var(--skipped)]">
        <button 
          onClick={goBack} 
          disabled={offset <= -7}
          className="p-2 text-[var(--muted)] hover:bg-[var(--bg)] rounded-[6px] disabled:opacity-50"
        >
          ←
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg">
            {offset === 0 ? "Today" : activeDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {day.doneCount} of {day.totalCount} done
          </p>
        </div>
        <button 
          onClick={goForward} 
          disabled={offset >= 0}
          className="p-2 text-[var(--muted)] hover:bg-[var(--bg)] rounded-[6px] disabled:opacity-50"
        >
          →
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-[var(--skipped)] rounded-[12px]">
          <p className="text-[var(--muted)] mb-4">No habits yet. Add your first one.</p>
          <Link href="/settings" className="text-[var(--accent)] font-medium">
            + Add habit
          </Link>
        </div>
      ) : scheduledHabits.length === 0 ? (
        <div className="p-8 text-center bg-[var(--surface)] border border-[var(--skipped)] rounded-[12px]">
          <p className="text-[var(--muted)]">Nothing scheduled for this day.</p>
        </div>
      ) : (
        <div className="flex flex-col bg-[var(--surface)] border border-[var(--skipped)] rounded-[12px] overflow-hidden">
          {scheduledHabits.map((habit, idx) => {
            const status = day.entries[habit.id];
            const isDone = status === "done";
            const isSkipped = status === "skipped";

            return (
              <div 
                key={habit.id} 
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--bg)] transition-colors
                  ${idx < scheduledHabits.length - 1 ? 'border-b border-[var(--skipped)]' : ''}
                  ${isSkipped ? 'opacity-60 bg-[var(--skipped)] bg-opacity-20 relative overflow-hidden' : ''}
                `}
                onClick={() => updateStatus(habit.id, isDone ? null : "done", scheduledIds)}
              >
                {/* Skipped hatch pattern overlay */}
                {isSkipped && (
                  <div className="absolute inset-0 pointer-events-none opacity-20" 
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, var(--ink) 10px, var(--ink) 12px)' }} 
                  />
                )}
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isDone ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--skipped)]'}
                  `}>
                    {isDone && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDone ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)]'}`}>
                      {habit.name}
                    </h3>
                    {habit.kind === "scheduled" && (
                      <p className="text-xs text-[var(--muted)] mt-0.5">{habit.time}</p>
                    )}
                  </div>
                </div>

                <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => updateStatus(habit.id, isSkipped ? null : "skipped", scheduledIds)}
                    className={`text-sm px-3 py-1 rounded-[6px] transition-colors
                      ${isSkipped ? 'text-[var(--ink)] bg-[var(--bg)]' : 'text-[var(--muted)] hover:bg-[var(--bg)]'}
                    `}
                  >
                    {isSkipped ? "Unskip" : "Skip"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
