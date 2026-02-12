import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Payment History</h1>
      <p className="text-muted-foreground mb-6">All transactions sorted by most recent</p>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No payment history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Method</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-sm">{p.transaction_id}</td>
                      <td className="p-4 text-sm">{new Date(p.created_at).toLocaleString()}</td>
                      <td className="p-4 text-sm capitalize">{p.payment_method}</td>
                      <td className="p-4 font-semibold">${Number(p.amount).toFixed(2)}</td>
                      <td className="p-4">
                        <Badge variant={p.status === "Success" ? "secondary" : "destructive"} className={p.status === "Success" ? "bg-success/10 text-success border-success/20" : ""}>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PaymentHistory;
