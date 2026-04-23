export interface Vehicle {
  id: string;
  stock_number: string;
  brand_id?: string;
  brand_name: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  engine_capacity?: string;
  color_exterior?: string;
  color_interior?: string;
  body_type?: string;
  condition: string;
  description_en?: string;
  description_bn?: string;
  is_available: boolean;
  is_featured: boolean;
  video_url?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  images?: VehicleImage[];
  features?: VehicleFeature[];
  package?: string;
  condition_grade?: number;
  availability_status?: string;
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface VehicleFeature {
  id: string;
  vehicle_id: string;
  feature_en: string;
  feature_bn: string;
  created_at: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  description_bn?: string;
  category: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ServiceType {
  id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  description_bn?: string;
  icon?: string;
  estimated_duration?: number;
  base_price?: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceAppointment {
  id: string;
  service_type_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_brand: string;
  vehicle_model: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CarReservation {
  id: string;
  vehicle_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  payment_type: string;
  delivery_method?: string;
  deposit_amount?: number;
  total_amount: number;
  payment_status: string;
  reservation_status: string;
  nid_document_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TradeInRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  mileage?: number;
  condition?: string;
  description?: string;
  image_urls?: string[];
  estimated_value?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_name_bn?: string;
  rating: number;
  review_en: string;
  review_bn?: string;
  customer_image_url?: string;
  vehicle_purchased?: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title_en: string;
  title_bn: string;
  slug: string;
  content_en: string;
  content_bn: string;
  excerpt_en?: string;
  excerpt_bn?: string;
  featured_image_url?: string;
  author: string;
  category?: string;
  tags?: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  subtotal: number;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at: string;
}

export type Language = 'en' | 'bn';
