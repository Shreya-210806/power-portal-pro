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
import { supabase } from "@/integrations/supabase/client";
import OtpModal from "@/components/OtpModal";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Login OTP state
  const [showLoginOtp, setShowLoginOtp] = useState(false);
  const [loginDemoOtp, setLoginDemoOtp] = useState("");
  const [pendingLoginSession, setPendingLoginSession] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  // Step 1: Validate credentials, then send OTP for extra security
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // First authenticate with email + password
    const { data, error } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Get consumer number from user metadata to send login OTP
    const consumerNo = data?.user?.user_metadata?.consumer_no;
    if (consumerNo) {
      // Send login OTP for extra security
      try {
        const { data: otpData } = await supabase.functions.invoke("consumer-auth", {
          body: {
            action: "send-otp",
            consumer_number: consumerNo,
            purpose: "login",
          },
        });

        if (otpData?.demo_otp) {
          setLoginDemoOtp(otpData.demo_otp);
        }

        setPendingLoginSession(data);
        setShowLoginOtp(true);
        toast({ title: "OTP Sent", description: "Enter the OTP sent to your registered email" });
      } catch {
        // If OTP sending fails, allow login anyway
        toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
        navigate("/dashboard");
      }
    } else {
      // No consumer number (admin or old user) - skip OTP
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  // Step 2: Verify login OTP
  const handleLoginOtpVerify = async (otp: string) => {
    const consumerNo = pendingLoginSession?.user?.user_metadata?.consumer_no;

    const { data, error } = await supabase.functions.invoke("consumer-auth", {
      body: {
        action: "verify-otp",
        consumer_number: consumerNo,
        otp,
        purpose: "login",
      },
    });

    if (error || data?.error) {
      toast({ title: "Invalid OTP", description: data?.error || "Please try again", variant: "destructive" });
      return false;
    }

    toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
    navigate("/dashboard");
    return true;
  };

  // Resend login OTP
  const handleResendLoginOtp = async () => {
    const consumerNo = pendingLoginSession?.user?.user_metadata?.consumer_no;
    if (!consumerNo) return;

    const { data } = await supabase.functions.invoke("consumer-auth", {
      body: { action: "send-otp", consumer_number: consumerNo, purpose: "login" },
    });
    if (data?.demo_otp) setLoginDemoOtp(data.demo_otp);
    toast({ title: "OTP Resent", description: "A new verification code has been sent" });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("forgot-email") as HTMLInputElement).value;
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
              <CardTitle className="text-2xl">Welcome to Esyasoft</CardTitle>
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
                    <p className="text-muted-foreground">Create a new account with your consumer details</p>
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

        {/* Demo OTP display for login */}
        {showLoginOtp && loginDemoOtp && (
          <Card className="mt-4 border-warning/30 bg-warning/5">
            <CardContent className="p-4 text-center">
              <p className="font-medium text-sm text-warning">Demo Login OTP</p>
              <p className="text-2xl font-mono font-bold tracking-widest mt-1">{loginDemoOtp}</p>
              <p className="text-xs text-muted-foreground mt-1">In production, sent to email only</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Login OTP Modal */}
      <OtpModal
        open={showLoginOtp}
        onOpenChange={(open) => {
          if (!open) {
            setShowLoginOtp(false);
            // Sign out if OTP is cancelled
            supabase.auth.signOut();
          }
        }}
        onVerify={handleLoginOtpVerify}
        onResend={handleResendLoginOtp}
        title="Login Verification"
        description="Enter the OTP sent to your registered email for extra security"
      />
    </div>
  );
};

export default Auth;
