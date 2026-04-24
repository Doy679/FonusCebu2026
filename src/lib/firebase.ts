import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const cleanEnv = (value: string | undefined) =>
  (value || "").replace(/^['"]|['"]$/g, "").trim();

const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

const requiredConfig = [
  { env: "NEXT_PUBLIC_FIREBASE_API_KEY", value: firebaseConfig.apiKey },
  { env: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", value: firebaseConfig.authDomain },
  { env: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", value: firebaseConfig.projectId },
  { env: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", value: firebaseConfig.storageBucket },
  { env: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", value: firebaseConfig.messagingSenderId },
  { env: "NEXT_PUBLIC_FIREBASE_APP_ID", value: firebaseConfig.appId },
];

const isPlaceholderValue = (value: string) =>
  /^your_|^<.*>$|example|placeholder/i.test(value);

const isLikelyFirebaseApiKey = (value: string) =>
  /^AIza[0-9A-Za-z_-]{20,}$/.test(value);

const firebaseConfigErrors = [
  ...requiredConfig
    .filter(({ value }) => !value)
    .map(({ env }) => `${env} is missing`),
  ...requiredConfig
    .filter(({ value }) => value && isPlaceholderValue(value))
    .map(({ env }) => `${env} still has a placeholder value`),
  ...(firebaseConfig.apiKey && !isLikelyFirebaseApiKey(firebaseConfig.apiKey)
    ? ["NEXT_PUBLIC_FIREBASE_API_KEY does not look like a Firebase Web API key"]
    : []),
];

export const firebaseConfigError =
  firebaseConfigErrors.length > 0
    ? `Firebase is not configured correctly: ${firebaseConfigErrors.join(", ")}. Update .env.local or your deployment environment, then restart/redeploy the app.`
    : null;

const hasConfig = !firebaseConfigError;

let loggedConfigError = false;

const logConfigError = () => {
  if (firebaseConfigError && !loggedConfigError) {
    loggedConfigError = true;
    console.error(firebaseConfigError);
  }
};

const unavailableService = <T extends object>(serviceName: string): T =>
  new Proxy({} as T, {
    get: (_target, prop) => {
      if (prop === "then") return undefined;
      throw new Error(firebaseConfigError || `${serviceName} is unavailable.`);
    },
  });

// Initialize Firebase (Singleton pattern)
let appInstance: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;
let authInstance: Auth | undefined;

const getAppInstance = (): FirebaseApp => {
  if (appInstance) return appInstance;
  
  if (hasConfig) {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } else {
    logConfigError();
    // Return a proxy that throws a descriptive error when accessed
    appInstance = new Proxy({} as FirebaseApp, {
      get: (_target, prop) => {
        if (prop === "name") return "[DEFAULT]";
        if (prop === "options") return firebaseConfig;
        if (prop === "then") return undefined;
        throw new Error(firebaseConfigError || "Firebase App is unavailable.");
      }
    });
  }
  return appInstance;
};

const getDbInstance = (): Firestore => {
  if (dbInstance) return dbInstance;
  if (!hasConfig) {
    logConfigError();
    dbInstance = unavailableService<Firestore>("Firestore");
    return dbInstance;
  }

  const app = getAppInstance();
  try {
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
    dbInstance = unavailableService<Firestore>("Firestore");
    return dbInstance;
  }
};

const getAuthInstance = (): Auth => {
  if (authInstance) return authInstance;
  if (!hasConfig) {
    logConfigError();
    authInstance = unavailableService<Auth>("Firebase Auth");
    return authInstance;
  }

  const app = getAppInstance();
  try {
    authInstance = getAuth(app);
    return authInstance;
  } catch (error) {
    console.error("Failed to initialize Firebase Auth:", error);
    authInstance = unavailableService<Auth>("Firebase Auth");
    return authInstance;
  }
};

// Export as constants for backward compatibility
export const app = getAppInstance();
export const db = getDbInstance();
export const auth = getAuthInstance();
