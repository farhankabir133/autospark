import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: () => void;
  theme: string;
}

const toastConfig: Record<ToastType, {
  icon: React.ReactNode;
  bgColor: string;
  darkBgColor: string;
  borderColor: string;
  textColor: string;
}> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgColor: 'bg-green-50 border-green-200',
    darkBgColor: 'dark:bg-green-900/20 dark:border-green-700',
    borderColor: 'border-l-4 border-l-green-500',
    textColor: 'text-green-800 dark:text-green-300',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: 'bg-red-50 border-red-200',
    darkBgColor: 'dark:bg-red-900/20 dark:border-red-700',
    borderColor: 'border-l-4 border-l-red-500',
    textColor: 'text-red-800 dark:text-red-300',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-blue-50 border-blue-200',
    darkBgColor: 'dark:bg-blue-900/20 dark:border-blue-700',
    borderColor: 'border-l-4 border-l-blue-500',
    textColor: 'text-blue-800 dark:text-blue-300',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-amber-50 border-amber-200',
    darkBgColor: 'dark:bg-amber-900/20 dark:border-amber-700',
    borderColor: 'border-l-4 border-l-amber-500',
    textColor: 'text-amber-800 dark:text-amber-300',
  },
};

const Toast = ({ message, type, duration = 4000, onClose, theme }: ToastProps) => {
  const config = toastConfig[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 100 }}
      transition={{ duration: 0.3 }}
      className={`pointer-events-auto ${config.bgColor} ${config.darkBgColor} ${config.borderColor} rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md backdrop-blur`}
    >
      <motion.div
        className={`flex-shrink-0 ${type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : type === 'info' ? 'text-blue-500' : 'text-amber-500'}`}
        animate={{ rotate: type === 'success' ? [0, 10, -10, 0] : undefined }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {config.icon}
      </motion.div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
      </div>

      <motion.button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'hover:bg-gray-700 text-gray-400'
            : 'hover:bg-gray-200 text-gray-600'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-4 h-4" />
      </motion.button>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${
          type === 'success' ? 'bg-green-500' :
          type === 'error' ? 'bg-red-500' :
          type === 'info' ? 'bg-blue-500' :
          'bg-amber-500'
        }`}
        initial={{ scaleX: 1, transformOrigin: 'left' }}
        animate={{ scaleX: 0, transformOrigin: 'left' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        onAnimationComplete={onClose}
      />
    </motion.div>
  );
};

interface ToastContainerProps {
  theme: string;
}

export const ToastContainer = ({ theme }: ToastContainerProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration !== 0) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration || 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Expose globally for easy usage
  (window as any).showToast = addToast;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
            theme={theme}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for using toast notifications
export const useToast = () => {
  return {
    success: (message: string, duration?: number) => (window as any).showToast?.(message, 'success', duration),
    error: (message: string, duration?: number) => (window as any).showToast?.(message, 'error', duration),
    info: (message: string, duration?: number) => (window as any).showToast?.(message, 'info', duration),
    warning: (message: string, duration?: number) => (window as any).showToast?.(message, 'warning', duration),
  };
};
