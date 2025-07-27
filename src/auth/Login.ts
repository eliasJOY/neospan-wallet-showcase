import app from "@/firebase/init";
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// This function now handles a popup login and returns the user object or null
const login = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    // On success, return the user object
    const user = result.user;
    console.log("✅ User signed in via popup:", user);
    return user;
  } catch (error) {
    // Handle specific errors like popup closed by user
    if (error.code === 'auth/popup-closed-by-user') {
      console.log("🔒 Login popup closed by user.");
    } else {
      console.error("⚠️ Firebase Popup Auth Error:", error);
    }
    return null;
  }
};

export default login;