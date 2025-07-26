import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import AddPassScreen from "./pages/AddPassScreen";
import PassDetailsScreen from "./pages/PassDetailsScreen";
import AiAssistantScreen from "./pages/AiAssistantScreen";
import LoginScreen from "./pages/LoginScreen";
import InsightsScreen from "./pages/InsightsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/add-pass" element={<AddPassScreen />} />
          <Route path="/pass/:id" element={<PassDetailsScreen />} />
          <Route path="/ai-assistant" element={<AiAssistantScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/insights" element={<InsightsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
