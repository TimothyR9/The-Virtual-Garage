# The Virtual Garage website

A responsive GitHub Pages-compatible frontend and Supabase backend starter for The Virtual Garage.

## Important status

This project includes a complete responsive public-facing site structure, starter product configurator, cart/quote-request flow, booking-request UI, contact information, gallery placeholders, and backend implementation scaffolding.

**It is not safe to accept real payments or confirmed appointments until the Supabase project, database migrations, Edge Functions, PayFast merchant credentials, Resend email credentials, and administrator permissions are configured and tested.** The current product entries are examples only and have no prices. The booking form clearly identifies requests as unconfirmed until the backend is deployed.

The supplied Facebook screenshots are reference material only; they are not automatically treated as individual project photographs. Add approved original images to `assets/images/gallery/`.

## Frontend

The frontend is plain HTML, CSS and JavaScript. It can be hosted on GitHub Pages.

1. Create a GitHub repository.
2. Upload the contents of this folder (not the parent folder).
3. In `assets/js/config.js`, set the Supabase project URL, anon key and functions URL.
4. In `index.html`, set `window.TVG_BASE_PATH` if using a project repository path (for example `/the-virtual-garage`). The current simple hash routes do not require server rewrites.
5. Enable GitHub Pages from the `main` branch and root folder.

The site uses hash routes (`#/products`, `#/bookings`, etc.) to avoid GitHub Pages deep-link 404 errors.

## Backend setup

See `supabase/README.md` and `supabase/schema.sql`.

Install the Supabase CLI, log in, link your project, apply the schema and deploy each Edge Function. Set server secrets using `supabase secrets set`; never commit real secrets.

Required backend secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYFAST_MERCHANT_ID`
- `PAYFAST_MERCHANT_KEY`
- `PAYFAST_PASSPHRASE`
- `PAYFAST_SANDBOX` (`true` while testing)
- `PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `MAIL_FROM` (a verified sender address)

The frontend anon key is public by design. The service-role key and payment/email secrets must remain server-side.

## Payments and bookings

PayFast integration is scaffolded in `supabase/functions/create-checkout` and `payfast-itn`. Confirm current PayFast requirements and test in sandbox before production. The server must verify ITN signatures and validate the payment against the stored order. Do not mark an order paid from a browser redirect.

The SQL schema contains a booking slot reservation RPC that uses a database transaction/unique constraint to reduce double-booking risk. A full production booking checkout should call this RPC, upload photos to a private storage bucket, create the booking payment, then confirm only after verified PayFast ITN. Slot hold expiry cleanup should be scheduled (Supabase Cron or another scheduler).

## Product catalogue

Starter vehicle models in `assets/js/config.js` are illustrative examples only. Replace them with confirmed compatible vehicle generations, actual images, actual model-specific blueprint diagrams, components, prices and available options before enabling checkout.

No product price or bank account details have been invented. Quote-only items cannot be paid for.

## Address verification

The source information contained both “06 Marais Street” and “4 Marais Street”. The site currently uses 4 Marais Street, based on the more complete address supplied, but verify this with the business before launch. The address is centralised in `assets/js/config.js`.

## Local preview

Open `index.html` in a browser for a basic frontend preview. Some browser security restrictions may affect external SDKs. For production testing, serve it using a local static server (for example `python -m http.server 8080`).

## Included files

- `index.html` – website shell
- `assets/css/styles.css` – responsive design
- `assets/js/config.js` – editable public business and integration configuration
- `assets/js/app.js` – public frontend routes and interactions
- `assets/images/tvg-logo.png` – cropped supplied logo
- `supabase/schema.sql` – database schema, policies and booking RPC
- `supabase/functions/` – serverless function scaffolding
- `supabase/README.md` – deployment and secrets guide

