import { useScroll, useTransform, type MotionValue } from 'framer-motion';

interface UseScrollProgressOptions {
  offset?: ['start end' | 'start start' | 'end end' | 'end start' | string, string];
}

interface UseScrollProgressReturn {
  progress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export const useScrollProgress = (
  options?: UseScrollProgressOptions
): UseScrollProgressReturn => {
  const { scrollYProgress, scrollY } = useScroll({
    offset: options?.offset as any,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.95, 1, 1, 0.98]);

  return {
    progress: scrollYProgress,
    smoothProgress: scrollYProgress,
    opacity,
    scale,
  };
};

export const useScrollY = () => {
  const { scrollY } = useScroll();
  return scrollY;
};
