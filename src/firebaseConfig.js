// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth for Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import getFirestore for Firestore
import { getStorage } from "firebase/storage"; // Import getStorage for Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBncgbJKkb2b7ddlJl5J54ORjUxAyILD8",
  authDomain: "e-grampanchayat-270ad.firebaseapp.com",
  projectId: "e-grampanchayat-270ad",
  storageBucket: "e-grampanchayat-270ad.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "904899687751",
  appId: "1:904899687751:web:4f53bf625f1cd7beb80862",
  measurementId: "G-1KKP2RJDYG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Correct usage of getStorage

// Export app for potential future use
export default app;
