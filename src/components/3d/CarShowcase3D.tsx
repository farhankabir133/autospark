/**
 * CarShowcase3D.tsx — THIN WRAPPER
 * ─────────────────────────────────────────────
 * Zero Three.js imports. Detects device tier, then:
 *  • Low-tier  → static image (0 KB Three.js)
 *  • Mid/High  → lazy(() => import('./CarShowcase3DCanvas'))
 *
 * All Three.js code lives in CarShowcase3DCanvas.tsx (~987 KB chunk
 * only downloaded when actually needed).
 */
import { lazy, Suspense, useState, useEffect, memo } from 'react';
import { useReducedMotion } from 'framer-motion';

// ── Device tier detection (no Three.js dependency) ──
type DeviceTier = 'low' | 'mid' | 'high';

function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'mid';
  const w = window.innerWidth;
  const isPhone = w < 768;
  const isTablet = w >= 768 && w < 1024;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
        if (renderer.includes('mali-4') || renderer.includes('adreno 3') || renderer.includes('powervr sgx')) {
          return 'low';
        }
      }
    }
  } catch { /* ignore */ }

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

  if (isPhone) return cores <= 4 || memory <= 3 ? 'low' : 'mid';
  if (isTablet) return cores <= 4 || memory <= 3 ? 'low' : 'mid';
  if (cores >= 8 && memory >= 8) return 'high';
  return 'mid';
}

// ── Lazy Canvas import — only for mid/high tier ──
const CarShowcase3DCanvas = lazy(() => import('./CarShowcase3DCanvas'));

// ── Color options (no Three.js dependency) ──
const CAR_COLORS = [
  { name: 'Racing Red', color: '#C00000' },
  { name: 'Midnight Black', color: '#111111' },
  { name: 'Arctic White', color: '#F0F0F0' },
  { name: 'Ocean Blue', color: '#0a3d7c' },
  { name: 'Emerald Green', color: '#0a5c38' },
  { name: 'Sunset Orange', color: '#FF6B00' },
  { name: 'Royal Purple', color: '#4B0082' },
];

// ── Typewriter hook (no Three.js dependency) ──
function useTypewriter(texts: string[], typingSpeed = 60, deletingSpeed = 30, pauseDuration = 3500) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isWaiting) {
      const t = setTimeout(() => { setIsWaiting(false); setIsDeleting(true); }, pauseDuration);
      return () => clearTimeout(t);
    }
    if (isDeleting) {
      if (displayText === '') { setIsDeleting(false); setTextIndex((p) => (p + 1) % texts.length); return; }
      const t = setTimeout(() => setDisplayText((p) => p.slice(0, -1)), deletingSpeed);
      return () => clearTimeout(t);
    }
    if (displayText === currentText) { setIsWaiting(true); return; }
    const t = setTimeout(() => setDisplayText(currentText.slice(0, displayText.length + 1)), typingSpeed);
    return () => clearTimeout(t);
  }, [displayText, textIndex, isDeleting, isWaiting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

// ── Memoized typewriter text display ──
// Isolates the ~50 re-renders per sentence so the parent CarShowcase3D
// (which holds the Canvas/Suspense boundary) doesn't reconcile on every character.
const TYPEWRITER_TEXTS = [
  'Exclusive Cars in Rajshahi',
  "North Bengal's Leading Premium Car Showroom",
  'Luxury Redefined, Performance Delivered',
] as const;

const TypewriterMobile = memo(function TypewriterMobile() {
  const text = useTypewriter([...TYPEWRITER_TEXTS]);
  return (
    <div className="flex items-center min-h-[20px] max-w-full">
      <span className="text-[11px] font-light text-white/80 tracking-wide truncate">
        {text}
      </span>
      <span className="ml-0.5 inline-block w-[2px] h-3.5 bg-red-600 rounded-full animate-pulse flex-shrink-0" />
    </div>
  );
});

const TypewriterDesktop = memo(function TypewriterDesktop() {
  const text = useTypewriter([...TYPEWRITER_TEXTS]);
  return (
    <div className="flex items-center min-h-[32px] mb-4">
      <span className="text-base lg:text-lg font-light text-white/80 tracking-wide">
        {text}
      </span>
      <span className="ml-0.5 inline-block w-[2px] h-5 bg-red-600 rounded-full animate-pulse" />
    </div>
  );
});

// ── Canvas loading fallback (no Three.js dependency) ──
function CanvasLoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-red-600/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white text-lg font-medium tracking-wider">Loading 3D Experience...</p>
        <p className="text-gray-400 text-sm">Downloading renderer</p>
      </div>
    </div>
  );
}

// ── Main export ──
export default function CarShowcase3D({ ctaButtons }: { ctaButtons?: React.ReactNode }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = CAR_COLORS[selectedColorIndex];
  const [tier] = useState<DeviceTier>(() => getDeviceTier());
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* Low-tier: static hero image (0 KB Three.js download) */}
      {tier === 'low' ? (
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp"
            alt="Ferrari 458 Italia"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        </div>
      ) : (
        /* Mid/High: dynamically imported 3D Canvas */
        <Suspense fallback={<CanvasLoadingFallback />}>
          <CarShowcase3DCanvas
            selectedColor={selectedColor.color}
            tier={tier}
            reducedMotion={!!prefersReducedMotion}
          />
        </Suspense>
      )}

      {/* ── Overlay UI ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* ─────────────────────────────────────
             MOBILE LAYOUT  (< 768px / md)
             Top: compact brand bar
             Upper-third: headline + typewriter
             Center: OPEN for 3D car
             Bottom: slim CTA row → color picker
           ───────────────────────────────────── */}

        {/* ─── TOP SECTION (mobile: brand + text compact | desktop: brand bar) ─── */}
        <div className="absolute top-0 left-0 right-0 z-10">
          {/* Brand bar — always visible */}
          <div className="flex items-start justify-between px-4 pt-4 md:px-10 md:pt-8">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-1 h-8 md:h-10 bg-gradient-to-b from-red-600 to-red-900 rounded-full" />
              <div>
                <h1 className="text-base md:text-2xl font-bold text-white tracking-wider leading-none">
                  AUTO<span className="text-red-600">SPARK</span>
                </h1>
                <p className="text-[8px] md:text-[9px] text-gray-500 tracking-[0.3em] uppercase mt-0.5">
                  Premium Automobiles
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[9px] md:text-[10px] tracking-widest uppercase">Featured</p>
              <h2 className="text-white text-sm md:text-lg font-light tracking-wider leading-tight">
                Ferrari <span className="font-bold">458 Italia</span>
              </h2>
            </div>
          </div>

        </div>

        {/* ─── MOBILE ONLY — Hero headline + typewriter (independently positioned) ─── */}
        <div className="absolute left-0 right-0 top-[22%] z-10 px-5 md:hidden">
          <h2 className="text-[1.65rem] font-black text-white tracking-tight leading-[1]">
            EXPERIENCE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
              EXCELLENCE
            </span>
          </h2>
          <div className="w-8 h-[2px] bg-gradient-to-r from-red-600 to-transparent mt-2 mb-1.5" />
          <TypewriterMobile />
        </div>

        {/* ─── DESKTOP ONLY — LEFT SIDE Hero Text (vertically centered) ─── */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 max-w-sm lg:max-w-md hidden md:block">
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-4">
            EXPERIENCE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
              EXCELLENCE
            </span>
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-red-600 to-transparent mb-4" />
          <TypewriterDesktop />
          <p className="text-gray-600 text-xs tracking-wider">
            Drag to rotate &bull; Scroll to zoom
          </p>
        </div>

        {/* ─── RIGHT SIDE — Specs (desktop only) ─── */}
        <div className="absolute right-10 top-1/2 -translate-y-[30%] z-10 hidden lg:flex flex-col gap-2 items-end">
          {[
            { label: 'Engine', value: '4.5L V8' },
            { label: 'Power', value: '570 HP' },
            { label: '0-60', value: '3.0 sec' },
            { label: 'Top Speed', value: '202 mph' },
          ].map((spec) => (
            <div
              key={spec.label}
              className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5"
            >
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">{spec.label}</span>
              <span className="text-white text-xs font-semibold">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* ─── BOTTOM ZONE — CTA buttons + color picker ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-2 pb-4 md:pb-6">
          {/* CTA buttons — injected from parent */}
          {ctaButtons && (
            <div className="pointer-events-auto w-full px-4 md:px-0">
              {ctaButtons}
            </div>
          )}

          {/* Color Selector — hidden on low-tier (no 3D model to colorize) */}
          {tier !== 'low' && (
          <div className="pointer-events-auto max-w-[calc(100vw-2rem)]">
            <div
              className="flex items-center gap-2 md:gap-6 bg-black/60 backdrop-blur-xl px-3 py-2 md:px-8 md:py-4 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto scrollbar-hide"
              role="radiogroup"
              aria-label="Select car color"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <span className="text-gray-500 text-[10px] uppercase tracking-widest hidden md:block flex-shrink-0">
                Color
              </span>
              <div className="flex gap-1.5 md:gap-3 flex-shrink-0">
                {CAR_COLORS.map((colorOption, index) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColorIndex(index)}
                    aria-label={`Select ${colorOption.name} color`}
                    aria-checked={selectedColorIndex === index}
                    role="radio"
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-300 border-2 flex-shrink-0 ${
                      selectedColorIndex === index
                        ? 'border-white scale-125 shadow-lg shadow-white/20'
                        : 'border-transparent hover:scale-110 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    title={colorOption.name}
                  />
                ))}
              </div>
              <span className="text-white text-sm font-medium min-w-[100px] text-right hidden md:block flex-shrink-0">
                {selectedColor.name}
              </span>
            </div>
          </div>
          )}
        </div>

        {/* ─── Corner accents ─── */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 hidden md:block">
          <div className="absolute top-6 right-6 w-16 h-[1px] bg-gradient-to-l from-red-600 to-transparent" />
          <div className="absolute top-6 right-6 w-[1px] h-16 bg-gradient-to-b from-red-600 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 hidden md:block">
          <div className="absolute bottom-6 left-6 w-16 h-[1px] bg-gradient-to-r from-red-600 to-transparent" />
          <div className="absolute bottom-6 left-6 w-[1px] h-16 bg-gradient-to-t from-red-600 to-transparent" />
        </div>
      </div>
    </div>
  );
}
