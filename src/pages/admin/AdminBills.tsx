import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success",
  unpaid: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
};

const AdminBills = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { navigate("/admin/login"); return; }
    if (user && isAdmin) fetchBills();
  }, [user, isAdmin, authLoading]);

  const fetchBills = async () => {
    setLoading(true);
    const { data } = await supabase.from("bills").select("*").order("created_at", { ascending: false });
    setBills(data || []);
    setLoading(false);
  };

  const filtered = bills.filter(b =>
    b.bill_number?.toLowerCase().includes(search.toLowerCase()) ||
    b.billing_month?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Bills & Payments</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search bills..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {bills.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No bills found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">User ID</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Month</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-sm">{b.bill_number}</td>
                      <td className="p-4 font-mono text-xs">{b.user_id?.slice(0, 8)}...</td>
                      <td className="p-4 text-sm">{b.billing_month}</td>
                      <td className="p-4 font-semibold">${Number(b.amount).toFixed(2)}</td>
                      <td className="p-4"><Badge variant="secondary" className={statusColors[b.status] || ""}>{b.status}</Badge></td>
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

export default AdminBills;
