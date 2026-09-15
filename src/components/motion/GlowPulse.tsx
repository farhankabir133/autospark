import { motion } from 'framer-motion';

interface GlowPulseProps {
  className?: string;
  color?: string;
  size?: number;
  intensity?: number;
  speed?: number;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  className = '',
  color = 'rgba(192, 0, 0, 0.4)',
  size = 200,
  intensity = 0.4,
  speed = 3,
}) => {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        opacity: [intensity * 0.5, intensity, intensity * 0.5],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};
