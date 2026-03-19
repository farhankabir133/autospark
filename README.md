# Auto Spark BD - Premium Car Dealership Website

A production-ready, bilingual (English + Bengali) luxury car dealership website built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Core Functionality
- **Bilingual Support**: Seamless language switching between English and Bengali
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance Optimized**: Fast loading with lazy loading, code splitting, and optimized images

### Pages & Features

# Auto Spark BD — Premium Car Dealership Website

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-1.0-teal?logo=supabase)

[Live site](https://autosparkbd.com/) • [Portfolio — Farhan Kabir](https://farhankabir.me/)

---

## Executive Summary

Auto Spark BD modernizes luxury car retail across North Bengal by providing a fast, bilingual online showroom that replicates the in-person premium purchase experience. The platform consolidates inventory, sales leads, and after-sales service into a single, scalable web application so dealers can convert visitors into customers faster and operate more efficiently across distributed locations.

This technical solution addresses market fragmentation and language friction with built-in bilingual support (English/Bengali), real-time lead generation via Supabase, and an integrated service booking engine. The result: measurable improvement in lead capture, faster time-to-contact, and a streamlined service workflow for both sales and operations teams.

---

## Quick Links

- Live: https://autosparkbd.com/
- Portfolio: https://farhankabir.me/
- Repo: https://github.com/farhankabir133/autospark

---

## Technical Deep Dive

### Why Supabase & Row Level Security (RLS)

- Supabase was chosen for its PostgreSQL foundation, realtime subscriptions, and first-class developer ergonomics. RLS policies are applied to enforce fine-grained access control directly at the database layer. This prevents accidental data leaks and simplifies backend logic: policies restrict row visibility by user role (public, authenticated, admin) and by resource ownership (e.g., a user may only see their service appointments).

- Benefits:
  - Centralized security: move authorization rules to the DB and reduce duplication in application code.
  - Realtime updates: lead notifications and appointment changes are emitted via realtime channels.
  - Simplified operational model: use Supabase Auth + RLS for most API protection needs without a custom server.

### Bilingual Architecture

- Language state is managed via a React Context (`contexts/LanguageContext.tsx`). The context exposes a compact API: current language, setter, and translation helper. All text nodes use this context to render EN/BN copies.

- For Bengali performance we use selective font subsetting: only the Bengali glyph subset is loaded when the user chooses Bengali, reducing payload and improving First Contentful Paint (FCP). Fonts are loaded with `font-display: swap` and conditionally imported via dynamic imports to avoid blocking the initial render.

### Performance & Lighthouse

- Key optimizations applied:
  - Image lazy-loading and responsive `srcset`/`sizes` usage for all car and product images.
  - Code-splitting via dynamic `import()` for large routes (Inventory, Vehicle Details) and non-critical components (3D viewers, maps).
  - CSS purging and Tailwind JIT for compact runtime CSS.
  - Critical CSS inlined for hero and above-the-fold sections.
  - Asset caching headers (set at deployment) and compressed bundles.

- Target Lighthouse scores: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90 (desktop baseline). Actual scores vary by page; Inventory and Vehicle Details are prioritized for high performance.

---

## Feature Breakdown

| Area | Key Capabilities |
|---|---|
| Inventory Engine | Dynamic filtering, sort, server-side pagination, inventory sync with Supabase, high-res galleries, price formatting (BDT) |
| Vehicle Details | Image gallery, EMI calculator, WhatsApp & direct call links, reserve flow, related vehicles, multilingual content |
| Service Booking | Multi-step booking wizard, calendar availability, SMS/WhatsApp notifications, admin schedule management |
| E‑commerce | Accessories catalog, cart, stock checks, order flow, payment hooks (placeholder for gateway integrations) |
| Lead Gen & CRM | Realtime lead capture, contact routing, admin dashboard hooks, reservation tracking |

### Notable UX features

- Flip-to-reveal carousel cards on landing page
- Smooth, continuous auto-scroll carousel with pointer drag support
- Persisted dark-mode by domain (custom domain defaults to dark)

---

## Developer Experience (DX)

Everything in this repo is designed to be easy to run locally and to extend.

### Prerequisites

- Node.js 18+ and npm (or pnpm)
- Supabase account and project
- (Optional) supabase CLI for local DB and migrations

### Environment Variables

Create a `.env` (or use a `.env.local`) with these keys:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE=your_service_role_key   # for migrations and server tasks only
VITE_MAPS_API_KEY=your_maps_api_key                # optional (Google Maps)
```

### Local Development

```bash
git clone git@github.com:farhankabir133/autospark.git
cd autospark
npm install
npm run dev
```

### Database: schema & migrations

- Schema highlights (Postgres tables): `vehicles`, `vehicle_images`, `vehicle_features`, `service_types`, `service_appointments`, `car_reservations`, `products`, `orders`, `order_items`, `testimonials`, `users`.
- Migrations: use Supabase CLI or SQL migration files in `supabase/migrations/` (if present). Example commands:

```bash
# install supabase CLI and login
supabase login
supabase db remote set <your-db-connection>
supabase db push --schema public
```

### Seeds & Admin

- Example seed data is provided in `src/hooks/vehicleDataAll.ts` for development and testing. For production, run SQL seed scripts or import CSVs via the Supabase UI.

### Testing & Typecheck

```bash
npm run typecheck   # run TypeScript checks
npm run lint        # ESLint
npm test            # If tests are added
```

---

## Deployment

- The project builds to a static bundle via Vite (`npm run build`) and can be deployed to any static host (Netlify, Vercel, GitHub Pages) with Supabase providing the backend. Ensure environment variables are set in the deployment platform.

---

## Security Notes

- RLS policies should be audited before production. Keep the service role key (`VITE_SUPABASE_SERVICE_ROLE`) out of client-side code and CI logs.
- Rate-limit public endpoints and validate uploaded files (images) on the server-side or using Supabase Storage policies.

---

## Meet the Developer

**A. S. M. Farhan Kabir Redoy** — Lead Developer, Auto Spark

I am a Computer Science graduate from RUET and lead the engineering efforts at Auto Spark. My focus is building performant, user-centered web platforms that combine modern frontend engineering with pragmatic backend design and AI-enabled tooling.

- Portfolio: https://farhankabir.me/
- Medium: https://medium.com/@farhankabir
- Email: farhankabir133@gmail.com

---

If you'd like a tailored developer walkthrough or a live code review session, open an issue or contact me directly via the email above.

> This README is crafted to be both a technical reference and a portfolio showcase — feel free to suggest edits to tailor tone or detail level for prospective employers or clients.
