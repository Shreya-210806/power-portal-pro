import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle2, Zap, CreditCard } from "lucide-react";

const notifications = [
  { id: 1, type: "warning", icon: AlertTriangle, title: "Bill Due Soon", message: "Your June bill of $132.50 is due in 3 days.", time: "2 hours ago", read: false },
  { id: 2, type: "alert", icon: Zap, title: "High Usage Alert", message: "Your usage today is 40% above average. Check your appliances.", time: "5 hours ago", read: false },
  { id: 3, type: "success", icon: CheckCircle2, title: "Payment Confirmed", message: "Your payment of $114.00 for May has been confirmed.", time: "2 days ago", read: true },
  { id: 4, type: "info", icon: CreditCard, title: "Auto-Pay Enabled", message: "Auto-pay has been set up for your account.", time: "1 week ago", read: true },
  { id: 5, type: "warning", icon: AlertTriangle, title: "Maintenance Notice", message: "Scheduled maintenance on July 5 from 2-4 AM.", time: "1 week ago", read: true },
];

const colorMap: Record<string, string> = {
  warning: "bg-warning/10 text-warning border-warning/20",
  alert: "bg-destructive/10 text-destructive border-destructive/20",
  success: "bg-success/10 text-success border-success/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const Notifications = () => (
  <DashboardLayout>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</p>
      </div>
    </div>

    <div className="space-y-3">
      {notifications.map((n) => {
        const Icon = n.icon;
        return (
          <Card key={n.id} className={`border-border/50 transition-colors ${!n.read ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[n.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{n.title}</h3>
                  {!n.read && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </DashboardLayout>
);

export default Notifications;
