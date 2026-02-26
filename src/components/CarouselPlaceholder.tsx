import { motion } from 'framer-motion';

interface CarouselPlaceholderProps {
  theme: string;
  showLoadingText?: boolean;
}

export const CarouselPlaceholder = ({
  theme,
  showLoadingText = true,
}: CarouselPlaceholderProps) => {
  const baseShimmerGradient = theme === 'dark'
    ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
    : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)';

  const shimmerVariants = {
    initial: { backgroundPosition: '200% center' },
    animate: {
      backgroundPosition: '-200% center',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      className={`relative w-full h-96 rounded-3xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main shimmer overlay */}
      <motion.div
        className="absolute inset-0"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          backgroundImage: baseShimmerGradient,
          backgroundSize: '200% center',
          opacity: 0.6,
        }}
      />

      {/* Content loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Animated circles */}
          <div className="flex justify-center items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                }`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          {showLoadingText && (
            <motion.p
              className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading vehicle image...
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Animated gradient overlay */}
      <motion.div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
            : 'bg-gradient-to-br from-blue-300/5 to-purple-300/5'
        }`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};
