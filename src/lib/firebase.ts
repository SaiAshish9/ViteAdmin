import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if we have the API key
export const firebaseApp = 
  import.meta.env.VITE_FIREBASE_API_KEY ? 
  initializeApp(firebaseConfig) : 
  null;

// Initialize Firebase Auth and Google provider
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();

// Helper functions for authentication
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    console.error("Firebase authentication is not configured");
    return;
  }
  // Implement signInWithPopup or signInWithRedirect in the components that use this
};

export const isFirebaseConfigured = () => {
  return !!firebaseApp && !!auth;
};