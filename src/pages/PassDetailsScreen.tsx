import { ArrowLeft, QrCode, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const PassDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock pass data - in real app this would come from API/state
  const passData = {
    merchant: "PVR Cinemas",
    type: "Movie Ticket",
    amount: "₹350",
    date: "Dec 15, 2024",
    category: "Entertainment",
    gradient: "bg-gradient-purple",
    transactionId: "TXN123456789",
    location: "PVR Forum Mall",
    time: "7:30 PM"
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center p-6 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-4 p-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">Pass Details</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Pass Card */}
        <Card className={`p-6 ${passData.gradient} shadow-card`}>
          <div className="text-white space-y-4">
            <div>
              <p className="text-sm opacity-90">{passData.type}</p>
              <h2 className="text-2xl font-bold">{passData.merchant}</h2>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="flex justify-center py-6">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-20 h-20 text-black" />
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm opacity-90">Amount</p>
                <p className="text-xl font-bold">{passData.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">{passData.date}</p>
                <p className="text-sm opacity-90">{passData.time}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Transaction Details */}
        <Card className="p-4 bg-surface-1 border-border">
          <h3 className="font-semibold mb-3">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono">{passData.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span>{passData.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{passData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span>{passData.date} • {passData.time}</span>
            </div>
          </div>
        </Card>

        {/* Spending Insights Card */}
        <Card className="p-4 bg-surface-1 border-border">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-5 h-5 text-neo-blue" />
            <h3 className="font-semibold">Spending Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            This month you've spent ₹1,250 on Entertainment, which is 15% higher than last month.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/insights')}
          >
            View Detailed Insights
          </Button>
        </Card>
      </main>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-border space-y-3">
        <Button 
          variant="outline" 
          className="w-full h-12 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove from Wallet
        </Button>
      </div>
    </div>
  );
};

export default PassDetailsScreen;