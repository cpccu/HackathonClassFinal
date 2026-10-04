"use client";
import { useMemo } from "react";
import { useHeatmapData } from "@/features/heatmap/useHeatmapData";
import { calculateStats } from "./calc";

export function useStats() {
  const { data, loading, error } = useHeatmapData(16);

  const stats = useMemo(() => {
    return calculateStats(data);
  }, [data]);

  return { stats, loading, error };
}
