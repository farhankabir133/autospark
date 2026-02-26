import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Pause, 
  Play,
  Car,
  Sofa,
  Palette,
  GitCompare,
  X,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// ============================================
// VEHICLE DATA - All 14 vehicles with multiple angles
// ============================================
const vehicleData = [
  {
    id: 'harrier',
    name: 'Toyota Harrier',
    brand: 'Toyota',
    year: 2024,
    price: '৳ 75,00,000',
    type: 'Premium SUV',
    // Multiple angle images (simulated 360° - using same image rotated for demo)
    exteriorImages: [
      'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Pearl White', hex: '#F5F5F5', image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'Black Metallic', hex: '#1a1a1a', image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'Red Mica', hex: '#8B0000', image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 15, y: 45, label: 'LED Headlights', description: 'Adaptive LED headlights with automatic high beam' },
      { id: 2, x: 50, y: 70, label: 'Panoramic Roof', description: 'Full-length panoramic glass roof with UV protection' },
      { id: 3, x: 85, y: 50, label: 'LED Taillights', description: 'Signature LED taillights with sequential turn signals' },
      { id: 4, x: 25, y: 85, label: '19" Alloy Wheels', description: 'Premium 19-inch machined alloy wheels' },
    ],
    specs: { engine: '2.5L Hybrid', hp: '218 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'corolla-cross',
    name: 'Corolla Cross Z',
    brand: 'Toyota',
    year: 2024,
    price: '৳ 45,50,000',
    type: 'Compact Crossover',
    exteriorImages: [
      'https://images.pexels.com/photos/35509100/pexels-photo-35509100.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Steel Blue', hex: '#4682B4', image: 'https://images.pexels.com/photos/35509100/pexels-photo-35509100.png?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'White Pearl', hex: '#F8F8FF', image: 'https://images.pexels.com/photos/35509100/pexels-photo-35509100.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 20, y: 40, label: 'Bi-Beam LED', description: 'Bi-Beam LED headlights with DRL' },
      { id: 2, x: 50, y: 35, label: 'Roof Rails', description: 'Integrated aluminum roof rails' },
      { id: 3, x: 80, y: 45, label: 'Rear Spoiler', description: 'Aerodynamic rear spoiler' },
    ],
    specs: { engine: '1.8L Hybrid', hp: '122 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'crown-rs',
    name: 'Toyota Crown RS',
    brand: 'Toyota',
    year: 2024,
    price: '৳ 70,00,000',
    type: 'Premium Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Black Metallic', hex: '#1a1a1a', image: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'Silver', hex: '#C0C0C0', image: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 18, y: 42, label: 'Matrix LED', description: 'Adaptive Matrix LED headlights' },
      { id: 2, x: 50, y: 30, label: 'Heads-Up Display', description: '12.3" color heads-up display' },
      { id: 3, x: 75, y: 55, label: 'Dual Exhaust', description: 'Sport dual exhaust system' },
    ],
    specs: { engine: '2.5L Hybrid', hp: '225 HP', transmission: 'Automatic', fuel: 'Hybrid' },
  },
  {
    id: 'prado',
    name: 'Land Cruiser Prado',
    brand: 'Toyota',
    year: 2024,
    price: '৳ 85,00,000',
    type: 'Premium SUV',
    exteriorImages: [
      'https://images.pexels.com/photos/35516384/pexels-photo-35516384.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Black Pearl', hex: '#0a0a0a', image: 'https://images.pexels.com/photos/35516384/pexels-photo-35516384.png?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'White', hex: '#FFFFFF', image: 'https://images.pexels.com/photos/35516384/pexels-photo-35516384.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 15, y: 40, label: 'LED Headlamps', description: 'Quad-LED projector headlamps' },
      { id: 2, x: 50, y: 25, label: 'Roof Rack', description: 'Heavy-duty roof rack system' },
      { id: 3, x: 30, y: 80, label: 'Skid Plate', description: 'Reinforced front skid plate' },
      { id: 4, x: 70, y: 85, label: 'Tow Hook', description: 'Rear tow hook rated 3,500kg' },
    ],
    specs: { engine: '2.7L V6', hp: '163 HP', transmission: 'Automatic', fuel: 'Petrol' },
  },
  {
    id: 'premio',
    name: 'Toyota Premio F-EX',
    brand: 'Toyota',
    year: 2023,
    price: '৳ 40,00,000',
    type: 'Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Silver Pearl', hex: '#C0C0C0', image: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 20, y: 45, label: 'Halogen Lights', description: 'Multi-reflector halogen headlights' },
      { id: 2, x: 50, y: 40, label: 'Chrome Grille', description: 'Premium chrome front grille' },
    ],
    specs: { engine: '1.5L Hybrid', hp: '109 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'noah',
    name: 'Toyota Noah Si WxB',
    brand: 'Toyota',
    year: 2023,
    price: '৳ 38,00,000',
    type: 'MPV',
    exteriorImages: [
      'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'White Pearl', hex: '#F8F8FF', image: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 45, y: 50, label: 'Sliding Door', description: 'Power sliding doors with auto-close' },
      { id: 2, x: 50, y: 30, label: '8 Seats', description: '8-seater configuration with captain seats' },
    ],
    specs: { engine: '1.8L Hybrid', hp: '98 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'chr',
    name: 'Toyota C-HR G-LED',
    brand: 'Toyota',
    year: 2023,
    price: '৳ 35,50,000',
    type: 'Compact SUV',
    exteriorImages: [
      'https://images.pexels.com/photos/35515951/pexels-photo-35515951.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Red Metallic', hex: '#B22222', image: 'https://images.pexels.com/photos/35515951/pexels-photo-35515951.png?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'Blue', hex: '#4169E1', image: 'https://images.pexels.com/photos/35515951/pexels-photo-35515951.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 18, y: 42, label: 'Sequential LED', description: 'Sequential turn signal LED lights' },
      { id: 2, x: 50, y: 35, label: 'Coupe Roof', description: 'Sporty coupe-like roofline' },
      { id: 3, x: 82, y: 45, label: 'Hidden Handles', description: 'Concealed rear door handles' },
    ],
    specs: { engine: '1.8L Hybrid', hp: '122 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'yaris-cross',
    name: 'Yaris Cross Z',
    brand: 'Toyota',
    year: 2023,
    price: '৳ 35,50,000',
    type: 'Compact Crossover',
    exteriorImages: [
      'https://images.pexels.com/photos/35516543/pexels-photo-35516543.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Pearl Blue', hex: '#4169E1', image: 'https://images.pexels.com/photos/35516543/pexels-photo-35516543.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 20, y: 40, label: 'LED Package', description: 'Full LED lighting package' },
      { id: 2, x: 75, y: 50, label: 'Spoiler', description: 'Integrated rear spoiler' },
    ],
    specs: { engine: '1.5L Hybrid', hp: '116 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'axio',
    name: 'Toyota Axio WxB',
    brand: 'Toyota',
    year: 2023,
    price: '৳ 30,00,000',
    type: 'Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/35515952/pexels-photo-35515952.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Silver', hex: '#C0C0C0', image: 'https://images.pexels.com/photos/35515952/pexels-photo-35515952.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 22, y: 45, label: 'Projector Lights', description: 'Projector headlights with LED DRL' },
    ],
    specs: { engine: '1.3L Hybrid', hp: '95 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'prius',
    name: 'Toyota Prius S',
    brand: 'Toyota',
    year: 2023,
    price: '৳ 28,50,000',
    type: 'Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/35516335/pexels-photo-35516335.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Pearl White', hex: '#F8F8FF', image: 'https://images.pexels.com/photos/35516335/pexels-photo-35516335.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 18, y: 38, label: 'Aero Design', description: 'Aerodynamic front bumper design' },
      { id: 2, x: 50, y: 28, label: 'Solar Roof', description: 'Optional solar panel roof' },
    ],
    specs: { engine: '1.8L Hybrid', hp: '121 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'insight',
    name: 'Honda Insight',
    brand: 'Honda',
    year: 2023,
    price: '৳ 42,00,000',
    type: 'Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/35515950/pexels-photo-35515950.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Crystal Gray', hex: '#708090', image: 'https://images.pexels.com/photos/35515950/pexels-photo-35515950.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 20, y: 42, label: 'LED Headlights', description: 'Full LED headlights with auto-leveling' },
      { id: 2, x: 50, y: 32, label: 'Honda Sensing', description: 'Full Honda Sensing safety suite' },
    ],
    specs: { engine: '1.5L Hybrid', hp: '151 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'lexus',
    name: 'Lexus ES Hybrid',
    brand: 'Lexus',
    year: 2023,
    price: '৳ 28,00,000',
    type: 'Luxury Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/35516542/pexels-photo-35516542.png?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Pearl White', hex: '#F8F8FF', image: 'https://images.pexels.com/photos/35516542/pexels-photo-35516542.png?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 15, y: 40, label: 'Triple Beam LED', description: 'Triple-beam LED headlights' },
      { id: 2, x: 50, y: 28, label: 'Mark Levinson', description: 'Mark Levinson premium audio' },
      { id: 3, x: 80, y: 48, label: 'Spindle Grille', description: 'Signature Lexus spindle grille' },
    ],
    specs: { engine: '2.5L Hybrid', hp: '215 HP', transmission: 'CVT', fuel: 'Hybrid' },
  },
  {
    id: 'civic',
    name: 'Honda Civic',
    brand: 'Honda',
    year: 2023,
    price: '৳ 32,00,000',
    type: 'Sedan',
    exteriorImages: [
      'https://images.pexels.com/photos/3769173/pexels-photo-3769173.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Blue', hex: '#4169E1', image: 'https://images.pexels.com/photos/3769173/pexels-photo-3769173.jpeg?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'Red', hex: '#DC143C', image: 'https://images.pexels.com/photos/3769173/pexels-photo-3769173.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 18, y: 40, label: 'LED Headlights', description: 'Jewel-eye LED headlights' },
      { id: 2, x: 50, y: 35, label: 'Fastback Design', description: 'Sporty fastback silhouette' },
      { id: 3, x: 82, y: 45, label: 'C-Light', description: 'Signature C-shaped taillights' },
    ],
    specs: { engine: '1.8L VTEC', hp: '141 HP', transmission: 'CVT', fuel: 'Petrol' },
  },
  {
    id: 'crv',
    name: 'Honda CR-V',
    brand: 'Honda',
    year: 2023,
    price: '৳ 42,00,000',
    type: 'Compact SUV',
    exteriorImages: [
      'https://images.pexels.com/photos/3807518/pexels-photo-3807518.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    interiorImage: 'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    colors: [
      { name: 'Black', hex: '#1a1a1a', image: 'https://images.pexels.com/photos/3807518/pexels-photo-3807518.jpeg?auto=compress&cs=tinysrgb&w=1200' },
      { name: 'White', hex: '#FFFFFF', image: 'https://images.pexels.com/photos/3807518/pexels-photo-3807518.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    ],
    hotspots: [
      { id: 1, x: 18, y: 42, label: 'LED Headlights', description: 'Auto-dimming LED headlights' },
      { id: 2, x: 50, y: 30, label: 'Roof Rails', description: 'Silver roof rails with 75kg capacity' },
      { id: 3, x: 80, y: 50, label: 'Power Tailgate', description: 'Hands-free power tailgate' },
    ],
    specs: { engine: '1.5L Turbo', hp: '190 HP', transmission: 'CVT', fuel: 'Petrol' },
  },
];

// ============================================
// COMPONENT
// ============================================
interface VehicleViewer360Props {
  initialVehicleId?: string;
}

export const VehicleViewer360Enhanced: React.FC<VehicleViewer360Props> = ({ 
  initialVehicleId = 'harrier' 
}) => {
  // State
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId);
  const [compareVehicleId, setCompareVehicleId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const animationRef = useRef<number>();

  // Get selected vehicle
  const selectedVehicle = vehicleData.find(v => v.id === selectedVehicleId) || vehicleData[0];
  const compareVehicle = compareVehicleId ? vehicleData.find(v => v.id === compareVehicleId) : null;

  // Current image based on view mode and color
  const getCurrentImage = (vehicle: typeof selectedVehicle) => {
    if (viewMode === 'interior') {
      return vehicle.interiorImage;
    }
    return vehicle.colors[selectedColorIndex]?.image || vehicle.exteriorImages[0];
  };

  // Auto-rotate effect
  useEffect(() => {
    if (isAutoRotate && viewMode === 'exterior') {
      const animate = () => {
        setRotation(prev => (prev + 0.3) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoRotate, viewMode]);

  // Image loading
  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = getCurrentImage(selectedVehicle);
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
  }, [selectedVehicleId, viewMode, selectedColorIndex]);

  // Reset color index when vehicle changes
  useEffect(() => {
    setSelectedColorIndex(0);
  }, [selectedVehicleId]);

  // Mouse/Touch handlers for rotation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    setIsAutoRotate(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - lastX.current;
    setRotation(prev => prev + delta * 0.5);
    lastX.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    lastX.current = e.touches[0].clientX;
    setIsAutoRotate(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - lastX.current;
    setRotation(prev => prev + delta * 0.5);
    lastX.current = e.touches[0].clientX;
  }, []);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setRotation(prev => prev - 15);
      if (e.key === 'ArrowRight') setRotation(prev => prev + 15);
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoRotate(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Render single viewer
  const renderViewer = (vehicle: typeof selectedVehicle, isCompare = false) => (
    <div className={`relative ${isCompare ? 'w-1/2' : 'w-full'} h-full`}>
      {/* Loading skeleton */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-300 text-sm">Loading 360° view...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main image with rotation */}
      <motion.div
        className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ 
          perspective: '1000px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        <motion.img
          src={getCurrentImage(vehicle)}
          alt={vehicle.name}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `rotateY(${rotation}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d',
            filter: viewMode === 'interior' ? 'none' : `hue-rotate(${rotation * 0.1}deg)`,
          }}
          draggable={false}
        />
      </motion.div>

      {/* Hotspots - only on exterior view */}
      {viewMode === 'exterior' && showHotspots && !isCompare && (
        <div className="absolute inset-0 pointer-events-none">
          {vehicle.hotspots.map((hotspot) => (
            <motion.div
              key={hotspot.id}
              className="absolute pointer-events-auto"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: hotspot.id * 0.1 }}
            >
              <motion.button
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  activeHotspot === hotspot.id
                    ? 'bg-blue-600 text-white scale-125'
                    : 'bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white'
                } shadow-lg border-2 border-blue-400`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
              >
                <Info className="w-4 h-4" />
              </motion.button>

              {/* Hotspot tooltip */}
              <AnimatePresence>
                {activeHotspot === hotspot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                      {hotspot.label}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">
                      {hotspot.description}
                    </p>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-l border-t border-gray-200 dark:border-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vehicle info overlay (compare mode) */}
      {isCompare && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h4 className="font-bold text-lg">{vehicle.name}</h4>
          <p className="text-sm text-gray-300">{vehicle.price}</p>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Vehicle Selector */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl transition-all min-w-[200px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  <span className="font-semibold truncate">{selectedVehicle.name}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 max-h-80 overflow-auto border border-gray-200 dark:border-gray-700"
                  >
                    {vehicleData.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setSelectedVehicleId(vehicle.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          selectedVehicleId === vehicle.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                        }`}
                      >
                        <img 
                          src={vehicle.exteriorImages[0]} 
                          alt={vehicle.name}
                          className="w-16 h-10 object-cover rounded-lg"
                        />
                        <div className="text-left flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{vehicle.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.brand} • {vehicle.price}</p>
                        </div>
                        {selectedVehicleId === vehicle.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Specs badges */}
            <div className="hidden md:flex gap-2">
              <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                {selectedVehicle.specs.engine}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                {selectedVehicle.specs.hp}
              </span>
              <span className="px-3 py-1 bg-green-500/80 text-white text-xs rounded-full">
                {selectedVehicle.specs.fuel}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-white text-center md:text-right">
            <h2 className="text-xl md:text-2xl font-bold">360° Vehicle Viewer</h2>
            <p className="text-blue-200 text-sm">Drag to rotate • Scroll to zoom</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('exterior')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'exterior'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              Exterior
            </button>
            <button
              onClick={() => setViewMode('interior')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'interior'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sofa className="w-4 h-4" />
              Interior
            </button>
          </div>

          {/* Color Switcher */}
          {viewMode === 'exterior' && selectedVehicle.colors.length > 1 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <div className="flex gap-1.5">
                {selectedVehicle.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(index)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedColorIndex === index
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hotspots Toggle */}
          {viewMode === 'exterior' && (
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showHotspots
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Info className="w-4 h-4" />
              Hotspots
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Compare Mode Toggle */}
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isCompareMode
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Compare
          </button>

          {/* Auto-rotate */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-lg transition-all ${
              isAutoRotate
                ? 'bg-green-100 dark:bg-green-900/50 text-green-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            title={isAutoRotate ? 'Pause rotation' : 'Auto rotate'}
          >
            {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={() => { setRotation(0); setZoom(1); }}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs text-gray-600 dark:text-gray-300 font-medium min-w-[40px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Compare Vehicle Selector */}
      <AnimatePresence>
        {isCompareMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 overflow-hidden"
          >
            <div className="p-3 flex items-center justify-between">
              <span className="text-purple-700 dark:text-purple-300 text-sm font-medium">
                Compare with:
              </span>
              <div className="relative">
                <button
                  onClick={() => setCompareDropdownOpen(!compareDropdownOpen)}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 px-4 py-2 rounded-lg text-gray-900 dark:text-white min-w-[200px] justify-between"
                >
                  <span>{compareVehicle?.name || 'Select vehicle...'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${compareDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Compare dropdown */}
                <AnimatePresence>
                  {compareDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-auto border border-gray-200 dark:border-gray-700"
                    >
                      {vehicleData
                        .filter(v => v.id !== selectedVehicleId)
                        .map((vehicle) => (
                          <button
                            key={vehicle.id}
                            onClick={() => {
                              setCompareVehicleId(vehicle.id);
                              setCompareDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              compareVehicleId === vehicle.id ? 'bg-purple-50 dark:bg-purple-900/30' : ''
                            }`}
                          >
                            <img 
                              src={vehicle.exteriorImages[0]} 
                              alt={vehicle.name}
                              className="w-14 h-9 object-cover rounded-lg"
                            />
                            <div className="text-left flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">{vehicle.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.price}</p>
                            </div>
                          </button>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => { setIsCompareMode(false); setCompareVehicleId(null); }}
                className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewer Area */}
      <div 
        className={`relative bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 ${
          isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[400px] md:h-[500px]'
        }`}
      >
        <div className="absolute inset-0 flex">
          {/* Main viewer */}
          {renderViewer(selectedVehicle)}

          {/* Compare viewer */}
          {isCompareMode && compareVehicle && (
            <>
              <div className="w-px bg-gray-300 dark:bg-gray-600" />
              {renderViewer(compareVehicle, true)}
            </>
          )}
        </div>

        {/* Rotation indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-lg">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {Math.round(rotation % 360)}°
          </span>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>

        {/* Keyboard hints */}
        <div className="absolute bottom-4 right-4 hidden md:flex gap-2">
          <span className="px-2 py-1 bg-white/80 dark:bg-gray-800/80 text-xs text-gray-600 dark:text-gray-400 rounded">
            ← → Rotate
          </span>
          <span className="px-2 py-1 bg-white/80 dark:bg-gray-800/80 text-xs text-gray-600 dark:text-gray-400 rounded">
            +/- Zoom
          </span>
          <span className="px-2 py-1 bg-white/80 dark:bg-gray-800/80 text-xs text-gray-600 dark:text-gray-400 rounded">
            Space Auto
          </span>
        </div>
      </div>

      {/* Footer with specs */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
              <p className="font-bold text-gray-900 dark:text-white">{selectedVehicle.price}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">{selectedVehicle.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Engine</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">{selectedVehicle.specs.engine}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Power</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">{selectedVehicle.specs.hp}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Transmission</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">{selectedVehicle.specs.transmission}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            View Full Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleViewer360Enhanced;
