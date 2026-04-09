import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Simple check to avoid crashing during build if env vars are missing
const isFirebaseConfigured = typeof window !== 'undefined' ? 
  !!firebaseConfig.apiKey : 
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Initialize Firebase only if we have a config or if we are on the client
const app = getApps().length > 0 ? getApp() : (isFirebaseConfigured ? initializeApp(firebaseConfig) : null);

// Initialize services only if app exists
const auth = app ? getAuth(app) : ({} as any);
const storage = app ? getStorage(app) : ({} as any);

// Initialize Analytics (browser-only, will not run during SSR or Build)
let analytics: Analytics | null = null;
if (typeof window !== "undefined" && app) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, storage, analytics };
