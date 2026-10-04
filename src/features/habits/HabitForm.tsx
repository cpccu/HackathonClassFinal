"use client";
import { useState } from "react";
import type { HabitInput } from "./types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  initial?: HabitInput;
  onSubmit: (input: HabitInput) => Promise<void>;
  onCancel: () => void;
};

export function HabitForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<"flexible" | "scheduled">(
    initial?.kind ?? "flexible"
  );
  const [days, setDays] = useState<number[]>(initial?.days ?? []);
  const [time, setTime] = useState(initial?.time ?? "10:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleDay = (dayIndex: number) => {
    if (days.includes(dayIndex)) {
      setDays(days.filter((d) => d !== dayIndex));
    } else {
      setDays([...days, dayIndex].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        kind,
        days,
        ...(kind === "scheduled" ? { time } : {}),
      });
    } catch (err: any) {
      setError(err.message || "Failed to save habit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[var(--surface)] p-6 rounded-[12px] border border-[var(--skipped)]">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Read for 20 mins"
          className="border border-[var(--skipped)] rounded-[6px] px-3 py-2 bg-transparent focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Kind</label>
        <div className="flex gap-2">
          {(["flexible", "scheduled"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer text-sm bg-[var(--bg)] px-3 py-2 rounded-[6px] border border-[var(--skipped)]">
              <input
                type="radio"
                name="kind"
                checked={kind === k}
                onChange={() => setKind(k)}
                className="accent-[var(--accent)]"
              />
              <span className="capitalize">{k}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Days <span className="text-[var(--muted)] font-normal">(empty = every day)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((label, i) => {
            const isSelected = days.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={`px-3 py-1 text-sm rounded-[6px] border ${
                  isSelected 
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white" 
                    : "border-[var(--skipped)] bg-transparent text-[var(--ink)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {kind === "scheduled" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-[var(--skipped)] rounded-[6px] px-3 py-2 bg-transparent focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      )}

      {error && <p className="text-[var(--danger)] text-sm">{error}</p>}

      <div className="flex gap-3 justify-end mt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium rounded-[6px] bg-[var(--accent)] text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save habit"}
        </button>
      </div>
    </form>
  );
}
