import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
};

export type TodayWidget = {
  id: string;
  order: number;
  Component: ComponentType<any>;
};

export type FeatureManifest = {
  id: string;
  nav?: NavItem[];
  todayWidgets?: TodayWidget[];
};
