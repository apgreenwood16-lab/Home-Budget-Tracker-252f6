import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT2DgutB4a2w315If_ouedEu_lfwwkrWM",
  authDomain: "home-budget-tracker-762f6.firebaseapp.com",
  projectId: "home-budget-tracker-762f6",
  storageBucket: "home-budget-tracker-762f6.firebasestorage.app",
  messagingSenderId: "387351260725",
  appId: "1:387351260725:web:b1ea4fd317caa5bf8dcb7c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
