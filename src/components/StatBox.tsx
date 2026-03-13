import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatBoxProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  bgColor: string;
  iconColor: string;
  animate?: boolean;
  theme: string;
}

export const StatBox = ({
  icon,
  label,
  value,
  unit = '',
  bgColor,
  iconColor,
  animate = true,
  theme,
}: StatBoxProps) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const containerBg =
    theme === 'dark'
      ? 'bg-gray-900/50 border-gray-800'
      : 'bg-white/50 border-gray-200';

  return (
    <motion.div
      className={`p-4 rounded-lg border backdrop-blur-sm ${containerBg}`}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-3`}
        animate={animate ? { rotate: 360 } : {}}
        transition={animate ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
      >
        <motion.div
          className={`${iconColor} text-xl`}
          animate={animate ? { scale: [1, 1.2, 1] } : {}}
          transition={animate ? { duration: 2, repeat: Infinity } : {}}
        >
          {icon}
        </motion.div>
      </motion.div>

      <div className="space-y-1">
        <p className={`text-sm font-medium ${secondaryText}`}>{label}</p>
        <motion.p
          className={`text-2xl font-bold ${textColor}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </motion.p>
      </div>
    </motion.div>
  );
};

interface StatsGridProps {
  stats: StatBoxProps[];
  theme: string;
  columns?: number;
}

export const StatsGrid = ({
  stats,
  theme,
  columns = 4,
}: StatsGridProps) => {
  const gridCols =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

  return (
    <motion.div
      className={`grid ${gridCols} gap-4`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <StatBox {...stat} theme={theme} />
        </motion.div>
      ))}
    </motion.div>
  );
};
