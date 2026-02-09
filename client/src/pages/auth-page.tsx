import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, ShieldCheck, User } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

export default function AuthPage() {
  const { login, isLoading, user } = useApp();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleLogin = async (role: 'user' | 'admin') => {
    await login(email || (role === 'admin' ? 'admin@medagent.ai' : 'alex@example.com'), role);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background z-10" />
        <img 
          src={heroBg} 
          alt="Medical AI Background" 
          className="w-full h-full object-cover opacity-20 blur-[2px]"
        />
      </div>

      <div className="relative z-20 w-full max-w-md px-4 animate-in zoom-in-95 duration-500">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 mb-4 rotate-3 hover:rotate-6 transition-transform">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground">
            MedAgent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Intelligent Pharmacy Management</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-background/50 backdrop-blur border">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="glass-card border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  className="w-full h-11 text-md shadow-lg shadow-primary/20" 
                  onClick={() => handleLogin('user')} 
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : (
                    <>
                      <User className="mr-2 h-4 w-4" /> User Login
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-primary transition-all"
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Admin Portal
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="glass-card border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join MedAgent AI for smart refills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleLogin('user')} disabled={isLoading}>
                  Create Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br/>
          &copy; 2024 MedAgent AI
        </p>
      </div>
    </div>
  );
}
