import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock car data - 5 premium vehicles
const carData = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2024,
    price: '৳ 72,00,000',
    imageUrl: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'Pearl White',
    tagline: 'Conquer Every Terrain',
  },
  {
    id: 2,
    brand: 'Honda',
    model: 'CR-V',
    year: 2024,
    price: '৳ 42,00,000',
    imageUrl: 'https://res.cloudinary.com/dnogrvbsf/image/upload/v1717432322/autospark/honda-crv-2023-black.jpg',
    color: 'Crystal Black',
    tagline: 'Adventure Awaits',
  },
  {
    id: 3,
    brand: 'Nissan',
    model: 'Patrol',
    year: 2024,
    price: '৳ 85,00,000',
    imageUrl: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'Titanium Grey',
    tagline: 'Born to Lead',
  },
  {
    id: 4,
    brand: 'Toyota',
    model: 'Corolla Cross',
    year: 2024,
    price: '৳ 38,00,000',
    imageUrl: 'https://res.cloudinary.com/dnogrvbsf/image/upload/v1717432322/autospark/toyota-corolla-cross-2024-blue.jpg',
    color: 'Celestial Silver',
    tagline: 'Urban Excellence',
  },
  {
    id: 5,
    brand: 'Honda',
    model: 'Civic',
    year: 2024,
    price: '৳ 32,00,000',
    imageUrl: 'https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'Rallye Red',
    tagline: 'Drive Your Dreams',
  },
];

interface CarShowcaseCarouselProps {
  className?: string;
}

export const CarShowcaseCarousel = ({ className = '' }: CarShowcaseCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with middle car
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % carData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + carData.length) % carData.length);
  };

  // Get visible cars (show 5 at a time with wrap-around)
  const getVisibleCars = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (activeIndex + i + carData.length) % carData.length;
      visible.push({
        ...carData[index],
        position: i, // -2, -1, 0, 1, 2
      });
    }
    return visible;
  };

  // Calculate transform styles based on position
  const getCarStyles = (position: number) => {
    const isActive = position === 0;
    const isLeft = position < 0;
    const isRight = position > 0;
    const absPosition = Math.abs(position);

    // Base transforms
    let rotateY = 0;
    let skewY = 0;
    let translateX = 0;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 5 - absPosition;

    if (isActive) {
      // Center car - prominent and flat
      scale = 1.15;
      translateZ = 100;
      zIndex = 10;
    } else if (isLeft) {
      // Left side cars - angled towards center
      rotateY = 35 + (absPosition - 1) * 10;
      skewY = -2;
      translateX = -180 * absPosition;
      translateZ = -100 * absPosition;
      scale = 1 - absPosition * 0.15;
      opacity = 1 - absPosition * 0.25;
    } else if (isRight) {
      // Right side cars - angled towards center
      rotateY = -35 - (absPosition - 1) * 10;
      skewY = 2;
      translateX = 180 * absPosition;
      translateZ = -100 * absPosition;
      scale = 1 - absPosition * 0.15;
      opacity = 1 - absPosition * 0.25;
    }

    return {
      rotateY,
      skewY,
      translateX,
      translateZ,
      scale,
      opacity,
      zIndex,
    };
  };

  const visibleCars = getVisibleCars();
  const activeCar = carData[activeIndex];

  return (
    <div className={`relative w-full overflow-hidden py-16 ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black" />
      
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Section Header */}
      <motion.div 
        className="relative z-10 text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
          Featured Collection
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          Premium Showroom
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore our curated selection of luxury vehicles
        </p>
      </motion.div>

      {/* 3D Carousel Container */}
      <div 
        className="relative h-[400px] md:h-[500px] mx-auto"
        style={{ 
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
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
                    rotateY: direction > 0 ? -60 : 60,
                    x: direction > 0 ? 300 : -300,
                    scale: 0.7,
                    opacity: 0,
                  }}
                  animate={{
                    rotateY: styles.rotateY,
                    skewY: styles.skewY,
                    x: styles.translateX,
                    z: styles.translateZ,
                    scale: styles.scale,
                    opacity: styles.opacity,
                  }}
                  exit={{
                    rotateY: direction > 0 ? 60 : -60,
                    x: direction > 0 ? -300 : 300,
                    scale: 0.7,
                    opacity: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                  }}
                  onClick={() => {
                    if (car.position < 0) {
                      handlePrev();
                    } else if (car.position > 0) {
                      handleNext();
                    }
                  }}
                  whileHover={!isActive ? { scale: styles.scale * 1.05 } : {}}
                >
                  {/* Car Card */}
                  <div 
                    className={`relative w-[280px] md:w-[360px] rounded-2xl overflow-hidden transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-b from-gray-800/90 to-gray-900/95 shadow-2xl shadow-blue-500/20 border border-white/10' 
                        : 'bg-gray-800/50 border border-white/5'
                    }`}
                  >
                    {/* Car Image Container */}
                    <div className="relative h-[180px] md:h-[220px] overflow-hidden">
                      {/* Image gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                      
                      {/* Car image */}
                      <motion.img
                        src={car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: isActive ? 1 : 1.1 }}
                        transition={{ duration: 0.6 }}
                      />

                      {/* Featured badge for active car */}
                      {isActive && (
                        <motion.div
                          className="absolute top-4 right-4 z-20"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/30">
                            FEATURED
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Car Info */}
                    <div className="p-5 md:p-6">
                      {/* Brand & Model */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-blue-400 uppercase tracking-wider mb-1">
                          {car.brand}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          {car.model}
                        </h3>
                      </div>

                      {/* Tagline */}
                      <p className="text-sm text-gray-400 mb-4 italic">
                        "{car.tagline}"
                      </p>

                      {/* Details Row */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Starting from</p>
                          <p className="text-lg font-bold text-white">
                            {car.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">{car.year}</p>
                          <p className="text-sm text-gray-300">{car.color}</p>
                        </div>
                      </div>

                      {/* CTA Button for active car */}
                      {isActive && (
                        <motion.button
                          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Details
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Ground Shadow for Active Car */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-16"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 md:px-12 z-20 pointer-events-none">
          <motion.button
            onClick={handlePrev}
            className="pointer-events-auto p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:text-blue-400 transition-colors" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="pointer-events-auto p-3 md:p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:text-blue-400 transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-8">
        {carData.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className={`relative h-2 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'w-8 bg-blue-500' 
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {index === activeIndex && (
              <motion.div
                className="absolute inset-0 bg-blue-400 rounded-full"
                layoutId="activeDot"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Active Car Info Panel */}
      <motion.div
        key={activeCar.id}
        className="relative z-10 max-w-xl mx-auto text-center mt-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Available Now</span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <span>Free Test Drive</span>
          <div className="w-px h-4 bg-gray-600" />
          <span>Easy Financing</span>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CarShowcaseCarousel;
