import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  X, 
  ChevronDown, 
  Sparkles,
  Zap,
  Leaf,
  Star,
  Clock,
  Car,
  Truck,
  CircleDot,
  Filter,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ImageCarousel } from '../components/ImageCarousel';
import { FloatingParticlesBackground } from '../components/FloatingParticlesBackground';
import { useSeedPradoImages } from '../hooks/useSeedPradoImages';
import { useSeedChrImages } from '../hooks/useSeedChrImages';
import { ALL_VEHICLES } from '../hooks/vehicleDataAll';
import type { Vehicle } from '../types';
import { formatPrice } from '../utils/format';
import { appwritePaymentApi } from '../services/appwritePaymentApi';
// --- Booking Modal Types ---
interface BookingFormData {
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
}

// ============================================
// TYPES
// ============================================

interface FilterState {
  search: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  year: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  quickFilters: string[];
}

interface QuickFilter {
  id: string;
  label: string;
  labelBn: string;
  icon: React.ReactNode;
  filter: (vehicle: Vehicle) => boolean;
}

interface BodyTypeOption {
  id: string;
  label: string;
  labelBn: string;
  icon: React.ReactNode;
}

// ============================================
// CONSTANTS
// ============================================

const QUICK_FILTERS: QuickFilter[] = [
  { 
    id: 'featured', 
    label: 'Featured', 
    labelBn: 'ফিচার্ড',
    icon: <Star className="w-4 h-4" />,
    filter: (v) => v.is_featured 
  },
  { 
    id: 'new', 
    label: 'New Arrivals', 
    labelBn: 'নতুন আগমন',
    icon: <Sparkles className="w-4 h-4" />,
    filter: (v) => v.condition === 'New' 
  },
  { 
    id: 'hybrid', 
    label: 'Hybrid', 
    labelBn: 'হাইব্রিড',
    icon: <Leaf className="w-4 h-4" />,
    filter: (v) => v.fuel_type?.toLowerCase().includes('hybrid') 
  },
  { 
    id: 'lowMileage', 
    label: 'Low Mileage', 
    labelBn: 'কম মাইলেজ',
    icon: <Zap className="w-4 h-4" />,
    filter: (v) => v.mileage < 10000 
  },
  { 
    id: 'recent', 
    label: 'Recently Added', 
    labelBn: 'সম্প্রতি যোগ',
    icon: <Clock className="w-4 h-4" />,
    filter: (v) => {
      const addedDate = new Date(v.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return addedDate > thirtyDaysAgo;
    }
  },
];

const BODY_TYPES: BodyTypeOption[] = [
  { id: 'SUV', label: 'SUV', labelBn: 'এসইউভি', icon: <Truck className="w-5 h-5" /> },
  { id: 'Sedan', label: 'Sedan', labelBn: 'সেডান', icon: <Car className="w-5 h-5" /> },
  { id: 'Crossover', label: 'Crossover', labelBn: 'ক্রসওভার', icon: <Car className="w-5 h-5" /> },
  { id: 'MPV', label: 'MPV', labelBn: 'এমপিভি', icon: <Truck className="w-5 h-5" /> },
  { id: 'Hatchback', label: 'Hatchback', labelBn: 'হ্যাচব্যাক', icon: <Car className="w-5 h-5" /> },
];

const COLOR_OPTIONS = [
  { id: 'white', label: 'White', hex: '#FFFFFF' },
  { id: 'black', label: 'Black', hex: '#1A1A1A' },
  { id: 'silver', label: 'Silver', hex: '#C0C0C0' },
  { id: 'gray', label: 'Gray', hex: '#808080' },
  { id: 'red', label: 'Red', hex: '#DC143C' },
  { id: 'blue', label: 'Blue', hex: '#1E90FF' },
  { id: 'green', label: 'Green', hex: '#228B22' },
  { id: 'brown', label: 'Brown', hex: '#8B4513' },
];

const PRICE_RANGE = { min: 0, max: 15000000 };

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Animated Search Bar Component
 */
const AnimatedSearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
  theme: string;
  language: string;
}> = ({ value, onChange, theme, language }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className={`
        relative w-full max-w-2xl mx-auto
        ${isFocused ? 'scale-105' : 'scale-100'}
        transition-transform duration-300
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={`
        relative flex items-center
        rounded-2xl overflow-hidden
        ${theme === 'dark' 
          ? 'bg-white/10 border border-white/20' 
          : 'bg-white/90 border border-white/50'
        }
        backdrop-blur-xl shadow-2xl
        ${isFocused ? 'ring-2 ring-blue-500' : ''}
      `}>
        <div className="pl-5">
          <Search className={`w-6 h-6 ${theme === 'dark' ? 'text-white/60' : 'text-gray-400'}`} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={language === 'en' 
            ? 'Search by brand, model, or stock number...' 
            : 'ব্র্যান্ড, মডেল বা স্টক নম্বর দিয়ে খুঁজুন...'
          }
          className={`
            w-full py-4 px-4 text-lg
            bg-transparent outline-none
            ${theme === 'dark' ? 'text-white placeholder:text-white/40' : 'text-gray-900 placeholder:text-gray-400'}
          `}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => onChange('')}
              className={`
                mr-4 p-2 rounded-full
                ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}
              `}
            >
              <X className={`w-5 h-5 ${theme === 'dark' ? 'text-white/60' : 'text-gray-400'}`} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * Quick Filter Chips Component
 */
const QuickFilterChips: React.FC<{
  activeFilters: string[];
  onToggle: (filterId: string) => void;
  theme: string;
  language: string;
  vehicleCounts: Record<string, number>;
}> = ({ activeFilters, onToggle, theme, language, vehicleCounts }) => {
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {QUICK_FILTERS.map((filter, index) => {
        const isActive = activeFilters.includes(filter.id);
        const count = vehicleCounts[filter.id] || 0;
        
        return (
          <motion.button
            key={filter.id}
            onClick={() => onToggle(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              font-medium text-sm
              transition-all duration-300
              ${isActive 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : theme === 'dark'
                  ? 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                  : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
              }
              backdrop-blur-sm
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.icon}
            <span>{language === 'en' ? filter.label : filter.labelBn}</span>
            {count > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive 
                  ? 'bg-white/20' 
                  : theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                }
              `}>
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

/**
 * Price Range Slider Component
 */
const PriceRangeSlider: React.FC<{
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  theme: string;
  language: string;
}> = ({ min, max, value, onChange, theme, language }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 100000);
    setLocalValue([newMin, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 100000);
    setLocalValue([localValue[0], newMax]);
  };

  const handleMouseUp = () => {
    onChange(localValue);
  };

  const formatPriceShort = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100;
  const rightPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          ৳{formatPriceShort(localValue[0])}
        </span>
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          ৳{formatPriceShort(localValue[1])}
        </span>
      </div>
      
      <div className="relative h-2">
        {/* Track background */}
        <div className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
        
        {/* Active track */}
        <div 
          className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
          }}
        />

        {/* Range inputs */}
        <input
          type="range"
          min={min}
          max={max}
          step={100000}
          value={localValue[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={100000}
          value={localValue[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Thumb indicators */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-blue-500 z-10 pointer-events-none"
          style={{ left: `calc(${leftPercent}% - 10px)` }}
        />
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-blue-500 z-10 pointer-events-none"
          style={{ left: `calc(${rightPercent}% - 10px)` }}
        />
      </div>

      {/* Quick price buttons */}
      <div className="flex gap-2 flex-wrap">
        {[3000000, 5000000, 7000000, 10000000].map((price) => (
          <button
            key={price}
            onClick={() => onChange([min, price])}
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              transition-all duration-200
              ${localValue[1] === price
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {language === 'en' ? 'Under' : 'নিচে'} ৳{formatPriceShort(price)}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Body Type Visual Selector
 */
const BodyTypeSelector: React.FC<{
  selected: string;
  onChange: (bodyType: string) => void;
  theme: string;
  language: string;
  counts: Record<string, number>;
}> = ({ selected, onChange, theme, language, counts }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {BODY_TYPES.map((bodyType) => {
        const isSelected = selected === bodyType.id;
        const count = counts[bodyType.id] || 0;
        
        return (
          <motion.button
            key={bodyType.id}
            onClick={() => onChange(isSelected ? '' : bodyType.id)}
            className={`
              relative flex flex-col items-center justify-center
              p-3 rounded-xl
              transition-all duration-300
              ${isSelected
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {bodyType.icon}
            <span className="text-xs font-medium mt-1">
              {language === 'en' ? bodyType.label : bodyType.labelBn}
            </span>
            {count > 0 && (
              <span className={`
                absolute -top-1 -right-1 w-5 h-5
                flex items-center justify-center
                rounded-full text-xs font-bold
                ${isSelected ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'}
              `}>
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

/**
 * Color Picker Filter
 */
const ColorPickerFilter: React.FC<{
  selected: string;
  onChange: (color: string) => void;
  theme: string;
}> = ({ selected, onChange, theme }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((color) => {
        const isSelected = selected.toLowerCase() === color.id;
        
        return (
          <motion.button
            key={color.id}
            onClick={() => onChange(isSelected ? '' : color.id)}
            className={`
              relative w-8 h-8 rounded-full
              border-2 transition-all duration-200
              ${isSelected 
                ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-2' 
                : theme === 'dark' 
                  ? 'border-gray-600 hover:border-gray-400' 
                  : 'border-gray-300 hover:border-gray-400'
              }
            `}
            style={{ backgroundColor: color.hex }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title={color.label}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className={`w-3 h-3 rounded-full ${
                  color.id === 'white' || color.id === 'silver' 
                    ? 'bg-gray-800' 
                    : 'bg-white'
                }`} />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

/**
 * Collapsible Filter Section
 */
const CollapsibleSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  theme: string;
  badge?: number;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, theme, badge, children }) => {
  return (
    <div className={`
      border-b last:border-b-0
      ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'}
    `}>
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between py-4
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          hover:opacity-80 transition-opacity
        `}
      >
        <span className="font-medium flex items-center gap-2">
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white">
              {badge}
            </span>
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Active Filter Pills
 */
const ActiveFilterPills: React.FC<{
  filters: FilterState;
  onRemove: (key: keyof FilterState, value?: string) => void;
  onClearAll: () => void;
  theme: string;
  language: string;
}> = ({ filters, onRemove, onClearAll, theme, language }) => {
  const activeFilters: { key: keyof FilterState; label: string; value?: string }[] = [];

  if (filters.brand) activeFilters.push({ key: 'brand', label: filters.brand });
  if (filters.year) activeFilters.push({ key: 'year', label: filters.year });
  if (filters.fuelType) activeFilters.push({ key: 'fuelType', label: filters.fuelType });
  if (filters.transmission) activeFilters.push({ key: 'transmission', label: filters.transmission });
  if (filters.bodyType) activeFilters.push({ key: 'bodyType', label: filters.bodyType });
  if (filters.color) activeFilters.push({ key: 'color', label: filters.color });
  if (filters.minPrice > 0 || filters.maxPrice < PRICE_RANGE.max) {
    activeFilters.push({ 
      key: 'minPrice', 
      label: `৳${(filters.minPrice / 1000000).toFixed(1)}M - ৳${(filters.maxPrice / 1000000).toFixed(1)}M` 
    });
  }
  filters.quickFilters.forEach((qf) => {
    const filter = QUICK_FILTERS.find(f => f.id === qf);
    if (filter) {
      activeFilters.push({ key: 'quickFilters', label: language === 'en' ? filter.label : filter.labelBn, value: qf });
    }
  });

  if (activeFilters.length === 0) return null;

  return (
    <motion.div 
      className="flex flex-wrap items-center gap-2 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {language === 'en' ? 'Active Filters:' : 'সক্রিয় ফিল্টার:'}
      </span>
      {activeFilters.map((filter, index) => (
        <motion.button
          key={`${filter.key}-${filter.value || index}`}
          onClick={() => onRemove(filter.key, filter.value)}
          className={`
            flex items-center gap-1 px-3 py-1 rounded-full text-sm
            ${theme === 'dark' 
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }
            transition-colors
          `}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          {filter.label}
          <X className="w-3 h-3" />
        </motion.button>
      ))}
      <button
        onClick={onClearAll}
        className={`
          flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
          ${theme === 'dark' 
            ? 'text-red-400 hover:bg-red-500/20' 
            : 'text-red-600 hover:bg-red-100'
          }
          transition-colors
        `}
      >
        <RotateCcw className="w-3 h-3" />
        {language === 'en' ? 'Clear All' : 'সব মুছুন'}
      </button>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const InventoryPage = () => {
  // --- Booking Modal State ---
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    customer_name: '',
    mobile: '',
    address: '',
    thana: '',
    district: '',
  });
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  // --- Booking Modal Handlers ---
  const openBookingModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingError(null);
    setShowBookingModal(true);
  };

    // Debug: Log when booking modal opens
    useEffect(() => {
      if (showBookingModal) {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] Booking Modal Opened', { showBookingModal, selectedVehicle });
      }
    }, [showBookingModal, selectedVehicle]);

    // Debug: Log when booking modal opens
    useEffect(() => {
      if (showBookingModal) {
        // eslint-disable-next-line no-console
        console.log('[DEBUG] Booking Modal Opened', { showBookingModal, selectedVehicle });
      }
    }, [showBookingModal, selectedVehicle]);

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setIsSubmittingBooking(false);
    setBookingError(null);
    setBookingForm({
      customer_name: '',
      mobile: '',
      address: '',
      thana: '',
      district: '',
    });
    setSelectedVehicle(null);
  };

  const updateBookingField = (field: keyof BookingFormData, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const confirmAndInitiateBooking = async () => {
    if (!selectedVehicle || isSubmittingBooking) return;
    const requiredFields: Array<keyof BookingFormData> = [
      'customer_name',
      'mobile',
      'address',
      'thana',
      'district',
    ];
    const missing = requiredFields.find((field) => !bookingForm[field]?.trim());
    if (missing) {
      setBookingError('Please complete all booking fields before continuing.');
      return;
    }
    try {
      setIsSubmittingBooking(true);
      setBookingError(null);
      // For booking, use a fixed pre-order amount (e.g., 50000 BDT) or a vehicle-specific amount
  const bookingAmount = 50000;
      const { redirectUrl } = await appwritePaymentApi.initiatePayment({
        customer_name: bookingForm.customer_name.trim(),
        mobile: bookingForm.mobile.trim(),
        address: bookingForm.address.trim(),
        thana: bookingForm.thana.trim(),
        district: bookingForm.district.trim(),
        total_amount: bookingAmount,
        cart_items: JSON.stringify([
          {
            id: selectedVehicle.id,
            name: selectedVehicle.model,
            price: bookingAmount,
            quantity: 1,
          },
        ]),
        cart: [
          {
            id: selectedVehicle.id,
            name: selectedVehicle.model,
            price: bookingAmount,
            quantity: 1,
          },
        ],
      });
      window.location.href = redirectUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start payment. Please try again.';
      setBookingError(message);
      setIsSubmittingBooking(false);
    }
  };
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Scroll for parallax
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, 100]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Filter sections open state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    price: true,
    bodyType: false,
    color: false,
    specs: false,
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: '',
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    year: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    color: '',
    quickFilters: [],
  });

  // Seed vehicle images
  useSeedPradoImages();
  useSeedChrImages();

  // Refs for each rendered vehicle DOM node so we can scroll/focus them
  const vehicleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [openVehicleId, setOpenVehicleId] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);


  // Fetch vehicles
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVehicles(ALL_VEHICLES);
      setFilteredVehicles(ALL_VEHICLES);
      setLoading(false);
    }, 500);
  }, []);

  // Debug: Log when booking modal opens
  useEffect(() => {
    if (showBookingModal) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Booking Modal Opened', { showBookingModal, selectedVehicle });
    }
  }, [showBookingModal, selectedVehicle]);

  // If the URL contains ?open=<id>, open the drawer and scroll the item into view
  useEffect(() => {
    const id = searchParams.get('open');
    if (!id) return;

    // Wait until vehicles are loaded and mounted
    const tryOpen = () => {
      const found = vehicles.find((v) => v.id === id);
      if (!found) return;

      setOpenVehicleId(id);
      setShowDrawer(true);

      // Scroll into view and focus the card
      requestAnimationFrame(() => {
        const el = vehicleRefs.current[id];
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const focusable = el.querySelector('a,button,input,select,textarea');
          if (focusable && (focusable as HTMLElement).focus) {
            (focusable as HTMLElement).focus();
          }
        }
      });
    };

    // If vehicles not yet loaded, wait a tick and try again
    if (vehicles.length === 0) {
      const idTimeout = setTimeout(tryOpen, 250);
      return () => clearTimeout(idTimeout);
    }

    tryOpen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, vehicles]);

  // If URL contains ?model=... or ?color=..., apply filters and focus first matching vehicle
  useEffect(() => {
    const modelQ = searchParams.get('model');
    const colorQ = searchParams.get('color');
    if (!modelQ && !colorQ) return;

  const tryApply = () => {
      // Apply as filters so existing filter logic will run
      setFilters((prev) => ({
        ...prev,
        search: modelQ ? modelQ : prev.search,
        color: colorQ ? colorQ : prev.color,
      }));

      // Find the first matching vehicle after vehicles loaded
      const found = vehicles.find((v) => {
        const modelMatch = modelQ ? v.model.toLowerCase().includes(modelQ.toLowerCase()) : true;
        const colorMatch = colorQ ? (v.color_exterior || '').toLowerCase().includes(colorQ.toLowerCase()) : true;
        return modelMatch && colorMatch;
      });

      if (found) {
        setOpenVehicleId(found.id as string);
        setShowDrawer(true);

        requestAnimationFrame(() => {
          const el = vehicleRefs.current[found.id as string];
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const focusable = el.querySelector('a,button,input,select,textarea');
            if (focusable && (focusable as HTMLElement).focus) {
              (focusable as HTMLElement).focus();
            }
          }
        });
      }
    };

    if (vehicles.length === 0) {
      const t = setTimeout(tryApply, 250);
      return () => clearTimeout(t);
    }

    tryApply();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, vehicles]);

  // Also respond to router location.state.openId (navigate state) for immediate open without relying on URL change
  useEffect(() => {
    const state = (location.state || {}) as any;
    const openId = state?.openId || state?.open || null;
    if (!openId) return;

    const tryOpen = () => {
      const found = vehicles.find((v) => v.id === openId);
      if (!found) return;
      setOpenVehicleId(openId);
      setShowDrawer(true);

      requestAnimationFrame(() => {
        const el = vehicleRefs.current[openId];
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const focusable = el.querySelector('a,button,input,select,textarea');
          if (focusable && (focusable as HTMLElement).focus) (focusable as HTMLElement).focus();
        }
      });
    };

    if (vehicles.length === 0) {
      const t = setTimeout(tryOpen, 250);
      return () => clearTimeout(t);
    }

    tryOpen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, vehicles]);

  // Expose router state for use in the drawer (displayImage, selectedColor)
  const routerState = (location.state || {}) as any;

  // Calculate counts for filters
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    QUICK_FILTERS.forEach((qf) => {
      counts[qf.id] = vehicles.filter(qf.filter).length;
    });
    
    BODY_TYPES.forEach((bt) => {
      counts[bt.id] = vehicles.filter(v => v.body_type?.includes(bt.id)).length;
    });
    
    return counts;
  }, [vehicles]);

// Small inline EMI calculator component (local to this file)
const EMICalculator: React.FC<{ principal: number }> = ({ principal }) => {
  const [rate, setRate] = useState(9.5); // annual %
  const [tenure, setTenure] = useState(60); // months

  const monthlyRate = rate / 100 / 12;
  const n = tenure;
  const P = principal;
  let emi = 0;
  if (P > 0 && monthlyRate > 0 && n > 0) {
    const x = Math.pow(1 + monthlyRate, n);
    emi = (P * monthlyRate * x) / (x - 1);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs">Rate (%)</label>
        <label className="text-xs">Tenure (months)</label>
        <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="p-2 rounded border" />
        <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="p-2 rounded border" />
      </div>
      <div className="text-sm">Estimated EMI: <strong>{emi > 0 ? formatPrice(Math.round(emi), 'en') : '-'}</strong></div>
    </div>
  );
};

  // Apply filters
  useEffect(() => {
    let filtered = [...vehicles];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.brand_name.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower) ||
          v.stock_number.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((v) => v.brand_name === filters.brand);
    }

    if (filters.minPrice > 0 || filters.maxPrice < PRICE_RANGE.max) {
      filtered = filtered.filter(
        (v) => v.price >= filters.minPrice && v.price <= filters.maxPrice
      );
    }

    if (filters.year) {
      filtered = filtered.filter((v) => v.year === parseInt(filters.year));
    }

    if (filters.fuelType) {
      filtered = filtered.filter((v) => v.fuel_type === filters.fuelType);
    }

    if (filters.transmission) {
      filtered = filtered.filter((v) => v.transmission === filters.transmission);
    }

    if (filters.bodyType) {
      filtered = filtered.filter((v) => v.body_type?.includes(filters.bodyType));
    }

    if (filters.color) {
      filtered = filtered.filter((v) => 
        v.color_exterior?.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    if (filters.quickFilters.length > 0) {
      filtered = filtered.filter((v) => {
        return filters.quickFilters.some((qfId) => {
          const qf = QUICK_FILTERS.find((f) => f.id === qfId);
          return qf ? qf.filter(v) : false;
        });
      });
    }

    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  // Derived data
  const brands = useMemo(() => [...new Set(vehicles.map((v) => v.brand_name))].sort(), [vehicles]);
  const years = useMemo(() => [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a), [vehicles]);
  const fuelTypes = useMemo(() => [...new Set(vehicles.map((v) => v.fuel_type))], [vehicles]);
  const transmissions = useMemo(() => [...new Set(vehicles.map((v) => v.transmission))], [vehicles]);

  // Handlers
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleQuickFilter = (filterId: string) => {
    setFilters((prev) => ({
      ...prev,
      quickFilters: prev.quickFilters.includes(filterId)
        ? prev.quickFilters.filter((f) => f !== filterId)
        : [...prev.quickFilters, filterId],
    }));
  };

  const removeFilter = (key: keyof FilterState, value?: string) => {
    setFilters((prev) => {
      if (key === 'quickFilters' && value) {
        return { ...prev, quickFilters: prev.quickFilters.filter((f) => f !== value) };
      }
      if (key === 'minPrice') {
        return { ...prev, minPrice: PRICE_RANGE.min, maxPrice: PRICE_RANGE.max };
      }
      return { ...prev, [key]: '' };
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      year: '',
      fuelType: '',
      transmission: '',
      bodyType: '',
      color: '',
      quickFilters: [],
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-transparent' : 'bg-gray-50'} pt-20`}>
      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={closeBookingModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`fixed inset-0 z-[61] m-auto flex w-[calc(100vw-1rem)] max-w-xl max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl shadow-2xl sm:w-[92vw] sm:max-h-[92vh] ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}
            >

              <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Pre-Order / Booking</h3>
                <button
                  onClick={closeBookingModal}
                  disabled={isSubmittingBooking}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} disabled:opacity-50`}
                  aria-label="Close booking form"
                >
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>×</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-1 sm:gap-y-1.5">
                <div className="sm:col-span-2 space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Full Name</label>
                  <input
                    value={bookingForm.customer_name}
                    onChange={e => updateBookingField('customer_name', e.target.value)}
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Mobile</label>
                  <input
                    value={bookingForm.mobile}
                    onChange={e => updateBookingField('mobile', e.target.value)}
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>District</label>
                  <input
                    value={bookingForm.district}
                    onChange={e => updateBookingField('district', e.target.value)}
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Dhaka"
                  />
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Car Model</label>
                  <input
                    value={selectedVehicle?.model || ''}
                    disabled
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight bg-gray-100 text-gray-500`}
                  />
                  {selectedVehicle == null && (
                    <div className="text-xs text-red-500">[DEBUG] No vehicle selected. Please try again.</div>
                  )}
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Package</label>
                  <input
                    value={selectedVehicle?.package || 'Standard'}
                    disabled
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight bg-gray-100 text-gray-500`}
                  />
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Full Car Price</label>
                  <input
                    value={selectedVehicle?.price ? formatPrice(selectedVehicle.price, language) : ''}
                    disabled
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight bg-gray-100 text-gray-500`}
                  />
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Booking Money</label>
                  <input
                    value={formatPrice(50000, language)}
                    disabled
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight bg-gray-100 text-gray-500`}
                  />
                </div>
                <div className="space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Due Money</label>
                  <input
                    value={selectedVehicle?.price ? formatPrice(selectedVehicle.price - 50000, language) : ''}
                    disabled
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight bg-gray-100 text-gray-500`}
                  />
                </div>
                <div className="sm:col-span-2 space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Thana</label>
                  <input
                    value={bookingForm.thana}
                    onChange={e => updateBookingField('thana', e.target.value)}
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="Mirpur"
                  />
                </div>
                <div className="sm:col-span-2 space-y-0">
                  <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Address</label>
                  <textarea
                    rows={2}
                    value={bookingForm.address}
                    onChange={e => updateBookingField('address', e.target.value)}
                    className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="House, road, area"
                  />
                </div>
                {bookingError && (
                  <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {bookingError}
                  </div>
                )}
              </div>
              <div className={`sticky bottom-0 flex flex-col-reverse gap-3 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-end sm:px-6 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                <button
                  onClick={closeBookingModal}
                  disabled={isSubmittingBooking}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'} disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('[DEBUG] Confirm & Pay clicked', { bookingForm, selectedVehicle });
                    confirmAndInitiateBooking();
                  }}
                  disabled={isSubmittingBooking}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold disabled:opacity-70 inline-flex items-center justify-center gap-2"
                >
                  {isSubmittingBooking ? 'Redirecting...' : 'Confirm & Pay Booking Money'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ========================================== */}
      {/* ENHANCED HEADER SECTION */}
      {/* ========================================== */}
      <motion.div 
        ref={headerRef}
        className="relative overflow-hidden"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        {/* Gradient Background */}
        <div className={`
          absolute inset-0
          ${isDark 
            ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900' 
            : 'bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900'
          }
        `} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingParticlesBackground 
            theme={theme} 
            particleCount={15} 
            intensity="subtle" 
          />
        </div>

        {/* Animated Car Silhouettes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -left-20 bottom-0 opacity-10"
            animate={{ x: [0, 50, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Car className="w-64 h-64 text-white" />
          </motion.div>
          <motion.div
            className="absolute -right-10 bottom-10 opacity-10"
            animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <Truck className="w-48 h-48 text-white" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 py-16 px-4">
          <div className="container mx-auto text-center">
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('nav.inventory')}
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {language === 'en' 
                ? `Explore ${filteredVehicles.length} premium vehicles` 
                : `${filteredVehicles.length} টি প্রিমিয়াম গাড়ি অন্বেষণ করুন`
              }
            </motion.p>

            <AnimatedSearchBar
              value={filters.search}
              onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
              theme={theme}
              language={language}
            />

            <QuickFilterChips
              activeFilters={filters.quickFilters}
              onToggle={toggleQuickFilter}
              theme={theme}
              language={language}
              vehicleCounts={filterCounts}
            />
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className={`w-full ${isDark ? 'text-gray-900' : 'text-gray-50'}`}>
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="currentColor"/>
          </svg>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================== */}
      <div className="container mx-auto px-4 py-8">
        <ActiveFilterPills
          filters={filters}
          onRemove={removeFilter}
          onClearAll={resetFilters}
          theme={theme}
          language={language}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========================================== */}
          {/* GLASSMORPHISM FILTER PANEL */}
          {/* ========================================== */}
          <motion.div 
            className="lg:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`
                lg:hidden w-full flex items-center justify-center gap-2 mb-4
                py-3 rounded-xl font-medium
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'}
              `}
            >
              <Filter className="w-5 h-5" />
              {language === 'en' ? 'Filters' : 'ফিল্টার'}
              <ChevronDown className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className={`
              ${showMobileFilters ? 'block' : 'hidden lg:block'}
              ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/70 border-white/50'}
              backdrop-blur-xl rounded-2xl shadow-xl border p-6 sticky top-24
            `}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'en' ? 'Filters' : 'ফিল্টার'}
                </h2>
                <button
                  onClick={resetFilters}
                  className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <RotateCcw className="w-4 h-4" />
                  {language === 'en' ? 'Reset' : 'রিসেট'}
                </button>
              </div>

              <CollapsibleSection
                title={t('filter.brand')}
                isOpen={openSections.brand}
                onToggle={() => toggleSection('brand')}
                theme={theme}
              >
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className={`
                    w-full px-4 py-3 rounded-xl
                    ${isDark ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'}
                    border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  `}
                >
                  <option value="">{language === 'en' ? 'All Brands' : 'সব ব্র্যান্ড'}</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </CollapsibleSection>

              <CollapsibleSection
                title={t('filter.price')}
                isOpen={openSections.price}
                onToggle={() => toggleSection('price')}
                theme={theme}
              >
                <PriceRangeSlider
                  min={PRICE_RANGE.min}
                  max={PRICE_RANGE.max}
                  value={[filters.minPrice, filters.maxPrice]}
                  onChange={(value) => setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] })}
                  theme={theme}
                  language={language}
                />
              </CollapsibleSection>

              <CollapsibleSection
                title={language === 'en' ? 'Body Type' : 'বডি টাইপ'}
                isOpen={openSections.bodyType}
                onToggle={() => toggleSection('bodyType')}
                theme={theme}
              >
                <BodyTypeSelector
                  selected={filters.bodyType}
                  onChange={(bodyType) => setFilters({ ...filters, bodyType })}
                  theme={theme}
                  language={language}
                  counts={filterCounts}
                />
              </CollapsibleSection>

              <CollapsibleSection
                title={language === 'en' ? 'Exterior Color' : 'বাহ্যিক রং'}
                isOpen={openSections.color}
                onToggle={() => toggleSection('color')}
                theme={theme}
              >
                <ColorPickerFilter
                  selected={filters.color}
                  onChange={(color) => setFilters({ ...filters, color })}
                  theme={theme}
                />
              </CollapsibleSection>

              <CollapsibleSection
                title={language === 'en' ? 'Specifications' : 'স্পেসিফিকেশন'}
                isOpen={openSections.specs}
                onToggle={() => toggleSection('specs')}
                theme={theme}
              >
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t('filter.year')}
                    </label>
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                      className={`
                        w-full px-4 py-2 rounded-lg
                        ${isDark ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'}
                        border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      `}
                    >
                      <option value="">{language === 'en' ? 'All Years' : 'সব বছর'}</option>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t('filter.fuel')}
                    </label>
                    <select
                      value={filters.fuelType}
                      onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                      className={`
                        w-full px-4 py-2 rounded-lg
                        ${isDark ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'}
                        border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      `}
                    >
                      <option value="">{language === 'en' ? 'All Types' : 'সব ধরন'}</option>
                      {fuelTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t('filter.transmission')}
                    </label>
                    <select
                      value={filters.transmission}
                      onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                      className={`
                        w-full px-4 py-2 rounded-lg
                        ${isDark ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'}
                        border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      `}
                    >
                      <option value="">{language === 'en' ? 'All Types' : 'সব ধরন'}</option>
                      {transmissions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </motion.div>

          {/* ========================================== */}
          {/* VEHICLE GRID */}
          {/* ========================================== */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? `Showing ${filteredVehicles.length} results` 
                  : `${filteredVehicles.length} টি ফলাফল দেখানো হচ্ছে`
                }
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('common.loading')}</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Search className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'en' ? 'No vehicles found' : 'কোনো গাড়ি পাওয়া যায়নি'}
                </p>
                <p className={`mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {language === 'en' ? 'Try adjusting your filters' : 'ফিল্টার পরিবর্তন করে দেখুন'}
                </p>
                <Button onClick={resetFilters} className="mt-4">
                  {language === 'en' ? 'Clear Filters' : 'ফিল্টার মুছুন'}
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filteredVehicles.map((vehicle, index) => {
                    const carouselImages = (vehicle.images && vehicle.images.length > 0)
                      ? vehicle.images.map((img: any) => ({
                          url: img.image_url || img.url || 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800',
                          alt: `${vehicle.brand_name} ${vehicle.model}`
                        }))
                      : [{
                          url: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800',
                          alt: `${vehicle.brand_name} ${vehicle.model}`
                        }];

                    return (
                      <motion.div
                        key={vehicle.id}
                        // register DOM node so we can scrollTo / focus later when ?open=<id>
                        ref={(el: HTMLDivElement | null) => { vehicleRefs.current[vehicle.id] = el; }}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card hover className={`overflow-hidden ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} ${viewMode === 'list' ? 'flex' : ''}`}>
                          <Link to={`/vehicle/${vehicle.id}`} className={viewMode === 'list' ? 'flex w-full' : 'w-full'}>
                            <div className={viewMode === 'list' ? 'w-1/3' : 'w-full'}>
                              <div className="relative">
                                <ImageCarousel
                                  images={carouselImages}
                                  autoPlay={true}
                                  autoPlayInterval={4000}
                                  showIndicators={true}
                                  showArrows={carouselImages.length > 1}
                                  height={viewMode === 'list' ? 'h-48' : 'h-64'}
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
                                  {vehicle.is_featured && (
                                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {language === 'en' ? 'Featured' : 'ফিচার্ড'}
                                    </span>
                                  )}
                                  {vehicle.condition === 'New' && (
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                      {language === 'en' ? 'New' : 'নতুন'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                              <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {t('vehicle.stock')}: {vehicle.stock_number}
                              </div>
                              <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} ${viewMode === 'list' ? 'text-lg' : 'text-xl'}`}>
                                {vehicle.brand_name} {vehicle.model} <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>({vehicle.year}/{vehicle.year + 1})</span>
                              </h3>
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <span className="text-2xl font-bold text-blue-500">
                                    {vehicle.price && vehicle.price > 0 ? formatPrice(vehicle.price, language) : (language === 'en' ? 'Price on request' : 'মূল্য অনুরোধে')}
                                  </span>
                                  <div className="mt-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded text-xs font-semibold text-amber-800 dark:text-amber-300 inline-block">
                                    {language === 'en' ? 'Only Pre Order Price is Shown!' : 'শুধুমাত্র প্রি-অর্ডার মূল্য দেখানো হচ্ছে!'}
                                  </div>
                                </div>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {vehicle.mileage.toLocaleString()} km
                                </span>
                              </div>
                              <div className={`grid grid-cols-2 gap-2 text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <div className="flex items-center gap-1">
                                  <Leaf className="w-4 h-4 text-green-500" />
                                  {vehicle.fuel_type}
                                </div>
                                <div>{vehicle.transmission}</div>
                                {vehicle.engine_capacity && <div>{vehicle.engine_capacity}</div>}
                                {vehicle.color_exterior && (
                                  <div className="flex items-center gap-1">
                                    <CircleDot className="w-4 h-4" />
                                    {vehicle.color_exterior}
                                  </div>
                                )}
                              </div>
                              <Button className="w-full mb-2" onClick={() => openBookingModal(vehicle)}>
                                {`Reserve Now (৳${formatPrice(50000, language)})`}
                              </Button>
                              <Link to={`/vehicle/${vehicle.id}`} className="w-full block">
                                <Button className="w-full">{t('vehicle.view_details')}</Button>
                              </Link>
                            </div>
                          </Link>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {/* Drawer / detail panel when ?open=<id> is present */}
      <AnimatePresence>
        {showDrawer && openVehicleId && (
          (() => {
            const vehicle = vehicles.find(v => v.id === openVehicleId);
            if (!vehicle) return null;
            return (
              <motion.aside
                key={`drawer-${openVehicleId}`}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.28 }}
                className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 shadow-2xl p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{vehicle.brand_name} {vehicle.model} <span className="text-sm text-gray-500">({vehicle.year}/{vehicle.year + 1})</span></h3>
                    <div className="text-sm text-gray-400">{vehicle.stock_number}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button onClick={() => {
                      // close and remove query param
                      setShowDrawer(false);
                      setOpenVehicleId(null);
                      const params = new URLSearchParams(searchParams as any);
                      params.delete('open');
                      const search = params.toString();
                      const path = search ? `/inventory?${search}` : '/inventory';
                      navigate(path, { replace: true });
                    }} className="rounded-full p-2">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-4 overflow-auto h-[calc(100vh-120px)]">
                  {/* Image / small carousel */}
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          {/* Prefer displayImage from router state when present (user clicked a color on landing) */}
                          {routerState?.displayImage && routerState.openId === vehicle.id ? (
                            <img src={encodeURI(routerState.displayImage)} alt={`${vehicle.brand_name} ${vehicle.model}`} className="w-full h-full object-contain" />
                          ) : vehicle.images && vehicle.images.length > 0 ? (
                            <img src={encodeURI((vehicle.images[0] as any).image_url || (vehicle.images[0] as any).url)} alt={`${vehicle.brand_name} ${vehicle.model}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                          )}
                        </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{vehicle.price && vehicle.price > 0 ? formatPrice(vehicle.price, language) : (language === 'en' ? 'Price on request' : 'মূল্য অনুরোধে')}</div>
                      <div className="mt-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded text-xs font-semibold text-amber-800 dark:text-amber-300 inline-block">
                        {language === 'en' ? 'Only Pre Order Price is Shown!' : 'শুধুমাত্র প্রি-অর্ডার মূল্য দেখানো হচ্ছে!'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{vehicle.year}/{vehicle.year + 1} Model • {vehicle.mileage.toLocaleString()} km</div>
                    <div className="text-sm">Fuel: {vehicle.fuel_type} • Transmission: {vehicle.transmission}</div>
                    {vehicle.color_exterior && (
                      <div className="text-sm">Color: {vehicle.color_exterior}</div>
                    )}
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button onClick={() => openBookingModal(vehicle)} className="w-full">Reserve Now (৳50,000)</Button>
                    <Button onClick={() => navigate('/contact')} className="w-full">Contact Us</Button>
                    <a
                      href={`https://wa.me/8801760401605?text=${encodeURIComponent(`I'm interested in ${vehicle.brand_name} ${vehicle.model} (Stock #: ${vehicle.stock_number})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full">WhatsApp</Button>
                    </a>
                  </div>

                  {/* EMI Calculator */}
                  <div className="pt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2">Calculate EMI</h4>
                    <EMICalculator principal={vehicle.price || 0} />
                  </div>

                  {/* Description */}
                  {vehicle.description_en && (
                    <div className="pt-4">
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{vehicle.description_en}</p>
                    </div>
                  )}

                  {/* Specifications */}
                  <div className="pt-4">
                    <h4 className="font-semibold mb-2">Specifications</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <div>Engine: {vehicle.engine_capacity}</div>
                      <div>Condition: {vehicle.condition}</div>
                      <div>Body Type: {vehicle.body_type}</div>
                      <div>Interior: {vehicle.color_interior}</div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            );
          })()
        )}
      </AnimatePresence>
    </div>
  );
};
