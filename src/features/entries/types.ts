export type Status = "done" | "skipped";

export type Day = {
  entries: Record<string, Status>;
  doneCount: number;
  totalCount: number;
  updatedAt?: number;
};
