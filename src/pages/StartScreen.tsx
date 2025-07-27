import login from "@/auth/Login";
import { useNavigate } from "react-router-dom";

const StartScreen = () => {
  const navigate = useNavigate();

  // Updated function to handle the popup login result
  const handleLogin = async () => {
    const user = await login(); // Await the result of the popup
    if (user) {
      // If login is successful, get token and navigate
      const idToken = await user.getIdToken();
      localStorage.setItem("token", idToken);
      navigate("/home");
    } else {
      // Optional: Show an error toast to the user if login fails
      console.log("Login failed or was cancelled.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <img src="/wallet.png" alt="Wallet Logo" className="w-32 h-auto mx-auto"/>
        <h1 className="text-4xl font-bold text-black mt-4">Google Wallet</h1>
      </div>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default StartScreen;