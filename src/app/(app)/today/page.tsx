"use client";
import { features } from "@/registry";
import { useAuth } from "@/features/auth";

export default function TodayPage() {
  const { user } = useAuth();
  
  // Extract and sort today widgets
  const widgets = features
    .flatMap((f) => f.todayWidgets || [])
    .sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 md:p-8 w-full max-w-3xl mx-auto flex flex-col gap-8">
      {widgets.map((widget) => (
        <widget.Component key={widget.id} />
      ))}
    </div>
  );
}
