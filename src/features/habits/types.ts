export type Habit = {
  id: string;
  name: string;
  kind: "flexible" | "scheduled"; // scheduled = fixed time, like a class
  days: number[]; // 0 (Sun) to 6 (Sat); empty = every day
  time?: string; // "10:00", scheduled only
  archived: boolean;
  createdAt: number;
};

export type HabitInput = Omit<Habit, "id" | "archived" | "createdAt">;
