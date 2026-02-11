import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Bell } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const bills = [
  { id: "INV-2024-1001", consumer: "John Doe", month: "June 2024", amount: 132.50, status: "Unpaid" },
  { id: "INV-2024-1002", consumer: "Jane Smith", month: "June 2024", amount: 98.00, status: "Paid" },
  { id: "INV-2024-1003", consumer: "Bob Wilson", month: "June 2024", amount: 245.00, status: "Overdue" },
  { id: "INV-2024-1004", consumer: "Alice Brown", month: "June 2024", amount: 87.00, status: "Paid" },
  { id: "INV-2024-0901", consumer: "John Doe", month: "May 2024", amount: 114.00, status: "Paid" },
];

const statusColors: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Unpaid: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
};

const AdminBills = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const filtered = bills.filter((b) => b.consumer.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search));

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Bills & Payments</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search bills..." className="pl-9 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Consumer</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Month</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-sm">{b.id}</td>
                    <td className="p-4 font-medium">{b.consumer}</td>
                    <td className="p-4 text-sm">{b.month}</td>
                    <td className="p-4 font-semibold">${b.amount.toFixed(2)}</td>
                    <td className="p-4"><Badge variant="secondary" className={statusColors[b.status]}>{b.status}</Badge></td>
                    <td className="p-4 flex gap-1">
                      <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                      {b.status !== "Paid" && (
                        <Button variant="ghost" size="icon" onClick={() => toast({ title: "Reminder Sent", description: `Reminder sent to ${b.consumer}` })}>
                          <Bell className="w-4 h-4" />
                        </Button>
                      )}
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

export default AdminBills;
