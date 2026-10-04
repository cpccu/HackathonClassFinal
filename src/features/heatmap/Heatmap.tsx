"use client";
import { useState, useMemo } from "react";
import { useHeatmapData } from "./useHeatmapData";
import { buildGrid } from "./buildGrid";
import { useHabits } from "@/features/habits";
import { addDays, dayKey } from "@/shared/lib/date";

export function HeatmapWidget() {
  const { data, loading: dataLoading } = useHeatmapData(16);
  const { habits, loading: habitsLoading } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string>("all");

  const today = new Date();
  const startDate = addDays(today, -16 * 7);

  const gridData = useMemo(() => {
    // Transform data based on selection
    const transformed: Record<string, { doneCount: number; totalCount: number }> = {};
    
    if (selectedHabitId === "all") {
      for (const [key, day] of Object.entries(data)) {
        transformed[key] = { doneCount: day.doneCount, totalCount: day.totalCount };
      }
    } else {
      const habit = habits.find((h) => h.id === selectedHabitId);
      if (habit) {
        // Walk through the date range and calculate for this specific habit
        let curr = new Date(startDate);
        while (curr <= today) {
          const key = dayKey(curr);
          const dayDoc = data[key];
          
          // Is this habit scheduled for this day?
          const isScheduled = habit.days.length === 0 || habit.days.includes(curr.getDay());
          
          if (isScheduled) {
            const status = dayDoc?.entries?.[selectedHabitId];
            if (status === "skipped") {
              transformed[key] = { doneCount: 0, totalCount: 0 }; // Skipped days don't count towards total
            } else {
              transformed[key] = { 
                doneCount: status === "done" ? 1 : 0, 
                totalCount: 1 
              };
            }
          }
          curr = addDays(curr, 1);
        }
      }
    }
    
    return buildGrid(transformed, startDate, today, today);
  }, [data, selectedHabitId, habits, startDate, today]);

  if (dataLoading || habitsLoading) {
    return <div className="animate-pulse bg-[var(--skipped)] w-full h-48 rounded-[12px]" />;
  }

  const getBackgroundColor = (level: number | "none") => {
    if (level === "none" || level === 0) return "var(--ramp-0)";
    return `var(--ramp-${level})`;
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--skipped)] p-4 md:p-6 rounded-[12px] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-bold text-lg">Consistency</h2>
        
        {habits.length > 0 && (
          <select 
            value={selectedHabitId} 
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="text-sm bg-transparent border border-[var(--skipped)] rounded-[6px] px-3 py-1.5 outline-none focus:border-[var(--accent)]"
          >
            <option value="all">All Habits</option>
            {habits.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-2 min-w-max">
          <div className="flex gap-1">
            {gridData.map((week, wIdx) => {
              // Only show month label if it's the first week of the month, or the very first week shown
              const firstDay = week.cells[0];
              const isFirstWeekOfMonth = firstDay.date.getDate() <= 7;
              
              return (
                <div key={week.id} className="flex flex-col gap-1 w-3.5">
                  {wIdx === 0 || (isFirstWeekOfMonth && wIdx > 0) ? (
                    <span className="text-[10px] text-[var(--muted)] h-4 leading-4 truncate overflow-visible w-8">
                      {firstDay.date.toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                  ) : (
                    <span className="h-4" />
                  )}
                  
                  {week.cells.map((cell) => (
                    <div 
                      key={cell.key}
                      className="w-3.5 h-3.5 rounded-[2px] transition-colors hover:ring-1 hover:ring-[var(--ink)] cursor-pointer"
                      style={{ 
                        backgroundColor: getBackgroundColor(cell.level),
                        // Hatch pattern for skipped isn't handled perfectly here, but if done=0 total=0 on a scheduled day, it's skipped
                        // The prompt asked for skipped to be none or grey, we just use ramp-0 for skipped/missed.
                      }}
                      title={`${cell.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}: ${cell.total > 0 ? `${cell.done} of ${cell.total} done` : cell.level === "none" ? "Not scheduled" : "Skipped"}`}
                      aria-label={`${cell.date.toLocaleDateString()}: ${cell.done} of ${cell.total} done`}
                      tabIndex={0}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
