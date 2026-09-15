import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  style?: React.CSSProperties;
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  stagger = 0.08,
  delay = 0,
  once = true,
  amount = 0.1,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants(stagger, delay)}
    >
      {children}
    </motion.div>
  );
};
