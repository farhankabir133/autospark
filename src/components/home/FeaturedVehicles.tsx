import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Eye, Fuel, Gauge, Calendar, Cog, X, GitCompareArrows } from 'lucide-react';
import type { Vehicle } from '../../types';
import { formatPrice, calculateEMI } from '../../utils/format';
import { ScrollReveal, StaggerContainer, staggerItemVariants } from '../motion';
import { motion } from 'framer-motion';
import { useTilt } from '../../hooks/useTilt';
import { carSlides } from '../../data/carSlides';

type Props = {
  vehicles: Vehicle[];
  theme?: string;
  language?: string;
  supportsRichAnimations?: boolean;
  onAddToCompare?: (v: Vehicle) => void;
};

type FilterKey = 'all' | 'hybrid' | 'suv' | 'sedan' | 'mpv';
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const FILTERS: { key: FilterKey; en: string; bn: string }[] = [
  { key: 'all', en: 'All', bn: 'সব' },
  { key: 'hybrid', en: 'Hybrid', bn: 'হাইব্রিড' },
  { key: 'suv', en: 'SUV', bn: 'এসইউভি' },
  { key: 'sedan', en: 'Sedan', bn: 'সেডান' },
  { key: 'mpv', en: 'MPV', bn: 'এমপিভি' },
];

const SORTS: { key: SortKey; en: string; bn: string }[] = [
  { key: 'featured', en: 'Featured', bn: 'নির্বাচিত' },
  { key: 'price-asc', en: 'Price: Low to High', bn: 'দাম: কম থেকে বেশি' },
  { key: 'price-desc', en: 'Price: High to Low', bn: 'দাম: বেশি থেকে কম' },
  { key: 'newest', en: 'Newest First', bn: 'নতুন আগে' },
];

function matchesFilter(v: Vehicle, f: FilterKey): boolean {
  if (f === 'all') return true;
  const fuel = (v.fuel_type || '').toLowerCase();
  const body = (v.body_type || '').toLowerCase();
  if (f === 'hybrid') return fuel.includes('hybrid');
  if (f === 'suv') return body.includes('suv') || body.includes('crossover') || body.includes('jeep');
  if (f === 'sedan') return body.includes('sedan') || body.includes('saloon');
  if (f === 'mpv') return body.includes('mpv') || body.includes('van') || body.includes('wagon') || body.includes('noah');
  return true;
}

/** Map a curated slide to the Vehicle shape so the grid works with no DB rows. */
function slideToVehicle(s: (typeof carSlides)[number]): Vehicle {
  const now = new Date().toISOString();
  const featureText = (s.features || []).join(' ').toLowerCase();
  const fuel_type = featureText.includes('hybrid')
    ? 'Hybrid'
    : featureText.includes('turbo')
      ? 'Petrol Turbo'
      : 'Petrol';
  const transmission = featureText.includes('cvt') ? 'CVT' : 'Automatic';
  const price = typeof s.price === 'number' ? s.price : Number(String(s.price).replace(/[^0-9.-]+/g, '')) || 0;
  return {
    id: s.id,
    stock_number: s.id,
    brand_name: s.brand,
    model: `${s.brand} ${s.model}`,
    year: s.year,
    price,
    mileage: 0,
    fuel_type,
    transmission,
    engine_capacity: s.features?.[0],
    color_exterior: (s as { color?: string }).color,
    body_type: (s as { bodyType?: string }).bodyType,
    condition: 'Used',
    description_en: (s as { tagline?: string }).tagline || (s as { subtitle?: string }).subtitle || '',
    is_available: true,
    is_featured: true,
    view_count: 0,
    created_at: now,
    updated_at: now,
    images: [
      {
        id: `${s.id}-1`,
        vehicle_id: s.id,
        image_url: s.image,
        display_order: 1,
        is_primary: true,
        created_at: now,
      },
    ],
  };
}

function primaryImage(v: Vehicle): string {
  const imgs = [...(v.images ?? [])].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order,
  );
  return (
    imgs[0]?.image_url ||
    'https://images.pexels.com/photos/3964962/pexels-photo-3964962.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp'
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="fv-spec">
      <span className="fv-spec-icon" aria-hidden="true">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}

/** Quick-view dialog — replaces the old hover flip-card with an accessible modal. */
function QuickViewModal({
  vehicle,
  onClose,
  onAddToCompare,
  dark,
  bn,
}: {
  vehicle: Vehicle | null;
  onClose: () => void;
  onAddToCompare?: (v: Vehicle) => void;
  dark: boolean;
  bn: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!vehicle) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [vehicle, onClose]);

  if (!vehicle) return null;
  const img = primaryImage(vehicle);
  const title = bn ? vehicle.description_bn || vehicle.model : vehicle.description_en || vehicle.model;
  const emi = vehicle.price > 0 ? calculateEMI(vehicle.price, 9, 5) : 0;
  const lang = (bn ? 'bn' : 'en') as 'en' | 'bn';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl ${
          dark ? 'bg-[#121212] text-white border border-white/10' : 'bg-white text-gray-900 border border-black/10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/8] overflow-hidden bg-black/10">
          <img src={encodeURI(img)} alt={vehicle.model} className="h-full w-full object-cover" />
          <div className="fv-scrim" aria-hidden="true" />
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={bn ? 'বন্ধ করুন' : 'Close quick view'}
            className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="fv-price absolute bottom-3 left-4 text-2xl">{formatPrice(vehicle.price, lang)}</p>
        </div>
        <div className="p-5 sm:p-6">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? 'text-red-400/90' : 'text-red-700'}`}>
            {vehicle.brand_name} · {vehicle.stock_number} · {vehicle.year}
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">{title}</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {vehicle.fuel_type && <Spec icon={<Fuel className="h-3 w-3" />} label={vehicle.fuel_type} />}
            {vehicle.transmission && <Spec icon={<Cog className="h-3 w-3" />} label={vehicle.transmission} />}
            {vehicle.engine_capacity && <Spec icon={<Gauge className="h-3 w-3" />} label={vehicle.engine_capacity} />}
            {vehicle.body_type && <Spec icon={<Calendar className="h-3 w-3" />} label={vehicle.body_type} />}
            {Number(vehicle.mileage || 0) > 0 && (
              <Spec icon={<Gauge className="h-3 w-3" />} label={`${Number(vehicle.mileage).toLocaleString()} km`} />
            )}
          </div>
          {emi > 0 && (
            <p className={`mt-3 text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>
              {bn ? 'আনুমানিক EMI' : 'Est. EMI'}: <span className="font-semibold">{formatPrice(emi, lang)}</span>
              {bn ? '/মাস (৯%, ৫ বছর)' : '/mo (9%, 5 yrs)'}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              to={`/vehicle/${vehicle.id}`}
              className="fv-btn flex-1 justify-center bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
            >
              {bn ? 'সম্পূর্ণ বিবরণ' : 'View full details'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {onAddToCompare && (
              <button
                onClick={() => {
                  onAddToCompare(vehicle);
                  onClose();
                }}
                className={`fv-btn flex-1 justify-center ${dark ? 'fv-btn-dark' : 'fv-btn-light'}`}
              >
                <GitCompareArrows className="h-4 w-4" />
                {bn ? 'তুলনায় যুক্ত করুন' : 'Add to comparison'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedVehicles({ vehicles, theme = 'dark', language = 'en', supportsRichAnimations = true, onAddToCompare }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [quickView, setQuickView] = useState<Vehicle | null>(null);
  const tilt = useTilt(supportsRichAnimations);
  const dark = theme === 'dark';
  const bn = language === 'bn';
  const lang = (bn ? 'bn' : 'en') as 'en' | 'bn';

  // DB rows first; curated slides keep the section alive when the DB is empty.
  const source = useMemo(
    () => (vehicles && vehicles.length > 0 ? vehicles : carSlides.map(slideToVehicle)),
    [vehicles],
  );

  const filtered = useMemo(() => {
    const list = source.filter((v) => matchesFilter(v, filter));
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') sorted.sort((a, b) => b.year - a.year);
    return sorted.slice(0, 6);
  }, [source, filter, sort]);

  const [hero, ...rest] = filtered;

  const cardShell = (spotlight: boolean) =>
    `fv-card group relative overflow-hidden rounded-[1.4rem] transition-[border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-1.5 ${
      dark
        ? 'bg-white/[0.035] border border-white/10 hover:border-red-500/40 hover:shadow-[0_24px_60px_-16px_rgba(184,0,0,0.35)]'
        : 'bg-white border border-black/[0.07] shadow-[0_10px_36px_-18px_rgba(0,0,0,0.35)] hover:border-red-600/30 hover:shadow-[0_28px_60px_-20px_rgba(184,0,0,0.3)]'
    } ${spotlight ? 'fv-spotlight' : ''}`;

  const openQuickView = (e: React.MouseEvent, v: Vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(v);
    import('../../utils/AudioManager').then((m) => m.AudioManager.playVehicleSelect()).catch(() => {});
  };

  const renderCard = (v: Vehicle, i: number, large = false) => {
    const img = primaryImage(v);
    const title = bn ? v.description_bn || v.model : v.description_en || v.model;
    const isHybrid = (v.fuel_type || '').toLowerCase().includes('hybrid');
    return (
      <motion.article
        key={v.id}
        variants={staggerItemVariants}
        className={large ? 'md:col-span-2' : ''}
        style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 420px' } as React.CSSProperties}
      >
        <Link
          to={`/vehicle/${v.id}`}
          aria-label={bn ? `${v.model} এর বিবরণ দেখুন` : `View ${v.model} details`}
          className={cardShell(large)}
          onMouseMove={tilt.onMove}
          onMouseLeave={tilt.onLeave}
        >
          {/* image */}
          <div className={`relative overflow-hidden ${large ? 'aspect-[16/8]' : 'aspect-[16/9]'}`}>
            <img
              src={encodeURI(img)}
              alt={v.model}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              width={large ? 880 : 640}
              height={large ? 440 : 360}
              className="fv-img h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.pexels.com/photos/3964962/pexels-photo-3964962.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp';
              }}
            />
            <div className="fv-scrim" aria-hidden="true" />
            <div className="fv-sheen" aria-hidden="true" />

            {/* top row badges */}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <div className="flex flex-wrap gap-2">
                <span className="fv-badge fv-badge-red">
                  <span className="fv-pulse-dot" aria-hidden="true" />
                  {v.body_type || (bn ? 'প্রিমিয়াম' : 'Premium')}
                </span>
                {isHybrid && <span className="fv-badge fv-badge-green">HYBRID</span>}
              </div>
              <span className="fv-badge fv-badge-glass">{v.year}</span>
            </div>

            {/* floating price + quick view */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
              <p className={`fv-price ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{formatPrice(v.price, lang)}</p>
              <span className="flex items-center gap-2">
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={bn ? `${v.model} কুইক ভিউ` : `Quick view ${v.model}`}
                  title={bn ? 'কুইক ভিউ' : 'Quick view'}
                  onClick={(e) => openQuickView(e, v)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickView(v);
                    }
                  }}
                  className="fv-cta"
                >
                  <Eye className="h-4 w-4" />
                  {bn ? 'কুইক ভিউ' : 'Quick view'}
                </span>
                <span className="fv-cta">
                  {bn ? 'বিস্তারিত' : 'Details'}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </span>
            </div>
          </div>

          {/* body */}
          <div className="relative p-5 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${dark ? 'text-red-400/90' : 'text-red-700'}`}>
                  {v.brand_name} · {v.stock_number}
                </p>
                <h3 className={`mt-1 truncate text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'} ${large ? 'md:text-2xl' : ''}`}>
                  {title}
                </h3>
              </div>
              {Number(v.mileage || 0) > 0 && (
                <span className={`hidden shrink-0 items-center gap-1 text-xs font-medium sm:flex ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                  <Gauge className="h-3.5 w-3.5" />
                  {Number(v.mileage || 0).toLocaleString()} km
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Spec icon={<Calendar className="h-3 w-3" />} label={String(v.year)} />
              {v.fuel_type && <Spec icon={<Fuel className="h-3 w-3" />} label={v.fuel_type} />}
              {v.transmission && <Spec icon={<Cog className="h-3 w-3" />} label={v.transmission} />}
              {v.engine_capacity && <Spec icon={<Gauge className="h-3 w-3" />} label={v.engine_capacity} />}
            </div>

            <div className={`mt-4 flex items-center justify-between border-t pt-3 text-sm ${dark ? 'border-white/10' : 'border-black/10'}`}>
              <span className={`font-medium ${dark ? 'text-white/60' : 'text-gray-500'}`}>
                {bn ? 'শোরুমে উপলব্ধ' : 'Available now'}
              </span>
              <span className="flex items-center gap-3">
                {onAddToCompare && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={bn ? 'তুলনায় যুক্ত করুন' : 'Add to comparison'}
                    title={bn ? 'তুলনায় যুক্ত করুন' : 'Add to comparison'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddToCompare(v);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onAddToCompare(v);
                      }
                    }}
                    className={`fv-link ${dark ? 'text-white/60' : 'text-gray-500'}`}
                  >
                    <GitCompareArrows className="h-4 w-4" />
                  </span>
                )}
                <span className="fv-link">
                  {bn ? 'এক্সপ্লোর করুন' : 'Explore'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  };

  return (
    <section aria-label={bn ? 'বৈশিষ্ট্যযুক্ত গাড়ি' : 'Featured vehicles'} className={`fv-section relative overflow-hidden ${dark ? 'bg-[#070707]' : 'bg-[#fafafa]'}`}>
      {/* ambient background — transform-only drift, disabled when reduced motion */}
      {supportsRichAnimations && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="fv-orb fv-orb-a" />
          <div className="fv-orb fv-orb-b" />
          <div className={`absolute inset-0 ${dark ? 'fv-grid-dark' : 'fv-grid-light'}`} />
          <div className={`absolute inset-x-0 top-0 h-px ${dark ? 'bg-gradient-to-r from-transparent via-red-600/40 to-transparent' : 'bg-gradient-to-r from-transparent via-red-600/25 to-transparent'}`} />
        </div>
      )}

      <div className="container-fluid relative z-10">
        {/* header */}
        <ScrollReveal className="mb-8 flex flex-col gap-6 md:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="fv-eyebrow">
              <span className="fv-eyebrow-line" aria-hidden="true" />
              {bn ? 'কিউরেটেড সিলেকশন' : 'Curated selection'}
            </p>
            <h2 className={`mt-3 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-gray-950'}`}>
              {bn ? 'বৈশিষ্ট্যযুক্ত গাড়ি' : 'Featured '}
              <span className="text-gradient-brand-animated">{bn ? 'সংগ্রহ' : 'Vehicles'}</span>
            </h2>
            <p className={`mt-3 max-w-xl text-base leading-relaxed sm:text-lg ${dark ? 'text-white/55' : 'text-gray-600'}`}>
              {bn
                ? 'তাত্ক্ষণিক ডেলিভারির জন্য হাতে বাছাই করা প্রিমিয়াম গাড়ি — স্বচ্ছ মূল্য, যাচাইকৃত ইতিহাস।'
                : 'Hand-picked premium vehicles ready for immediate delivery — transparent pricing, verified history.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* filter pills */}
            <div role="tablist" aria-label={bn ? 'যানবাহন ফিল্টার' : 'Filter vehicles'} className={`fv-pills ${dark ? 'fv-pills-dark' : 'fv-pills-light'}`}>
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`fv-pill ${filter === f.key ? 'fv-pill-active' : ''}`}
                >
                  {bn ? f.bn : f.en}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="fv-sort" className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                {bn ? 'সাজান' : 'Sort'}
              </label>
              <select
                id="fv-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={`fv-sort ${dark ? 'fv-sort-dark' : 'fv-sort-light'}`}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {bn ? s.bn : s.en}
                  </option>
                ))}
              </select>
              <Link to="/inventory" className="fv-viewall">
                {bn ? 'সব দেখুন' : 'View all'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* single live status for screen readers */}
        <p className="sr-only" aria-live="polite">
          {bn
            ? `${source.length}টি গাড়ির মধ্যে ${filtered.length}টি দেখানো হচ্ছে`
            : `Showing ${filtered.length} of ${source.length} featured vehicles`}
        </p>

        {/* marquee strip */}
        {supportsRichAnimations && (
          <div className="fv-marquee mb-8" aria-hidden="true">
            <div className="fv-marquee-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="fv-marquee-chunk">
                  {['TOYOTA', 'HONDA', 'NISSAN', 'MITSUBISHI', 'SUZUKI', 'LEXUS', 'BMW', 'MERCEDES'].map((b) => (
                    <span key={`${dup}-${b}`} className="fv-marquee-item">
                      {b} <i>◆</i>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* grid — hero + rest */}
        {filtered.length === 0 ? (
          <p className={`rounded-2xl border border-dashed p-10 text-center ${dark ? 'border-white/15 text-white/50' : 'border-black/15 text-gray-500'}`}>
            {bn ? 'এই ফিল্টারে কোনো গাড়ি নেই।' : 'No vehicles match this filter yet.'}
          </p>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6" stagger={0.07}>
            {hero && renderCard(hero, 0, true)}
            {rest.map((v, i) => renderCard(v, i + 1))}
          </StaggerContainer>
        )}

        {/* footer strip */}
        <ScrollReveal className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row" delay={0.1}>
          <p className={`text-sm ${dark ? 'text-white/45' : 'text-gray-500'}`}>
            {bn
              ? `${source.length}টি বৈশিষ্ট্যযুক্ত গাড়ির মধ্যে ${filtered.length}টি দেখানো হচ্ছে`
              : `Showing ${filtered.length} of ${source.length} featured vehicles`}
          </p>
          <Link to="/inventory" className={`fv-btn ${dark ? 'fv-btn-dark' : 'fv-btn-light'}`}>
            {bn ? 'সম্পূর্ণ ইনভেন্টরি ব্রাউজ করুন' : 'Browse full inventory'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </div>

      <QuickViewModal vehicle={quickView} onClose={() => setQuickView(null)} onAddToCompare={onAddToCompare} dark={dark} bn={bn} />
    </section>
  );
}
