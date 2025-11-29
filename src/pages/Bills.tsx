import Navbar from "@/components/Layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Calendar, DollarSign } from "lucide-react";

const Bills = () => {
  const bills = [
    {
      id: "INV-2024-06",
      date: "June 2024",
      amount: 132.50,
      status: "unpaid",
      dueDate: "Jun 25, 2024",
      usage: "1100 kWh"
    },
    {
      id: "INV-2024-05",
      date: "May 2024",
      amount: 114.00,
      status: "paid",
      dueDate: "May 25, 2024",
      usage: "950 kWh"
    },
    {
      id: "INV-2024-04",
      date: "April 2024",
      amount: 107.00,
      status: "paid",
      dueDate: "Apr 25, 2024",
      usage: "890 kWh"
    },
    {
      id: "INV-2024-03",
      date: "March 2024",
      amount: 94.00,
      status: "paid",
      dueDate: "Mar 25, 2024",
      usage: "780 kWh"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bills & Payments</h1>
          <p className="text-muted-foreground text-lg">
            View and manage your electricity bills
          </p>
        </div>

        {/* Current Bill Card */}
        <Card className="mb-8 border-border/50 bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle>Current Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-primary">$132.50</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Jun 25, 2024
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Usage</p>
                <p className="text-lg font-semibold">1,100 kWh</p>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <CreditCard className="mr-2 w-4 h-4" />
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-6">
              <div className="text-center">
                <CreditCard className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Credit/Debit Card</div>
                <div className="text-xs text-muted-foreground mt-1">Instant payment</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-6">
              <div className="text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-xs text-muted-foreground mt-1">1-2 business days</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-6">
              <div className="text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Auto-Pay</div>
                <div className="text-xs text-muted-foreground mt-1">Set it & forget it</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Bill History */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Bill History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bills.map((bill) => (
                <div 
                  key={bill.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{bill.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {bill.id} • {bill.usage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">${bill.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {bill.dueDate}
                      </p>
                    </div>
                    <Badge 
                      variant={bill.status === "paid" ? "secondary" : "destructive"}
                      className="capitalize"
                    >
                      {bill.status}
                    </Badge>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Bills;
