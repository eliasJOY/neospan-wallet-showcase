import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDCVPWjqsYJZF2JzxXoWYxsuxV2_TZFX0k",
  authDomain: "raseedh-b9517.firebaseapp.com",
  projectId: "raseedh-b9517",
  storageBucket: "raseedh-b9517.firebasestorage.app",
  messagingSenderId: "705123619317",
  appId: "1:705123619317:web:f888b864e4cfeab2c190bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;