"use client";
import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/shared/firebase/client";
import { useAuth } from "@/features/auth";
import { dayKey, addDays } from "@/shared/lib/date";
import type { Day } from "@/features/entries/types";

export function useHeatmapData(weeks: number = 16) {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, Day>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHeatmap = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const today = new Date();
      const start = addDays(today, -(weeks * 7));
      const startKey = dayKey(start);
      const endKey = dayKey(today);

      const q = query(
        collection(db, "users", user.uid, "days"),
        where("__name__", ">=", startKey),
        where("__name__", "<=", endKey)
      );

      const snap = await getDocs(q);
      const daysMap: Record<string, Day> = {};
      snap.forEach((doc) => {
        daysMap[doc.id] = doc.data() as Day;
      });
      
      setData(daysMap);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, weeks]);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  return { data, loading, error, refetch: fetchHeatmap };
}
