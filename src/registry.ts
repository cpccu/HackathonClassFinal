import type { FeatureManifest } from "@/shared/app-shell/types";
import { habitsFeature } from "@/features/habits";
import { entriesFeature } from "@/features/entries";
import { heatmapFeature } from "@/features/heatmap";

// Add features here as they are built
export const features: FeatureManifest[] = [
  habitsFeature,
  entriesFeature,
  heatmapFeature,
];
