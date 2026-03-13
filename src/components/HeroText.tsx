import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroTextProps {
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * Premium Hero Text Component
 * Features:
 * - Animated gradient text with shimmer effect
 * - Backdrop blur glass container for readability
 * - Staggered letter animations
 * - Floating/breathing animation
 * - Text shadow for depth
 * - Glowing underline accent
 */
export const HeroText = memo<HeroTextProps>(({ title, subtitle, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Split title into words for staggered animation
  const words = title.split(' ');

  return (
    <div className={`relative ${className}`}>
      {/* Backdrop Blur Container - Subtle glass effect for readability */}
      <motion.div
        className="relative px-6 py-8 md:px-12 md:py-12 rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.1)',
              '0 0 40px rgba(139, 92, 246, 0.15)',
              '0 0 20px rgba(236, 72, 153, 0.1)',
              '0 0 40px rgba(59, 130, 246, 0.15)',
              '0 0 20px rgba(59, 130, 246, 0.1)',
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Main Title */}
        <AnimatePresence>
          {isVisible && (
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 text-center leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em]">
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={`${wordIndex}-${charIndex}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 150,
                        damping: 12,
                        delay: 0.5 + (wordIndex * 0.1) + (charIndex * 0.03),
                      }}
                      style={{
                        // Gradient text with animation
                        background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 25%, #ffffff 50%, #a78bfa 75%, #ffffff 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        // Strong text shadow for visibility
                        textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)',
                        filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))',
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}

              {/* Animated Shimmer Effect */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
              />
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Glowing Divider Line */}
        <motion.div
          className="relative mx-auto mb-4 md:mb-6 h-[2px] overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #8b5cf6 50%, #ec4899 80%, transparent 100%)',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Traveling Light */}
          <motion.div
            className="absolute top-0 w-20 h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            }}
            animate={{
              left: ['-20%', '120%'],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          />
        </motion.div>

        {/* Subtitle with Typewriter Effect */}
        <AnimatePresence>
          {isVisible && (
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              style={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)',
                letterSpacing: '0.05em',
              }}
            >
              {subtitle.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.02,
                    delay: 1.8 + index * 0.02,
                  }}
                  className="inline-block"
                  style={{
                    textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Floating Accent Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `hsl(${220 + i * 30}, 80%, 70%)`,
                left: `${15 + i * 15}%`,
                top: '80%',
                boxShadow: `0 0 10px hsl(${220 + i * 30}, 80%, 70%)`,
              }}
              animate={{
                y: [-10, -40, -10],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Subtle Floating Animation for entire container */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
});

HeroText.displayName = 'HeroText';

export default HeroText;
