import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Users, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Consumer {
  id: string;
  name: string;
  consumerNo: string;
  meterNo: string;
  address: string;
}

const Consumers = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [consumers, setConsumers] = useState<Consumer[]>([
    { id: "1", name: "Home", consumerNo: "CON-001234", meterNo: "MTR-5678", address: "123 Main St" },
    { id: "2", name: "Office", consumerNo: "CON-005678", meterNo: "MTR-9012", address: "456 Business Ave" },
  ]);
  const [form, setForm] = useState({ name: "", consumerNo: "", meterNo: "", address: "" });

  const handleAdd = () => {
    if (!form.name || !form.consumerNo || !form.meterNo) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setConsumers([...consumers, { ...form, id: Date.now().toString() }]);
    setForm({ name: "", consumerNo: "", meterNo: "", address: "" });
    setOpen(false);
    toast({ title: "Consumer Added" });
  };

  const handleDelete = (id: string) => {
    setConsumers(consumers.filter((c) => c.id !== id));
    toast({ title: "Consumer Removed" });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Consumers</h1>
          <p className="text-muted-foreground">Manage your connected meters</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 w-4 h-4" />Add Consumer</Button>
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
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {consumers.map((c) => (
          <Card key={c.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <h3 className="font-semibold text-lg mb-2">{c.name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Consumer: {c.consumerNo}</p>
                <p>Meter: {c.meterNo}</p>
                <p>{c.address}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Consumers;
