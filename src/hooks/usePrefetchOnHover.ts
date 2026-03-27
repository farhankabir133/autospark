import { useEffect, useRef } from 'react';
import { prefetchResource } from '../utils/prefetch';

/**
 * Hook: usePrefetchOnHover
 * Attach the returned ref to an anchor or interactive element. When the user hovers,
 * focuses, touches, or when the element enters the viewport, the hook will
 * prefetch the provided pageUrl and optionally apiUrl.
 *
 * Example:
 * const ref = usePrefetchOnHover('/vehicle/harrier', '/api/vehicle/harrier');
 * <Link ref={ref} to="/vehicle/harrier">View</Link>
 */
export default function usePrefetchOnHover(pageUrl: string, apiUrl?: string) {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof window === 'undefined') return;

    let mounted = true;

    const onEnter = () => {
      if (!mounted) return;
      prefetchResource(pageUrl, apiUrl);
    };

    el.addEventListener('mouseenter', onEnter, { passive: true });
    el.addEventListener('focus', onEnter, { passive: true });
    el.addEventListener('touchstart', onEnter, { passive: true });

    // Intersection Observer: prefetch when element comes into view
    let io: IntersectionObserver | null = null;
    try {
      io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onEnter();
            if (io && el) {
              io.unobserve(el);
            }
          }
        }
      }, { rootMargin: '200px', threshold: 0.01 });

      io.observe(el);
    } catch (err) {
      // if IntersectionObserver not supported, ignore
    }

    return () => {
      mounted = false;
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('focus', onEnter);
      el.removeEventListener('touchstart', onEnter);
      if (io && el) io.unobserve(el);
    };
  }, [pageUrl, apiUrl]);

  return elRef;
}
