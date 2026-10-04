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

  const uid = user?.uid;

  const fetchHabits = useCallback(async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const data = await listHabits(uid);
      setHabits(data);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
