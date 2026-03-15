import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface CounterProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  theme: string;
  label?: string;
  icon?: React.ReactNode;
}

export const ScrollCounter = ({
  end,
  start = 0,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  theme,
  label,
  icon,
}: CounterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isInView) return;

    let animationFrame: number;
    const start_time = Date.now();


    const animate = () => {
      const now = Date.now();
      const elapsed = now - start_time;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newCount = start + (end - start) * easeOut;

      setCount(parseFloat(newCount.toFixed(decimals)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, start, duration, decimals]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {icon && (
        <motion.div
          className={`mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>
      )}

      <motion.div
        className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
      >
        <motion.span
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {prefix}
          {count.toLocaleString('en-US', { maximumFractionDigits: decimals })}
          {suffix}
        </motion.span>
      </motion.div>

      {label && (
        <motion.p
          className={`text-sm font-semibold mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
};
