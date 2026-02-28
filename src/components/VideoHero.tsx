import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoHeroProps {
  videoId?: string;
  className?: string;
}

export const VideoHero: React.FC<VideoHeroProps> = ({ 
  videoId = 'JOVY3hD4nLM',
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  
  // Mouse tracking for interactive glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation
  const springConfig = { stiffness: 100, damping: 30 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  // Handle mouse movement for interactive effects
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // YouTube embed URL - fullscreen background optimized
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&start=0`;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Base Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Cinematic Loading Animation */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div
                className="w-32 h-32 rounded-full border-2 border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Inner ring */}
              <motion.div
                className="absolute inset-4 rounded-full border border-transparent border-b-cyan-400"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Center pulse */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              </motion.div>
            </div>
            
            {/* Loading text */}
            <motion.div
              className="mt-8 flex flex-col items-center"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-white/60 text-sm font-light tracking-[0.3em] uppercase">
                Loading Experience
              </p>
              <div className="mt-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-500"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN VIDEO BACKGROUND - CENTERED & COVER */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Video Container - Full Cover with Center Focus */}
        <div 
          className="absolute"
          style={{
            // Center the video and scale to cover entire viewport
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            // Scale to cover - whichever dimension is larger
            width: 'max(100vw, 177.78vh)', // 16:9 aspect ratio width
            height: 'max(100vh, 56.25vw)', // 16:9 aspect ratio height
          }}
        >
          <iframe
            src={embedUrl}
            title="AutoSpark Video Background"
            className="absolute inset-0 w-full h-full"
            style={{ 
              border: 'none',
              pointerEvents: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* Cinematic Overlays for Text Readability */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Top gradient - for header/navigation area */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        
        {/* Bottom gradient - for content area */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Subtle side vignettes */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/30 to-transparent" />
        
        {/* Center radial vignette - keeps focus on center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)'
          }}
        />
      </div>

      {/* Animated Floating Particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`,
            }}
            animate={{
              y: [0, -60 - Math.random() * 40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Interactive Mouse Glow Effect */}
      <motion.div
        className="absolute z-[3] pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          left: glowX,
          top: glowY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 70%)',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Cinematic Corner Accents */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        {[
          { pos: 'top-6 left-6', rotate: '' },
          { pos: 'top-6 right-6', rotate: 'rotate-90' },
          { pos: 'bottom-6 right-6', rotate: 'rotate-180' },
          { pos: 'bottom-6 left-6', rotate: '-rotate-90' }
        ].map((corner, i) => (
          <motion.div
            key={i}
            className={`absolute ${corner.pos} ${corner.rotate} w-12 h-12 md:w-20 md:h-20`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-white/50 to-transparent" />
            <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Horizontal Scan Line Effect */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent 100%)',
          boxShadow: '0 0 15px rgba(255,255,255,0.1)',
        }}
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      {/* Film Grain Texture */}
      <div 
        className="absolute inset-0 z-[6] pointer-events-none opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Interactive Video Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute bottom-24 md:bottom-32 left-1/2 z-20"
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              {/* Play/Pause Button */}
              <motion.button
                className="p-3 rounded-full hover:bg-white/10 text-white transition-all duration-200"
                whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>

              {/* Divider */}
              <div className="w-px h-8 bg-white/20" />

              {/* Mute/Unmute Button */}
              <motion.button
                className="p-3 rounded-full hover:bg-white/10 text-white transition-all duration-200"
                whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </motion.button>

              {/* Live Indicator */}
              <div className="hidden sm:flex items-center gap-2 pl-3 pr-1 text-white/80">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-red-500"
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [1, 0.6, 1],
                    boxShadow: ['0 0 0 0 rgba(239,68,68,0.4)', '0 0 0 8px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0.4)']
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs font-semibold tracking-widest uppercase">Live</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoHero;
