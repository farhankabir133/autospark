import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: theme === 'dark' 
      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: theme === 'dark'
      ? 'border-2 border-blue-400 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600'
      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
