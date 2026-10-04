import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/shared/firebase/client";

export async function signInWithGoogle() {
  // Explicit, so the login survives browser restarts.
  await setPersistence(auth, browserLocalPersistence);
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureUserDoc(user.uid, user.displayName, user.email);
}

// Create the profile doc on first sign-in only.
async function ensureUserDoc(
  uid: string,
  displayName: string | null,
  email: string | null,
) {
  const ref = doc(db, "users", uid);
  if ((await getDoc(ref)).exists()) return;
  await setDoc(ref, { displayName, email, createdAt: serverTimestamp() });
}

export const signOutUser = () => signOut(auth);
