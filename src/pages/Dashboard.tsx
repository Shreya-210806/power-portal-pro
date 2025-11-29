import Navbar from "@/components/Layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  DollarSign, 
  TrendingDown, 
  FileText,
  AlertCircle,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const Dashboard = () => {
  // Mock data for charts
  const monthlyUsage = [
    { month: "Jan", usage: 850, cost: 102 },
    { month: "Feb", usage: 920, cost: 110 },
    { month: "Mar", usage: 780, cost: 94 },
    { month: "Apr", usage: 890, cost: 107 },
    { month: "May", usage: 950, cost: 114 },
    { month: "Jun", usage: 1100, cost: 132 },
  ];

  const dailyUsage = [
    { day: "Mon", kwh: 32 },
    { day: "Tue", kwh: 28 },
    { day: "Wed", kwh: 35 },
    { day: "Thu", kwh: 30 },
    { day: "Fri", kwh: 33 },
    { day: "Sat", kwh: 38 },
    { day: "Sun", kwh: 36 },
  ];

  const stats = [
    {
      title: "Current Usage",
      value: "2.4 kWh",
      change: "+12%",
      changeType: "increase",
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "This Month",
      value: "$132.50",
      change: "-8%",
      changeType: "decrease",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Avg. Daily",
      value: "34.5 kWh",
      change: "+5%",
      changeType: "increase",
      icon: Activity,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Unpaid Bills",
      value: "1",
      change: "Due in 5 days",
      changeType: "neutral",
      icon: FileText,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's your energy overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    {stat.changeType !== "neutral" && (
                      <span className={`text-sm font-medium flex items-center gap-1 ${
                        stat.changeType === "increase" ? "text-destructive" : "text-success"
                      }`}>
                        {stat.changeType === "increase" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.changeType === "neutral" && (
                    <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyUsage}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Usage */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>This Week's Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="kwh" 
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-6 justify-start">
                <FileText className="mr-3 w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Pay Bill</div>
                  <div className="text-sm text-muted-foreground">Due: $132.50</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-6 justify-start">
                <Calendar className="mr-3 w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Schedule Payment</div>
                  <div className="text-sm text-muted-foreground">Set up auto-pay</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-6 justify-start">
                <Activity className="mr-3 w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">View Usage</div>
                  <div className="text-sm text-muted-foreground">Detailed analytics</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-6 justify-start">
                <TrendingDown className="mr-3 w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Energy Tips</div>
                  <div className="text-sm text-muted-foreground">Save more</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-border/50 border-l-4 border-l-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="font-medium text-sm mb-1">Bill Due Soon</p>
                <p className="text-sm text-muted-foreground">
                  Your bill of $132.50 is due in 5 days
                </p>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="font-medium text-sm mb-1">Great Job!</p>
                <p className="text-sm text-muted-foreground">
                  You've reduced usage by 8% this month
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="font-medium text-sm mb-1">Tip of the Day</p>
                <p className="text-sm text-muted-foreground">
                  Adjust thermostat by 2°F to save $50/year
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
