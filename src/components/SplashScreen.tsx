import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Get the logo path - works for both localhost and GitHub Pages
const logoPath = `${import.meta.env.BASE_URL}logo/as.svg`;

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

/**
 * SplashScreen Component
 * 
 * Premium loading animation with:
 * - Animated logo reveal
 * - Particle effects
 * - Progress bar
 * - Smooth fade out transition
 */
export const SplashScreen: React.FC<SplashScreenProps> = memo(({
  onComplete,
  duration = 2500
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Hide splash screen after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px)'
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, #1a0a0a 0%, #0a0a0a 50%, #000 100%)'
            }}
            animate={{
              background: [
                'radial-gradient(circle at center, #1a0a0a 0%, #0a0a0a 50%, #000 100%)',
                'radial-gradient(circle at center, #200000 0%, #0a0a0a 50%, #000 100%)',
                'radial-gradient(circle at center, #1a0a0a 0%, #0a0a0a 50%, #000 100%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#C00000]/50 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>

          {/* Light rays */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-[#C00000]/10 to-transparent"
                style={{
                  transformOrigin: 'center center',
                  rotate: `${i * 30}deg`
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleY: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo container with glow */}
            <motion.div
              className="relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(192, 0, 0, 0.4) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  transform: 'scale(2)'
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1.8, 2.2, 1.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Logo Image - Larger for better visibility */}
              <motion.div
                className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center"
              >
                <motion.img
                  src={logoPath}
                  alt="Auto Spark BD"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.3 
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF1A1A] via-white to-[#C00000] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                AUTO SPARK
              </motion.h1>
              <motion.p
                className="mt-2 text-sm md:text-base text-gray-400 tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Exclusive Cars in Rajshahi
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="mt-8 w-48 md:w-64"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                {/* Background glow */}
                <motion.div
                  className="absolute inset-0 bg-[#C00000]/20"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Progress fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B0000] via-[#C00000] to-[#FF1A1A]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
                {/* Shine effect */}
                <motion.div
                  className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '400%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              
              {/* Loading text */}
              <motion.div
                className="mt-3 flex items-center justify-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-xs text-gray-500 tracking-wider">LOADING</span>
                <motion.span
                  className="flex gap-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1 h-1 bg-[#C00000] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.span>
              </motion.div>
            </motion.div>
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-0 left-0 w-32 h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-4 left-4 w-12 h-[1px] bg-gradient-to-r from-[#C00000]/50 to-transparent" />
            <div className="absolute top-4 left-4 h-12 w-[1px] bg-gradient-to-b from-[#C00000]/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute top-0 right-0 w-32 h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-4 right-4 w-12 h-[1px] bg-gradient-to-l from-[#C00000]/50 to-transparent" />
            <div className="absolute top-4 right-4 h-12 w-[1px] bg-gradient-to-b from-[#C00000]/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute bottom-4 left-4 w-12 h-[1px] bg-gradient-to-r from-[#C00000]/50 to-transparent" />
            <div className="absolute bottom-4 left-4 h-12 w-[1px] bg-gradient-to-t from-[#C00000]/50 to-transparent" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-32 h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute bottom-4 right-4 w-12 h-[1px] bg-gradient-to-l from-[#C00000]/50 to-transparent" />
            <div className="absolute bottom-4 right-4 h-12 w-[1px] bg-gradient-to-t from-[#C00000]/50 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SplashScreen.displayName = 'SplashScreen';

export default SplashScreen;
