import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2, CheckCircle2, Loader2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
import { generateBillPdf } from "@/utils/generateBillPdf";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

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

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Esyasoft Energy",
        description: `Bill Payment - ${bill.billing_month}`,
        order_id: orderData.order_id,
        prefill: { email: user?.email || "" },
        theme: { color: "#10b981" },
        method: {
          upi: method === "upi",
          card: method === "card",
          netbanking: method === "netbanking",
          wallet: false,
          paylater: false,
        },
        handler: async (response: any) => {
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

  const handleDownloadReceipt = () => {
    if (!bill || !txnId) return;
    generateReceiptPdf({
      transactionId: txnId,
      amount: Number(bill.amount),
      billNumber: bill.bill_number,
      billingMonth: bill.billing_month,
      paymentMethod: method,
      date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    });
  };

  const handleDownloadBill = () => {
    if (!bill) return;
    generateBillPdf(bill);
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  if (success && bill) {
    return (
      <DashboardLayout>
        <motion.div className="max-w-lg mx-auto py-12" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-success/20">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">Your bill has been paid successfully via Razorpay.</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="border-border/50 mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-success to-accent p-4 text-accent-foreground text-center">
                <p className="text-sm opacity-90">Amount Paid</p>
                <p className="text-3xl font-bold">₹{Number(bill.amount).toFixed(2)}</p>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{txnId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bill Number</span>
                  <span className="font-medium">{bill.bill_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing Month</span>
                  <span className="font-medium">{bill.billing_month}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{method}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleDownloadReceipt} variant="outline" className="h-12 gap-2">
                <Download className="w-4 h-4" />
                Receipt PDF
              </Button>
              <Button onClick={handleDownloadBill} variant="outline" className="h-12 gap-2">
                <FileText className="w-4 h-4" />
                Bill PDF
              </Button>
            </div>
            <Button onClick={() => navigate("/bills")} variant="secondary" className="w-full h-12">
              View All Bills
            </Button>
          </motion.div>
        </motion.div>
      </DashboardLayout>
    );
  }

  if (!bill) {
    return (
      <DashboardLayout>
        <motion.div className="max-w-lg mx-auto text-center py-20" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">No Pending Bills</h1>
          <p className="text-muted-foreground">All your bills are paid. Great job!</p>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div className="max-w-lg mx-auto" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.h1 variants={fadeUp} className="text-3xl font-bold mb-6">Pay Bill</motion.h1>

        <motion.div variants={fadeUp}>
          <Card className="mb-6 border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
              <p className="text-primary-foreground/80 text-sm">Total Amount Due</p>
              <p className="text-3xl font-bold text-primary-foreground">₹{Number(bill.amount).toFixed(2)}</p>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bill Number</span><span className="font-medium">{bill.bill_number}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Billing Month</span><span className="font-medium">{bill.billing_month}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Units Consumed</span><span className="font-medium">{Number(bill.units_consumed).toLocaleString()} kWh</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Due Date</span><span className="font-medium">{new Date(bill.due_date).toLocaleDateString("en-IN")}</span></div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Payment Method</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
                {[
                  { value: "upi", icon: Smartphone, label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
                  { value: "card", icon: CreditCard, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                  { value: "netbanking", icon: Building2, label: "Net Banking", desc: "All major Indian banks" },
                ].map((opt) => (
                  <Label key={opt.value} htmlFor={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-sm">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <opt.icon className="w-5 h-5 text-primary" />
                    <div><p className="font-medium">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Button onClick={handlePay} className="w-full h-12 text-lg font-semibold" disabled={paying}>
            {paying ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : `Pay ₹${Number(bill.amount).toFixed(2)}`}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">Secured by Razorpay • 256-bit encryption</p>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PayBill;
