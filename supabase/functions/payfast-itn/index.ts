import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { required } from "../_shared/http.ts";

// IMPORTANT: Complete the PayFast ITN signature validation and source validation against the
// current official PayFast documentation before production. This deliberately does not mark
// payments as paid until those checks are implemented and tested.
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", {status:405});
  try {
    const raw = await req.text();
    const params = new URLSearchParams(raw);
    const reference = params.get("m_payment_id") || params.get("custom_str1");
    const status = params.get("payment_status");
    if (!reference || status !== "COMPLETE") return new Response("Ignored", {status:400});
    // Do not trust status alone. Verify signature, source IP, merchant ID, amount and reference.
    // This is intentionally fail-closed until the merchant-specific adapter is completed.
    console.error("PayFast ITN received but not processed: signature/source verification adapter is not configured", reference);
    return new Response("Verification adapter not configured", {status:501});
  } catch (e) {
    console.error(e);
    return new Response("Invalid notification", {status:400});
  }
});
