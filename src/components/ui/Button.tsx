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
    // Brand Red Primary Button
    primary: 'bg-[#C00000] hover:bg-[#FF1A1A] text-white shadow-lg hover:shadow-[0_0_20px_rgba(192,0,0,0.5)] active:bg-[#8B0000]',
    // Secondary with theme awareness
    secondary: theme === 'dark' 
      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-[#C00000]' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 hover:border-[#C00000]',
    // Outline with brand red
    outline: theme === 'dark'
      ? 'border-2 border-[#C00000] text-[#FF1A1A] hover:bg-[#C00000] hover:text-white hover:shadow-[0_0_15px_rgba(192,0,0,0.4)]'
      : 'border-2 border-[#C00000] text-[#C00000] hover:bg-[#C00000] hover:text-white hover:shadow-[0_0_15px_rgba(192,0,0,0.3)]',
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
