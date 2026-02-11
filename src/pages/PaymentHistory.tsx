import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

const payments = [
  { txnId: "TXN-89234571", date: "2024-06-10 14:32:15", amount: 132.50, status: "Success" },
  { txnId: "TXN-78123456", date: "2024-05-12 09:15:42", amount: 114.00, status: "Success" },
  { txnId: "TXN-67012345", date: "2024-04-08 17:45:28", amount: 107.00, status: "Success" },
  { txnId: "TXN-55901234", date: "2024-03-15 11:22:09", amount: 94.00, status: "Success" },
  { txnId: "TXN-44890123", date: "2024-02-10 08:55:33", amount: 125.00, status: "Failed" },
];

const PaymentHistory = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-2">Payment History</h1>
    <p className="text-muted-foreground mb-6">All transactions sorted by most recent</p>

    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.txnId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-sm">{p.txnId}</td>
                  <td className="p-4 text-sm">{p.date}</td>
                  <td className="p-4 font-semibold">${p.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={p.status === "Success" ? "secondary" : "destructive"} className={p.status === "Success" ? "bg-success/10 text-success border-success/20" : ""}>
                      {p.status}
                    </Badge>
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

export default PaymentHistory;
