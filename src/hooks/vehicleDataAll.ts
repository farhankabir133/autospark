// Comprehensive vehicle data with all 14 vehicles
import type { Vehicle } from '../types';

export const ALL_VEHICLES: Vehicle[] = [
  // TOYOTA - Harrier Advance Premium
  {
    id: '7',
    stock_number: 'HARRIER-001',
    brand_name: 'Toyota',
    model: 'Harrier Advance Premium',
    year: 2024,
    price: 6900000, // Pre-Order Price
    mileage: 0,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    engine_capacity: '2.5L Hybrid',
    color_exterior: 'Pearl White',
    color_interior: 'Black Leather',
    body_type: 'Premium SUV',
    condition: 'New',
    description_en: 'Luxury premium SUV with advanced hybrid technology and premium interior',
    description_bn: 'অত্যাধুনিক হাইব্রিড প্রযুক্তি এবং প্রিমিয়াম অভ্যন্তরীণ সজ্জা সহ বিলাসবহুল এসইউভি',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '7-1', vehicle_id: '7', image_url: '/cars/Toyota Harrier/222.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '7-2', vehicle_id: '7', image_url: '/cars/Toyota Harrier/223.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '7-3', vehicle_id: '7', image_url: '/cars/Toyota Harrier/224.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '7-4', vehicle_id: '7', image_url: '/cars/Toyota Harrier/225.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '7-5', vehicle_id: '7', image_url: '/cars/Toyota Harrier/226.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '7-6', vehicle_id: '7', image_url: '/cars/Toyota Harrier/227.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Corolla Cross Z
  {
    id: '8',
    stock_number: 'COROLLACROSS-002',
    brand_name: 'Toyota',
    model: 'Corolla Cross Z',
    year: 2024,
    price: 4350000, // Pre-Order Price
    mileage: 0,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.8L Hybrid',
    color_exterior: 'Steel Blue',
    color_interior: 'Gray Fabric',
    body_type: 'Compact Crossover',
    condition: 'New',
    description_en: 'Modern compact crossover with advanced hybrid engine and smart features',
    description_bn: 'অত্যাধুনিক হাইব্রিড ইঞ্জিন এবং স্মার্ট বৈশিষ্ট্য সহ আধুনিক কমপ্যাক্ট ক্রসওভার',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '8-1', vehicle_id: '8', image_url: '/cars/Toyota Corolla Cross/152.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '8-2', vehicle_id: '8', image_url: '/cars/Toyota Corolla Cross/153.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '8-3', vehicle_id: '8', image_url: '/cars/Toyota Corolla Cross/154.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '8-4', vehicle_id: '8', image_url: '/cars/Toyota Corolla Cross/155.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '8-5', vehicle_id: '8', image_url: '/cars/Toyota Corolla Cross/156.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '8-6', vehicle_id: '8', image_url: '/cars/Toyota Corolla Cross/157.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },
  // TOYOTA - Corolla Cross (Inventory Stock #: CCROSS-001)
  {
    id: 'inv-ccross-001',
    stock_number: 'CCROSS-001',
    brand_name: 'Toyota',
    model: 'Corolla Cross',
    year: 2023,
    price: 4350000, // Pre-Order Price
    mileage: 3000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.8L Hybrid',
    color_exterior: 'Steel Blue',
    color_interior: 'Gray Fabric',
    body_type: 'Compact Crossover',
    condition: 'New',
    description_en: 'Inventory unit. Modern compact crossover with advanced hybrid engine and smart features',
    description_bn: 'ইনভেন্টরি ইউনিট। অত্যাধুনিক হাইব্রিড ইঞ্জিন এবং স্মার্ট বৈশিষ্ট্য সহ আধুনিক কমপ্যাক্ট ক্রসওভার',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: 'inv-ccross-001-1', vehicle_id: 'inv-ccross-001', image_url: 'https://images.pexels.com/photos/36581771/pexels-photo-36581771.png', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Crown RS
  {
    id: '9',
    stock_number: 'CROWN-001',
    brand_name: 'Toyota',
    model: 'Crown RS',
    year: 2024,
    price: 7300000, // Pre-Order Price
    mileage: 0,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    engine_capacity: '2.5L Hybrid',
    color_exterior: 'Black Metallic',
    color_interior: 'Luxury Brown',
    body_type: 'Premium Sedan',
    condition: 'New',
    description_en: 'Premium executive sedan with state-of-the-art hybrid technology',
    description_bn: 'অত্যাধুনিক হাইব্রিড প্রযুক্তি সহ প্রিমিয়াম এক্সিকিউটিভ সেডান',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '9-1', vehicle_id: '9', image_url: '/cars/Toyota Crown/68.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '9-2', vehicle_id: '9', image_url: '/cars/Toyota Crown/69.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '9-3', vehicle_id: '9', image_url: '/cars/Toyota Crown/70.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '9-4', vehicle_id: '9', image_url: '/cars/Toyota Crown/71.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '9-5', vehicle_id: '9', image_url: '/cars/Toyota Crown/72.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '9-6', vehicle_id: '9', image_url: '/cars/Toyota Crown/73.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Premio F-EX
  {
    id: '10',
    stock_number: 'PREMIO-001',
    brand_name: 'Toyota',
    model: 'Premio F-EX',
    year: 2023,
    price: 4350000, // Pre-Order Price
    mileage: 2000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'Silver Pearl',
    color_interior: 'Gray Cloth',
    body_type: 'Sedan',
    condition: 'New',
    description_en: 'Fuel-efficient sedan with excellent hybrid performance',
    description_bn: 'চমৎকার হাইব্রিড পারফরম্যান্স সহ জ্বালানি-দক্ষ সেডান',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '10-1', vehicle_id: '10', image_url: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Noah Si WxB
  {
    id: '11',
    stock_number: 'NOAH-001',
    brand_name: 'Toyota',
    model: 'Noah Si WxB',
    year: 2023,
    price: 3050000, // Pre-Order Price
    mileage: 3000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'White Pearl',
    color_interior: 'Gray Fabric',
    body_type: 'MPV',
    condition: 'New',
    description_en: 'Spacious family MPV with practical hybrid technology',
    description_bn: 'ব্যবহারিক হাইব্রিড প্রযুক্তি সহ বিশাল পারিবারিক এমপিভি',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '11-1', vehicle_id: '11', image_url: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - C-HR G-LED
  {
    id: '12',
    stock_number: 'CHR-002',
    brand_name: 'Toyota',
    model: 'C-HR G-LED',
    year: 2023,
    price: 3050000, // Pre-Order Price
    mileage: 1000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.8L Hybrid',
    color_exterior: 'Red Metallic',
    color_interior: 'Black Fabric',
    body_type: 'Compact SUV',
    condition: 'New',
    description_en: 'Stylish compact SUV with LED headlights and advanced safety',
    description_bn: 'এলইডি হেডলাইট এবং উন্নত নিরাপত্তা সহ স্টাইলিশ কমপ্যাক্ট এসইউভি',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '12-1', vehicle_id: '12', image_url: 'https://images.pexels.com/photos/35515951/pexels-photo-35515951.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Yaris Cross Z
  {
    id: '13',
    stock_number: 'YARISCROSS-002',
    brand_name: 'Toyota',
    model: 'Yaris Cross Z',
    year: 2023,
    price: 3050000, // Pre-Order Price
    mileage: 2500,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'Pearl Blue',
    color_interior: 'Gray Fabric',
    body_type: 'Compact Crossover',
    condition: 'New',
    description_en: 'Compact crossover with impressive fuel efficiency and safety features',
    description_bn: 'চিত্তাকর্ষক জ্বালানি দক্ষতা এবং নিরাপত্তা বৈশিষ্ট্য সহ কমপ্যাক্ট ক্রসওভার',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '13-1', vehicle_id: '13', image_url: 'https://images.pexels.com/photos/35516543/pexels-photo-35516543.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Axio WxB
  {
    id: '14',
    stock_number: 'AXIO-001',
    brand_name: 'Toyota',
    model: 'Axio WxB',
    year: 2023,
    price: 2250000, // Pre-Order Price
    mileage: 1500,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.3L Hybrid',
    color_exterior: 'Silver',
    color_interior: 'Gray Cloth',
    body_type: 'Sedan',
    condition: 'New',
    description_en: 'Reliable compact sedan with excellent fuel economy',
    description_bn: 'চমৎকার জ্বালানি অর্থনীতি সহ নির্ভরযোগ্য কমপ্যাক্ট সেডান',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '14-1', vehicle_id: '14', image_url: '/cars/Toyota Axio/46.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '14-2', vehicle_id: '14', image_url: '/cars/Toyota Axio/47.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '14-3', vehicle_id: '14', image_url: '/cars/Toyota Axio/48.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '14-4', vehicle_id: '14', image_url: '/cars/Toyota Axio/49.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '14-5', vehicle_id: '14', image_url: '/cars/Toyota Axio/50.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '14-6', vehicle_id: '14', image_url: '/cars/Toyota Axio/51.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Prius S
  {
    id: '15',
    stock_number: 'PRIUS-001',
    brand_name: 'Toyota',
    model: 'Prius S',
    year: 2023,
    price: 2950000, // Pre-Order Price
    mileage: 2000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'Pearl White',
    color_interior: 'Gray Cloth',
    body_type: 'Sedan',
    condition: 'New',
    description_en: 'Iconic hybrid sedan with exceptional fuel efficiency',
    description_bn: 'ব্যতিক্রমী জ্বালানি দক্ষতা সহ আইকনিক হাইব্রিড সেডান',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '15-1', vehicle_id: '15', image_url: '/cars/Toyota Prius/141.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '15-2', vehicle_id: '15', image_url: '/cars/Toyota Prius/142.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '15-3', vehicle_id: '15', image_url: '/cars/Toyota Prius/143.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '15-4', vehicle_id: '15', image_url: '/cars/Toyota Prius/144.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '15-5', vehicle_id: '15', image_url: '/cars/Toyota Prius/145.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '15-6', vehicle_id: '15', image_url: '/cars/Toyota Prius/146.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Prado (Updated with new image)
  {
    id: '16',
    stock_number: 'PRADO-002',
    brand_name: 'Toyota',
    model: 'Prado',
    year: 2024,
    price: 13800000, // Pre-Order Price
    mileage: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '2.7L V6',
    color_exterior: 'Black Pearl',
    color_interior: 'Black Leather',
    body_type: 'Premium SUV',
    condition: 'New',
    description_en: 'Premium 7-seater SUV with legendary off-road capabilities',
    description_bn: 'কিংবদন্তি অফ-রোড ক্ষমতা সহ প্রিমিয়াম 7-সিটার এসইউভি',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '16-1', vehicle_id: '16', image_url: 'https://images.pexels.com/photos/35516384/pexels-photo-35516384.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // HONDA - Insight
  {
    id: '17',
    stock_number: 'INSIGHT-001',
    brand_name: 'Honda',
    model: 'Insight',
    year: 2023,
    price: 3450000, // Pre-Order Price
    mileage: 1000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'Crystal Gray',
    color_interior: 'Gray Fabric',
    body_type: 'Sedan',
    condition: 'New',
    description_en: 'Honda hybrid sedan with intelligent engine technology',
    description_bn: 'বুদ্ধিমান ইঞ্জিন প্রযুক্তি সহ হোন্ডা হাইব্রিড সেডান',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '17-1', vehicle_id: '17', image_url: 'https://images.pexels.com/photos/35515950/pexels-photo-35515950.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // TOYOTA - Lexus
  {
    id: '18',
    stock_number: 'LEXUS-001',
    brand_name: 'Toyota',
    model: 'Lexus',
    year: 2023,
    price: 4350000, // Pre-Order Price
    mileage: 3000,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    engine_capacity: '2.0L Hybrid',
    color_exterior: 'Pearl White',
    color_interior: 'Beige Leather',
    body_type: 'Luxury Sedan',
    condition: 'New',
    description_en: 'Premium Lexus hybrid sedan with luxury appointments',
    description_bn: 'বিলাসবহুল সজ্জা সহ প্রিমিয়াম লেক্সাস হাইব্রিড সেডান',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '18-1', vehicle_id: '18', image_url: 'https://images.pexels.com/photos/35516542/pexels-photo-35516542.png?auto=compress&cs=tinysrgb&w=600', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },


  // NISSAN - X-Trail
  {
    id: '20',
    stock_number: 'XTRAIL-001',
    brand_name: 'Nissan',
    model: 'X-Trail',
    year: 2023,
    price: 3550000,
    mileage: 1500,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '2.0L',
    color_exterior: 'Silver Pearl',
    color_interior: 'Gray Fabric',
    body_type: 'Compact SUV',
    condition: 'New',
    description_en: 'Nissan compact SUV with advanced safety and comfort features',
    description_bn: 'উন্নত নিরাপত্তা এবং আরাম বৈশিষ্ট্য সহ নিসান কমপ্যাক্ট এসইউভি',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
  { id: '20-1', vehicle_id: '20', image_url: 'https://images.pexels.com/photos/36581986/pexels-photo-36581986.png', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },

  // Original vehicles - keeping the existing ones
  {
    id: '1',
    stock_number: 'PRADO-001',
    brand_name: 'Toyota',
    model: 'Prado',
    year: 2023,
    price: 13800000,
    mileage: 15000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '2.7L V6',
    color_exterior: 'White',
    color_interior: 'Brown Leather',
    body_type: 'Premium SUV',
    condition: 'Used',
    description_en: 'Premium 7-seater SUV with advanced features',
    description_bn: 'উন্নত বৈশিষ্ট্য সহ প্রিমিয়াম 7-সিটার এসইউভি',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 145,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '1-1', vehicle_id: '1', image_url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '1-2', vehicle_id: '1', image_url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '1-3', vehicle_id: '1', image_url: 'https://images.pexels.com/photos/36318404/pexels-photo-36318404.png', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '1-4', vehicle_id: '1', image_url: 'https://images.pexels.com/photos/36318405/pexels-photo-36318405.png', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
    ]
  },
  {
    id: '2',
    stock_number: 'CIVIC-001',
    brand_name: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 3200000,
    mileage: 5000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '1.8L',
    color_exterior: 'Blue',
    color_interior: 'Black Fabric',
    body_type: 'Sedan',
    condition: 'New',
    description_en: 'Sporty sedan with modern technology',
    description_bn: 'আধুনিক প্রযুক্তি সহ স্পোর্টি সেডান',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '2-1', vehicle_id: '2', image_url: '/cars/Honda Civic/129.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '2-2', vehicle_id: '2', image_url: '/cars/Honda Civic/130.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '2-3', vehicle_id: '2', image_url: '/cars/Honda Civic/131.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '2-4', vehicle_id: '2', image_url: '/cars/Honda Civic/132.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '2-5', vehicle_id: '2', image_url: '/cars/Honda Civic/133.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '2-6', vehicle_id: '2', image_url: '/cars/Honda Civic/134.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },
  {
    id: '3',
    stock_number: 'CCROSS-001',
    brand_name: 'Toyota',
    model: 'Corolla Cross',
    year: 2023,
    price: 4350000, // Pre-Order Price
    mileage: 3000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.8L Hybrid',
    color_exterior: 'Silver',
    color_interior: 'Gray Fabric',
    body_type: 'Compact Crossover',
    condition: 'New',
    description_en: 'Eco-friendly compact crossover',
    description_bn: 'পরিবেশ বান্ধব কমপ্যাক্ট ক্রসওভার',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
  { id: '3-1', vehicle_id: '3', image_url: 'https://images.pexels.com/photos/36580897/pexels-photo-36580897.png', display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: '4',
    stock_number: 'CRV-001',
    brand_name: 'Honda',
    model: 'CR-V',
    year: 2023,
    price: 4200000,
    mileage: 8000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '1.5L Turbo',
    color_exterior: 'Black',
    color_interior: 'Black Leather',
    body_type: 'Compact SUV',
    condition: 'New',
    description_en: 'Reliable family SUV with spacious interior',
    description_bn: 'নির্ভরযোগ্য পারিবারিক এসইউভি বিস্তৃত অভ্যন্তরীণ সহ',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 203,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '4-1', vehicle_id: '4', image_url: '/cars/Honda C-RV/57.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '4-2', vehicle_id: '4', image_url: '/cars/Honda C-RV/58.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '4-3', vehicle_id: '4', image_url: '/cars/Honda C-RV/59.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '4-4', vehicle_id: '4', image_url: '/cars/Honda C-RV/60.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '4-5', vehicle_id: '4', image_url: '/cars/Honda C-RV/61.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '4-6', vehicle_id: '4', image_url: '/cars/Honda C-RV/62.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },
  {
    id: '5',
    stock_number: 'YARISCROSS-001',
    brand_name: 'Toyota',
    model: 'Yaris Cross',
    year: 2023,
    price: 3150000, // Pre-Order Price
    mileage: 4500,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'Pearl White',
    color_interior: 'Gray Fabric',
    body_type: 'Compact Crossover',
    condition: 'New',
    description_en: 'Compact crossover with excellent fuel efficiency',
    description_bn: 'চমৎকার জ্বালানি দক্ষতা সহ কম্পাক্ট ক্রসওভার',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '5-1', vehicle_id: '5', image_url: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '5-2', vehicle_id: '5', image_url: 'https://images.pexels.com/photos/36319316/pexels-photo-36319316.png', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '5-3', vehicle_id: '5', image_url: 'https://images.pexels.com/photos/36319315/pexels-photo-36319315.png', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '5-4', vehicle_id: '5', image_url: 'https://images.pexels.com/photos/36319314/pexels-photo-36319314.png', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
    ]
  },
  {
    id: '6',
    stock_number: 'CHR-001',
    brand_name: 'Toyota',
    model: 'C-HR',
    year: 2023,
    price: 3050000, // Pre-Order Price
    mileage: 6000,
    fuel_type: 'Hybrid',
    transmission: 'CVT',
    engine_capacity: '1.8L Hybrid',
    color_exterior: 'Dynamic Blue',
    color_interior: 'Black Fabric',
    body_type: 'Compact SUV',
    condition: 'New',
    description_en: 'Stylish compact SUV with advanced safety features',
    description_bn: 'উন্নত নিরাপত্তা বৈশিষ্ট্য সহ স্টাইলিশ কমপ্যাক্ট এসইউভি',
    is_available: true,
    is_featured: true,
    video_url: '',
    view_count: 167,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: '6-1', vehicle_id: '6', image_url: '/cars/Toyota C-HR/176.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: '6-2', vehicle_id: '6', image_url: '/cars/Toyota C-HR/177.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: '6-3', vehicle_id: '6', image_url: '/cars/Toyota C-HR/178.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: '6-4', vehicle_id: '6', image_url: '/cars/Toyota C-HR/179.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: '6-5', vehicle_id: '6', image_url: '/cars/Toyota C-HR/180.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: '6-6', vehicle_id: '6', image_url: '/cars/Toyota C-HR/181.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  }
  ,
  // Mazda - Axela (Price on request)
  {
    id: 'axela-001',
    stock_number: 'AXELA-001',
    brand_name: 'Mazda',
    model: 'Axela',
    year: 2020,
  price: 0,
    mileage: 45000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '2.0L',
    color_exterior: 'Silver',
    color_interior: 'Gray Fabric',
    body_type: 'Sedan',
    condition: 'Used',
    description_en: 'Mazda Axela in good condition',
    description_bn: 'ভাল অবস্থার মাজাদা অ্যাক্সেলা',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: 'axela-1', vehicle_id: 'axela-001', image_url: '/cars/Mazda Axela/209.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'axela-2', vehicle_id: 'axela-001', image_url: '/cars/Mazda Axela/210.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axela-3', vehicle_id: 'axela-001', image_url: '/cars/Mazda Axela/211.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axela-4', vehicle_id: 'axela-001', image_url: '/cars/Mazda Axela/212.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axela-5', vehicle_id: 'axela-001', image_url: '/cars/Mazda Axela/213.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axela-6', vehicle_id: 'axela-001', image_url: '/cars/Mazda Axela/214.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },
  // TOYOTA - Aqua (Price on request)
  {
    id: 'aqua-001',
    stock_number: 'AQUA-001',
    brand_name: 'Toyota',
    model: 'Aqua',
    year: 2019,
  price: 0,
    mileage: 38000,
    fuel_type: 'Hybrid',
    transmission: 'Automatic',
    engine_capacity: '1.5L Hybrid',
    color_exterior: 'White',
    color_interior: 'Gray Fabric',
    body_type: 'Hatchback',
    condition: 'Used',
    description_en: 'Toyota Aqua — economical city hybrid',
    description_bn: 'অর্থনৈতিক সিটি হাইব্রিড',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: 'aqua-1', vehicle_id: 'aqua-001', image_url: '/cars/Toyota Aqua/116.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'aqua-2', vehicle_id: 'aqua-001', image_url: '/cars/Toyota Aqua/117.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-3', vehicle_id: 'aqua-001', image_url: '/cars/Toyota Aqua/118.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-4', vehicle_id: 'aqua-001', image_url: '/cars/Toyota Aqua/119.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-5', vehicle_id: 'aqua-001', image_url: '/cars/Toyota Aqua/120.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-6', vehicle_id: 'aqua-001', image_url: '/cars/Toyota Aqua/121.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },
  // TOYOTA - Fielder (Price on request)
  {
    id: 'fielder-001',
    stock_number: 'FIELDER-001',
    brand_name: 'Toyota',
    model: 'Fielder',
    year: 2018,
  price: 0,
    mileage: 60000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    engine_capacity: '1.5L',
    color_exterior: 'Gray',
    color_interior: 'Black Fabric',
    body_type: 'Wagon',
    condition: 'Used',
    description_en: 'Toyota Fielder — reliable family wagon',
    description_bn: 'নির্ভরযোগ্য পারিবারিক ওয়াগন',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: 'fielder-1', vehicle_id: 'fielder-001', image_url: '/cars/Toyota Fielder/199.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'fielder-2', vehicle_id: 'fielder-001', image_url: '/cars/Toyota Fielder/200.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-3', vehicle_id: 'fielder-001', image_url: '/cars/Toyota Fielder/201.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-4', vehicle_id: 'fielder-001', image_url: '/cars/Toyota Fielder/202.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-5', vehicle_id: 'fielder-001', image_url: '/cars/Toyota Fielder/203.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-6', vehicle_id: 'fielder-001', image_url: '/cars/Toyota Fielder/204.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  },
  // TOYOTA - Voxy
  {
    id: 'voxy-001',
    stock_number: 'VOXY-001',
    brand_name: 'Toyota',
    model: 'Voxy',
    year: 2022,
    price: 4400000,
    mileage: 12000,
    fuel_type: 'Petrol',
    transmission: 'CVT',
    engine_capacity: '2.0L',
    color_exterior: 'Black',
    color_interior: 'Gray Fabric',
    body_type: 'MPV',
    condition: 'Used',
    description_en: 'Spacious MPV perfect for family travel',
    description_bn: 'পরিবার ভ্রমণের জন্য উপযুক্ত প্রশস্ত এমপিভি',
    is_available: true,
    is_featured: false,
    video_url: '',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      { id: 'voxy-1', vehicle_id: 'voxy-001', image_url: '/cars/Toyota Voxy/235.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'voxy-2', vehicle_id: 'voxy-001', image_url: '/cars/Toyota Voxy/236.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'voxy-3', vehicle_id: 'voxy-001', image_url: '/cars/Toyota Voxy/237.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'voxy-4', vehicle_id: 'voxy-001', image_url: '/cars/Toyota Voxy/238.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'voxy-5', vehicle_id: 'voxy-001', image_url: '/cars/Toyota Voxy/239.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'voxy-6', vehicle_id: 'voxy-001', image_url: '/cars/Toyota Voxy/240.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ]
  }
];
