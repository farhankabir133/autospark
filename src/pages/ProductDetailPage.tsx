import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  Star,
  Truck,
  Shield,
  Package,
  Plus,
  Minus,
  RotateCcw,
  Check,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductById, DEMO_PRODUCTS } from '../data/demoProducts';
import { PageHead } from '../components/PageHead';

interface ProductImage {
  image_url: string;
}

interface Product {
  id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  description_bn?: string;
  category: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  is_available: boolean;
  images?: ProductImage[];
  brand?: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  compatibility?: string[];
  specifications?: Record<string, string>;
}

type Status = 'loading' | 'error' | 'not-found' | 'ready';

const FETCH_TIMEOUT_MS = 12000;
const MAX_ID_LENGTH = 128;
const WISHLIST_KEY = 'autospark_wishlist';

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

/** Sanitize the :id route param — reject empty/malformed values before any fetch. */
function sanitizeId(raw: string | undefined): string | null {
  if (!raw) return null;
  const id = raw.trim().slice(0, MAX_ID_LENGTH);
  if (!id) return null;
  // IDs in this app are alphanumeric + a small set of safe symbols.
  if (!/^[A-Za-z0-9 _\-./#+()]+$/.test(id)) return null;
  return id;
}

function toImageList(input: unknown): ProductImage[] {
  try {
    const parsed = typeof input === 'string' ? JSON.parse(input) : input;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((img) => {
        if (typeof img === 'string') return { image_url: img };
        if (img && typeof img === 'object' && typeof (img as ProductImage).image_url === 'string') {
          return { image_url: (img as ProductImage).image_url };
        }
        return null;
      })
      .filter((x): x is ProductImage => x !== null && x.image_url.length > 0)
      .slice(0, 12);
  } catch {
    return [];
  }
}

/** Normalize + validate any backend/demo row into a safe Product. Returns null if unusable. */
function normalizeProduct(row: unknown): Product | null {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  const id = typeof r.id === 'string' || typeof r.id === 'number' ? String(r.id) : null;
  const name_en = typeof r.name_en === 'string' && r.name_en.trim() ? r.name_en : null;
  const price = isFiniteNumber(r.price) ? r.price : Number(r.price);
  if (!id || !name_en || !isFiniteNumber(price) || price < 0) return null;

  const stockRaw = Number(r.stock_quantity);
  const discountRaw = Number(r.discount);
  const ratingRaw = Number(r.rating);
  const reviewsRaw = Number(r.reviews);

  return {
    id,
    name_en,
    name_bn: typeof r.name_bn === 'string' ? r.name_bn : '',
    description_en: typeof r.description_en === 'string' ? r.description_en : undefined,
    description_bn: typeof r.description_bn === 'string' ? r.description_bn : undefined,
    category: typeof r.category === 'string' ? r.category : 'Accessories',
    price,
    stock_quantity: Number.isFinite(stockRaw) && stockRaw >= 0 ? Math.floor(stockRaw) : 0,
    sku: typeof r.sku === 'string' ? r.sku : undefined,
    is_available: r.is_available !== false,
    images: toImageList(r.images),
    brand: typeof r.brand === 'string' && r.brand ? r.brand : undefined,
    rating: Number.isFinite(ratingRaw) && ratingRaw >= 0 ? Math.min(5, ratingRaw) : undefined,
    reviews: Number.isFinite(reviewsRaw) && reviewsRaw >= 0 ? Math.floor(reviewsRaw) : undefined,
    discount:
      Number.isFinite(discountRaw) && discountRaw > 0 && discountRaw < 100 ? discountRaw : undefined,
    compatibility: Array.isArray(r.compatibility)
      ? r.compatibility.filter((c): c is string => typeof c === 'string').slice(0, 20)
      : undefined,
    specifications:
      r.specifications && typeof r.specifications === 'object' && !Array.isArray(r.specifications)
        ? Object.fromEntries(
            Object.entries(r.specifications as Record<string, unknown>)
              .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
              .map(([k, v]) => [String(k).slice(0, 80), String(v).slice(0, 200)]),
          )
        : undefined,
  };
}

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

const formatBDT = (n: number): string => {
  try {
    return `৳${Math.round(n).toLocaleString('en-IN')}`;
  } catch {
    return `৳${Math.round(n)}`;
  }
};

export const ProductDetailPage = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { addToCart } = useCart();

  const isDark = theme === 'dark';
  const productId = useMemo(() => sanitizeId(rawId), [rawId]);

  const [status, setStatus] = useState<Status>('loading');
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [shared, setShared] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const mountedRef = useRef(true);
  const cartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (cartTimerRef.current) clearTimeout(cartTimerRef.current);
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
    };
  }, []);

  // Fetch product — race-safe, timed out, and never sets state after unmount.
  useEffect(() => {
    // Per-product UI reset on navigation between products.
    setProduct(null);
    setQuantity(1);
    setSelectedImage(0);
    setAddedToCart(false);
    setShared(false);
    setImgBroken(false);

    if (!productId) {
      setStatus('not-found');
      return;
    }

    setStatus('loading');
    try {
      setIsWishlisted(readWishlist().includes(productId));
    } catch {
      setIsWishlisted(false);
    }

    const controller = new AbortController();
    let cancelled = false;

    const finish = (fn: () => void) => {
      if (!cancelled && mountedRef.current) fn();
    };

    const withTimeout = <T,>(p: PromiseLike<T>): Promise<T> =>
      new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('fetch timeout')), FETCH_TIMEOUT_MS);
        Promise.resolve(p).then(
          (v) => {
            clearTimeout(timer);
            resolve(v);
          },
          (e) => {
            clearTimeout(timer);
            reject(e);
          },
        );
      });

    (async () => {
      // 1) Backend (when configured) with timeout.
      let timedOut = false;
      if (supabase) {
        try {
          const sel =
            'id,name_en,name_bn,description_en,description_bn,category,price,stock_quantity,sku,is_available,images,brand,rating,reviews,discount,compatibility,specifications';
          const res = await withTimeout(
            supabase.from('products').select(sel).eq('id', productId).limit(1).single(),
          );
          const normalized = normalizeProduct(res.data);
          if (!res.error && normalized) {
            finish(() => {
              setProduct(normalized);
              setStatus('ready');
            });
            return;
          }
          // Fall through to demo data on query error / invalid row.
        } catch (err) {
          // Timeout or network failure — fall through to demo data.
          timedOut = err instanceof Error && err.message === 'fetch timeout';
          if (import.meta.env.DEV) console.warn('[product] backend fetch failed, trying demo data:', err);
        }
      }

      // 2) Demo fallback (offline / misconfigured backend / timeout).
      const demo = normalizeProduct(getProductById(productId));
      finish(() => {
        if (demo) {
          setProduct(demo);
          setStatus('ready');
        } else if (timedOut) {
          setStatus('error');
        } else {
          setStatus('not-found');
        }
      });
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [productId, retryCount]);

  // Clamp quantity whenever product/stock resolves.
  const maxQty = useMemo(() => {
    if (!product) return 1;
    return Math.max(1, Math.min(product.stock_quantity, 999));
  }, [product]);

  useEffect(() => {
    setQuantity((q) => Math.max(1, Math.min(q, maxQty)));
  }, [maxQty]);

  useEffect(() => {
    setImgBroken(false);
  }, [selectedImage, product?.id]);

  const discountedPrice = useMemo(() => {
    if (!product) return 0;
    return product.discount ? product.price * (1 - product.discount / 100) : product.price;
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return DEMO_PRODUCTS.map((p) => normalizeProduct(p))
      .filter(
        (p): p is Product =>
          !!p && p.id !== product.id && p.category === product.category && p.is_available,
      )
      .slice(0, 4);
  }, [product]);

  const productName = product ? (language === 'bn' && product.name_bn ? product.name_bn : product.name_en) : '';
  const productDesc =
    product && language === 'bn' && product.description_bn
      ? product.description_bn
      : product?.description_en;

  const jsonLd = useMemo(() => {
    if (!product) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name_en,
      description: product.description_en || product.name_en,
      sku: product.sku,
      brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
      category: product.category,
      image: product.images?.map((i) => i.image_url),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BDT',
        price: discountedPrice.toFixed(0),
        availability:
          product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      aggregateRating:
        product.rating && product.reviews
          ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews }
          : undefined,
    };
  }, [product, discountedPrice]);

  const handleAddToCart = useCallback(() => {
    if (!product || quantity < 1 || product.stock_quantity === 0) return;
    try {
      addToCart({
        id: product.id,
        name: productName || product.name_en,
        price: discountedPrice,
        quantity: Math.min(quantity, maxQty),
        image: product.images?.[0]?.image_url,
      });
      setAddedToCart(true);
      if (cartTimerRef.current) clearTimeout(cartTimerRef.current);
      cartTimerRef.current = setTimeout(() => {
        if (mountedRef.current) setAddedToCart(false);
      }, 2000);
      import('sonner')
        .then((m) => m.toast.success('Added to cart'))
        .catch(() => {});
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[product] addToCart failed:', err);
    }
  }, [product, quantity, maxQty, addToCart, productName, discountedPrice]);

  const toggleWishlist = useCallback(() => {
    if (!product) return;
    setIsWishlisted((prev) => {
      const next = !prev;
      try {
        const list = readWishlist();
        const updated = next
          ? Array.from(new Set([...list, product.id]))
          : list.filter((x) => x !== product.id);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      } catch {
        /* storage unavailable — wishlist just won't persist */
      }
      return next;
    });
  }, [product]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (typeof nav.share === 'function') {
        await nav.share({ title: productName, text: productName, url });
        return;
      }
      throw new Error('Web Share unavailable');
    } catch (err) {
      // User cancelled the native sheet — not an error.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
        shareTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setShared(false);
        }, 2000);
      } catch {
        // Clipboard blocked (permissions) — fall back to a prompt the user can copy from.
        try {
          window.prompt('Copy product link:', url);
        } catch {
          /* ignore */
        }
      }
    }
  }, [productName]);

  const getStockStatus = () => {
    if (!product || product.stock_quantity === 0) return { label: 'Out of Stock', color: 'red' as const };
    if (product.stock_quantity <= 5)
      return { label: `Low Stock (only ${product.stock_quantity} left)`, color: 'orange' as const };
    return { label: 'In Stock', color: 'green' as const };
  };

  // ---------- States ----------

  if (status === 'loading') {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-3 ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}
        role="status"
        aria-live="polite"
        aria-label="Loading product"
      >
        <div className="w-8 h-8 border-2 border-[#C00000] border-t-transparent rounded-full animate-spin" />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading product…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
        <div className="text-center max-w-sm px-6" role="alert">
          <p className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            Couldn't load this product
          </p>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The connection timed out. Check your internet and try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="px-5 py-2.5 bg-[#C00000] text-white rounded-lg font-semibold hover:bg-red-700 inline-flex items-center gap-2"
            >
              <RotateCcw size={16} /> Retry
            </button>
            <button
              onClick={() => navigate('/accessories')}
              className={`px-5 py-2.5 rounded-lg border font-semibold ${isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
            >
              Back to Accessories
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'not-found' || !product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
        <div className="text-center px-6">
          <Package size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
          <p className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Product not found</p>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            This product may have been removed or the link is incorrect.
          </p>
          <button
            onClick={() => navigate('/accessories')}
            className="px-5 py-2.5 bg-[#C00000] text-white rounded-lg font-semibold hover:bg-red-700"
          >
            Back to Accessories
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const mainImage = product.images?.[selectedImage]?.image_url;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}
    >
      <PageHead
        title={`${productName} | Auto Spark BD`}
        description={productDesc || `${productName} — ${product.category} at Auto Spark BD, Rajshahi.`}
        image={product.images?.[0]?.image_url}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb & Back Button */}
      <div className={`${isDark ? 'bg-[#0a0a0a]' : 'bg-white'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/accessories')}
            className={`flex items-center gap-2 font-medium ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            <ChevronLeft size={20} aria-hidden />
            Back to Accessories
          </button>
          <span aria-hidden className={isDark ? 'text-gray-700' : 'text-gray-300'}>/</span>
          <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>{product.category}</span>
          <span aria-hidden className={isDark ? 'text-gray-700' : 'text-gray-300'}>/</span>
          <span aria-current="page" className={`truncate max-w-[40vw] ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {productName}
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div
              className={`mb-4 rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-200'} aspect-square flex items-center justify-center`}
            >
              {mainImage && !imgBroken ? (
                <img
                  src={mainImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={() => setImgBroken(true)}
                />
              ) : (
                <div className={`text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Package size={60} className="mx-auto mb-2 opacity-50" aria-hidden />
                  <p>No image available</p>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap" role="group" aria-label="Product images">
                {product.images.map((img, idx) => (
                  <button
                    key={`${img.image_url}-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    aria-pressed={selectedImage === idx}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition ${
                      selectedImage === idx
                        ? 'border-[#C00000]'
                        : isDark
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.visibility = 'hidden';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
              {productName}
            </h1>

            {(product.sku || product.brand) && (
              <div className={`flex gap-4 mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.brand && <span>Brand: {product.brand}</span>}
                {product.sku && <span>SKU: {product.sku}</span>}
              </div>
            )}

            {product.rating !== undefined && product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1" role="img" aria-label={`Rated ${product.rating.toFixed(1)} out of 5`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      aria-hidden
                      className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {product.rating.toFixed(1)} ({product.reviews || 0} reviews)
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <span className="text-3xl font-bold text-[#C00000]">{formatBDT(discountedPrice)}</span>
                {product.discount ? (
                  <>
                    <span className="text-lg line-through text-gray-500">{formatBDT(product.price)}</span>
                    <span className="ml-2 px-2 py-1 bg-[#C00000] text-white text-xs rounded font-bold">
                      -{product.discount}%
                    </span>
                  </>
                ) : null}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Price includes all taxes</p>
            </div>

            {/* Stock Status */}
            <div
              role="status"
              className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
                stockStatus.color === 'green'
                  ? isDark ? 'bg-green-900/20' : 'bg-green-50'
                  : stockStatus.color === 'orange'
                    ? isDark ? 'bg-orange-900/20' : 'bg-orange-50'
                    : isDark ? 'bg-red-900/20' : 'bg-red-50'
              }`}
            >
              <span aria-hidden className={`w-2.5 h-2.5 rounded-full ${stockStatus.color === 'green' ? 'bg-green-600' : stockStatus.color === 'orange' ? 'bg-orange-500' : 'bg-red-600'}`} />
              <span
                className={`font-semibold ${
                  stockStatus.color === 'green'
                    ? 'text-green-700 dark:text-green-400'
                    : stockStatus.color === 'orange'
                      ? 'text-orange-700 dark:text-orange-400'
                      : 'text-red-700 dark:text-red-400'
                }`}
              >
                {stockStatus.label}
              </span>
            </div>

            {/* Description */}
            {productDesc && (
              <div className="mb-6">
                <h2 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Description</h2>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {productDesc}
                </p>
              </div>
            )}

            {/* Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="mb-6">
                <h2 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Compatibility</h2>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((c) => (
                    <span
                      key={c}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h2 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Specifications</h2>
                <dl className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-1.5 border-b border-gray-200 dark:border-gray-800 last:border-0">
                      <dt className="font-medium shrink-0">{key}</dt>
                      <dd className="text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-4">
                <span id="qty-label" className={isDark ? 'text-gray-400' : 'text-gray-600'}>Quantity:</span>
                <div
                  role="group"
                  aria-labelledby="qty-label"
                  className={`flex items-center border rounded ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                  >
                    <Minus size={16} aria-hidden />
                  </button>
                  <span role="status" aria-label={`Quantity ${quantity}`} className={`px-4 py-2 font-bold tabular-nums ${isDark ? 'text-white' : 'text-black'}`}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={maxQty <= quantity}
                    aria-label="Increase quantity"
                    className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${maxQty <= quantity
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Plus size={16} aria-hidden />
                  </button>
                </div>
                {product.stock_quantity > 0 && (
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Max {maxQty}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || !product.is_available}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  product.stock_quantity === 0 || !product.is_available
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#C00000] text-white hover:bg-red-700'
                }`}
              >
                {addedToCart ? <Check size={20} aria-hidden /> : <ShoppingCart size={20} aria-hidden />}
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={toggleWishlist}
                aria-pressed={isWishlisted}
                className={`flex-1 py-2 rounded-lg border transition flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'bg-red-50 dark:bg-red-900/20 border-[#C00000] text-[#C00000]'
                    : isDark
                      ? 'border-gray-700 text-gray-400 hover:text-white'
                      : 'border-gray-300 text-gray-600 hover:text-black'
                }`}
              >
                <Heart size={18} aria-hidden fill={isWishlisted ? 'currentColor' : 'none'} />
                Wishlist
              </button>
              <button
                onClick={handleShare}
                className={`flex-1 py-2 rounded-lg border transition flex items-center justify-center gap-2 ${
                  isDark ? 'border-gray-700 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600 hover:text-black'
                }`}
              >
                {shared ? <Check size={18} aria-hidden /> : <Share2 size={18} aria-hidden />}
                {shared ? 'Link copied!' : 'Share'}
              </button>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Truck className="text-[#C00000] shrink-0" size={20} aria-hidden />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Free Shipping</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>On orders over ৳2,000</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Shield className="text-[#C00000] shrink-0" size={20} aria-hidden />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Secure Payment</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>100% secure checkout</p>
                </div>
              </div>
              <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <Package className="text-[#C00000] shrink-0" size={20} aria-hidden />
                <div className="text-sm">
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>30-Day Returns</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Easy returns & refunds</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-12">
            <h2 id="related-heading" className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
              Related products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/product/${encodeURIComponent(r.id)}`}
                  className={`rounded-lg overflow-hidden border transition hover:shadow-lg ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
                >
                  <div className={`aspect-square flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {r.images?.[0]?.image_url ? (
                      <img
                        src={r.images[0].image_url}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package size={32} aria-hidden className={isDark ? 'text-gray-700' : 'text-gray-300'} />
                    )}
                  </div>
                  <div className="p-3">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-black'}`}>
                      {language === 'bn' && r.name_bn ? r.name_bn : r.name_en}
                    </p>
                    <p className="text-sm font-bold text-[#C00000] mt-1">
                      {formatBDT(r.discount ? r.price * (1 - r.discount / 100) : r.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
