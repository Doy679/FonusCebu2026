import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '').replace(/['"]/g, '').trim(),
  authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '').replace(/['"]/g, '').trim(),
  projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '').replace(/['"]/g, '').trim(),
  storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '').replace(/['"]/g, '').trim(),
  messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '').replace(/['"]/g, '').trim(),
  appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '').replace(/['"]/g, '').trim(),
};

console.log("Firebase Config Check:", {
  apiKey: !!firebaseConfig.apiKey,
  projectId: !!firebaseConfig.projectId,
  hasConfig: !!firebaseConfig.apiKey
});

const hasConfig = !!firebaseConfig.apiKey;

// Initialize Firebase (Singleton pattern)
let appInstance: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;

const getAppInstance = (): FirebaseApp => {
  if (appInstance) return appInstance;
  
  if (hasConfig) {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } else {
    console.warn("Firebase configuration is missing! Check your .env.local file.");
    // Return a proxy that throws a descriptive error when accessed
    appInstance = new Proxy({} as FirebaseApp, {
      get: (target, prop) => {
        if (prop === 'name') return '[DEFAULT]';
        if (prop === 'options') return {};
        throw new Error(`Firebase App accessed but not initialized. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set.`);
      }
    });
  }
  return appInstance;
};

const getDbInstance = (): Firestore => {
  if (dbInstance) return dbInstance;
  const app = getAppInstance();
  try {
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
    return {} as Firestore;
  }
};

const getAuthInstance = (): Auth => {
  if (authInstance) return authInstance;
  const app = getAppInstance();
  try {
    // If hasConfig is false, the proxy app will throw a clear error here
    authInstance = getAuth(app);
    return authInstance;
  } catch (error) {
    console.error("Failed to initialize Firebase Auth. This usually means environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, etc.) are missing on your live server.");
    // We return a proxy for Auth as well to catch calls to signIn...
    return new Proxy({} as Auth, {
      get: () => {
        throw new Error("Firebase Auth is not initialized. Check your production environment variables.");
      }
    });
  }
};

// Export as constants for backward compatibility
export const app = getAppInstance();
export const db = getDbInstance();
export const auth = getAuthInstance();
