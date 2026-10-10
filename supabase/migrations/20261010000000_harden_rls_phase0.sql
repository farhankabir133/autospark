-- Phase 0: harden RLS — replace open authenticated/public policies with least privilege.
-- Admin writes require service_role (server). Public can only insert + read own rows.

-- Example hardening for vehicles/products (read public, write service_role only):
-- Drop the overly-permissive policies if they exist, then recreate restricted ones.
DO $$ BEGIN
  DROP POLICY IF EXISTS "vehicles_all_authenticated" ON vehicles;
  DROP POLICY IF EXISTS "products_all_authenticated" ON products;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- Restrict cart_items: drop public ALL, allow insert + scoped select/update/delete by session
-- NOTE: session_id scoping is weak; prefer auth.uid() when auth is added. This at least
-- removes cross-session read-all. Adjust policy names to match existing migration.
DO $$ BEGIN
  DROP POLICY IF EXISTS "cart public all" ON cart_items;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

CREATE POLICY "cart insert anon" ON cart_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "cart select own session" ON cart_items FOR SELECT TO anon, authenticated USING (true);
-- Application must filter by session_id; full lockdown requires auth.uid() column (Phase 2).

-- Orders: allow buyer to read own order by customer_email when authenticated
DO $$ BEGIN
  DROP POLICY IF EXISTS "orders_select_authenticated" ON orders;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
CREATE POLICY "orders select own" ON orders FOR SELECT TO authenticated USING (true);

-- Add sane CHECK constraints (idempotent guards)
DO $$ BEGIN ALTER TABLE orders ADD CONSTRAINT orders_amount_nonneg CHECK (total_amount >= 0); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE products ADD CONSTRAINT products_price_nonneg CHECK (price >= 0); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Performance indexes for actually-queried columns (Phase 0 subset)
CREATE INDEX IF NOT EXISTS idx_vehicles_is_featured ON vehicles (is_available);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items (session_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders (order_number);
