import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  stagger?: number;
  once?: boolean;
  splitBy?: 'word' | 'char';
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const childVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  as = 'h2',
  delay = 0,
  stagger = 0.03,
  once = true,
  splitBy = 'word',
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const tokens = splitBy === 'char' ? text.split('') : text.split(' ');

  const Tag = motion[typeof as] as typeof motion.h2;

  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants(stagger, delay)}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          className="inline-block"
          variants={childVariants}
          style={{ whiteSpace: splitBy === 'word' ? 'pre' : 'normal' }}
        >
          {token}
        </motion.span>
      ))}
    </Tag>
  );
};
