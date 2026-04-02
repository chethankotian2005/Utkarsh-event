import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export const ADMIN_EMAIL = "media.smvitm@sode-edu.in";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: "sode-edu.in" });

export async function signInWithGoogle(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user.email !== ADMIN_EMAIL) {
      await firebaseSignOut(auth);
      return {
        success: false,
        error: "Unauthorized. Only media.smvitm@sode-edu.in can access the admin panel.",
      };
    }
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in cancelled." };
    }
    return { success: false, error: error.message || "Authentication failed." };
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
