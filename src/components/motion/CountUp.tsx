import { useRef } from 'react';
import { useInView, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  once?: boolean;
  amount?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  target,
  duration = 2.5,
  className = '',
  suffix = '',
  prefix = '',
  once = true,
  amount = 0.3,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const springCount = useSpring(rounded, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      return controls.stop;
    }
  }, [isInView, target, duration, count]);

  useEffect(() => {
    const unsubscribe = springCount.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springCount, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
};
