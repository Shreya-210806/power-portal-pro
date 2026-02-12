import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, FileText, TrendingUp, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, revenue: 0, pendingBills: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { navigate("/admin/login"); return; }
    if (user && isAdmin) fetchData();
  }, [user, isAdmin, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, paymentsRes, billsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("payments").select("amount, created_at").eq("status", "Success"),
      supabase.from("bills").select("id", { count: "exact", head: true }).eq("status", "unpaid"),
    ]);

    const totalRevenue = (paymentsRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);
    setStats({
      totalUsers: profilesRes.count || 0,
      revenue: totalRevenue,
      pendingBills: billsRes.count || 0,
    });

    // Group payments by month for chart
    const monthGroups: Record<string, number> = {};
    (paymentsRes.data || []).forEach(p => {
      const month = new Date(p.created_at).toLocaleString("default", { month: "short" });
      monthGroups[month] = (monthGroups[month] || 0) + Number(p.amount);
    });
    setRevenueData(Object.entries(monthGroups).map(([month, revenue]) => ({ month, revenue })));
    setLoading(false);
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  const statCards = [
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-success", bg: "bg-success/10" },
    { title: "Pending Bills", value: stats.pendingBills.toString(), icon: FileText, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">System overview and analytics</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {statCards.map((s) => (
          <Card key={s.title} className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.title}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData.length > 0 ? revenueData : [{ month: "No Data", revenue: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
