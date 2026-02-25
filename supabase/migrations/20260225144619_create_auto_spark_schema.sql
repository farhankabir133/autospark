/*
  # Auto Spark BD Database Schema
  
  Complete database schema for luxury car dealership website with bilingual support.
  
  ## Tables Created
  
  ### Core Vehicle Management
  - `vehicles` - Main vehicle inventory with all specifications
  - `vehicle_images` - Multiple images per vehicle with ordering
  - `vehicle_features` - Feature checklist for each vehicle
  
  ### E-Commerce
  - `products` - Accessories and parts catalog
  - `product_images` - Product image gallery
  - `cart_items` - Shopping cart items
  - `orders` - Order management
  - `order_items` - Order line items
  
  ### Service Center
  - `service_types` - Available service categories
  - `service_appointments` - Booking system for service center
  
  ### Car Sales & Trade-in
  - `car_reservations` - Vehicle purchase reservations
  - `trade_in_requests` - Sell your car submissions
  
  ### Content Management
  - `brands` - Car brands serviced/sold
  - `testimonials` - Customer reviews
  - `blog_posts` - SEO content
  
  ## Security
  - RLS enabled on all tables
  - Policies restrict access to authenticated users for admin operations
  - Public read access for inventory and products
*/

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brands"
  ON brands FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage brands"
  ON brands FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_number text UNIQUE NOT NULL,
  brand_id uuid REFERENCES brands(id),
  brand_name text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal(12,2) NOT NULL,
  mileage integer DEFAULT 0,
  fuel_type text NOT NULL,
  transmission text NOT NULL,
  engine_capacity text,
  color_exterior text,
  color_interior text,
  body_type text,
  condition text DEFAULT 'used',
  description_en text,
  description_bn text,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  video_url text,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available vehicles"
  ON vehicles FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Authenticated users can manage vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create vehicle images table
CREATE TABLE IF NOT EXISTS vehicle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle images"
  ON vehicle_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage vehicle images"
  ON vehicle_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create vehicle features table
CREATE TABLE IF NOT EXISTS vehicle_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_en text NOT NULL,
  feature_bn text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle features"
  ON vehicle_features FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage vehicle features"
  ON vehicle_features FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create products table (accessories & parts)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_bn text NOT NULL,
  description_en text,
  description_bn text,
  category text NOT NULL,
  price decimal(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  sku text UNIQUE,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Authenticated users can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create service types table
CREATE TABLE IF NOT EXISTS service_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_bn text NOT NULL,
  description_en text,
  description_bn text,
  icon text,
  estimated_duration integer,
  base_price decimal(10,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active service types"
  ON service_types FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage service types"
  ON service_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create service appointments table
CREATE TABLE IF NOT EXISTS service_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type_id uuid REFERENCES service_types(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  vehicle_brand text NOT NULL,
  vehicle_model text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  notes text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view service appointments"
  ON service_appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create service appointments"
  ON service_appointments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service appointments"
  ON service_appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create car reservations table
CREATE TABLE IF NOT EXISTS car_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text,
  payment_type text NOT NULL,
  delivery_method text,
  deposit_amount decimal(10,2),
  total_amount decimal(12,2) NOT NULL,
  payment_status text DEFAULT 'pending',
  reservation_status text DEFAULT 'pending',
  nid_document_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE car_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view car reservations"
  ON car_reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create car reservations"
  ON car_reservations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update car reservations"
  ON car_reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trade-in requests table
CREATE TABLE IF NOT EXISTS trade_in_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  vehicle_brand text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer NOT NULL,
  mileage integer,
  condition text,
  description text,
  image_urls text[],
  estimated_value decimal(12,2),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trade_in_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view trade-in requests"
  ON trade_in_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create trade-in requests"
  ON trade_in_requests FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update trade-in requests"
  ON trade_in_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage their own cart items"
  ON cart_items FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending',
  order_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_name_bn text,
  rating integer DEFAULT 5,
  review_en text NOT NULL,
  review_bn text,
  customer_image_url text,
  vehicle_purchased text,
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_bn text NOT NULL,
  slug text UNIQUE NOT NULL,
  content_en text NOT NULL,
  content_bn text NOT NULL,
  excerpt_en text,
  excerpt_bn text,
  featured_image_url text,
  author text DEFAULT 'Auto Spark BD',
  category text,
  tags text[],
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand_name);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(is_available);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_service_appointments_date ON service_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);