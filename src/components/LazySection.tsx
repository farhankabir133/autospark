import { useRef, useState, useEffect, type ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  /** How far before the element enters the viewport to start rendering (default: 200px) */
  rootMargin?: string;
  /** Minimum height placeholder before content loads (prevents layout shift) */
  minHeight?: string;
  /** Optional className for the wrapper div */
  className?: string;
  /** Fallback content while the section is not yet visible */
  fallback?: ReactNode;
}

/**
 * LazySection — defers rendering of below-fold sections until they are
 * within `rootMargin` of the viewport. Uses IntersectionObserver for
 * zero-cost idle tracking. Once visible, the section stays mounted.
 */
export function LazySection({
  children,
  rootMargin = '200px',
  minHeight = '200px',
  className,
  fallback,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is not supported, render immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Once visible, never re-hide
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? undefined : { minHeight, background: 'inherit' }}
    >
      {isVisible ? children : (fallback ?? null)}
    </div>
  );
}
