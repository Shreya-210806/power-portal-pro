import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import OtpModal from "@/components/OtpModal";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowOtp(true); }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-3">
              <Shield className="w-7 h-7 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Authorized personnel only</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="admin@powergrid.com" required /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" required /></div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <OtpModal open={showOtp} onOpenChange={setShowOtp} onVerify={() => { setShowOtp(false); navigate("/admin/dashboard"); }} title="Admin Verification" description="Enter OTP sent to your admin email" />
    </div>
  );
};

export default AdminLogin;
