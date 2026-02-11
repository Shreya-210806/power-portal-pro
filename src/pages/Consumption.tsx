import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown, TrendingUp, Zap } from "lucide-react";

const monthlyData = [
  { month: "Jan", thisYear: 850, lastYear: 900 },
  { month: "Feb", thisYear: 920, lastYear: 950 },
  { month: "Mar", thisYear: 780, lastYear: 880 },
  { month: "Apr", thisYear: 890, lastYear: 920 },
  { month: "May", thisYear: 950, lastYear: 1000 },
  { month: "Jun", thisYear: 1100, lastYear: 1150 },
];

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  kwh: 25 + Math.random() * 20,
}));

const Consumption = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-2">Consumption Analytics</h1>
    <p className="text-muted-foreground mb-6">Track and compare your energy usage</p>

    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Avg Monthly", value: "915 kWh", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        { label: "vs Last Year", value: "-5.2%", icon: TrendingDown, color: "text-success", bg: "bg-success/10" },
        { label: "Peak Day", value: "42 kWh", icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
      ].map((s) => (
        <Card key={s.label} className="border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-border/50">
        <CardHeader><CardTitle>Monthly Comparison</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="thisYear" name="2024" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastYear" name="2023" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Daily Usage (This Month)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="kwh" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Consumption;
