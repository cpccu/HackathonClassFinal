"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/shared/firebase/client";
import { useAuth } from "@/features/auth";
import { dayKey, addDays } from "@/shared/lib/date";
import type { Day } from "@/features/entries/types";

export function useHeatmapData(weeks: number = 16) {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, Day>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const today = new Date();
    const start = addDays(today, -(weeks * 7));
    const startKey = dayKey(start);
    const endKey = dayKey(today);

    const q = query(
      collection(db, "users", uid, "days"),
      where("__name__", ">=", startKey),
      where("__name__", "<=", endKey)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const daysMap: Record<string, Day> = {};
      snap.forEach((doc) => {
        daysMap[doc.id] = doc.data() as Day;
      });
      setData(daysMap);
      setLoading(false);
      setError(null);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, weeks]);

  return { data, loading, error };
}
