# SSLCommerz Next.js Example

This folder contains a minimal Next.js example that demonstrates:

- Initializing a payment session with `sslcommerz-lts` via a secure server-side API route
- Handling the `success_url` POST from SSLCommerz and validating `val_id` using the SDK
- A small frontend page that calls `/api/payment/initiate` and redirects the user to the GatewayPageURL

Setup
1. Copy `.env.local.example` to `.env.local` and set your credentials and `APP_URL`.

2. Install dependencies and run the dev server:

```bash
cd next-sslcommerz
npm install
npm run dev
```

3. Open `http://localhost:3000` to test.

Testing with Sandbox
- Use the sandbox credentials in your `.env.local` (do not commit this file).
- SSLCommerz provides dummy credentials for mobile banking flows (e.g. bKash): use the values they document during the Gateway test.
- If you need SSLCommerz to POST back to your local dev, expose your server with `ngrok` and set `APP_URL` to the `ngrok` URL.

Notes & Best Practices
- Never commit real Store ID / password to the repository. Keep them in `.env.local` on the server.
- Validate `val_id` server-side (we do that in `/api/payment/success`). Only mark an order paid after validation succeeds.
- Treat the example as a starting point — adapt order lookups, DB updates, and security checks for your production system.
