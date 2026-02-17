import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Consumption = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [usageData, setUsageData] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [usageRes, billsRes] = await Promise.all([
      supabase.from("usage_data").select("*").eq("user_id", user!.id).order("date", { ascending: true }),
      supabase.from("bills").select("*").eq("user_id", user!.id).order("created_at", { ascending: true }),
    ]);
    setUsageData(usageRes.data || []);
    setBills(billsRes.data || []);
    setLoading(false);
  };

  const monthlyData = bills.length > 0
    ? bills.map(b => ({ month: b.billing_month?.split(" ")[0] || "N/A", thisYear: Number(b.units_consumed) }))
    : [{ month: "No Data", thisYear: 0 }];

  const dailyData = usageData.length > 0
    ? usageData.slice(-30).map(d => ({ day: new Date(d.date).getDate(), kwh: Number(d.kwh) }))
    : Array.from({ length: 30 }, (_, i) => ({ day: i + 1, kwh: 0 }));

  const avgMonthly = bills.length > 0 ? Math.round(bills.reduce((sum, b) => sum + Number(b.units_consumed), 0) / bills.length) : 0;
  const peakDay = usageData.length > 0 ? Math.round(Math.max(...usageData.map(d => Number(d.kwh)))) : 0;

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Consumption Analytics</h1>
          <p className="text-muted-foreground">Track and compare your energy usage</p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Avg Monthly", value: `${avgMonthly} kWh`, icon: Zap, color: "text-primary", bg: "bg-primary/10", border: "border-l-primary" },
            { label: "Total Bills", value: `${bills.length}`, icon: TrendingDown, color: "text-success", bg: "bg-success/10", border: "border-l-success" },
            { label: "Peak Day", value: `${peakDay} kWh`, icon: TrendingUp, color: "text-warning", bg: "bg-warning/10", border: "border-l-warning" },
          ].map((s) => (
            <Card key={s.label} className={`border-border/50 border-l-4 ${s.border} group hover:shadow-md transition-all`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Monthly Comparison</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="thisYear" name="Units (kWh)" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Daily Usage (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="kwh" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Consumption;
