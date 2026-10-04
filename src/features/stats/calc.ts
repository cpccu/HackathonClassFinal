import { addDays, dayKey } from "@/shared/lib/date";

export type Stats = {
  currentStreak: number;
  bestStreak: number;
  completedThisWeek: number;
  totalThisWeek: number;
};

export function calculateStats(
  data: Record<string, { doneCount: number; totalCount: number }>,
  today: Date = new Date()
): Stats {
  const todayStr = dayKey(today);
  const yesterdayStr = dayKey(addDays(today, -1));

  let currentStreak = 0;
  let bestStreak = 0;

  // To find streaks reliably, we need to iterate through all days from the beginning of our data.
  // Since we only have documents for days where the user interacted, we can't just iterate keys.
  // Wait, if a day has no document, is it a failure? Yes, if there was a habit scheduled. 
  // But we don't know if a habit was scheduled on a missing day without looking at habits.
  // For simplicity (Phase 5 "simple weekly summary"), if totalCount > 0 and doneCount == totalCount, it's a streak day.
  // Missing days break the streak.
  
  const sortedKeys = Object.keys(data).sort();
  if (sortedKeys.length > 0) {
    const firstDateStr = sortedKeys[0];
    
    // Convert firstDateStr back to Date roughly
    const [y, m, d] = firstDateStr.split("-").map(Number);
    let curr = new Date(y, m - 1, d);
    let currStr = dayKey(curr);

    let streak = 0;
    
    while (currStr <= todayStr) {
      const dayDoc = data[currStr];
      const isSuccess = dayDoc && dayDoc.totalCount > 0 && dayDoc.doneCount === dayDoc.totalCount;
      const isSkippedAll = dayDoc && dayDoc.totalCount === 0;

      if (isSuccess) {
        streak++;
        if (streak > bestStreak) bestStreak = streak;
      } else if (!isSkippedAll) {
        // Break the streak if it's not today. If it's today, we don't break it yet.
        if (currStr !== todayStr) {
          streak = 0;
        }
      }
      
      curr = addDays(curr, 1);
      currStr = dayKey(curr);
    }
    currentStreak = streak;
  }

  // Weekly summary: past 7 days
  let completedThisWeek = 0;
  let totalThisWeek = 0;
  
  for (let i = 0; i < 7; i++) {
    const dStr = dayKey(addDays(today, -i));
    const dayDoc = data[dStr];
    if (dayDoc) {
      completedThisWeek += dayDoc.doneCount;
      totalThisWeek += dayDoc.totalCount;
    }
  }

  return {
    currentStreak,
    bestStreak,
    completedThisWeek,
    totalThisWeek
  };
}
