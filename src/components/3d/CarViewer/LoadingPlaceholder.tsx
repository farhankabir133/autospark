/**
 * LoadingPlaceholder Component
 * 
 * Beautiful loading states for the 3D viewer including:
 * - Animated skeleton loader
 * - Progress indicator
 * - Vehicle silhouette animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Car, Loader2 } from 'lucide-react';
import { LoadingPlaceholderProps } from './types';

/**
 * Main loading placeholder component
 */
export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  progress = 0,
  message = 'Loading 3D model...',
  vehicleName,
  className = '',
}) => {
  return (
    <div 
      className={`
        absolute inset-0 flex flex-col items-center justify-center
        bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900
        ${className}
      `}
    >
      {/* Animated car silhouette */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 blur-2xl bg-blue-400/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Car icon with rotation */}
        <motion.div
          className="relative z-10"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Car className="w-24 h-24 text-blue-500 dark:text-blue-400" strokeWidth={1} />
        </motion.div>

        {/* Scanning line effect */}
        <motion.div
          className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          animate={{
            top: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
            {message}
          </p>
        </div>
        
        {vehicleName && (
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {vehicleName}
          </p>
        )}
      </motion.div>

      {/* Progress bar */}
      {progress > 0 && (
        <motion.div
          className="w-48 mt-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
        >
          <div className="h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}

      {/* Animated dots */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton loader for 3D viewer container
 */
export const ViewerSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Main skeleton area */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Placeholder elements */}
      <div className="absolute inset-0 flex flex-col p-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Car area skeleton */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-3/4 h-1/2 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse" />
        </div>

        {/* Controls skeleton */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i}
              className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Minimal loader for within 3D canvas
 */
export const CanvasLoader: React.FC = () => {
  return (
    <group>
      {/* This would be a 3D loading indicator, but for DOM we use HTML */}
    </group>
  );
};

export default LoadingPlaceholder;
