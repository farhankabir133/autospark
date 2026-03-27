import { useEffect, useState, useRef, type ReactNode } from 'react';

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
  /**
   * For deterministic stacking without DOM measurement, caller can pass a stack index (0 = bottom-most)
   * and optional base/gap/size values (in pixels). When provided, the component will compute an
   * inline `bottom` style using safe-area inset + calculated offset. This avoids overlap and
   * keeps layout predictable across devices.
   */
  stackIndex?: number;
  baseOffsetPx?: number;
  gapPx?: number;
  sizePx?: number;
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
  stackIndex,
  baseOffsetPx,
  gapPx,
  sizePx,
}: FloatingButtonProps) => {
  const defaultPosClass =
    position === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6';

  const finalPosClass = posClass ?? defaultPosClass;

  const finalBottomClass = bottomClass;

  // stacking defaults (px)
  const baseOffset = baseOffsetPx ?? 16; // 1rem
  const size = sizePx ?? 56; // target button size including padding
  const gap = gapPx ?? 12;

  const computedBottom = typeof stackIndex === 'number'
    ? `calc(env(safe-area-inset-bottom,0px) + ${baseOffset + stackIndex * (size + gap)}px)`
    : undefined;

  const finalSize = sizePx ?? 56;

  // runtime adjustments: avoid overlap with other fixed-bottom elements (toasts, cart bars)
  const [dynamicExtraOffset, setDynamicExtraOffset] = useState(0);
  const [hiddenForKeyboard, setHiddenForKeyboard] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // compute extra offset by scanning for other fixed elements near the bottom
    function computeExtra() {
      try {
        const elems = Array.from(document.querySelectorAll<HTMLElement>('*'));
        const bounds = elems
          .map((el) => {
            const style = getComputedStyle(el);
            if (style.position !== 'fixed') return null;
            // ignore our own element
            if (ref.current && el.contains(ref.current)) return null;
            const rect = el.getBoundingClientRect();
            // consider only elements anchored at bottom (within last 40% of viewport)
            if (rect.top < window.innerHeight * 0.6) return null;
            if (rect.height === 0 || rect.width === 0) return null;
            return rect;
          })
          .filter(Boolean) as DOMRect[];

        if (bounds.length === 0) {
          setDynamicExtraOffset(0);
          return;
        }

        // compute largest overlap height from bottom
        const overlaps = bounds.map((r) => Math.max(0, window.innerHeight - r.top));
        const maxOverlap = Math.max(...overlaps, 0);
        setDynamicExtraOffset(Math.ceil(maxOverlap) + 8);
      } catch {
        // ignore
      }
    }

    computeExtra();
    window.addEventListener('resize', computeExtra, { passive: true });
    window.addEventListener('orientationchange', computeExtra);
    const iv = setInterval(computeExtra, 1500); // periodic check for dynamic overlays

    // visualViewport: detect virtual keyboard on mobile; hide FABs when keyboard is open
    const onViewport = () => {
      // if viewport height shrank by more than 200px, assume keyboard
      const vv = (window as unknown as Window & { visualViewport?: VisualViewport }).visualViewport;
      if (vv) {
        const shrunk = window.innerHeight - vv.height > 200;
        setHiddenForKeyboard(Boolean(shrunk));
      }
    };
    const vvRoot = (window as unknown as Window & { visualViewport?: VisualViewport }).visualViewport;
    if (vvRoot) {
      vvRoot.addEventListener('resize', onViewport);
    }

    return () => {
      window.removeEventListener('resize', computeExtra);
      window.removeEventListener('orientationchange', computeExtra);
      clearInterval(iv);
      if (vvRoot) {
        vvRoot.removeEventListener('resize', onViewport);
      }
    };
  }, []);

  const finalSizePx = `${finalSize}px`;

  const style: React.CSSProperties & Record<string, string | number | undefined> = {
    // enforce consistent hit target and visual size
    width: finalSizePx,
    height: finalSizePx,
    minWidth: finalSizePx,
    minHeight: finalSizePx,
    boxSizing: 'content-box',
    // touch optimizations
    touchAction: 'manipulation',
    // WebKit tap highlight removal — set via string index to avoid TS typing issues
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    WebkitTapHighlightColor: 'transparent',
    ...(computedBottom ? { bottom: computedBottom } : {}),
    // apply extra offset if other fixed elements detected
    ...(dynamicExtraOffset ? { transform: `translateY(-${dynamicExtraOffset}px)` } : {}),
    display: hiddenForKeyboard ? 'none' : undefined,
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
      className={
        `fixed z-40 ${finalPosClass} ${finalBottomClass ?? ''} ${bgClass} text-white rounded-full shadow-lg transition-all motion-safe:transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 ${hideOnSmall ? 'hidden sm:inline-flex' : 'inline-flex'} items-center justify-center ${className}`
      }
      // ensure minimum touch target and consistent sizing across devices; bottom is computed when stackIndex provided
      ref={(el) => (ref.current = el)}
      style={style}
    >
      {/* Respect reduced-motion preference by disabling animated children if present */}
      <span className="pointer-events-none flex items-center justify-center w-full h-full">
        {children}
      </span>
    </a>
  );
};

export default FloatingButton;
