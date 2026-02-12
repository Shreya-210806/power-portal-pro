import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Zap, DollarSign, TrendingDown, FileText, AlertCircle, Calendar,
  Activity, ArrowUpRight, ArrowDownRight, Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [usageData, setUsageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, billsRes, usageRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("bills").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("usage_data").select("*").eq("user_id", user!.id).order("date", { ascending: true }),
    ]);
    setProfile(profileRes.data);
    setBills(billsRes.data || []);
    setUsageData(usageRes.data || []);
    setLoading(false);
  };

  const unpaidBills = bills.filter(b => b.status === "unpaid");
  const totalDue = unpaidBills.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalUnits = bills.filter(b => {
    const now = new Date();
    return b.billing_month?.includes(now.getFullYear().toString());
  }).reduce((sum, b) => sum + Number(b.units_consumed), 0);

  // Build chart data from usage_data or fallback
  const monthlyUsage = usageData.length > 0 
    ? Object.entries(
        usageData.reduce((acc: Record<string, number>, d) => {
          const month = new Date(d.date).toLocaleString("default", { month: "short" });
          acc[month] = (acc[month] || 0) + Number(d.kwh);
          return acc;
        }, {})
      ).map(([month, usage]) => ({ month, usage }))
    : [{ month: "No Data", usage: 0 }];

  const recentUsage = usageData.slice(-7).map(d => ({
    day: new Date(d.date).toLocaleString("default", { weekday: "short" }),
    kwh: Number(d.kwh),
  }));

  const stats = [
    { title: "Total Units", value: totalUnits > 0 ? `${totalUnits} kWh` : "0 kWh", change: "", changeType: "neutral", icon: Zap, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Amount Due", value: `$${totalDue.toFixed(2)}`, change: unpaidBills.length > 0 ? `${unpaidBills.length} unpaid` : "All paid!", changeType: "neutral", icon: DollarSign, color: "text-success", bgColor: "bg-success/10" },
    { title: "Total Bills", value: `${bills.length}`, change: "", changeType: "neutral", icon: FileText, color: "text-warning", bgColor: "bg-warning/10" },
    { title: "Unpaid Bills", value: `${unpaidBills.length}`, change: unpaidBills.length > 0 && unpaidBills[0]?.due_date ? `Due: ${new Date(unpaidBills[0].due_date).toLocaleDateString()}` : "", changeType: "neutral", icon: Activity, color: "text-destructive", bgColor: "bg-destructive/10" },
  ];

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {profile?.full_name || "User"}!</h1>
        <p className="text-muted-foreground">Here's your energy overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-0.5">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.change && <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle>Monthly Overview</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyUsage}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Recent Daily Usage</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={recentUsage.length > 0 ? recentUsage : [{ day: "No Data", kwh: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="kwh" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-5 justify-start" asChild>
              <Link to="/pay-bill"><FileText className="mr-3 w-5 h-5" /><div className="text-left"><div className="font-semibold">Pay Bill</div><div className="text-sm text-muted-foreground">Due: ${totalDue.toFixed(2)}</div></div></Link>
            </Button>
            <Button variant="outline" className="h-auto py-5 justify-start" asChild>
              <Link to="/consumption"><Activity className="mr-3 w-5 h-5" /><div className="text-left"><div className="font-semibold">View Usage</div><div className="text-sm text-muted-foreground">Detailed analytics</div></div></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-warning" />Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unpaidBills.length > 0 ? (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="font-medium text-sm mb-0.5">Bill Due Soon</p>
                <p className="text-xs text-muted-foreground">${totalDue.toFixed(2)} total due</p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="font-medium text-sm mb-0.5">All Clear!</p>
                <p className="text-xs text-muted-foreground">No pending bills</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
