# Deployment Guide — Vercel + GitHub Actions

This project deploys to **Vercel** automatically from GitHub:

| Trigger | Result |
|---|---|
| Push to `main` / the default branch | **Production** deploy (`--prod`) |
| Pull request | **Preview** deploy |

The workflow lives at `.github/workflows/deploy.yml`.

---

## 1. One-time setup

### A. Connect the repo to Vercel

1. Go to https://vercel.com/new and **Import Git Repository** (pick `AutoSpark-BD`).
2. Framework preset: **Vite**
3. Build command: `npm run build` (already set in `vercel.json`)
4. Output directory: `dist`
5. Install command: `npm install` (the `postinstall` script patches `@types/three`)
6. **Do not add a Vercel git integration** if you want the GitHub Action to own deployments —
   otherwise both will deploy. Either way is safe, the Action is authoritative.

### B. Find your IDs

```bash
npx vercel login
npx vercel link     # creates .vercel/ with project + org ids
cat .vercel/project.json
```

### C. Add repository secrets

GitHub → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `~/.vercel/...` or `cat .vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `cat .vercel/project.json` → `projectId` |

### D. Add environment variables in Vercel

Vercel project → **Settings → Environment Variables** (set for Production, Preview and Development):

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | **Yes** | Powers the SparkAI assistant (`/api/sparkai/chat`) |
| `GROQ_MODEL` | No (defaults to `openai/gpt-oss-20b`) | Groq model id |
| `SSLCOMMERZ_STORE_ID` | Yes (payments) | SSLCommerz store |
| `SSLCOMMERZ_STORE_PASSWORD` | Yes (payments) | SSLCommerz password |
| `SSLCZ_IS_LIVE` | No (default `true`) | `false` = sandbox mode |
| `SITE_URL` | No (default `https://autosparkbd.com`) | Payment callback base URL |
| `SUPABASE_URL` | Yes (orders/leads) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (orders/leads) | Server-side key — **never expose to the client** |
| `VITE_SUPABASE_URL` | Yes | Public Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `VITE_APPWRITE_*` | If used | Appwrite payment backend |

> **Never prefix server secrets with `VITE_`** — that inlines them into the browser bundle.

### E. Apply the database migration

```bash
supabase db push
```

or run `supabase/migrations/20261015000000_orders_and_leads.sql` in the Supabase SQL editor.
This creates the `orders` and `leads` tables used by `/api/payment/*` and `/api/lead/submit`.

---

## 2. Verify the deployment

```bash
# AI assistant (should return a real Groq response)
curl -X POST https://autosparkbd.com/api/sparkai/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"I need a family car around 20 lakh"}]}'

# Lead capture
curl -X POST https://autosparkbd.com/api/lead/submit \
  -H 'Content-Type: application/json' \
  -d '{"name":"John","whatsapp":"01712345678","interest":"Axio","budgetRange":"18-25 lakh","timeline":"Within 1 month","consent":true}'
```

If `/api/sparkai/chat` returns `{"error":"GROQ_API_KEY not configured on server."}` the
env var is missing for that environment.

---

## 3. Local development

```bash
npm install          # installs deps + patches @types/three
cp .env.example .env # then fill in GROQ_API_KEY etc.
npm run dev:full     # Vite :5173 + Express API server :8787
```

`server/dev-server.js` auto-loads `.env`, and `vite.config.ts` proxies `/api/*` to port 8787,
so `/api/sparkai/chat` works exactly as it does in production.

| Script | Purpose |
|---|---|
| `npm run dev` | Frontend only |
| `npm run dev:full` | Frontend + API server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (pre-existing warnings; non-blocking in CI) |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E |

---

## 4. API routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/sparkai/chat` | POST | Groq proxy for the AI assistant (key stays server-side) |
| `/api/lead/submit` | POST | Lead capture → `leads` table |
| `/api/payment/init` | POST | Start SSLCommerz payment, records a `pending` order |
| `/api/payment/success` | GET, POST | Validated success callback → marks order `paid` |
| `/api/payment/fail` | GET, POST | Marks order `failed` |
| `/api/payment/cancel` | GET, POST | Marks order `cancelled` |
| `/api/payment/ipn` | POST | Server-to-server IPN with server-side amount + status verification |

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build fails with `Module '"three"' has no exported member` | `@types/three` ships a broken `exports` map | Run `node scripts/fix-three-types.cjs` (runs automatically on `npm install`) |
| `Failed to resolve entry for package "framer-motion"` | Incomplete `node_modules` | Delete `node_modules` + `package-lock.json`, then `npm install` |
| AI falls back to demo answers | `GROQ_API_KEY` missing, or the request failed | Check Vercel env vars and the function logs |
| Payments rejected in dev | Missing `SSLCOMMERZ_*` | Set them in `.env` and set `SSLCZ_IS_LIVE=false` for sandbox |
| 404 on deep links | SPA rewrite | Already configured in `vercel.json`; `dist/404.html` is generated at build |
