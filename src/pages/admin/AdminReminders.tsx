import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const recentReminders = [
  { id: 1, target: "All Unpaid Users", message: "Your bill is due in 3 days", sent: "2024-06-18", count: 342 },
  { id: 2, target: "High Usage Users", message: "Your usage is above average this month", sent: "2024-06-15", count: 89 },
  { id: 3, target: "John Doe", message: "Payment overdue - please clear your balance", sent: "2024-06-10", count: 1 },
];

const AdminReminders = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ target: "", message: "" });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Reminder Sent!", description: `Notification sent to: ${form.target}` });
    setForm({ target: "", message: "" });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Reminder Notifications</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Send className="w-5 h-5" />Send Reminder</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label>Target</Label>
                <Input placeholder="e.g. All Unpaid Users, CON-001234" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Reminder message..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full"><Bell className="mr-2 w-4 h-4" />Send Reminder</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Recent Reminders</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentReminders.map((r) => (
              <div key={r.id} className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{r.target}</span>
                  <span className="text-xs text-muted-foreground">{r.sent}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{r.message}</p>
                <div className="flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="w-3 h-3" /> Sent to {r.count} user{r.count > 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReminders;
