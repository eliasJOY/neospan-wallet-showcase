import BottomNavBar from "@/components/ui/bottom-navbr";
import { Card } from "@/components/ui/card";
import { getAllReciepts } from "@/firebase/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Passes = () => {
    const navigate = useNavigate();
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
  return (
    <div className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground fixed">Your Wallet</h2>
          <div className="flex flex-col gap-4 mt-8 overflow-y-auto pb-16 scrollbar-hide">
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

          <BottomNavBar />
        </div>
  )
}

export default Passes