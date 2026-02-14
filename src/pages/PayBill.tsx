import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PayBill = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [method, setMethod] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [txnId, setTxnId] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) fetchBill();
  }, [user, authLoading]);

  const fetchBill = async () => {
    setLoading(true);
    const billId = searchParams.get("bill");
    if (billId) {
      const { data } = await supabase.from("bills").select("*").eq("id", billId).eq("user_id", user!.id).maybeSingle();
      setBill(data);
    } else {
      const { data } = await supabase.from("bills").select("*").eq("user_id", user!.id).eq("status", "unpaid").order("due_date", { ascending: true }).limit(1).maybeSingle();
      setBill(data);
    }
    setLoading(false);
  };

  const handlePay = async () => {
    if (!bill) return;
    setPaying(true);

    try {
      // Step 1: Create Razorpay order via backend edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: Number(bill.amount),
          currency: "INR",
          receipt: bill.bill_number,
          notes: { bill_id: bill.id, billing_month: bill.billing_month },
        },
      });

      if (orderError || !orderData?.order_id) {
        throw new Error(orderError?.message || "Failed to create payment order");
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Esyasoft Energy",
        description: `Bill Payment - ${bill.billing_month}`,
        order_id: orderData.order_id,
        prefill: {
          email: user?.email || "",
        },
        theme: { color: "#10b981" },
        method: {
          upi: method === "upi",
          card: method === "card",
          netbanking: method === "netbanking",
          wallet: false,
          paylater: false,
        },
        handler: async (response: any) => {
          // Step 3: Payment successful - save to database
          const generatedTxnId = response.razorpay_payment_id || "TXN-" + Date.now().toString().slice(-8);

          const { error: payError } = await supabase.from("payments").insert({
            user_id: user!.id,
            bill_id: bill.id,
            transaction_id: generatedTxnId,
            amount: bill.amount,
            payment_method: method,
            status: "Success",
          });

          if (!payError) {
            await supabase.from("bills").update({ status: "paid" }).eq("id", bill.id);
            await supabase.from("notifications").insert({
              user_id: user!.id,
              type: "success",
              title: "Payment Confirmed",
              message: `Your payment of ₹${Number(bill.amount).toFixed(2)} for ${bill.billing_month} has been confirmed. Transaction: ${generatedTxnId}`,
            });
          }

          setTxnId(generatedTxnId);
          setSuccess(true);
          setPaying(false);
          toast({ title: "Payment Successful!", description: `Transaction ID: ${generatedTxnId}` });
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast({ title: "Payment Cancelled", description: "You closed the payment window.", variant: "destructive" });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setPaying(false);
        toast({
          title: "Payment Failed",
          description: response.error?.description || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      });
      rzp.open();
    } catch (error: any) {
      setPaying(false);
      toast({ title: "Error", description: error.message || "Could not initiate payment.", variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  if (success && bill) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-2">Your bill has been paid successfully via Razorpay.</p>
          <p className="text-sm text-muted-foreground mb-6">Transaction ID: {txnId}</p>
          <div className="space-y-3">
            <Card className="border-border/50">
              <CardContent className="p-4 flex justify-between">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-lg">₹{Number(bill.amount).toFixed(2)}</span>
              </CardContent>
            </Card>
            <Button onClick={() => navigate("/bills")} variant="outline" className="w-full">View All Bills</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!bill) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-20">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Pending Bills</h1>
          <p className="text-muted-foreground">All your bills are paid. Great job!</p>
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
            <div className="flex justify-between"><span className="text-muted-foreground">Bill Number</span><span className="font-medium">{bill.bill_number}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Billing Month</span><span className="font-medium">{bill.billing_month}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Units Consumed</span><span className="font-medium">{Number(bill.units_consumed).toLocaleString()} kWh</span></div>
            <div className="flex justify-between border-t border-border pt-3"><span className="font-semibold">Total Amount</span><span className="font-bold text-xl text-primary">₹{Number(bill.amount).toFixed(2)}</span></div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-border/50">
          <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
          <CardContent>
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
              <Label htmlFor="upi" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="upi" id="upi" />
                <Smartphone className="w-5 h-5 text-primary" />
                <div><p className="font-medium">UPI</p><p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p></div>
              </Label>
              <Label htmlFor="card" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-primary" />
                <div><p className="font-medium">Credit / Debit Card</p><p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p></div>
              </Label>
              <Label htmlFor="netbanking" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Building2 className="w-5 h-5 text-primary" />
                <div><p className="font-medium">Net Banking</p><p className="text-xs text-muted-foreground">All major Indian banks</p></div>
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button onClick={handlePay} className="w-full h-12 text-lg" disabled={paying}>
          {paying ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : `Pay ₹${Number(bill.amount).toFixed(2)}`}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">Secured by Razorpay • 256-bit encryption</p>
      </div>
    </DashboardLayout>
  );
};

export default PayBill;
