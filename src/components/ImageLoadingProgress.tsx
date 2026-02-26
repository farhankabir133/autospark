import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ImageLoadingProgressProps {
  isLoading: boolean;
  progress?: number;
  theme: string;
  showPercentage?: boolean;
}

export const ImageLoadingProgress = ({
  isLoading,
  progress = 0,
  theme,
  showPercentage = true,
}: ImageLoadingProgressProps) => {
  const [displayProgress, setDisplayProgress] = useState(progress);

  // Simulate progress increment while loading
  useEffect(() => {
    if (!isLoading) {
      setDisplayProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        // Slow down as progress increases to avoid reaching 100% too quickly
        if (prev < 50) {
          return prev + Math.random() * 15;
        } else if (prev < 90) {
          return prev + Math.random() * 5;
        }
        return prev + Math.random() * 2;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Ensure progress doesn't exceed limits
  const clampedProgress = Math.min(Math.floor(displayProgress), isLoading ? 99 : 100);

  if (!isLoading && clampedProgress >= 100) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top progress bar */}
      <motion.div
        className={`absolute top-0 left-0 h-1 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}
        initial={{ width: '0%' }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ type: 'spring', damping: 30, stiffness: 100 }}
      />

      {/* Loading overlay with progress info */}
      {clampedProgress < 50 && isLoading && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
            theme === 'dark'
              ? 'bg-gray-900/30'
              : 'bg-white/30'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`text-center p-6 rounded-xl backdrop-blur-md ${
              theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white/50 border border-gray-300'
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Circular progress indicator */}
            <motion.svg
              className="w-16 h-16 mx-auto mb-4"
              viewBox="0 0 100 100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                strokeWidth="4"
              />

              {/* Progress circle with animation */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
                strokeWidth="4"
                strokeDasharray="282.7"
                strokeLinecap="round"
                animate={{
                  strokeDashoffset: 282.7 - (clampedProgress / 100) * 282.7,
                  rotate: 360,
                }}
                transition={{
                  strokeDashoffset: { type: 'spring', damping: 30, stiffness: 100 },
                  rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                }}
                transformOrigin="50px 50px"
                style={{ transform: 'rotate(-90deg)' }}
              />
            </motion.svg>

            {/* Progress text */}
            {showPercentage && (
              <motion.div className="text-center">
                <motion.p
                  className={`text-2xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
                  key={clampedProgress}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {clampedProgress}%
                </motion.p>
                <p
                  className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Loading 360° images...
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
