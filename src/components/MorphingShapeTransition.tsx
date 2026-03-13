import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MorphingShapeTransitionProps {
  images: Array<{
    src: string;
    name: string;
  }>;
  theme: string;
  language: string;
  shapes?: 'circle' | 'hexagon' | 'square' | 'diamond' | 'wave' | 'blob';
}

export const MorphingShapeTransition = ({
  images,
  theme,
  language,
  shapes = 'blob',
}: MorphingShapeTransitionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const bgColor = theme === 'dark'
    ? 'bg-gray-900'
    : 'bg-white';

  const borderColor = theme === 'dark'
    ? 'border-gray-800'
    : 'border-gray-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const accentColor = theme === 'dark'
    ? 'text-blue-400 border-blue-400'
    : 'text-blue-600 border-blue-600';

  const shapeVariants = {
    enter: {
      clipPath: shapes === 'circle'
        ? 'circle(0%)'
        : shapes === 'hexagon'
        ? 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)'
        : shapes === 'wave'
        ? 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)'
        : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
      opacity: 0,
    },
    animate: {
      clipPath: shapes === 'circle'
        ? 'circle(100%)'
        : shapes === 'hexagon'
        ? 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)'
        : shapes === 'wave'
        ? 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)'
        : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut' as const,
      },
    },
    exit: {
      clipPath: shapes === 'circle'
        ? 'circle(0%)'
        : shapes === 'hexagon'
        ? 'polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)'
        : shapes === 'wave'
        ? 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)'
        : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const,
      },
    },
  } as const;

  return (
    <motion.div
      className={`rounded-2xl ${bgColor} border ${borderColor} overflow-hidden shadow-xl p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${textColor} mb-2`}>
          {language === 'en' ? 'Vehicle Gallery' : 'যানবাহন গ্যালারি'}
        </h3>
        <p className={secondaryText}>
          {language === 'en'
            ? 'Explore our premium collection with morphing transitions'
            : 'আকৃতি রূপান্তর সহ আমাদের প্রিমিয়াম সংগ্রহ অন্বেষণ করুন'}
        </p>
      </div>

      {/* Morphing Container */}
      <div className="relative w-full aspect-square max-w-md mx-auto mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        {/* SVG Grid Background */}
        <svg
          className="absolute inset-0 w-full h-full text-gray-300 dark:text-gray-700 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>

        {/* Animated border outline */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500/30"
            animate={{
              r: ['45%', '52%', '45%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </svg>

        {/* Images with morphing transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            variants={shapeVariants as any}
            initial="enter"
            animate="animate"
            exit="exit"
          >
            <motion.img
              src={images[currentIndex].src}
              alt={images[currentIndex].name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, rotate: 0 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.8 }}
            />

            {/* Gradient overlay on top */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Shape SVG Outline (optional enhanced visualization) */}
        {shapes === 'blob' && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 200 200"
          >
            <motion.path
              d="M100,20 C140,10 180,30 190,80 C200,130 165,180 100,185 C50,190 20,155 15,100 C10,50 60,15 100,20 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-blue-400/50 dark:text-blue-500/50`}
              animate={{
                d: [
                  'M100,20 C140,10 180,30 190,80 C200,130 165,180 100,185 C50,190 20,155 15,100 C10,50 60,15 100,20 Z',
                  'M100,15 C145,5 185,25 195,85 C205,140 170,190 100,190 C45,190 15,150 10,95 C5,40 55,10 100,15 Z',
                  'M100,20 C140,10 180,30 190,80 C200,130 165,180 100,185 C50,190 20,155 15,100 C10,50 60,15 100,20 Z',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </svg>
        )}
      </div>

      {/* Image Name and Counter */}
      <div className="text-center mb-6">
        <motion.h4
          key={currentIndex}
          className={`text-xl font-bold ${textColor}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {images[currentIndex].name}
        </motion.h4>
        <div className={`text-sm ${secondaryText} mt-2`}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <motion.button
          onClick={handlePrev}
          className={`p-3 rounded-lg border ${borderColor} hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </motion.button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? `w-8 ${accentColor} border`
                  : `w-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className={`p-3 rounded-lg border ${borderColor} hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Shape selector */}
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <p className={`text-sm font-semibold ${textColor} mb-2`}>
          {language === 'en' ? 'Transition Shape:' : 'রূপান্তর আকৃতি:'}
        </p>
        <p className={`text-sm ${secondaryText}`}>
          {language === 'en'
            ? `Using ${shapes} clip-path morphing with SVG enhancements`
            : `${shapes} ক্লিপ-পাথ রূপান্তর এবং SVG উন্নতি ব্যবহার করছি`}
        </p>
      </div>
    </motion.div>
  );
};
