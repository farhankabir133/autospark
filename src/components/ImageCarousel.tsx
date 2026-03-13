import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ImageCarouselProps {
  images: { url: string; alt?: string }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  height?: string;
}

export const ImageCarousel = ({
  images,
  autoPlay = true,
  autoPlayInterval = 4000,
  showIndicators = true,
  showArrows = true,
  height = 'h-64',
}: ImageCarouselProps) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length, autoPlayInterval]);

  if (!images || images.length === 0) {
    return (
      <div className={`${height} bg-gray-200 flex items-center justify-center rounded-lg`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  return (
    <div 
      className={`relative ${height} overflow-hidden rounded-lg group`}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(autoPlay)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || `Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      {/* Gradient overlay on bottom for better indicator visibility */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent h-20 pointer-events-none" />

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <motion.button
            onClick={goToPrevious}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all z-10 ${
              theme === 'dark'
                ? 'bg-white/20 hover:bg-white/40 text-white'
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all z-10 ${
              theme === 'dark'
                ? 'bg-white/20 hover:bg-white/40 text-white'
                : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        </>
      )}

      {/* Indicator Dots */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-2 h-2'
                  : 'bg-white/50 w-2 h-2 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium z-10 ${
          theme === 'dark'
            ? 'bg-gray-800/80 text-gray-200'
            : 'bg-white/80 text-gray-900'
        }`}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};
