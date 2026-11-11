/*
 * Public configuration only. Never put private API keys or payment secrets here.
 * Update SUPABASE_URL and SUPABASE_ANON_KEY after creating your Supabase project.
 */
window.TVG_CONFIG = {
  business: {
    name: "The Virtual Garage",
    phone: "074 064 8577",
    phoneInternational: "+27 74 064 8577",
    secondaryPhone: "065 159 2779",
    email: "thevirtualgarage20@gmail.com",
    address: "4 Marais Street, Goodwood, Cape Town, Western Cape, South Africa, 7460",
    tradingHours: "Monday – Friday, 08:00 – 16:00",
    facebook: "https://www.facebook.com/ThevirtualgarageWC/"
  },
  currency: "ZAR",
  bookingDepositCents: 500000,
  supabase: {
    url: "https://YOUR-PROJECT.supabase.co",
    anonKey: "YOUR_SUPABASE_ANON_KEY"
  },
  // Example: "https://YOUR-PROJECT.supabase.co/functions/v1"
  functionsUrl: "https://YOUR-PROJECT.supabase.co/functions/v1",
  // Gallery images can be added to assets/images/gallery and listed here.
  gallery: [],
  // Used only when the backend is not configured. Demo items are visibly marked.
  demoVehicles: [
    { id:"ford-cortina", make:"Ford", model:"Cortina", years:"Classic models", image:"", parts:["Front seats","Rear seats","Front door cards","Rear door cards","Headliner","Carpets","Dashboard cover","Boot lining"] },
    { id:"ford-xr6", make:"Ford", model:"XR6", years:"Selected generations", image:"", parts:["Front seats","Rear seats","Door cards","Headliner","Carpets","Gear boot","Centre console"] },
    { id:"vw-golf", make:"Volkswagen", model:"Golf", years:"Selected generations", image:"", parts:["Front seats","Rear seats","Door cards","Headliner","Carpets","Gear boot"] },
    { id:"bmw-3-series", make:"BMW", model:"3 Series", years:"Selected generations", image:"", parts:["Front seats","Rear seats","Door cards","Headliner","Carpets","Dashboard cover"] }
  ]
};
