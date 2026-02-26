import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

export type BadgeType = 'best-value' | 'popular' | 'new-arrival' | 'limited-stock' | 'featured';

interface AnimatedBadgeProps {
  type: BadgeType;
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeConfig: Record<BadgeType, {
  icon: React.ReactNode;
  colors: { bg: string; text: string; darkBg: string; darkText: string };
  animation: string;
}> = {
  'best-value': {
    icon: <Sparkles className="w-4 h-4" />,
    colors: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' },
    animation: 'pulse',
  },
  'popular': {
    icon: <TrendingUp className="w-4 h-4" />,
    colors: { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-900/30', darkText: 'dark:text-rose-400' },
    animation: 'bounce',
  },
  'new-arrival': {
    icon: <Clock className="w-4 h-4" />,
    colors: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
    animation: 'pulse',
  },
  'limited-stock': {
    icon: <Sparkles className="w-4 h-4" />,
    colors: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' },
    animation: 'bounce',
  },
  'featured': {
    icon: <Sparkles className="w-4 h-4" />,
    colors: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
    animation: 'pulse',
  },
};

export const AnimatedBadge = ({
  type,
  text,
  size = 'md',
  className = '',
}: AnimatedBadgeProps) => {
  const config = badgeConfig[type];
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      className={`flex items-center rounded-full font-semibold inline-flex ${sizeClasses[size]} ${
        config.colors.bg
      } ${config.colors.text} ${config.colors.darkBg} ${config.colors.darkText} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated icon */}
      <motion.div
        className={iconSize[size]}
        animate={{
          rotate: type === 'popular' ? [0, 360] : undefined,
          scale: type === 'limited-stock' ? [1, 1.1, 1] : undefined,
        }}
        transition={{
          duration: type === 'popular' ? 2 : 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {config.icon}
      </motion.div>
      
      {/* Badge text */}
      <span className="font-semibold">{text}</span>

      {/* Shine effect */}
      {type === 'best-value' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0,
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, white, transparent)',
            filter: 'blur(1px)',
          }}
        />
      )}
    </motion.div>
  );
};
