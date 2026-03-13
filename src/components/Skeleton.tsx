import { motion } from 'framer-motion';

type SkeletonType = 'text' | 'circle' | 'rectangle' | 'card';

interface SkeletonProps {
  type?: SkeletonType;
  width?: string | number;
  height?: string | number;
  count?: number;
  theme: string;
  className?: string;
}



export const Skeleton = ({
  type = 'rectangle',
  width = '100%',
  height = '20px',
  count = 1,
  theme,
  className = '',
}: SkeletonProps) => {
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const shaderColor =
    theme === 'dark'
      ? 'linear-gradient(90deg, #1f2937, #374151, #1f2937)'
      : 'linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb)';

  const getShape = () => {
    switch (type) {
      case 'circle':
        return <div className={`w-10 h-10 rounded-full ${bgColor}`} />;
      case 'text':
        return (
          <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={`${bgColor} rounded h-4`}
                style={{
                  width: i === count - 1 ? '80%' : '100%',
                }}
              />
            ))}
          </div>
        );
      case 'card':
        return (
          <div className={`p-4 ${bgColor} rounded-lg space-y-3`}>
            <div className={`h-40 ${bgColor} rounded`} />
            <div className={`h-4 ${bgColor} rounded w-3/4`} />
            <div className={`h-4 ${bgColor} rounded w-1/2`} />
          </div>
        );
      default:
        return (
          <div
            className={`${bgColor} rounded`}
            style={{ width, height }}
          />
        );
    }
  };

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      animate={{
        backgroundPosition: ['200% center', '-200% center'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        background: shaderColor,
        backgroundSize: '200% 100%',
      }}
      layout
    >
      {getShape()}
    </motion.div>
  );
};

interface SkeletonLoaderProps {
  count?: number;
  type?: SkeletonType;
  theme: string;
}

export const SkeletonLoader = ({
  count = 3,
  type = 'card',
  theme,
}: SkeletonLoaderProps) => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Skeleton type={type} theme={theme} />
        </motion.div>
      ))}
    </motion.div>
  );
};
