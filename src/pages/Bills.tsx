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
    const { data } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setBills(data || []);
    setLoading(false);
  };

  const currentBill = bills.find(b => b.status === "unpaid");

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Bills & Payments</h1>
        <p className="text-muted-foreground">View and manage your electricity bills</p>
      </div>

      {currentBill && (
        <Card className="mb-6 border-border/50 bg-gradient-card shadow-md">
          <CardHeader><CardTitle>Current Bill</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-primary">${Number(currentBill.amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                <p className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(currentBill.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Usage</p>
                <p className="text-lg font-semibold">{Number(currentBill.units_consumed).toLocaleString()} kWh</p>
              </div>
              <div className="flex items-end">
                <Button className="w-full" asChild><Link to={`/pay-bill?bill=${currentBill.id}`}><CreditCard className="mr-2 w-4 h-4" />Pay Now</Link></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader><CardTitle>Bill History</CardTitle></CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No bills found yet.</p>
          ) : (
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{bill.billing_month}</p>
                      <p className="text-sm text-muted-foreground">{bill.bill_number} • {Number(bill.units_consumed).toLocaleString()} kWh</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg">${Number(bill.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={bill.status === "paid" ? "secondary" : "destructive"} className="capitalize">{bill.status}</Badge>
                    <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Bills;
