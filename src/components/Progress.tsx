import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  theme: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
  height?: number;
}

const colorClasses = {
  blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
  green: 'bg-gradient-to-r from-green-400 to-green-600',
  red: 'bg-gradient-to-r from-red-400 to-red-600',
  yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
};

export const ProgressBar = ({
  progress,
  theme,
  color = 'blue',
  showLabel = true,
  animated = true,
  striped = false,
  height = 4,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const heightClass = `h-[${height}px]`;

  return (
    <div className="w-full">
      <div className={`w-full ${heightClass} ${bgColor} rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-300`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{
            backgroundImage: striped
              ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)'
              : undefined,
            backgroundSize: striped ? '20px 20px' : undefined,
          }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{ backgroundPosition: ['0px 0px', '20px 0px'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent)',
                backgroundSize: '30px 100%',
              }}
            />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <motion.p
          className={`text-sm font-medium mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {clampedProgress}%
        </motion.p>
      )}
    </div>
  );
};

interface MultiProgressBarProps {
  sections: {
    label: string;
    value: number;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  }[];
  theme: string;
  height?: number;
}

export const MultiProgressBar = ({
  sections,
  theme,
  height = 6,
}: MultiProgressBarProps) => {
  const total = sections.reduce((sum, s) => sum + s.value, 0);
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className="w-full">
      <div
        className={`w-full h-${height} ${bgColor} rounded-full overflow-hidden flex`}
      >
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            className={`h-full ${colorClasses[section.color]}`}
            initial={{ width: 0 }}
            animate={{ width: `${(section.value / total) * 100}%` }}
            transition={{
              duration: 0.5,
              delay: idx * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div
              className={`w-3 h-3 rounded-full ${colorClasses[section.color]}`}
            />
            <span className={`text-sm ${textColor}`}>
              {section.label}: {section.value}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface CircularProgressProps {
  progress: number;
  theme: string;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export const CircularProgress = ({
  progress,
  theme,
  size = 100,
  strokeWidth = 4,
  showLabel = true,
  color = 'blue',
}: CircularProgressProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
    purple: '#a855f7',
  };

  const bgColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = theme === 'dark' ? '#fff' : '#1f2937';

  return (
    <div className="flex flex-col items-center">
      <motion.svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          strokeLinecap="round"
        />

        {/* Center text */}
        {showLabel && (
          <motion.text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size / 4}
            fontWeight="bold"
            fill={textColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {clampedProgress}%
          </motion.text>
        )}
      </motion.svg>
    </div>
  );
};

interface StepperProps {
  steps: {
    label: string;
    status: 'completed' | 'active' | 'pending';
  }[];
  theme: string;
}

export const Stepper = ({ steps, theme }: StepperProps) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center flex-1">
          {/* Step circle */}
          <motion.div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 ${
              step.status === 'completed'
                ? 'bg-green-500 text-white'
                : step.status === 'active'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-300 text-gray-600'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            {step.status === 'completed' ? '✓' : idx + 1}
          </motion.div>

          {/* Connecting line */}
          {idx < steps.length - 1 && (
            <motion.div
              className={`h-1 flex-1 mx-2 ${
                steps[idx].status === 'completed'
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: idx * 0.1 + 0.1 }}
            />
          )}

          {/* Label */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <p className={`text-sm font-medium ${textColor}`}>{step.label}</p>
            {step.status === 'active' && (
              <p className={`text-xs ${secondaryText}`}>In progress</p>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
};
