import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // if using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCYp8sdJIuv8UaFr79hLHdW4Eh_KLa_oCY",
  authDomain: "wallet-test-fe480.firebaseapp.com",
  projectId: "wallet-test-fe480",
  storageBucket: "wallet-test-fe480.firebasestorage.app",
  messagingSenderId: "329245708177",
  appId: "1:329245708177:web:f9f68d39427bf64c22d430",
  measurementId: "G-V5EPFVG4S6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
