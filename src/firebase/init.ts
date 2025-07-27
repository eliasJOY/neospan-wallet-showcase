import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyADckGmaoVXQp_ei2pBzcGz61Ew-fmIKx8",
  authDomain: "neospan-71db0.firebaseapp.com",
  projectId: "neospan-71db0",
  storageBucket: "neospan-71db0.firebasestorage.app",
  messagingSenderId: "810088600023",
  appId: "1:810088600023:web:e8b6169becd96f96b57b92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;