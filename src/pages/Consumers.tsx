import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Users, Trash2, Loader2, MapPin, Hash, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Consumers = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [consumers, setConsumers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", consumerNo: "", meterNo: "", address: "" });

  useEffect(() => {
    if (!authLoading && !user) { navigate("/auth"); return; }
    if (user) fetchConsumers();
  }, [user, authLoading]);

  const fetchConsumers = async () => {
    setLoading(true);
    const { data } = await supabase.from("consumers").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setConsumers(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.consumerNo || !form.meterNo) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("consumers").insert({
      user_id: user!.id, name: form.name, consumer_no: form.consumerNo, meter_no: form.meterNo, address: form.address,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setForm({ name: "", consumerNo: "", meterNo: "", address: "" });
      setOpen(false);
      toast({ title: "Consumer Added" });
      fetchConsumers();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("consumers").delete().eq("id", id);
    toast({ title: "Consumer Removed" });
    fetchConsumers();
  };

  if (authLoading || loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Consumers</h1>
            <p className="text-muted-foreground">Manage your connected meters</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><PlusCircle className="w-4 h-4" />Add Consumer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Consumer</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Consumer Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Home, Office" /></div>
                <div className="space-y-2"><Label>Consumer Number</Label><Input value={form.consumerNo} onChange={(e) => setForm({ ...form, consumerNo: e.target.value })} placeholder="CON-XXXXXX" /></div>
                <div className="space-y-2"><Label>Meter Number</Label><Input value={form.meterNo} onChange={(e) => setForm({ ...form, meterNo: e.target.value })} placeholder="MTR-XXXX" /></div>
                <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" /></div>
                <Button onClick={handleAdd} className="w-full">Add Consumer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {consumers.length === 0 ? (
          <motion.div variants={fadeUp}>
            <Card className="border-border/50 border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium mb-1">No consumers added yet</p>
                <p className="text-muted-foreground text-sm">Click "Add Consumer" to get started.</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {consumers.map((c) => (
              <Card key={c.id} className="border-border/50 hover:shadow-md transition-all group border-l-4 border-l-primary">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{c.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> {c.consumer_no}</p>
                    <p className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> {c.meter_no}</p>
                    {c.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {c.address}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Consumers;
