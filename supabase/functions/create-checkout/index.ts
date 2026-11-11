import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json, required } from "../_shared/http.ts";

// Creates a PayFast payment using a server-computed total. Never accept a browser-supplied amount.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  try {
    const body = await req.json();
    const supabase = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"));
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length || items.length > 40) return json({ error: "Invalid cart" }, 400);
    if (!body.customer || !body.customer.firstName || !body.customer.surname || !body.customer.email || !body.customer.phone) return json({ error: "Customer details are required" }, 400);

    const ids = [...new Set(items.map((x: any) => x.productId).filter(Boolean))];
    if (ids.length !== items.length) return json({ error: "Every cart line must map to a catalogue product. Quote-only items cannot be paid online." }, 400);
    const { data: products, error: pErr } = await supabase.from("products").select("id,price_cents,active,vehicle_id,name,vehicles(make,model)").in("id", ids);
    if (pErr || !products || products.length !== ids.length) return json({ error: "Catalogue lookup failed" }, 400);
    let total = 0;
    const lines = [];
    for (const item of items) {
      const p = products.find((x: any) => x.id === item.productId);
      const qty = Number(item.quantity);
      if (!p || !p.active || !Number.isInteger(qty) || qty < 1 || qty > 50 || !Number.isInteger(p.price_cents) || p.price_cents <= 0) return json({ error: "Invalid product or quantity" }, 400);
      total += p.price_cents * qty;
      lines.push({ product_id:p.id, vehicle_label:`${p.vehicles?.make ?? ""} ${p.vehicles?.model ?? ""}`.trim(), component_name:p.name, quantity:qty, colour:String(item.colour ?? ""), material:String(item.material ?? ""), unit_price_cents:p.price_cents });
    }
    if (total <= 0) return json({ error: "Invalid total" }, 400);
    const { data: customer, error: cErr } = await supabase.from("customers").insert({
      first_name:body.customer.firstName, surname:body.customer.surname, phone:body.customer.phone, email:body.customer.email,
      country:body.customer.country, province:body.customer.province, city:body.customer.city, address:body.customer.address, postal_code:body.customer.postalCode
    }).select("id").single();
    if (cErr) throw cErr;
    const reference = `TVG-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
    const { data: order, error: oErr } = await supabase.from("orders").insert({reference,customer_id:customer.id,subtotal_cents:total,shipping_notice_acknowledged_at:body.acknowledged ? new Date().toISOString() : null}).select("id").single();
    if (oErr) throw oErr;
    const { error: iErr } = await supabase.from("order_items").insert(lines.map(x=>({...x,order_id:order.id})));
    if (iErr) throw iErr;

    // PayFast signature/form details must be checked against the latest PayFast integration guide.
    // This endpoint returns the order reference and amount. A production adapter should generate
    // the signed PayFast form server-side and return its hosted checkout URL.
    return json({ reference, amountCents: total, orderId: order.id, message: "Order created. Configure the PayFast adapter and credentials before enabling live checkout." }, 202);
  } catch (e) { console.error(e); return json({ error: "Could not create checkout" }, 500); }
});
