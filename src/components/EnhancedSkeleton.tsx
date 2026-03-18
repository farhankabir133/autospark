import { motion } from 'framer-motion';

interface EnhancedSkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle' | 'card' | 'flip-card' | 'carousel' | 'badge';
  width?: string | number;
  height?: string | number;
  count?: number;
  theme: string;
  className?: string;
}

export const EnhancedSkeleton = ({
  variant = 'rectangle',
  width = '100%',
  height = '20px',
  count = 1,
  theme,
  className = '',
}: EnhancedSkeletonProps) => {
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

  const baseShimmerGradient = theme === 'dark'
    ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
    : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)';

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <motion.div
            className="rounded-lg"
            variants={shimmerVariants as any}
            initial="initial"
            animate="animate"
            style={{
              width: width,
              height: height,
              backgroundImage: baseShimmerGradient,
              backgroundSize: '200% center',
            }}
          />
        );

      case 'circle':
        return (
          <motion.div
            className="rounded-full"
            variants={shimmerVariants as any}
            initial="initial"
            animate="animate"
            style={{
              width: width || height,
              height: height || width,
              backgroundImage: baseShimmerGradient,
              backgroundSize: '200% center',
            }}
          />
        );

      case 'rectangle':
        return (
          <motion.div
            className="rounded-lg"
            variants={shimmerVariants as any}
            initial="initial"
            animate="animate"
            style={{
              width: width,
              height: height,
              backgroundImage: baseShimmerGradient,
              backgroundSize: '200% center',
            }}
          />
        );

      case 'card':
        return (
          <motion.div
            className={`rounded-2xl p-6 space-y-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header skeleton */}
            <motion.div
              variants={shimmerVariants as any}
              initial="initial"
              animate="animate"
              className="rounded-lg"
              style={{
                height: '24px',
                width: '60%',
                backgroundImage: baseShimmerGradient,
                backgroundSize: '200% center',
              }}
            />

            {/* Content lines */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={shimmerVariants as any}
                initial="initial"
                animate="animate"
                className="rounded-lg"
                style={{
                  height: '16px',
                  width: i === 2 ? '80%' : '100%',
                  backgroundImage: baseShimmerGradient,
                  backgroundSize: '200% center',
                }}
              />
            ))}

            {/* Footer skeleton */}
            <motion.div
              variants={shimmerVariants as any}
              initial="initial"
              animate="animate"
              className="rounded-lg mt-4"
              style={{
                height: '40px',
                width: '100%',
                backgroundImage: baseShimmerGradient,
                backgroundSize: '200% center',
              }}
            />
          </motion.div>
        );

      case 'flip-card':
        return (
          <motion.div
            className={`rounded-2xl h-32 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full rounded-2xl"
              variants={shimmerVariants as any}
              initial="initial"
              animate="animate"
              style={{
                backgroundImage: baseShimmerGradient,
                backgroundSize: '200% center',
              }}
            />
          </motion.div>
        );

      case 'carousel':
        return (
          <motion.div
            className={`rounded-3xl w-full h-96 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full h-full rounded-3xl"
              variants={shimmerVariants as any}
              initial="initial"
              animate="animate"
              style={{
                backgroundImage: baseShimmerGradient,
                backgroundSize: '200% center',
              }}
            />
          </motion.div>
        );

      case 'badge':
        return (
          <motion.div
            className="rounded-full px-4 py-2 w-24 h-8"
            variants={shimmerVariants as any}
            initial="initial"
            animate="animate"
            style={{
              backgroundImage: baseShimmerGradient,
              backgroundSize: '200% center',
            }}
          />
        );

      default:
        return null;
    }
  };

  if (count && count > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return <div className={className}>{renderSkeleton()}</div>;
};
