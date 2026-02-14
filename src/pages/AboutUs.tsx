import Navbar from "@/components/Layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Users, Target, Shield, Globe, Award } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const team = [
  { name: "Rajesh Kumar", role: "CEO & Founder", initials: "RK" },
  { name: "Priya Sharma", role: "CTO", initials: "PS" },
  { name: "Amit Patel", role: "Head of Operations", initials: "AP" },
  { name: "Sneha Reddy", role: "Lead Developer", initials: "SR" },
];

const values = [
  { icon: Target, title: "Innovation", desc: "Pioneering smart energy solutions with cutting-edge technology" },
  { icon: Shield, title: "Reliability", desc: "99.9% uptime guarantee with enterprise-grade infrastructure" },
  { icon: Globe, title: "Sustainability", desc: "Committed to reducing carbon footprint through smart analytics" },
  { icon: Award, title: "Excellence", desc: "Award-winning platform trusted by 500K+ consumers" },
];

const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="container mx-auto px-4 relative">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">About Esyasoft</span>
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mb-6">
            Empowering Consumers with <span className="text-primary">Smart Energy</span> Solutions
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed">
            Esyasoft is a next-generation electricity consumer portal designed to make energy management simple, 
            transparent, and accessible for everyone. We bridge the gap between utility providers and consumers 
            with real-time analytics, seamless billing, and smart insights.
          </motion.p>
        </motion.div>
      </div>
    </section>

    {/* Mission */}
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To democratize energy management by providing every consumer with the tools and insights 
              they need to make informed decisions about their electricity usage.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that understanding your energy consumption shouldn't require a degree in engineering. 
              Our platform translates complex data into actionable insights that save money and help the environment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: "500K+", label: "Active Users" },
              { val: "₹2Cr+", label: "Bills Processed" },
              { val: "30%", label: "Avg Savings" },
              { val: "24/7", label: "Support" },
            ].map((s, i) => (
              <Card key={i} className="text-center p-6 border-border/50">
                <p className="text-3xl font-bold text-primary mb-1">{s.val}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <Card className="p-6 text-center border-border/50 hover:shadow-lg transition-all h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">The passionate minds behind Esyasoft</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {team.map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
              <Card className="text-center p-6 border-border/50 hover:shadow-lg transition-all">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary-foreground">{t.initials}</span>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Esyasoft</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2024 Esyasoft. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default AboutUs;
