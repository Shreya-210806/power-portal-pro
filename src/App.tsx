import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import PayBill from "./pages/PayBill";
import PaymentHistory from "./pages/PaymentHistory";
import Consumption from "./pages/Consumption";
import Consumers from "./pages/Consumers";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import HelpSupport from "./pages/HelpSupport";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminConsumers from "./pages/admin/AdminConsumers";
import AdminBills from "./pages/admin/AdminBills";
import AdminReminders from "./pages/admin/AdminReminders";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/pay-bill" element={<PayBill />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/consumption" element={<Consumption />} />
          <Route path="/consumers" element={<Consumers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/consumers" element={<AdminConsumers />} />
          <Route path="/admin/bills" element={<AdminBills />} />
          <Route path="/admin/reminders" element={<AdminReminders />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
