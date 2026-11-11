import { corsHeaders, json, required } from "../_shared/http.ts";
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
  if(req.method!=="POST")return json({error:"POST required"},405);
  try{
    const b=await req.json();
    if(!b.name||!b.email||!b.subject||!b.message||String(b.message).length>5000)return json({error:"Please complete the required fields"},400);
    const api=required("RESEND_API_KEY"), from=required("MAIL_FROM");
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${api}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:["thevirtualgarage20@gmail.com"],reply_to:b.email,subject:`Website enquiry: ${String(b.subject).slice(0,120)}`,text:`Name: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone||"Not supplied"}\n\n${b.message}`})});
    if(!response.ok){console.error(await response.text());return json({error:"Email delivery failed"},502)}
    return json({sent:true});
  }catch(e){console.error(e);return json({error:"Could not send enquiry"},500)}
});
