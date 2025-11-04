import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isConfigAvailable = Object.values(firebaseConfig).every((value) => Boolean(value))

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (!isConfigAvailable) {
    return null
  }

  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  }

  return firebaseApp
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  if (!app) {
    return null
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(app)
  }
  return firebaseAuth
}

export function isFirebaseEnabled(): boolean {
  return isConfigAvailable
}
