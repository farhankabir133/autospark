-- Phase 2: indexes + constraints for actually-queried columns
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles (is_available);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles (brand_name);
CREATE INDEX IF NOT EXISTS idx_products_category_avail ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials (is_approved);
CREATE INDEX IF NOT EXISTS idx_appt_date ON service_appointments (preferred_date);
CREATE INDEX IF NOT EXISTS idx_appt_status ON service_appointments (status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);

DO $$ BEGIN ALTER TABLE products ADD CONSTRAINT products_stock_nonneg CHECK (stock_quantity >= 0); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE orders ADD CONSTRAINT orders_status_allowed CHECK (status IN ('pending','paid','failed','cancelled','refunded')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
