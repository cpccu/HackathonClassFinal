"use client";
import { useState, useEffect, useCallback } from "react";
import { listHabits, addHabit, archiveHabit, updateHabit } from "./repo";
import { useAuth } from "@/features/auth";
import type { Habit, HabitInput } from "./types";

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await listHabits(user.uid);
      setHabits(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const add = async (input: HabitInput) => {
    if (!user) return;
    await addHabit(user.uid, input);
    await fetchHabits();
  };

  const update = async (id: string, input: HabitInput) => {
    if (!user) return;
    await updateHabit(user.uid, id, input);
    await fetchHabits();
  };

  const archive = async (id: string) => {
    if (!user) return;
    await archiveHabit(user.uid, id);
    await fetchHabits();
  };

  return { habits, loading, error, add, update, archive, reload: fetchHabits };
}
