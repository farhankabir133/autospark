import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// no-op placeholder removed (keep file lean)

export default function CursorFollower(): JSX.Element | null {
  const { theme } = useTheme();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const isActive = useRef(false);
  const isHover = useRef(false);

  useEffect(() => {
    // Only enable on fine-pointer devices and when DOM is available
    if (typeof window === 'undefined') return;
    if (!window.matchMedia) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return; // disable on touch/coarse pointers

    const dot = dotRef.current!;
    const halo = haloRef.current!;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onDown = () => {
      isActive.current = true;
      dot.style.transform += ' scale(0.85)';
      dot.style.opacity = '0.95';
      if (halo) halo.style.opacity = '0.25';
    };
    const onUp = () => {
      isActive.current = false;
      dot.style.transform = dot.style.transform.replace(/\s*scale\([^)]*\)/, '');
      dot.style.opacity = '1';
      if (halo) halo.style.opacity = theme === 'dark' ? '0.14' : '0.12';
    };

    const hoverTargets = Array.from(document.querySelectorAll('a,button,button *, .carousel-slide, .inventory-card, .interactive-card')) as Element[];
    const addHover = () => {
      isHover.current = true;
      dot.style.transform = dot.style.transform.replace(/\s*scale\([^)]*\)/, '') + ' scale(1.25)';
      if (halo) halo.style.opacity = '0.22';
    };
    const removeHover = () => {
      isHover.current = false;
      dot.style.transform = dot.style.transform.replace(/\s*scale\([^)]*\)/, '');
      if (halo) halo.style.opacity = theme === 'dark' ? '0.14' : '0.12';
    };

    hoverTargets.forEach((t) => {
      t.addEventListener('pointerenter', addHover);
      t.addEventListener('pointerleave', removeHover);
    });

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);

    // animation loop (lerp)
    const ease = 0.16; // trailing softness
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;
      const x = Math.round(pos.current.x);
      const y = Math.round(pos.current.y);
      if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%)` + (isHover.current ? ' scale(1.25)' : '');
      if (halo) halo.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%,-50%)`;
      rafRef.current = requestAnimationFrame(loop);
    };

    if (!reduce) rafRef.current = requestAnimationFrame(loop);

    return () => {
      hoverTargets.forEach((t) => {
        t.removeEventListener('pointerenter', addHover);
        t.removeEventListener('pointerleave', removeHover);
      });
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Render nothing on non-browser or coarse pointers - handled in effect
  // but return the element so markup exists for CSS variables
  const dotColor = theme === 'dark' ? 'rgba(255,255,255,0.95)' : 'var(--accent, #0f172a)';
  const haloColor = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.06)';

  return (
    <div ref={rootRef} aria-hidden style={{ pointerEvents: 'none' }}>
      <div
        ref={haloRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 44,
          height: 44,
          borderRadius: '50%',
          transform: 'translate3d(-50%,-50%,0)',
          background: `radial-gradient(circle at 50% 40%, ${haloColor}, rgba(0,0,0,0) 45%)`,
          opacity: theme === 'dark' ? 0.14 : 0.12,
          zIndex: 99999,
          mixBlendMode: theme === 'dark' ? 'screen' : 'normal',
          transition: 'opacity 180ms ease, transform 160ms ease',
        }}
      />

      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.6)' : '0 2px 10px rgba(16,24,40,0.08)',
          transform: 'translate3d(-50%,-50%,0)',
          zIndex: 100000,
          transition: 'opacity 120ms ease, transform 160ms ease, background 160ms',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
