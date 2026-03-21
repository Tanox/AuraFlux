// src/lib/firebase.ts | Version: 2.0.10
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

let app: any;
let auth: any;
let db: any;

if (isValidConfig && firebaseConfig) {
  try {
    const { initializeApp, getApps, getApp } = require("firebase/app");
    const { getAuth } = require("firebase/auth");
    const { getFirestore } = require("firebase/firestore");
    
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { auth, db };
