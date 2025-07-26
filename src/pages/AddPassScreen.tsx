import { ArrowLeft, CreditCard, Gift, Car, Heart, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddPassScreen = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { 
      id: "loyalty", 
      title: "Loyalty Card", 
      icon: CreditCard, 
      description: "Store your membership cards",
      gradient: "bg-gradient-purple"
    },
    { 
      id: "gift", 
      title: "Gift Card", 
      icon: Gift, 
      description: "Add gift cards and vouchers",
      gradient: "bg-gradient-gold"
    },
    { 
      id: "transport", 
      title: "Transport Pass", 
      icon: Car, 
      description: "Metro, bus and travel passes",
      gradient: "bg-gradient-green"
    },
    { 
      id: "health", 
      title: "ABHA Health ID", 
      icon: Heart, 
      description: "Digital health identity",
      gradient: "bg-gradient-blue"
    },
    { 
      id: "photo", 
      title: "Photo", 
      icon: Camera, 
      description: "Upload QR code or barcode",
      gradient: "bg-gradient-purple"
    },
  ];

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
        <h1 className="text-xl font-bold">Add to Wallet</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <p className="text-muted-foreground mb-6">Choose the type of pass you want to add</p>
        
        <div className="space-y-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`p-4 border transition-all cursor-pointer ${
                selectedCategory === category.id 
                  ? 'border-primary bg-surface-2' 
                  : 'border-border bg-surface-1 hover:bg-surface-2'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${category.gradient} flex items-center justify-center`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedCategory === category.id 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {selectedCategory === category.id && (
                    <div className="w-full h-full rounded-full bg-primary-foreground transform scale-50"></div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Button */}
      <div className="p-6 border-t border-border">
        <Button 
          className="w-full h-12 text-lg font-semibold"
          disabled={!selectedCategory}
          onClick={() => navigate('/pass/new')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AddPassScreen;