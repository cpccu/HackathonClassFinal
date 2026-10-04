import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/shared/firebase/client";
import type { Habit, HabitInput } from "./types";

const col = (uid: string) => collection(db, "users", uid, "habits");

export async function listHabits(uid: string): Promise<Habit[]> {
  const snap = await getDocs(query(col(uid), orderBy("createdAt")));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Habit, "id">) }))
    .filter((h) => !h.archived);
}

export const addHabit = (uid: string, input: HabitInput) =>
  addDoc(col(uid), { ...input, archived: false, createdAt: Date.now() });

export const archiveHabit = (uid: string, id: string) =>
  updateDoc(doc(db, "users", uid, "habits", id), { archived: true });

export const updateHabit = (uid: string, id: string, input: HabitInput) =>
  updateDoc(doc(db, "users", uid, "habits", id), { ...input });
