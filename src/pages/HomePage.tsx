import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowRight, Car, Wrench, Shield, Users, Award, ChevronDown, Zap, Fuel } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCounter } from '../hooks/useCounter';
import { useAnimationOnScroll } from '../hooks/useAnimationOnScroll';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ImageCarousel } from '../components/ImageCarousel';
import type { Vehicle, Testimonial } from '../types';
import { formatPrice } from '../utils/format';

// ─── Direct imports ────────────────────────────────────────────────
// These components are small (<400 LOC each, ~3.2k total) and all share
// the same framer-motion dependency already in this chunk. Lazy-loading
// them provided zero bundle benefit but introduced fragile Suspense
// boundary requirements that caused React error #300 on scroll.
import CarFocusCarousel, { carSlides } from '../components/CarFocusCarousel';
import type { CarFocusCarouselHandle } from '../components/CarFocusCarousel';
import type { VehicleColor } from '../components/InteractiveColorCustomizer';
import { ParallaxBackground } from '../components/ParallaxBackground';
import { MorphingShapeTransition } from '../components/MorphingShapeTransition';
import { AnimatedComparisonSlider } from '../components/AnimatedComparisonSlider';
import { FilterAnimations } from '../components/FilterAnimations';
import { FloatingParticlesBackground } from '../components/FloatingParticlesBackground';
import { UnicornBackground } from '../components/UnicornBackground';
import { EnhancedFlipCard } from '../components/EnhancedFlipCard';
import { VehicleCardWithBadges } from '../components/VehicleCardWithBadges';
import { ComparisonDisplay } from '../components/ComparisonDisplay';
import { InteractiveColorCustomizer } from '../components/InteractiveColorCustomizer';
import { ComparisonSidebar } from '../components/ComparisonSidebar';
import { VehicleSpecCardBack } from '../components/VehicleSpecCardBack';
import { PerformanceGauge } from '../components/PerformanceGauge';
import { ScrollTriggerCounter } from '../components/ScrollTriggerCounter';
import { EnhancedSkeleton } from '../components/EnhancedSkeleton';
import { CarouselPlaceholder } from '../components/CarouselPlaceholder';
import { LazySection } from '../components/LazySection';

// ─── Only CarShowcase3D stays lazy (pulls in three.js ≈ 1 MB) ─────
const CarShowcase3D = lazy(() => import('../components/3d/CarShowcase3D'));

// 3D Showcase loading fallback
const CarShowcase3DFallback = () => (
  <div className="w-full h-dvh bg-gradient-to-b from-black via-[#0a0a0a] to-black flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-[#C00000] border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-white/60 text-sm tracking-widest uppercase">Loading 3D Experience</p>
    </div>
  </div>
);

// Extracted stat card — hooks MUST be at the top level of a component,
// never inside .map() or any loop/condition.
interface StatCardProps {
  value: number;
  label: string;
  icon: React.ElementType;
  index: number;
  theme: string;
}
const StatCard = ({ value, label, icon: Icon, index, theme }: StatCardProps) => {
  const { ref, isInView } = useAnimationOnScroll(0.1);
  const count = useCounter({ end: value, duration: 2000, shouldStart: isInView });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`text-center p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
    >
      <Icon className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {count}{value >= 100 ? '+' : ''}
      </div>
      <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{label}</div>
    </motion.div>
  );
};

// Extracted vehicle flip card — hooks MUST be at the top level of a component,
// never inside .map() or any loop/condition.
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
  flipTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}
const VehicleFlipCard = ({ vehicle, index, theme, language, isSelected, onSelect, flipTimeoutRef }: VehicleFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      key={vehicle.id}
      className={`relative h-32 cursor-pointer group ${
        isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      }`}
      style={{ perspective: '1000px' }}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={onSelect}
    >
      {/* Card Container - handles the flip with enhanced interaction */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={isFlipped ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onHoverStart={() => {
          setIsFlipped(true);
          if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
          flipTimeoutRef.current = setTimeout(() => setIsFlipped(false), 3000);
        }}
        onHoverEnd={() => {
          if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
          flipTimeoutRef.current = setTimeout(() => setIsFlipped(false), 500);
        }}
      >
        {/* FRONT FACE */}
        <div
          className={`absolute inset-0 rounded-xl p-4 flex items-center gap-4 bg-gradient-to-br ${
            theme === 'dark' ? vehicle.gradient : vehicle.lightGradient
          } shadow-lg`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover"
              loading="lazy"
              width={96}
              height={80}
              decoding="async"
            />
            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-white/90 text-gray-800 rounded">
              {vehicle.year}
            </span>
            {vehicle.fuel === 'Hybrid' && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-bold bg-green-500 text-white rounded">
                HYBRID
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">{vehicle.name}</h3>
            <p className="text-white/80 text-xs mt-0.5 truncate">{vehicle.subtitle}</p>
            <p className="text-white font-bold text-sm mt-2">{vehicle.price}</p>
          </div>
          {isSelected && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
          )}
          <div className="absolute bottom-2 right-2 text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            {language === 'en' ? 'Hover to see specs →' : 'স্পেক দেখতে হোভার করুন →'}
          </div>
        </div>

        {/* BACK FACE - Enhanced Vehicle Specs */}
        <VehicleSpecCardBack vehicle={vehicle} theme={theme} />
      </motion.div>
    </motion.div>
  );
};

export const HomePage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showcaseVehicle, setShowcaseVehicle] = useState<'prado' | 'yaris' | 'chr' | 'harrier' | 'crown' | 'premio' | 'noah'>('prado');
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>(undefined);
  const [comparisonVehicles, setComparisonVehicles] = useState<Vehicle[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedVehicleColor, setSelectedVehicleColor] = useState<VehicleColor | null>(null);
  const [filteredResultCount, setFilteredResultCount] = useState(450);
  // Artificial loading delays removed — content renders immediately for faster LCP
  const isLoadingImages = false;
  const isLoadingCards = false;

  const carouselRef = useRef<CarFocusCarouselHandle>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchFeaturedVehicles();
    fetchTestimonials();
    
    // Cleanup flip timeout on unmount
    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);

  const scrollToContent = () => {
    if (carouselSectionRef.current) {
      carouselSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchFeaturedVehicles = async () => {
    const { supabase } = await import('../lib/supabase');
    const { data } = await supabase
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(*)
      `)
      .eq('is_featured', true)
      .eq('is_available', true)
      .limit(6);

    if (data) setFeaturedVehicles(data);
  };

  const fetchTestimonials = async () => {
    const { supabase } = await import('../lib/supabase');
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .eq('is_featured', true)
      .limit(3);

    if (data) setTestimonials(data);
  };

  const handleVehicleSelect = (vehicleId: typeof showcaseVehicle) => {
    setShowcaseVehicle(vehicleId);
    import('../utils/AudioManager').then(m => m.AudioManager.playVehicleSelect());
  };

  // Handler for clicking on a car in the Premium Collection
  const handleCarSelect = (carId: string) => {
    setSelectedCarId(carId);
    // Use the ref to navigate to the specific car
    if (carouselRef.current) {
      carouselRef.current.goToCarById(carId);
    }
    // Scroll to the carousel section
    if (carouselSectionRef.current) {
      carouselSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleAddToComparison = (vehicle: Vehicle) => {
    if (!comparisonVehicles.find(v => v.id === vehicle.id)) {
      setComparisonVehicles([...comparisonVehicles, vehicle]);
      setShowComparison(true);
      import('../utils/AudioManager').then(m => m.AudioManager.playClick());
    }
  };

  const handleRemoveFromComparison = (vehicleId: string) => {
    setComparisonVehicles(comparisonVehicles.filter(v => v.id !== vehicleId));
  };

  const handleExportComparison = () => {
    const comparisonText = comparisonVehicles.map(v => 
      `${v.model}\n$${v.price.toLocaleString()}\n`
    ).join('\n');
    const blob = new Blob([comparisonText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle_comparison.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    // Calculate filtered result count based on filters
    // This is a mock calculation - in a real app, you'd filter actual data
    let count = 450;
    
    if (filters.bodyType?.length) {
      count = Math.max(100, 450 - filters.bodyType.length * 50);
    }
    if (filters.fuelType?.length) {
      count = Math.max(50, count - filters.fuelType.length * 30);
    }
    if (filters.priceRange?.length) {
      count = Math.max(20, count - filters.priceRange.length * 60);
    }
    
    setFilteredResultCount(count);
  };

  return (
    <MotionConfig reducedMotion="user">
    <motion.div 
      className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* HERO SECTION WITH 3D CAR SHOWCASE */}
      <section className="relative h-dvh overflow-hidden">
        {/* 3D Car Showcase - Interactive Experience */}
        <Suspense fallback={<CarShowcase3DFallback />}>
          <CarShowcase3D
            ctaButtons={
              <motion.div 
                className="flex flex-row gap-2 sm:gap-3 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <Link to="/inventory">
                  <Button size="sm" className="text-xs sm:text-sm md:text-base md:px-6 md:py-3">
                    {t('hero.browse')}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 md:h-5 md:w-5" />
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
              </motion.div>
            }
          />
        </Suspense>

        {/* Scroll hint — desktop only */}
        <motion.button
          onClick={scrollToContent}
          aria-label="Scroll to content"
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/40 z-10 hidden md:block"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </section>

      {/* PREMIUM CAR FOCUS CAROUSEL */}
      <LazySection minHeight="500px" rootMargin="300px">
      <div ref={carouselSectionRef}>
        {isLoadingImages ? (
          <CarouselPlaceholder theme={theme} showLoadingText={true} />
        ) : (
          <CarFocusCarousel 
            ref={carouselRef} 
            initialCarId={selectedCarId}
            onCarChange={(carId) => setSelectedCarId(carId)}
          />
        )}
      </div>
      </LazySection>

      {/* PREMIUM COLLECTION - CLICKABLE CAR GRID */}
      <section className={`py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {language === 'en' ? 'Browse Our Collection' : 'আমাদের সংগ্রহ দেখুন'}
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Premium Collection' : 'প্রিমিয়াম সংগ্রহ'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Click on any vehicle to view it in the showcase carousel above' 
                : 'উপরের শোকেস ক্যারোসেলে দেখতে যেকোনো গাড়িতে ক্লিক করুন'}
            </p>
          </motion.div>

          {/* Car Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {carSlides.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCarSelect(car.id)}
                className={`cursor-pointer group relative overflow-hidden rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400'
                } transition-all duration-300 shadow-lg hover:shadow-xl ${
                  selectedCarId === car.id 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' 
                    : ''
                }`}
              >
                {/* Selected indicator */}
                {selectedCarId === car.id && (
                  <div className="absolute top-2 right-2 z-10 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                )}

                {/* Car Image */}
                <div className="relative h-32 md:h-40 overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={320}
                    height={160}
                    decoding="async"
                    fetchPriority="low"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    theme === 'dark' ? 'from-gray-800' : 'from-white'
                  } via-transparent to-transparent opacity-60`} />
                  
                  {/* Year badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full">
                    {car.year}
                  </span>
                </div>

                {/* Car Info */}
                <div className="p-3 md:p-4">
                  {/* Brand */}
                  <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {car.brand}
                  </p>
                  
                  {/* Model */}
                  <h3 className={`text-sm md:text-base font-bold mb-1 line-clamp-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {car.model}
                  </h3>
                  
                  {/* Body Type */}
                  <p className={`text-[10px] md:text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {car.bodyType}
                  </p>
                  
                  {/* Price */}
                  <p className={`text-xs md:text-sm font-bold ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {car.price}
                  </p>
                </div>

                {/* Hover overlay with "View" text */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                  }`}>
                    {language === 'en' ? 'View in Carousel' : 'ক্যারোসেলে দেখুন'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES WITH ENHANCED FLIP CARDS */}
      <LazySection minHeight="400px" rootMargin="300px">
      <section className={`py-8 md:py-12 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-900'}`}>
        {/* Unicorn Studio Animated Background - full section */}
        <div className="absolute inset-0 pointer-events-none">
          <UnicornBackground width="100%" height="100%" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              {language === 'en' ? 'Interactive Showcase' : 'ইন্টারঅ্যাক্টিভ প্রদর্শনী'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4 text-white drop-shadow-lg">
              {language === 'en' ? 'Featured Vehicles' : 'বৈশিষ্ট্যযুক্ত গাড়ি'}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-300">
              {language === 'en' 
                ? 'Experience our premium collection with interactive 3D flip cards. Click to flip and explore detailed specifications.'
                : 'ইন্টারঅ্যাক্টিভ 3D ফ্লিপ কার্ড দিয়ে আমাদের প্রিমিয়াম সংগ্রহ অনুভব করুন৷ বিস্তারিত স্পেসিফিকেশন অন্বেষণ করতে ক্লিক করুন।'}
            </p>
          </motion.div>

          {/* Featured vehicles grid */}
          {isLoadingCards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <EnhancedSkeleton variant="flip-card" count={3} theme={theme} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {carSlides.slice(0, 3).map((car) => (
                <EnhancedFlipCard
                  key={car.id}
                  frontContent={
                    <div className="flex flex-col h-full">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        loading="lazy"
                        width={400}
                        height={192}
                        decoding="async"
                        fetchPriority="low"
                      />
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm mb-2 text-gray-300">
                        {car.year} • {car.bodyType}
                      </p>
                      <p className="text-lg font-bold mt-auto text-green-400">
                        {car.price}
                      </p>
                    </div>
                  }
                  backContent={
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white">
                        {language === 'en' ? 'Specifications' : 'স্পেসিফিকেশন'}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>{language === 'en' ? 'Engine' : 'ইঞ্জিন'}</span>
                          <span className="font-semibold">{car.features[0]}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>{language === 'en' ? 'Type' : 'টাইপ'}</span>
                          <span className="font-semibold">{car.bodyType}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>{language === 'en' ? 'Color' : 'রঙ'}</span>
                          <span className="font-semibold">{car.color}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>{language === 'en' ? 'Year' : 'সন'}</span>
                          <span className="font-semibold">{car.year}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>{language === 'en' ? 'Features' : 'বৈশিষ্ট্য'}</span>
                          <span className="font-semibold">{car.features[1]}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>{language === 'en' ? 'Price' : 'মূল্য'}</span>
                          <span className="font-semibold text-green-400">{car.price}</span>
                        </div>
                      </div>
                      <motion.button
                        className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToComparison(car as any)}
                      >
                        {language === 'en' ? 'Add to Comparison' : 'তুলনায় যুক্ত করুন'}
                      </motion.button>
                    </div>
                  }
                  theme={theme}
                  autoFlipDelay={3500}
                  onFlipChange={(isFlipped) => {
                    if (isFlipped) {
                      import('../utils/AudioManager').then(m => m.AudioManager.playVehicleSelect());
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      </LazySection>

      {/* STATS SECTION WITH ANIMATED COUNTERS */}
      <motion.section 
        className={`py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'By The Numbers' : 'সংখ্যায়'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: 150, label: language === 'en' ? 'Vehicles' : 'গাড়ি', icon: Car },
              { value: 500, label: language === 'en' ? 'Happy Customers' : 'সন্তুষ্ট গ্রাহক', icon: Users },
              { value: 10, label: language === 'en' ? 'Years Experience' : 'বছরের অভিজ্ঞতা', icon: Award },
              { value: 98, label: language === 'en' ? 'Satisfaction %' : 'সন্তুষ্টি %', icon: Shield },
            ].map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                index={index}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* VEHICLE GALLERY WITH BADGES AND COMPARISON */}
      <section className={`py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {language === 'en' ? 'Find Your Perfect Match' : 'আপনার নিখুঁত ম্যাচ খুঁজুন'}
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Available Models' : 'উপলব্ধ মডেল'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Browse our premium collection with interactive badges. Add vehicles to compare side-by-side.' 
                : 'ইন্টারঅ্যাক্টিভ ব্যাজ সহ আমাদের প্রিমিয়াম সংগ্রহ ব্রাউজ করুন। পাশাপাশি তুলনা করতে গাড়ি যুক্ত করুন।'}
            </p>
          </motion.div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {carSlides.slice(0, 6).map((car, index) => {
              // Assign badges to vehicles
              let badge: 'best-value' | 'popular' | 'new-arrival' | 'limited-stock' | 'featured' | 'none' = 'none';
              if (index === 0) badge = 'best-value';
              else if (index === 1) badge = 'popular';
              else if (index === 2) badge = 'new-arrival';
              else if (index === 3) badge = 'limited-stock';
              else if (index === 4) badge = 'featured';

              return (
                <VehicleCardWithBadges
                  key={car.id}
                  id={car.id}
                  brand={car.brand}
                  model={car.model}
                  image={car.image}
                  price={car.price}
                  bodyType={car.bodyType}
                  badge={badge}
                  theme={theme}
                  language={language}
                  onCompare={(vehicleId) => {
                    const selectedVehicle = carSlides.find(c => c.id === vehicleId);
                    if (selectedVehicle) {
                      handleAddToComparison({
                        id: vehicleId,
                        title: selectedVehicle.model,
                        model: selectedVehicle.model,
                        price: selectedVehicle.price,
                      } as any);
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Comparison Display */}
          {comparisonVehicles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ComparisonDisplay
                vehicles={comparisonVehicles.map(v => ({
                  id: v.id,
                  name: v.model,
                  price: formatPrice(v.price),
                  specs: {
                    engine: { label: 'Engine', value: v.engine_capacity || '2.4L Petrol', highlight: false },
                    transmission: { label: 'Transmission', value: v.transmission || 'Automatic', highlight: false },
                    mileage: { label: 'Mileage', value: '14 km/l', highlight: true },
                    seating: { label: 'Seating', value: '5 Person', highlight: false },
                    power: { label: 'Power', value: '175 HP', highlight: false },
                  },
                }))}
                theme={theme}
                language={language}
                onRemove={handleRemoveFromComparison}
                onExport={handleExportComparison}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* FEATURED VEHICLES WITH CARD LIFT EFFECTS */}
      {featuredVehicles.length > 0 && (
        <motion.section 
          className={`py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Featured Vehicles' : 'বৈশিষ্ট্যযুক্ত গাড়ি'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/vehicle/${vehicle.id}`}>
                    <Card className={`overflow-hidden cursor-pointer transition-all ${theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'}`}>
                      <div className="relative h-64 overflow-hidden">
                        <motion.img
                          src={vehicle.images?.[0]?.image_url || 'https://images.pexels.com/photos/3964962/pexels-photo-3964962.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp'}
                          alt={vehicle.model}
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.3 }}
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
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {language === 'en' ? (vehicle.description_en || '') : (vehicle.description_bn || vehicle.description_en || '')}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* FEATURE 13: FILTER/SORT ANIMATIONS */}
      <motion.section
        className={`py-6 md:py-10 relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-white to-gray-50'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Find Your Perfect Vehicle' : 'আপনার নিখুঁত গাড়ি খুঁজুন'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'Use filters to narrow down your choices'
                : 'আপনার পছন্দ সীমিত করতে ফিল্টার ব্যবহার করুন'}
            </p>
          </motion.div>

          <FilterAnimations
            filters={[
              {
                name: language === 'en' ? 'Price Range' : 'মূল্য পরিসীমা',
                key: 'priceRange',
                options: [
                  { id: 'budget', label: language === 'en' ? 'Under ৳20L' : '৳20L এর নিচে' },
                  { id: 'mid', label: language === 'en' ? '৳20L - ৳40L' : '৳20L - ৳40L' },
                  { id: 'premium', label: language === 'en' ? '৳40L - ৳60L' : '৳40L - ৳60L' },
                  { id: 'luxury', label: language === 'en' ? '৳60L+' : '৳60L+' },
                ],
              },
              {
                name: language === 'en' ? 'Body Type' : 'বডি টাইপ',
                key: 'bodyType',
                options: [
                  { id: 'sedan', label: language === 'en' ? 'Sedan' : 'সেডান' },
                  { id: 'suv', label: language === 'en' ? 'SUV' : 'এসইউভি' },
                  { id: 'crossover', label: language === 'en' ? 'Crossover' : 'ক্রসওভার' },
                  { id: 'mpv', label: language === 'en' ? 'MPV/Van' : 'এমপিভি/ভ্যান' },
                  { id: 'coupe', label: language === 'en' ? 'Coupe' : 'কুপে' },
                ],
              },
              {
                name: language === 'en' ? 'Fuel Type' : 'জ্বালানির ধরন',
                key: 'fuelType',
                options: [
                  { id: 'petrol', label: language === 'en' ? 'Petrol' : 'পেট্রোল' },
                  { id: 'diesel', label: language === 'en' ? 'Diesel' : 'ডিজেল' },
                  { id: 'hybrid', label: language === 'en' ? 'Hybrid' : 'হাইব্রিড' },
                  { id: 'electric', label: language === 'en' ? 'Electric' : 'ইলেকট্রিক' },
                ],
              },
            ]}
            onFilterChange={handleFilterChange}
            resultCount={filteredResultCount}
            theme={theme}
            language={language}
          />
        </div>
      </motion.section>

      {/* CAROUSEL SHOWCASE WITH FLIP ANIMATIONS & PARALLAX */}
      <LazySection minHeight="600px" rootMargin="200px">
      <motion.section 
        className={`py-8 md:py-12 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* FEATURE 14: FLOATING PARTICLES BACKGROUND */}
        <FloatingParticlesBackground
          theme={theme}
          particleCount={15}
          intensity="subtle"
        />

        {/* Enhanced parallax background with floating elements */}
        <ParallaxBackground theme={theme} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Explore Our Premium Collection' : 'আমাদের প্রিমিয়াম সংগ্রহ অন্বেষণ করুন'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Stunning 360° views of each vehicle with interactive carousel' 
                : 'প্রতিটি গাড়ির অসাধারণ 360° ভিউ ইন্টারেক্টিভ ক্যারোসেলের সাথে'}
            </p>
          </motion.div>

          {/* Main Carousel with Flip Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Large carousel with curved styling */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Curved background frame */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-900/20 to-purple-900/20' : 'from-blue-200/30 to-purple-200/30'} rounded-3xl blur-2xl`} />
                
                {/* Main carousel container with curved styling */}
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300/50'} backdrop-blur-sm`}>
                  <ImageCarousel
                    images={
                      showcaseVehicle === 'prado' ? [
                        { url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Prado Front' },
                        { url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Prado Side' },
                        { url: 'https://images.pexels.com/photos/36318404/pexels-photo-36318404.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Prado Rear' },
                        { url: 'https://images.pexels.com/photos/36318405/pexels-photo-36318405.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Prado Back' },
                      ] : showcaseVehicle === 'yaris' ? [
                        { url: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Yaris Cross Front' },
                        { url: 'https://images.pexels.com/photos/36319316/pexels-photo-36319316.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Yaris Cross Side' },
                        { url: 'https://images.pexels.com/photos/36319315/pexels-photo-36319315.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Yaris Cross Rear' },
                        { url: 'https://images.pexels.com/photos/36319314/pexels-photo-36319314.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Yaris Cross Back' },
                      ] : showcaseVehicle === 'chr' ? [
                        { url: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'C-HR Front' },
                        { url: 'https://images.pexels.com/photos/36324033/pexels-photo-36324033.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'C-HR Side' },
                        { url: 'https://images.pexels.com/photos/36324031/pexels-photo-36324031.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'C-HR Rear' },
                        { url: 'https://images.pexels.com/photos/36324032/pexels-photo-36324032.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'C-HR Back' },
                      ] : showcaseVehicle === 'harrier' ? [
                        { url: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Harrier Front' },
                      ] : showcaseVehicle === 'crown' ? [
                        { url: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Crown Front' },
                      ] : showcaseVehicle === 'premio' ? [
                        { url: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Premio Front' },
                      ] : [
                        { url: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp', alt: 'Noah Front' },
                      ]
                    }
                    autoPlay={true}
                    autoPlayInterval={4000}
                    showIndicators={true}
                    showArrows={true}
                    height="h-96"
                  />
                </div>

                {/* Vehicle selector buttons - Scrollable for mobile */}
                <div className="flex gap-2 mt-6 justify-center flex-wrap">
                  <motion.button
                    onClick={() => handleVehicleSelect('prado')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'prado'
                        ? theme === 'dark' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-blue-500 text-white shadow-lg shadow-blue-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Prado
                  </motion.button>
                  <motion.button
                    onClick={() => handleVehicleSelect('harrier')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'harrier'
                        ? theme === 'dark' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-purple-500 text-white shadow-lg shadow-purple-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Harrier
                  </motion.button>
                  <motion.button
                    onClick={() => handleVehicleSelect('crown')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'crown'
                        ? theme === 'dark' ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' : 'bg-red-500 text-white shadow-lg shadow-red-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Crown
                  </motion.button>
                  <motion.button
                    onClick={() => handleVehicleSelect('yaris')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'yaris'
                        ? theme === 'dark' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/50' : 'bg-amber-500 text-white shadow-lg shadow-amber-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Yaris
                  </motion.button>
                  <motion.button
                    onClick={() => handleVehicleSelect('chr')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'chr'
                        ? theme === 'dark' ? 'bg-green-600 text-white shadow-lg shadow-green-500/50' : 'bg-green-500 text-white shadow-lg shadow-green-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    C-HR
                  </motion.button>
                  <motion.button
                    onClick={() => handleVehicleSelect('premio')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'premio'
                        ? theme === 'dark' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50' : 'bg-pink-500 text-white shadow-lg shadow-pink-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Premio
                  </motion.button>
                  <motion.button
                    onClick={() => handleVehicleSelect('noah')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'noah'
                        ? theme === 'dark' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50' : 'bg-cyan-500 text-white shadow-lg shadow-cyan-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Noah
                  </motion.button>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-300/30'}`}
                  animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className={`absolute -top-6 -right-6 w-32 h-32 rounded-full ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-300/30'}`}
                  animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Right side - Flip card gallery - SYNCED with carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                {/* Synced flip cards - matches carousel vehicles */}
                {[
                  {
                    id: 'prado',
                    name: language === 'en' ? 'Toyota Prado' : 'টয়োটা প্রাডো',
                    subtitle: language === 'en' ? 'Premium 7-Seater SUV' : 'প্রিমিয়াম 7-সিটার এসইউভি',
                    price: '৳ 72,00,000',
                    image: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '2.7L V6',
                    fuel: 'Petrol',
                    transmission: 'Automatic',
                    year: 2024,
                    gradient: 'from-blue-600 to-blue-800',
                    lightGradient: 'from-blue-500 to-blue-600',
                    safetyRating: 5,
                    warrantyYears: 3,
                    mileage: '10.5',
                    emissions: 'Euro 5',
                    horsepower: 282,
                    torque: '365 Nm',
                    efficiency: 10.5,
                    features: ['All-Wheel Drive', 'Sunroof', 'Leather Seats', 'Premium Sound'],
                  },
                  {
                    id: 'harrier',
                    name: language === 'en' ? 'Toyota Harrier' : 'টয়োটা হ্যারিয়ার',
                    subtitle: language === 'en' ? 'Luxury Premium SUV' : 'বিলাসবহুল প্রিমিয়াম এসইউভি',
                    price: '৳ 75,00,000',
                    image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '2.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2024,
                    gradient: 'from-purple-600 to-purple-800',
                    lightGradient: 'from-purple-500 to-purple-600',
                    safetyRating: 5,
                    warrantyYears: 3,
                    mileage: '17.5',
                    emissions: 'Euro 6',
                    horsepower: 246,
                    torque: '313 Nm',
                    efficiency: 17.5,
                    features: ['Hybrid Technology', 'Panoramic Roof', 'Climate Control', 'Safety Suite'],
                  },
                  {
                    id: 'crown',
                    name: language === 'en' ? 'Toyota Crown RS' : 'টয়োটা ক্রাউন আরএস',
                    subtitle: language === 'en' ? 'Executive Premium Sedan' : 'এক্সিকিউটিভ প্রিমিয়াম সেডান',
                    price: '৳ 70,00,000',
                    image: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '2.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'Automatic',
                    year: 2024,
                    gradient: 'from-red-600 to-red-800',
                    lightGradient: 'from-red-500 to-red-600',
                    safetyRating: 5,
                    warrantyYears: 3,
                    mileage: '16.8',
                    emissions: 'Euro 6',
                    horsepower: 248,
                    torque: '300 Nm',
                    efficiency: 16.8,
                    features: ['Luxury Interior', 'Ambient Lighting', 'Premium Audio', 'Adaptive Suspension'],
                  },
                  {
                    id: 'yaris',
                    name: language === 'en' ? 'Toyota Yaris Cross' : 'টয়োটা ইয়ারিস ক্রস',
                    subtitle: language === 'en' ? 'Compact Hybrid Crossover' : 'কম্পাক্ট হাইব্রিড ক্রসওভার',
                    price: '৳ 38,00,000',
                    image: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '1.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-amber-600 to-amber-800',
                    lightGradient: 'from-amber-500 to-amber-600',
                    safetyRating: 4,
                    warrantyYears: 3,
                    mileage: '20.3',
                    emissions: 'Euro 5',
                    horsepower: 120,
                    torque: '196 Nm',
                    efficiency: 20.3,
                    features: ['Compact Size', 'Good Mileage', 'Modern Design', 'Smart Features'],
                  },
                  {
                    id: 'chr',
                    name: language === 'en' ? 'Toyota C-HR' : 'টয়োটা C-HR',
                    subtitle: language === 'en' ? 'Stylish Compact SUV' : 'স্টাইলিশ কমপ্যাক্ট এসইউভি',
                    price: '৳ 45,00,000',
                    image: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '1.8L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-green-600 to-green-800',
                    lightGradient: 'from-green-500 to-green-600',
                    safetyRating: 4,
                    warrantyYears: 3,
                    mileage: '18.5',
                    emissions: 'Euro 5',
                    horsepower: 144,
                    torque: '190 Nm',
                    efficiency: 18.5,
                    features: ['Bold Styling', 'AWD Option', 'Eco Mode', 'Compact Footprint'],
                  },
                  {
                    id: 'premio',
                    name: language === 'en' ? 'Toyota Premio' : 'টয়োটা প্রিমিও',
                    subtitle: language === 'en' ? 'Fuel-Efficient Sedan' : 'জ্বালানি-দক্ষ সেডান',
                    price: '৳ 40,00,000',
                    image: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '1.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-pink-600 to-pink-800',
                    lightGradient: 'from-pink-500 to-pink-600',
                    safetyRating: 4,
                    warrantyYears: 3,
                    mileage: '21.5',
                    emissions: 'Euro 5',
                    horsepower: 110,
                    torque: '172 Nm',
                    efficiency: 21.5,
                    features: ['Excellent Mileage', 'Affordable', 'Practical Design', 'Reliable Engine'],
                  },
                  {
                    id: 'noah',
                    name: language === 'en' ? 'Toyota Noah' : 'টয়োটা নোয়াহ',
                    subtitle: language === 'en' ? 'Family MPV 8-Seater' : 'পারিবারিক এমপিভি 8-সিটার',
                    price: '৳ 38,00,000',
                    image: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    engine: '1.8L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-cyan-600 to-cyan-800',
                    lightGradient: 'from-cyan-500 to-cyan-600',
                    safetyRating: 4,
                    warrantyYears: 3,
                    mileage: '18.2',
                    emissions: 'Euro 5',
                    horsepower: 144,
                    torque: '190 Nm',
                    efficiency: 18.2,
                    features: ['8-Seater', 'Family-Friendly', 'Spacious Interior', 'Sliding Doors'],
                  },
                ].map((vehicle, index) => (
                  <VehicleFlipCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={index}
                    theme={theme}
                    language={language}
                    isSelected={showcaseVehicle === vehicle.id}
                    onSelect={() => handleVehicleSelect(vehicle.id as typeof showcaseVehicle)}
                    flipTimeoutRef={flipTimeoutRef}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call-to-action */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/inventory">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  {language === 'en' ? 'View All Vehicles' : 'সমস্ত গাড়ি দেখুন'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      </LazySection>

      {/* FEATURE 7: INTERACTIVE COLOR CUSTOMIZER */}
      <LazySection minHeight="400px" rootMargin="200px">
      <motion.section
        className={`py-8 md:py-12 relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-white to-gray-50'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Personalize Your Vehicle' : 'আপনার গাড়ি ব্যক্তিগতকৃত করুন'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'Choose from premium color options and watch your car transform in real-time'
                : 'প্রিমিয়াম রঙ বিকল্প থেকে বেছে নিন এবং আপনার গাড়ি রিয়েল-টাইমে রূপান্তরিত দেখুন'}
            </p>
          </motion.div>

          {/* Color Customizer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prado Color Customizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <InteractiveColorCustomizer
                vehicleImage="https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
                vehicleModel="prado"
                availableColors={[
                  {
                    name: 'Pearl White',
                    hex: '#F5F5F5',
                    rgb: '245, 245, 245',
                    filterClass: 'brightness(1.1) saturate(0.8)',
                  },
                  {
                    name: 'Black Metallic',
                    hex: '#1A1A1A',
                    rgb: '26, 26, 26',
                    filterClass: 'brightness(0.7) contrast(1.2)',
                  },
                  {
                    name: 'Steel Blue',
                    hex: '#4A6FA5',
                    rgb: '74, 111, 165',
                    filterClass: 'hue-rotate(200deg) saturate(1.2)',
                  },
                  {
                    name: 'Crimson Red',
                    hex: '#DC143C',
                    rgb: '220, 20, 60',
                    filterClass: 'hue-rotate(-30deg) saturate(1.3)',
                  },
                  {
                    name: 'Forest Green',
                    hex: '#228B22',
                    rgb: '34, 139, 34',
                    filterClass: 'hue-rotate(120deg) saturate(1.1)',
                  },
                  {
                    name: 'Gold',
                    hex: '#FFD700',
                    rgb: '255, 215, 0',
                    filterClass: 'hue-rotate(40deg) saturate(1.4)',
                  },
                ]}
                theme={theme}
                language={language}
                onColorSelect={(color) => {
                  setSelectedVehicleColor(color);
                  import('../utils/AudioManager').then(m => m.AudioManager.playClick());
                }}
              />
            </motion.div>

            {/* Harrier Color Customizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <InteractiveColorCustomizer
                vehicleImage="https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
                vehicleModel="harrier"
                availableColors={[
                  {
                    name: 'Pearl White',
                    hex: '#F5F5F5',
                    rgb: '245, 245, 245',
                    filterClass: 'brightness(1.1) saturate(0.8)',
                  },
                  {
                    name: 'Black Metallic',
                    hex: '#1A1A1A',
                    rgb: '26, 26, 26',
                    filterClass: 'brightness(0.7) contrast(1.2)',
                  },
                  {
                    name: 'Silver',
                    hex: '#C0C0C0',
                    rgb: '192, 192, 192',
                    filterClass: 'brightness(1) saturate(0.5)',
                  },
                  {
                    name: 'Midnight Purple',
                    hex: '#2D1B4E',
                    rgb: '45, 27, 78',
                    filterClass: 'hue-rotate(280deg) saturate(1.2)',
                  },
                  {
                    name: 'Ocean Blue',
                    hex: '#0066CC',
                    rgb: '0, 102, 204',
                    filterClass: 'hue-rotate(200deg) saturate(1.1)',
                  },
                  {
                    name: 'Charcoal Grey',
                    hex: '#36454F',
                    rgb: '54, 69, 79',
                    filterClass: 'brightness(0.85) saturate(0.6)',
                  },
                ]}
                theme={theme}
                language={language}
                onColorSelect={(color) => {
                  setSelectedVehicleColor(color);
                  import('../utils/AudioManager').then(m => m.AudioManager.playClick());
                }}
              />
            </motion.div>

            {/* Crown Color Customizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <InteractiveColorCustomizer
                vehicleImage="https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
                vehicleModel="crown"
                availableColors={[
                  {
                    name: 'Pearl White',
                    hex: '#F5F5F5',
                    rgb: '245, 245, 245',
                    filterClass: 'brightness(1.1) saturate(0.8)',
                  },
                  {
                    name: 'Midnight Black',
                    hex: '#0D0D0D',
                    rgb: '13, 13, 13',
                    filterClass: 'brightness(0.5) contrast(1.3)',
                  },
                  {
                    name: 'Burgundy Red',
                    hex: '#800020',
                    rgb: '128, 0, 32',
                    filterClass: 'hue-rotate(-40deg) saturate(1.2)',
                  },
                  {
                    name: 'Deep Blue',
                    hex: '#00008B',
                    rgb: '0, 0, 139',
                    filterClass: 'hue-rotate(220deg) saturate(1.3)',
                  },
                  {
                    name: 'Titanium Grey',
                    hex: '#A9ACB5',
                    rgb: '169, 172, 181',
                    filterClass: 'brightness(0.95) saturate(0.4)',
                  },
                  {
                    name: 'Champagne Gold',
                    hex: '#F7E7CE',
                    rgb: '247, 231, 206',
                    filterClass: 'hue-rotate(30deg) saturate(1.2)',
                  },
                ]}
                theme={theme}
                language={language}
                onColorSelect={(color) => {
                  setSelectedVehicleColor(color);
                  import('../utils/AudioManager').then(m => m.AudioManager.playClick());
                }}
              />
            </motion.div>
          </div>

          {/* Color Selection Info */}
          {selectedVehicleColor && (
            <motion.div
              className={`mt-12 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {language === 'en'
                  ? `You've selected ${selectedVehicleColor.name}. This color preference has been saved to your vehicle customization profile.`
                  : `আপনি ${selectedVehicleColor.name} নির্বাচন করেছেন। এই রঙের পছন্দ আপনার গাড়ি কাস্টমাইজেশন প্রোফাইলে সংরক্ষিত হয়েছে।`}
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>
      </LazySection>

      {/* FEATURE 8: MORPHING SHAPE TRANSITIONS */}
      <LazySection minHeight="400px" rootMargin="200px">
      <motion.section
        className={`py-8 md:py-12 relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-gray-50 to-white'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Morphing Showcase' : 'আকৃতি-পরিবর্তনকারী শোকেস'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'Experience stunning clip-path and SVG morphing transitions between vehicles'
                : 'গাড়ির মধ্যে অসাধারণ ক্লিপ-পাথ এবং SVG আকৃতি রূপান্তর অনুভব করুন'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blob Morphing */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <MorphingShapeTransition
                images={[
                  {
                    src: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota Prado' : 'টয়োটা প্রাডো',
                  },
                  {
                    src: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota Harrier' : 'টয়োটা হ্যারিয়ার',
                  },
                  {
                    src: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota Crown' : 'টয়োটা ক্রাউন',
                  },
                  {
                    src: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota Yaris' : 'টয়োটা ইয়ারিস',
                  },
                ]}
                shapes="blob"
                theme={theme}
                language={language}
              />
            </motion.div>

            {/* Diamond Morphing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <MorphingShapeTransition
                images={[
                  {
                    src: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota Premio' : 'টয়োটা প্রিমিও',
                  },
                  {
                    src: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota C-HR' : 'টয়োটা C-HR',
                  },
                  {
                    src: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Toyota Noah' : 'টয়োটা নোয়া',
                  },
                  {
                    src: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp',
                    name: language === 'en' ? 'Premium SUV' : 'প্রিমিয়াম এসইউভি',
                  },
                ]}
                shapes="diamond"
                theme={theme}
                language={language}
              />
            </motion.div>
          </div>

          {/* Morphing Info Box */}
          <motion.div
            className={`mt-12 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50/50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'en'
                ? '💡 Tip: Click on the vehicle names or use the navigation arrows to experience smooth morphing transitions with animated SVG overlays and clip-path effects.'
                : '💡 টিপ: গাড়ির নাম ক্লিক করুন বা নেভিগেশন তীর ব্যবহার করুন মসৃণ আকৃতি রূপান্তর অনুভব করতে।'}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* FEATURE 9: SCROLL-TRIGGERED NUMBER COUNTERS */}
      <motion.section
        className={`py-8 md:py-12 relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-white to-gray-50'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Why Choose Us' : 'কেন আমাদের বেছে নিন'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'Scroll down to see our impact and achievements'
                : 'আমাদের প্রভাব এবং কৃতিত্ব দেখতে নিচে স্ক্রল করুন'}
            </p>
          </motion.div>

          {/* Counters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vehicles in Stock Counter */}
            <ScrollTriggerCounter
              targetValue={450}
              label={language === 'en' ? 'Premium Vehicles in Stock' : 'স্টকে প্রিমিয়াম গাড়ি'}
              suffix={language === 'en' ? '+' : '+'}
              icon={Car}
              theme={theme}
              duration={2.5}
            />

            {/* Happy Customers Counter */}
            <ScrollTriggerCounter
              targetValue={8500}
              label={language === 'en' ? 'Happy Customers Served' : 'খুশি গ্রাহক সেবা'}
              suffix={language === 'en' ? '+' : '+'}
              icon={Users}
              theme={theme}
              duration={2.5}
            />

            {/* Years Experience Counter */}
            <ScrollTriggerCounter
              targetValue={25}
              label={language === 'en' ? 'Years of Excellence' : 'উৎকর্ষতার বছর'}
              suffix={language === 'en' ? '+' : '+'}
              icon={Award}
              theme={theme}
              duration={2.5}
            />
          </div>

          {/* Info Box */}
          <motion.div
            className={`mt-12 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50/50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'en'
                ? '✨ Our counters use scroll-triggered animations with smooth odometer-style effects to celebrate your trust in us.'
                : '✨ আমাদের কাউন্টাররা আপনার আস্থার প্রতি স্ক্রল-ট্রিগার করা মসৃণ অ্যানিমেশন ব্যবহার করে।'}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* FEATURE 10: ANIMATED COMPARISON SLIDER (BEFORE/AFTER) */}
      <motion.section
        className={`py-8 md:py-12 relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-gray-50 to-white'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Standard vs Premium Comparison' : 'স্ট্যান্ডার্ড বনাম প্রিমিয়াম তুলনা'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'Discover what makes our premium models special - drag the slider to compare'
                : 'আমাদের প্রিমিয়াম মডেলগুলিকে বিশেষ করে তোলে তা আবিষ্কার করুন'}
            </p>
          </motion.div>

          {/* Harrier Standard vs Premium Comparison */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <AnimatedComparisonSlider
              standardImage="https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
              premiumImage="https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
              standardModel={language === 'en' ? 'Harrier Standard' : 'হ্যারিয়ার স্ট্যান্ডার্ড'}
              premiumModel={language === 'en' ? 'Harrier Premium' : 'হ্যারিয়ার প্রিমিয়াম'}
              specs={[
                {
                  label: language === 'en' ? 'Engine' : 'ইঞ্জিন',
                  standard: '2.5L Petrol',
                  premium: '2.5L Hybrid',
                  isNew: true,
                  highlight: true,
                },
                {
                  label: language === 'en' ? 'Transmission' : 'ট্রান্সমিশন',
                  standard: 'Automatic (6-Speed)',
                  premium: 'CVT Automatic',
                  isNew: true,
                  highlight: true,
                },
                {
                  label: language === 'en' ? 'Fuel Efficiency' : 'জ্বালানি দক্ষতা',
                  standard: '12.5 km/l',
                  premium: '17.5 km/l',
                  isNew: true,
                  highlight: true,
                },
                {
                  label: language === 'en' ? 'Horsepower' : 'হর্সপাওয়ার',
                  standard: '206 HP',
                  premium: '246 HP',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Sunroof' : 'সানরুফ',
                  standard: 'Single Pane',
                  premium: 'Panoramic Dual Pane',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Safety Features' : 'নিরাপত্তা বৈশিষ্ট্য',
                  standard: '6 Airbags',
                  premium: '8 Airbags + All-Speed ABS',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Infotainment' : 'বিনোদন',
                  standard: '8" Touchscreen',
                  premium: '10.5" Touchscreen + Apple CarPlay',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Warranty' : 'ওয়ারেন্টি',
                  standard: '2 Years',
                  premium: '3 Years Extended',
                  isNew: true,
                },
              ]}
              theme={theme}
              language={language}
            />
          </motion.div>

          {/* Prado Standard vs Premium Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AnimatedComparisonSlider
              standardImage="https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
              premiumImage="https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
              standardModel={language === 'en' ? 'Prado Standard' : 'প্রাডো স্ট্যান্ডার্ড'}
              premiumModel={language === 'en' ? 'Prado Premium' : 'প্রাডো প্রিমিয়াম'}
              specs={[
                {
                  label: language === 'en' ? 'Engine' : 'ইঞ্জিন',
                  standard: '2.7L V6',
                  premium: '2.7L V6 Twin-Turbo',
                  isNew: true,
                  highlight: true,
                },
                {
                  label: language === 'en' ? 'Seating' : 'সিটিং',
                  standard: '7-Seater',
                  premium: '7-Seater (Premium Leather)',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Four-Wheel Drive' : 'চার চাকা ড্রাইভ',
                  standard: 'Multi-Mode AWD',
                  premium: 'Intelligent Adaptive AWD',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Ground Clearance' : 'গাউন্ড ক্লিয়ারেন্স',
                  standard: '225 mm',
                  premium: '235 mm',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Roof Rails' : 'রুফ রেইলস',
                  standard: 'Standard Aluminum',
                  premium: 'Black Premium + Cross Bars',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Climate Control' : 'জলবায়ু নিয়ন্ত্রণ',
                  standard: 'Dual Zone',
                  premium: 'Triple Zone with App Control',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Sound System' : 'সাউন্ড সিস্টেম',
                  standard: '8 Speakers',
                  premium: '12 Speakers (Premium Audio)',
                  isNew: true,
                },
                {
                  label: language === 'en' ? 'Blind Spot Monitoring' : 'ব্লাইন্ড স্পট মনিটরিং',
                  standard: 'Optional',
                  premium: 'Standard + Camera View',
                  isNew: true,
                },
              ]}
              theme={theme}
              language={language}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* PERFORMANCE METRICS SECTION */}
      <motion.section
        className={`py-8 md:py-12 relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Performance Overview' : 'পারফরম্যান্স ওভারভিউ'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'Key metrics for the ' + (showcaseVehicle.charAt(0).toUpperCase() + showcaseVehicle.slice(1))
                : 'এর জন্য মূল মেট্রিক্স'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Horsepower */}
            {[
              {
                label: language === 'en' ? 'Horsepower' : 'হর্সপাওয়ার',
                value: (() => {
                  const v = [
                    { id: 'prado', value: 282 },
                    { id: 'harrier', value: 246 },
                    { id: 'crown', value: 248 },
                    { id: 'yaris', value: 120 },
                    { id: 'chr', value: 144 },
                    { id: 'premio', value: 110 },
                    { id: 'noah', value: 144 },
                  ].find(x => x.id === showcaseVehicle);
                  return v ? v.value : 100;
                })(),
                icon: <Zap className="w-6 h-6" />,
                color: 'text-orange-500',
              },
              {
                label: language === 'en' ? 'Fuel Efficiency' : 'জ্বালানি দক্ষতা',
                value: (() => {
                  const v = [
                    { id: 'prado', value: 10 },
                    { id: 'harrier', value: 17 },
                    { id: 'crown', value: 16 },
                    { id: 'yaris', value: 20 },
                    { id: 'chr', value: 18 },
                    { id: 'premio', value: 21 },
                    { id: 'noah', value: 18 },
                  ].find(x => x.id === showcaseVehicle);
                  return v ? v.value : 15;
                })(),
                icon: <Fuel className="w-6 h-6" />,
                color: 'text-green-500',
              },
              {
                label: language === 'en' ? 'Safety Rating' : 'সেফটি রেটিং',
                value: (() => {
                  const v = [
                    { id: 'prado', value: 5 },
                    { id: 'harrier', value: 5 },
                    { id: 'crown', value: 5 },
                    { id: 'yaris', value: 4 },
                    { id: 'chr', value: 4 },
                    { id: 'premio', value: 4 },
                    { id: 'noah', value: 4 },
                  ].find(x => x.id === showcaseVehicle);
                  return v ? v.value : 4;
                })(),
                icon: <Shield className="w-6 h-6" />,
                color: 'text-blue-500',
              },
              {
                label: language === 'en' ? 'Value Rating' : 'মূল্য রেটিং',
                value: (() => {
                  const v = [
                    { id: 'prado', value: 95 },
                    { id: 'harrier', value: 92 },
                    { id: 'crown', value: 90 },
                    { id: 'yaris', value: 88 },
                    { id: 'chr', value: 85 },
                    { id: 'premio', value: 90 },
                    { id: 'noah', value: 87 },
                  ].find(x => x.id === showcaseVehicle);
                  return v ? v.value : 85;
                })(),
                icon: <Award className="w-6 h-6" />,
                color: 'text-purple-500',
              },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PerformanceGauge
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  color={metric.color}
                  unit={index === 1 ? 'km/l' : index === 2 ? '/5' : ''}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* WHY CHOOSE US SECTION */}
      <motion.section 
        className={`py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Why Choose Auto Spark BD?' : 'কেন অটো স্পার্ক বিডি বেছে নেবেন?'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: language === 'en' ? 'Premium Selection' : 'প্রিমিয়াম নির্বাচন',
                description: language === 'en' ? 'Carefully curated collection of luxury and premium vehicles' : 'বিলাসবহুল এবং প্রিমিয়াম গাড়ির সাবধানে নির্বাচিত সংগ্রহ',
              },
              {
                icon: Shield,
                title: language === 'en' ? 'Quality Assurance' : 'মান নিশ্চিতকরণ',
                description: language === 'en' ? 'Thorough inspection and certification for every vehicle' : 'প্রতিটি গাড়ির জন্য পুঙ্খানুপুঙ্খ পরিদর্শন এবং সার্টিফিকেশন',
              },
              {
                icon: Wrench,
                title: language === 'en' ? 'Expert Service' : 'বিশেষজ্ঞ সেবা',
                description: language === 'en' ? 'State-of-the-art service center with experienced technicians' : 'অভিজ্ঞ প্রযুক্তিবিদদের সাথে অত্যাধুনিক সার্ভিস সেন্টার',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className={`p-8 text-center ${theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'}`}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <feature.icon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {testimonials.length > 0 && (
        <motion.section 
          className={`py-8 md:py-12 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-50'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'What Our Customers Say' : 'আমাদের গ্রাহকরা কি বলেন'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial: any, index: number) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                          <svg className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        </motion.div>
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 3D & Interactive Elements Section */}
      <section className={`py-8 md:py-12 bg-gradient-to-b ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-white to-gray-50'}`}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? '3D Interactive Experience' : '3D ইন্টারেক্টিভ অভিজ্ঞতা'}
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Explore our vehicles with cutting-edge 3D visualization and interactive tools' 
                : 'অত্যাধুনিক 3D ভিজুয়ালাইজেশন এবং ইন্টারেক্টিভ সরঞ্জামগুলির সাথে আমাদের গাড়িগুলি অন্বেষণ করুন'}
            </p>
          </motion.div>

          {/* 1. 360° Vehicle Viewer - Temporarily disabled due to R3F compatibility issue */}
          {/* 
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? '3D Vehicle Viewer' : '3D গাড়ি দর্শক'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'en' 
                  ? 'Explore our vehicles in stunning 3D - rotate, zoom, and customize colors'
                  : 'আমাদের গাড়িগুলি অত্যাশ্চর্য 3D তে অন্বেষণ করুন - ঘোরান, জুম করুন এবং রং কাস্টমাইজ করুন'}
              </p>
            </div>
            <CarViewerShowcase theme={theme} language={language} />
          </motion.div>
          */}

          {/* 2. Augmented Reality Viewer - Temporarily disabled */}
          {/*
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Augmented Reality (AR) Preview' : 'অগমেন্টেড রিয়েলিটি (AR) প্রিভিউ'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'en' 
                  ? 'Visualize how a car looks in your space using your device camera'
                  : 'আপনার ডিভাইস ক্যামেরা ব্যবহার করে একটি গাড়ি আপনার স্থানে কীভাবে দেখায় তা কল্পনা করুন'}
              </p>
            </div>
            <ARViewerEnhanced />
          </motion.div>
          */}

          {/* CTA for Interactive Experience */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)' }}
          >
            <h3 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Ready to Explore?' : 'অন্বেষণ করতে প্রস্তুত?'}
            </h3>
            <p className="mb-6 text-blue-100">
              {language === 'en' 
                ? 'Use these interactive tools to find your perfect vehicle'
                : 'আপনার নিখুঁত গাড়ি খুঁজে পেতে এই ইন্টারেক্টিভ সরঞ্জামগুলি ব্যবহার করুন'}
            </p>
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/inventory">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                  {language === 'en' ? 'View Full Inventory' : 'সম্পূর্ণ ইনভেন্টরি দেখুন'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* GOOGLE MAPS LOCATION SECTION - Interactive with Animations */}
      <motion.section
        className="py-8 md:py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {language === 'en' ? 'Visit Our Showroom' : 'আমাদের শোরুম পরিদর্শন করুন'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Located in the heart of Rajshahi. Experience our vehicles in person and take a test drive today.'
                : 'রাজশাহীর কেন্দ্রে অবস্থিত। আমাদের গাড়িগুলি সরাসরি অনুভব করুন এবং আজই টেস্ট ড্রাইভ নিন।'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Location Info Cards */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Address Card */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
                whileHover={{ y: -10 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {language === 'en' ? 'Address' : 'ঠিকানা'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Auto Spark, Rajshahi</p>
                    <p className="text-gray-600 dark:text-gray-300">Bangladesh</p>
                  </div>
                </div>
              </motion.div>

              {/* Hours Card */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
                whileHover={{ y: -10 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {language === 'en' ? 'Business Hours' : 'ব্যবসায়িক সময়'}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 dark:text-gray-300">{language === 'en' ? 'Monday - Friday' : 'সোমবার - শুক্রবার'}: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600 dark:text-gray-300">{language === 'en' ? 'Saturday' : 'শনিবার'}: 10:00 AM - 5:00 PM</p>
                      <p className="text-gray-600 dark:text-gray-300">{language === 'en' ? 'Sunday' : 'রবিবার'}: {language === 'en' ? 'Closed' : 'বন্ধ'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Card */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
                whileHover={{ y: -10 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {language === 'en' ? 'Contact' : 'যোগাযোগ'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">📞 +880 1234 567890</p>
                    <p className="text-gray-600 dark:text-gray-300">✉️ info@autospark.com</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://www.google.com/maps/place/Auto+Spark/@24.3744264,88.6135805,17z/data=!3m1!4b1!4m6!3m5!1s0x39fbeffd47dfded9:0x46c8c45692f9a6c1!8m2!3d24.3744264!4d88.6135805!16s%2Fg%2F11p75sk5c5?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all text-center"
                >
                  {language === 'en' ? '📍 Get Directions on Google Maps' : '📍 গুগল ম্যাপে দিকনির্দেশনা পান'}
                </a>
              </motion.div>
            </motion.div>

            {/* Google Maps Embed - Right Side */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl h-full min-h-[500px]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                boxShadow: '0 20px 50px rgba(59, 130, 246, 0.2)'
              }}
            >
              {/* Animated Border */}
              <motion.div
                className="absolute -inset-0.5 rounded-2xl opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #3B82F6, #6366F1, #3B82F6)',
                  backgroundPosition: '200% 0',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '0 0', '200% 0'],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Google Maps Iframe */}
              <iframe
                title="Auto Spark Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3644.7574123456!2d88.6135805!3d24.3744264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbeffd47dfded9%3A0x46c8c45692f9a6c1!2sAuto%20Spark!5e0!3m2!1sen!2sbd!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
      </LazySection>

      {/* CTA SECTION */}
      <motion.section 
        className={`py-8 md:py-12 bg-gradient-to-r from-blue-600 to-blue-800`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              {language === 'en' ? 'Ready to Find Your Dream Car?' : 'আপনার স্বপ্নের গাড়ি খুঁজে পেতে প্রস্তুত?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {language === 'en' ? 'Browse our extensive inventory or visit our showroom in Rajshahi' : 'আমাদের বিস্তৃত ইনভেন্টরি ব্রাউজ করুন বা রাজশাহীতে আমাদের শোরুম পরিদর্শন করুন'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/inventory">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                    {language === 'en' ? 'Browse Inventory' : 'ইনভেন্টরি ব্রাউজ করুন'}
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    {language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Comparison Sidebar */}
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
        onToggle={() => setShowComparison(!showComparison)}
        onRemove={handleRemoveFromComparison}
        onExport={handleExportComparison}
        theme={theme}
        language={language}
      />
    </motion.div>
    </MotionConfig>
  );
};