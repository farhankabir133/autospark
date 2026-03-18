import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Wrench,
  SprayCan,
  Shield,
  Car,
  Battery,
  Cog,
  Timer,
  Calendar,
  CheckCircle,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  X,
  Sparkles,
  Award,
  Users,
  Droplet,
  Paintbrush,
  Settings,
  Wind,
  CircleDot,
  type LucideIcon
} from 'lucide-react';

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  basePrice: number;
  duration: string;
  category: 'maintenance' | 'detailing' | 'repair' | 'specialty';
  popular?: boolean;
  features: string[];
}

interface ServicePackage {
  id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  price: number;
  services: string[];
  features: string[];
  recommended?: boolean;
}

interface Technician {
  id: string;
  name: string;
  role: string;
  image: string;
  certifications: string[];
  experience: number;
  rating: number;
  reviews: number;
  specialties: string[];
}

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
  verified: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Service Data - Updated Price List
const services: Service[] = [
  // ===== MAINTENANCE SERVICES =====
  {
    id: 'brake-oil-change',
    name: 'Brake Oil Change',
    description: 'Complete brake fluid replacement for optimal braking performance and safety.',
    icon: Droplet,
    basePrice: 1500,
    duration: '30-45 min',
    category: 'maintenance',
    popular: true,
    features: ['DOT 4 brake fluid', 'System bleeding', 'Pressure test', 'Safety inspection']
  },
  {
    id: 'master-service',
    name: 'Master Service',
    description: 'Comprehensive vehicle maintenance including oil change, filter replacement, and full inspection.',
    icon: Settings,
    basePrice: 4000,
    duration: '2-3 hours',
    category: 'maintenance',
    popular: true,
    features: ['Engine oil change', 'All filters replaced', 'Fluid top-up', 'Multi-point inspection']
  },
  {
    id: 'super-master-service',
    name: 'Super Master Service',
    description: 'Premium complete service package with advanced diagnostics and premium fluids.',
    icon: Award,
    basePrice: 5500,
    duration: '3-4 hours',
    category: 'maintenance',
    popular: true,
    features: ['All Master features', 'Premium synthetic oil', 'Complete diagnostics', 'Interior cleaning']
  },
  {
    id: 'battery-service',
    name: 'Battery Service',
    description: 'Complete battery testing, terminal cleaning, and electrical system check.',
    icon: Battery,
    basePrice: 4500,
    duration: '1-2 hours',
    category: 'maintenance',
    features: ['Battery load test', 'Terminal cleaning', 'Charging system check', 'Replacement if needed']
  },
  {
    id: 'brake-service',
    name: 'Brake Service',
    description: 'Professional brake inspection, pad check, and adjustment for safe stopping.',
    icon: CircleDot,
    basePrice: 600,
    duration: '45 min',
    category: 'maintenance',
    features: ['Brake pad inspection', 'Rotor check', 'Adjustment', 'Performance test']
  },
  {
    id: 'wash',
    name: 'Car Wash',
    description: 'Professional exterior wash with quality cleaning products.',
    icon: SprayCan,
    basePrice: 500,
    duration: '30 min',
    category: 'detailing',
    features: ['Exterior wash', 'Wheel cleaning', 'Window cleaning', 'Quick dry']
  },
  {
    id: 'ac-service',
    name: 'A/C Service',
    description: 'Complete air conditioning system service and refrigerant recharge.',
    icon: Wind,
    basePrice: 2000,
    duration: '1-2 hours',
    category: 'maintenance',
    popular: true,
    features: ['System diagnostic', 'Gas recharge', 'Leak detection', 'Filter cleaning']
  },
  // ===== REPAIR SERVICES =====
  {
    id: 'engine-overhauling',
    name: 'Engine Overhauling',
    description: 'Complete engine rebuild and restoration for optimal performance.',
    icon: Cog,
    basePrice: 8500,
    duration: '3-5 days',
    category: 'repair',
    popular: true,
    features: ['Complete teardown', 'Parts replacement', 'Precision assembly', 'Performance testing']
  },
  {
    id: 'gearbox-openfitting',
    name: 'Gear Box Open/Fitting',
    description: 'Professional gearbox inspection, repair, and reassembly service.',
    icon: Settings,
    basePrice: 5500,
    duration: '1-2 days',
    category: 'repair',
    features: ['Gearbox removal', 'Internal inspection', 'Parts replacement', 'Precision refitting']
  },
  {
    id: 'engine-mounting',
    name: 'Engine Mounting',
    description: 'Replace worn engine mounts to reduce vibration and improve comfort.',
    icon: Wrench,
    basePrice: 2000,
    duration: '2-3 hours',
    category: 'repair',
    features: ['Mount inspection', 'Quality parts', 'Vibration test', 'Alignment check']
  },
  {
    id: 'brake-booster',
    name: 'Brake Booster Replace',
    description: 'Complete brake booster replacement for enhanced braking assistance.',
    icon: Shield,
    basePrice: 8000,
    duration: '2-3 hours',
    category: 'repair',
    features: ['Booster replacement', 'Vacuum test', 'System bleeding', 'Performance test']
  },
  {
    id: 'suspension-front',
    name: 'Suspension (Front)',
    description: 'Front suspension repair including shocks, struts, and bushings.',
    icon: Car,
    basePrice: 4500,
    duration: '3-4 hours',
    category: 'repair',
    features: ['Shock replacement', 'Strut service', 'Bushing check', 'Alignment included']
  },
  {
    id: 'suspension-full',
    name: 'Suspension (Front & Rear)',
    description: 'Complete suspension overhaul for all four corners of your vehicle.',
    icon: Car,
    basePrice: 6000,
    duration: '5-6 hours',
    category: 'repair',
    popular: true,
    features: ['Full suspension work', 'All corners serviced', 'Premium parts', 'Wheel alignment']
  },
  // ===== DETAILING & PAINT SERVICES =====
  {
    id: 'full-polish-normal',
    name: 'Full Car Polish (Normal)',
    description: 'Complete car polishing to restore shine and remove minor scratches.',
    icon: Sparkles,
    basePrice: 4000,
    duration: '4-5 hours',
    category: 'detailing',
    features: ['Machine polish', 'Scratch removal', 'Wax coating', 'UV protection']
  },
  {
    id: 'full-polish-premium',
    name: 'Full Car Polish (High Quality)',
    description: 'Premium multi-stage polishing with ceramic protection for showroom finish.',
    icon: Sparkles,
    basePrice: 6000,
    duration: '6-8 hours',
    category: 'detailing',
    popular: true,
    features: ['Multi-stage polish', 'Paint correction', 'Ceramic sealant', 'Long-lasting shine']
  },
  {
    id: 'paint-white-silver',
    name: '1 Part Color (White & Silver)',
    description: 'Professional single panel paint for white or silver color.',
    icon: Paintbrush,
    basePrice: 5000,
    duration: '1-2 days',
    category: 'specialty',
    features: ['Color matching', 'Premium paint', 'Clear coat', 'Buffing finish']
  },
  {
    id: 'paint-other-color',
    name: '1 Part Color (Any Other Color)',
    description: 'Professional single panel paint for any color including metallic.',
    icon: Paintbrush,
    basePrice: 7000,
    duration: '1-2 days',
    category: 'specialty',
    features: ['Perfect color match', 'Metallic options', 'Premium finish', 'Quality guarantee']
  },
  {
    id: 'full-body-white-silver',
    name: 'Full Body Color (White/Silver)',
    description: 'Complete full body repaint in white or silver without denting work.',
    icon: Paintbrush,
    basePrice: 60000,
    duration: '5-7 days',
    category: 'specialty',
    popular: true,
    features: ['Full body prep', 'Premium paint', 'Multiple clear coats', 'Professional finish']
  },
  {
    id: 'full-body-other',
    name: 'Full Body Color (Any Other Color)',
    description: 'Complete full body repaint in any color without denting work.',
    icon: Paintbrush,
    basePrice: 80000,
    duration: '7-10 days',
    category: 'specialty',
    features: ['Color customization', 'Metallic & pearl', 'Show quality finish', 'Full warranty']
  }
];

// Service Packages - Updated with new pricing
const servicePackages: ServicePackage[] = [
  {
    id: 'basic',
    name: 'Essential Care',
    tier: 'basic',
    price: 5500,
    services: ['brake-oil-change', 'wash', 'brake-service'],
    features: ['Brake oil change', 'Car wash', 'Brake inspection', 'Basic inspection', 'Fluid check']
  },
  {
    id: 'standard',
    name: 'Complete Care',
    tier: 'standard',
    price: 12000,
    services: ['master-service', 'ac-service', 'full-polish-normal'],
    features: ['Master service', 'A/C service', 'Full car polish', 'All fluid changes', 'Priority scheduling'],
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium Care',
    tier: 'premium',
    price: 22000,
    services: ['super-master-service', 'ac-service', 'full-polish-premium', 'battery-service', 'suspension-front'],
    features: ['Super Master service', 'Premium polish', 'A/C service', 'Battery service', 'Front suspension', 'Free pickup/drop', 'VIP lounge']
  }
];

// Technicians Data
const technicians: Technician[] = [
  {
    id: '1',
    name: 'Mohammed Al-Hassan',
    role: 'Master Technician',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    certifications: ['ASE Master', 'Toyota Certified', 'Mercedes-Benz Specialist'],
    experience: 15,
    rating: 4.9,
    reviews: 234,
    specialties: ['Engine', 'Transmission', 'Diagnostics']
  },
  {
    id: '2',
    name: 'Ahmed Khalil',
    role: 'Detailing Specialist',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    certifications: ['IDA Certified', 'Ceramic Pro Installer', 'PPF Expert'],
    experience: 8,
    rating: 4.8,
    reviews: 189,
    specialties: ['Ceramic Coating', 'PPF', 'Paint Correction']
  },
  {
    id: '3',
    name: 'Omar Rashid',
    role: 'Electrical Specialist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    certifications: ['ASE A6', 'Hybrid/EV Certified', 'BMW Specialist'],
    experience: 12,
    rating: 4.7,
    reviews: 156,
    specialties: ['Electrical', 'AC Systems', 'Hybrid/EV']
  }
];

// Reviews Data
const reviews: Review[] = [
  {
    id: '1',
    name: 'Khalid A.',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent ceramic coating service! My car looks brand new. The team was professional and the finish is flawless.',
    service: 'Ceramic Coating',
    verified: true
  },
  {
    id: '2',
    name: 'Sarah M.',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 5,
    date: '1 week ago',
    comment: 'Best oil change experience ever. Quick, efficient, and they even topped off all my fluids for free!',
    service: 'Oil Change',
    verified: true
  },
  {
    id: '3',
    name: 'Abdullah K.',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Great brake service. They explained everything clearly and the pricing was fair. Will definitely return.',
    service: 'Brake Service',
    verified: true
  }
];

// FAQ Data
const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How long does a full car detailing take?',
    answer: 'A full detailing typically takes 4-6 hours depending on the vehicle size and condition. Premium detailing with paint correction may take 1-2 days.',
    category: 'detailing'
  },
  {
    id: '2',
    question: 'Do you offer pickup and drop-off service?',
    answer: 'Yes! We offer complimentary pickup and drop-off within 20km radius for all services over 500 BDT. Premium package customers get unlimited free pickup.',
    category: 'general'
  },
  {
    id: '3',
    question: 'What warranty do you provide on repairs?',
    answer: 'All our repairs come with a minimum 12-month or 20,000 km warranty. Ceramic coatings have a 5-year warranty and PPF has a 10-year warranty.',
    category: 'warranty'
  },
  {
    id: '4',
    question: 'Can I wait while my car is being serviced?',
    answer: 'Absolutely! We have a comfortable waiting lounge with free WiFi, refreshments, and a TV. Premium customers have access to our VIP lounge with workstations.',
    category: 'general'
  },
  {
    id: '5',
    question: 'How often should I change my oil?',
    answer: 'For synthetic oil, we recommend every 10,000-15,000 km or 12 months, whichever comes first. For conventional oil, every 5,000-7,000 km or 6 months.',
    category: 'maintenance'
  },
  {
    id: '6',
    question: 'Do you service all car brands?',
    answer: 'Yes, we service all makes and models including luxury brands like Mercedes, BMW, Porsche, and exotic cars. Our technicians are certified for multiple brands.',
    category: 'general'
  }
];

// Helper function to generate time slots
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const hours = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18];
  hours.forEach(hour => {
    const isWeekend = date.getDay() === 5 || date.getDay() === 6;
    const isLunchTime = hour === 12;
    slots.push({
      time: `${hour}:00`,
      available: !isLunchTime && !(isWeekend && hour > 16)
    });
    slots.push({
      time: `${hour}:30`,
      available: !isLunchTime && !(isWeekend && hour > 16) && Math.random() > 0.3
    });
  });
  return slots;
};

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

// Main ServicesPage Component
const ServicesPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', carModel: '', notes: '' });
  const [serviceStatusId, setServiceStatusId] = useState('');
  const [serviceStatus, setServiceStatus] = useState<{ step: number; status: string } | null>(null);

  // Categories
  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'detailing', name: 'Detailing' },
    { id: 'repair', name: 'Repair' },
    { id: 'specialty', name: 'Specialty' }
  ];

  // Filter services
  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    if (!faqSearch) return faqs;
    const search = faqSearch.toLowerCase();
    return faqs.filter(f => 
      f.question.toLowerCase().includes(search) || 
      f.answer.toLowerCase().includes(search)
    );
  }, [faqSearch]);

  // Calculate total
  const totalPrice = useMemo(() => {
    if (selectedPackage) {
      const pkg = servicePackages.find(p => p.id === selectedPackage);
      return pkg?.price || 0;
    }
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);
  }, [selectedServices, selectedPackage]);

  // Time slots
  const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate]);

  // Generate dates for calendar
  const calendarDates = useMemo(() => {
    const dates: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedPackage(null);
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Select package
  const selectPackage = (packageId: string) => {
    setSelectedServices([]);
    setSelectedPackage(prev => prev === packageId ? null : packageId);
  };

  // Check service status
  const checkServiceStatus = () => {
    if (serviceStatusId) {
      setServiceStatus({
        step: Math.floor(Math.random() * 4) + 1,
        status: ['Received', 'In Progress', 'Quality Check', 'Ready'][Math.floor(Math.random() * 4)]
      });
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Service workshop components for premium hero
  const workshopElements = [
    { id: 'lift', label: 'Hydraulic Lift', x: 8, y: 25 },
    { id: 'diagnostic', label: 'OBD Scanner', x: 85, y: 20 },
    { id: 'tools', label: 'Pro Tools', x: 12, y: 65 },
    { id: 'engine', label: 'Engine Bay', x: 78, y: 60 },
    { id: 'tires', label: 'Tire Service', x: 50, y: 75 },
  ];

  return (
    <div className={`min-h-screen pt-16 sm:pt-20 ${isDark ? 'bg-transparent' : 'bg-gray-50'}`}>
      {/* Hero Section - Ultra Premium Workshop Scene */}
      <section className={`relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950' 
          : 'bg-gradient-to-br from-slate-100 via-blue-50 to-white'
      }`}>
        
        {/* Workshop Grid Floor Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: isDark 
                ? 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)'
                : 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Ambient Light Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className={`absolute w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/15'}`}
            style={{ top: '10%', left: '20%' }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-purple-600/15' : 'bg-purple-400/10'}`}
            style={{ bottom: '20%', right: '15%' }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className={`absolute w-64 h-64 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/15' : 'bg-cyan-400/10'}`}
            style={{ top: '40%', right: '30%' }}
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        {/* 3D Car on Hydraulic Lift - LEFT SIDE */}
        <motion.div
          className="absolute hidden lg:block"
          style={{ left: '5%', top: '15%', width: '280px', height: '350px' }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
        >
          {/* Lift Base */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ width: '200px', height: '25px' }}
          >
            <div className={`w-full h-full rounded-lg ${
              isDark 
                ? 'bg-gradient-to-t from-gray-700 to-gray-600' 
                : 'bg-gradient-to-t from-gray-400 to-gray-300'
            }`} style={{ boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.2)' }} />
          </motion.div>
          
          {/* Lift Arms - Animated */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            style={{ width: '180px' }}
            animate={{ height: ['80px', '120px', '80px'] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Left Arm */}
            <div className={`absolute left-0 w-5 h-full rounded ${
              isDark ? 'bg-gradient-to-t from-yellow-600 to-yellow-500' : 'bg-gradient-to-t from-yellow-500 to-yellow-400'
            }`} />
            {/* Right Arm */}
            <div className={`absolute right-0 w-5 h-full rounded ${
              isDark ? 'bg-gradient-to-t from-yellow-600 to-yellow-500' : 'bg-gradient-to-t from-yellow-500 to-yellow-400'
            }`} />
            {/* Cross Bars */}
            <motion.div 
              className={`absolute left-0 right-0 h-3 rounded ${
                isDark ? 'bg-yellow-700' : 'bg-yellow-600'
              }`}
              style={{ top: '30%' }}
            />
            <motion.div 
              className={`absolute left-0 right-0 h-3 rounded ${
                isDark ? 'bg-yellow-700' : 'bg-yellow-600'
              }`}
              style={{ top: '70%' }}
            />
          </motion.div>

          {/* Car Platform */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ width: '220px', bottom: '100px' }}
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Platform */}
            <div className={`h-4 rounded-lg ${
              isDark 
                ? 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600' 
                : 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300'
            }`} style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
            
            {/* Car Body on Platform */}
            <div className="relative -mt-1">
              {/* Car Shadow */}
              <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 rounded-full blur-md ${
                isDark ? 'bg-black/40' : 'bg-black/20'
              }`} />
              
              {/* Car Underbody - Showing mechanical parts */}
              <div className={`relative mx-auto rounded-b-lg ${
                isDark ? 'bg-gradient-to-b from-gray-800 to-gray-700' : 'bg-gradient-to-b from-gray-200 to-gray-300'
              }`} style={{ width: '180px', height: '50px' }}>
                {/* Exhaust System */}
                <div className={`absolute bottom-2 left-8 w-20 h-3 rounded-full ${
                  isDark ? 'bg-gradient-to-r from-gray-600 to-gray-500' : 'bg-gradient-to-r from-gray-400 to-gray-300'
                }`} />
                {/* Axle */}
                <motion.div 
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-2 rounded-full ${
                    isDark ? 'bg-gray-500' : 'bg-gray-400'
                  }`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                {/* Wheels (side view) */}
                <motion.div
                  className={`absolute -bottom-3 left-4 w-8 h-8 rounded-full border-4 ${
                    isDark ? 'bg-gray-900 border-gray-600' : 'bg-gray-800 border-gray-500'
                  }`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className={`absolute inset-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-600'}`} />
                </motion.div>
                <motion.div
                  className={`absolute -bottom-3 right-4 w-8 h-8 rounded-full border-4 ${
                    isDark ? 'bg-gray-900 border-gray-600' : 'bg-gray-800 border-gray-500'
                  }`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className={`absolute inset-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-600'}`} />
                </motion.div>
              </div>
              
              {/* Car Body Top */}
              <div className={`mx-auto rounded-t-2xl ${
                isDark ? 'bg-gradient-to-b from-blue-600 to-blue-700' : 'bg-gradient-to-b from-blue-500 to-blue-600'
              }`} style={{ width: '160px', height: '35px', marginTop: '-2px' }}>
                {/* Windows */}
                <div className={`mx-auto mt-1 rounded-t-lg ${
                  isDark ? 'bg-gray-900/70' : 'bg-gray-800/60'
                }`} style={{ width: '120px', height: '20px' }} />
              </div>
            </div>
          </motion.div>
          
          {/* Label */}
          <motion.div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            HYDRAULIC LIFT
          </motion.div>
        </motion.div>

        {/* Diagnostic Scanner Station - RIGHT SIDE */}
        <motion.div
          className="absolute hidden lg:block"
          style={{ right: '8%', top: '12%', width: '180px', height: '280px' }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
          {/* Monitor Stand */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-20 rounded-b-lg ${
            isDark ? 'bg-gradient-to-b from-gray-700 to-gray-800' : 'bg-gradient-to-b from-gray-400 to-gray-500'
          }`} />
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-3 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-400'
          }`} />
          
          {/* Monitor Frame */}
          <motion.div
            className={`absolute bottom-24 left-1/2 -translate-x-1/2 rounded-xl overflow-hidden ${
              isDark ? 'bg-gray-800' : 'bg-gray-300'
            }`}
            style={{ width: '160px', height: '120px', boxShadow: isDark ? '0 0 30px rgba(59, 130, 246, 0.3)' : '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            {/* Screen */}
            <div className={`m-2 rounded-lg h-[calc(100%-16px)] ${
              isDark ? 'bg-gray-950' : 'bg-gray-900'
            }`}>
              {/* Diagnostic Interface */}
              <div className="p-2 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] text-green-400 font-mono">SYSTEM OK</span>
                </div>
                
                {/* Scan Lines */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.3 }}
                  >
                    <div className={`h-1.5 rounded-full ${
                      i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-yellow-500' : i === 3 ? 'bg-cyan-500' : 'bg-purple-500'
                    }`} style={{ width: `${30 + Math.random() * 50}%` }} />
                  </motion.div>
                ))}
                
                {/* Scrolling Data */}
                <motion.div 
                  className="mt-auto text-[6px] text-cyan-400 font-mono overflow-hidden"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div>ENGINE: 98.7% ✓</div>
                  <div>TRANS: 99.1% ✓</div>
                  <div>BRAKE: 97.3% ✓</div>
                  <div>ELEC: 99.9% ✓</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Scanning Beam Effect */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500 to-transparent"
            style={{ bottom: '144px', height: '80px' }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Label */}
          <motion.div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'
            }`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            OBD DIAGNOSTIC
          </motion.div>
        </motion.div>

        {/* Spinning Mechanical Gears - BOTTOM LEFT */}
        <motion.div
          className="absolute hidden lg:block"
          style={{ left: '3%', bottom: '15%', width: '200px', height: '200px' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
        >
          {/* Large Gear */}
          <motion.div
            className="absolute"
            style={{ width: '120px', height: '120px', top: '20px', left: '20px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="gearGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? '#4B5563' : '#9CA3AF'} />
                  <stop offset="100%" stopColor={isDark ? '#374151' : '#6B7280'} />
                </linearGradient>
              </defs>
              <path
                d="M50 10 L54 10 L56 5 L58 10 L62 10 L60 15 L65 18 L70 15 L73 18 L70 22 L75 28 L80 25 L82 30 L77 33 L80 40 L85 40 L85 45 L80 48 L82 55 L88 55 L86 62 L80 62 L78 68 L83 73 L78 78 L73 73 L68 78 L70 85 L62 86 L60 80 L53 82 L53 90 L47 90 L47 82 L40 80 L38 86 L30 85 L32 78 L27 73 L22 78 L17 73 L22 68 L20 62 L14 62 L12 55 L18 55 L20 48 L15 45 L15 40 L20 40 L23 33 L18 30 L20 25 L25 28 L30 22 L27 18 L30 15 L35 18 L40 15 L38 10 L42 10 L44 5 L46 10 L50 10 Z"
                fill="url(#gearGrad1)"
                stroke={isDark ? '#1F2937' : '#4B5563'}
                strokeWidth="1"
              />
              <circle cx="50" cy="50" r="20" fill={isDark ? '#1F2937' : '#4B5563'} />
              <circle cx="50" cy="50" r="10" fill={isDark ? '#374151' : '#6B7280'} />
            </svg>
          </motion.div>
          
          {/* Small Gear */}
          <motion.div
            className="absolute"
            style={{ width: '70px', height: '70px', top: '80px', left: '100px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="gearGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? '#6366F1' : '#818CF8'} />
                  <stop offset="100%" stopColor={isDark ? '#4F46E5' : '#6366F1'} />
                </linearGradient>
              </defs>
              <path
                d="M50 15 L55 15 L58 8 L62 15 L68 15 L72 22 L80 22 L82 30 L88 35 L85 42 L90 50 L85 58 L88 65 L82 70 L80 78 L72 78 L68 85 L62 85 L58 92 L55 85 L50 85 L45 85 L42 92 L38 85 L32 85 L28 78 L20 78 L18 70 L12 65 L15 58 L10 50 L15 42 L12 35 L18 30 L20 22 L28 22 L32 15 L38 15 L42 8 L45 15 L50 15 Z"
                fill="url(#gearGrad2)"
                stroke={isDark ? '#312E81' : '#4338CA'}
                strokeWidth="1"
              />
              <circle cx="50" cy="50" r="18" fill={isDark ? '#312E81' : '#4338CA'} />
              <circle cx="50" cy="50" r="8" fill={isDark ? '#4F46E5' : '#6366F1'} />
            </svg>
          </motion.div>
          
          {/* Label */}
          <motion.div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            PRECISION ENGINEERING
          </motion.div>
        </motion.div>

        {/* Professional Tool Rack - BOTTOM RIGHT */}
        <motion.div
          className="absolute hidden lg:block"
          style={{ right: '5%', bottom: '12%', width: '220px', height: '180px' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
        >
          {/* Pegboard Background */}
          <div className={`absolute inset-0 rounded-xl ${
            isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-200 to-gray-300'
          }`} style={{ 
            boxShadow: isDark ? 'inset 0 2px 10px rgba(0,0,0,0.5)' : 'inset 0 2px 10px rgba(0,0,0,0.1)',
            backgroundImage: `radial-gradient(circle at 10px 10px, ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'} 2px, transparent 2px)`,
            backgroundSize: '20px 20px'
          }}>
            {/* Tool Row 1 - Wrenches */}
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`rounded ${isDark ? 'bg-gradient-to-b from-gray-400 to-gray-500' : 'bg-gradient-to-b from-gray-500 to-gray-600'}`}
                  style={{ 
                    width: `${12 + i * 3}px`, 
                    height: `${35 + i * 8}px`,
                    transformOrigin: 'top center'
                  }}
                  animate={{ 
                    rotateZ: i === 2 ? [0, -5, 0] : 0,
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className={`w-full h-2 rounded-t ${isDark ? 'bg-gray-600' : 'bg-gray-700'}`} />
                </motion.div>
              ))}
            </div>
            
            {/* Tool Row 2 - Screwdrivers */}
            <div className="absolute top-20 left-6 flex gap-4">
              {['bg-red-500', 'bg-yellow-500', 'bg-blue-500'].map((color, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {/* Handle */}
                  <div className={`w-4 h-8 rounded-t-lg ${color}`} />
                  {/* Shaft */}
                  <div className={`w-2 h-12 ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`} />
                  {/* Tip */}
                  <div className={`w-1 h-2 ${isDark ? 'bg-gray-500' : 'bg-gray-600'}`} />
                </motion.div>
              ))}
            </div>
            
            {/* Socket Set */}
            <motion.div
              className={`absolute bottom-4 left-4 w-20 h-10 rounded-lg ${
                isDark ? 'bg-gradient-to-r from-red-800 to-red-700' : 'bg-gradient-to-r from-red-600 to-red-500'
              }`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex justify-center gap-1 pt-2">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-300'}`}
                    style={{ width: `${6 + i}px`, height: `${6 + i}px` }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Impact Wrench */}
            <motion.div
              className="absolute bottom-4 right-4"
              animate={{ rotate: [0, -10, 0, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <div className={`relative w-16 h-12 rounded-lg ${
                isDark ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-gray-400 to-gray-300'
              }`}>
                {/* Handle */}
                <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-6 rounded-b-lg ${
                  isDark ? 'bg-red-700' : 'bg-red-600'
                }`} />
                {/* Socket */}
                <div className={`absolute top-1/2 right-0 translate-x-2 -translate-y-1/2 w-6 h-4 rounded ${
                  isDark ? 'bg-gray-500' : 'bg-gray-400'
                }`} />
              </div>
            </motion.div>
          </div>
          
          {/* Label */}
          <motion.div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
            }`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          >
            PRO TOOL STATION
          </motion.div>
        </motion.div>

        {/* Floating Service Icons with Holographic Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {workshopElements.map((element, i) => (
            <motion.div
              key={element.id}
              className="absolute hidden md:flex flex-col items-center"
              style={{ left: `${element.x}%`, top: `${element.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.15, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm ${
                  isDark 
                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-400/30' 
                    : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
                }`}
                style={{ 
                  boxShadow: isDark 
                    ? '0 0 30px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                    : '0 10px 30px rgba(59, 130, 246, 0.2)'
                }}
                animate={{ 
                  y: [0, -8, 0],
                  rotateY: [0, 10, 0, -10, 0],
                }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                {element.id === 'lift' && <Car className={isDark ? 'text-blue-400' : 'text-blue-600'} size={24} />}
                {element.id === 'diagnostic' && <Settings className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'} animate-spin`} style={{ animationDuration: '8s' }} size={24} />}
                {element.id === 'tools' && <Wrench className={isDark ? 'text-yellow-400' : 'text-yellow-600'} size={24} />}
                {element.id === 'engine' && <Cog className={`${isDark ? 'text-purple-400' : 'text-purple-600'} animate-spin`} style={{ animationDuration: '4s' }} size={24} />}
                {element.id === 'tires' && <CircleDot className={isDark ? 'text-green-400' : 'text-green-600'} size={24} />}
              </motion.div>
              <motion.span
                className={`mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-white/10 text-white/80' : 'bg-black/5 text-gray-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                {element.label}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Animated Spark/Welding Effect - Occasional */}
        <motion.div
          className="absolute"
          style={{ left: '15%', top: '45%' }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
            scale: [0.5, 1.5, 0.8, 1.2, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-400"
              animate={{
                x: Math.cos(i * 45 * Math.PI / 180) * 30,
                y: Math.sin(i * 45 * Math.PI / 180) * 30,
                opacity: [1, 0],
                scale: [1, 0.2],
              }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}
          <div className="w-3 h-3 rounded-full bg-white blur-sm" />
        </motion.div>

        {/* Energy Pulse Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
          <defs>
            <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={isDark ? '#3B82F6' : '#60A5FA'} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <motion.line
            x1="0%" y1="30%"
            x2="100%" y2="30%"
            stroke="url(#pulseGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.line
            x1="0%" y1="70%"
            x2="100%" y2="70%"
            stroke="url(#pulseGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 1.5 }}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <Sparkles size={16} />
              Premium Auto Services
            </span>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Professional Care
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                For Your Car
              </span>
            </h1>

            <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              From routine maintenance to specialized enhancements, we deliver exceptional service with cutting-edge technology.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBookingModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <Calendar size={20} />
                Book Now
              </motion.button>
              
              <motion.a
                href="https://wa.me/8801760401605"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 font-semibold rounded-xl flex items-center gap-2 bg-green-500 text-white"
              >
                <MessageCircle size={20} />
                WhatsApp
              </motion.a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, value: 15000, suffix: '+', label: 'Happy Customers' },
              { icon: Award, value: 25, suffix: '+', label: 'Years Experience' },
              { icon: Wrench, value: 50000, suffix: '+', label: 'Cars Serviced' },
              { icon: Star, value: 4.9, suffix: '', label: 'Customer Rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm shadow-lg'}`}
              >
                <stat.icon className={`mx-auto mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
                <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.suffix === '' ? stat.value : <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Status Tracker */}
      <section className={`py-12 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Track Your Service
            </h2>
            
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter service ID"
                value={serviceStatusId}
                onChange={(e) => setServiceStatusId(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={checkServiceStatus}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Track
              </button>
            </div>

            {serviceStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  {['Received', 'In Progress', 'Quality Check', 'Ready'].map((step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          i < serviceStatus.step 
                            ? 'bg-green-500 text-white' 
                            : i === serviceStatus.step 
                              ? 'bg-blue-500 text-white animate-pulse' 
                              : isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {i < serviceStatus.step ? <Check size={20} /> : i + 1}
                      </motion.div>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Current Status: <strong>{serviceStatus.status}</strong>
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Updated: 1 minute ago
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-20 ${isDark ? 'bg-transparent' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Services
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive care for your vehicle
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden ${
                      isDark ? 'bg-gray-800' : 'bg-white shadow-lg'
                    } ${selectedServices.includes(service.id) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => toggleService(service.id)}
                  >
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                        Popular
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {selectedServices.includes(service.id) && (
                      <div className="absolute top-4 left-4 z-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}

                    {/* Glow Effect on Hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isDark ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
                    }`} />

                    <div className="relative p-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        isDark ? 'bg-blue-500/20' : 'bg-blue-50'
                      } group-hover:scale-110 transition-transform`}>
                        <IconComponent className={isDark ? 'text-blue-400' : 'text-blue-600'} size={32} />
                      </div>

                      {/* Content */}
                      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {service.name}
                      </h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.slice(0, 2).map((feature, i) => (
                          <span 
                            key={i} 
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price & Duration */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {service.basePrice}
                          </span>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> BDT</span>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Timer size={14} />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Service Packages
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Save more with our comprehensive packages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => selectPackage(pkg.id)}
                className={`relative cursor-pointer rounded-3xl overflow-hidden ${
                  pkg.recommended 
                    ? 'ring-2 ring-blue-500 shadow-2xl scale-105' 
                    : ''
                } ${
                  isDark ? 'bg-gray-800' : 'bg-white shadow-xl'
                } ${
                  selectedPackage === pkg.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {/* Recommended Badge */}
                {pkg.recommended && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-bold">
                    Most Popular
                  </div>
                )}

                {/* Selected Indicator */}
                {selectedPackage === pkg.id && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                )}

                <div className={`p-8 ${pkg.recommended ? 'pt-12' : ''}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  
                  <div className="mb-6">
                    <span className={`text-3xl sm:text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {pkg.price}
                    </span>
                    <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> BDT</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      pkg.recommended
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        : isDark
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Select Package
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Cost Estimator */}
      {(selectedServices.length > 0 || selectedPackage) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed bottom-0 left-0 right-0 z-40 ${
            isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white shadow-2xl'
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Estimated Total
                </span>
                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {totalPrice} <span className="text-lg">BDT</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedPackage 
                    ? '1 package selected'
                    : `${selectedServices.length} services selected`}
                </div>
                <button
                  onClick={() => {
                    setSelectedServices([]);
                    setSelectedPackage(null);
                  }}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
                >
                  Book Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Technicians Section */}
      <section className={`py-20 ${isDark ? 'bg-transparent' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Expert Team
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Certified technicians with extensive experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technicians.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white shadow-xl'}`}
              >
                <div className="relative h-64">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={400}
                    height={256}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold">{tech.name}</h3>
                    <p className="text-gray-300">{tech.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="fill-yellow-400 text-yellow-400" size={18} />
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{tech.rating}</span>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({tech.reviews} reviews)
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {tech.experience} years exp.
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tech.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tech.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center gap-2">
              <StarRating rating={5} size={24} />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>4.9</span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                (500+ reviews)
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                    width={48}
                    height={48}
                    decoding="async"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{review.name}</h4>
                      {review.verified && (
                        <CheckCircle className="text-green-500" size={16} />
                      )}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {review.comment}
                </p>
                <span className={`inline-block mt-4 text-sm px-3 py-1 rounded-full ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {review.service}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${isDark ? 'bg-transparent' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Search */}
            <div className="relative mb-8">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="text"
                placeholder="Search questions..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className={`w-full flex items-center justify-between p-6 text-left ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    {expandedFaq === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className={`px-6 pb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Book Your Appointment
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X size={24} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        bookingStep >= step 
                          ? 'bg-blue-600 text-white' 
                          : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {bookingStep > step ? <Check size={20} /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-20 md:w-32 h-1 mx-2 ${
                          bookingStep > step ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Date & Time</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Your Info</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Confirm</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Step 1: Date & Time Selection */}
                {bookingStep === 1 && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Select Date
                    </h3>
                    
                    {/* Calendar */}
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
                      {calendarDates.map((date, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 w-20 p-3 rounded-xl text-center transition-all ${
                            selectedDate.toDateString() === date.toDateString()
                              ? 'bg-blue-600 text-white'
                              : isDark 
                                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-xs opacity-75">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-xl font-bold">{date.getDate()}</div>
                          <div className="text-xs opacity-75">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </button>
                      ))}
                    </div>

                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Select Time
                    </h3>

                    {/* Time Slots */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`py-3 rounded-xl text-center transition-all ${
                            selectedTime === slot.time
                              ? 'bg-blue-600 text-white'
                              : !slot.available
                                ? isDark 
                                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                : isDark 
                                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Customer Info */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Car Model
                      </label>
                      <input
                        type="text"
                        value={customerInfo.carModel}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, carModel: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        placeholder="e.g., Toyota Camry 2023"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Additional Notes
                      </label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        placeholder="Any special notes..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {bookingStep === 3 && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Booking Summary
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Date</span>
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(selectedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Time</span>
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Services</span>
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {selectedPackage 
                              ? servicePackages.find(p => p.id === selectedPackage)?.name
                              : selectedServices.map(id => services.find(s => s.id === id)?.name).join(', ') || 'None selected'}
                          </span>
                        </div>
                        <div className={`flex justify-between pt-3 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total</span>
                          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {totalPrice} BDT
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Customer Info
                      </h3>
                      <div className="space-y-2">
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{customerInfo.name}</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{customerInfo.phone}</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{customerInfo.email}</p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{customerInfo.carModel}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`sticky bottom-0 flex gap-4 p-6 border-t ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                {bookingStep > 1 && (
                  <button
                    onClick={() => setBookingStep(bookingStep - 1)}
                    className={`flex-1 py-4 rounded-xl font-semibold ${
                      isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (bookingStep < 3) {
                      setBookingStep(bookingStep + 1);
                    } else {
                      alert('Booking confirmed! We will contact you soon.');
                      setShowBookingModal(false);
                      setBookingStep(1);
                    }
                  }}
                  disabled={bookingStep === 1 && !selectedTime}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                    bookingStep === 1 && !selectedTime
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  {bookingStep === 3 ? 'Confirm Booking' : 'Next'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Padding for bottom bar */}
      {(selectedServices.length > 0 || selectedPackage) && <div className="h-24" />}
    </div>
  );
};

export { ServicesPage };
export default ServicesPage;
