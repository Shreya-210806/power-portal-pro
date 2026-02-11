import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Zap, DollarSign, TrendingDown, FileText, AlertCircle, Calendar,
  Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const Dashboard = () => {
  const monthlyUsage = [
    { month: "Jan", usage: 850 }, { month: "Feb", usage: 920 }, { month: "Mar", usage: 780 },
    { month: "Apr", usage: 890 }, { month: "May", usage: 950 }, { month: "Jun", usage: 1100 },
  ];

  const dailyUsage = [
    { day: "Mon", kwh: 32 }, { day: "Tue", kwh: 28 }, { day: "Wed", kwh: 35 },
    { day: "Thu", kwh: 30 }, { day: "Fri", kwh: 33 }, { day: "Sat", kwh: 38 }, { day: "Sun", kwh: 36 },
  ];

  const stats = [
    { title: "Current Usage", value: "2.4 kWh", change: "+12%", changeType: "increase", icon: Zap, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "This Month", value: "$132.50", change: "-8%", changeType: "decrease", icon: DollarSign, color: "text-success", bgColor: "bg-success/10" },
    { title: "Avg. Daily", value: "34.5 kWh", change: "+5%", changeType: "increase", icon: Activity, color: "text-warning", bgColor: "bg-warning/10" },
    { title: "Unpaid Bills", value: "1", change: "Due in 5 days", changeType: "neutral", icon: FileText, color: "text-destructive", bgColor: "bg-destructive/10" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Welcome back, John!</h1>
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
                  {stat.changeType !== "neutral" && (
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.changeType === "increase" ? "text-destructive" : "text-success"}`}>
                      {stat.changeType === "increase" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-0.5">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.changeType === "neutral" && <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>}
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
          <CardHeader><CardTitle>This Week's Usage</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyUsage}>
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
              <Link to="/pay-bill"><FileText className="mr-3 w-5 h-5" /><div className="text-left"><div className="font-semibold">Pay Bill</div><div className="text-sm text-muted-foreground">Due: $132.50</div></div></Link>
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
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="font-medium text-sm mb-0.5">Bill Due Soon</p>
              <p className="text-xs text-muted-foreground">$132.50 is due in 5 days</p>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="font-medium text-sm mb-0.5">Great Job!</p>
              <p className="text-xs text-muted-foreground">Usage down 8% this month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
