import { type ReactNode } from 'react';

interface CompositeAction {
  href: string;
  ariaLabel: string;
  icon: ReactNode;
  bgClass?: string;
}

interface CompositeFABProps {
  actions: CompositeAction[]; // rendered bottom-to-top in the visual stack (0 = bottom)
  position?: 'left' | 'right';
  posClass?: string;
  stackIndex?: number; // used to compute base bottom offset
  baseOffsetPx?: number;
  gapPx?: number;
  sizePx?: number;
  hideOnSmall?: boolean;
}

/**
 * CompositeFAB
 * Renders a single positioned container that contains a vertical stack of action buttons.
 * Each inner action is a clickable anchor; this keeps DOM compact and alignment deterministic.
 */
export const CompositeFAB = ({
  actions,
  position = 'left',
  posClass,
  stackIndex = 0,
  baseOffsetPx = 16,
  gapPx = 12,
  sizePx = 56,
  hideOnSmall = false,
}: CompositeFABProps) => {
  const defaultPosClass = position === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6';
  const finalPosClass = posClass ?? defaultPosClass;

  const computedBottom = `calc(env(safe-area-inset-bottom,0px) + ${baseOffsetPx + stackIndex * (sizePx + gapPx)}px)`;

  const size = `${sizePx}px`;

  return (
    <div
      className={`fixed z-50 ${finalPosClass} ${hideOnSmall ? 'hidden sm:flex' : 'flex'} flex-col items-center justify-end`}
      style={{ bottom: computedBottom }}
    >
      {/* Render actions bottom-to-top so actions[0] sits lowest */}
      {actions.map((a, i) => (
        <a
          key={i}
          href={a.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={a.ariaLabel}
          className={`${a.bgClass ?? 'bg-gray-800 hover:bg-gray-700'} text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white mb-3`}
          style={{ width: size, height: size }}
        >
          <span className="pointer-events-none flex items-center justify-center w-full h-full">{a.icon}</span>
        </a>
      ))}
    </div>
  );
};

export default CompositeFAB;
