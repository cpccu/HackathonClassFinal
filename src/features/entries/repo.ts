import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/shared/firebase/client";
import type { Status, Day } from "./types";

export async function getDay(uid: string, key: string): Promise<Day> {
  const ref = doc(db, "users", uid, "days", key);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as Day;
  }
  return { entries: {}, doneCount: 0, totalCount: 0 };
}

// Update one habit's status and recompute the day's counts atomically.
export async function setStatus(
  uid: string,
  key: string,
  habitId: string,
  status: Status | null,
  scheduledIds: string[],
) {
  const ref = doc(db, "users", uid, "days", key);
  await runTransaction(db, async (tx) => {
    const current = (await tx.get(ref)).data()?.entries ?? {};
    const entries = { ...current };
    if (status) entries[habitId] = status;
    else delete entries[habitId];

    const skipped = scheduledIds.filter(
      (id) => entries[id] === "skipped",
    ).length;
    const done = scheduledIds.filter((id) => entries[id] === "done").length;
    
    tx.set(ref, {
      entries,
      doneCount: done,
      totalCount: scheduledIds.length - skipped,
      updatedAt: Date.now(),
    });
  });
}
