import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Layout/Navbar";
import { motion } from "framer-motion";
import { 
  Zap, BarChart3, CreditCard, FileText, Bell, Shield, Leaf,
  ChevronRight, ArrowRight, CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/hero-energy.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: BarChart3, title: "Real-Time Usage", description: "Monitor your energy consumption with live analytics and insights" },
  { icon: CreditCard, title: "Easy Payments", description: "Multiple payment options with Razorpay and instant confirmations" },
  { icon: FileText, title: "Digital Bills", description: "Access and download your bills in PDF format anytime" },
  { icon: Bell, title: "Smart Alerts", description: "Get personalized notifications via push, SMS, or email" },
  { icon: Shield, title: "Secure & Safe", description: "Bank-level security with 2FA and encrypted transactions" },
  { icon: Leaf, title: "Energy Tips", description: "Personalized recommendations to save energy and reduce costs" },
];

const stats = [
  { value: "500K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
  { value: "30%", label: "Avg. Savings" },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up with your consumer number in under 2 minutes" },
  { step: "02", title: "Link Your Meter", desc: "Connect your electricity meter for real-time data" },
  { step: "03", title: "Manage & Save", desc: "View bills, track usage, and save on energy costs" },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero Section */}
    <section className="relative pt-28 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="container relative mx-auto px-4">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Smart Energy Management</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
            Take Control of Your Energy
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Monitor usage, pay bills, and manage your electricity account with our 
            comprehensive consumer portal. Save money with smart analytics.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                Get Started <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-14 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-4xl font-bold mb-4">Everything You Need</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete suite of tools to manage your electricity consumption and billing
          </motion.p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-gradient-card h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">{s.step}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials / Trust */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Trusted by Consumers</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { quote: "Finally, I can track my electricity usage in real-time. Saved 20% on my last bill!", name: "Anita M.", loc: "Mumbai" },
            { quote: "The payment process is so smooth with Razorpay. No more standing in queues!", name: "Vikram S.", loc: "Delhi" },
            { quote: "Best energy management platform. The PDF bill download is a lifesaver.", name: "Priya K.", loc: "Bangalore" },
          ].map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <Card className="p-6 border-border/50 h-full flex flex-col">
                <p className="text-muted-foreground italic flex-1">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.loc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="container relative mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-primary-foreground mb-4">Ready to Save on Energy?</h2>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Join thousands of users who are taking control of their energy consumption
        </p>
        <Link to="/auth">
          <Button size="lg" variant="secondary" className="text-lg px-8 shadow-xl hover:shadow-2xl transition-all">
            Create Your Account
          </Button>
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Esyasoft</span>
            </div>
            <p className="text-sm text-muted-foreground">Smart energy management for modern consumers.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <Link to="/auth" className="hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/help" className="hover:text-foreground transition-colors">Help & FAQ</Link>
              <span>support@esyasoft.com</span>
              <span>1800-XXX-XXXX</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">© 2024 Esyasoft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);

export default Index;
