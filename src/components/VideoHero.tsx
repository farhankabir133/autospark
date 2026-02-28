import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Music, Music2 } from 'lucide-react';

interface VideoHeroProps {
  videoId?: string;
  className?: string;
}

// YouTube thumbnail URL for lazy loading placeholder
const getYouTubeThumbnail = (videoId: string) => 
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

// Memoized component for performance
export const VideoHero: React.FC<VideoHeroProps> = memo(({ 
  videoId = 'JOVY3hD4nLM',
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  // Sound is ON by default
  const [isMuted, setIsMuted] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [isHoveringMute, setIsHoveringMute] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShouldLoadVideo(true), 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload thumbnail
  useEffect(() => {
    const img = new Image();
    img.onload = () => setThumbnailLoaded(true);
    img.src = getYouTubeThumbnail(videoId);
  }, [videoId]);

  // Handle video ready state
  const handleVideoLoad = useCallback(() => {
    setTimeout(() => setIsVideoReady(true), 500);
  }, []);

  // Toggle mute with animation feedback
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // YouTube embed URL - Sound ON by default (mute=0)
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden contain-paint ${className}`}
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      {/* Base Background */}
      <div className="absolute inset-0 bg-black" aria-hidden="true" />

      {/* Thumbnail Placeholder */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: thumbnailLoaded ? `url(${getYouTubeThumbnail(videoId)})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isVideoReady ? 0 : 1,
          transition: 'opacity 0.5s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Loading Indicator */}
      <AnimatePresence>
        {!isVideoReady && (
          <motion.div
            className="absolute inset-0 z-[5] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              onClick={() => setShouldLoadVideo(true)}
              role="button"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Video - Sound ON by default */}
      {shouldLoadVideo && (
        <div 
          className="absolute z-[2]"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(100vw, 177.78vh)',
            height: 'max(100vh, 56.25vw)',
            opacity: isVideoReady ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <iframe
            src={embedUrl}
            title="AutoSpark Video Background"
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none', pointerEvents: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="lazy"
            onLoad={handleVideoLoad}
          />
        </div>
      )}

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[3] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
          }}
        />
      </div>

      {/* Corner Accents */}
      <div className="absolute inset-0 z-[4] pointer-events-none" aria-hidden="true">
        <div className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-white/40 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
        <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
        <div className="absolute bottom-4 left-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-white/40 to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-white/40 to-transparent" />
        </div>
        <div className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-white/40 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-white/40 to-transparent" />
        </div>
      </div>

      {/* 🎵 PUNCHY MUTE BUTTON - Always Visible */}
      <AnimatePresence>
        {isVideoReady && (
          <motion.div
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 15,
              delay: 0.3 
            }}
          >
            <motion.button
              className="relative group"
              onClick={toggleMute}
              onMouseEnter={() => setIsHoveringMute(true)}
              onMouseLeave={() => setIsHoveringMute(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: isMuted 
                    ? '0 0 0 0 rgba(239, 68, 68, 0)' 
                    : [
                        '0 0 0 0 rgba(59, 130, 246, 0.6)',
                        '0 0 0 15px rgba(59, 130, 246, 0)',
                        '0 0 0 0 rgba(59, 130, 246, 0.6)',
                      ],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: isMuted ? 0 : Infinity,
                  ease: 'easeOut' 
                }}
              />

              {/* Animated Background */}
              <motion.div
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden"
                animate={{
                  background: isMuted 
                    ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Inner Glass Effect */}
                <div className="absolute inset-[2px] rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  
                  {/* Sound Waves Animation (when unmuted) */}
                  {!isMuted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-full h-full rounded-full border border-white/20"
                          animate={{
                            scale: [1, 1.5 + i * 0.3],
                            opacity: [0.4, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Icon Container */}
                  <motion.div
                    className="relative z-10"
                    animate={{ 
                      rotate: isMuted ? 0 : [0, -5, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: isMuted ? 0 : Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isMuted ? (
                        <motion.div
                          key="muted"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <VolumeX className="w-6 h-6 md:w-7 md:h-7 text-gray-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="unmuted"
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -180 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <Volume2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                  animate={{
                    x: isHoveringMute ? ['0%', '100%'] : '0%',
                  }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              {/* Tooltip Label */}
              <AnimatePresence>
                {isHoveringMute && (
                  <motion.div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 shadow-xl">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        {isMuted ? (
                          <>
                            <Music2 className="w-4 h-4 text-blue-400" />
                            <span>Turn On Sound</span>
                          </>
                        ) : (
                          <>
                            <Music className="w-4 h-4 text-pink-400" />
                            <span>Mute Sound</span>
                          </>
                        )}
                      </span>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-black/80 rotate-45 border-r border-b border-white/10" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Music Note Particles (when sound is on) */}
              {!isMuted && (
                <div className="absolute -inset-4 pointer-events-none overflow-hidden">
                  {['🎵', '🎶', '♪', '♫'].map((note, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-sm"
                      style={{
                        left: `${20 + i * 20}%`,
                        bottom: 0,
                      }}
                      animate={{
                        y: [0, -40, -60],
                        x: [0, (i % 2 === 0 ? 10 : -10), (i % 2 === 0 ? -5 : 5)],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, i % 2 === 0 ? 15 : -15, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeOut',
                      }}
                    >
                      {note}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound Status Indicator - Top Right */}
      <AnimatePresence>
        {isVideoReady && !isMuted && (
          <motion.div
            className="absolute top-20 md:top-24 right-4 md:right-8 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
              {/* Animated Equalizer Bars */}
              <div className="flex items-end gap-0.5 h-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                    animate={{
                      height: ['30%', '100%', '50%', '80%', '30%'],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-white/80">Sound On</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

VideoHero.displayName = 'VideoHero';

export default VideoHero;
