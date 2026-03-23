import { ResponsiveCarImage } from '../components/ResponsiveCarImage';
import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Wrench, Shield, Users, Award, ChevronDown, Zap, Fuel } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
// (useCounter and useAnimationOnScroll were used by removed helpers; not required here)
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ImageCarousel } from '../components/ImageCarousel';
import type { Vehicle, Testimonial } from '../types';
import { formatPrice } from '../utils/format';

import { carSlides } from '../data/carSlides';
import type { CarFocusCarouselHandle } from '../components/CarFocusCarouselLite';
import type { VehicleColor } from '../components/InteractiveColorCustomizer';
import { FilterAnimations } from '../components/FilterAnimations';

// CarFocusCarousel should mount immediately for autoplay and visibility — import directly
import CarFocusCarousel from '../components/CarFocusCarouselLite';
const MorphingShapeTransition = lazy(() => import('../components/MorphingShapeTransition').then(m => ({ default: m.MorphingShapeTransition })));
const AnimatedComparisonSlider = lazy(() => import('../components/AnimatedComparisonSlider').then(m => ({ default: m.AnimatedComparisonSlider })));
// Floating/background animations intentionally disabled on the homepage to keep it static and distraction-free.
const EnhancedFlipCard = lazy(() => import('../components/EnhancedFlipCard').then(m => ({ default: m.EnhancedFlipCard })));
const InteractiveColorCustomizer = lazy(() => import('../components/InteractiveColorCustomizer').then(m => ({ default: m.InteractiveColorCustomizer })));
const ComparisonSidebar = lazy(() => import('../components/ComparisonSidebar').then(m => ({ default: m.ComparisonSidebar })));
const ScrollTriggerCounter = lazy(() => import('../components/ScrollTriggerCounter').then(m => ({ default: m.ScrollTriggerCounter })));
import { LazySection } from '../components/LazySection';
import { PerformanceGauge } from '../components/PerformanceGauge';
const MotionVehicleFlipCard = lazy(() => import('../components/VehicleFlipCardMotion').then(m => ({ default: m.default })));

// ─── Only CarShowcase3D stays lazy (pulls in three.js ≈ 1 MB) ─────
const CarShowcase3D = lazy(() => import('../components/3d/CarShowcase3D'));

// 3D Showcase loading fallback
const CarShowcase3DFallback = () => (
  <div className="w-full h-dvh hero-fallback flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="spinner-red" />
      <p className="text-white/60 text-sm tracking-widest uppercase">Loading 3D Experience</p>
    </div>
  </div>
);

// ─── Lightweight Hero Fallback for low-end devices ────────────────
const LightweightHero = ({
  language,
  t,
}: {
  language: string;
  t: (key: string) => string;
}) => (
  <div className="relative h-dvh flex items-center justify-center overflow-hidden hero-lite-bg">
    {/* Static gradient overlay */}
    <div className="absolute inset-0 hero-lite-overlay" aria-hidden="true" />
    {/* Static car image */}
    <img
      src="https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=800&fm=webp"
      alt="Premium car showcase"
      className="absolute inset-0 w-full h-full object-cover opacity-30"
      loading="eager"
      decoding="async"
      width={800}
      height={600}
    />
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 hero-text-shadow">
        {language === 'en' ? 'Premium Cars in Rajshahi' : 'রাজশাহীতে প্রিমিয়াম গাড়ি'}
      </h1>
      <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
        {language === 'en'
          ? "North Bengal's most trusted premium car dealership since 2014."
          : 'উত্তরবঙ্গের সবচেয়ে বিশ্বস্ত প্রিমিয়াম গাড়ির শোরুম — ২০১৪ থেকে।'}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/inventory">
          <Button size="lg">{t('hero.browse')}<ArrowRight className="ml-2 h-5 w-5" /></Button>
        </Link>
        <Link to="/services">
          <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
            {t('hero.book_service')}
          </Button>
        </Link>
        <Link to="/sell">
          <Button size="lg" variant="secondary">{t('hero.sell')}</Button>
        </Link>
      </div>
    </div>
  </div>
);


// (Removed unused SmallPlaceholder and StatCard helpers to avoid including
// extra code in the initial bundle; they were not referenced anywhere.)

// ─── Vehicle Flip Card ─────────────────────────────────────────────
interface ShowcaseVehicle {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  engine: string;
  fuel: string;
  transmission: string;
  year: number;
  gradient: string;
  lightGradient: string;
  safetyRating: number;
  warrantyYears: number;
  mileage: string;
  emissions: string;
  horsepower: number;
  torque: string;
  efficiency: number;
  features: string[];
}
interface VehicleFlipCardProps {
  vehicle: ShowcaseVehicle;
  index: number;
  theme: string;
  language: string;
  isSelected: boolean;
  onSelect: () => void;
  flipTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  animate: boolean;
}
// Lightweight fallback flip card (CSS-only, no framer-motion)
const VehicleFlipCardFallback = ({ vehicle, index: _index, theme, language, isSelected, onSelect, flipTimeoutRef: _flipTimeoutRef, animate }: VehicleFlipCardProps) => (
  <div className={`relative h-32 cursor-pointer group ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} style={{ perspective: '1000px' }} onClick={onSelect}>
    <div className="relative w-full h-full">
      <div className={`absolute inset-0 rounded-xl p-4 flex items-center gap-4 bg-gradient-to-br ${theme === 'dark' ? vehicle.gradient : vehicle.lightGradient} shadow-lg`} style={{ backfaceVisibility: 'hidden' }}>
        <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
          <ResponsiveCarImage alt={vehicle.name} images={{ webp: vehicle.image.replace(/\.(jpg|jpeg|png)$/i, '.webp'), fallback: vehicle.image, width: 96, height: 80 }} className="w-full h-full object-cover" />
          <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-white/90 text-gray-800 rounded">{vehicle.year}</span>
          {vehicle.fuel === 'Hybrid' && <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-bold bg-green-500 text-white rounded">HYBRID</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base truncate">{vehicle.name}</h3>
          <p className="text-white/80 text-xs mt-0.5 truncate">{vehicle.subtitle}</p>
          <p className="text-white font-bold text-sm mt-2">{vehicle.price}</p>
        </div>
        {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />}
        {animate && <div className="absolute bottom-2 right-2 text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">{language === 'en' ? 'Hover to see specs →' : 'স্পেক দেখতে হোভার করুন →'}</div>}
      </div>
    </div>
  </div>
);

// ─── Showcase vehicle data ─────────────────────────────────────────
const SHOWCASE_VEHICLES = (language: string): ShowcaseVehicle[] => [
  {
    id: 'prado', name: language === 'en' ? 'Toyota Prado' : 'টয়োটা প্রাডো',
    subtitle: language === 'en' ? 'Premium 7-Seater SUV' : 'প্রিমিয়াম 7-সিটার এসইউভি',
    price: '৳ 72,00,000', image: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '2.7L V6', fuel: 'Petrol', transmission: 'Automatic', year: 2024,
    gradient: 'from-blue-600 to-blue-800', lightGradient: 'from-blue-500 to-blue-600',
    safetyRating: 5, warrantyYears: 3, mileage: '10.5', emissions: 'Euro 5', horsepower: 282, torque: '365 Nm', efficiency: 10.5,
    features: ['All-Wheel Drive', 'Sunroof', 'Leather Seats', 'Premium Sound'],
  },
  {
    id: 'harrier', name: language === 'en' ? 'Toyota Harrier' : 'টয়োটা হ্যারিয়ার',
    subtitle: language === 'en' ? 'Luxury Premium SUV' : 'বিলাসবহুল প্রিমিয়াম এসইউভি',
    price: '৳ 75,00,000', image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '2.5L Hybrid', fuel: 'Hybrid', transmission: 'CVT', year: 2024,
    gradient: 'from-purple-600 to-purple-800', lightGradient: 'from-purple-500 to-purple-600',
    safetyRating: 5, warrantyYears: 3, mileage: '17.5', emissions: 'Euro 6', horsepower: 246, torque: '313 Nm', efficiency: 17.5,
    features: ['Hybrid Technology', 'Panoramic Roof', 'Climate Control', 'Safety Suite'],
  },
  {
    id: 'crown', name: language === 'en' ? 'Toyota Crown RS' : 'টয়োটা ক্রাউন আরএস',
    subtitle: language === 'en' ? 'Executive Premium Sedan' : 'এক্সিকিউটিভ প্রিমিয়াম সেডান',
    price: '৳ 70,00,000', image: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '2.5L Hybrid', fuel: 'Hybrid', transmission: 'Automatic', year: 2024,
    gradient: 'from-red-600 to-red-800', lightGradient: 'from-red-500 to-red-600',
    safetyRating: 5, warrantyYears: 3, mileage: '16.8', emissions: 'Euro 6', horsepower: 248, torque: '300 Nm', efficiency: 16.8,
    features: ['Luxury Interior', 'Ambient Lighting', 'Premium Audio', 'Adaptive Suspension'],
  },
  {
    id: 'yaris', name: language === 'en' ? 'Toyota Yaris Cross' : 'টয়োটা ইয়ারিস ক্রস',
    subtitle: language === 'en' ? 'Compact Hybrid Crossover' : 'কম্পাক্ট হাইব্রিড ক্রসওভার',
    price: '৳ 38,00,000', image: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '1.5L Hybrid', fuel: 'Hybrid', transmission: 'CVT', year: 2023,
    gradient: 'from-amber-600 to-amber-800', lightGradient: 'from-amber-500 to-amber-600',
    safetyRating: 4, warrantyYears: 3, mileage: '20.3', emissions: 'Euro 5', horsepower: 120, torque: '196 Nm', efficiency: 20.3,
    features: ['Compact Size', 'Good Mileage', 'Modern Design', 'Smart Features'],
  },
  {
    id: 'chr', name: language === 'en' ? 'Toyota C-HR' : 'টয়োটা C-HR',
    subtitle: language === 'en' ? 'Stylish Compact SUV' : 'স্টাইলিশ কমপ্যাক্ট এসইউভি',
    price: '৳ 45,00,000', image: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '1.8L Hybrid', fuel: 'Hybrid', transmission: 'CVT', year: 2023,
    gradient: 'from-green-600 to-green-800', lightGradient: 'from-green-500 to-green-600',
    safetyRating: 4, warrantyYears: 3, mileage: '18.5', emissions: 'Euro 5', horsepower: 144, torque: '190 Nm', efficiency: 18.5,
    features: ['Bold Styling', 'AWD Option', 'Eco Mode', 'Compact Footprint'],
  },
  {
    id: 'premio', name: language === 'en' ? 'Toyota Premio' : 'টয়োটা প্রিমিও',
    subtitle: language === 'en' ? 'Fuel-Efficient Sedan' : 'জ্বালানি-দক্ষ সেডান',
    price: '৳ 40,00,000', image: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '1.5L Hybrid', fuel: 'Hybrid', transmission: 'CVT', year: 2023,
    gradient: 'from-pink-600 to-pink-800', lightGradient: 'from-pink-500 to-pink-600',
    safetyRating: 4, warrantyYears: 3, mileage: '21.5', emissions: 'Euro 5', horsepower: 110, torque: '172 Nm', efficiency: 21.5,
    features: ['Excellent Mileage', 'Affordable', 'Practical Design', 'Reliable Engine'],
  },
  {
    id: 'noah', name: language === 'en' ? 'Toyota Noah' : 'টয়োটা নোয়াহ',
    subtitle: language === 'en' ? 'Family MPV 8-Seater' : 'পারিবারিক এমপিভি 8-সিটার',
    price: '৳ 38,00,000', image: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
    engine: '1.8L Hybrid', fuel: 'Hybrid', transmission: 'CVT', year: 2023,
    gradient: 'from-cyan-600 to-cyan-800', lightGradient: 'from-cyan-500 to-cyan-600',
    safetyRating: 4, warrantyYears: 3, mileage: '18.2', emissions: 'Euro 5', horsepower: 144, torque: '190 Nm', efficiency: 18.2,
    features: ['8-Seater', 'Family-Friendly', 'Spacious Interior', 'Sliding Doors'],
  },
];

// ─── Carousel images map ───────────────────────────────────────────
const CAROUSEL_IMAGES: Record<string, { url: string; alt: string }[]> = {
  prado: [
    { url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Prado Front' },
    { url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Prado Side' },
  ],
  harrier: [{ url: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Harrier Front' }],
  crown: [{ url: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Crown Front' }],
  yaris: [
    { url: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Yaris Front' },
    { url: 'https://images.pexels.com/photos/36319316/pexels-photo-36319316.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Yaris Side' },
  ],
  chr: [
    { url: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'C-HR Front' },
    { url: 'https://images.pexels.com/photos/36324033/pexels-photo-36324033.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'C-HR Side' },
  ],
  premio: [{ url: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Premio Front' }],
  noah: [{ url: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Noah Front' }],
};

// ─── Fade-in wrapper — zero-dependency implementation using IntersectionObserver
// Replaces dynamic framer-motion import to avoid runtime errors and keep initial bundle small.
const FadeIn = ({ children, delay = 0, animate, className = '' }: { children: React.ReactNode; delay?: number; animate: boolean; className?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState<boolean>(!animate);

  useEffect(() => {
    if (!animate) { setInView(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // small delay support (seconds)
          const timeout = setTimeout(() => setInView(true), Math.max(0, Math.floor(delay * 1000)));
          obs.disconnect();
          return () => clearTimeout(timeout);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate, delay]);

  return (
    <div
      ref={ref}
      className={`${className} transform transition-all duration-500 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {children}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export const HomePage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const device = useDeviceCapability();

  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showcaseVehicle, setShowcaseVehicle] = useState<keyof typeof CAROUSEL_IMAGES>('prado');
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>(undefined);
  const [comparisonVehicles, setComparisonVehicles] = useState<Vehicle[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedVehicleColor, setSelectedVehicleColor] = useState<VehicleColor | null>(null);
  const [filteredResultCount, setFilteredResultCount] = useState(450);

  const carouselRef = useRef<CarFocusCarouselHandle>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animate = device.supportsRichAnimations;
  const showcaseVehicles = SHOWCASE_VEHICLES(language);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedVehicles();
    fetchTestimonials();
    return () => { if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current); };
  }, []);

  const scrollToContent = () => {
    carouselSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchFeaturedVehicles = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, images:vehicle_images(*)')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(6);
      if (error) {
        console.warn('fetchFeaturedVehicles supabase error:', error);
        setFeaturedVehicles([]);
        return;
      }
      if (data) setFeaturedVehicles(data);
    } catch (err) {
      // Network or import errors — fail gracefully
       
      console.warn('fetchFeaturedVehicles failed:', err);
      setFeaturedVehicles([]);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .limit(3);
      if (error) {
        console.warn('fetchTestimonials supabase error:', error);
        setTestimonials([]);
        return;
      }
      if (data) setTestimonials(data);
    } catch (err) {
       
      console.warn('fetchTestimonials failed:', err);
      setTestimonials([]);
    }
  };

  const handleVehicleSelect = (vehicleId: typeof showcaseVehicle) => {
    setShowcaseVehicle(vehicleId);
    import('../utils/AudioManager').then(m => m.AudioManager.playVehicleSelect());
  };

  const handleCarSelect = (carId: string) => {
    // Open vehicle details page (inventory context) instead of showing in the carousel
    // This navigates to the vehicle details page which includes a "Back to Inventory" link.
    // Navigate to the inventory page and request the item to be opened in the drawer
    navigate(`/inventory?open=${encodeURIComponent(carId)}`);
  };

  const handleAddToComparison = (vehicle: Vehicle) => {
    if (!comparisonVehicles.find(v => v.id === vehicle.id)) {
      setComparisonVehicles(prev => [...prev, vehicle]);
      setShowComparison(true);
      import('../utils/AudioManager').then(m => m.AudioManager.playClick());
    }
  };

  const handleRemoveFromComparison = (vehicleId: string) => {
    setComparisonVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const handleExportComparison = () => {
    const text = comparisonVehicles.map(v => `${v.model}\n${v.price.toLocaleString()}\n`).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
      download: 'vehicle_comparison.txt',
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    let count = 450;
    if (filters.bodyType?.length) count = Math.max(100, 450 - filters.bodyType.length * 50);
    if (filters.fuelType?.length) count = Math.max(50, count - filters.fuelType.length * 30);
    if (filters.priceRange?.length) count = Math.max(20, count - filters.priceRange.length * 60);
    setFilteredResultCount(count);
  };

  // Color customizer colors (extracted to avoid repetition)
  const vehicleColors: Record<string, VehicleColor[]> = {
    prado: [
      { name: 'Pearl White', hex: '#F5F5F5', rgb: '245,245,245', filterClass: 'brightness(1.1) saturate(0.8)', image: `${import.meta.env.BASE_URL}customize-cars/prado/white.webp` },
      { name: 'Black Metallic', hex: '#1A1A1A', rgb: '26,26,26', filterClass: 'brightness(0.7) contrast(1.2)', image: `${import.meta.env.BASE_URL}customize-cars/prado/black.webp` },
      { name: 'Steel Blue', hex: '#4A6FA5', rgb: '74,111,165', filterClass: 'hue-rotate(200deg) saturate(1.2)', image: `${import.meta.env.BASE_URL}customize-cars/prado/blue.webp` },
      { name: 'Crimson Red', hex: '#DC143C', rgb: '220,20,60', filterClass: 'hue-rotate(-30deg) saturate(1.3)', image: `${import.meta.env.BASE_URL}customize-cars/prado/red.webp` },
      { name: 'Forest Green', hex: '#228B22', rgb: '34,139,34', filterClass: 'hue-rotate(120deg) saturate(1.1)', image: `${import.meta.env.BASE_URL}customize-cars/prado/green.webp` },
      { name: 'Gold', hex: '#FFD700', rgb: '255,215,0', filterClass: 'hue-rotate(40deg) saturate(1.4)', image: `${import.meta.env.BASE_URL}customize-cars/prado/gold.webp` },
    ],
    harrier: [
      { name: 'Pearl White', hex: '#F5F5F5', rgb: '245,245,245', filterClass: 'brightness(1.1) saturate(0.8)', image: `${import.meta.env.BASE_URL}customize-cars/harrier/pearl.webp` },
      { name: 'Black Metallic', hex: '#1A1A1A', rgb: '26,26,26', filterClass: 'brightness(0.7) contrast(1.2)', image: `${import.meta.env.BASE_URL}customize-cars/harrier/black.webp` },
      { name: 'Silver', hex: '#C0C0C0', rgb: '192,192,192', filterClass: 'brightness(1) saturate(0.5)', image: `${import.meta.env.BASE_URL}customize-cars/harrier/silver.webp` },
      { name: 'Midnight Purple', hex: '#2D1B4E', rgb: '45,27,78', filterClass: 'hue-rotate(280deg) saturate(1.2)', image: `${import.meta.env.BASE_URL}customize-cars/harrier/purple.webp` },
      { name: 'Steel Blue', hex: '#0066CC', rgb: '0,102,204', filterClass: 'hue-rotate(200deg) saturate(1.1)', image: `${import.meta.env.BASE_URL}customize-cars/harrier/blue.webp` },
      { name: 'Charcoal Grey', hex: '#36454F', rgb: '54,69,79', filterClass: 'brightness(0.85) saturate(0.6)', image: `${import.meta.env.BASE_URL}customize-cars/harrier/grey.webp` },
    ],
    crown: [
      { name: 'Pearl White', hex: '#F5F5F5', rgb: '245,245,245', filterClass: 'brightness(1.1) saturate(0.8)', image: `${import.meta.env.BASE_URL}customize-cars/crown/pearl.webp` },
      { name: 'Midnight Black', hex: '#0D0D0D', rgb: '13,13,13', filterClass: 'brightness(0.5) contrast(1.3)', image: `${import.meta.env.BASE_URL}customize-cars/crown/black.webp` },
      { name: 'Burgundy Red', hex: '#800020', rgb: '128,0,32', filterClass: 'hue-rotate(-40deg) saturate(1.2)', image: `${import.meta.env.BASE_URL}customize-cars/crown/red.webp` },
      { name: 'Deep Blue', hex: '#00008B', rgb: '0,0,139', filterClass: 'hue-rotate(220deg) saturate(1.3)', image: `${import.meta.env.BASE_URL}customize-cars/crown/blue.webp` },
      { name: 'Titanium Grey', hex: '#A9ACB5', rgb: '169,172,181', filterClass: 'brightness(0.95) saturate(0.4)', image: `${import.meta.env.BASE_URL}customize-cars/crown/grey.webp` },
      { name: 'Champagne Gold', hex: '#F7E7CE', rgb: '247,231,206', filterClass: 'hue-rotate(30deg) saturate(1.2)', image: `${import.meta.env.BASE_URL}customize-cars/crown/silver.webp` },
    ],
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="relative h-dvh overflow-hidden">
          {device.supports3D ? (
            <Suspense fallback={<CarShowcase3DFallback />}>
              <CarShowcase3D
                ctaButtons={
                  <div className="flex flex-row flex-wrap gap-2 sm:gap-3 justify-center">
                    <Link to="/inventory">
                      <Button size="sm" className="text-xs sm:text-sm md:text-base md:px-6 md:py-3">
                        {t('hero.browse')}<ArrowRight className="ml-1.5 h-3.5 w-3.5 md:h-5 md:w-5" />
                      </Button>
                    </Link>
                    <Link to="/services">
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm md:text-base md:px-6 md:py-3 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white">
                        {t('hero.book_service')}
                      </Button>
                    </Link>
                    <Link to="/sell">
                      <Button size="sm" variant="secondary" className="text-xs sm:text-sm md:text-base md:px-6 md:py-3">
                        {t('hero.sell')}
                      </Button>
                    </Link>
                    </div>
                }
              />
            </Suspense>
          ) : (
            <LightweightHero language={language} t={t} />
          )}
          <button
            onClick={scrollToContent}
            aria-label="Scroll to content"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 z-10 hidden md:block"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </section>

        {/* ══ PREMIUM CAR FOCUS CAROUSEL (always-mounted for immediate autoplay) ════════════════════════════ */}
        <div ref={carouselSectionRef}>
          <CarFocusCarousel
            ref={carouselRef}
            initialCarId={selectedCarId}
            onCarChange={setSelectedCarId}
          />
        </div>

        {/* ══ PREMIUM COLLECTION GRID ═══════════════════════════════ */}
        <section className={`section-padding ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50'}`}>
          <div className="container-fluid">
            <FadeIn animate={animate} className="text-center mb-6">
              <span className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {language === 'en' ? 'Browse Our Collection' : 'আমাদের সংগ্রহ দেখুন'}
              </span>
              <h2 className={`heading-responsive font-bold mt-2 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Premium Collection' : 'প্রিমিয়াম সংগ্রহ'}
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' ? 'Click any vehicle to view in the showcase carousel above' : 'উপরের শোকেস ক্যারোসেলে দেখতে যেকোনো গাড়িতে ক্লিক করুন'}
              </p>
            </FadeIn>

            <div className="grid-auto-cards">
              {carSlides.map((car, index) => (
                <FadeIn key={car.id} animate={animate} delay={index * 0.04}>
                  <div
                    onClick={() => handleCarSelect(car.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleCarSelect(car.id)}
                    className={`car-card group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                      theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700 hover:border-blue-500/50'
                        : 'bg-white border border-gray-200 hover:border-blue-400'
                    } ${selectedCarId === car.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}
                  >
                    {selectedCarId === car.id && (
                      <div className="absolute top-2 right-2 z-10 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    )}
                    <div className="relative car-card-img overflow-hidden">
                      <ResponsiveCarImage
                        alt={`${car.brand} ${car.model}`}
                        images={{ webp: car.image.replace(/\.(jpg|jpeg|png)$/i, '.webp'), fallback: car.image, width: 320, height: 160 }}
                        className="w-full h-full object-cover car-img-hover"
                      />
                    </div>
                    <div className="p-3">
                      <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{car.brand} {car.model}</p>
                      <p className={`text-xs font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{car.price}</p>
                    </div>
                    <div className={`overlay-hover absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'
                    }`}>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                        {language === 'en' ? 'View in Inventory' : 'ইনভেন্টরিতে দেখুন'}
                      </span>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURED VEHICLES (flip cards) ════════════════════════ */}
        <LazySection minHeight="400px" rootMargin="300px">
          <section className={`section-padding relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-900'}`}>
            {/* Background animations removed from homepage (dark-mode friendly) */}

            <div className="container-fluid relative z-10">
              <FadeIn animate={animate} className="text-center mb-6">
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  {language === 'en' ? 'Interactive Showcase' : 'ইন্টারঅ্যাক্টিভ প্রদর্শনী'}
                </span>
                <h2 className="heading-responsive font-bold mt-2 mb-4 text-white drop-shadow-lg">
                  {language === 'en' ? 'Featured Vehicles' : 'বৈশিষ্ট্যযুক্ত গাড়ি'}
                </h2>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {carSlides.slice(0, 3).map(car => (
                  <div key={car.id} className="w-full flex justify-center">
                    <EnhancedFlipCard
                      frontContent={
                        <div className="flex flex-col h-full">
                          <ResponsiveCarImage
                            alt={car.model}
                            images={{ webp: car.image.replace(/\.(jpg|jpeg|png)$/i, '.webp'), fallback: car.image, width: 320, height: 160 }}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <h3 className="text-xl font-bold mb-2 text-white">{car.brand} {car.model}</h3>
                          <p className="text-sm mb-2 text-gray-300">{car.year} • {car.bodyType}</p>
                          <p className="text-lg font-bold mt-auto text-green-400">{car.price}</p>
                        </div>
                      }
                      backContent={
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-white">{language === 'en' ? 'Specifications' : 'স্পেসিফিকেশন'}</h3>
                          <div className="space-y-2">
                            {[
                              [language === 'en' ? 'Engine' : 'ইঞ্জিন', car.features[0]],
                              [language === 'en' ? 'Type' : 'টাইপ', car.bodyType],
                              [language === 'en' ? 'Color' : 'রঙ', car.color],
                              [language === 'en' ? 'Year' : 'সন', car.year],
                              [language === 'en' ? 'Features' : 'বৈশিষ্ট্য', car.features[1]],
                              [language === 'en' ? 'Price' : 'মূল্য', <span className="text-green-400">{car.price}</span>],
                            ].map(([label, val]) => (
                              <div key={String(label)} className="flex justify-between text-sm text-gray-300">
                                <span>{label}</span>
                                <span className="font-semibold">{val}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors touch-target"
                            onClick={() => handleAddToComparison(car as unknown as Vehicle)}
                          >
                            {language === 'en' ? 'Add to Comparison' : 'তুলনায় যুক্ত করুন'}
                          </button>
                        </div>
                      }
                      theme={theme}
                      autoFlipDelay={animate ? 3500 : 0}
                      onFlipChange={(isFlipped: boolean) => {
                        if (isFlipped && animate) import('../utils/AudioManager').then(m => m.AudioManager.playVehicleSelect());
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </LazySection>

        {/* ══ FEATURED VEHICLES (DB) ════════════════════════════════ */}
        {featuredVehicles.length > 0 && (
          <section className={`section-padding ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50'}`}>
            <div className="container-fluid">
              <FadeIn animate={animate} className="text-center mb-8">
                <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Featured Vehicles' : 'বৈশিষ্ট্যযুক্ত গাড়ি'}
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredVehicles.map((vehicle, index) => (
                  <FadeIn key={vehicle.id} animate={animate} delay={index * 0.1}>
                    <Link to={`/vehicle/${vehicle.id}`}>
                      <Card className={`overflow-hidden cursor-pointer transition-all ${theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'}`}>
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={encodeURI(vehicle.images?.[0]?.image_url || 'https://images.pexels.com/photos/3964962/pexels-photo-3964962.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp')}
                            alt={vehicle.model}
                            className="w-full h-full object-contain car-img-hover transition-transform duration-300 hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            width={400}
                            height={256}
                          />
                        </div>
                        <div className="p-6">
                          <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'en' ? (vehicle.description_en || vehicle.model) : (vehicle.description_bn || vehicle.model)}
                          </h3>
                          <div className={`flex items-center justify-between mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span>{vehicle.year}</span>
                            <span>{formatPrice(vehicle.price)}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ FILTER / SORT ════════════════════════════════════════ */}
        <section className={`section-padding relative overflow-hidden ${
          theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'
        }`}>
          <div className="container-fluid">
            <FadeIn animate={animate} className="text-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Find Your Perfect Vehicle' : 'আপনার নিখুঁত গাড়ি খুঁজুন'}
              </h2>
            </FadeIn>
            <FilterAnimations
              filters={[
                {
                  name: language === 'en' ? 'Price Range' : 'মূল্য পরিসীমা',
                  key: 'priceRange',
                  options: [
                    { id: 'budget', label: language === 'en' ? 'Under ৳20L' : '৳20L এর নিচে' },
                    { id: 'mid', label: '৳20L - ৳40L' },
                    { id: 'premium', label: '৳40L - ৳60L' },
                    { id: 'luxury', label: '৳60L+' },
                  ],
                },
                {
                  name: language === 'en' ? 'Body Type' : 'বডি টাইপ',
                  key: 'bodyType',
                  options: [
                    { id: 'sedan', label: language === 'en' ? 'Sedan' : 'সেডান' },
                    { id: 'suv', label: 'SUV' },
                    { id: 'crossover', label: language === 'en' ? 'Crossover' : 'ক্রসওভার' },
                    { id: 'mpv', label: language === 'en' ? 'MPV/Van' : 'এমপিভি/ভ্যান' },
                  ],
                },
                {
                  name: language === 'en' ? 'Fuel Type' : 'জ্বালানির ধরন',
                  key: 'fuelType',
                  options: [
                    { id: 'petrol', label: language === 'en' ? 'Petrol' : 'পেট্রোল' },
                    { id: 'diesel', label: language === 'en' ? 'Diesel' : 'ডিজেল' },
                    { id: 'hybrid', label: language === 'en' ? 'Hybrid' : 'হাইব্রিড' },
                  ],
                },
              ]}
              onFilterChange={handleFilterChange}
              resultCount={filteredResultCount}
              theme={theme}
              language={language}
            />
          </div>
        </section>

        {/* ══ CAROUSEL SHOWCASE + FLIP CARDS ═══════════════════════ */}
        <LazySection minHeight="600px" rootMargin="200px">
          <section className={`section-padding relative overflow-hidden ${
            theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}>
            {/* Background animations removed from homepage (particles/parallax disabled) */}

            <div className="container-fluid relative z-10">
              <FadeIn animate={animate} className="text-center mb-8">
                <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Explore Our Premium Collection' : 'আমাদের প্রিমিয়াম সংগ্রহ অন্বেষণ করুন'}
                </h2>
              </FadeIn>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: carousel */}
                <FadeIn animate={animate}>
                  <div className="relative w-full max-w-md mx-auto">
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      theme === 'dark' ? 'from-blue-900/20 to-purple-900/20' : 'from-blue-200/30 to-purple-200/30'
                    } rounded-3xl blur-2xl`} />
                    <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${
                      theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300/50'
                    }`}>
                      <ImageCarousel
                        images={CAROUSEL_IMAGES[showcaseVehicle] || CAROUSEL_IMAGES.prado}
                        autoPlay={!device.isLowEnd}
                        autoPlayInterval={4000}
                        showIndicators
                        showArrows
                        height="h-64 sm:h-80 md:h-96"
                      />
                    </div>

                    {/* Vehicle selector chips */}
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {(['prado','harrier','crown','yaris','chr','premio','noah'] as const).map(id => (
                        <button
                          key={id}
                          onClick={() => handleVehicleSelect(id)}
                          className={`px-3 py-1.5 rounded-full font-semibold transition-all text-xs sm:text-sm ${
                            showcaseVehicle === id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {id.charAt(0).toUpperCase() + id.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                {/* Right: flip cards */}
                <div className="space-y-3">
                  {showcaseVehicles.map((vehicle, index) => (
                    animate ? (
                      <Suspense key={vehicle.id} fallback={<div className="h-32" />}>
                        <MotionVehicleFlipCard
                          vehicle={vehicle}
                          index={index}
                          theme={theme}
                          language={language}
                          isSelected={showcaseVehicle === vehicle.id}
                          onSelect={() => handleVehicleSelect(vehicle.id as typeof showcaseVehicle)}
                          flipTimeoutRef={flipTimeoutRef}
                          animate={animate}
                        />
                      </Suspense>
                    ) : (
                      <VehicleFlipCardFallback
                        key={vehicle.id}
                        vehicle={vehicle}
                        index={index}
                        theme={theme}
                        language={language}
                        isSelected={showcaseVehicle === vehicle.id}
                        onSelect={() => handleVehicleSelect(vehicle.id as typeof showcaseVehicle)}
                        flipTimeoutRef={flipTimeoutRef}
                        animate={animate}
                      />
                    )
                  ))}
                </div>
              </div>

              <FadeIn animate={animate} className="text-center mt-12">
                <Link to="/inventory">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    {language === 'en' ? 'View All Vehicles' : 'সমস্ত গাড়ি দেখুন'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </section>
        </LazySection>

        {/* ══ COLOR CUSTOMIZER ══════════════════════════════════════ */}
        <LazySection minHeight="400px" rootMargin="200px">
          <section className={`section-padding ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'}`}>
            <div className="container-fluid">
              <FadeIn animate={animate} className="text-center mb-8">
                <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Personalize Your Vehicle' : 'আপনার গাড়ি ব্যক্তিগতকৃত করুন'}
                </h2>
              </FadeIn>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {(['prado','harrier','crown'] as const).map((model, i) => {
                  const imgs: Record<string, string> = {
                    prado: `${import.meta.env.BASE_URL}customize-cars/prado/white.webp`,
                    harrier: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    crown: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                  };
                  return (
                    <FadeIn key={model} animate={animate} delay={i * 0.1}>
                      <InteractiveColorCustomizer
                        vehicleImage={imgs[model]}
                        vehicleModel={model}
                        availableColors={vehicleColors[model]}
                        theme={theme}
                        language={language}
                        onColorSelect={(color: VehicleColor) => {
                          setSelectedVehicleColor(color);
                          import('../utils/AudioManager').then(m => m.AudioManager.playClick());
                        }}
                      />
                    </FadeIn>
                  );
                })}
              </div>

              {selectedVehicleColor && (
                <div className={`mt-8 p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {language === 'en'
                      ? `Selected: ${selectedVehicleColor.name}. Your preference has been saved.`
                      : `নির্বাচিত: ${selectedVehicleColor.name}। আপনার পছন্দ সংরক্ষিত হয়েছে।`}
                  </p>
                </div>
              )}
            </div>
          </section>
        </LazySection>

        {/* ══ MORPHING (only on capable devices) ═══════════════════ */}
        {device.supportsRichAnimations && (
          <LazySection minHeight="400px" rootMargin="200px">
            <section className={`section-padding ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
              <div className="container-fluid">
                <FadeIn animate={animate} className="text-center mb-8">
                  <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Morphing Showcase' : 'আকৃতি-পরিবর্তনকারী শোকেস'}
                  </h2>
                </FadeIn>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <MorphingShapeTransition
                    images={[
                      { src: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota Prado' },
                      { src: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota Harrier' },
                      { src: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota Crown' },
                      { src: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota Yaris' },
                    ]}
                    shapes="blob"
                    theme={theme}
                    language={language}
                  />
                  <MorphingShapeTransition
                    images={[
                      { src: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota Premio' },
                      { src: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota C-HR' },
                      { src: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Toyota Noah' },
                      { src: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp', name: 'Premium SUV' },
                    ]}
                    shapes="diamond"
                    theme={theme}
                    language={language}
                  />
                </div>
              </div>
            </section>
          </LazySection>
        )}

        {/* ══ COUNTERS ══════════════════════════════════════════════ */}
        <section className={`section-padding ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'}`}>
          <div className="container-fluid">
            <FadeIn animate={animate} className="text-center mb-8">
              <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Why Choose Us' : 'কেন আমাদের বেছে নিন'}
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollTriggerCounter targetValue={450} label={language === 'en' ? 'Premium Vehicles in Stock' : 'স্টকে প্রিমিয়াম গাড়ি'} suffix="+" icon={Car} theme={theme} duration={animate ? 2.5 : 0} />
              <ScrollTriggerCounter targetValue={8500} label={language === 'en' ? 'Happy Customers Served' : 'খুশি গ্রাহক সেবা'} suffix="+" icon={Users} theme={theme} duration={animate ? 2.5 : 0} />
              <ScrollTriggerCounter targetValue={25} label={language === 'en' ? 'Years of Excellence' : 'উৎকর্ষতার বছর'} suffix="+" icon={Award} theme={theme} duration={animate ? 2.5 : 0} />
            </div>
          </div>
        </section>

        {/* ══ COMPARISON SLIDER (only on capable devices) ══════════ */}
        {device.supportsRichAnimations && (
          <section className={`section-padding ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
            <div className="container-fluid">
              <FadeIn animate={animate} className="text-center mb-8">
                <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Standard vs Premium' : 'স্ট্যান্ডার্ড বনাম প্রিমিয়াম'}
                </h2>
              </FadeIn>
              <AnimatedComparisonSlider
                standardImage="https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
                premiumImage={`${import.meta.env.BASE_URL}customize-cars/harrier/pearl.webp`}
                standardModel={language === 'en' ? 'Harrier Standard' : 'হ্যারিয়ার স্ট্যান্ডার্ড'}
                premiumModel={language === 'en' ? 'Harrier Premium' : 'হ্যারিয়ার প্রিমিয়াম'}
                specs={[
                  { label: language === 'en' ? 'Engine' : 'ইঞ্জিন', standard: '2.5L Petrol', premium: '2.5L Hybrid', isNew: true, highlight: true },
                  { label: language === 'en' ? 'Fuel Efficiency' : 'জ্বালানি দক্ষতা', standard: '12.5 km/l', premium: '17.5 km/l', isNew: true, highlight: true },
                  { label: language === 'en' ? 'Horsepower' : 'হর্সপাওয়ার', standard: '206 HP', premium: '246 HP', isNew: true },
                  { label: language === 'en' ? 'Safety' : 'নিরাপত্তা', standard: '6 Airbags', premium: '8 Airbags + ABS', isNew: true },
                  { label: language === 'en' ? 'Warranty' : 'ওয়ারেন্টি', standard: '2 Years', premium: '3 Years Extended', isNew: true },
                ]}
                theme={theme}
                language={language}
              />
            </div>
          </section>
        )}

        {/* ══ PERFORMANCE METRICS ═══════════════════════════════════ */}
        <section className={`section-padding ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
          <div className="container-fluid">
            <FadeIn animate={animate} className="text-center mb-8">
              <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Performance Overview' : 'পারফরম্যান্স ওভারভিউ'}
              </h2>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: language === 'en' ? 'Horsepower' : 'হর্সপাওয়ার', values: { prado:282,harrier:246,crown:248,yaris:120,chr:144,premio:110,noah:144 }, icon: <Zap className="w-6 h-6" />, color: 'text-orange-500' },
                { label: language === 'en' ? 'Fuel Efficiency' : 'জ্বালানি দক্ষতা', values: { prado:10,harrier:17,crown:16,yaris:20,chr:18,premio:21,noah:18 }, icon: <Fuel className="w-6 h-6" />, color: 'text-green-500', unit: 'km/l' },
                { label: language === 'en' ? 'Safety Rating' : 'সেফটি রেটিং', values: { prado:5,harrier:5,crown:5,yaris:4,chr:4,premio:4,noah:4 }, icon: <Shield className="w-6 h-6" />, color: 'text-blue-500', unit: '/5' },
                { label: language === 'en' ? 'Value Rating' : 'মূল্য রেটিং', values: { prado:95,harrier:92,crown:90,yaris:88,chr:85,premio:90,noah:87 }, icon: <Award className="w-6 h-6" />, color: 'text-purple-500' },
              ].map((metric, index) => (
                <FadeIn key={index} animate={animate} delay={index * 0.1}>
                  <PerformanceGauge
                    label={metric.label}
                    value={(metric.values as Record<string, number>)[showcaseVehicle] ?? 100}
                    icon={metric.icon}
                    color={metric.color}
                    unit={metric.unit ?? ''}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY CHOOSE US ═════════════════════════════════════════ */}
        <section className={`section-padding ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white'}`}>
          <div className="container-fluid">
            <FadeIn animate={animate} className="text-center mb-8">
              <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Why Choose Auto Spark BD?' : 'কেন অটো স্পার্ক বিডি?'}
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Car, title: language === 'en' ? 'Premium Selection' : 'প্রিমিয়াম নির্বাচন', desc: language === 'en' ? 'Carefully curated luxury and premium vehicles' : 'সাবধানে নির্বাচিত বিলাসবহুল গাড়ির সংগ্রহ' },
                { icon: Shield, title: language === 'en' ? 'Quality Assurance' : 'মান নিশ্চিতকরণ', desc: language === 'en' ? 'Thorough inspection and certification for every vehicle' : 'প্রতিটি গাড়ির জন্য পুঙ্খানুপুঙ্খ পরিদর্শন' },
                { icon: Wrench, title: language === 'en' ? 'Expert Service' : 'বিশেষজ্ঞ সেবা', desc: language === 'en' ? 'State-of-the-art service center with experienced technicians' : 'অভিজ্ঞ প্রযুক্তিবিদদের সাথে অত্যাধুনিক সার্ভিস সেন্টার' },
              ].map((f, i) => (
                <FadeIn key={i} animate={animate} delay={i * 0.1}>
                  <Card className={`p-8 text-center ${theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'} transition-shadow`}>
                    <f.icon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{f.desc}</p>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
        {testimonials.length > 0 && (
          <section className={`section-padding ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50'}`}>
            <div className="container-fluid">
              <FadeIn animate={animate} className="text-center mb-6">
                <h2 className={`heading-responsive font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'What Our Customers Say' : 'আমাদের গ্রাহকরা কি বলেন'}
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any, index: number) => (
                  <FadeIn key={testimonial.id} animate={animate} delay={index * 0.1}>
                    <Card className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_: unknown, i: number) => (
                          <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {language === 'en' ? testimonial.review_en : testimonial.review_bn || testimonial.review_en}
                      </p>
                      <div className="flex items-center">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
                          {testimonial.customer_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {language === 'en' ? testimonial.customer_name : testimonial.customer_name_bn || testimonial.customer_name}
                          </div>
                          {testimonial.vehicle_purchased && (
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.vehicle_purchased}</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ MAPS ══════════════════════════════════════════════════ */}
        <section className="section-padding bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container-fluid">
            <FadeIn animate={animate} className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {language === 'en' ? 'Visit Our Showroom' : 'আমাদের শোরুম পরিদর্শন করুন'}
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Address + hours */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: '📍',
                    title: language === 'en' ? 'Address' : 'ঠিকানা',
                    content: 'AutoSpark — Station Road, Near Shuvo Petroleum, Sheroil, Ghoramara, Boalia, Rajshahi 6207',
                  },
                  {
                    icon: '🕐',
                    title: language === 'en' ? 'Business Hours' : 'ব্যবসায়িক সময়',
                    content: `${language === 'en' ? 'Mon–Fri' : 'সোম–শুক্র'}: 9AM–6PM | ${language === 'en' ? 'Sat' : 'শনি'}: 10AM–5PM`,
                  },
                  {
                    icon: '📞',
                    title: language === 'en' ? 'Contact' : 'যোগাযোগ',
                    content: '+880 1760-401605 | autosparkbd@gmail.com',
                  },
                ].map(card => (
                  <div key={card.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{card.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{card.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href="https://www.google.com/maps/place/Auto+Spark/@24.3744264,88.6135805,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl text-center hover:opacity-90 transition-opacity"
                >
                  📍 {language === 'en' ? 'Get Directions on Google Maps' : 'গুগল ম্যাপে দিকনির্দেশনা পান'}
                </a>
              </div>

              {/* Map embed — loaded lazily */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[350px] sm:min-h-[400px]">
                <iframe
                  title="Auto Spark Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.7574123456!2d88.6135805!3d24.3744264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbeffd47dfded9%3A0x46c8c45692f9a6c1!2sAuto%20Spark!5e0!3m2!1sen!2sbd!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '350px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Dual maps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.3846758707845!2d88.60447931496736!3d24.374532984292816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefa96a38d031%3A0x10f93a950ed6b5f9!2sStation%20Road%2C%20Rajshahi!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Showroom map"
                />
                <p className="text-center text-sm font-semibold py-2 bg-white dark:bg-gray-800">
                  {language === 'en' ? 'Showroom: Station Road, Rajshahi' : 'শোরুম: স্টেশন রোড, রাজশাহী'}
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.3846758707845!2d88.6346711!3d24.3817492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbf17f21c0ee57:0x373f79532c58e48a!2sAuto+Spark+Service+Center!5e0!3m2!1sen!2sbd!4v1709999999999"
                  width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Service center map"
                />
                <p className="text-center text-sm font-semibold py-2 bg-white dark:bg-gray-800">
                  {language === 'en' ? 'Service Center: Meherchandi, Rajshahi' : 'সার্ভিস সেন্টার: মেহেরচণ্ডী, রাজশাহী'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════ */}
        <section className="section-padding bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container-fluid text-center">
            <FadeIn animate={animate}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
                {language === 'en' ? 'Ready to Find Your Dream Car?' : 'আপনার স্বপ্নের গাড়ি খুঁজে পেতে প্রস্তুত?'}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {language === 'en' ? 'Browse our inventory or visit our showroom in Rajshahi.' : 'আমাদের ইনভেন্টরি ব্রাউজ করুন বা রাজশাহীতে আমাদের শোরুম পরিদর্শন করুন।'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/inventory">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                    {language === 'en' ? 'Browse Inventory' : 'ইনভেন্টরি ব্রাউজ করুন'}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    {language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ══ COMPARISON SIDEBAR ════════════════════════════════════ */}
        <Suspense fallback={null}>
          <ComparisonSidebar
          vehicles={comparisonVehicles.map(v => ({
            id: v.id,
            name: v.model,
            price: formatPrice(v.price),
            engine: v.engine_capacity || 'N/A',
            fuel: v.fuel_type || 'Petrol',
            transmission: v.transmission || 'Automatic',
          }))}
          isOpen={showComparison}
          onToggle={() => setShowComparison(p => !p)}
          onRemove={handleRemoveFromComparison}
          onExport={handleExportComparison}
          theme={theme}
          language={language}
        />
        </Suspense>
      </div>
  );
};
