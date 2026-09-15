import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.3,
  onClick,
  as = 'button',
  href,
}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const scale = useTransform(
    [springX, springY],
    ([latestX, latestY]: number[]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return 1 + distance * 0.001;
    }
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = motion[as];

  return (
    <Component
      ref={ref as React.Ref<HTMLButtonElement & HTMLAnchorElement>}
      className={className}
      style={{ x: springX, y: springY, scale } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {}}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      href={href}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </Component>
  );
};
