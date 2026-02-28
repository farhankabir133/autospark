import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay to prioritize FCP
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
    // Delay to allow iframe to fully render
    setTimeout(() => setIsVideoReady(true), 500);
  }, []);

  // YouTube embed URL - optimized for performance
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden contain-paint ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      // Explicit dimensions to prevent CLS
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      {/* Base Background - Prevents flash of white */}
      <div className="absolute inset-0 bg-black" aria-hidden="true" />

      {/* Thumbnail Placeholder - Shows immediately for better LCP */}
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

      {/* Loading Indicator - Only shows before video loads */}
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

      {/* YouTube Video - Lazy Loaded */}
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

      {/* Cinematic Overlays - Static, no animations for performance */}
      <div className="absolute inset-0 z-[3] pointer-events-none" aria-hidden="true">
        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Radial vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
          }}
        />
      </div>

      {/* Corner Accents - Static positioning */}
      <div className="absolute inset-0 z-[4] pointer-events-none" aria-hidden="true">
        {/* Top-left */}
        <div className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-white/40 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
        {/* Top-right */}
        <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
        {/* Bottom-left */}
        <div className="absolute bottom-4 left-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-white/40 to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-white/40 to-transparent" />
        </div>
        {/* Bottom-right */}
        <div className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-white/40 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-white/40 to-transparent" />
        </div>
      </div>

      {/* Video Controls - Minimal for performance */}
      <AnimatePresence>
        {showControls && isVideoReady && (
          <motion.div
            className="absolute bottom-20 md:bottom-28 left-1/2 z-20"
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50 transition-colors"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

VideoHero.displayName = 'VideoHero';

export default VideoHero;
