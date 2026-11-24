# WorldBridgeXpress — Logistics & Freight

A React rebuild of the WorldBridgeXpress website, with a live shipment-tracking map,
an admin dashboard and printable invoices. Supabase provides the database and
authentication. Configure the project URL and publishable key in the local
`.env.local` file and in the deployment environment.

| URL | What |
|---|---|
| `/` | The website (same design, images and animations as the original) |
| `/track` | Tracking page — search a tracking number, live map, status and history |
| `/track?code=TJ-240001` | Tracking page for one shipment (invoice QR codes link here; old `/?track=` links redirect) |
| `/admin` | Admin dashboard (Supabase Auth login) |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5180  and  http://localhost:5180/admin
npm run build      # production build in dist/
npm run preview
```

The local Supabase settings are in the ignored `.env.local` file. For a new
checkout, copy `.env.example` to `.env.local` and fill in the project URL and
publishable key. Apply the SQL migrations in `supabase/migrations/` to the
project before using tracking or admin data.

## Deploy on Vercel

Import this repository in Vercel and deploy — `vercel.json` already sets the
framework (Vite), the build command, the `dist` output and the `/admin`
rewrites. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the
deployment environment and apply the SQL migrations in `supabase/migrations/`.

After the first deploy, restrict your Google Maps key (Google Cloud → APIs &
Services → Credentials) to your Vercel domain and `localhost`.

## Admin dashboard

- **Overview** — totals, shipments by status, latest shipments and quote requests.
- **Shipments** — create, edit, delete; post tracking updates; live map of the
  package; billing lines; one-click invoice.
- **Invoice** — A4, print or save as PDF, with a QR code that opens the
  shipment's live tracking.
- **Quote requests** — from the website's quote form; mark contacted/closed or
  turn one into a shipment.
- **Subscribers** — footer newsletter sign-ups, CSV export.
- **Settings** — change password, Google Maps API key, company and invoice
  details, administrators.

Adding another admin: create the user in Supabase (Authentication → Users →
Add user, tick *Auto confirm*), then grant access in **Settings →
Administrators** with the same email.

## How the moving package works

Each shipment stores a *checkpoint*: `progress_km` covered as of `progress_at`,
plus an average `speed_kmh` (defaults: road 60, rail 80, sea 30, air 750 km/h).

```
distance covered = progress_km + (status is In Transit / Out for Delivery
                                  ? speed_kmh × hours since progress_at : 0)
```

- The map recomputes this every second, so the package moves in real time at a
  real-world speed along the actual road route (truck/train) or the
  great-circle line (sea/air).
- Whenever the status or speed changes, a database trigger
  (`shipments_before_write`) freezes the distance covered into a new
  checkpoint. So **On Hold keeps the package exactly where it was**, and going
  back to In Transit continues from that point — nothing jumps.
- A departure date/time in the future keeps the package at the origin until then.
- Delivered puts it at the destination.

## Database

`supabase/migrations/` holds the full schema. Every table has row-level
security: only users listed in `public.admins` can read or change data. The
public website reaches the database only through four functions:

| Function | Purpose |
|---|---|
| `track_shipment(code)` | Tracking data (no names, phones or emails) |
| `get_public_settings()` | Map key + public contact details |
| `submit_quote(json)` | Quote form |
| `subscribe(email)` | Newsletter form |

## Responsive layout and theme start-up

- **Theme scripts start in the original order.** `src/useLegacyScripts.js`
  holds jQuery's ready event until all 69 theme scripts have loaded, so
  Elementor initialises every widget (the Industries carousel, counters,
  accordions, scroll reveals) exactly as on the original page.
- **Elementor's lazy-loaded bundles** (`public/wp-content/plugins/elementor/assets/js/*.bundle.min.js`)
  were missing from the export; they come from the official Elementor 4.2.3
  release on WordPress.org.
- **`src/responsive.css`** (hand-written, loaded after the theme) prevents any
  sideways scrolling, keeps media inside its column, shows the Delivery
  Flexibility card text on touch screens (the photo becomes a banner instead of
  sliding away on hover), and makes the floating Track & Help button a compact
  badge on phones.
- The Industries carousel slides on its own (pauses on hover); this is applied
  by `tools/convert.mjs` so it survives regeneration.

Checked at 360, 390, 768, 820, 1024, 1440, 1680 and 1920 px wide: no
horizontal overflow and no clipped text.

## Project layout

```
index.html / admin.html      the two entry points (website, dashboard)
public/                      the theme's CSS, JS, fonts and images, unchanged
src/components/              website: header, footer, 19 home-page sections,
                             SiteForms (form wiring), TrackingModal, ShipmentMap
src/lib/                     Supabase config, public API, Google Maps loader,
                             movement maths (tracking.js)
src/admin/                   dashboard: data layer, pages, invoice
supabase/migrations/         database schema, security rules and functions
tools/convert.mjs            regenerates the website components from the
                             original static export (needs ../demo6.* locally)
tools/verify.mjs             checks the rendered site still matches the original
```
