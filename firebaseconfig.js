// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration (Replace with your actual Firebase details)
const firebaseConfig = {
  apiKey: "AIzaSyBEbauqICbNpvQwMby2-HcMVX2hhDxz2L0",
  authDomain: "kenya-voting-system.firebaseapp.com",
  projectId: "kenya-voting-system",
  storageBucket: "kenya-voting-system.appspot.com", // ✅ Fix here
  messagingSenderId: "79143608802",
  appId: "1:79143608802:web:62a7f5c1620b0ecb47d9bb",
  measurementId: "G-DTQKCPSH8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase services
export { app, auth, db };
