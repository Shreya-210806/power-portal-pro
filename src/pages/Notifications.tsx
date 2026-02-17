import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Zap, CreditCard, Bell, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const iconMap: Record<string, any> = {
  warning: AlertTriangle,
  alert: Zap,
  success: CheckCircle2,
  info: CreditCard,
};

const colorMap: Record<string, string> = {
  warning: "bg-warning/10 text-warning",
  alert: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  info: "bg-primary/10 text-primary",
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Notifications = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) fetchNotifications();
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        setNotifications(prev => [payload.new as any, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">{unreadCount} new</Badge>
          )}
        </motion.div>

        {notifications.length === 0 ? (
          <motion.div variants={fadeUp}>
            <Card className="border-border/50 border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-1">No notifications yet</p>
                <p className="text-muted-foreground text-sm">You'll see updates here when they arrive.</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="space-y-2">
            {notifications.map((n) => {
              const Icon = iconMap[n.type] || Bell;
              const colors = colorMap[n.type] || colorMap.info;
              const timeAgo = getTimeAgo(n.created_at);
              return (
                <Card
                  key={n.id}
                  className={`border-border/50 transition-all cursor-pointer hover:shadow-sm ${!n.read ? "border-l-4 border-l-primary bg-primary/[0.03]" : ""}`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{n.title}</h3>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default Notifications;
