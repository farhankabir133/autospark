import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = '',
  speed = 0.3,
  direction = 'vertical',
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const factor = speed * 100;

  const y: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? [factor, -factor] : [0, 0]
  );
  const x: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? [factor, -factor] : [0, 0]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, ...style }}
    >
      {children}
    </motion.div>
  );
};
