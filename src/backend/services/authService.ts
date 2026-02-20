import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "../types";

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'Admin', // Use placeholder since Firebase Auth doesn't store name by default without updateProfile
        role: 'ADMIN'
      };
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // Helper to get current user state
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        callback({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Admin',
          role: 'ADMIN'
        });
      } else {
        callback(null);
      }
    });
  }
};