import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Home, Bot, BarChart3, User, TicketCheck } from "lucide-react";

const BottomNavBar = () => {
    const navigate = useNavigate();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-around py-3">
          <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center gap-1 text-primary"
          onClick={() => navigate('/home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1"
            onClick={() => navigate('/ai-assistant')}
          >
            <Bot className="w-5 h-5" />
            <span className="text-xs">AI Assistant</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1"
          onClick={() => navigate('/insights')}>
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Insights</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1"
          onClick={() => navigate('/passes')}>
            <TicketCheck className="w-5 h-5" />
            <span className="text-xs">Passes</span>
          </Button>
        </div>
      </nav>
  )
}

export default BottomNavBar;