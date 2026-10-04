import type { FeatureManifest } from "@/shared/app-shell/types";
import { StatsWidget } from "./StatsWidget";

export const statsFeature: FeatureManifest = {
  id: "stats",
  todayWidgets: [{ id: "stats", order: 5, Component: StatsWidget }],
};
