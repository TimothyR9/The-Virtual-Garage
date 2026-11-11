import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json, required } from "../_shared/http.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", {headers:corsHeaders});
  if (req.method !== "POST") return json({error:"POST required"},405);
  try {
    const b = await req.json();
    if (!b.customer?.firstName || !b.customer?.surname || !b.customer?.email || !b.customer?.phone ||
        !b.vehicle?.make || !b.vehicle?.model || !b.workDescription || !b.start || !b.end) return json({error:"Missing required fields"},400);
    const start = new Date(b.start), end = new Date(b.end);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start || start < new Date()) return json({error:"Invalid appointment time"},400);
    const db = createClient(required("SUPABASE_URL"),required("SUPABASE_SERVICE_ROLE_KEY"));
    const {data:c,error:ce}=await db.from("customers").insert({first_name:b.customer.firstName,surname:b.customer.surname,phone:b.customer.phone,email:b.customer.email}).select("id").single();
    if(ce) throw ce;
    const reference=`TVG-BKG-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    const {data:id,error}=await db.rpc("reserve_booking_slot",{p_reference:reference,p_customer_id:c.id,p_vehicle_make:b.vehicle.make,p_vehicle_model:b.vehicle.model,p_vehicle_year:b.vehicle.year||null,p_registration:b.vehicle.registration||null,p_work_description:b.workDescription,p_start:start.toISOString(),p_end:end.toISOString()});
    if(error) return json({error:error.message.includes("no longer available")?"That slot is no longer available. Please choose another.":"Could not reserve this slot."},409);
    return json({bookingId:id,reference,depositCents:500000,holdMinutes:15},201);
  }catch(e){console.error(e);return json({error:"Could not create booking hold"},500)}
});
