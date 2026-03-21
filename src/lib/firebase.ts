// src/lib/firebase.ts | Version: 2.0.13
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

if (!isBrowser) {
  console.log('Firebase: Server-side rendering detected, skipping initialization');
}

const firebaseConfig = isBrowser ? {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} : null;

const isValidConfig = isBrowser && Boolean(
  firebaseConfig?.apiKey && 
  firebaseConfig.apiKey.length > 0 && 
  !firebaseConfig.apiKey.startsWith('demo')
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let isInitializing = false;
let isInitialized = false;
let initPromise: Promise<void> | undefined;

async function initFirebase(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;
  if (!isValidConfig || !firebaseConfig) return;
  
  initPromise = (async () => {
    isInitializing = true;
    
    const maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getAuth } = await import('firebase/auth');
        const { getFirestore } = await import('firebase/firestore');
        
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
        isInitialized = true;
        return;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Firebase initialization attempt ${attempt}/${maxRetries} failed:`, error);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    console.error('Firebase initialization failed after all retries:', lastError);
  })();

  try {
    await initPromise;
  } finally {
    isInitializing = false;
  }
}

if (isValidConfig && firebaseConfig) {
  initFirebase();
}

export { auth, db };

export const firebaseReady = (): Promise<void> => {
  if (isInitialized) return Promise.resolve();
  return initFirebase() ?? Promise.resolve();
};
