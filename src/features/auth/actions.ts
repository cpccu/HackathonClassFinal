import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/shared/firebase/client";

export async function signInWithGoogle() {
  await setPersistence(auth, browserLocalPersistence);
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureUserDoc(user.uid, user.displayName, user.email);
}

export async function signInWithEmail(email: string, pass: string) {
  await setPersistence(auth, browserLocalPersistence);
  await signInWithEmailAndPassword(auth, email, pass);
  // User doc should already exist from sign up, but just in case:
  const user = auth.currentUser;
  if (user) {
    await ensureUserDoc(user.uid, user.displayName, user.email);
  }
}

export async function signUpWithEmail(email: string, pass: string) {
  await setPersistence(auth, browserLocalPersistence);
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
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
