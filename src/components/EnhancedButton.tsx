import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface EnhancedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  animation?: 'none' | 'pulse' | 'bounce' | 'wiggle';
  className?: string;
  theme: string;
}

const variantConfig = {
  primary: {
    light: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30',
    dark: 'dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white dark:shadow-lg dark:shadow-blue-500/20',
  },
  secondary: {
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-md',
    dark: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
  },
  outline: {
    light: 'border-2 border-blue-500 hover:bg-blue-50 text-blue-600',
    dark: 'dark:border-blue-400 dark:hover:bg-blue-600/10 dark:text-blue-400',
  },
  ghost: {
    light: 'hover:bg-gray-100 text-gray-700',
    dark: 'dark:hover:bg-gray-800 dark:text-gray-300',
  },
  danger: {
    light: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30',
    dark: 'dark:bg-red-600 dark:hover:bg-red-700 dark:text-white',
  },
};

const sizeConfig = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export const EnhancedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  animation = 'none',
  className = '',
  theme,
}: EnhancedButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const config = variantConfig[variant];
  const sizeClass = sizeConfig[size];

  const animationConfig = {
    none: {},
    pulse: {
      animate: { opacity: [1, 0.7, 1] },
      transition: { duration: 2, repeat: Infinity },
    },
    bounce: {
      animate: { y: [0, -3, 0] },
      transition: { duration: 0.6, repeat: Infinity },
    },
    wiggle: {
      animate: { rotate: [0, -1, 1, -1, 0] },
      transition: { duration: 0.5, repeat: Infinity },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center rounded-lg font-semibold transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${config.light} ${config.dark} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...(animation !== 'none' && animationConfig[animation])}
    >
      {/* Ripple effect background */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        animate={isPressed ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 0.3 }}
        transition={{ duration: 0.6 }}
        style={{ background: 'rgba(255,255,255,0.5)' }}
      />

      {/* Gradient shimmer on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
        animate={isPressed ? { x: ['100%', '-100%'] } : { x: ['100%', '-100%'] }}
        transition={{ duration: 0.8, repeat: isPressed ? Infinity : 0 }}
      />

      {/* Content */}
      <div className="flex items-center gap-inherit relative z-10">
        {icon && iconPosition === 'left' && (
          <motion.span
            animate={loading ? { rotate: 360 } : {}}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
          >
            {icon}
          </motion.span>
        )}

        {!loading ? children : <span>{theme === 'dark' ? '⏳' : '⏳'} Loading...</span>}

        {icon && iconPosition === 'right' && (
          <motion.span
            animate={loading ? { rotate: 360 } : {}}
            transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
          >
            {icon}
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
