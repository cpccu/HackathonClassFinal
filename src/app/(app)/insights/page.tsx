"use client";
import { HeatmapWidget } from "@/features/heatmap";

export default function InsightsPage() {
  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Insights</h1>
      <HeatmapWidget />
    </div>
  );
}
