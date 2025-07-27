import BottomNavBar from "@/components/ui/bottom-navbr";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Passes = () => {
    const navigate = useNavigate();
    const walletCards = [
    { id: 1, type: "Movie Ticket", merchant: "PVR Cinemas", gradient: "bg-gradient-purple", amount: "₹350" },
    { id: 2, type: "Food Voucher", merchant: "Zomato Gold", gradient: "bg-gradient-gold", amount: "₹500" },
    { id: 3, type: "Receipt Pass", merchant: "Amazon", gradient: "bg-gradient-blue", amount: "₹1,299" },
    { id: 4, type: "Receipt Pass", merchant: "Amazon", gradient: "bg-gradient-blue", amount: "₹1,299" },
  ];
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