import { motion, AnimatePresence } from 'framer-motion';
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
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    if (isFlipped && isHovered && !flipTimeoutRef.current) {
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
  }, [isFlipped, isHovered, autoFlipDelay]);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsFlipped(!isFlipped);
    AudioManager.playClick();
    onFlipChange?.(!isFlipped);

    // Add ripple effect
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

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-80 h-96 cursor-pointer group preserve-3d`}
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFlip}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Glow effect background */}
      <motion.div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glowColor}`}
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Main flip container */}
      <motion.div
        className="relative w-full h-full rounded-2xl origin-center"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: isHovered ? 5 : 0,
          rotateZ: isHovered ? 2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 40, duration: 0.5 }}
      >
        {/* Front face */}
        <motion.div
          className={`absolute w-full h-full rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgColor} p-6 shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          animate={{
            opacity: isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
          transition={{ duration: 0.3 }}
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
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100"
            animate={{ y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            {isFlipped ? '← Click to flip back' : 'Click to flip →'}
          </motion.div>
        </motion.div>

        {/* Back face */}
        <motion.div
          className={`absolute w-full h-full rounded-2xl border-2 ${borderColor} bg-gradient-to-br ${bgColor} p-6 shadow-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          animate={{
            opacity: isFlipped ? 1 : 0,
            pointerEvents: isFlipped ? 'auto' : 'none',
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full overflow-y-auto">
            {backContent}
          </div>
        </motion.div>
      </motion.div>

      {/* Ripple effects */}
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
          />
        ))}
      </AnimatePresence>

      {/* Decorative corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-3xl"
        animate={isHovered ? { scale: 1.2, opacity: 0.8 } : { scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
