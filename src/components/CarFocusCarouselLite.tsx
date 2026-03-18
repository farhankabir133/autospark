import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { carSlides } from '../data/carSlides';
import { formatPrice } from '../utils/format';

interface CarFocusCarouselProps {
  initialCarId?: string;
  onCarChange?: (carId: string, index: number) => void;
}

export interface CarFocusCarouselHandle {
  goToCarById: (carId: string) => void;
  goToIndex: (index: number) => void;
  getCurrentCarId: () => string | undefined;
}

const CarFocusCarouselInner = ({ initialCarId, onCarChange }: CarFocusCarouselProps, ref: React.Ref<CarFocusCarouselHandle>) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<Array<HTMLDivElement | null>>([]);
  const { theme } = useTheme();

  const [flippedFullIndex, setFlippedFullIndex] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    goToCarById: (carId: string) => {
      const idx = carSlides.findIndex((c) => c.id === carId);
      if (idx >= 0) goToIndex(idx);
    },
    goToIndex: (index: number) => goToIndex(index),
    getCurrentCarId: () => carSlides[findNearestIndex()]?.id,
  }));

  const slides = useMemo(() => carSlides, []);

  const computeMetrics = () => {
    const track = trackRef.current;
    if (!track) return { center: 0, offsets: [] as number[] };
    const offsets = slidesRef.current.map((el) => (el ? el.offsetLeft + (el.offsetWidth / 2) : 0));
    return { center: track.clientWidth / 2 + track.scrollLeft, offsets };
  };

  const findNearestIndex = () => {
    const { center, offsets } = computeMetrics();
    if (offsets.length === 0) return 0;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < offsets.length; i++) {
      const dist = Math.abs(offsets[i] - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
    return best;
  };

  const goToIndex = (index: number) => {
    const track = trackRef.current;
    const el = slidesRef.current[index];
    if (!track || !el) return;
    const off = el.offsetLeft;
    const w = el.offsetWidth;
    const target = off - (track.clientWidth / 2) + (w / 2);
    track.scrollTo({ left: target, behavior: 'smooth' });
    if (onCarChange) onCarChange(carSlides[index].id, index);
  };

  useEffect(() => {
    setTimeout(() => {
      if (initialCarId) {
        const idx = carSlides.findIndex((c) => c.id === initialCarId);
        if (idx >= 0) goToIndex(idx);
      } else {
        const mid = Math.floor(carSlides.length / 2);
        goToIndex(mid);
      }
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCarId]);

  const FlipInner = ({ car, flipped }: { car: any; flipped: boolean }) => {
    const innerStyle: React.CSSProperties = { width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 560ms ease', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' };
    const faceStyle: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden' };
    const backStyle: React.CSSProperties = { ...faceStyle, transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 16 };

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={innerStyle}>
          <div style={faceStyle} className="w-full h-full">
            <img className="carousel-image w-full h-full object-cover" src={car.image} alt={`${car.brand} ${car.model}`} loading="lazy" style={{ filter: theme === 'dark' ? 'contrast(1.05) brightness(0.98) saturate(0.95)' : 'contrast(1.08) brightness(1.08) saturate(1.08)' }} />
          </div>
          <div style={backStyle} className={theme === 'dark' ? 'bg-black/80 text-white' : 'bg-white text-gray-900'}>
            <div className="text-center">
              <div className="text-sm text-gray-400">{car.brand} · {car.year}</div>
              <div className="text-2xl font-bold mt-2">{car.model}</div>
              <div className="mt-2 text-sm text-gray-500">{car.subtitle}</div>
              <div className="mt-4 text-xl font-extrabold">{formatPrice(car.price as any)}</div>
              <div className="mt-4 flex gap-2 flex-wrap justify-center">{(car.features || []).slice(0, 6).map((f: string) => (<span key={f} className="text-xs px-2 py-1 bg-white/6 rounded">{f}</span>))}</div>
            </div>
            <div className="mt-6">
              <button onClick={(e) => { e.stopPropagation(); setFlippedFullIndex(null); }} className="px-4 py-2 rounded bg-[var(--accent)] text-white font-semibold">Close</button>
              <Link to={`/vehicle/${car.id}`} onClick={(e) => e.stopPropagation()} className="ml-3 text-sm underline">View full details</Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentIdx = findNearestIndex();

  return (
    <section className="relative w-full overflow-hidden py-8">
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Featured Vehicles</h3>
          <div className="flex gap-2">
            <button aria-label="Previous" onClick={() => { const idx = Math.max(0, findNearestIndex() - 1); goToIndex(idx); }} className="p-2 rounded-full bg-white/6"><ChevronLeft className="w-5 h-5 text-white" /></button>
            <button aria-label="Next" onClick={() => { const idx = Math.min(carSlides.length - 1, findNearestIndex() + 1); goToIndex(idx); }} className="p-2 rounded-full bg-white/6"><ChevronRight className="w-5 h-5 text-white" /></button>
          </div>
        </div>

        <div ref={trackRef} className="carousel-track relative z-10 flex gap-6 overflow-x-auto no-scrollbar py-6 px-2 touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
          {slides.map((car, idx) => {
            const isFlipped = flippedFullIndex === idx;
            return (
              <div key={car.id} ref={(el) => (slidesRef.current[idx] = el)} className={`group carousel-slide snap-center flex-none rounded-xl overflow-hidden bg-transparent border border-white/5 shadow-lg focus:outline-none transform transition-transform duration-300 ease-out w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[36%] max-w-[1400px] min-h-[320px] md:min-h-[420px] lg:min-h-[520px] aspect-square flex flex-col justify-between`} style={{ cursor: 'pointer' }} role="group" tabIndex={0}
                onClick={() => { const nearest = findNearestIndex(); if (nearest === idx) { setFlippedFullIndex((p) => (p === idx ? null : idx)); } else { goToIndex(idx); } }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const nearest = findNearestIndex(); if (nearest === idx) setFlippedFullIndex((p) => (p === idx ? null : idx)); else goToIndex(idx); } }}>
                <div className="relative h-[70%] w-full bg-gray-800 overflow-hidden" style={{ perspective: 1200 }}>
                  <FlipInner car={car} flipped={isFlipped} />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2 tracking-wider">{car.brand}</div>
                    <div className="text-2xl md:text-3xl font-extrabold text-white leading-tight truncate">{car.model}</div>
                    <div className="text-sm md:text-base text-gray-300 mt-2 truncate">{car.subtitle}</div>
                  </div>

                  <div className="mt-4">
                    <div className="rounded-xl p-3 flex items-center justify-between" style={ theme === 'dark' ? { backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.12)' } : { background: 'rgba(255,255,255,0.98)', boxShadow: '0 10px 30px rgba(16,24,40,0.08)', border: '1px solid rgba(0,0,0,0.06)' } }>
                      <div>
                        <div className={theme === 'dark' ? 'text-xs text-gray-200' : 'text-xs text-gray-600'}>From</div>
                        <div className={theme === 'dark' ? 'text-xl font-bold text-white' : 'text-xl font-extrabold text-gray-900'} style={{letterSpacing: '-0.2px'}}>{formatPrice(car.price as any)}</div>
                      </div>

                      <div>
                        <Link to={`/vehicle/${car.id}`} className="text-sm text-[var(--accent)] font-semibold uppercase tracking-wide" onClick={(e) => e.stopPropagation()}>
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full mt-6 px-2">
          <div className="w-full h-1 rounded-full bg-white/6 overflow-hidden">
            <div aria-hidden className="h-full" style={{ width: `${((currentIdx + 1) / carSlides.length) * 100}%`, backgroundColor: 'var(--accent)', transition: 'width 240ms linear' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

const CarFocusCarousel = forwardRef<CarFocusCarouselHandle, CarFocusCarouselProps>(CarFocusCarouselInner);
CarFocusCarousel.displayName = 'CarFocusCarousel';

export default CarFocusCarousel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
