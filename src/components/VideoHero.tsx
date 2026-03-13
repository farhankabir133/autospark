import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Music2, Headphones } from 'lucide-react';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: {
    autoplay?: number;
    mute?: number;
    loop?: number;
    playlist?: string;
    controls?: number;
    showinfo?: number;
    rel?: number;
    modestbranding?: number;
    playsinline?: number;
    iv_load_policy?: number;
    disablekb?: number;
    fs?: number;
    origin?: string;
  };
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
    onError?: (event: { data: number }) => void;
  };
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  destroy: () => void;
}

interface VideoHeroProps {
  videoId?: string;
  className?: string;
}

// YouTube thumbnail URL for lazy loading placeholder
const getYouTubeThumbnail = (videoId: string) => 
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

// Load YouTube IFrame API script
const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (existingScript) {
      // Script is loading, wait for it
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'youtube-iframe-api';
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
    
    document.head.appendChild(script);
  });
};

/**
 * VideoHero Component
 * 
 * Uses YouTube IFrame Player API for reliable mobile autoplay.
 * Browser autoplay policy requires videos to start muted.
 */
export const VideoHero: React.FC<VideoHeroProps> = memo(({ 
  videoId = 'hittSjzZtPg',
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerId = useRef(`yt-player-${Math.random().toString(36).substr(2, 9)}`);
  
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [isHoveringMute, setIsHoveringMute] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load YouTube IFrame API and initialize player
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const initPlayer = async () => {
      await loadYouTubeAPI();
      if (!isMounted) return;
      
      setApiLoaded(true);
      
      // Create the player
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(playerContainerId.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 1, // MUST be muted for mobile autoplay
            loop: 1,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1, // Critical for iOS
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            origin: window.location.origin, // Required for some mobile browsers
          },
          events: {
            onReady: (event) => {
              // Force play on ready - multiple attempts for mobile
              const player = event.target;
              player.mute(); // Ensure muted
              player.playVideo();
              
              // Retry playing after delays (helps with mobile)
              setTimeout(() => {
                if (player && isMounted) {
                  player.playVideo();
                }
              }, 500);
              
              setTimeout(() => {
                if (player && isMounted) {
                  player.playVideo();
                  setIsVideoReady(true);
                }
              }, 1000);
            },
            onStateChange: (event) => {
              const player = event.target;
              
              // Video started playing
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsVideoReady(true);
                retryCount = 0;
              }
              
              // If video pauses or ends, try to play again
              if (event.data === window.YT.PlayerState.PAUSED || 
                  event.data === window.YT.PlayerState.ENDED) {
                player.playVideo();
              }
              
              // Handle buffering - if stuck, retry
              if (event.data === window.YT.PlayerState.BUFFERING) {
                setTimeout(() => {
                  if (player && isMounted && retryCount < maxRetries) {
                    player.playVideo();
                    retryCount++;
                  }
                }, 2000);
              }
            },
            onError: () => {
              // On error, still show as ready to hide loading state
              setIsVideoReady(true);
            }
          }
        });
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Handle visibility change - resume video when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && playerRef.current) {
        // Try to resume playback when page becomes visible
        playerRef.current.playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle page focus - also try to play on focus (helps mobile)
  useEffect(() => {
    const handleFocus = () => {
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Handle dynamic viewport height for mobile browsers (address bar hide/show)
  useEffect(() => {
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh-fix', `${vh * 100}px`);
    };

    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', setVhProperty);

    return () => {
      window.removeEventListener('resize', setVhProperty);
      window.removeEventListener('orientationchange', setVhProperty);
    };
  }, []);

  // Preload thumbnail
  useEffect(() => {
    const img = new Image();
    img.onload = () => setThumbnailLoaded(true);
    img.src = getYouTubeThumbnail(videoId);
  }, [videoId]);

  // Enable sound - uses YouTube API
  const enableSound = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.unMute();
    }
    setIsMuted(false);
    setHasUserInteracted(true);
    setShowSoundPrompt(false);
  }, []);

  // Toggle mute using YouTube API
  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
    }
    setIsMuted(!isMuted);
    setHasUserInteracted(true);
  }, [isMuted]);

  // Hide sound prompt after 15 seconds
  useEffect(() => {
    if (showSoundPrompt && isVideoReady) {
      const timer = setTimeout(() => {
        setShowSoundPrompt(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [showSoundPrompt, isVideoReady]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden contain-paint ${className}`}
      style={{
        minHeight: '100vh', 
        minWidth: '100vw',
        height: 'var(--vh-fix, 100vh)',
        width: '100vw',
      }}
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
              className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Video Container - Using IFrame API */}
      {apiLoaded && (
        <div 
          className="absolute z-[2]"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(100vw, calc(100vh * 16 / 9))',
            height: 'max(100vh, calc(100vw * 9 / 16))',
            minWidth: '100vw',
            minHeight: '100vh',
            opacity: isVideoReady ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
            pointerEvents: 'none',
          }}
        >
          <div 
            id={playerContainerId.current}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
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

      {/* 🔊 PROMINENT "ENABLE SOUND" PROMPT - Shows when video is ready but muted */}
      <AnimatePresence>
        {isVideoReady && isMuted && showSoundPrompt && !hasUserInteracted && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Backdrop to draw attention */}
            <motion.div 
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Enable Sound Button */}
            <motion.button
              className="relative group"
              onClick={enableSound}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(192, 0, 0, 0.7)',
                    '0 0 0 30px rgba(192, 0, 0, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Button Container */}
              <div className="relative px-8 py-5 md:px-12 md:py-6 rounded-full bg-gradient-to-r from-[#8B0000] via-[#C00000] to-[#FF1A1A] shadow-2xl">
                {/* Inner glow */}
                <div className="absolute inset-[2px] rounded-full bg-black/20 backdrop-blur-sm" />
                
                {/* Content */}
                <div className="relative flex items-center gap-4 text-white">
                  {/* Animated Headphones Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Headphones className="w-7 h-7 md:w-8 md:h-8" />
                  </motion.div>

                  <div className="text-left">
                    <div className="text-lg md:text-xl font-bold tracking-wide">
                      🔊 Enable Sound
                    </div>
                    <div className="text-xs md:text-sm text-white/70">
                      Click to experience with audio
                    </div>
                  </div>

                  {/* Sound Waves */}
                  <div className="flex items-center gap-0.5 ml-2">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-white rounded-full"
                        animate={{
                          height: ['8px', '24px', '8px'],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Skip text */}
              <motion.p
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Or continue without sound
              </motion.p>
            </motion.button>

            {/* Skip Button */}
            <motion.button
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 text-white/60 hover:text-white text-sm transition-colors"
              onClick={() => setShowSoundPrompt(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              Continue without sound →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎵 MUTE/UNMUTE BUTTON - Always visible after user interacts or prompt dismissed */}
      <AnimatePresence>
        {isVideoReady && (hasUserInteracted || !showSoundPrompt) && (
          <motion.div
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20"
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
                        '0 0 0 0 rgba(192, 0, 0, 0.6)',
                        '0 0 0 15px rgba(192, 0, 0, 0)',
                        '0 0 0 0 rgba(192, 0, 0, 0.6)',
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
                    : 'linear-gradient(135deg, #8B0000 0%, #C00000 50%, #FF1A1A 100%)',
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
                            <Volume2 className="w-4 h-4 text-pink-400" />
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
        {isVideoReady && !isMuted && !showSoundPrompt && (
          <motion.div
            className="absolute top-20 md:top-24 right-4 md:right-8 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C00000]/20 to-[#FF1A1A]/20 backdrop-blur-sm border border-white/10">
              {/* Animated Equalizer Bars */}
              <div className="flex items-end gap-0.5 h-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-[#C00000] to-[#FF1A1A] rounded-full"
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
