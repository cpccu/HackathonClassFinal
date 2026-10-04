"use client";
import { useState } from "react";
import { useHabits } from "./useHabits";
import { HabitForm } from "./HabitForm";
import type { Habit } from "./types";

export function HabitList() {
  const { habits, loading, error, add, update, archive } = useHabits();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (loading) {
    return <div className="animate-pulse bg-[var(--skipped)] w-full h-24 rounded-[12px]" />;
  }

  if (error) {
    return (
      <div className="p-4 bg-[var(--surface)] border border-[var(--danger)] rounded-[12px]">
        <p className="text-[var(--danger)]">Failed to load habits.</p>
      </div>
    );
  }

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const formatDays = (days: number[]) => {
    if (days.length === 0) return "Every day";
    return days.map(d => WEEKDAYS[d]).join(", ");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Habits</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-[var(--accent)] text-white px-4 py-2 rounded-[6px] text-sm font-medium"
          >
            Add habit
          </button>
        )}
      </div>

      {isAdding && (
        <HabitForm
          onSubmit={async (input) => {
            await add(input);
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {habits.length === 0 && !isAdding ? (
        <div className="p-8 text-center border border-dashed border-[var(--skipped)] rounded-[12px]">
          <p className="text-[var(--muted)] mb-4">No habits yet. Add your first one.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="text-[var(--accent)] font-medium"
          >
            + Add habit
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {habits.map((habit) => (
            editingId === habit.id ? (
              <HabitForm
                key={habit.id}
                initial={habit}
                onSubmit={async (input) => {
                  await update(habit.id, input);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div key={habit.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--skipped)] rounded-[12px] gap-4">
                <div>
                  <h3 className="font-medium text-[var(--ink)]">{habit.name}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {habit.kind === "scheduled" ? `${formatDays(habit.days)} at ${habit.time}` : formatDays(habit.days)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(habit.id)}
                    className="text-sm px-3 py-1 text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to archive this habit?")) {
                        archive(habit.id);
                      }
                    }}
                    className="text-sm px-3 py-1 text-[var(--danger)] hover:bg-[var(--bg)] rounded-[6px]"
                  >
                    Archive
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
