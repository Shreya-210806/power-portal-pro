import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { generateBillPdf } from "@/utils/generateBillPdf";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Bills = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) fetchBills();
  }, [user, authLoading]);

  const fetchBills = async () => {
    setLoading(true);
    const { data } = await supabase.from("bills").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setBills(data || []);
    setLoading(false);
  };

  const currentBill = bills.find(b => b.status === "unpaid");

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Bills & Payments</h1>
          <p className="text-muted-foreground">View and manage your electricity bills</p>
        </motion.div>

        {currentBill && (
          <motion.div variants={fadeUp}>
            <Card className="mb-6 border-border/50 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-5 text-primary-foreground">
                <p className="text-sm opacity-90 mb-1">Current Bill • {currentBill.billing_month}</p>
                <p className="text-3xl font-bold">₹{Number(currentBill.amount).toFixed(2)}</p>
              </div>
              <CardContent className="p-4">
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium">{new Date(currentBill.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Usage</p>
                      <p className="text-sm font-medium">{Number(currentBill.units_consumed).toLocaleString()} kWh</p>
                    </div>
                  </div>
                  <Button className="h-10" asChild>
                    <Link to={`/pay-bill?bill=${currentBill.id}`}><CreditCard className="mr-2 w-4 h-4" />Pay Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={fadeUp}>
          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Bill History</CardTitle></CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No bills found yet.</p>
              ) : (
                <div className="space-y-2">
                  {bills.map((bill) => (
                    <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-all gap-3 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{bill.billing_month}</p>
                          <p className="text-sm text-muted-foreground">{bill.bill_number} • {Number(bill.units_consumed).toLocaleString()} kWh</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{Number(bill.amount).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={bill.status === "paid" ? "secondary" : "destructive"} className={`capitalize ${bill.status === "paid" ? "bg-success/10 text-success border-success/20" : ""}`}>{bill.status}</Badge>
                        <Button variant="outline" size="icon" onClick={() => generateBillPdf(bill)} title="Download PDF" className="rounded-lg hover:bg-primary/5 hover:border-primary/50"><Download className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Bills;
