import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { AudioManager } from '../utils/AudioManager';

interface EnhancedFlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  theme: string;
  autoFlipDelay?: number;
  onFlipChange?: (isFlipped: boolean) => void;
  videoUrl?: string;
}

export const EnhancedFlipCard = ({
  frontContent,
  backContent,
  theme,
  autoFlipDelay = 3000,
  onFlipChange,
  videoUrl,
}: EnhancedFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleIdRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isFlipped && isHovered && !flipTimeoutRef.current && !shouldReduceMotion) {
      flipTimeoutRef.current = setTimeout(() => {
        setIsFlipped(false);
        flipTimeoutRef.current = null;
      }, autoFlipDelay);
    }

    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, [isFlipped, isHovered, autoFlipDelay, shouldReduceMotion]);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsFlipped(!isFlipped);
    AudioManager.playClick();
    onFlipChange?.(!isFlipped);

    // Add ripple effect (skip on reduced motion)
    if (!shouldReduceMotion) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: rippleIdRef.current++, x, y };
        setRipples([...ripples, newRipple]);

        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }
    }
  };

  const bgColor = theme === 'dark'
    ? 'from-gray-800 to-gray-900'
    : 'from-white to-gray-50';

  const borderColor = theme === 'dark'
    ? 'border-gray-700'
    : 'border-gray-200';

  const glowColor = theme === 'dark'
    ? 'shadow-[0_0_30px_rgba(59,130,246,0.5)]'
    : 'shadow-[0_0_30px_rgba(59,130,246,0.3)]';

  const transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 400, damping: 40, duration: 0.5 };

  const hoverTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-80 h-96 cursor-pointer group preserve-3d`}
      style={{
        perspective: '1200px',
        willChange: 'transform',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFlip}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
      transition={hoverTransition}
    >
      {/* Subtle ambient glow - only on hover, reduced motion aware */}
      {!shouldReduceMotion && (
        <motion.div
          className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glowColor}`}
          animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ willChange: 'transform, opacity' }}
        />
      )}

      {/* Main flip container */}
      <motion.div
        className="relative w-full h-full rounded-2xl origin-center"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          willChange: 'transform',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: isHovered && !shouldReduceMotion ? 3 : 0,
          rotateZ: isHovered && !shouldReduceMotion ? 1 : 0,
        }}
        transition={transition}
      >
        {/* Front face */}
        <motion.div
          className={`absolute w-full h-full rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgColor} p-6 shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'opacity',
          }}
          animate={{
            opacity: isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
        >
          {/* Video preview overlay - optional */}
          {videoUrl && !isFlipped && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-20 transition-opacity">
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                autoPlay
                loop
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 h-full overflow-hidden">
            {frontContent}
          </div>

          {/* Hover indicator */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100"
              animate={{ y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              style={{ willChange: 'transform, opacity' }}
            >
              {isFlipped ? '← Click to flip back' : 'Click to flip →'}
            </motion.div>
          )}
        </motion.div>

        {/* Back face */}
        <motion.div
          className={`absolute w-full h-full rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgColor} p-6 shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            willChange: 'opacity',
          }}
          animate={{
            opacity: isFlipped ? 1 : 0,
            pointerEvents: isFlipped ? 'auto' : 'none',
          }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
        >
          <div className="h-full overflow-y-auto">
            {backContent}
          </div>
        </motion.div>
      </motion.div>

      {/* Ripple effects - only on non-reduced motion */}
      {!shouldReduceMotion && (
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              initial={{
                width: 0,
                height: 0,
                left: ripple.x,
                top: ripple.y,
                opacity: 1,
              }}
              animate={{
                width: 80,
                height: 80,
                left: ripple.x - 40,
                top: ripple.y - 40,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ willChange: 'width, height, left, top, opacity' }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Decorative corner accent - reduced motion aware */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-3xl"
          animate={isHovered ? { scale: 1.15, opacity: 0.7 } : { scale: 1, opacity: 0.4 }}
          transition={{ duration: 0.3 }}
          style={{ willChange: 'transform, opacity' }}
        />
      )}
    </motion.div>
  );
};