import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  User,
  Mail,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        {/* Profile Info */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-muted-foreground">john.doe@gmail.com</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">Premium Member</Badge>
                  <Badge variant="outline">Verified</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20">
              <User size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">John Doe</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20">
              <Mail size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">john.doe@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20">
              <Phone size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Options */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { icon: Shield, label: "Security & Privacy", description: "Manage your security settings" },
              { icon: CreditCard, label: "Payment Methods", description: "Manage your cards and payment options" },
              { icon: Bell, label: "Notifications", description: "Configure your notification preferences" },
              { icon: HelpCircle, label: "Help & Support", description: "Get help or contact support" },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-4 h-auto"
                onClick={() => console.log(`Navigate to ${item.label}`)}
              >
                <item.icon size={20} className="mr-3 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => console.log("Logout clicked")}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;