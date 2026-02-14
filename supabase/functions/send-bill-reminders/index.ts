import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find bills due within 3 days that are unpaid
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const today = new Date().toISOString().split("T")[0];
    const futureDate = threeDaysFromNow.toISOString().split("T")[0];

    const { data: dueBills } = await supabase
      .from("bills")
      .select("*")
      .eq("status", "unpaid")
      .gte("due_date", today)
      .lte("due_date", futureDate);

    if (!dueBills || dueBills.length === 0) {
      return new Response(JSON.stringify({ message: "No due bills found", count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create in-app notifications for each user with due bills
    const notifications = dueBills.map((bill) => ({
      user_id: bill.user_id,
      type: "warning",
      title: "Bill Due Reminder",
      message: `Your bill ${bill.bill_number} for ${bill.billing_month} (₹${Number(bill.amount).toFixed(2)}) is due on ${new Date(bill.due_date).toLocaleDateString()}. Pay now to avoid late fees.`,
    }));

    const { error } = await supabase.from("notifications").insert(notifications);

    return new Response(
      JSON.stringify({
        message: `Sent ${notifications.length} reminder(s)`,
        count: notifications.length,
        error: error?.message || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
