import { useRef } from 'react';

interface RippleContainerProps {
  children: React.ReactNode;
  onRipple?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export const RippleContainer = ({
  children,
  onRipple,
  className = '',
}: RippleContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.left = x - size / 2 + 'px';
    ripple.style.top = y - size / 2 + 'px';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.className = `absolute rounded-full bg-white/50 animate-ripple pointer-events-none`;
    
    containerRef.current?.appendChild(ripple);

    // Remove ripple after animation completes
    setTimeout(() => ripple.remove(), 600);

    onRipple?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};
