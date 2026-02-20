import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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
    // Return a dummy object if no config (e.g. during build)
    appInstance = {
      name: '[DEFAULT]',
      options: {},
      automaticDataCollectionEnabled: false,
    } as FirebaseApp;
  }
  return appInstance;
};

// We use getters for db and auth but export them as constants via proxy if needed
// or just export them as the result of a safe call.

const getDbInstance = (): Firestore => {
  if (dbInstance) return dbInstance;
  const app = getAppInstance();
  if (hasConfig) {
    dbInstance = getFirestore(app);
  } else {
    dbInstance = {} as Firestore;
  }
  return dbInstance;
};

const getAuthInstance = (): Auth => {
  if (authInstance) return authInstance;
  const app = getAppInstance();
  if (hasConfig) {
    authInstance = getAuth(app);
  } else {
    authInstance = {} as Auth;
  }
  return authInstance;
};

// Export as constants for backward compatibility
export const app = getAppInstance();
export const db = getDbInstance();
export const auth = getAuthInstance();
