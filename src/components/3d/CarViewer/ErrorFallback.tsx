/**
 * ErrorFallback Component
 * 
 * Graceful error handling and fallback UI when 3D model fails to load.
 * Shows fallback image with retry option.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { ErrorFallbackProps } from './types';

/**
 * Error fallback component with retry capability
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  fallbackImage,
  onRetry,
  className = '',
}) => {
  return (
    <motion.div 
      className={`
        absolute inset-0 flex flex-col items-center justify-center p-6
        bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fallback image if available */}
      {fallbackImage ? (
        <div className="relative w-full h-full">
          {/* Background image */}
          <img
            src={fallbackImage}
            alt="Vehicle"
            className="absolute inset-0 w-full h-full object-contain opacity-90"
            onError={(e) => {
              // If fallback image also fails, hide it
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          
          {/* Overlay with message */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/90 rounded-full text-sm font-medium text-yellow-900">
              <ImageIcon className="w-4 h-4" />
              <span>Showing 2D preview • 3D model unavailable</span>
            </div>
            
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg text-sm font-medium text-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry 3D Model</span>
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        // No fallback image - show error message
        <div className="text-center space-y-4">
          {/* Error icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
          </motion.div>

          {/* Error message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Unable to load 3D model
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              {error.message || 'An unexpected error occurred while loading the vehicle model.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Page</span>
            </motion.button>
          </div>

          {/* Technical details (collapsible) */}
          <details className="mt-4 text-left max-w-sm mx-auto">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              Technical Details
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
              {error.stack || error.message}
            </pre>
          </details>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Error boundary class component for catching render errors
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackImage?: string;
  onError?: (error: Error) => void;
  onRetry?: () => void;
}

export class ViewerErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('CarViewer Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          fallbackImage={this.props.fallbackImage}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorFallback;
