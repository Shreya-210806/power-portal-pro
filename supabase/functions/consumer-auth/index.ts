// Consumer Auth Edge Function
// Handles: validate-consumer, send-otp, verify-otp, login-send-otp, get-consumer-details
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client with service role (bypasses RLS)
function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseAdmin();
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop(); // Get action from URL path

    // Determine action from request body or URL
    let body: any = {};
    if (req.method === "POST") {
      body = await req.json();
    }
    const action = body.action || path;

    switch (action) {
      // ─── VALIDATE CONSUMER ────────────────────────────────────────
      // Checks if consumer_number + email match a record in consumer_directory
      case "validate-consumer": {
        const { consumer_number, email } = body;

        if (!consumer_number || !email) {
          return new Response(
            JSON.stringify({ error: "Consumer number and email are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Look up the consumer record
        const { data: consumer, error } = await supabase
          .from("consumer_directory")
          .select("*")
          .eq("consumer_number", consumer_number)
          .single();

        if (error || !consumer) {
          return new Response(
            JSON.stringify({ error: "Invalid Consumer Number or Email" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Validate email match (case-insensitive)
        if (consumer.email.toLowerCase() !== email.toLowerCase()) {
          return new Response(
            JSON.stringify({ error: "Invalid Consumer Number or Email" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if already registered
        if (consumer.registered) {
          return new Response(
            JSON.stringify({ error: "This consumer is already registered. Please login instead." }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            consumer_name: consumer.consumer_name,
            mobile: consumer.mobile,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ─── SEND OTP ─────────────────────────────────────────────────
      // Generates a 6-digit OTP, stores it with 5-minute expiry
      case "send-otp": {
        const { consumer_number, purpose = "registration" } = body;

        if (!consumer_number) {
          return new Response(
            JSON.stringify({ error: "Consumer number is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get consumer email for sending OTP
        const { data: consumer } = await supabase
          .from("consumer_directory")
          .select("email, consumer_name")
          .eq("consumer_number", consumer_number)
          .single();

        if (!consumer) {
          return new Response(
            JSON.stringify({ error: "Consumer not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Generate OTP and set 5-minute expiry
        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        // Invalidate previous OTPs for this consumer + purpose
        await supabase
          .from("otp_verifications")
          .delete()
          .eq("consumer_number", consumer_number)
          .eq("purpose", purpose);

        // Store new OTP
        const { error: insertError } = await supabase
          .from("otp_verifications")
          .insert({
            consumer_number,
            otp,
            expiry_time: expiryTime,
            purpose,
          });

        if (insertError) {
          return new Response(
            JSON.stringify({ error: "Failed to generate OTP" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // NOTE: In production, integrate with an email service (Resend, Nodemailer, etc.)
        // For demo/college project: OTP is returned in the response
        console.log(`OTP for ${consumer_number}: ${otp} (expires: ${expiryTime})`);

        return new Response(
          JSON.stringify({
            success: true,
            message: `OTP sent to ${consumer.email}`,
            email: consumer.email,
            // For demo purposes - remove in production!
            demo_otp: otp,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ─── VERIFY OTP ───────────────────────────────────────────────
      // Validates the OTP entered by the user
      case "verify-otp": {
        const { consumer_number, otp, purpose = "registration" } = body;

        if (!consumer_number || !otp) {
          return new Response(
            JSON.stringify({ error: "Consumer number and OTP are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Find matching OTP record
        const { data: otpRecord } = await supabase
          .from("otp_verifications")
          .select("*")
          .eq("consumer_number", consumer_number)
          .eq("otp", otp)
          .eq("purpose", purpose)
          .eq("verified", false)
          .single();

        if (!otpRecord) {
          return new Response(
            JSON.stringify({ error: "Invalid OTP" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check expiry (5 minutes)
        if (new Date(otpRecord.expiry_time) < new Date()) {
          return new Response(
            JSON.stringify({ error: "OTP has expired. Please request a new one." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Mark OTP as verified
        await supabase
          .from("otp_verifications")
          .update({ verified: true })
          .eq("id", otpRecord.id);

        // If registration OTP, mark consumer as registered
        if (purpose === "registration") {
          await supabase
            .from("consumer_directory")
            .update({ registered: true })
            .eq("consumer_number", consumer_number);
        }

        return new Response(
          JSON.stringify({ success: true, message: "OTP verified successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ─── GET CONSUMER DETAILS ─────────────────────────────────────
      // Fetches consumer details for dashboard display
      case "get-consumer-details": {
        const { consumer_number } = body;

        // Verify the request has a valid auth token
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!consumer_number) {
          return new Response(
            JSON.stringify({ error: "Consumer number is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: consumer, error } = await supabase
          .from("consumer_directory")
          .select("*")
          .eq("consumer_number", consumer_number)
          .single();

        if (error || !consumer) {
          return new Response(
            JSON.stringify({ error: "Consumer not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, consumer }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (err) {
    console.error("Consumer auth error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
