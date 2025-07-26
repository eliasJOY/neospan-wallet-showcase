import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const LoginScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardContent className="flex flex-col items-center space-y-8 p-8">
          {/* Google Wallet Logo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Wallet size={64} className="text-primary" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-blue rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Google Wallet</h1>
              <p className="text-muted-foreground">Secure your digital life</p>
            </div>
          </div>

          {/* Login Form Placeholder */}
          <div className="w-full space-y-4">
            <Button 
              variant="wallet" 
              size="lg" 
              className="w-full"
              onClick={() => {
                // Authentication logic will go here
                console.log("Login clicked - add authentication logic");
              }}
            >
              Sign In
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => {
                // Registration logic will go here
                console.log("Register clicked - add authentication logic");
              }}
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;