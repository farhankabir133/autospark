// Comprehensive vehicle data with all 14 vehicles
import type { Vehicle } from '../types';

// Helper for modular vehicle creation
function parsePriceBDT(price: string | number): number {
  if (typeof price === 'number') return price;
  // e.g. '23.50 Lakh BDT', '1.50 Crore BDT'
  if (price.includes('Crore')) {
    return parseFloat(price) * 10000000;
  }
  if (price.includes('Lakh')) {
    return parseFloat(price) * 100000;
  }
  return parseFloat(price);
}

function createVehicle({
  id,
  stock_number,
  brand_name,
  model,
  year,
  packageName,
  condition_grade,
  availability_status,
  price,
  mileage = 0,
  fuel_type = 'Hybrid',
  transmission = 'Automatic',
  engine_capacity = '',
  color_exterior = 'Pearl White',
  color_interior = 'Black Leather',
  body_type = 'Sedan',
  condition = 'New',
  description_en = '',
  description_bn = '',
  is_available = true,
  is_featured = false,
  video_url = '',
  view_count = 0,
  images = []
}: any): Vehicle {
  return {
    id,
    stock_number,
    brand_name,
    model,
    year,
    package: packageName,
    condition_grade,
    availability_status,
    price: parsePriceBDT(price),
    mileage,
    fuel_type,
    transmission,
    engine_capacity,
    color_exterior,
    color_interior,
    body_type,
    condition,
    description_en,
    description_bn,
    is_available,
    is_featured,
    video_url,
    view_count,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images
  };
}

export const ALL_VEHICLES: Vehicle[] = [
  // TOYOTA - Axio EX
  createVehicle({
    id: 'axio-2021-ex',
    stock_number: 'AXIO-2021-EX',
    brand_name: 'Toyota',
    model: 'Axio',
    year: 2021,
    packageName: 'EX',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '23.50 Lakh BDT',
    body_type: 'Sedan',
    color_exterior: 'Silver',
  description_en: `The Toyota Axio EX (2021) is a refined and reliable sedan, perfect for urban commuters and families seeking comfort, efficiency, and style. Powered by Toyota's renowned hybrid technology, the Axio EX delivers impressive fuel economy without sacrificing performance. The spacious interior is designed for maximum comfort, featuring high-quality materials, advanced infotainment, and ample legroom for all passengers. Safety is a top priority, with advanced features such as ABS, airbags, and stability control. The sleek silver exterior, aerodynamic lines, and modern LED lighting give the Axio a sophisticated presence on the road. Whether navigating city streets or cruising on the highway, the Axio EX offers a smooth, quiet, and enjoyable driving experience. This model is an excellent choice for those who value reliability, low running costs, and Toyota's legendary durability.`,
    images: [
      { id: 'axio-2021-ex-1', vehicle_id: 'axio-2021-ex', image_url: '/cars/axio/axio01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'axio-2021-ex-2', vehicle_id: 'axio-2021-ex', image_url: '/cars/axio/axio02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axio-2021-ex-3', vehicle_id: 'axio-2021-ex', image_url: '/cars/axio/axio03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axio-2021-ex-4', vehicle_id: 'axio-2021-ex', image_url: '/cars/axio/axio04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'axio-2021-ex-5', vehicle_id: 'axio-2021-ex', image_url: '/cars/axio/axio05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Fielder FEX
  createVehicle({
    id: 'fielder-2021-fex',
    stock_number: 'FIELDER-2021-FEX',
    brand_name: 'Toyota',
    model: 'Fielder',
    year: 2021,
    packageName: 'FEX',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '23.50 Lakh BDT',
    body_type: 'Wagon',
  description_en: `The Toyota Fielder FEX (2021) is a versatile wagon that blends practicality with modern design. Renowned for its spacious cargo area and flexible seating, the Fielder is ideal for families, professionals, and adventure seekers alike. The hybrid powertrain ensures excellent fuel efficiency, making it a cost-effective choice for daily commutes and long journeys. Inside, you'll find a thoughtfully designed cabin with advanced safety features, intuitive controls, and comfortable seating for up to five passengers. The Fielder's robust build quality, smooth ride, and responsive handling make it a pleasure to drive in any environment. With its reputation for reliability and low maintenance costs, the Fielder FEX stands out as a smart investment for those who need space, comfort, and Toyota dependability.`,
    images: [
      { id: 'fielder-2021-fex-1', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-2', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-3', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-4', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-5', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-6', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/06.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-7', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/07.webp', display_order: 7, is_primary: false, created_at: new Date().toISOString() },
      { id: 'fielder-2021-fex-8', vehicle_id: 'fielder-2021-fex', image_url: '/cars/fielder/08.webp', display_order: 8, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Premio FEX
  createVehicle({
    id: 'premio-2021-fex',
    stock_number: 'PREMIO-2021-FEX',
    brand_name: 'Toyota',
    model: 'Premio',
    year: 2021,
    packageName: 'FEX',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '44.50 Lakh BDT',
    body_type: 'Sedan',
    color_exterior: 'Red Wine',
  description_en: `The Toyota Premio FEX (2021/2022) is the epitome of elegance and advanced engineering in the midsize sedan segment. Finished in a stunning Red Wine exterior, this Premio offers a harmonious blend of luxury, comfort, and cutting-edge hybrid technology. The spacious cabin is adorned with premium materials, ergonomic seating, and a host of modern amenities, ensuring every journey is a first-class experience. Under the hood, the hybrid system delivers both power and exceptional fuel economy, making it perfect for city driving and long-distance travel. Safety features include advanced driver assistance systems, multiple airbags, and reinforced body structure for peace of mind. The Premio's refined suspension and quiet cabin provide a serene ride, while the intuitive infotainment system keeps you connected on the go. Ideal for discerning drivers who demand style, performance, and reliability, the Premio FEX is a standout choice in its class.`,
    images: [
  { id: 'premio-2021-fex-1', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-2', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-3', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-4', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-5', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-6', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/06.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-8', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/08.webp', display_order: 8, is_primary: false, created_at: new Date().toISOString() },
  { id: 'premio-2021-fex-9', vehicle_id: 'premio-2021-fex', image_url: '/cars/premio/09.webp', display_order: 9, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Allion G+
  createVehicle({
    id: 'allion-2021-gplus',
    stock_number: 'ALLION-2021-GPLUS',
    brand_name: 'Toyota',
    model: 'Allion',
    year: 2021,
    packageName: 'G+',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '43.50 Lakh BDT',
    body_type: 'Sedan',
    color_exterior: 'Glossy Black',
  description_en: `The Toyota Allion G+ (2021/2022) is a sophisticated sedan that combines dynamic performance with luxurious comfort. Its Glossy Black finish exudes a commanding presence, while the aerodynamic design enhances both aesthetics and efficiency. The Allion G+ is powered by a state-of-the-art hybrid engine, delivering smooth acceleration and outstanding fuel economy. Inside, the cabin is a sanctuary of comfort, featuring plush seating, advanced climate control, and a premium sound system. Safety is paramount, with features like adaptive cruise control, lane departure warning, and a comprehensive airbag system. The Allion's responsive handling and quiet ride make it ideal for both city commutes and highway journeys. With Toyota's reputation for reliability and innovation, the Allion G+ is a top choice for those seeking a refined, high-performance sedan.`,
    images: [
  { id: 'allion-2021-gplus-1', vehicle_id: 'allion-2021-gplus', image_url: '/cars/allion/01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
  { id: 'allion-2021-gplus-2', vehicle_id: 'allion-2021-gplus', image_url: '/cars/allion/02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
  { id: 'allion-2021-gplus-3', vehicle_id: 'allion-2021-gplus', image_url: '/cars/allion/03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
  { id: 'allion-2021-gplus-4', vehicle_id: 'allion-2021-gplus', image_url: '/cars/allion/04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
  { id: 'allion-2021-gplus-5', vehicle_id: 'allion-2021-gplus', image_url: '/cars/allion/05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
  { id: 'allion-2021-gplus-6', vehicle_id: 'allion-2021-gplus', image_url: '/cars/allion/06.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Aqua X
  createVehicle({
    id: 'aqua-2021-x',
    stock_number: 'AQUA-2021-X',
    brand_name: 'Toyota',
    model: 'Aqua',
    year: 2021,
    packageName: 'X',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '20.50 Lakh BDT',
    body_type: 'Hatchback',
    color_exterior: 'Black',
  description_en: `The Toyota Aqua X (2021) is a compact hybrid hatchback designed for urban agility and eco-friendly driving. Its compact dimensions make parking and maneuvering effortless, while the hybrid powertrain ensures minimal fuel consumption and reduced emissions. The Aqua X features a modern, tech-savvy interior with comfortable seating, intuitive controls, and ample cargo space for its class. Safety is built-in, with Toyota's advanced safety suite including pre-collision warning, ABS, and multiple airbags. The stylish exterior, highlighted by a sleek Black finish, gives the Aqua a youthful and energetic vibe. Perfect for city dwellers and young professionals, the Aqua X offers a fun, efficient, and reliable driving experience with the peace of mind that comes from Toyota engineering.`,
    images: [
      { id: 'aqua-2021-x-1', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'aqua-2021-x-2', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-2021-x-3', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-2021-x-4', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-2021-x-5', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-2021-x-6', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/06.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() },
      { id: 'aqua-2021-x-7', vehicle_id: 'aqua-2021-x', image_url: '/cars/aqua/07.webp', display_order: 7, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Corolla Cross Z Leather
  createVehicle({
    id: 'corolla-cross-2021-zleather',
    stock_number: 'COROLLACROSS-2021-ZLEATHER',
    brand_name: 'Toyota',
    model: 'Corolla Cross',
    year: 2021,
    packageName: 'Z Leather',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '40.50 Lakh BDT',
    body_type: 'Crossover',
  description_en: `The Toyota Corolla Cross Z Leather (2021) is a premium crossover that redefines versatility and comfort. With its elevated stance and bold design, the Corolla Cross commands attention on any road. The Z Leather package adds a touch of luxury, featuring leather upholstery, advanced infotainment, and dual-zone climate control. The hybrid engine delivers a perfect balance of power and efficiency, making it suitable for both city and highway driving. Safety is uncompromised, with Toyota Safety Sense, adaptive cruise control, and a reinforced body structure. The spacious interior offers flexible seating and generous cargo space, ideal for families and active lifestyles. Whether navigating urban streets or exploring new destinations, the Corolla Cross Z Leather provides a refined, confident, and enjoyable driving experience.`,
    images: [
      { id: 'corolla-cross-2021-zleather-1', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'corolla-cross-2021-zleather-2', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'corolla-cross-2021-zleather-3', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'corolla-cross-2021-zleather-4', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'corolla-cross-2021-zleather-5', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'corolla-cross-2021-zleather-6', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross06.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() },
      { id: 'corolla-cross-2021-zleather-7', vehicle_id: 'corolla-cross-2021-zleather', image_url: '/cars/corolla-cross/corolla-cross07.webp', display_order: 7, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Harrier Z Leather Advance Premium
  createVehicle({
    id: 'harrier-2021-zleather',
    stock_number: 'HARRIER-2021-ZLEATHER',
    brand_name: 'Toyota',
    model: 'Harrier',
    year: 2021,
    packageName: 'Z Leather Advance Premium',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '62.50 Lakh BDT',
    body_type: 'Premium SUV',
  description_en: `The Toyota Harrier Z Leather Advance Premium (2021) is a flagship premium SUV that blends luxury, technology, and performance. Its striking design, highlighted by elegant lines and a commanding grille, sets it apart in any setting. The interior is a showcase of craftsmanship, with leather-appointed seats, panoramic sunroof, and state-of-the-art infotainment. The hybrid powertrain ensures robust performance and impressive fuel efficiency, while advanced suspension delivers a smooth, composed ride. Safety features include adaptive headlights, blind-spot monitoring, and a full suite of driver aids. The Harrier is perfect for those who demand the best in comfort, innovation, and prestige, making every journey an extraordinary experience.`,
    images: [
      { id: 'harrier-2021-zleather-1', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-2', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-3', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-4', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-5', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier05..webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-6', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier06..webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-7', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier07..webp', display_order: 7, is_primary: false, created_at: new Date().toISOString() },
      { id: 'harrier-2021-zleather-8', vehicle_id: 'harrier-2021-zleather', image_url: '/cars/harrier-z-leather/harrier08..webp', display_order: 8, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // TOYOTA - Land Cruiser Prado TXL
  createVehicle({
    id: 'prado-2021-txl',
    stock_number: 'PRADO-2021-TXL',
    brand_name: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2021,
    packageName: 'TXL',
    condition_grade: 4.5,
    availability_status: 'Preorder',
    price: '1.50 Crore BDT',
    body_type: 'SUV',
  description_en: `The Toyota Land Cruiser Prado TXL (2021) is a legendary SUV renowned for its rugged capability, luxurious comfort, and advanced technology. Built to conquer any terrain, the Prado TXL features a robust chassis, full-time four-wheel drive, and a powerful yet efficient engine. The spacious interior is designed for long journeys, offering plush seating, tri-zone climate control, and a premium infotainment system. Safety is uncompromised, with features like adaptive cruise control, lane-keeping assist, and a comprehensive airbag system. The Prado's sophisticated suspension ensures a smooth ride on highways and confidence on rough roads. With its commanding presence, advanced off-road features, and Toyota's reputation for reliability, the Land Cruiser Prado TXL is the ultimate choice for families and adventurers who demand the best in performance and luxury.`,
    images: [
      { id: 'prado-2021-txl-1', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado01.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-2', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado02.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-3', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado03.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-4', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado04.webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-5', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado05.webp', display_order: 5, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-6', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado06.webp', display_order: 6, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-7', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado07.webp', display_order: 7, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-8', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado08.webp', display_order: 8, is_primary: false, created_at: new Date().toISOString() },
      { id: 'prado-2021-txl-9', vehicle_id: 'prado-2021-txl', image_url: '/cars/land-prado/prado_04.webp', display_order: 9, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
  // BYD - Sealion 7
  createVehicle({
    id: 'byd-sealion-7-2024',
    stock_number: 'BYD-SEALION-7-2024',
    brand_name: 'BYD',
    model: 'Sealion 7',
    year: 2024,
    packageName: 'Premium',
    condition_grade: 5,
    availability_status: 'Preorder',
    price: '0', // Price on request
    body_type: 'SUV',
    color_exterior: 'Arctic Blue',
    description_en: `The BYD Sealion 7 is a cutting-edge electric SUV that combines futuristic design, exceptional performance, and advanced technology. As a flagship model from BYD, the Sealion 7 is built on their latest e-Platform 3.0, offering a highly efficient and dynamic driving experience. Its sleek, aerodynamic exterior is complemented by a spacious and luxurious interior, featuring premium materials and a state-of-the-art infotainment system. With a long-range battery and rapid charging capabilities, the Sealion 7 is perfect for both daily commutes and long-distance travel. Safety is paramount, with a comprehensive suite of driver-assistance systems. The Sealion 7 represents the next generation of electric mobility, delivering a perfect blend of style, sustainability, and innovation.`,
    images: [
      { id: 'byd-sealion-7-1', vehicle_id: 'byd-sealion-7-2024', image_url: '/cars/sealion7/byd-sealion-7-720x405px.webp', display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: 'byd-sealion-7-2', vehicle_id: 'byd-sealion-7-2024', image_url: '/cars/sealion7/2-byd-sealion-7-rear.webp', display_order: 2, is_primary: false, created_at: new Date().toISOString() },
      { id: 'byd-sealion-7-3', vehicle_id: 'byd-sealion-7-2024', image_url: '/cars/sealion7/byd-sealion-7-front-quarter.webp', display_order: 3, is_primary: false, created_at: new Date().toISOString() },
      { id: 'byd-sealion-7-4', vehicle_id: 'byd-sealion-7-2024', image_url: '/cars/sealion7/bydsealion71124(4).webp', display_order: 4, is_primary: false, created_at: new Date().toISOString() }
    ],
  }),
];
