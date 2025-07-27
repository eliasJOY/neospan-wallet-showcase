import {
  ArrowLeft, Mic, Send, Sparkles, TrendingUp, ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateChatReplyWithHistory } from "@/service/chat";

// Elegant markdown renderer component
const MarkdownRenderer = ({ content }) => {
  const renderMarkdown = (text) => {
    // Split by double newlines to handle paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;
      
      // Handle bullet points
      if (paragraph.includes('* ')) {
        const items = paragraph.split('\n').filter(line => line.trim().startsWith('* '));
        const nonListContent = paragraph.split('\n').filter(line => !line.trim().startsWith('* ')).join('\n');
        
        return (
          <div key={pIndex} className="mb-4">
            {nonListContent && (
              <div className="mb-2" dangerouslySetInnerHTML={{ 
                __html: formatInlineMarkdown(nonListContent.trim()) 
              }} />
            )}
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
              {items.map((item, iIndex) => (
                <li key={iIndex} className="leading-relaxed" 
                    dangerouslySetInnerHTML={{ 
                      __html: formatInlineMarkdown(item.replace(/^\*\s*/, '')) 
                    }} />
              ))}
            </ul>
          </div>
        );
      }
      
      // Handle regular paragraphs
      return (
        <div key={pIndex} className="mb-4 leading-relaxed" 
             dangerouslySetInnerHTML={{ 
               __html: formatInlineMarkdown(paragraph.trim()) 
             }} />
      );
    }).filter(Boolean);
  };
  
  const formatInlineMarkdown = (text) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Handle line breaks
      .replace(/\n/g, '<br />');
  };
  
  return <div className="space-y-2">{renderMarkdown(content)}</div>;
};

const AiAssistantScreen = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hi! I'm your Wallet AI assistant. I can help you analyze your expenses, create shopping lists, and find better deals. What would you like to know?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const quickSuggestions = [
    { text: "Show my spending trends", icon: TrendingUp },
    { text: "Create a grocery list", icon: ShoppingCart },
    { text: "Find cheaper alternatives", icon: Sparkles },
  ];

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    setLoading(true);

    try {
      const reply = await generateChatReplyWithHistory(message, [...chatMessages, newUserMessage]);

      const newAiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: reply,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Gemini chat error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Optionally integrate speech-to-text here
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center p-6 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => navigate("/home")} className="mr-4 p-0">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Wallet AI</h1>
        </div>
      </header>

      {/* Main Content - Updated with elegant styling */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[85%] ${
                  msg.type === "user"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface-1 border-border shadow-sm"
                }`}
              >
                <div className="p-5">
                  {msg.type === "user" ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="text-sm">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  )}
                  <p
                    className={`text-xs mt-3 pt-2 border-t ${
                      msg.type === "user"
                        ? "text-primary-foreground/70 border-primary-foreground/20"
                        : "text-muted-foreground border-border"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] bg-surface-1 border-border shadow-sm">
                <div className="p-5">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">AI is thinking...</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
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
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={sendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <Button
              size="sm"
              variant={isListening ? "default" : "outline"}
              className={`w-12 h-12 rounded-full ${
                isListening ? "bg-destructive hover:bg-destructive/90" : ""
              }`}
              onClick={handleVoiceToggle}
            >
              <Mic className={`w-5 h-5 ${isListening ? "animate-pulse" : ""}`} />
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