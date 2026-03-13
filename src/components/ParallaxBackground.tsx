import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxBackgroundProps {
  theme: string;
}

export const ParallaxBackground = ({ theme }: ParallaxBackgroundProps) => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Create parallax values for different layers
  const layer1Y = useTransform(scrollY, [0, 1000], [0, -100]);
  const layer2Y = useTransform(scrollY, [0, 1000], [0, -50]);
  const layer3Y = useTransform(scrollY, [0, 1000], [0, -25]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden -z-10"
      style={{ perspective: '1000px' }}
    >
      {/* Background gradient base layer */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${
          theme === 'dark'
            ? 'from-gray-900 via-blue-900/20 to-gray-900'
            : 'from-blue-50 via-purple-50/30 to-indigo-50'
        }`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Animated gradient overlay layer 1 */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-transparent via-blue-500/10 to-transparent'
            : 'from-transparent via-blue-400/5 to-transparent'
        }`}
        style={{ y: layer1Y }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      {/* Animated gradient overlay layer 2 */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-b ${
          theme === 'dark'
            ? 'from-purple-500/10 via-transparent to-purple-500/10'
            : 'from-purple-400/5 via-transparent to-purple-400/5'
        }`}
        style={{ y: layer2Y }}
        animate={{
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          delay: 0.5,
        }}
      />

      {/* Floating vehicle silhouettes */}
      {/* Top left vehicle */}
      <motion.div
        className="absolute top-20 -left-20 opacity-5"
        style={{ y: layer3Y }}
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <svg
          className="w-64 h-64 text-blue-600"
          viewBox="0 0 400 200"
          fill="currentColor"
        >
          {/* Simplified car silhouette */}
          <path d="M80 120 L100 80 L150 70 L200 75 L250 70 L280 90 L320 120 Q320 140 300 140 L100 140 Q80 140 80 120 Z" />
          <circle cx="130" cy="145" r="15" />
          <circle cx="270" cy="145" r="15" />
        </svg>
      </motion.div>

      {/* Top right vehicle */}
      <motion.div
        className="absolute top-40 -right-24 opacity-5"
        style={{ y: layer2Y }}
        animate={{
          y: [0, -15, 0],
          x: [0, -12, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1,
        }}
      >
        <svg
          className="w-72 h-72 text-purple-600"
          viewBox="0 0 400 200"
          fill="currentColor"
        >
          {/* Simplified SUV silhouette */}
          <path d="M70 130 L90 70 L160 60 L220 65 L280 85 L330 135 Q335 155 310 155 L90 155 Q70 155 70 130 Z" />
          <circle cx="120" cy="160" r="18" />
          <circle cx="290" cy="160" r="18" />
        </svg>
      </motion.div>

      {/* Bottom center vehicle */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-5"
        style={{ y: layer1Y }}
        animate={{
          y: [0, 25, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 2,
        }}
      >
        <svg
          className="w-80 h-80 text-indigo-600"
          viewBox="0 0 400 200"
          fill="currentColor"
        >
          {/* Simplified sedan silhouette */}
          <path d="M75 125 L95 85 L140 75 L210 80 L270 75 L315 100 L325 125 Q325 145 305 145 L95 145 Q75 145 75 125 Z" />
          <circle cx="125" cy="150" r="16" />
          <circle cx="285" cy="150" r="16" />
        </svg>
      </motion.div>

      {/* Animated bokeh/blur circles for depth effect */}
      <motion.div
        className={`absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'
        }`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <motion.div
        className={`absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
        }`}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1,
        }}
      />

      {/* Top right bokeh */}
      <motion.div
        className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15 ${
          theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-300'
        }`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 2,
        }}
      />

      {/* Subtle animated grid overlay */}
      <motion.div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-[linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.05)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(0deg,rgba(59,130,246,0.02)_1px,transparent_1px)]'
        }`}
        style={{
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};
