import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ValidationState = 'idle' | 'valid' | 'invalid' | 'validating';

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  validationState: ValidationState;
  errorMessage?: string;
  successMessage?: string;
  description?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  theme: string;
}

export const AnimatedFormInput = ({
  label,
  placeholder,
  value,
  onChange,
  validationState,
  errorMessage,
  successMessage,
  description,
  type = 'text',
  theme,
}: FormInputProps) => {
  const stateConfig = {
    idle: {
      bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
      borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
      icon: null,
    },
    validating: {
      bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50',
      borderColor: theme === 'dark' ? 'border-blue-600' : 'border-blue-400',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    valid: {
      bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-green-50',
      borderColor: theme === 'dark' ? 'border-green-600' : 'border-green-400',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
    invalid: {
      bgColor: theme === 'dark' ? 'bg-gray-800' : 'bg-red-50',
      borderColor: theme === 'dark' ? 'border-red-600' : 'border-red-400',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
  };

  const config = stateConfig[validationState];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <label className={`block text-sm font-semibold mb-2 ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
      }`}>
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            config.bgColor
          } ${config.borderColor} ${
            validationState === 'validating' ? 'focus:ring-blue-400' :
            validationState === 'valid' ? 'focus:ring-green-400' :
            validationState === 'invalid' ? 'focus:ring-red-400' :
            'focus:ring-gray-400'
          } ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
        />

        {/* Status icon */}
        {config.icon && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            {validationState === 'validating' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                {config.icon}
              </motion.div>
            ) : (
              config.icon
            )}
          </motion.div>
        )}
      </div>

      {/* Description or message */}
      <AnimatePresence>
        {description && validationState === 'idle' && (
          <motion.p
            className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {description}
          </motion.p>
        )}
        {errorMessage && validationState === 'invalid' && (
          <motion.p
            className="text-xs mt-2 text-red-500 flex items-center gap-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle className="w-3 h-3" />
            {errorMessage}
          </motion.p>
        )}
        {successMessage && validationState === 'valid' && (
          <motion.p
            className="text-xs mt-2 text-green-500 flex items-center gap-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle2 className="w-3 h-3" />
            {successMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function for common validations
export const validateEmail = (email: string): ValidationState => {
  if (!email) return 'idle';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? 'valid' : 'invalid';
};

export const validatePhone = (phone: string): ValidationState => {
  if (!phone) return 'idle';
  const phoneRegex = /^[0-9+\-()]{10,}$/;
  return phoneRegex.test(phone) ? 'valid' : 'invalid';
};

export const validateRequired = (value: string): ValidationState => {
  return value.trim().length > 0 ? 'valid' : (value ? 'invalid' : 'idle');
};

// Async placeholder for form validation
export { AnimatePresence } from 'framer-motion';
