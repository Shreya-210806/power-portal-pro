import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, FileText, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42500 },
  { month: "Feb", revenue: 46200 },
  { month: "Mar", revenue: 39100 },
  { month: "Apr", revenue: 44700 },
  { month: "May", revenue: 48000 },
  { month: "Jun", revenue: 55200 },
];

const stats = [
  { title: "Total Users", value: "12,485", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { title: "Revenue (June)", value: "$55,200", icon: DollarSign, color: "text-success", bg: "bg-success/10" },
  { title: "Pending Bills", value: "342", icon: FileText, color: "text-warning", bg: "bg-warning/10" },
  { title: "Growth", value: "+12.5%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
];

const AdminDashboard = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
    <p className="text-muted-foreground mb-6">System overview and analytics</p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
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
          <BarChart data={revenueData}>
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

export default AdminDashboard;
