import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CaptchaCheckbox from "@/components/CaptchaCheckbox";
import OtpModal from "@/components/OtpModal";

// Registration flow:
// Step 1: Validate consumer_number + email against consumer_directory
// Step 2: Send OTP to consumer's email
// Step 3: Verify OTP
// Step 4: Create account with password

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [step, setStep] = useState<"validate" | "password" | "otp">("validate");
  const [consumerData, setConsumerData] = useState<any>(null);
  const [demoOtp, setDemoOtp] = useState<string>("");
  const [form, setForm] = useState({
    consumerNo: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Validate consumer number + email against the database
  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("consumer-auth", {
        body: {
          action: "validate-consumer",
          consumer_number: form.consumerNo,
          email: form.email,
        },
      });

      if (error || data?.error) {
        toast({
          title: "Validation Failed",
          description: data?.error || "Invalid Consumer Number or Email",
          variant: "destructive",
        });
      } else {
        // Consumer validated - store consumer data and move to password step
        setConsumerData(data);
        setForm({ ...form, mobile: data.mobile || form.mobile });
        setStep("password");
        toast({ title: "Consumer Verified", description: `Welcome, ${data.consumer_name}!` });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }

    setIsLoading(false);
  };

  // Step 2: Set password and send OTP
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaVerified) {
      toast({ title: "Error", description: "Please verify you're not a robot", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirm) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    // Send OTP for email verification
    try {
      const { data, error } = await supabase.functions.invoke("consumer-auth", {
        body: {
          action: "send-otp",
          consumer_number: form.consumerNo,
          purpose: "registration",
        },
      });

      if (error || data?.error) {
        toast({ title: "Error", description: data?.error || "Failed to send OTP", variant: "destructive" });
      } else {
        // Store demo OTP for display (college project demo)
        if (data.demo_otp) {
          setDemoOtp(data.demo_otp);
        }
        setStep("otp");
        toast({ title: "OTP Sent", description: `Verification code sent to ${data.email}` });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    }

    setIsLoading(false);
  };

  // Step 3: Verify OTP and complete registration
  const handleOtpVerify = async (otp: string) => {
    try {
      // Verify OTP via edge function
      const { data: otpResult, error: otpError } = await supabase.functions.invoke("consumer-auth", {
        body: {
          action: "verify-otp",
          consumer_number: form.consumerNo,
          otp,
          purpose: "registration",
        },
      });

      if (otpError || otpResult?.error) {
        toast({ title: "Invalid OTP", description: otpResult?.error || "Please try again", variant: "destructive" });
        return false;
      }

      // OTP verified - create the Supabase auth account
      setIsLoading(true);
      const { error: signUpError, data: signUpData } = await signUp(form.email, form.password, {
        full_name: consumerData.consumer_name,
        phone: form.mobile,
        consumer_no: form.consumerNo,
        consumer_name: consumerData.consumer_name,
      });

      if (signUpError) {
        toast({ title: "Registration Failed", description: signUpError.message, variant: "destructive" });
        setIsLoading(false);
        return false;
      }

      // Auto-create consumer record linked to the new user
      if (signUpData?.user) {
        await supabase.from("consumers").insert({
          user_id: signUpData.user.id,
          name: consumerData.consumer_name,
          consumer_no: form.consumerNo,
          meter_no: "",
        });
      }

      toast({ title: "Registration Successful!", description: "Your account has been created. Redirecting..." });
      setIsLoading(false);
      navigate("/dashboard");
      return true;
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    const { data } = await supabase.functions.invoke("consumer-auth", {
      body: {
        action: "send-otp",
        consumer_number: form.consumerNo,
        purpose: "registration",
      },
    });
    if (data?.demo_otp) setDemoOtp(data.demo_otp);
    toast({ title: "OTP Resent", description: "A new verification code has been sent" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg mb-3">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              {step === "validate" && "Verify your consumer details to register"}
              {step === "password" && `Welcome, ${consumerData?.consumer_name}! Set your password`}
              {step === "otp" && "Enter the OTP sent to your email"}
            </CardDescription>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {["validate", "password", "otp"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s ? "bg-primary text-primary-foreground" :
                    ["validate", "password", "otp"].indexOf(step) > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {["validate", "password", "otp"].indexOf(step) > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 h-0.5 ${["validate", "password", "otp"].indexOf(step) > i ? "bg-primary" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {/* Step 1: Consumer Validation */}
            {step === "validate" && (
              <form onSubmit={handleValidate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consumerNo">Consumer Number</Label>
                  <Input id="consumerNo" name="consumerNo" placeholder="e.g. CON-1001" value={form.consumerNo} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Validating...</> : "Verify Consumer"}
                </Button>
              </form>
            )}

            {/* Step 2: Set Password */}
            {step === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <p><strong>Consumer:</strong> {consumerData?.consumer_name}</p>
                  <p><strong>Number:</strong> {form.consumerNo}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" name="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
                </div>
                <CaptchaCheckbox onVerified={setCaptchaVerified} />
                <Button type="submit" className="w-full" disabled={isLoading || !captchaVerified}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending OTP...</> : "Send OTP & Register"}
                </Button>
                <button type="button" onClick={() => setStep("validate")} className="w-full text-sm text-primary hover:underline">
                  ← Back to validation
                </button>
              </form>
            )}

            {/* Demo OTP display (for college project testing) */}
            {step === "otp" && demoOtp && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-center mb-4">
                <p className="font-medium text-warning">Demo Mode OTP</p>
                <p className="text-2xl font-mono font-bold tracking-widest mt-1">{demoOtp}</p>
                <p className="text-xs text-muted-foreground mt-1">In production, this would be sent to your email only</p>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary hover:underline">Login</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <OtpModal
        open={step === "otp"}
        onOpenChange={(open) => { if (!open) setStep("password"); }}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
        title="Email Verification"
        description={`Enter the 6-digit OTP sent to ${form.email}`}
        loading={isLoading}
      />
    </div>
  );
};

export default Register;
