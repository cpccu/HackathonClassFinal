import type { FeatureManifest } from "@/shared/app-shell/types";
import { TodayChecklist } from "./TodayChecklist";

export const entriesFeature: FeatureManifest = {
  id: "entries",
  todayWidgets: [{ id: "entries", order: 10, Component: TodayChecklist }],
};
