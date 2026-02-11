import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PayBill = () => {
  const { toast } = useToast();
  const [method, setMethod] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
      toast({ title: "Payment Successful!", description: "Transaction ID: TXN-" + Date.now().toString().slice(-8) });
    }, 2000);
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-2">Your bill has been paid successfully.</p>
          <p className="text-sm text-muted-foreground mb-6">Transaction ID: TXN-{Date.now().toString().slice(-8)}</p>
          <div className="space-y-3">
            <Card className="border-border/50">
              <CardContent className="p-4 flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-lg">$132.50</span>
              </CardContent>
            </Card>
            <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">Pay Another Bill</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pay Bill</h1>

        <Card className="mb-6 border-border/50 bg-gradient-card">
          <CardHeader><CardTitle>Bill Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Bill Number</span><span className="font-medium">INV-2024-06</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Billing Month</span><span className="font-medium">June 2024</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Units Consumed</span><span className="font-medium">1,100 kWh</span></div>
            <div className="flex justify-between border-t border-border pt-3"><span className="font-semibold">Total Amount</span><span className="font-bold text-xl text-primary">$132.50</span></div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-border/50">
          <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
          <CardContent>
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
              <Label htmlFor="upi" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="upi" id="upi" />
                <Smartphone className="w-5 h-5 text-primary" />
                <div><p className="font-medium">UPI</p><p className="text-xs text-muted-foreground">Google Pay, PhonePe, etc.</p></div>
              </Label>
              <Label htmlFor="card" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-primary" />
                <div><p className="font-medium">Credit / Debit Card</p><p className="text-xs text-muted-foreground">Visa, Mastercard, etc.</p></div>
              </Label>
              <Label htmlFor="netbanking" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Building2 className="w-5 h-5 text-primary" />
                <div><p className="font-medium">Net Banking</p><p className="text-xs text-muted-foreground">All major banks</p></div>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button onClick={handlePay} className="w-full h-12 text-lg" disabled={paying}>
          {paying ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : `Pay $132.50`}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default PayBill;
