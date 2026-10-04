import { addDays, dayKey } from "@/shared/lib/date";

export type CellLevel = 0 | 1 | 2 | 3 | 4 | "none";

export type HeatmapCell = {
  key: string;
  date: Date;
  level: CellLevel;
  done: number;
  total: number;
};

export type HeatmapWeek = {
  id: string;
  cells: HeatmapCell[];
};

export function buildGrid(
  data: Record<string, { doneCount: number; totalCount: number }>,
  startDate: Date,
  endDate: Date,
  todayDate: Date = new Date()
): HeatmapWeek[] {
  const weeks: HeatmapWeek[] = [];
  
  // Find the Sunday on or before startDate
  let current = new Date(startDate);
  const dayOfWeek = current.getDay();
  if (dayOfWeek !== 0) {
    current = addDays(current, -dayOfWeek);
  }
  
  const todayKeyStr = dayKey(todayDate);

  let currentWeek: HeatmapCell[] = [];
  
  // Build until we pass endDate AND finish the week
  while (current <= endDate || current.getDay() !== 0) {
    const key = dayKey(current);
    const isFuture = key > todayKeyStr;
    const dayData = data[key];
    
    let level: CellLevel = "none";
    let done = 0;
    let total = 0;

    if (!isFuture && dayData && dayData.totalCount > 0) {
      done = dayData.doneCount;
      total = dayData.totalCount;
      const ratio = done / total;
      
      if (ratio === 0) level = 0;
      else if (ratio <= 0.25) level = 1;
      else if (ratio <= 0.5) level = 2;
      else if (ratio <= 0.99) level = 3;
      else level = 4;
    } else if (!isFuture && dayData && dayData.totalCount === 0) {
      level = "none";
    }

    currentWeek.push({
      key,
      date: new Date(current),
      level,
      done,
      total,
    });

    if (currentWeek.length === 7) {
      weeks.push({ id: currentWeek[0].key, cells: currentWeek });
      currentWeek = [];
    }

    current = addDays(current, 1);
  }

  return weeks;
}
