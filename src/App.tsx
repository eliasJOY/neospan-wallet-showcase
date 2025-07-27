import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomeScreen from "./pages/HomeScreen";
import AddPassScreen from "./pages/AddPassScreen";
import PassDetailsScreen from "./pages/PassDetailsScreen";
import AiAssistantScreen from "./pages/AiAssistantScreen";
import LoginScreen from "./pages/LoginScreen";
import InsightsScreen from "./pages/InsightsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import NotFound from "./pages/NotFound";
import StartScreen from "./pages/StartScreen";
import Passes from "./pages/Passes";
import Insights from "./pages/Insights";
import CaptureMedia from "./pages/CaptureMedia";
import GeminiPassLoader from "./pages/GeminiPassLoader";

const queryClient = new QueryClient();

// Simplified App component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* All routes are now public */}
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/add-pass" element={<AddPassScreen />} />
            <Route path="/pass/:id" element={<PassDetailsScreen />} />
            <Route path="/ai-assistant" element={<AiAssistantScreen />} />
            <Route path="/capture-media" element={<CaptureMedia />} />
            <Route path="/gemini-loader" element={<GeminiPassLoader />} />
            <Route path="/passes" element={<Passes />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;