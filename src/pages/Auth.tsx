import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      navigate("/dashboard");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("forgot-email") as HTMLInputElement).value;
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    toast({ title: "Reset Email Sent", description: "Check your inbox for the password reset link." });
    setShowForgot(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Welcome to PowerGrid</CardTitle>
              <CardDescription className="text-base mt-1">Manage your energy, control your costs</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {showForgot ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">Enter your email to receive a reset link</p>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="forgot-email" type="email" placeholder="your@email.com" required />
                </div>
                <Button type="submit" className="w-full">Send Reset Link</Button>
                <button type="button" onClick={() => setShowForgot(false)} className="w-full text-sm text-primary hover:underline">Back to Login</button>
              </form>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="your@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : "Login"}
                    </Button>
                    <div className="text-center">
                      <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-primary hover:underline">Forgot password?</button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Create a new account to get started</p>
                    <Button className="w-full" asChild><Link to="/register">Create Account</Link></Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="mt-6 pt-6 border-t border-border text-center">
              <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Login →</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
