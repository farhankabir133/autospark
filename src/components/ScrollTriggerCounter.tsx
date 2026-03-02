import { motion, useScroll } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface ScrollTriggerCounterProps {
  targetValue: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: LucideIcon;
  theme: string;
  duration?: number;
}

export const ScrollTriggerCounter = ({
  targetValue,
  label,
  suffix = '',
  prefix = '',
  icon: Icon,
  theme,
  duration = 2,
}: ScrollTriggerCounterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Trigger animation when element comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  // Odometer-style counting animation
  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function for smoother animation
      const easeOutQuad = 1 - Math.pow(1 - progress, 2);
      const newValue = Math.floor(easeOutQuad * targetValue);

      setDisplayValue(newValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, targetValue, duration]);

  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${bgColor} border ${borderColor} rounded-2xl p-8 overflow-hidden group`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
            : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
        }`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      />

      {/* Decorative shapes */}
      <motion.div
        className={`absolute top-0 right-0 w-32 h-32 ${
          theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-300/20'
        } rounded-full blur-3xl`}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10">
        {/* Icon and label row */}
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <motion.div
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-blue-100 text-blue-600'
              }`}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3,
              }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          )}
          <p className={`text-sm font-semibold ${secondaryText}`}>{label}</p>
        </div>

        {/* Counter value with odometer effect */}
        <div className="mb-4">
          <motion.div
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textColor} font-mono`}
            key={displayValue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {prefix}
            </span>
            {displayValue.toLocaleString()}
            <span className={`text-3xl ml-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {suffix}
            </span>
          </motion.div>
        </div>

        {/* Scroll progress indicator */}
        <motion.div
          className={`h-1 rounded-full ${
            theme === 'dark' ? 'bg-blue-500/30' : 'bg-blue-200/50'
          }`}
          style={{
            scaleX: scrollYProgress,
            originX: 0,
          }}
        />
      </div>

      {/* Hover glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
            : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
        }`}
      />
    </motion.div>
  );
};
