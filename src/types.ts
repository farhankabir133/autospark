export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  stock_number: string;
  brand_name: string;
  model: string;
  year: number;
  package?: string;
  condition_grade?: number;
  availability_status?: string;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  engine_capacity: string;
  color_exterior: string;
  color_interior: string;
  body_type: string;
  condition: string;
  description_en: string;
  description_bn: string;
  is_available: boolean;
  is_featured: boolean;
  video_url: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  images: VehicleImage[];
}
