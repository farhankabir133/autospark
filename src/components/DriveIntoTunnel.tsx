import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface DriveIntoTunnelProps {
  className?: string;
}

export const DriveIntoTunnel: React.FC<DriveIntoTunnelProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring for scroll
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax transforms for different layers
  const skyY = useTransform(smoothScroll, [0, 1], [0, 100]); // Sky moves slowest
  const cityY = useTransform(smoothScroll, [0, 1], [0, 250]); // City moves medium
  const roadY = useTransform(smoothScroll, [0, 1], [0, 500]); // Road moves fastest
  const scale = useTransform(smoothScroll, [0, 0.5], [1, 1.3]); // Zoom in effect
  const opacity = useTransform(smoothScroll, [0, 0.8, 1], [1, 1, 0]); // Fade out

  // Road line speed
  const roadLineOffset = useTransform(smoothScroll, [0, 1], [0, -2000]);

  // Mouse tracking for subtle head movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      setMouseX(x);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Headlight flicker effect
  const [headlightIntensity, setHeadlightIntensity] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlightIntensity(0.85 + Math.random() * 0.15);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity, scale }}
    >
      {/* ========== SKY LAYER (Slowest) ========== */}
      <motion.div
        className="absolute inset-0"
        style={{ y: skyY }}
      >
        {/* Gradient Sky */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-slate-950 via-indigo-950/80 to-purple-950/60'
            : 'bg-gradient-to-b from-orange-200 via-rose-300/50 to-purple-400/30'
        }`} />

        {/* Stars (dark mode) / Sun rays (light mode) */}
        {isDark ? (
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            {/* Moon */}
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"
              style={{ 
                right: '15%', 
                top: '10%',
                boxShadow: '0 0 60px rgba(255,255,255,0.3)',
                transform: `translateX(${mouseX * -10}px)`,
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            {/* Sun with rays */}
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{ 
                right: '20%', 
                top: '8%',
                background: 'radial-gradient(circle, #FCD34D 0%, #F59E0B 50%, transparent 70%)',
                boxShadow: '0 0 100px rgba(251, 191, 36, 0.6)',
                transform: `translateX(${mouseX * -15}px)`,
              }}
            />
            {/* Light rays */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-b from-yellow-300/30 to-transparent"
                style={{
                  right: `${18 + i * 2}%`,
                  top: '5%',
                  width: '4px',
                  height: '200px',
                  transformOrigin: 'top center',
                  transform: `rotate(${-20 + i * 5}deg)`,
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* ========== CITY LAYER (Medium Speed) ========== */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[60%]"
        style={{ 
          y: cityY,
          x: mouseX * -20,
        }}
      >
        {/* City Skyline - Buildings */}
        <svg 
          className="absolute bottom-[25%] w-full h-[50%]" 
          viewBox="0 0 1920 400" 
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            {/* Building gradient */}
            <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#374151' : '#6B7280'} />
              <stop offset="100%" stopColor={isDark ? '#1F2937' : '#4B5563'} />
            </linearGradient>
            {/* Window glow */}
            <filter id="windowGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Far buildings (silhouette) */}
          <g opacity={isDark ? 0.6 : 0.4}>
            <rect x="50" y="150" width="80" height="250" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="150" y="100" width="60" height="300" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="250" y="180" width="100" height="220" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="400" y="80" width="70" height="320" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="520" y="140" width="90" height="260" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="1300" y="120" width="85" height="280" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="1420" y="160" width="70" height="240" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="1550" y="90" width="95" height="310" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="1700" y="170" width="80" height="230" fill={isDark ? '#1F2937' : '#9CA3AF'} />
            <rect x="1800" y="130" width="70" height="270" fill={isDark ? '#1F2937' : '#9CA3AF'} />
          </g>

          {/* Near buildings with windows */}
          <g>
            {/* Left tall building */}
            <rect x="100" y="120" width="120" height="280" fill="url(#buildingGrad)" />
            {/* Windows */}
            {[...Array(8)].map((_, row) => (
              [...Array(4)].map((_, col) => (
                <motion.rect
                  key={`w1-${row}-${col}`}
                  x={110 + col * 28}
                  y={135 + row * 32}
                  width="18"
                  height="22"
                  fill={isDark ? '#FCD34D' : '#FEF3C7'}
                  opacity={Math.random() > 0.3 ? 0.9 : 0.2}
                  filter="url(#windowGlow)"
                  animate={{ opacity: Math.random() > 0.7 ? [0.9, 0.3, 0.9] : 0.9 }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
                />
              ))
            ))}

            {/* Center skyscraper */}
            <rect x="880" y="50" width="160" height="350" fill="url(#buildingGrad)" />
            <polygon points="880,50 960,0 1040,50" fill={isDark ? '#4B5563' : '#6B7280'} />
            {/* Windows */}
            {[...Array(12)].map((_, row) => (
              [...Array(5)].map((_, col) => (
                <motion.rect
                  key={`w2-${row}-${col}`}
                  x={895 + col * 30}
                  y={60 + row * 28}
                  width="20"
                  height="18"
                  fill={isDark ? '#60A5FA' : '#DBEAFE'}
                  opacity={Math.random() > 0.3 ? 0.9 : 0.2}
                  filter="url(#windowGlow)"
                  animate={{ opacity: Math.random() > 0.7 ? [0.9, 0.4, 0.9] : 0.9 }}
                  transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                />
              ))
            ))}

            {/* Right buildings */}
            <rect x="1650" y="100" width="140" height="300" fill="url(#buildingGrad)" />
            {[...Array(9)].map((_, row) => (
              [...Array(4)].map((_, col) => (
                <motion.rect
                  key={`w3-${row}-${col}`}
                  x={1665 + col * 32}
                  y={115 + row * 30}
                  width="22"
                  height="20"
                  fill={isDark ? '#F472B6' : '#FBCFE8'}
                  opacity={Math.random() > 0.3 ? 0.9 : 0.2}
                  filter="url(#windowGlow)"
                  animate={{ opacity: Math.random() > 0.7 ? [0.9, 0.3, 0.9] : 0.9 }}
                  transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity }}
                />
              ))
            ))}
          </g>

          {/* Cityscape reflection/glow at bottom */}
          <rect x="0" y="380" width="1920" height="20" fill={isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.05)'} />
        </svg>

        {/* City ambient glow */}
        <div className={`absolute bottom-[20%] left-0 right-0 h-32 ${
          isDark 
            ? 'bg-gradient-to-t from-amber-500/10 via-orange-500/5 to-transparent'
            : 'bg-gradient-to-t from-orange-300/20 via-amber-200/10 to-transparent'
        }`} />
      </motion.div>

      {/* ========== ROAD LAYER (Fastest) ========== */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[50%]"
        style={{ 
          y: roadY,
          perspective: '1000px',
        }}
      >
        {/* Road Surface with Perspective */}
        <div 
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background: isDark 
              ? 'linear-gradient(to bottom, #1F2937 0%, #111827 100%)'
              : 'linear-gradient(to bottom, #4B5563 0%, #374151 100%)',
            transform: 'perspective(800px) rotateX(60deg)',
            transformOrigin: 'bottom center',
          }}
        >
          {/* Road texture lines */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 50px,
                ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 51px
              )`,
            }}
          />
        </div>

        {/* Center Road Lines - Animated */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4"
          style={{ 
            height: '150%',
            y: roadLineOffset,
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-full h-16 ${isDark ? 'bg-yellow-400' : 'bg-yellow-500'}`}
              style={{
                bottom: `${i * 100}px`,
                opacity: 0.9,
                boxShadow: isDark ? '0 0 10px rgba(251, 191, 36, 0.5)' : '0 0 8px rgba(234, 179, 8, 0.4)',
              }}
            />
          ))}
        </motion.div>

        {/* Side Lane Markers */}
        <motion.div
          className="absolute left-[20%] bottom-0 w-1"
          style={{ 
            height: '150%',
            y: roadLineOffset,
          }}
        >
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-full h-8 ${isDark ? 'bg-white/60' : 'bg-white/80'}`}
              style={{ bottom: `${i * 60}px` }}
            />
          ))}
        </motion.div>
        <motion.div
          className="absolute right-[20%] bottom-0 w-1"
          style={{ 
            height: '150%',
            y: roadLineOffset,
          }}
        >
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-full h-8 ${isDark ? 'bg-white/60' : 'bg-white/80'}`}
              style={{ bottom: `${i * 60}px` }}
            />
          ))}
        </motion.div>

        {/* Road Edge Lines */}
        <div 
          className={`absolute left-[10%] bottom-0 w-2 h-full ${isDark ? 'bg-white/30' : 'bg-white/50'}`}
          style={{ transform: 'perspective(800px) rotateX(60deg)', transformOrigin: 'bottom center' }}
        />
        <div 
          className={`absolute right-[10%] bottom-0 w-2 h-full ${isDark ? 'bg-white/30' : 'bg-white/50'}`}
          style={{ transform: 'perspective(800px) rotateX(60deg)', transformOrigin: 'bottom center' }}
        />
      </motion.div>

      {/* ========== CAR DASHBOARD VIEW ========== */}
      <div className="absolute inset-x-0 bottom-0 h-[25%] pointer-events-none">
        {/* Dashboard silhouette */}
        <svg 
          className="absolute bottom-0 w-full h-full" 
          viewBox="0 0 1920 300" 
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="dashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#1F2937' : '#374151'} />
              <stop offset="100%" stopColor={isDark ? '#111827' : '#1F2937'} />
            </linearGradient>
          </defs>
          
          {/* Dashboard shape */}
          <path
            d="M0,300 L0,200 Q200,180 400,190 L500,185 Q960,150 1420,185 L1520,190 Q1720,180 1920,200 L1920,300 Z"
            fill="url(#dashGrad)"
          />
          
          {/* Steering wheel hint */}
          <ellipse cx="960" cy="280" rx="120" ry="80" fill={isDark ? '#374151' : '#4B5563'} opacity="0.8" />
          <ellipse cx="960" cy="280" rx="80" ry="50" fill={isDark ? '#1F2937' : '#374151'} />
          
          {/* Speedometer cluster */}
          <circle cx="400" cy="220" r="60" fill={isDark ? '#111827' : '#1F2937'} />
          <circle cx="400" cy="220" r="50" fill={isDark ? '#1F2937' : '#374151'} opacity="0.8" />
          
          {/* RPM cluster */}
          <circle cx="1520" cy="220" r="60" fill={isDark ? '#111827' : '#1F2937'} />
          <circle cx="1520" cy="220" r="50" fill={isDark ? '#1F2937' : '#374151'} opacity="0.8" />
        </svg>

        {/* Speedometer needle animation */}
        <motion.div
          className="absolute left-[19%] bottom-[25%] w-1 h-10 origin-bottom"
          style={{ background: 'linear-gradient(to top, #EF4444, #F87171)' }}
          animate={{ rotate: [-30, 60, 30, 45, 35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Digital speed display */}
        <motion.div
          className="absolute left-[17.5%] bottom-[18%] text-2xl font-mono font-bold text-green-400"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <motion.span
            animate={{ 
              // Simulating speed increasing
            }}
          >
            88
          </motion.span>
          <span className="text-sm ml-1 text-green-400/70">km/h</span>
        </motion.div>
      </div>

      {/* ========== HEADLIGHT GLOW EFFECTS ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left headlight beam */}
        <motion.div
          className="absolute bottom-0 left-[30%] w-[20%] h-[60%]"
          style={{
            background: `linear-gradient(to top, 
              rgba(255,255,255,${0.15 * headlightIntensity}) 0%, 
              rgba(255,255,255,${0.05 * headlightIntensity}) 40%, 
              transparent 100%
            )`,
            clipPath: 'polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)',
            filter: 'blur(20px)',
          }}
        />
        
        {/* Right headlight beam */}
        <motion.div
          className="absolute bottom-0 right-[30%] w-[20%] h-[60%]"
          style={{
            background: `linear-gradient(to top, 
              rgba(255,255,255,${0.15 * headlightIntensity}) 0%, 
              rgba(255,255,255,${0.05 * headlightIntensity}) 40%, 
              transparent 100%
            )`,
            clipPath: 'polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Central merged beam */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[50%]"
          style={{
            background: `radial-gradient(ellipse at bottom, 
              rgba(255,255,255,${0.08 * headlightIntensity}) 0%, 
              transparent 70%
            )`,
            filter: 'blur(30px)',
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* ========== ATMOSPHERIC EFFECTS ========== */}
      {/* Fog/Mist at horizon */}
      <div className={`absolute inset-x-0 bottom-[40%] h-32 ${
        isDark 
          ? 'bg-gradient-to-t from-transparent via-slate-900/50 to-transparent'
          : 'bg-gradient-to-t from-transparent via-white/30 to-transparent'
      }`} style={{ filter: 'blur(10px)' }} />

      {/* Road dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-500/20'}`}
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${Math.random() * 30}%`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Passing street lights (side glow) */}
      <motion.div
        className="absolute left-[5%] top-[40%] w-4 h-4 rounded-full"
        style={{
          background: isDark ? '#FCD34D' : '#F59E0B',
          boxShadow: isDark 
            ? '0 0 30px 15px rgba(251, 191, 36, 0.4)' 
            : '0 0 25px 10px rgba(245, 158, 11, 0.3)',
        }}
        animate={{
          y: [0, 400, 800],
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 0,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute right-[5%] top-[40%] w-4 h-4 rounded-full"
        style={{
          background: isDark ? '#FCD34D' : '#F59E0B',
          boxShadow: isDark 
            ? '0 0 30px 15px rgba(251, 191, 36, 0.4)' 
            : '0 0 25px 10px rgba(245, 158, 11, 0.3)',
        }}
        animate={{
          y: [0, 400, 800],
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 2,
          ease: "linear",
        }}
      />

      {/* Speed lines on sides */}
      <div className="absolute inset-y-0 left-0 w-32 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute h-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-500/10'}`}
            style={{
              left: 0,
              top: `${30 + i * 7}%`,
              width: `${50 + Math.random() * 50}%`,
            }}
            animate={{
              x: [-100, 200],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 w-32 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute h-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-500/10'}`}
            style={{
              right: 0,
              top: `${30 + i * 7}%`,
              width: `${50 + Math.random() * 50}%`,
            }}
            animate={{
              x: [100, -200],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </motion.div>
  );
};

export default DriveIntoTunnel;
