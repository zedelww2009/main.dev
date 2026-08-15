import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg-Uk71ZV02gQVTW31vl5-JC7ueZ1mVKc",
  authDomain: "devhub-f3160.firebaseapp.com",
  projectId: "devhub-f3160",
  storageBucket: "devhub-f3160.firebasestorage.app",
  messagingSenderId: "775813172368",
  appId: "1:775813172368:web:baecdf3e00593545ef1c15",
};

function createFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }

  // Warn in development if config is missing
  if (
    process.env.NODE_ENV === "development" &&
    !firebaseConfig.apiKey
  ) {
    console.warn(
      "[Firebase] Missing configuration. Copy .env.example to .env.local and fill in your Firebase credentials."
    );
  }

  return initializeApp(firebaseConfig);
}

const app = createFirebaseApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;
