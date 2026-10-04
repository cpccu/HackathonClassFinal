import type { FeatureManifest } from "@/shared/app-shell/types";
import { HeatmapWidget } from "./Heatmap";

export const heatmapFeature: FeatureManifest = {
  id: "heatmap",
  todayWidgets: [{ id: "heatmap", order: 20, Component: HeatmapWidget }],
  nav: [
    { label: "Insights", href: "/insights" }
  ]
};
