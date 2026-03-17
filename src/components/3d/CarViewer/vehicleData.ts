/**
 * Vehicle Data Configuration
 * 
 * This file contains all vehicle configurations for the 3D viewer.
 * Each vehicle includes model paths, available colors, specs, and animation settings.
 * 
 * To add a new vehicle:
 * 1. Add the GLB model to /public/models/
 * 2. Add a fallback image to /public/images/vehicles/
 * 3. Add the configuration below following the VehicleModelData interface
 */

import { VehicleModelData, CarColor, LightingPreset, CameraSettings, ControlsSettings } from './types';

// ============================================
// SHARED COLOR PALETTES
// ============================================

export const COMMON_COLORS: Record<string, CarColor> = {
  // White variants
  pearlWhite: { name: 'Pearl White', hex: '#F5F5F5', metalness: 0.3, roughness: 0.4 },
  superWhite: { name: 'Super White', hex: '#FFFFFF', metalness: 0.1, roughness: 0.5 },
  platinumWhite: { name: 'Platinum White Pearl', hex: '#E8E8E8', metalness: 0.4, roughness: 0.35 },
  
  // Black variants
  attitudeBlack: { name: 'Attitude Black', hex: '#1A1A1A', metalness: 0.5, roughness: 0.3 },
  midnightBlack: { name: 'Midnight Black', hex: '#0D0D0D', metalness: 0.6, roughness: 0.25 },
  
  // Silver/Gray variants
  silverMetallic: { name: 'Silver Metallic', hex: '#C0C0C0', metalness: 0.7, roughness: 0.3 },
  celestialSilver: { name: 'Celestial Silver', hex: '#A9A9A9', metalness: 0.6, roughness: 0.35 },
  graphiteGray: { name: 'Graphite Gray', hex: '#4A4A4A', metalness: 0.5, roughness: 0.4 },
  
  // Red variants
  emotionalRed: { name: 'Emotional Red', hex: '#8B0000', metalness: 0.4, roughness: 0.35 },
  sensualRed: { name: 'Sensual Red Mica', hex: '#B22222', metalness: 0.5, roughness: 0.3 },
  rallyeRed: { name: 'Rallye Red', hex: '#DC143C', metalness: 0.3, roughness: 0.4 },
  
  // Blue variants
  blueprintBlue: { name: 'Blueprint', hex: '#1E3A5F', metalness: 0.5, roughness: 0.35 },
  sparklingSea: { name: 'Sparkling Sea Blue', hex: '#4682B4', metalness: 0.6, roughness: 0.3 },
  aegeanBlue: { name: 'Aegean Blue', hex: '#1E90FF', metalness: 0.4, roughness: 0.4 },
  
  // Green variants
  darkEmerald: { name: 'Dark Emerald', hex: '#004D40', metalness: 0.5, roughness: 0.35 },
  
  // Brown/Bronze variants
  bronzeMetallic: { name: 'Bronze Metallic', hex: '#8B4513', metalness: 0.6, roughness: 0.35 },
  
  // Special colors
  champagne: { name: 'Champagne', hex: '#D4AF37', metalness: 0.5, roughness: 0.4 },
};

// ============================================
// VEHICLE CONFIGURATIONS
// ============================================

export const VEHICLES: VehicleModelData[] = [
  // ============================================
  // TOYOTA VEHICLES
  // ============================================
  {
    id: 'toyota-harrier',
    name: 'Toyota Harrier',
    brand: 'Toyota',
    category: 'SUV',
    year: 2024,
    price: '৳ 74,00,000 (Pre-Order Price)',
    modelPath: '/models/toyota-harrier.glb',
    placeholderPath: '/models/placeholders/suv-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.emotionalRed,
      COMMON_COLORS.sparklingSea,
      COMMON_COLORS.darkEmerald,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: true,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '2.5L Hybrid',
      horsepower: '218 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'AWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.2,
    description: 'Premium luxury SUV with advanced hybrid technology',
    descriptionBn: 'উন্নত হাইব্রিড প্রযুক্তি সহ প্রিমিয়াম বিলাসবহুল এসইউভি',
  },
  {
    id: 'toyota-corolla-cross',
    name: 'Toyota Corolla Cross',
    brand: 'Toyota',
    category: 'Crossover',
    year: 2024,
    price: '৳ 43,50,000 (Pre-Order Price)',
    modelPath: '/models/toyota-corolla-cross.glb',
    placeholderPath: '/models/placeholders/crossover-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/36344639/pexels-photo-36344639.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.superWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.celestialSilver,
      COMMON_COLORS.blueprintBlue,
      COMMON_COLORS.bronzeMetallic,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '1.8L Hybrid',
      horsepower: '122 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.1,
    description: 'Compact crossover with excellent fuel efficiency',
    descriptionBn: 'চমৎকার জ্বালানি দক্ষতা সহ কমপ্যাক্ট ক্রসওভার',
  },
  {
    id: 'toyota-crown',
    name: 'Toyota Crown RS',
    brand: 'Toyota',
    category: 'Sedan',
    year: 2024,
    price: '৳ 77,00,000 (Pre-Order Price)',
    modelPath: '/models/toyota-crown.glb',
    placeholderPath: '/models/placeholders/sedan-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/36344647/pexels-photo-36344647.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.midnightBlack,
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.sensualRed,
      COMMON_COLORS.champagne,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: true,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '2.5L Hybrid',
      horsepower: '225 HP',
      transmission: '8-Speed Automatic',
      fuelType: 'Hybrid',
      drivetrain: 'RWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.15,
    description: 'Executive premium sedan with cutting-edge technology',
    descriptionBn: 'অত্যাধুনিক প্রযুক্তি সহ এক্সিকিউটিভ প্রিমিয়াম সেডান',
  },
  {
    id: 'toyota-prado',
    name: 'Toyota Land Cruiser Prado',
    brand: 'Toyota',
    category: 'SUV',
    year: 2024,
    price: '৳ 1,40,00,000 (Pre-Order Price)',
    modelPath: '/models/toyota-prado.glb',
    placeholderPath: '/models/placeholders/suv-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/36344640/pexels-photo-36344640.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.graphiteGray,
      COMMON_COLORS.darkEmerald,
      COMMON_COLORS.champagne,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: true,
      headlightToggle: true,
      speedMultiplier: 0.8,
    },
    specs: {
      engine: '2.8L Diesel Turbo',
      horsepower: '204 HP',
      transmission: '6-Speed Automatic',
      fuelType: 'Diesel',
      drivetrain: '4WD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.3,
    description: 'Legendary off-road SUV with unmatched capability',
    descriptionBn: 'অতুলনীয় সক্ষমতা সহ কিংবদন্তি অফ-রোড এসইউভি',
  },
  {
    id: 'toyota-yaris-cross',
    name: 'Toyota Yaris Cross',
    brand: 'Toyota',
    category: 'Crossover',
    year: 2024,
    price: '৳ 29,50,000 (Pre-Order Price)',
    modelPath: '/models/toyota-yaris-cross.glb',
    placeholderPath: '/models/placeholders/crossover-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35516543/pexels-photo-35516543.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.aegeanBlue,
      COMMON_COLORS.rallyeRed,
      COMMON_COLORS.champagne,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.2,
    },
    specs: {
      engine: '1.5L Hybrid',
      horsepower: '116 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.0,
    description: 'Compact and efficient urban crossover',
    descriptionBn: 'কমপ্যাক্ট এবং দক্ষ শহুরে ক্রসওভার',
  },
  {
    id: 'toyota-chr',
    name: 'Toyota C-HR',
    brand: 'Toyota',
    category: 'Crossover',
    year: 2024,
    price: '৳ 33,00,000 (Pre-Order Price)',
    modelPath: '/models/toyota-chr.glb',
    placeholderPath: '/models/placeholders/crossover-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35515951/pexels-photo-35515951.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.sensualRed,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.aegeanBlue,
      COMMON_COLORS.graphiteGray,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.1,
    },
    specs: {
      engine: '1.8L Hybrid',
      horsepower: '144 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.05,
    description: 'Bold and stylish compact SUV',
    descriptionBn: 'সাহসী এবং স্টাইলিশ কমপ্যাক্ট এসইউভি',
  },
  {
    id: 'toyota-noah',
    name: 'Toyota Noah',
    brand: 'Toyota',
    category: 'MPV',
    year: 2024,
    price: '৳ 29,50,000 (Pre-Order Price)',
    modelPath: '/models/toyota-noah.glb',
    placeholderPath: '/models/placeholders/mpv-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.graphiteGray,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: true,
      headlightToggle: true,
      speedMultiplier: 0.9,
    },
    specs: {
      engine: '1.8L Hybrid',
      horsepower: '140 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.25,
    description: 'Spacious family MPV with hybrid efficiency',
    descriptionBn: 'হাইব্রিড দক্ষতা সহ প্রশস্ত পারিবারিক এমপিভি',
  },

  // ============================================
  // HONDA VEHICLES
  // ============================================
  {
    id: 'honda-civic',
    name: 'Honda Civic',
    brand: 'Honda',
    category: 'Sedan',
    year: 2024,
    price: '৳ 35,50,000 (Pre-Order Price)',
    modelPath: '/models/honda-civic.glb',
    placeholderPath: '/models/placeholders/sedan-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/17653852/pexels-photo-17653852.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.celestialSilver,
      COMMON_COLORS.rallyeRed,
      COMMON_COLORS.aegeanBlue,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '1.5L Turbo VTEC',
      horsepower: '180 HP',
      transmission: 'CVT',
      fuelType: 'Petrol',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.1,
    description: 'Sporty and reliable compact sedan',
    descriptionBn: 'স্পোর্টি এবং নির্ভরযোগ্য কমপ্যাক্ট সেডান',
  },
  {
    id: 'honda-crv',
    name: 'Honda CR-V',
    brand: 'Honda',
    category: 'SUV',
    year: 2024,
    price: '৳ 95,90,000 (Pre-Order Price)',
    modelPath: '/models/honda-crv.glb',
    placeholderPath: '/models/placeholders/suv-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/13885915/pexels-photo-13885915.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.platinumWhite,
      COMMON_COLORS.midnightBlack,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.sensualRed,
      COMMON_COLORS.blueprintBlue,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: true,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '2.0L Hybrid',
      horsepower: '204 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'AWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.2,
    description: 'Versatile family SUV with Honda reliability',
    descriptionBn: 'হোন্ডা নির্ভরযোগ্যতা সহ বহুমুখী পারিবারিক এসইউভি',
  },
  {
    id: 'honda-vezel',
    name: 'Honda Vezel (HR-V)',
    brand: 'Honda',
    category: 'Crossover',
    year: 2024,
    price: '৳ 48,00,000 (Pre-Order Price)',
    modelPath: '/models/honda-vezel.glb',
    placeholderPath: '/models/placeholders/crossover-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35515950/pexels-photo-35515950.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.celestialSilver,
      COMMON_COLORS.sensualRed,
      COMMON_COLORS.aegeanBlue,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.1,
    },
    specs: {
      engine: '1.5L e:HEV Hybrid',
      horsepower: '131 HP',
      transmission: 'e-CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.1,
    description: 'Stylish compact SUV with Honda Sensing',
    descriptionBn: 'হোন্ডা সেন্সিং সহ স্টাইলিশ কমপ্যাক্ট এসইউভি',
  },

  // ============================================
  // ADDITIONAL BANGLADESH POPULAR MODELS
  // ============================================
  {
    id: 'toyota-axio',
    name: 'Toyota Axio',
    brand: 'Toyota',
    category: 'Sedan',
    year: 2024,
    price: '৳ 22,00,000 (Pre-Order Price)',
    modelPath: '/models/toyota-axio.glb',
    placeholderPath: '/models/placeholders/sedan-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35515952/pexels-photo-35515952.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.celestialSilver,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '1.5L Hybrid',
      horsepower: '109 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.05,
    description: 'Fuel-efficient compact sedan for daily commute',
    descriptionBn: 'দৈনিক যাতায়াতের জন্য জ্বালানি-দক্ষ কমপ্যাক্ট সেডান',
  },
  {
    id: 'toyota-premio',
    name: 'Toyota Premio',
    brand: 'Toyota',
    category: 'Sedan',
    year: 2024,
    price: '৳ 43,30,000 (Pre-Order Price)',
    modelPath: '/models/toyota-premio.glb',
    placeholderPath: '/models/placeholders/sedan-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.champagne,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '1.8L Hybrid',
      horsepower: '140 HP',
      transmission: 'CVT',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.1,
    description: 'Executive sedan with premium features',
    descriptionBn: 'প্রিমিয়াম বৈশিষ্ট্য সহ এক্সিকিউটিভ সেডান',
  },
  {
    id: 'mitsubishi-pajero-sport',
    name: 'Mitsubishi Pajero Sport',
    brand: 'Mitsubishi',
    category: 'SUV',
    year: 2024,
    price: '৳ 95,00,000',
    modelPath: '/models/mitsubishi-pajero.glb',
    placeholderPath: '/models/placeholders/suv-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.attitudeBlack,
      COMMON_COLORS.graphiteGray,
      COMMON_COLORS.bronzeMetallic,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: true,
      headlightToggle: true,
      speedMultiplier: 0.8,
    },
    specs: {
      engine: '2.4L Diesel Turbo',
      horsepower: '181 HP',
      transmission: '8-Speed Automatic',
      fuelType: 'Diesel',
      drivetrain: '4WD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.3,
    description: 'Rugged off-road SUV built for adventure',
    descriptionBn: 'অ্যাডভেঞ্চারের জন্য তৈরি রুগেড অফ-রোড এসইউভি',
  },
  {
    id: 'nissan-x-trail',
    name: 'Nissan X-Trail',
    brand: 'Nissan',
    category: 'SUV',
    year: 2024,
    price: '৳ 35,50,000 (Pre-Order Price)',
    modelPath: '/models/nissan-xtrail.glb',
    placeholderPath: '/models/placeholders/suv-placeholder.glb',
    fallbackImage: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      COMMON_COLORS.pearlWhite,
      COMMON_COLORS.midnightBlack,
      COMMON_COLORS.silverMetallic,
      COMMON_COLORS.sensualRed,
    ],
    defaultColorIndex: 0,
    animations: {
      idleSway: true,
      wheelRotation: true,
      doorToggle: false,
      headlightToggle: true,
      speedMultiplier: 1.0,
    },
    specs: {
      engine: '1.5L e-POWER',
      horsepower: '204 HP',
      transmission: 'e-CVT',
      fuelType: 'Hybrid',
      drivetrain: 'AWD',
    },
    bodyMeshName: 'Body',
    wheelMeshNames: ['Wheel_FL', 'Wheel_FR', 'Wheel_RL', 'Wheel_RR'],
    cameraDistance: 1.2,
    description: 'Family-friendly SUV with e-POWER technology',
    descriptionBn: 'e-POWER প্রযুক্তি সহ পারিবারিক-বান্ধব এসইউভি',
  },
];

// ============================================
// LIGHTING PRESETS
// ============================================

export const LIGHTING_PRESETS: Record<string, LightingPreset> = {
  day: {
    ambientIntensity: 0.6,
    ambientColor: '#ffffff',
    directionalIntensity: 1.2,
    directionalColor: '#ffffff',
    directionalPosition: [10, 15, 10],
    envMapIntensity: 1.0,
    backgroundColor: '#f0f4f8',
    shadows: true,
  },
  night: {
    ambientIntensity: 0.2,
    ambientColor: '#4a5568',
    directionalIntensity: 0.3,
    directionalColor: '#a0aec0',
    directionalPosition: [5, 10, 5],
    envMapIntensity: 0.4,
    backgroundColor: '#1a202c',
    shadows: true,
  },
  studio: {
    ambientIntensity: 0.8,
    ambientColor: '#f7fafc',
    directionalIntensity: 1.5,
    directionalColor: '#ffffff',
    directionalPosition: [0, 20, 10],
    envMapIntensity: 1.2,
    backgroundColor: '#e2e8f0',
    shadows: true,
  },
};

// ============================================
// CAMERA PRESETS
// ============================================

export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  fov: 45,
  near: 0.1,
  far: 1000,
  position: [5, 3, 5],
  target: [0, 0, 0],
};

export const MOBILE_CAMERA_SETTINGS: CameraSettings = {
  fov: 55,
  near: 0.1,
  far: 1000,
  position: [6, 3.5, 6],
  target: [0, 0, 0],
};

// ============================================
// CONTROLS PRESETS
// ============================================

export const DEFAULT_CONTROLS_SETTINGS: ControlsSettings = {
  minPolarAngle: Math.PI * 0.1, // Prevent going too low
  maxPolarAngle: Math.PI * 0.5, // Prevent going underneath
  minDistance: 3,
  maxDistance: 12,
  enableDamping: true,
  dampingFactor: 0.05,
  enablePan: false, // Disabled for clean UX
  enableZoom: true,
  autoRotate: false,
  autoRotateSpeed: 1.5,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get vehicle data by ID
 */
export const getVehicleById = (id: string): VehicleModelData | undefined => {
  return VEHICLES.find(v => v.id === id);
};

/**
 * Get vehicles by brand
 */
export const getVehiclesByBrand = (brand: VehicleModelData['brand']): VehicleModelData[] => {
  return VEHICLES.filter(v => v.brand === brand);
};

/**
 * Get vehicles by category
 */
export const getVehiclesByCategory = (category: VehicleModelData['category']): VehicleModelData[] => {
  return VEHICLES.filter(v => v.category === category);
};

/**
 * Get all vehicle IDs
 */
export const getAllVehicleIds = (): string[] => {
  return VEHICLES.map(v => v.id);
};

/**
 * Get featured vehicles (first 6)
 */
export const getFeaturedVehicles = (): VehicleModelData[] => {
  return VEHICLES.slice(0, 6);
};

export default VEHICLES;
