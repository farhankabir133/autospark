import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  amount?: number;
  style?: React.CSSProperties;
}

const directionOffset = {
  up: (d: number) => ({ y: d }),
  down: (d: number) => ({ y: -d }),
  left: (d: number) => ({ x: d }),
  right: (d: number) => ({ x: -d }),
  none: () => ({}),
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 40,
  once = true,
  amount = 0.15,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const hidden = directionOffset[direction](distance);

  const variants: Variants = {
    hidden: { opacity: 0, ...hidden, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
