"use client";
import { useState, useEffect, useCallback } from "react";
import { getDay, setStatus } from "./repo";
import { useAuth } from "@/features/auth";
import { dayKey } from "@/shared/lib/date";
import type { Status, Day } from "./types";

export function useDay(date: Date = new Date()) {
  const { user } = useAuth();
  const key = dayKey(date);
  
  const [day, setDay] = useState<Day>({ entries: {}, doneCount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDay = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getDay(user.uid, key);
      setDay(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, key]);

  useEffect(() => {
    fetchDay();
  }, [fetchDay]);

  const updateStatus = async (habitId: string, status: Status | null, scheduledIds: string[]) => {
    if (!user) return;
    
    // Optimistic update
    setDay(current => {
      const entries = { ...current.entries };
      if (status) entries[habitId] = status;
      else delete entries[habitId];
      
      const skipped = scheduledIds.filter((id) => entries[id] === "skipped").length;
      const done = scheduledIds.filter((id) => entries[id] === "done").length;
      
      return {
        entries,
        doneCount: done,
        totalCount: scheduledIds.length - skipped
      };
    });

    try {
      await setStatus(user.uid, key, habitId, status, scheduledIds);
    } catch (err) {
      // Revert on error by refetching
      await fetchDay();
      console.error("Failed to update status", err);
    }
  };

  return { day, loading, error, updateStatus, key };
}
