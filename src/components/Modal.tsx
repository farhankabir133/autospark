import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  theme: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }[];
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  theme,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  actions,
}: ModalProps) => {
  const sizeClasses = {
    sm: 'w-96',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-2xl',
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  const getButtonColor = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeOnBackdropClick && onClose()}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className={`${bgColor} border ${borderColor} rounded-lg shadow-2xl ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <motion.div
                  className={`flex items-center justify-between p-6 border-b ${borderColor}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {title && (
                    <h2 className={`text-xl font-bold ${textColor}`}>{title}</h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={`ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${secondaryText}`}
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                  )}
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                className="p-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {children}
              </motion.div>

              {/* Actions */}
              {actions && actions.length > 0 && (
                <motion.div
                  className={`flex items-center justify-end gap-3 p-6 border-t ${borderColor}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {actions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${getButtonColor(action.variant || 'secondary')} disabled:opacity-50 disabled:cursor-not-allowed`}
                      whileHover={!action.disabled ? { scale: 1.05 } : {}}
                      whileTap={!action.disabled ? { scale: 0.95 } : {}}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: string;
  isDangerous?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  theme,
  isDangerous = false,
}: ConfirmDialogProps) => {
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      theme={theme}
      size="sm"
      closeOnBackdropClick={false}
      actions={[
        {
          label: cancelLabel,
          onClick: onCancel,
          variant: 'secondary',
        },
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: isDangerous ? 'danger' : 'primary',
        },
      ]}
    >
      <p className={`${secondaryText}`}>{message}</p>
    </Modal>
  );
};
