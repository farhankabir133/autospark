import { memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

/**
 * AnimatedBackground Component
 * 
 * Premium animated background with:
 * - Animated gradient background (dark mode: red-black, light mode: subtle red-white)
 * - Floating nano particles
 * - Highly visible animated light rays
 * - Works in both light and dark modes
 */
export const DarkModeBackground: React.FC = memo(() => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* === DARK MODE BACKGROUND === */}
      {isDark && (
        <>
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, #1a0808 0%, #0d0505 30%, #0a0a0a 60%, #050505 100%)'
            }}
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 0%, #1a0808 0%, #0d0505 30%, #0a0a0a 60%, #050505 100%)',
                'radial-gradient(ellipse at 50% 0%, #250808 0%, #0d0505 30%, #0a0a0a 60%, #050505 100%)',
                'radial-gradient(ellipse at 50% 0%, #1a0808 0%, #0d0505 30%, #0a0a0a 60%, #050505 100%)'
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Animated red glow at top */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[600px]"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(192, 0, 0, 0.15) 0%, transparent 60%)'
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Floating nano particles */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={`nano-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${1 + Math.random() * 3}px`,
                  height: `${1 + Math.random() * 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(255, 50, 50, ${0.4 + Math.random() * 0.5})`,
                  boxShadow: '0 0 6px rgba(255, 50, 50, 0.6)'
                }}
                animate={{
                  y: [0, -100 - Math.random() * 80, 0],
                  x: [0, (Math.random() - 0.5) * 50, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>

          {/* Ambient corner glows */}
          <motion.div
            className="absolute bottom-0 left-0 w-[700px] h-[700px]"
            style={{
              background: 'radial-gradient(circle at bottom left, rgba(192, 0, 0, 0.08) 0%, transparent 50%)'
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px]"
            style={{
              background: 'radial-gradient(circle at top right, rgba(200, 0, 0, 0.06) 0%, transparent 50%)'
            }}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      {/* === LIGHT MODE BACKGROUND === */}
      {!isDark && (
        <>
          {/* Subtle light gradient background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, #fff5f5 0%, #ffffff 30%, #fafafa 100%)'
            }}
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 0%, #fff5f5 0%, #ffffff 30%, #fafafa 100%)',
                'radial-gradient(ellipse at 50% 0%, #fff0f0 0%, #ffffff 30%, #fafafa 100%)',
                'radial-gradient(ellipse at 50% 0%, #fff5f5 0%, #ffffff 30%, #fafafa 100%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Subtle red accent glow at top for light mode */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[400px]"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(192, 0, 0, 0.04) 0%, transparent 70%)'
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* === ANIMATED RAYS - VISIBLE IN BOTH MODES === */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary rotating rays from center-top */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={`ray-primary-${i}`}
            className="absolute left-1/2 top-0"
            style={{
              width: isDark ? '3px' : '2px',
              height: '120%',
              background: isDark 
                ? `linear-gradient(to bottom, rgba(255, 50, 50, ${0.4 - i * 0.015}) 0%, rgba(192, 0, 0, 0.2) 20%, transparent 50%)`
                : `linear-gradient(to bottom, rgba(192, 0, 0, ${0.15 - i * 0.005}) 0%, rgba(192, 0, 0, 0.05) 30%, transparent 60%)`,
              transformOrigin: 'top center',
              transform: `rotate(${i * 22.5}deg) translateX(-50%)`,
              filter: isDark ? 'blur(1px)' : 'blur(0.5px)'
            }}
            animate={{
              opacity: isDark ? [0.3, 0.8, 0.3] : [0.2, 0.5, 0.2],
              scaleY: [0.8, 1.1, 0.8]
            }}
            transition={{
              duration: 3 + (i % 4) * 0.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Secondary thinner rays for more density */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={`ray-secondary-${i}`}
            className="absolute left-1/2 top-0"
            style={{
              width: isDark ? '1.5px' : '1px',
              height: '100%',
              background: isDark 
                ? `linear-gradient(to bottom, rgba(255, 80, 80, ${0.3 - i * 0.01}) 0%, transparent 40%)`
                : `linear-gradient(to bottom, rgba(200, 0, 0, ${0.1 - i * 0.003}) 0%, transparent 50%)`,
              transformOrigin: 'top center',
              transform: `rotate(${i * 22.5 + 11.25}deg) translateX(-50%)`,
              filter: 'blur(0.5px)'
            }}
            animate={{
              opacity: isDark ? [0.2, 0.6, 0.2] : [0.1, 0.3, 0.1],
              scaleY: [0.9, 1.15, 0.9]
            }}
            transition={{
              duration: 4 + (i % 3) * 0.6,
              repeat: Infinity,
              delay: i * 0.2 + 0.5,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Pulsing center glow */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(255, 50, 50, 0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(192, 0, 0, 0.15) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: isDark ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* === SWEEPING RAY ANIMATION === */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sweeping spotlight effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: '4px',
            height: '150%',
            background: isDark 
              ? 'linear-gradient(to bottom, rgba(255, 100, 100, 0.6) 0%, rgba(192, 0, 0, 0.3) 30%, transparent 60%)'
              : 'linear-gradient(to bottom, rgba(192, 0, 0, 0.2) 0%, rgba(192, 0, 0, 0.1) 30%, transparent 50%)',
            transformOrigin: 'top center',
            filter: isDark ? 'blur(2px)' : 'blur(1px)'
          }}
          animate={{
            rotate: [-60, 60, -60]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Secondary sweeping ray (opposite direction) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: '3px',
            height: '130%',
            background: isDark 
              ? 'linear-gradient(to bottom, rgba(255, 80, 80, 0.4) 0%, transparent 50%)'
              : 'linear-gradient(to bottom, rgba(200, 0, 0, 0.15) 0%, transparent 40%)',
            transformOrigin: 'top center',
            filter: 'blur(1px)'
          }}
          animate={{
            rotate: [45, -45, 45]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </div>

      {/* Dark mode only: Noise texture and vignette */}
      {isDark && (
        <>
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)'
            }}
          />
        </>
      )}
    </div>
  );
});

DarkModeBackground.displayName = 'DarkModeBackground';

DarkModeBackground.displayName = 'DarkModeBackground';
