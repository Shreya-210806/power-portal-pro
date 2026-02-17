import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const PaymentHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) fetchPayments();
  }, [user, authLoading]);

  const fetchPayments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setPayments(data || []);
    setLoading(false);
  };

  const handleDownloadReceipt = (p: any) => {
    generateReceiptPdf({
      transactionId: p.transaction_id,
      amount: Number(p.amount),
      billNumber: p.bill_id || "N/A",
      billingMonth: "N/A",
      paymentMethod: p.payment_method,
      date: new Date(p.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    });
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Payment History</h1>
          <p className="text-muted-foreground">All transactions sorted by most recent</p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No payment history yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Transaction ID</th>
                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Date & Time</th>
                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Method</th>
                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Amount</th>
                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Status</th>
                        <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-mono text-sm">{p.transaction_id}</td>
                          <td className="p-4 text-sm">{new Date(p.created_at).toLocaleString()}</td>
                          <td className="p-4 text-sm capitalize">{p.payment_method}</td>
                          <td className="p-4 font-semibold">₹{Number(p.amount).toFixed(2)}</td>
                          <td className="p-4">
                            <Badge variant={p.status === "Success" ? "secondary" : "destructive"} className={p.status === "Success" ? "bg-success/10 text-success border-success/20" : ""}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="icon" className="rounded-lg h-8 w-8" onClick={() => handleDownloadReceipt(p)} title="Download Receipt">
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PaymentHistory;
