import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Complete car inventory with all available vehicles - EXPORTED for use in other components
export const carSlides = [
  // TOYOTA - Harrier Advance Premium
  {
    id: 'harrier-advance',
    brand: 'Toyota',
    model: 'Harrier Advance Premium',
    title: 'Toyota Harrier',
    subtitle: 'Advance Premium',
    tagline: 'Luxury Premium SUV with Advanced Hybrid Technology',
    year: 2024,
    image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 45,50,000',
    color: 'Steel Blue',
    features: ['1.8L Hybrid', 'Toyota Safety Sense', 'Wireless Charging'],
    bodyType: 'Compact Crossover',
  },
  // TOYOTA - Corolla Cross Z
  {
    id: 'corolla-cross-z',
    brand: 'Toyota',
    model: 'Corolla Cross Z',
    title: 'Corolla Cross Z',
    subtitle: '2024 Hybrid Edition',
    tagline: 'Modern Compact Crossover with Smart Features',
    year: 2024,
    image: 'https://images.pexels.com/photos/36590733/pexels-photo-36590733.png',
    price: '৳ 45,50,000',
    color: 'Steel Blue',
    features: ['1.8L Hybrid', 'Toyota Safety Sense', 'Wireless Charging'],
    bodyType: 'Compact Crossover',
  },
  // TOYOTA - Crown RS
  {
    id: 'crown-rs',
    brand: 'Toyota',
    model: 'Crown RS',
    title: 'Toyota Crown RS',
    subtitle: 'Executive Premium Sedan',
    tagline: 'State-of-the-Art Executive Hybrid Sedan',
    year: 2024,
    image: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 70,00,000',
    color: 'Black Metallic',
    features: ['2.5L Hybrid', 'Heads-Up Display', 'Mark Levinson Audio'],
    bodyType: 'Premium Sedan',
  },
  // TOYOTA - Prado (Premium SUV)
  {
    id: 'prado-2024',
    brand: 'Toyota',
    model: 'Land Cruiser Prado',
    title: 'Toyota Prado',
    subtitle: 'Premium 7-Seater SUV',
    tagline: 'Legendary Off-Road Capabilities',
    year: 2024,
    image: 'https://images.pexels.com/photos/35516384/pexels-photo-35516384.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 85,00,000',
    color: 'Black Pearl',
    features: ['2.7L V6', 'Multi-Terrain Select', 'Crawl Control'],
    bodyType: 'Premium SUV',
  },
  // TOYOTA - Premio F-EX
  {
    id: 'premio-fex',
    brand: 'Toyota',
    model: 'Premio F-EX',
    title: 'Toyota Premio',
    subtitle: 'F-EX Hybrid Edition',
    tagline: 'Fuel-Efficient Sedan with Excellent Performance',
    year: 2023,
    image: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 40,00,000',
    color: 'Silver Pearl',
    features: ['1.5L Hybrid', 'Smart Entry', 'Eco Mode'],
    bodyType: 'Sedan',
  },
  // TOYOTA - Noah Si WxB
  {
    id: 'noah-si-wxb',
    brand: 'Toyota',
    model: 'Noah Si WxB',
    title: 'Toyota Noah',
    subtitle: 'Si WxB Family MPV',
    tagline: 'Spacious Family MPV with Practical Hybrid Tech',
    year: 2023,
    image: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 38,00,000',
    color: 'White Pearl',
    features: ['1.5L Hybrid', '8 Seater', 'Sliding Doors'],
    bodyType: 'MPV',
  },
  // TOYOTA - C-HR G-LED
  {
    id: 'chr-gled',
    brand: 'Toyota',
    model: 'C-HR G-LED',
    title: 'Toyota C-HR',
    subtitle: 'G-LED Package',
    tagline: 'Stylish Compact SUV with LED Headlights',
    year: 2023,
    image: 'https://images.pexels.com/photos/35515951/pexels-photo-35515951.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 35,50,000',
    color: 'Red Metallic',
    features: ['1.8L Hybrid', 'LED Package', 'Toyota Safety Sense'],
    bodyType: 'Compact SUV',
  },
  // TOYOTA - Yaris Cross Z
  {
    id: 'yaris-cross-z',
    brand: 'Toyota',
    model: 'Yaris Cross Z',
    title: 'Yaris Cross Z',
    subtitle: 'Compact Crossover',
    tagline: 'Impressive Fuel Efficiency and Safety',
    year: 2023,
    image: 'https://images.pexels.com/photos/35516543/pexels-photo-35516543.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 35,50,000',
    color: 'Pearl Blue',
    features: ['1.5L Hybrid', 'All-Wheel Drive', 'Safety Sense'],
    bodyType: 'Compact Crossover',
  },
  // TOYOTA - Axio WxB
  {
    id: 'axio-wxb',
    brand: 'Toyota',
    model: 'Axio WxB',
    title: 'Toyota Axio',
    subtitle: 'WxB Compact Sedan',
    tagline: 'Reliable Compact Sedan with Excellent Economy',
    year: 2023,
    image: 'https://images.pexels.com/photos/35515952/pexels-photo-35515952.png?auto=compress&cs=tinysrgb&w=800',
    price: '৳ 30,00,000',
    color: 'Silver',
    features: ['1.3L Hybrid', 'CVT', 'Push Start'],
    bodyType: 'Sedan',
  },
  // TOYOTA - Prius S
  {
    id: 'prius-s',
    brand: 'Toyota',
    model: 'Prius S',
    title: 'Toyota Prius',
    subtitle: 'S Hybrid Edition',
    year: 2023,
    image: 'https://images.pexels.com/photos/35516335/pexels-photo-35516335.png?auto=compress&cs=tinysrgb&w=800',
    color: 'Pearl White',
    features: ['1.5L Hybrid', 'EV Mode', 'Eco Display'],
    bodyType: 'Sedan',
  },
  // HONDA - Insight
  {
    id: 'honda-insight',
    brand: 'Honda',
    model: 'Insight',
    title: 'Honda Insight',
    subtitle: 'Intelligent Hybrid Sedan',
    year: 2023,
    image: 'https://images.pexels.com/photos/35515950/pexels-photo-35515950.png?auto=compress&cs=tinysrgb&w=800',
    color: 'Crystal Gray',
    features: ['1.5L Hybrid', 'Honda Sensing', 'Sport Mode'],
    bodyType: 'Sedan',
  },
  // TOYOTA - Lexus
  {
    id: 'lexus',
    brand: 'Lexus',
    model: 'ES Hybrid',
    title: 'Lexus ES',
    subtitle: 'Luxury Hybrid Sedan',
    year: 2023,
    image: 'https://images.pexels.com/photos/35516542/pexels-photo-35516542.png?auto=compress&cs=tinysrgb&w=800',
    color: 'Pearl White',
    features: ['2.0L Hybrid', 'Lexus Safety System+', 'Luxury Interior'],
    bodyType: 'Luxury Sedan',
  },
  // HONDA - Civic
  {
    id: 'honda-civic',
    brand: 'Honda',
    model: 'Civic',
    title: 'Honda Civic',
    subtitle: 'Sporty Sedan',
    year: 2023,
    image: 'https://images.pexels.com/photos/36590735/pexels-photo-36590735.png',
    color: 'Blue',
    features: ['1.8L VTEC', 'Honda Sensing', 'Apple CarPlay'],
    bodyType: 'Sedan',
  },
  // HONDA - CR-V
  {
    id: 'honda-crv',
    brand: 'Honda',
    model: 'CR-V',
    title: 'Honda CR-V',
    subtitle: 'Turbo Family SUV',
    year: 2023,
    image: 'https://images.pexels.com/photos/36580896/pexels-photo-36580896.png',
    color: 'Black',
    features: ['1.5L Turbo', 'AWD Available', 'Honda Sensing'],
    bodyType: 'Compact SUV',
  },
];

// Props interface for the carousel
interface CarFocusCarouselProps {
  initialCarId?: string;
  onCarChange?: (carId: string, index: number) => void;
}

// Export ref handle type for external control
export interface CarFocusCarouselHandle {
  goToCarById: (carId: string) => void;
  goToIndex: (index: number) => void;
  getCurrentCarId: () => string;
}

const CarFocusCarousel = forwardRef<CarFocusCarouselHandle, CarFocusCarouselProps>(
  ({ initialCarId, onCarChange }, ref) => {
  // Find initial index from carId if provided
  const getInitialIndex = () => {
    if (initialCarId) {
      const index = carSlides.findIndex(car => car.id === initialCarId);
      return index >= 0 ? index : 0;
    }
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(!initialCarId); // Don't autoplay if specific car selected

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    goToCarById: (carId: string) => {
      const index = carSlides.findIndex(car => car.id === carId);
      if (index >= 0) {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
      }
    },
    goToIndex: (index: number) => {
      if (index >= 0 && index < carSlides.length) {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
        setIsAutoPlaying(false);
      }
    },
    getCurrentCarId: () => carSlides[activeIndex].id,
  }));

  // Notify parent when car changes
  useEffect(() => {
    if (onCarChange) {
      onCarChange(carSlides[activeIndex].id, activeIndex);
    }
  }, [activeIndex, onCarChange]);

  // Update when initialCarId changes externally
  useEffect(() => {
    if (initialCarId) {
      const index = carSlides.findIndex(car => car.id === initialCarId);
      if (index >= 0 && index !== activeIndex) {
        setDirection(index > activeIndex ? 1 : -1);
        setActiveIndex(index);
        setIsAutoPlaying(false);
      }
    }
  }, [initialCarId]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % carSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % carSlides.length);
    setIsAutoPlaying(false);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + carSlides.length) % carSlides.length);
    setIsAutoPlaying(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch / swipe support — improved sensitivity and visual feedback
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // If horizontal movement dominates, prevent vertical scroll
    if (dx > 10 && dx > dy * 1.2) {
      isSwiping.current = true;
      e.preventDefault();
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      // Lower threshold (30px) for better mobile responsiveness
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) handleNext();
        else handlePrev();
      }
      touchStartX.current = null;
      touchStartY.current = null;
      isSwiping.current = false;
    },
    [handleNext, handlePrev]
  );

  // Get visible cars with positions - Show more cars for wider spread (14 total cars)
  const getVisibleCars = () => {
    const visible = [];
    for (let i = -4; i <= 4; i++) {
      const index = (activeIndex + i + carSlides.length) % carSlides.length;
      visible.push({
        ...carSlides[index],
        position: i,
      });
    }
    return visible;
  };

  // Calculate 3D transforms based on position - WIDER SPREAD & ENHANCED
  const getCarStyles = (position: number) => {
    const isActive = position === 0;
    const isLeft = position < 0;
    const absPosition = Math.abs(position);

    let rotateY = 0;
    let rotateX = 0;
    let rotateZ = 0;
    let translateX = 0;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10 - absPosition;

    if (isActive) {
      // Active card: larger, forward, perfectly flat
      scale = 1.15;
      translateZ = 120;
      rotateX = -2; // Slight tilt for premium feel
      zIndex = 20;
    } else if (isLeft) {
      // Left cards: spread wider, more dramatic angle
      rotateY = 50 + (absPosition - 1) * 12;
      rotateZ = -3 * absPosition; // Slight roll for depth
      translateX = -320 * absPosition; // WIDER spacing
      translateZ = -180 * absPosition;
      scale = 0.78 - absPosition * 0.12;
      opacity = 1 - absPosition * 0.25;
    } else {
      // Right cards: mirror of left
      rotateY = -50 - (absPosition - 1) * 12;
      rotateZ = 3 * absPosition;
      translateX = 320 * absPosition; // WIDER spacing
      translateZ = -180 * absPosition;
      scale = 0.78 - absPosition * 0.12;
      opacity = 1 - absPosition * 0.25;
    }

    return { rotateY, rotateX, rotateZ, translateX, translateZ, scale, opacity, zIndex };
  };

  const visibleCars = getVisibleCars();

  return (
    <section className="relative w-full overflow-hidden py-10 md:py-20 lg:py-32">
      {/* Background with enhanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/95 to-black" />
      
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      {/* Ambient glow effect - ENHANCED */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.9, 0.5],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Secondary ambient glow */}
        <motion.div 
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(34, 211, 238, 0.12) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Section Header */}
      <motion.div 
        className="relative z-10 text-center mb-12 lg:mb-16 px-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300 tracking-wide uppercase">
            Premium Collection
          </span>
        </motion.div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Featured Vehicles
          </span>
        </h2>
      <div 
        className="relative h-[500px] md:h-[600px] lg:h-[700px] mx-auto max-w-[1600px] touch-pan-y"
        style={{ 
          perspective: '1600px',
          perspectiveOrigin: '50% 35%',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Cars Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {visibleCars.map((car) => {
              const styles = getCarStyles(car.position);
              const isActive = car.position === 0;

              return (
                <motion.div
                  key={`${car.id}-${car.position}`}
                  className="absolute cursor-pointer"
                  style={{
                    zIndex: styles.zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{
                    rotateY: direction > 0 ? -90 : 90,
                    rotateZ: direction > 0 ? -8 : 8,
                    x: direction > 0 ? 600 : -600,
                    z: -300,
                    scale: 0.4,
                    opacity: 0,
                  }}
                  animate={{
                    rotateY: styles.rotateY,
                    rotateX: styles.rotateX,
                    rotateZ: styles.rotateZ,
                    x: styles.translateX,
                    z: styles.translateZ,
                    scale: styles.scale,
                    opacity: styles.opacity,
                  }}
                  exit={{
                    rotateY: direction > 0 ? 90 : -90,
                    rotateZ: direction > 0 ? 8 : -8,
                    x: direction > 0 ? -600 : 600,
                    z: -300,
                    scale: 0.4,
                    opacity: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 26,
                    mass: 1.4,
                  }}
                  onClick={() => {
                    if (car.position < 0) handlePrev();
                    else if (car.position > 0) handleNext();
                  }}
                  whileHover={!isActive ? { 
                    scale: styles.scale * 1.08,
                    rotateY: styles.rotateY * 0.85,
                    z: styles.translateZ + 40,
                    transition: { duration: 0.3 }
                  } : {
                    scale: 1.18,
                    z: 140,
                    transition: { duration: 0.25 }
                  }}
                >
                  {/* Car Card - WIDER */}
                  <div 
                    className={`relative w-[280px] sm:w-[340px] md:w-[420px] lg:w-[480px] rounded-3xl overflow-hidden transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-b from-gray-800/95 to-gray-900/98 shadow-2xl shadow-blue-500/30 border border-white/20' 
                        : 'bg-gray-800/40 border border-white/5 backdrop-blur-sm'
                    }`}
                  >
                    {/* Animated conic background for active card */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 z-0"
                        style={{
                          background: 'conic-gradient(from 0deg, transparent 0%, rgba(59,130,246,0.5) 10%, transparent 20%, rgba(139,92,246,0.5) 30%, transparent 40%, rgba(59,130,246,0.5) 50%, transparent 60%, rgba(236,72,153,0.5) 70%, transparent 80%, rgba(59,130,246,0.5) 90%, transparent 100%)',
                          borderRadius: '1.5rem',
                        }}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                  {/* Inner mask */}
                  <div className="absolute inset-[2px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl" />
                  {/* Sweeping light effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 80%)',
                      backgroundSize: '300% 300%',
                    }}
                    animate={{
                      backgroundPosition: ['-100% 0%', '200% 0%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: 'easeInOut',
                    }}
                  />

                    {/* Car Image Container - TALLER */}
                    <div className="relative h-[200px] md:h-[250px] lg:h-[280px] overflow-hidden">
                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-transparent z-10" />
                      
                      {/* Car image with enhanced zoom/parallax effect */}
                      <motion.img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        initial={{ scale: 1.4, x: direction > 0 ? 30 : -30 }}
                        animate={{ 
                          scale: isActive ? 1 : 1.2, 
                        }}
                      />

                      {/* Featured badge */}
                      {isActive && (
                        <motion.div
                          className="absolute top-4 right-4 z-20"
                          initial={{ opacity: 0, scale: 0, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                        >
                          <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/40">
                            ✨ FEATURED
                          </span>
                        </motion.div>
                      )}

                      {/* Year badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 text-xs font-semibold text-white/80 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                          {car.year}
                        </span>
                      </div>
                    </div>

                    {/* Car Info */}
                    <div className="relative p-6 lg:p-7">
                      {/* Brand & Model */}
                      <div className="mb-4">
                        <motion.p 
                          className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {car.brand}
                        </motion.p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                          {car.model}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {car.subtitle}
                        </p>
                      </div>

                      {/* Tagline */}
                      <p className="text-sm text-gray-300/80 italic mb-5 border-l-2 border-blue-500/50 pl-3">
                        "{car.tagline}"
                      </p>

                      {/* Features (only for active) */}
                      {isActive && (
                        <motion.div 
                          className="flex flex-wrap gap-2 mb-5"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {car.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/20"
                            >
                              {feature}
                            </span>
                          ))}
                        </motion.div>
                      )}

                      {/* Price & Details Row */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-5">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Starting from</p>
                          <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            {car.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Color</p>
                          <p className="text-sm text-gray-300">{car.color}</p>
                        </div>
                      </div>

                      {/* CTA Buttons (only for active) */}
                      {isActive && (
                        <motion.div
                          className="flex gap-3 mt-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                        >
                          <Link 
                            to={`/vehicle/${car.id}`}
                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-xl text-center transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                          >
                            View Details
                          </Link>
                          <Link
                            to="/contact"
                            className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl text-center transition-all duration-300 border border-white/20 hover:border-white/30"
                          >
                            Inquire
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Ground Shadow for Active Car - ENHANCED */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[110%] h-28"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.45) 0%, rgba(59, 130, 246, 0.2) 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
                          filter: 'blur(16px)',
                        }}
                      />
                      {/* Reflection line */}
                      <motion.div
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-1"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                          filter: 'blur(1px)',
                        }}
                      />
                    </>
                  )}
                  {/* Subtle shadow for non-active cards */}
                  {!isActive && Math.abs(car.position) <= 2 && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-16"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, transparent 60%)',
                        filter: 'blur(10px)',
                        opacity: 0.5 - Math.abs(car.position) * 0.15,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - ENHANCED */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 md:px-12 lg:px-20 z-20 pointer-events-none">
          <motion.button
            onClick={handlePrev}
            aria-label="Previous car"
            className="pointer-events-auto relative p-4 md:p-5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.15, x: -8 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 relative z-10 group-hover:text-blue-400 transition-colors" />
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              initial={{ scale: 1, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>

          <motion.button
            onClick={handleNext}
            aria-label="Next car"
            className="pointer-events-auto relative p-4 md:p-5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.15, x: 8 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 relative z-10 group-hover:text-blue-400 transition-colors" />
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/20"
              initial={{ scale: 1, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </div>
      </div>

      {/* Pagination Dots - ENHANCED */}
      <div className="relative z-10 flex items-center justify-center gap-4 mt-12">
        {carSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
              setIsAutoPlaying(false);
            }}
            className="relative group py-2"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.85 }}
          >
            <motion.div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === activeIndex 
                  ? 'w-12 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500' 
                  : 'w-2.5 bg-white/20 hover:bg-white/50 group-hover:w-4'
              }`}
              layoutId={index === activeIndex ? 'activeDot' : undefined}
            />
            {/* Glow under active */}
            {index === activeIndex && (
              <motion.div
                className="absolute inset-0 bg-blue-400/40 rounded-full blur-md -z-10"
                layoutId="dotGlow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            )}
            {/* Pulse ring on active */}
            {index === activeIndex && (
              <motion.div
                className="absolute inset-0 rounded-full border border-blue-400/50"
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom Info Bar */}
      <motion.div
        className="relative z-10 max-w-xl mx-auto text-center mt-8 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>In Stock</span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <span>Free Test Drive</span>
          <div className="w-px h-4 bg-gray-700" />
          <span>Easy Financing</span>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="relative z-10 text-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
      >
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white font-semibold rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <span>View All Vehicles</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Floating particles - ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main sparkle particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${5 + i * 6.5}%`,
              top: `${10 + (i % 5) * 18}%`,
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
              background: i % 2 === 0 
                ? 'rgba(59, 130, 246, 0.6)' 
                : 'rgba(139, 92, 246, 0.5)',
              boxShadow: i % 3 === 0 
                ? '0 0 10px rgba(59, 130, 246, 0.8)' 
                : 'none',
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3.5 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Larger floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-40 h-40 rounded-full"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '59, 130, 246' : '139, 92, 246'}, 0.05) 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Shooting star effect */}
        <motion.div
          className="absolute w-32 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            top: '15%',
            left: '-10%',
          }}
          animate={{
            x: ['0%', '150%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 8,
            ease: 'easeOut',
          }}
        />
      </div>
    </motion.div>
  </section>
  );
});

// Display name for debugging
CarFocusCarousel.displayName = 'CarFocusCarousel';

export default CarFocusCarousel;
