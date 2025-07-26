import { ArrowLeft, Mic, Send, Sparkles, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AiAssistantScreen = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const quickSuggestions = [
    { text: "Show my spending trends", icon: TrendingUp },
    { text: "Create a grocery list", icon: ShoppingCart },
    { text: "Find cheaper alternatives", icon: Sparkles },
  ];

  const chatMessages = [
    {
      id: 1,
      type: "ai",
      content: "Hi! I'm your NeoSpan AI assistant. I can help you analyze your expenses, create shopping lists, and find better deals. What would you like to know?",
      timestamp: "2:30 PM"
    },
    {
      id: 2,
      type: "user",
      content: "How much did I spend on groceries this month?",
      timestamp: "2:31 PM"
    },
    {
      id: 3,
      type: "ai",
      content: "Based on your wallet data, you've spent ₹4,500 on groceries this month. That's ₹300 more than last month. Would you like me to suggest ways to optimize your grocery spending?",
      timestamp: "2:31 PM"
    }
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center p-6 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mr-4 p-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">NeoSpan AI</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] p-3 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-surface-1 border-border'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-2 ${
                  msg.type === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {msg.timestamp}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button 
                key={index}
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => setMessage(suggestion.text)}
              >
                <suggestion.icon className="w-3 h-3 mr-1" />
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about your expenses or create a shopping list..."
                className="pr-12 bg-surface-1 border-border"
              />
              <Button 
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => {}}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              size="sm"
              variant={isListening ? "default" : "outline"}
              className={`w-12 h-12 rounded-full ${
                isListening ? 'bg-destructive hover:bg-destructive/90' : ''
              }`}
              onClick={handleVoiceToggle}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by Gemini AI • Tap mic for voice input
          </p>
        </div>
      </main>
    </div>
  );
};

export default AiAssistantScreen;