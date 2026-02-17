import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Send, Loader2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import RatingWidget from "@/components/RatingWidget";
import { motion } from "framer-motion";

const faqs = [
  { q: "How do I pay my bill online?", a: "Go to the 'Pay Bill' page from the sidebar. Select your payment method (UPI, Card, or Net Banking) and confirm the payment." },
  { q: "How to add a new consumer/meter?", a: "Navigate to 'Consumers' in the sidebar and click 'Add Consumer'. Fill in the consumer name, number, meter number, and address." },
  { q: "What if my payment fails?", a: "If a payment fails, the amount will be refunded within 3-5 business days. You can retry payment from the Bills section." },
  { q: "How do I download my bill?", a: "Go to the Bills page and click the download icon next to the bill you want to download as a PDF." },
  { q: "How to set up auto-pay?", a: "Visit the Bills page and select the Auto-Pay option. Link your preferred payment method to enable automatic payments." },
];

const tips = [
  "Use LED bulbs — they consume 75% less energy than traditional bulbs.",
  "Unplug devices when not in use to avoid phantom power consumption.",
  "Set your AC to 24°C for optimal energy efficiency.",
  "Use natural light during daytime to reduce electricity usage.",
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const HelpSupport = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState({ subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("complaints").insert({
      user_id: user.id, subject: complaint.subject, message: complaint.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Complaint Submitted", description: "We'll get back to you within 24 hours." });
      setComplaint({ subject: "", message: "" });
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Help & Support</h1>
          <p className="text-muted-foreground">Get answers, submit complaints, or share feedback</p>
        </motion.div>

        <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg"><HelpCircle className="w-5 h-5 text-primary" />Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border/50">
                    <AccordionTrigger className="text-left text-sm hover:text-primary transition-colors">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg"><Send className="w-5 h-5 text-primary" />Submit a Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Subject</Label>
                    <Input value={complaint.subject} onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })} placeholder="Brief description" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message</Label>
                    <Textarea value={complaint.message} onChange={(e) => setComplaint({ ...complaint, message: e.target.value })} placeholder="Describe your issue in detail..." rows={4} required />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Complaint
                  </Button>
                </form>
              </CardContent>
            </Card>

            <RatingWidget />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="border-border/50 border-l-4 border-l-warning">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="w-5 h-5 text-warning" />Energy Saving Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                    <span className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default HelpSupport;
