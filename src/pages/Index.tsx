import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Layout/Navbar";
import { motion } from "framer-motion";
import {
  Zap, BarChart3, CreditCard, FileText, Bell, Shield, Leaf,
  ChevronRight, ArrowRight, CheckCircle2, Download, Users, Clock,
  TrendingUp, Phone, Mail, MapPin, Star
} from "lucide-react";
import heroImage from "@/assets/hero-energy.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: BarChart3, title: "Real-Time Usage", description: "Monitor your energy consumption with live analytics, graphs, and daily/monthly breakdowns", color: "text-primary" },
  { icon: CreditCard, title: "Easy Payments", description: "Multiple payment options with Razorpay integration and instant digital receipts", color: "text-accent" },
  { icon: Download, title: "Download PDF Bills", description: "Instantly download your electricity bills as beautifully formatted PDF documents anytime", color: "text-primary" },
  { icon: Bell, title: "Smart Alerts", description: "Get personalized notifications for due dates, usage spikes, and payment confirmations", color: "text-accent" },
  { icon: Shield, title: "Secure & Safe", description: "Bank-level encryption with 2FA authentication to keep your data protected", color: "text-primary" },
  { icon: Leaf, title: "Energy Tips", description: "AI-powered personalized recommendations to reduce consumption and lower your bills", color: "text-accent" },
];

const stats = [
  { value: "500K+", label: "Active Consumers", icon: Users },
  { value: "99.9%", label: "Platform Uptime", icon: Clock },
  { value: "24/7", label: "Customer Support", icon: Phone },
  { value: "30%", label: "Average Savings", icon: TrendingUp },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up with your consumer number and verify your identity in under 2 minutes", icon: Users },
  { step: "02", title: "Link Your Meter", desc: "Connect your smart electricity meter for automatic real-time data syncing", icon: Zap },
  { step: "03", title: "Manage & Save", desc: "View bills, download PDFs, track usage patterns, and optimize your energy costs", icon: TrendingUp },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero Section */}
    <section className="relative pt-28 pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div
        className="absolute inset-0 opacity-15 dark:opacity-10"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground tracking-wide">Smart Energy Management Platform</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-primary-foreground leading-[1.1] tracking-tight">
            Take Control of<br />
            <span className="text-accent-foreground/90">Your Energy</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-primary-foreground/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            Monitor usage in real-time, pay bills instantly, download PDF statements, and manage your 
            electricity account — all from one powerful consumer portal.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all font-semibold">
                Get Started Free <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Learn More <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={scaleIn} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* PDF Bill Download Highlight Section */}
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">PDF Bill Download</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">Download Your Bills<br />as PDF Anytime</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Access your complete billing history and download professionally formatted PDF bills 
                with a single click. Perfect for record-keeping, tax filing, or submitting to your employer.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Beautifully formatted with all bill details",
                  "Download current and past bills instantly",
                  "Print-ready layout with professional design",
                  "Includes usage breakdown and payment status",
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link to="/auth">
                <Button size="lg" className="px-8 shadow-lg">
                  <Download className="mr-2 w-5 h-5" /> Try It Now
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={scaleIn} custom={2}>
              <Card className="p-8 border-border/50 shadow-2xl bg-card relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent" />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Esyasoft</p>
                      <p className="text-xs text-muted-foreground">Electricity Bill</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase">Paid</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Bill Number</p>
                    <p className="font-semibold text-sm">EB-2026-001234</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Billing Month</p>
                    <p className="font-semibold text-sm">January 2026</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Units Consumed</p>
                    <p className="font-semibold text-sm">342 kWh</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                    <p className="font-semibold text-sm">15 Feb 2026</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-center mb-4">
                  <p className="text-primary-foreground/80 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold text-primary-foreground">₹2,847.00</p>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 w-4 h-4" /> Download PDF
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Platform Features</span>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete suite of tools to manage your electricity consumption, billing, and payments
          </motion.p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card h-full group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">How It Works</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-xl text-muted-foreground">Get started in three simple steps</motion.p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                  <Icon className="w-8 h-8 text-primary" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">Trusted by Consumers</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-xl text-muted-foreground">See what our users have to say</motion.p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { quote: "Finally, I can track my electricity usage in real-time and download PDF bills instantly. Saved 20% on my last bill!", name: "Anita M.", loc: "Mumbai", rating: 5 },
            { quote: "The payment process is incredibly smooth with Razorpay integration. No more standing in long queues!", name: "Vikram S.", loc: "Delhi", rating: 5 },
            { quote: "Best energy management platform I've used. The PDF bill download feature is an absolute lifesaver for tax season.", name: "Priya K.", loc: "Bangalore", rating: 5 },
          ].map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <Card className="p-8 border-border/50 h-full flex flex-col hover:shadow-lg transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed flex-1 text-lg">"{t.quote}"</p>
                <div className="mt-6 pt-6 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.loc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>
      <div className="container relative mx-auto px-4 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Save on Energy?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 500,000+ consumers who are managing their electricity bills smarter. 
            Download PDF bills, track usage, and save money.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all font-semibold">
                Create Your Account <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-16 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Esyasoft</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Smart energy management for modern consumers. Monitor, manage, and save.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Product</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/bills" className="hover:text-foreground transition-colors">Bills & PDF Download</Link>
              <Link to="/consumption" className="hover:text-foreground transition-colors">Usage Tracking</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Company</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <Link to="/auth" className="hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Support</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="/help" className="hover:text-foreground transition-colors">Help & FAQ</Link>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@esyasoft.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> 1800-XXX-XXXX</div>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2026 Esyasoft Energy. All rights reserved. Built with ⚡ for a sustainable future.</p>
        </div>
      </div>
    </footer>
  </div>
);

export default Index;
