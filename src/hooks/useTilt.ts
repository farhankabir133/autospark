import { useRef } from 'react';

/** Subtle 3D tilt — pointer-only, rAF-throttled, transform-only (GPU). */
export function useTilt(enabled: boolean) {
  const raf = useRef(0);
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    const el = e.currentTarget as HTMLElement;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--fv-rx', `${(-py * 5).toFixed(2)}deg`);
      el.style.setProperty('--fv-ry', `${(px * 7).toFixed(2)}deg`);
      el.style.setProperty('--fv-mx', `${(px * 100 + 50).toFixed(1)}%`);
      el.style.setProperty('--fv-my', `${(py * 100 + 50).toFixed(1)}%`);
    });
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    cancelAnimationFrame(raf.current);
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty('--fv-rx', '0deg');
    el.style.setProperty('--fv-ry', '0deg');
  };
  return { onMove, onLeave };
}
