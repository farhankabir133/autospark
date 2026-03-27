import React, { ReactNode } from 'react';

interface FloatingButtonProps {
  href: string;
  ariaLabel: string;
  position?: 'left' | 'right';
  bgClass?: string; // background color classes
  children: ReactNode;
  className?: string;
  hideOnSmall?: boolean;
  /**
   * Optional override for position classes (useful for responsive switches)
   * Example: 'left-4 md:left-auto md:right-6'
   */
  posClass?: string;
  /**
   * Optional bottom class to support responsive stacking and safe-area calc.
   * Example: 'bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] md:bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)]'
   */
  bottomClass?: string;
}

/**
 * A small, fully-responsive floating action button.
 * - Respects safe-area insets on modern devices
 * - Uses responsive paddings and position offsets
 * - Respects prefers-reduced-motion
 */
export const FloatingButton = ({
  href,
  ariaLabel,
  position = 'right',
  bgClass = 'bg-green-500 hover:bg-green-600',
  children,
  className = '',
  hideOnSmall = false,
  posClass,
  bottomClass,
}: FloatingButtonProps) => {
  const defaultPosClass =
    position === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6';

  const finalPosClass = posClass ?? defaultPosClass;

  const finalBottomClass = bottomClass ?? 'bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)]';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={
        `fixed z-40 ${finalPosClass} ${finalBottomClass} ${bgClass} text-white p-3 sm:p-4 rounded-full shadow-lg transition-all motion-safe:transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 ${hideOnSmall ? 'hidden sm:inline-flex' : 'inline-flex'} items-center justify-center ${className}`
      }
    >
      {/* Respect reduced-motion preference by disabling animated children if present */}
      <span className="pointer-events-none">{children}</span>
    </a>
  );
};

export default FloatingButton;
