import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  thumbnail?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  className?: string;
  showControls?: boolean;
}

export const VideoPreview = ({
  videoUrl,
  thumbnail,
  autoPlay = false,
  muted = true,
  loop = true,
  onPlay,
  className = '',
  showControls = true,
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showPlayButton, setShowPlayButton] = useState(!autoPlay);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-lg group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnail}
        muted={isMuted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser doesn't support HTML5 video.
      </video>

      {/* Play Button Overlay */}
      {showPlayButton && (
        <motion.button
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handlePlay}
        >
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 hover:bg-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-7 h-7 text-blue-600 ml-1" fill="currentColor" />
          </motion.div>
        </motion.button>
      )}

      {/* Controls Overlay */}
      {showControls && isPlaying && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {isPlaying ? (
                <motion.button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                  onClick={handlePause}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                </motion.button>
              ) : (
                <motion.button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                  onClick={handlePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-4 h-4 text-white" fill="currentColor" />
                </motion.button>
              )}

              <motion.button
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </motion.button>
            </div>

            <div className="text-xs text-white/80">Click to interact</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
