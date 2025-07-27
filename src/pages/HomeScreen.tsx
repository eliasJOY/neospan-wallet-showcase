import { Plus, CreditCard, Gift, Car, Heart, Camera, Home, Bot, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "@/components/ui/bottom-navbr";
import { get } from "http";
import { getAllReciepts } from "@/firebase/store";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const navigate = useNavigate();

  // const walletCards = [
  //   { id: 1, type: "Movie Ticket", merchant: "PVR Cinemas", gradient: "bg-gradient-purple", amount: "₹350" },
  //   { id: 2, type: "Food Voucher", merchant: "Zomato Gold", gradient: "bg-gradient-gold", amount: "₹500" },
  //   { id: 3, type: "Receipt Pass", merchant: "Amazon", gradient: "bg-gradient-blue", amount: "₹1,299" },
  // ];

  const [walletCards, setWalletCards] = useState([]);

useEffect(() => {
  const gradients = [
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-green-400 to-blue-500",
    "bg-gradient-to-r from-yellow-400 to-red-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-teal-400 to-cyan-500",
    "bg-gradient-to-r from-rose-400 to-fuchsia-500",
    "bg-gradient-to-r from-orange-400 to-amber-500",
  ];

  const getRandomGradient = () =>
    gradients[Math.floor(Math.random() * gradients.length)];

  const fetchWalletCards = async () => {
    const receipts = await getAllReciepts();
    const cards = receipts.map(receipt => ({
      id: receipt.id,
      type: receipt.passType || "Receipt",
      merchant: receipt.merchantName || "Unknown Merchant",
      gradient: getRandomGradient(),
      amount: `₹${Number(receipt.totalAmount).toFixed(2)}`
    }));
    setWalletCards(cards);
  };

  fetchWalletCards();
}, []);

  const quickAccessItems = [
    { title: "Loyalty Card", icon: CreditCard, color: "neo-purple" },
    { title: "Gift Card", icon: Gift, color: "neo-gold" },
    { title: "Transport Pass", icon: Car, color: "neo-green" },
    { title: "Health ID", icon: Heart, color: "destructive" },
    { title: "Add Photo Pass", icon: Camera, color: "neo-blue" },
  ];

  const smartSuggestions = [
    "You spent ₹1,200 on groceries last week",
    "Cheaper alternatives available for detergent",
    "Your loyalty points expire in 5 days"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-20">
        {/* Smart Suggestions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Smart Insights</h2>
          <div className="space-y-2">
            {smartSuggestions.map((suggestion, index) => (
              <Card key={index} className="p-3 bg-surface-1 border-border">
                <p className="text-sm text-foreground">{suggestion}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Wallet Cards Carousel */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Your Wallet</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {walletCards.map((card) => (
              <Card 
                key={card.id} 
                className={`min-w-[280px] h-40 p-4 ${card.gradient} shadow-card cursor-pointer transition-transform hover:scale-105`}
                onClick={() => navigate(`/pass/${card.id}`)}
              >
                <div className="flex flex-col justify-between h-full text-white">
                  <div>
                    <p className="text-sm opacity-90">{card.type}</p>
                    <p className="font-bold text-lg">{card.merchant}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-12 h-8 bg-white/20 rounded"></div>
                    <p className="text-xl font-bold">{card.amount}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickAccessItems.map((item, index) => (
              <Card 
                key={index} 
                className="p-4 bg-surface-1 border-border cursor-pointer transition-all hover:bg-surface-2"
                onClick={() => navigate('/add-pass')}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-12 h-12 rounded-full bg-${item.color}/20 flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-fab bg-primary hover:bg-primary/90 z-10"
        onClick={() => navigate('/add-pass')}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default HomeScreen;