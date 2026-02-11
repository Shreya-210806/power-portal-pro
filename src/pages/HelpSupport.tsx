import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  { q: "How do I pay my bill online?", a: "Go to the 'Pay Bill' page from the sidebar. Select your payment method (UPI, Card, or Net Banking) and confirm the payment." },
  { q: "How to add a new consumer/meter?", a: "Navigate to 'Consumers' in the sidebar and click 'Add Consumer'. Fill in the consumer name, number, meter number, and address." },
  { q: "What if my payment fails?", a: "If a payment fails, the amount will be refunded within 3-5 business days. You can retry payment from the Bills section." },
  { q: "How do I download my bill?", a: "Go to the Bills page and click the download icon next to the bill you want to download as a PDF." },
  { q: "How to set up auto-pay?", a: "Visit the Bills page and select the Auto-Pay option. Link your preferred payment method to enable automatic payments." },
];

const HelpSupport = () => {
  const { toast } = useToast();
  const [complaint, setComplaint] = useState({ subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Complaint Submitted", description: "We'll get back to you within 24 hours." });
    setComplaint({ subject: "", message: "" });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5" />Frequently Asked Questions</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="flex items-center gap-2"><Send className="w-5 h-5" />Submit a Complaint</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={complaint.subject} onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })} placeholder="Brief description" required />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={complaint.message} onChange={(e) => setComplaint({ ...complaint, message: e.target.value })} placeholder="Describe your issue in detail..." rows={5} required />
              </div>
              <Button type="submit" className="w-full"><Send className="mr-2 w-4 h-4" />Submit Complaint</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupport;
