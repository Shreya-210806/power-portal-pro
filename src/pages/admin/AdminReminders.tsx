import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminReminders = () => {
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ target: "", message: "" });
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { navigate("/admin/login"); return; }
    if (user && isAdmin) fetchReminders();
  }, [user, isAdmin, authLoading]);

  const fetchReminders = async () => {
    setLoading(true);
    const { data } = await supabase.from("admin_reminders").select("*").order("created_at", { ascending: false });
    setReminders(data || []);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Send notification to all users with unpaid bills if target is "All Unpaid Users"
    let recipientCount = 0;
    if (form.target.toLowerCase().includes("all")) {
      const { data: unpaidBills } = await supabase.from("bills").select("user_id").eq("status", "unpaid");
      const userIds = [...new Set((unpaidBills || []).map(b => b.user_id))];
      if (userIds.length > 0) {
        const notifs = userIds.map(uid => ({
          user_id: uid,
          type: "warning",
          title: "Payment Reminder",
          message: form.message,
        }));
        await supabase.from("notifications").insert(notifs);
        recipientCount = userIds.length;
      }
    }

    // Save reminder record
    await supabase.from("admin_reminders").insert({
      admin_user_id: user!.id,
      target: form.target,
      message: form.message,
      recipient_count: recipientCount,
    });

    setSending(false);
    toast({ title: "Reminder Sent!", description: `Notification sent to ${recipientCount} user(s)` });
    setForm({ target: "", message: "" });
    fetchReminders();
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

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
                <Input placeholder='e.g. "All Unpaid Users"' value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Reminder message..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Bell className="mr-2 w-4 h-4" />}
                Send Reminder
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle>Recent Reminders</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reminders sent yet.</p>
            ) : (
              reminders.map((r) => (
                <div key={r.id} className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{r.target}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{r.message}</p>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="w-3 h-3" /> Sent to {r.recipient_count} user{r.recipient_count !== 1 ? "s" : ""}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReminders;
