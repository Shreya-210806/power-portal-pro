import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialConsumers = [
  { id: "1", name: "John Doe", consumerNo: "CON-001234", email: "john@example.com", status: "Active", balance: 132.50 },
  { id: "2", name: "Jane Smith", consumerNo: "CON-005678", email: "jane@example.com", status: "Active", balance: 0 },
  { id: "3", name: "Bob Wilson", consumerNo: "CON-009012", email: "bob@example.com", status: "Inactive", balance: 245.00 },
  { id: "4", name: "Alice Brown", consumerNo: "CON-003456", email: "alice@example.com", status: "Active", balance: 87.00 },
];

const AdminConsumers = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [consumers, setConsumers] = useState(initialConsumers);
  const filtered = consumers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.consumerNo.includes(search));

  const handleDelete = (id: string) => {
    setConsumers(consumers.filter((c) => c.id !== id));
    toast({ title: "Consumer Deleted" });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Consumers</h1>
          <p className="text-muted-foreground">{consumers.length} total consumers</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button><PlusCircle className="mr-2 w-4 h-4" />Add</Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Consumer No.</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Balance</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 font-mono text-sm">{c.consumerNo}</td>
                    <td className="p-4 text-sm">{c.email}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className={c.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold">${c.balance.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminConsumers;
