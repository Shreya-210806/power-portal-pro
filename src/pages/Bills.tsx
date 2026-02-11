import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Bills = () => {
  const bills = [
    { id: "INV-2024-06", date: "June 2024", amount: 132.50, status: "unpaid", dueDate: "Jun 25, 2024", usage: "1100 kWh" },
    { id: "INV-2024-05", date: "May 2024", amount: 114.00, status: "paid", dueDate: "May 25, 2024", usage: "950 kWh" },
    { id: "INV-2024-04", date: "April 2024", amount: 107.00, status: "paid", dueDate: "Apr 25, 2024", usage: "890 kWh" },
    { id: "INV-2024-03", date: "March 2024", amount: 94.00, status: "paid", dueDate: "Mar 25, 2024", usage: "780 kWh" },
    { id: "INV-2024-02", date: "February 2024", amount: 110.00, status: "paid", dueDate: "Feb 25, 2024", usage: "920 kWh" },
    { id: "INV-2024-01", date: "January 2024", amount: 102.00, status: "paid", dueDate: "Jan 25, 2024", usage: "850 kWh" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Bills & Payments</h1>
        <p className="text-muted-foreground">View and manage your electricity bills</p>
      </div>

      <Card className="mb-6 border-border/50 bg-gradient-card shadow-md">
        <CardHeader><CardTitle>Current Bill</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
              <p className="text-3xl font-bold text-primary">$132.50</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Due Date</p>
              <p className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" />Jun 25, 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Usage</p>
              <p className="text-lg font-semibold">1,100 kWh</p>
            </div>
            <div className="flex items-end">
              <Button className="w-full" asChild><Link to="/pay-bill"><CreditCard className="mr-2 w-4 h-4" />Pay Now</Link></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle>Bill History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bills.map((bill) => (
              <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{bill.date}</p>
                    <p className="text-sm text-muted-foreground">{bill.id} • {bill.usage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-lg">${bill.amount}</p>
                    <p className="text-xs text-muted-foreground">Due: {bill.dueDate}</p>
                  </div>
                  <Badge variant={bill.status === "paid" ? "secondary" : "destructive"} className="capitalize">{bill.status}</Badge>
                  <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Bills;
