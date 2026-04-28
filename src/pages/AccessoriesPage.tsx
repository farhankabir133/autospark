import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ShoppingCart,
  Search,
  Heart,
  Eye,
  X,
  Plus,
  Minus,
  Star,
  Check,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Truck,
  Shield,
  Package,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  RefreshCw,
  Loader2,
  Trash2,
  Droplet,
  type LucideIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { appwritePaymentApi } from '../services/appwritePaymentApi';

// Extended Product interface for accessories with additional UI fields
interface AccessoryProduct {
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
  created_at?: string;
  updated_at?: string;
  images?: { image_url: string }[];
  brand?: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  compatibility?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

// Types
interface CartItem {
  product: AccessoryProduct;
  quantity: number;
}

interface WishlistItem {
  id: string;
  product: AccessoryProduct;
  addedAt: Date;
}

interface CompareItem {
  product: AccessoryProduct;
}

interface CheckoutFormData {
  customer_name: string;
  mobile: string;
  address: string;
  thana: string;
  district: string;
}

// Demo Products (fallback if Supabase is empty)
const demoProducts: AccessoryProduct[] = [
  { id: '1073', name_en: 'Globoil 5W-30', name_bn: '', price: 4550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/GlassCleaner.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  // User-requested accessories (added in order)
  {
    id: '1100', name_en: 'Wireless Car Play', name_bn: '', price: 8500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/wirelesscarplay.webp' }], brand: '', rating: 5, reviews: 1, discount: 0, compatibility: [], isNew: true, isBestseller: true
  },
  {
    id: '1001', name_en: 'Axio/Fielder Bati High Fiting', name_bn: '', price: 4500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false
  },
  { id: '1002', name_en: 'Belt 1150', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1003', name_en: 'Belt 1160', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1004', name_en: 'Belt 1170', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1005', name_en: 'Boot Cover', name_bn: '', price: 600, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/BootCover.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1006', name_en: 'Brake Fluid/Oil', name_bn: '', price: 1050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/BrakeFluid.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1007', name_en: 'Brake pad 690 E1', name_bn: '', price: 4700, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1008', name_en: 'Brake pad 715/52240', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1009', name_en: 'Brake pad 732 E8', name_bn: '', price: 5200, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1010', name_en: 'Bumper CHR', name_bn: '', price: 8500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1011', name_en: 'Bumper Corolla Cross', name_bn: '', price: 8500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/cars/Products/Bumper.jpeg' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1012', name_en: 'Bumper-Noah-Esquire', name_bn: '', price: 8500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/cars/Products/Bumper.jpeg' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1013', name_en: 'C-HR Bati/ High Fiting', name_bn: '', price: 5000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1014', name_en: 'C-HR Wiper Blade Genuine Japan', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1015', name_en: 'Car Blutooth', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Car-Bluetooth.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1016', name_en: 'Car Wax Polish', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1017', name_en: 'Carall Wiper Blade', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1018', name_en: 'Carbulator Cleaner', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1191', name_en: 'Champion 0W20', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Champion0W20.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1192', name_en: 'Champion 10W30', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Champion10W30.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1193', name_en: 'Champion 5W30', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Champion5W30.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1019', name_en: 'Champ 10W40', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/Champion10w40.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2201', name_en: 'Champ Brake Fluid', name_bn: '', price: 1250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/ChampionBrakeFluid.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2202', name_en: 'Champ Coolant (1L)', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ChampionCoolant.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2203', name_en: 'Champ Coolant (5L)', name_bn: '', price: 2950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ChampionMobil.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },

  { id: '2204', name_en: 'LED Headlight Lumens 30000', name_bn: '', price: 5500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LEDHeadlightLumens30000.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: ['Universal'], isNew: true, isBestseller: false },

  { id: '2205', name_en: 'LED M8 Pro', name_bn: '', price: 5500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LEDM8Pro.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: ['Universal'], isNew: true, isBestseller: false },

  { id: '2206', name_en: 'LED Waterproof 9005', name_bn: '', price: 5500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LED9005.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: ['Universal'], isNew: true, isBestseller: false },

  { id: '2207', name_en: 'LED X-10 9006', name_bn: '', price: 7500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LED9006.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: ['Universal'], isNew: true, isBestseller: false },
  { id: '2204', name_en: 'Champ Engine Flush', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ChampionEngineFlush.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2205', name_en: 'Champion Eco-Friend 5W-30', name_bn: '', price: 5050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ChampionEco5W30.webp' }], brand: 'Champion', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1020', name_en: 'Charger 6A', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Charger6A.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1021', name_en: 'CHR Casing', name_bn: '', price: 2000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DVD-Catching.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1022', name_en: 'Coil Cap Rubber RBI', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1024', name_en: 'Cosmic Wax', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/CosmicLeatherWax.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1025', name_en: 'CVT Fluid NS-3', name_bn: '', price: 6950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/CVTFluidNS3.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1026', name_en: 'CVT Fluid TC', name_bn: '', price: 7550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/CVTFluidTC.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2206', name_en: 'CVT Fluid NS-2', name_bn: '', price: 6950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/CVTFluidNS2.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2207', name_en: 'Gear Oil CVT-FE', name_bn: '', price: 7550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/CVTFluidFE.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  // ...product removed: Cycle Show Piece (price 0)
  { id: '1028', name_en: 'D Bush 12320', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DBush12320.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1029', name_en: 'D Bush 20290', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DBush.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1030', name_en: 'D Bush 28170', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DBush28170.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1031', name_en: 'D Bush 52080', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DBush52080.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1033', name_en: 'DBD Glass Protector', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DVDScreenProtector.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1034', name_en: 'Denso Small Horn', name_bn: '', price: 1550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1035', name_en: 'Diamond 2K Camera', name_bn: '', price: 2250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1036', name_en: 'Disco Light', name_bn: '', price: 1200, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1037', name_en: 'Doctor Art 2', name_bn: '', price: 200, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DoctorArt2.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1038', name_en: 'Doctor Sticker 1', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DoctorSticker.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1039', name_en: 'Door Cover', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1040', name_en: 'Door Guard', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DoorGuard.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1041', name_en: 'Door Guard Rubber', name_bn: '', price: 850, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1042', name_en: 'Door Sil Axio', name_bn: '', price: 4500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1043', name_en: 'Door Sill C-HR', name_bn: '', price: 2500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DoorSillC-HR.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1044', name_en: 'Door Sill Prius', name_bn: '', price: 2500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DoorGuardPrius.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1045', name_en: 'Drive Shape Seal', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DoorTapedSeal.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1046', name_en: 'DTR Polish', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1047', name_en: 'Duster', name_bn: '', price: 1050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Duster.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1048', name_en: 'Duster B', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DusterB.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1049', name_en: 'ED Bulb 2 pin', name_bn: '', price: 100, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/EDBulb2Pin.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1050', name_en: 'Fine Glass', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/FineGlass.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1051', name_en: 'Fire Extinguisher', name_bn: '', price: 1400, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1052', name_en: 'Fog Light Full Set', name_bn: '', price: 7500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LEDFogLight.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1053', name_en: 'Fresh Jell', name_bn: '', price: 1050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/FreshJell.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1054', name_en: 'Fuel Injector Cleaner', name_bn: '', price: 400, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/FuelInjectorCleaner.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1055', name_en: 'Fuel Pump 0C050', name_bn: '', price: 1950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/FuelPump0C050.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1056', name_en: 'Fuel Pump 200', name_bn: '', price: 3250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/FuelPump200.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1057', name_en: 'Fuel Pump 211', name_bn: '', price: 3450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/FuelPump211.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1058', name_en: 'Gear Oil Type 4', name_bn: '', price: 7550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/CVT-Fluid-Type4.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1059', name_en: 'Gear Oil WS', name_bn: '', price: 7800, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Gear-OilWS.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1060', name_en: 'Glass Cleaner', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/GlassCleaner.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1061', name_en: 'Glass Cleaner Tablet', name_bn: '', price: 200, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1062', name_en: 'Globoil 0W-20', name_bn: '', price: 4550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/Globoil0W20.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1063', name_en: 'Globoil 10W-40', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/Globoil10w40.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1064', name_en: 'Globoil PAO 0W-20', name_bn: '', price: 6050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/18 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1065', name_en: 'GPS Tracking OBD', name_bn: '', price: 7500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/GPSTrackingOBD.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1066', name_en: 'Grease Toyo', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1067', name_en: 'Gulf 5W30', name_bn: '', price: 4750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Gulf5W30.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1073', name_en: 'Globoil 5W-30', name_bn: '', price: 4550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/GlassCleaner.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1068', name_en: 'H-11', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/H-11Bulb.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1069', name_en: 'Hand Glovoves', name_bn: '', price: 200, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1070', name_en: 'Higlo Wax( Coating)', name_bn: '', price: 850, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1071', name_en: 'Honda Air Filter 5AA', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/HondaAirFilter5AA.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1072', name_en: 'Honda Air Filter 5R0', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Honda_Vezel_Jaz-Non_Brand.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1073', name_en: 'Honda Air Filter R6A', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/HondaAirFilterR6A.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1074', name_en: 'Honda ATF DW-1', name_bn: '', price: 1950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/HondaATFDW1.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1075', name_en: 'Honda Oil Filter RAF', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/HondaRAF.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1076', name_en: 'Hunger Bush 0D060', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/HungerBush0D060.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1077', name_en: 'Hunger Bush 12120', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/HungerBush12120.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1078', name_en: 'Hunger Bush 12170 Big', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1079', name_en: 'Hy-Coolent-fan Filter 470070', name_bn: '', price: 800, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Hy-coolantFilter470070.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1080', name_en: 'Injector Seal', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1081', name_en: 'Intigator Bulb', name_bn: '', price: 850, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1082', name_en: 'JDA 0W-20', name_bn: '', price: 4550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/7 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1194', name_en: 'JDA 5W-30', name_bn: '', price: 4550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/JDA5W30.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1083', name_en: 'JDA 10W-40', name_bn: '', price: 3750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/JDA10W40.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1084', name_en: 'Kaitom Wiper Blade', name_bn: '', price: 400, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1085', name_en: 'KH-C30', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1086', name_en: 'Leather Tire Wax', name_bn: '', price: 850, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1087', name_en: 'LED Lemon H.11', name_bn: '', price: 4500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LEDLemonH-11.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1088', name_en: 'LED Waterfroop H.11', name_bn: '', price: 5500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LEDH-11Waterproof.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1089', name_en: 'LED X-10 H.11', name_bn: '', price: 7500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/LEDX10-H11.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1090', name_en: 'LPG Conversion Full Set [60 KG]', name_bn: '', price: 70000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1091', name_en: 'Mitasu 0W-20', name_bn: '', price: 4350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/5 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1092', name_en: 'Mobil 1-0W20', name_bn: '', price: 6950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Mobil10W20.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1093', name_en: 'Mobil 1-0W40', name_bn: '', price: 6850, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/Mobil1-10W40.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1094', name_en: 'Mobil Filter 31000', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/4 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1096', name_en: 'Mobil Filter 65F00', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/4 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1097', name_en: 'Monitor Case', name_bn: '', price: 2500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/MonitorCase.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1098', name_en: 'Motor Flash', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/MotorFlush.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1100', name_en: 'My Romance', name_bn: '', price: 1250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/MyRomance.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1101', name_en: 'Nakamichi DVD Jack to Jack', name_bn: '', price: 1000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '2208', name_en: 'Nakamichi Android Player 5850', name_bn: '', price: 22500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Nakamichi.webp' }], brand: 'Nakamichi', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: true, isBestseller: false },
  { id: '1102', name_en: 'Nissan Air Filter 4BAIB', name_bn: '', price: 850, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/4 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1103', name_en: 'Nito tape', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1104', name_en: 'Noah/Esquire Bati High Fiting', name_bn: '', price: 5000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1105', name_en: 'Floor Mat', name_bn: '', price: 2500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/FloorMat.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1107', name_en: 'Onam Light 9005', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/OnamLight.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1108', name_en: 'Paint Spray', name_bn: '', price: 500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/PaintSpray.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1109', name_en: 'Phone Holder', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1110', name_en: 'Polie Light Big', name_bn: '', price: 2500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Police-Light.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1111', name_en: 'Prado Air Filter', name_bn: '', price: 700, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/4 Background Removed Medium.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1112', name_en: 'Premio Fog Light Casing', name_bn: '', price: 2550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/DVD-Catching.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1113', name_en: 'Prius Bati/ High Fiting', name_bn: '', price: 5000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1114', name_en: 'Prius Wiper Blade Jenuine Japan', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1115', name_en: 'Rain Proof Film', name_bn: '', price: 250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/RainFilm.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1116', name_en: 'Round Cylinder', name_bn: '', price: 30000, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1117', name_en: 'Scent Decent', name_bn: '', price: 1050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ScentDesent.png' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1118', name_en: 'Scent Helicopter', name_bn: '', price: 1050, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ScentHelicopter.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  // ...product removed: Seat Belt Hock (price 0)
  // ...product removed: Seat Cleaner (price 0)
  { id: '1121', name_en: 'Shampo', name_bn: '', price: 500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Shampo.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1122', name_en: 'Spark Plug 10 C', name_bn: '', price: 675, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1123', name_en: 'Spark Plug 10 G', name_bn: '', price: 1575, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1124', name_en: 'Spark Plug 43 C', name_bn: '', price: 2700, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1125', name_en: 'Spark Plug 43 G', name_bn: '', price: 1950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1126', name_en: 'Spark Plug 47 C', name_bn: '', price: 675, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1127', name_en: 'Spark Plug 53 C', name_bn: '', price: 675, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1128', name_en: 'Spark Plug 53 G', name_bn: '', price: 1800, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1129', name_en: 'Spark Plug 84', name_bn: '', price: 2950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  // ...product removed: Sport Guage (price 0)
  { id: '1131', name_en: 'Tappet Cover Seal 21011', name_bn: '', price: 950, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1132', name_en: 'Tire Gel', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1133', name_en: 'Towel', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1134', name_en: 'Towel (Pr39-2)', name_bn: '', price: 300, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1135', name_en: 'Towel 40/60', name_bn: '', price: 350, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1136', name_en: 'Toyota Long Life Radiator Coolant', name_bn: '', price: 1450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ToyotaLongLifeCoolant.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1137', name_en: 'Toyota Mobil Filter/Oil Filter', name_bn: '', price: 250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/ToyotaMobilFilter.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1138', name_en: 'Tracker', name_bn: '', price: 5500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/Tracker.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1139', name_en: 'V tech', name_bn: '', price: 250, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1140', name_en: 'Vanilla Flower Cent', name_bn: '', price: 500, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/NP/VanillaPerfume.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1141', name_en: 'W40', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [{ image_url: '/P2/w40.webp' }], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1142', name_en: 'Water Jacket 21010', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1143', name_en: 'Water Jacket 21020', name_bn: '', price: 750, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1144', name_en: 'Water Jacket 22030', name_bn: '', price: 650, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1145', name_en: 'WD40', name_bn: '', price: 550, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1146', name_en: 'Wiper Blade', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  { id: '1147', name_en: 'Yoshio Wiper Blade', name_bn: '', price: 450, category: 'Accessories', stock_quantity: 10, is_available: true, images: [], brand: '', rating: 0, reviews: 0, discount: 0, compatibility: [], isNew: false, isBestseller: false },
  // ...product removed: Air Filter 37021 (price 0)
  // ...product removed: AC Filter 37021 (price 0)
  // ...product removed: WD40 (price 0)
  // ...product removed: Towel (price 0)
  // ...product removed: AC Filter 30040 (price 0)
  // ...product removed: Toyota Mobil Filter/Oil Filter (price 0)
  // ...product removed: Air Filter 21050 (price 0)
  // ...product removed: AC/Cabin Filter-40 (price 0)
  {
    id: '1',
    name_en: 'Premium Leather Seat Covers',
    name_bn: 'প্রিমিয়াম লেদার সিট কভার',
    description_en: 'Luxurious genuine leather seat covers for ultimate comfort and style. Universal fit for most vehicles.',
    description_bn: 'চূড়ান্ত আরাম এবং স্টাইলের জন্য বিলাসবহুল আসল চামড়ার সিট কভার।',
    category: 'Interior',
    price: 15000,
    stock_quantity: 25,
    is_available: true,
  images: [{ image_url: '/P2/LeatherSeatCover.png' }],
    brand: 'AutoLux',
    rating: 4.8,
    reviews: 156,
    discount: 15,
    compatibility: ['Toyota', 'Honda', 'Nissan'],
    isNew: true,
    isBestseller: true
  },
  {
    id: '2',
  name_en: 'LED A80',
    name_bn: 'এলইডি হেডলাইট আপগ্রেড কিট',
    description_en: 'Ultra-bright LED headlights with 6000K color temperature. Easy installation.',
    description_bn: '৬০০০K রঙের তাপমাত্রা সহ অতি উজ্জ্বল LED হেডলাইট।',
    category: 'Lighting',
  price: 7500,
    stock_quantity: 50,
    is_available: true,
  images: [{ image_url: '/NP/LEDA80.webp' }],
    brand: 'BrightDrive',
    rating: 4.6,
    reviews: 89,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: true
  },
  {
    id: '4',
    name_en: 'Charger 6A',
    name_bn: 'চার্জার 6A',
    description_en: '15W fast wireless charging with auto-clamping phone mount.',
    description_bn: 'অটো-ক্ল্যাম্পিং ফোন মাউন্ট সহ ১৫W দ্রুত ওয়্যারলেস চার্জিং।',
    category: 'Electronics',
    price: 550,
    stock_quantity: 75,
    is_available: true,
    images: [{ image_url: '/NP/Charger6A.webp' }],
    brand: 'TechDrive',
    rating: 4.7,
    reviews: 312,
    discount: 0,
    compatibility: ['Universal'],
    isNew: true,
  },
  {
    id: '6',
    name_en: 'Dash Cam Pro 4K',
    name_bn: 'ড্যাশ ক্যাম প্রো 4K',
    description_en: '4K Ultra HD dash camera with night vision and GPS tracking.',
    description_bn: 'নাইট ভিশন এবং GPS ট্র্যাকিং সহ 4K আল্ট্রা HD ড্যাশ ক্যামেরা।',
    category: 'Electronics',
    price: 12000,
    stock_quantity: 30,
    // ...existing code...
    is_available: true,
  images: [{ image_url: '/NP/4G-Dashcam.webp' }],
    brand: 'Valvoline',
    rating: 4.6,
    reviews: 256,
    discount: 5,
    compatibility: ['High Mileage Engines', 'Older Vehicles'],
    isNew: false,
    isBestseller: false
  },
  // ...product removed: Valvoline Daily Protection 10W-40
  // LIQUI MOLY (German Brand)
  // TOYOTA GENUINE
  // ======================= PARTS & ACCESSORIES =======================
  {
    id: '46',
    name_en: 'Cosmic Wax',
    name_bn: 'কসমিক ওয়াক্স',
    description_en: 'Premium car wax for a brilliant, long-lasting shine. Protects paint from UV rays and environmental damage.',
    description_bn: 'উজ্জ্বল, দীর্ঘস্থায়ী চকচকে ফিনিশের জন্য প্রিমিয়াম কার ওয়াক্স।',
    category: 'Exterior',
    price: 750,
    stock_quantity: 100,
    is_available: true,
  images: [{ image_url: '/P2/w40.webp' }],
    brand: 'Cosmic',
    rating: 4.5,
    reviews: 89,
    discount: 0,
    compatibility: ['Universal'],
    isNew: true,
    isBestseller: false
  },
  {
    id: '47',
    name_en: 'Allion LED Left Back Light',
    name_bn: 'অ্যালিয়ন এলইডি বাম ব্যাক লাইট',
    description_en: 'OEM quality LED tail light for Toyota Allion. Perfect fit with bright LED illumination.',
    description_bn: 'টয়োটা অ্যালিয়নের জন্য OEM মানের LED টেইল লাইট।',
    category: 'Lighting',
    price: 14500,
    stock_quantity: 15,
    is_available: true,
  images: [{ image_url: '/NP/AllionBackLight.webp' }],
    brand: 'Toyota',
    rating: 4.8,
    reviews: 34,
    discount: 0,
    compatibility: ['Toyota Allion'],
    isNew: true,
    isBestseller: false
  },
  {
    id: '49',
    name_en: 'AVS Brake Booster',
    name_bn: 'এভিএস ব্রেক বুস্টার',
    description_en: 'High-performance brake booster for enhanced braking power. OEM replacement quality.',
    description_bn: 'উন্নত ব্রেকিং পাওয়ারের জন্য হাই-পারফরম্যান্স ব্রেক বুস্টার।',
    category: 'Performance',
    price: 85000,
    stock_quantity: 5,
    is_available: true,
    images: [{ image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' }],
    brand: 'AVS',
    rating: 4.9,
    reviews: 23,
    discount: 0,
    compatibility: ['Toyota', 'Honda', 'Nissan'],
    isNew: false,
    isBestseller: true
  },
  {
    id: '52',
    name_en: 'Kaitom Wiper Blade',
    name_bn: 'কাইটম ওয়াইপার ব্লেড',
    description_en: 'High-quality rubber wiper blade for streak-free visibility. Durable all-weather performance.',
    description_bn: 'স্ট্রিক-ফ্রি দৃশ্যমানতার জন্য উচ্চ মানের রাবার ওয়াইপার ব্লেড।',
    category: 'Exterior',
    price: 400,
    stock_quantity: 200,
    is_available: true,
  images: [{ image_url: '/NP/RoadstarWiperBlade.webp' }],
    brand: 'Kaitom',
    rating: 4.2,
    reviews: 234,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: false
  },
  {
    id: '53',
    name_en: 'Road Star Wiper Blade',
    name_bn: 'রোড স্টার ওয়াইপার ব্লেড',
    description_en: 'Premium quality wiper blade with aerodynamic design for quiet, efficient wiping.',
    description_bn: 'শান্ত, দক্ষ ওয়াইপিংয়ের জন্য অ্যারোডাইনামিক ডিজাইনের প্রিমিয়াম মানের ওয়াইপার ব্লেড।',
    category: 'Exterior',
    price: 450,
    stock_quantity: 180,
    is_available: true,
  images: [{ image_url: '/NP/RoadstarWiperBlade.webp' }],
    brand: 'Road Star',
    rating: 4.3,
    reviews: 189,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: false
  },
  {
    id: '54',
    name_en: 'Carall Wiper Blade',
    name_bn: 'ক্যারল ওয়াইপার ব্লেড',
    description_en: 'Japanese quality wiper blade with natural rubber for superior wiping performance.',
    description_bn: 'উচ্চতর ওয়াইপিং পারফরম্যান্সের জন্য প্রাকৃতিক রাবার সহ জাপানি মানের ওয়াইপার ব্লেড।',
    category: 'Exterior',
    price: 450,
    stock_quantity: 150,
    is_available: true,
    images: [{ image_url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400' }],
    brand: 'Carall',
    rating: 4.4,
    reviews: 167,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: false
  },
  {
    id: '55',
    name_en: 'Fuel Injector Cleaner',
    name_bn: 'ফুয়েল ইনজেক্টর ক্লিনার',
    description_en: 'Powerful fuel system cleaner that removes deposits and restores fuel efficiency.',
    description_bn: 'শক্তিশালী ফুয়েল সিস্টেম ক্লিনার যা ডিপোজিট সরিয়ে জ্বালানি দক্ষতা পুনরুদ্ধার করে।',
    category: 'Performance',
    price: 400,
    stock_quantity: 120,
    is_available: true,
    images: [{ image_url: 'https://images.unsplash.com/photo-1635784439498-9bee4f8a8a5b?w=400' }],
    brand: 'Pro Clean',
    rating: 4.5,
    reviews: 278,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: true
  },
  {
    id: '56',
    name_en: 'Octane Booster Cleaner',
    name_bn: 'অকটেন বুস্টার ক্লিনার',
    description_en: 'Increases octane rating and cleans fuel system for improved engine performance.',
    description_bn: 'উন্নত ইঞ্জিন পারফরম্যান্সের জন্য অকটেন রেটিং বাড়ায় এবং ফুয়েল সিস্টেম পরিষ্কার করে।',
    category: 'Performance',
    price: 400,
    stock_quantity: 100,
    is_available: true,
  images: [{ image_url: '/P2/OctaneBooster.webp' }],
    brand: 'Pro Clean',
    rating: 4.4,
    reviews: 198,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: false
  },
  {
    id: '65',
  name_en: 'Roadstar Horn',
  name_bn: '',
  description_en: 'Loud and clear dual-tone horn for enhanced road safety. Easy installation.',
  description_bn: '',
  category: 'Electronics',
  price: 2500,
  stock_quantity: 75,
  is_available: true,
  images: [{ image_url: '/NP/RoadStarHorn.webp' }],
  brand: 'Roadstar',
  rating: 4.3,
    reviews: 156,
    discount: 0,
    compatibility: ['Universal'],
    isNew: false,
    isBestseller: false
  },
  {
    id: '68',
  name_en: 'Denso Snail Horn',
  name_bn: 'ডেনসো হর্ন',
  description_en: 'Premium Japanese Denso snail horn with powerful sound output. OEM quality.',
  description_bn: 'শক্তিশালী সাউন্ড আউটপুট সহ প্রিমিয়াম জাপানি ডেনসো স্নেইল হর্ন।',
  category: 'Electronics',
  price: 2500,
  stock_quantity: 40,
  is_available: true,
  images: [{ image_url: '/NP/DensoSnailHorn.webp' }],
  brand: 'Denso',
  rating: 4.8,
  reviews: 267,
  discount: 0,
  compatibility: ['Universal'],
  isNew: false,
  isBestseller: true
  }
];

// Public P2 images (user-supplied). We'll round-robin these across demo products when a product lacks images.
const P2_IMAGES = [
  '/P2/1 Background Removed Medium.webp', '/P2/2 Background Removed Medium.webp', '/P2/3 Background Removed Medium.webp',
  '/P2/4 Background Removed Medium.webp', '/P2/5 Background Removed Medium.webp', '/P2/6 Background Removed Medium.webp',
  '/P2/7 Background Removed Medium.webp', '/P2/8 Background Removed Medium.webp', '/P2/9 Background Removed Medium.webp',
  '/P2/10 Background Removed Medium.webp', '/P2/11 Background Removed Medium.webp', '/P2/12 Background Removed Medium.webp',
  '/P2/13 Background Removed Medium.webp', '/P2/14 Background Removed Medium.webp', '/P2/15 Background Removed Medium.webp',
  '/P2/16 Background Removed Medium.webp', '/P2/17 Background Removed Medium.webp', '/P2/18 Background Removed Medium.webp',
  '/P2/19 Background Removed Medium.webp',
];

// NP images (user-supplied). We'll try to attach these to demo products when the filename
// suggests a match with the product name (fuzzy token match).
const NP_IMAGES = [
  '/NP/Belt.webp', '/NP/Belts.webp', '/NP/BrakePad.webp', '/NP/Bromance.webp', '/NP/CVTFluidAT.webp', '/NP/CarLights.webp',
  '/NP/CarPerfume.webp', '/NP/CarallWiperBlade.webp', '/NP/Champion5W30.webp', '/NP/ChampionBrakeFluid.webp', '/NP/ChampionCoolant.webp',
  '/NP/ChampionMobil.webp', '/NP/ChokeCleaner.webp', '/NP/DVD-Catching.webp', '/NP/FuelInjection.webp', '/NP/GreaseToyo.webp',
  '/NP/HCF2.webp', '/NP/HondaLeo.webp', '/NP/HybridBattery.png', '/NP/IMG_2699-removebg-preview.webp', '/NP/IMG_2727-removebg-preview.webp',
  '/NP/2770_processed.webp', '/NP/JBLBoomBox.webp', '/NP/JDA10W40.webp', '/NP/JDA5W30.webp', '/NP/Mobil10W20.webp',
  '/NP/Nakamichi.webp', '/NP/Paste.webp', '/NP/Pro10.webp', '/NP/SP0W20.webp', '/NP/SparkPlug-II.webp', '/NP/Tire.webp',
  '/NP/WiperBlade.webp', '/NP/nakamichi-car-android-player-model-no-nam-5510-in-bd.webp', '/NP/s-l1200.webp'
];

// Helper: find best NP image for a product name (lowercased). Returns the image path or null.
function findNPForName(productNameLower: string) {
  for (const p of NP_IMAGES) {
    const filename = p.split('/').pop() || p;
    const base = filename.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!base) continue;
    // exact inclusion or token overlap
    if (productNameLower.includes(base) || base.includes(productNameLower)) return p;
    const toks = base.split(/\s+/).filter(Boolean);
    if (toks.some(t => t.length > 2 && productNameLower.includes(t))) return p;
  }
  return null;
}

// Ensure demo products have an image (use P2 images round-robin where missing)
const demoProductsWithP2 = demoProducts.map((p, i) => {
  const name = (p.name_en || '').toLowerCase();
  const hasExplicitImage = Array.isArray(p.images) && p.images.length > 0 && !!p.images[0]?.image_url;
  const isSparkplug = name.includes('sparkplug') || name.includes('spark plug') || name.includes('spark-plug');
  const isJda = name.includes('jda');
  const isAndroidPlayer = name.includes('android player') || name.includes('android-player') || name.includes('androidplayer');
  const isGulf = name.includes('gulf formula g 0w-20 full synthetic') || name.includes('gulf formula g 0w-20');
  const isGloboil = name.includes('globoil premium 0w-20 synthetic') || name.includes('globoil 0w-20') || name.includes('globoil0w20') || name.includes('globoil 0w20') || name.includes('globoil 5w-30') || name.includes('globoil5w30') || name.includes('globoil 5w30');
  const isAluminumRim = name.includes('car aluminum alloy rim') || name.includes('aluminum rim') || name.includes('alloy rim') || name.includes('aluminium rim');
  const isWirelessCharger = name.includes('wireless car charger') || name.includes('wireless charger') || name.includes('charger mount') || name.includes('car charger mount');
  // Specific brake-pad mapping for product 'Brake pad 715/52240' (and common variants)
  const isBrakePadSpecific = name.includes('brake pad 715/52240') || name.includes('715/52240') || name.includes('715 52240') || name.includes('715-52240') || name.includes('brake pad 715') || name.includes('pad 715/52240');
  // Explicit mappings requested: ensure these products use P2/1 Background Removed Medium.webp
  const isCarWax = name.includes('car wax polish') || name.includes('car wax') || name.includes('wax polish');
  const isCarallWiper = name.includes('carall wiper blade') || name.includes('carall wiper') || name.includes('carall wiperblade');
  const isCarbulatorCleaner = name.includes('carbulator cleaner') || name.includes('carbulator-cleaner') || name.includes('carbulator');
  // Match 'Air Filter' and common 'AC Filter' variants (e.g. 'AC Filter 37021', 'AC/Cabin Filter-40')
  const isAirFilter = name.includes('air filter') || name.includes('air-filter') || name.includes('airfilter') || name.includes('ac filter') || name.includes('ac-filter') || name.includes('acfilter') || name.includes('ac/cabin') || name.includes('ac cabin');
  // Match user's exact spelling plus the common variant 'air purifier'
  const isAirPurifierr = name.includes('air purifierr') || name.includes('air-purifierr') || name.includes('airpurifierr') || name.includes('air purifier') || name.includes('air-purifier') || name.includes('airpurifier');
  // Specific mapping for 'Car Air Purifier' (prefer the provided P2 image)
  const isCarAirPurifier = name.includes('car air purifier') || name.includes('car-air-purifier') || (name.includes('car') && name.includes('air purifier'));
  // Map vanilla-scented car perfume product to NP CarPerfume.webp
  const isVanillaFlowerCent = name.includes('vanilla flower cent') || name.includes('vanilla flower scent') || name.includes('vanilla flower') || name.includes('vanilla scent');
  // Map any Flamingo-branded product to the P2/1 placeholder image
  const isFlamingo = name.includes('flamingo');
  // Axio/Fielder Bati High Fiting mapping (many variants/typos handled)
  const isAxioFielderBati = name.includes('axio') || name.includes('fielder') || name.includes('bati') || name.includes('bati fitting') || name.includes('high fit') || name.includes('high fitting') || name.includes('fiting');
  const isCarCover = name.includes('car cover') || name.includes('car-cover') || name.includes('carcover') || name.includes(' cover') || name.includes('cover');
  const isSeatCover = name.includes('seatcover') || name.includes('seat cover') || name.includes('seat-cover');
  const isBumper = name.includes('bumper');
  const hasForcedBumperImage = isBumper;
  const isWiperBlade = name.includes('wiper blade') || name.includes('wiper-blade') || name.includes('wiperblade') || name.includes('wiper');
  const isBrakePad = name.includes('brakepad') || name.includes('brake pad') || name.includes('brake-pad');
  const isHorn = name.includes('horn');
  const isMitasu = name.includes('mitasu');
  const npMatch = findNPForName(name);
  return {
    ...p,
    // Keep explicit product image when present; otherwise apply mapped/fallback image rules.
    // Priority: JDA-specific image, then Gulf-specific P2 image, then NP fuzzy matches, then Mitasu, then android player, then air filter, then air purifierr/purifier, then seat cover, then car cover, then bumper, then brake pad, then horn, then sparkplug, otherwise P2 round-robin
  images: hasForcedBumperImage ? [{ image_url: '/P2/Bumper.webp' }] : hasExplicitImage ? p.images : [
  { image_url: isJda ? '/P2/7 Background Removed Medium.webp'
    : isGulf ? '/P2/Gulf Formula G 0W-20 Full Synthetic.webp'
  : isGloboil && name.includes('5w-30') ? '/NP/GlassCleaner.webp' : isGloboil ? '/P2/Globoil0W20.webp'
  // explicit product matches (user-specified)
  : isCarallWiper ? '/NP/WiperBlade.webp'
  : isVanillaFlowerCent ? '/NP/CarPerfume.webp'
  : isAxioFielderBati ? '/P2/AxioHighBatiFitting.webp'
  : isCarAirPurifier ? '/P2/Car Air Purifier.webp'
  : (isCarWax || isCarbulatorCleaner || isFlamingo) ? '/P2/1 Background Removed Medium.webp'
  : isAluminumRim ? '/P2/Globoil0W20.webp'
  : isWirelessCharger ? '/P2/Wireless Car Charger Mount.webp'
    : isBrakePadSpecific ? '/P2/BrakPar731927.png'
    : isSeatCover ? '/P2/SeatCover Background Removed.png'
    : isCarCover ? '/P2/CarCoverBackground Removed.png'
    : npMatch ? npMatch
    : isMitasu ? '/P2/5 Background Removed Medium.webp'
    : isAndroidPlayer ? '/P2/androidplayer Background Removed.png'
    : isAirFilter ? '/P2/4 Background Removed Medium.webp'
    : isAirPurifierr ? '/P2/9 Background Removed Medium.webp'
  : isBumper ? '/P2/Bumper.webp'
    : isWiperBlade ? '/NP/WiperBlade.webp'
    : isBrakePad ? '/P2/BrakePad.png'
    : isHorn ? '/P2/DensoHorn.png'
    : isSparkplug ? '/P2/sparkplug Background Removed.png'
    : P2_IMAGES[i % P2_IMAGES.length] },
    ],
  };
});

const dedupeProducts = (items: AccessoryProduct[]): AccessoryProduct[] => {
  const uniqueById = new Map<string, AccessoryProduct>();
  items.forEach((p) => uniqueById.set(String(p.id), p));

  const seenByNamePrice = new Set<string>();
  return Array.from(uniqueById.values()).filter((p) => {
    const normalizedName = (p.name_en || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const key = `${normalizedName}::${p.price}`;
    if (!normalizedName) return true;
    if (seenByNamePrice.has(key)) return false;
    seenByNamePrice.add(key);
    return true;
  });
};

const getForcedProductOverrideByName = (name: string): { imageUrl?: string; price?: number; nameEn?: string; discount?: number } | null => {
  const normalized = (name || '').toLowerCase();

  if (normalized.includes('jda 10w-40') || normalized.includes('jda 10w40')) {
    return { imageUrl: '/NP/JDA10W40.webp', price: 3750 };
  }

  if (normalized.includes('cvt fluid ns-2') || normalized.includes('ns-2')) {
    return { imageUrl: '/P2/CVTFluidNS2.webp', price: 6950 };
  }

  if (normalized.includes('cvt fluid ns-3') || normalized.includes('ns-3')) {
    return { imageUrl: '/P2/CVTFluidNS3.webp', price: 6950 };
  }

  if (normalized.includes('cvt fluid tc')) {
    return { imageUrl: '/P2/CVTFluidTC.webp', price: 7550 };
  }

  if (normalized.includes('gear oil cvt-fe') || normalized.includes('cvt-fe')) {
    return { imageUrl: '/P2/CVTFluidFE.webp', price: 7550 };
  }

  if (normalized.includes('jda 0w-20') || normalized.includes('jda 0w20')) {
    return {
      imageUrl: '/P2/7 Background Removed Medium.webp',
    };
  }

  if (normalized.includes('mobil 1 extended performance 10w-30') || normalized.includes('mobil 1-5w30') || normalized.includes('mobil 1 5w30')) {
    return {
      nameEn: 'Mobil 1-5W30',
      price: 6850,
      discount: 0,
      imageUrl: '/P2/6 Background Removed Medium.webp',
    };
  }

  if (normalized.includes('mobil 1-0w40') || normalized.includes('mobil 1 0w40')) {
    return { imageUrl: '/P2/Mobil1-10W40.webp' };
  }

  if (normalized.includes('bumper')) {
    return { imageUrl: '/P2/Bumper.webp' };
  }

  if (normalized.includes('champ 10w40')) {
    return { imageUrl: '/P2/Champion10w40.webp' };
  }

  if (normalized.includes('brake fluid/oil') || normalized.includes('brake fluid')) {
    return {
      imageUrl: '/P2/BrakeFluid.webp',
      price: 1050,
    };
  }

  return null;
};

const REFERENCE_PRODUCT_IMAGE = '/P2/5 Background Removed Medium.webp';

const getPrimaryProductImage = (product: AccessoryProduct): string => {
  return product.images?.[0]?.image_url || REFERENCE_PRODUCT_IMAGE;
};

const handleProductImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.currentTarget;
  if (!target.src.includes(REFERENCE_PRODUCT_IMAGE)) {
    target.src = REFERENCE_PRODUCT_IMAGE;
  }
};

// Categories with icons
const categoryData: { id: string; name: string; icon: LucideIcon; color: string }[] = [
  { id: 'all', name: 'All Products', icon: Grid, color: 'from-gray-500 to-gray-700' },
  { id: 'Interior', name: 'Interior', icon: Package, color: 'from-blue-500 to-blue-700' },
  { id: 'Exterior', name: 'Exterior', icon: Shield, color: 'from-green-500 to-green-700' },
  { id: 'Electronics', name: 'Electronics', icon: Zap, color: 'from-purple-500 to-purple-700' },
  { id: 'Lighting', name: 'Lighting', icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
  { id: 'Performance', name: 'Performance', icon: TrendingUp, color: 'from-red-500 to-red-700' },
  { id: 'Oils & Lubricants', name: 'Oils & Lubricants', icon: Droplet, color: 'from-amber-500 to-orange-600' }
];

// Brands
const brands = [
  // Accessories Brands
  'AutoLux', 'BrightDrive', 'CarbonPro', 'TechDrive', 'WeatherGuard', 'SafeView', 'SpeedRim', 'PureAir', 'StopTech', 'CargoMax', 'DiagPro', 'CoverPro',
  // Motor Oil Brands
  'Mobil 1', 'Gulf', 'Globoil', 'Honda Leo', 'Mitasu', 'Castrol', 'Shell', 'Total', 'Valvoline', 'Pennzoil', 'Liqui Moly', 'Toyota', 'Eneos', 'Nissan',
  // Parts & Accessories Brands
  'Cosmic', 'AVS', 'Kaitom', 'Road Star', 'Carall', 'Pro Clean', 'Pro-10', 'NGK', 'Carral', 'Denso', 'Universal'
];

// Popular search tags
const popularTags = ['LED Lights', 'Seat Covers', 'Dash Cam', 'Floor Mats', 'Charger', 'Wheels', '0W-20', '10W-30', '10W-40', 'Motor Oil'];

// Flash sale countdown (ends in 24 hours from now)
const flashSaleEnd = new Date(Date.now() + 24 * 60 * 60 * 1000);

// Helper Functions
const formatPrice = (price: number) => `৳${price.toLocaleString()}`;

// Dynamic Google Image Search redirect for product
const handleImageSearch = (product: AccessoryProduct) => {
  const queryParts = [
    product.name_en,
    product.category,
    product.sku
  ].filter(Boolean);
  const query = encodeURIComponent(queryParts.join(' '));
  const url = `https://www.google.com/search?tbm=isch&q=${query}`;
  window.open(url, '_blank');
};

const calculateDiscount = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100));
};

// Components

// Star Rating Component
const StarRating: React.FC<{ rating: number; reviews?: number; size?: number }> = ({ rating, reviews, size = 14 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      {reviews !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({reviews})</span>
      )}
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer: React.FC<{ endDate: Date; isDark: boolean }> = ({ endDate, isDark }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className={`flex flex-col items-center px-3 py-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
      <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
    </div>
  );

  return (
    <div className="flex gap-2">
      <TimeBox value={timeLeft.hours} label="HRS" />
      <span className={`text-2xl font-bold self-center ${isDark ? 'text-white' : 'text-gray-900'}`}>:</span>
      <TimeBox value={timeLeft.minutes} label="MIN" />
      <span className={`text-2xl font-bold self-center ${isDark ? 'text-white' : 'text-gray-900'}`}>:</span>
      <TimeBox value={timeLeft.seconds} label="SEC" />
    </div>
  );
};

// Price Range Slider Component
const PriceRangeSlider: React.FC<{
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  isDark: boolean;
}> = ({ min, max, value, onChange, isDark }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 100);
    setLocalValue([newMin, localValue[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 100);
    setLocalValue([localValue[0], newMax]);
  };

  const handleMouseUp = () => {
    onChange(localValue);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="relative h-2">
        <div className={`absolute w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div
          className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
        />
      </div>
      <div className="flex justify-between">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatPrice(localValue[0])}
        </span>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatPrice(localValue[1])}
        </span>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{
  product: AccessoryProduct;
  isDark: boolean;
  onQuickView: (product: AccessoryProduct) => void;
  onAddToCart: (product: AccessoryProduct) => void;
  onToggleWishlist: (product: AccessoryProduct) => void;
  onToggleCompare: (product: AccessoryProduct) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
  index: number;
}> = ({ product, isDark, onQuickView, onAddToCart, onToggleWishlist, onToggleCompare, isInWishlist, isInCompare, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const finalPrice = product.discount ? calculateDiscount(product.price, product.discount) : product.price;
  const stockPercentage = Math.min((product.stock_quantity / 100) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white shadow-lg'
      } transition-all duration-300 ${isHovered ? 'shadow-2xl scale-[1.02]' : ''}`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount && product.discount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full"
          >
            -{product.discount}%
          </motion.span>
        )}
        {product.isNew && (
          <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
            NEW
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <Award size={10} /> BEST
          </span>
        )}
      </div>

      {/* Quick Actions */}
      <div className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleWishlist(product)}
          className={`p-2 rounded-full shadow-lg transition-colors ${
            isInWishlist
              ? 'bg-red-500 text-white'
              : isDark ? 'bg-gray-700 text-white hover:bg-red-500' : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={18} className={isInWishlist ? 'fill-current' : ''} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onQuickView(product)}
          className={`p-2 rounded-full shadow-lg ${
            isDark ? 'bg-gray-700 text-white hover:bg-blue-500' : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
          }`}
        >
          <Eye size={18} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleCompare(product)}
          className={`p-2 rounded-full shadow-lg transition-colors ${
            isInCompare
              ? 'bg-purple-500 text-white'
              : isDark ? 'bg-gray-700 text-white hover:bg-purple-500' : 'bg-white text-gray-700 hover:bg-purple-500 hover:text-white'
          }`}
        >
          <RefreshCw size={18} />
        </motion.button>
      </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleImageSearch(product)}
          className={`p-2 rounded-full shadow-lg transition-colors ${isDark ? 'bg-gray-700 text-white hover:bg-green-500' : 'bg-white text-gray-700 hover:bg-green-500 hover:text-white'}`}
          aria-label="Search product images"
        >
          <Search size={18} />
        </motion.button>

      {/* Image */}
  <div className="relative h-56 overflow-hidden">
        {/* Use product image if available (demo products reference local assets under /cars/Products) */}
        <motion.img
          src={getPrimaryProductImage(product)}
          alt={product.name_en}
          className="w-full h-full object-contain bg-[#0b0b0b]"
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 0.4 }}
          onError={handleProductImageError}
          loading="lazy"
          decoding="async"
        />
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4"
        >
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickView(product)}
            className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-full shadow-lg"
          >
            Quick View
          </motion.button>
        </motion.div>

        {/* Stock Indicator */}
        {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className={`text-xs font-medium mb-1 ${isDark ? 'text-white' : 'text-white'}`}>
              Only {product.stock_quantity} left!
            </div>
            <div className="h-1.5 bg-gray-300/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockPercentage}%` }}
                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {product.category}
          </span>
          {product.brand && (
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.brand}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {product.name_en}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="mb-2">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>
        )}

        {/* Compatibility */}
        {product.compatibility && product.compatibility.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.compatibility.slice(0, 2).map((comp: string, i: number) => (
              <span
                key={i}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}
              >
                {comp}
              </span>
            ))}
            {product.compatibility.length > 2 && (
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                +{product.compatibility.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(finalPrice)}
          </span>
          {product.discount && product.discount > 0 && (
            <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center rounded-lg overflow-hidden ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className={`p-2 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className={`px-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
              className={`p-2 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(product)}
            disabled={product.stock_quantity === 0}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              product.stock_quantity === 0
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            <ShoppingCart size={16} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Quick View Modal Component
const QuickViewModal: React.FC<{
  product: AccessoryProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onAddToCart: (product: AccessoryProduct, quantity: number) => void;
  onToggleWishlist: (product: AccessoryProduct) => void;
  isInWishlist: boolean;
}> = ({ product, isOpen, onClose, isDark, onAddToCart, onToggleWishlist, isInWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  if (!product) return null;

  const finalPrice = product.discount ? calculateDiscount(product.price, product.discount) : product.price;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label="Close quick view"
            >
              <X size={20} className={isDark ? 'text-white' : 'text-gray-900'} />
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={getPrimaryProductImage(product)}
                    alt={product.name_en}
                    className="w-full h-80 object-cover"
                    onError={handleProductImageError}
                    loading="lazy"
                    width={600}
                    height={320}
                    decoding="async"
                  />
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full">
                      -{product.discount}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                {/* Category & Brand */}
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      by {product.brand}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {product.name_en}
                </h2>

                {/* Rating */}
                {product.rating && (
                  <StarRating rating={product.rating} reviews={product.reviews} size={18} />
                )}

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(finalPrice)}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <span className={`text-xl line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.stock_quantity > 0 ? (
                    <>
                      <Check className="text-green-500" size={18} />
                      <span className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        In Stock ({product.stock_quantity} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="text-red-500" size={18} />
                      <span className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        Out of Stock
                      </span>
                    </>
                  )}
                </div>

                {/* Compatibility */}
                {product.compatibility && product.compatibility.length > 0 && (
                  <div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Compatible with:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.compatibility.map((comp: string, i: number) => (
                        <span
                          key={i}
                          className={`text-sm px-2 py-1 rounded ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div className={`flex gap-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  {(['description', 'specs', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {activeTab === 'description' && (
                    <p>{product.description_en}</p>
                  )}
                  {activeTab === 'specs' && (
                    <ul className="space-y-2">
                      <li>• Category: {product.category}</li>
                      <li>• Brand: {product.brand || 'N/A'}</li>
                      <li>• Stock: {product.stock_quantity} units</li>
                    </ul>
                  )}
                  {activeTab === 'reviews' && (
                    <p>No reviews yet. Be the first to review!</p>
                  )}
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <div className={`flex items-center rounded-xl overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`p-3 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className={`px-4 text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className={`p-3 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.stock_quantity === 0}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      product.stock_quantity === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3 rounded-xl ${
                      isInWishlist
                        ? 'bg-red-500 text-white'
                        : isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                  </motion.button>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Truck size={16} />
                    <span>Free Shipping</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Shield size={16} />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <RefreshCw size={16} />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Compare Panel Component
const ComparePanel: React.FC<{
  items: CompareItem[];
  isDark: boolean;
  onRemove: (productId: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ items, isDark, onRemove, onClear, isOpen, onToggle }) => {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      <div
        onClick={onToggle}
        className={`flex items-center justify-between p-4 cursor-pointer ${
          isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="text-purple-500" size={20} />
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Compare ({items.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className={`text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Clear all
          </button>
          {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <img
                    src={getPrimaryProductImage(item.product)}
                    alt={item.product.name_en}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={handleProductImageError}
                    loading="lazy"
                    width={48}
                    height={48}
                    decoding="async"
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.product.name_en}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    aria-label={`Remove ${item.product.name_en} from comparison`}
                  >
                    <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                </div>
              ))}
              
              {items.length >= 2 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl"
                >
                  Compare Now
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Floating Cart Bar Component
const FloatingCartBar: React.FC<{
  items: CartItem[];
  isDark: boolean;
  onOpenCart: () => void;
  onClearCart: () => void;
}> = ({ items, isDark, onOpenCart, onClearCart }) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.discount
      ? calculateDiscount(item.product.price, item.product.discount)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white shadow-2xl'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className={`${isDark ? 'text-white' : 'text-gray-900'}`} size={28} />
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {totalItems} items in cart
              </p>
              <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearCart}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <Trash2 size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl flex items-center gap-2"
            >
              View Cart
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Side Cart Drawer Component
const SideCartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  isDark: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout?: () => void;
  isSubmitting?: boolean;
}> = ({ isOpen, onClose, items, isDark, onUpdateQuantity, onRemoveItem, onCheckout, isSubmitting = false }) => {
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.discount
      ? calculateDiscount(item.product.price, item.product.discount)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md z-50 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Shopping Cart ({items.length})
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={24} className={isDark ? 'text-white' : 'text-gray-900'} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => {
                  const finalPrice = item.product.discount
                    ? calculateDiscount(item.product.price, item.product.discount)
                    : item.product.price;
                  
                  return (
                    <motion.div
                      key={item.product.id}
                      layout
                      className={`flex gap-4 p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <img
                        src={getPrimaryProductImage(item.product)}
                        alt={item.product.name_en}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={handleProductImageError}
                        loading="lazy"
                        width={80}
                        height={80}
                        decoding="async"
                      />
                      <div className="flex-1">
                        <h3 className={`font-medium line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.product.name_en}
                        </h3>
                        <p className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(finalPrice)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className={`flex items-center rounded-lg overflow-hidden ${
                            isDark ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1.5"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className={isDark ? 'text-red-400' : 'text-red-500'}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total</span>
                  <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckoutModal: React.FC<{
  isOpen: boolean;
  isDark: boolean;
  formData: CheckoutFormData;
  error: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
  onSubmit: () => void;
}> = ({ isOpen, isDark, formData, error, isSubmitting, onClose, onChange, onSubmit }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-[61] m-auto flex w-[calc(100vw-1rem)] max-w-xl max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl shadow-2xl sm:w-[92vw] sm:max-h-[92vh] ${
              isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Checkout Details</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} disabled:opacity-50`}
                aria-label="Close checkout form"
              >
                <X size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-1 sm:gap-y-1.5">
              <div className="sm:col-span-2 space-y-0">
                <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Full Name</label>
                <input
                  value={formData.customer_name}
                  onChange={(e) => onChange('customer_name', e.target.value)}
                  className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-0">
                <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Mobile</label>
                <input
                  value={formData.mobile}
                  onChange={(e) => onChange('mobile', e.target.value)}
                  className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="space-y-0">
                <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>District</label>
                <input
                  value={formData.district}
                  onChange={(e) => onChange('district', e.target.value)}
                  className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Dhaka"
                />
              </div>

              <div className="sm:col-span-2 space-y-0">
                <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Thana</label>
                <input
                  value={formData.thana}
                  onChange={(e) => onChange('thana', e.target.value)}
                  className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Mirpur"
                />
              </div>

              <div className="sm:col-span-2 space-y-0">
                <label className={`block text-xs font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  className={`w-full px-3 py-1 rounded-lg border text-sm leading-tight ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="House, road, area"
                />
              </div>

              {error && (
                <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className={`sticky bottom-0 flex flex-col-reverse gap-3 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-end sm:px-6 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'} disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold disabled:opacity-70 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSubmitting ? 'Redirecting...' : 'Confirm & Pay'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main AccessoriesPage Component
function AccessoriesPage() {
  // ...state declarations...
  const { theme } = useTheme();
  const { language: _language } = useLanguage();
  const isDark = theme === 'dark';

  // State
  const [products, setProducts] = useState<AccessoryProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Controlled input separate from the applied search term. Search runs when user clicks Search or presses Enter.
  const [searchInput, setSearchInput] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Cart, Wishlist, Compare
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [showComparePanel, setShowComparePanel] = useState(true);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormData>({
    customer_name: '',
    mobile: '',
    address: '',
    thana: '',
    district: '',
  });

  // Filtered products (restored from previous UI)
  const filteredProducts = useMemo(() => {
    let result = products;
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    // Search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.trim().toLowerCase();
      result = result.filter(p => {
        const name = p.name_en?.toLowerCase() || '';
        const desc = p.description_en?.toLowerCase() || '';
        const sku = p.sku?.toLowerCase() || '';
        const tags = (p.compatibility || []).join(' ').toLowerCase();
        return (
          name.includes(searchLower) ||
          desc.includes(searchLower) ||
          sku.includes(searchLower) ||
          tags.includes(searchLower)
        );
      });
    }
    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
    }
    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    // Rating filter
    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }
    // Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0);
    }
    // Sort
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
    return result;
  }, [products, selectedCategory, searchTerm, selectedBrands, priceRange, minRating, inStockOnly, sortBy]);

  // Search handler (restored from previous UI)
  const applySearch = useCallback(() => {
    setSearchTerm(searchInput.trim());
  }, [searchInput]);

  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<AccessoryProduct | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<AccessoryProduct[]>([]);

  // Fetch products from Supabase
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*, images:product_images(*)')
          .eq('is_available', true);

        if (data && data.length > 0) {
          // Deduplicate products by id
          const uniqueMap = new Map<string, AccessoryProduct>();
          // Add database products, enriching with demo images if needed
          (data as AccessoryProduct[]).forEach((p) => {
            const forcedOverride = getForcedProductOverrideByName(p.name_en || '');
            if (forcedOverride) {
              uniqueMap.set(p.id, {
                ...p,
                ...(forcedOverride.nameEn ? { name_en: forcedOverride.nameEn } : {}),
                ...(typeof forcedOverride.price === 'number' ? { price: forcedOverride.price } : {}),
                ...(typeof forcedOverride.discount === 'number' ? { discount: forcedOverride.discount } : {}),
                ...(forcedOverride.imageUrl ? { images: [{ image_url: forcedOverride.imageUrl }] } : {}),
              } as AccessoryProduct);
              return;
            }
            const hasImages = Array.isArray((p as any).images) && (p as any).images.length > 0;
            if (!hasImages) {
              // Try to find demo product images by id or name
              const demo = demoProductsWithP2.find(dp => dp.id === p.id || dp.name_en === p.name_en);
              if (demo && demo.images && demo.images.length > 0) {
                uniqueMap.set(p.id, { ...p, images: demo.images } as AccessoryProduct);
                return;
              }
            }
            uniqueMap.set(p.id, p);
          });
          // Convert back to array and apply extra name-based dedupe safety
          const uniqueProducts = dedupeProducts(Array.from(uniqueMap.values()));
          setProducts(uniqueProducts);
          console.log('✅ Loaded from database:', uniqueProducts.length, 'unique products');
        } else {
          // Database is empty, use demo products as fallback
          const fallbackProducts = dedupeProducts(demoProductsWithP2);
          setProducts(fallbackProducts);
          console.log('⚠️ Database empty, using demo products:', fallbackProducts.length, 'products');
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        // Fallback to demo products on error
        setProducts(dedupeProducts(demoProductsWithP2));
      }
    };
    fetchProducts();
    // No return value here
  }, []);

  // Cart functions
  const addToCart = useCallback((product: AccessoryProduct, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Checkout handler - open modern checkout form modal
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    setCheckoutError(null);
    setShowCheckoutModal(true);
  }, [cart]);

  const updateCheckoutField = useCallback((field: keyof CheckoutFormData, value: string) => {
    setCheckoutForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const confirmAndInitiatePayment = useCallback(async () => {
    if (isSubmittingCheckout) return;

    const requiredFields: Array<keyof CheckoutFormData> = [
      'customer_name',
      'mobile',
      'address',
      'thana',
      'district',
    ];

    const missing = requiredFields.find((field) => !checkoutForm[field]?.trim());
    if (missing) {
      setCheckoutError('Please complete all checkout fields before continuing.');
      return;
    }

    try {
      setIsSubmittingCheckout(true);
      setCheckoutError(null);

      const normalizedCart = cart.map((item) => {
        const finalPrice = item.product.discount
          ? calculateDiscount(item.product.price, item.product.discount)
          : item.product.price;

        return {
          id: item.product.id,
          name: item.product.name_en,
          price: finalPrice,
          quantity: item.quantity,
        };
      });

      const totalAmount = normalizedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { redirectUrl } = await appwritePaymentApi.initiatePayment({
        customer_name: checkoutForm.customer_name.trim(),
        mobile: checkoutForm.mobile.trim(),
        address: checkoutForm.address.trim(),
        thana: checkoutForm.thana.trim(),
        district: checkoutForm.district.trim(),
        total_amount: totalAmount,
        cart_items: JSON.stringify(normalizedCart),
        cart: normalizedCart,
      });

      window.location.href = redirectUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start payment. Please try again.';
      setCheckoutError(message);
      setIsSubmittingCheckout(false);
    }
  }, [cart, checkoutForm, isSubmittingCheckout]);

  // Wishlist functions
  const toggleWishlist = useCallback((product: AccessoryProduct) => {
    setWishlist(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.filter(item => item.product.id !== product.id);
      }
      return [...prev, { id: product.id, product, addedAt: new Date() }];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  }, [wishlist]);

  // Compare functions
  const toggleCompare = useCallback((product: AccessoryProduct) => {
    setCompareItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.filter(item => item.product.id !== product.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, { product }];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  const isInCompare = useCallback((productId: string) => {
    return compareItems.some(item => item.product.id === productId);
  }, [compareItems]);

  // Quick View functions
  const openQuickView = useCallback((product: AccessoryProduct) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  }, []);

  // Active filters
  const activeFilters = useMemo(() => {
    const filters: { label: string; onRemove: () => void }[] = [];
    
    if (selectedCategory !== 'all') {
      filters.push({
        label: selectedCategory,
        onRemove: () => setSelectedCategory('all')
      });
    }
    
    selectedBrands.forEach(brand => {
      filters.push({
        label: brand,
        onRemove: () => setSelectedBrands(prev => prev.filter(b => b !== brand))
      });
    });
    
    if (minRating > 0) {
      filters.push({
        label: `${minRating}+ Stars`,
        onRemove: () => setMinRating(0)
      });
    }
    
    if (inStockOnly) {
      filters.push({
        label: 'In Stock',
        onRemove: () => setInStockOnly(false)
      });
    }

    return filters;
  }, [selectedCategory, selectedBrands, minRating, inStockOnly]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setMinRating(0);
    setInStockOnly(false);
    setSearchTerm('');
  }, []);

  // Premium floating element data for realistic car service components
  const serviceComponents = useMemo(() => [
    { id: 'oil-bottle-1', type: 'oil', brand: 'Mobil 1', grade: '0W-20', color: 'from-red-500 to-red-700', x: 8, y: 18, size: 80, delay: 0 },
    { id: 'oil-bottle-2', type: 'oil', brand: 'Castrol', grade: '10W-40', color: 'from-green-500 to-green-700', x: 85, y: 22, size: 75, delay: 0.5 },
    { id: 'oil-bottle-3', type: 'oil', brand: 'Shell', grade: '5W-30', color: 'from-yellow-500 to-yellow-600', x: 75, y: 65, size: 70, delay: 1 },
    { id: 'battery', type: 'battery', brand: 'Hybrid', voltage: '12V', color: 'from-blue-500 to-blue-700', x: 90, y: 45, size: 85, delay: 0.3 },
    { id: 'brake-disc', type: 'brake', brand: 'Brembo', color: 'from-gray-400 to-gray-600', x: 5, y: 55, size: 100, delay: 0.7 },
    { id: 'filter', type: 'filter', brand: 'K&N', color: 'from-orange-500 to-red-600', x: 18, y: 75, size: 65, delay: 1.2 },
    { id: 'spark-plug', type: 'spark', brand: 'NGK', color: 'from-gray-300 to-gray-500', x: 70, y: 12, size: 55, delay: 0.8 },
    { id: 'coolant', type: 'coolant', brand: 'Prestone', color: 'from-cyan-400 to-blue-500', x: 35, y: 8, size: 60, delay: 1.5 },
  ], []);

  return (
    <div className={`min-h-screen pt-16 sm:pt-20 ${isDark ? 'bg-transparent' : 'bg-gray-50'}`}>
      {/* Ultra Premium Hero Section */}
      <section className={`relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden ${
        isDark 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black' 
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-white to-gray-50'
      }`}>
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'}`}
            style={{
              backgroundImage: `linear-gradient(${isDark ? 'rgba(251,191,36,0.1)' : 'rgba(251,191,36,0.2)'} 1px, transparent 1px),
                               linear-gradient(90deg, ${isDark ? 'rgba(251,191,36,0.1)' : 'rgba(251,191,36,0.2)'} 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isDark 
                ? [
                    'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(251,191,36,0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 80%, rgba(251,191,36,0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.15) 0%, transparent 50%)',
                  ]
                : [
                    'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(251,191,36,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 80%, rgba(251,191,36,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.1) 0%, transparent 50%)',
                  ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Realistic 3D-style Car Service Components */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* REALISTIC OIL BOTTLES */}
          {serviceComponents.filter(c => c.type === 'oil').map((comp) => (
            <motion.div
              key={comp.id}
              className="absolute"
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              initial={{ opacity: 0, y: 50, rotateY: -30 }}
              animate={{ 
                opacity: 1, 
                y: [0, -15, 0],
                rotateY: [-5, 5, -5],
                rotateZ: [-2, 2, -2],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: comp.delay },
                y: { duration: 4 + comp.delay, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {/* Oil Bottle 3D Effect */}
              <div className="relative" style={{ perspective: '1000px' }}>
                <div 
                  className={`relative bg-gradient-to-b ${comp.color} rounded-lg shadow-2xl transform hover:scale-110 transition-transform duration-500`}
                  style={{ 
                    width: comp.size * 0.5, 
                    height: comp.size,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Bottle Cap */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-lg`} />
                  {/* Bottle Neck */}
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-b ${comp.color} rounded-sm`} />
                  {/* Label */}
                  <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[90%] h-[50%] ${isDark ? 'bg-white/90' : 'bg-white'} rounded-sm flex flex-col items-center justify-center p-1`}>
                    <span className="text-[8px] font-black text-gray-800 leading-none">{comp.brand}</span>
                    <span className="text-[10px] font-bold text-red-600 mt-0.5">{comp.grade}</span>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent rounded-lg" />
                  {/* Shadow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-2 bg-black/20 rounded-full blur-sm" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* REALISTIC HYBRID BATTERY */}
          {serviceComponents.filter(c => c.type === 'battery').map((comp) => (
            <motion.div
              key={comp.id}
              className="absolute"
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1,
                scale: [1, 1.03, 1],
                y: [0, -8, 0],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: comp.delay },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="relative" style={{ perspective: '1000px' }}>
                <div 
                  className={`relative bg-gradient-to-b ${comp.color} rounded-md shadow-2xl`}
                  style={{ width: comp.size, height: comp.size * 0.6 }}
                >
                  {/* Battery terminals */}
                  <div className="absolute -top-2 left-[20%] w-3 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-sm">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-red-500">+</span>
                  </div>
                  <div className="absolute -top-2 right-[20%] w-3 h-3 bg-gradient-to-b from-gray-700 to-black rounded-sm">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500">-</span>
                  </div>
                  {/* Battery label */}
                  <div className={`absolute inset-2 ${isDark ? 'bg-gray-900/80' : 'bg-white/90'} rounded flex flex-col items-center justify-center`}>
                    <span className={`text-[9px] font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>HYBRID</span>
                    <span className={`text-[7px] font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Li-Ion {comp.voltage}</span>
                    {/* Power indicator */}
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-3 bg-green-500 rounded-sm"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-md" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* REALISTIC BRAKE DISC */}
          {serviceComponents.filter(c => c.type === 'brake').map((comp) => (
            <motion.div
              key={comp.id}
              className="absolute"
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ 
                opacity: 1,
                rotate: 360,
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: comp.delay },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
            >
              <div className="relative" style={{ width: comp.size, height: comp.size }}>
                {/* Outer ring */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${comp.color} shadow-2xl`}>
                  {/* Ventilation holes */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-6 bg-gray-800/80 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${comp.size * 0.3}px)`,
                      }}
                    />
                  ))}
                  {/* Inner disc */}
                  <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-gray-700 to-gray-900">
                    {/* Center hub */}
                    <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                      <span className={`text-[6px] font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>BREMBO</span>
                    </div>
                    {/* Bolt holes */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateY(-12px)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* Brake caliper */}
                <motion.div 
                  className="absolute top-0 right-[10%] w-6 h-10 bg-gradient-to-b from-red-500 to-red-700 rounded-md shadow-lg"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[5px] font-bold text-white rotate-90">BRAKE</span>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* REALISTIC AIR FILTER */}
          {serviceComponents.filter(c => c.type === 'filter').map((comp) => (
            <motion.div
              key={comp.id}
              className="absolute"
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1,
                y: [0, -10, 0],
                rotateX: [0, 5, 0],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: comp.delay },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div 
                className={`relative rounded-full bg-gradient-to-b ${comp.color} shadow-xl`}
                style={{ width: comp.size, height: comp.size * 0.4 }}
              >
                {/* Filter pleats */}
                <div className="absolute inset-1 rounded-full overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-full w-1 bg-gradient-to-b from-red-300 to-red-600"
                      style={{ left: `${8 + i * 7.5}%` }}
                    />
                  ))}
                </div>
                {/* Center ring */}
                <div className="absolute inset-[35%] rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-[6px] font-bold text-red-500">K&N</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* REALISTIC SPARK PLUG */}
          {serviceComponents.filter(c => c.type === 'spark').map((comp) => (
            <motion.div
              key={comp.id}
              className="absolute"
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                y: [0, -12, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: comp.delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="relative" style={{ width: comp.size * 0.3, height: comp.size }}>
                {/* Ceramic insulator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-gradient-to-b from-white to-gray-200 rounded-t-lg shadow-lg">
                  <span className="absolute top-1/3 left-1/2 -translate-x-1/2 text-[6px] font-bold text-gray-600">NGK</span>
                </div>
                {/* Metal hex nut */}
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[120%] h-[15%] bg-gradient-to-b from-gray-400 to-gray-600" 
                  style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
                />
                {/* Metal shell */}
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[25%] bg-gradient-to-b from-gray-500 to-gray-700 rounded-b-sm" />
                {/* Electrode */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[12%] bg-gradient-to-b from-gray-600 to-gray-800" />
                {/* Spark effect */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Zap size={12} className="text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* REALISTIC COOLANT BOTTLE */}
          {serviceComponents.filter(c => c.type === 'coolant').map((comp) => (
            <motion.div
              key={comp.id}
              className="absolute"
              style={{ left: `${comp.x}%`, top: `${comp.y}%` }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                y: [0, -10, 0],
                rotateZ: [-3, 3, -3],
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: comp.delay },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div 
                className="relative bg-gradient-to-b from-cyan-300/80 to-blue-500/80 rounded-lg shadow-xl backdrop-blur-sm"
                style={{ width: comp.size * 0.5, height: comp.size }}
              >
                {/* Cap */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-3 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-md" />
                {/* Label */}
                <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 w-[85%] h-[40%] ${isDark ? 'bg-white/90' : 'bg-white'} rounded-sm flex flex-col items-center justify-center`}>
                  <span className="text-[6px] font-black text-cyan-700">PRESTONE</span>
                  <span className="text-[5px] font-bold text-blue-600">COOLANT</span>
                  <span className="text-[4px] text-gray-600">-37°C</span>
                </div>
                {/* Liquid level indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[25%] bg-gradient-to-t from-cyan-400 to-cyan-200 rounded-sm overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-cyan-500/50 to-transparent"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent rounded-lg" />
              </div>
            </motion.div>
          ))}

          {/* Floating particles effect */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className={`absolute w-1 h-1 rounded-full ${
                isDark ? 'bg-amber-400/40' : 'bg-amber-500/30'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            }`}>
              <Droplet size={16} />
              Premium Motor Oils & Accessories
            </span>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Service Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                Car Right
              </span>
            </h1>

            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Premium motor oils, brake fluids, batteries & service parts. Mobil 1, Gulf, Castrol, Shell & more. Quality products for your vehicle.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className={`relative flex items-center rounded-2xl overflow-hidden shadow-xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Search className={`absolute left-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={22} />
                <input
                  ref={(el) => (searchInputRef.current = el)}
                  type="text"
                  placeholder="Search oils, parts, accessories..."
                  value={searchInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInput(value);
                    setSearchTerm(value);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applySearch(); } }}
                  className={`w-full pl-12 pr-4 py-4 text-lg outline-none ${
                    isDark ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'
                  }`} 
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (searchTerm && searchTerm === searchInput.trim()) {
                      setSearchInput('');
                      setSearchTerm('');
                      searchInputRef.current?.focus();
                    } else {
                      applySearch();
                    }
                  }}
                  className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold flex items-center gap-2"
                >
                  {searchTerm && searchTerm === searchInput.trim() ? (
                    <>
                      <X className="w-5 h-5" />
                      <span>Clear</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {popularTags.map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSearchInput(tag); setSearchTerm(tag); }}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400'
                        : 'bg-white/80 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats - Hide during search */}
      {!searchTerm && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { icon: Package, value: '500+', label: 'Products' },
            { icon: Award, value: '50+', label: 'Brands' },
            { icon: Truck, value: 'Free', label: 'Shipping' },
            { icon: Shield, value: '1 Year', label: 'Warranty' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`p-4 rounded-2xl ${isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm shadow-lg'}`}
            >
              <stat.icon className={`mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={28} />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}
        </div>
      </section>

      {/* Flash Sale Banner - Hide during search */}
      {!searchTerm && (
        <section className={`py-6 ${isDark ? 'bg-gradient-to-r from-red-900/50 to-orange-900/50' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Zap className="text-yellow-300" size={32} />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-xl">Flash Sale!</h3>
                <p className="text-white/80 text-sm">Up to 30% off on selected items</p>
              </div>
            </div>
            <CountdownTimer endDate={flashSaleEnd} isDark={isDark} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl shadow-lg"
            >
              Shop Now
            </motion.button>
          </div>
        </div>
      </section>
      )}

      {/* Category Showcase - Hide during search to focus on results */}
      {!searchTerm && (
        <section className={`py-12 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryData.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-6 rounded-2xl text-center transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${cat.color} text-white shadow-xl`
                      : isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={32} className="mx-auto mb-3" />
                  <span className="font-medium text-sm">{cat.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className={`sticky top-24 p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Filters
                  </h3>
                  <button
                    onClick={clearAllFilters}
                    className={`text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  >
                    Clear All
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Price Range
                  </h4>
                  <PriceRangeSlider
                    min={0}
                    max={50000}
                    value={priceRange}
                    onChange={setPriceRange}
                    isDark={isDark}
                  />
                </div>

                {/* Brands */}
                <div className="mb-6">
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Brands
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                          selectedBrands.includes(brand)
                            ? isDark ? 'bg-purple-500/20' : 'bg-purple-50'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => {
                            setSelectedBrands(prev =>
                              prev.includes(brand)
                                ? prev.filter(b => b !== brand)
                                : [...prev, brand]
                            );
                          }}
                          className="w-4 h-4 rounded text-purple-600"
                        />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h4 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Minimum Rating
                  </h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                        className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                          minRating === rating
                            ? isDark ? 'bg-purple-500/20' : 'bg-purple-50'
                            : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <StarRating rating={rating} />
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          & up
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock Only */}
                <div className="mb-6">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      In Stock Only
                    </span>
                    <div
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        inStockOnly ? 'bg-purple-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: inStockOnly ? 24 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl ${
                isDark ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg ${
                      isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Filter size={18} />
                    Filters
                  </button>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {filteredProducts.length} products found
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>

                  {/* View Mode */}
                  <div className={`flex rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : ''}`}
                      aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : ''}`}
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeFilters.map((filter, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {filter.label}
                      <button onClick={filter.onRemove} aria-label={`Remove ${filter.label} filter`}>
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <Package size={64} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    No products found
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isDark={isDark}
                      onQuickView={openQuickView}
                      onAddToCart={(p) => addToCart(p, 1)}
                      onToggleWishlist={toggleWishlist}
                      onToggleCompare={toggleCompare}
                      isInWishlist={isInWishlist(product.id)}
                      isInCompare={isInCompare(product.id)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed - Hide when search is active */}
      {recentlyViewed.length > 0 && !searchTerm && (
        <section className={`py-12 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recently Viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recentlyViewed.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  onClick={() => openQuickView(product)}
                  className={`flex-shrink-0 w-48 p-4 rounded-xl cursor-pointer ${
                    isDark ? 'bg-gray-800' : 'bg-white shadow'
                  }`}
                >
                  <img
                    src={getPrimaryProductImage(product)}
                    alt={product.name_en}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={handleProductImageError}
                    loading="lazy"
                    width={192}
                    height={128}
                    decoding="async"
                  />
                  <h3 className={`font-medium text-sm line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {product.name_en}
                  </h3>
                  <p className={`text-sm font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {formatPrice(product.price)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        isDark={isDark}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isInWishlist={quickViewProduct ? isInWishlist(quickViewProduct.id) : false}
      />

      {/* Compare Panel */}
      <ComparePanel
        items={compareItems}
        isDark={isDark}
        onRemove={removeFromCompare}
        onClear={clearCompare}
        isOpen={showComparePanel}
        onToggle={() => setShowComparePanel(!showComparePanel)}
      />

      {/* Floating Cart Bar */}
      <FloatingCartBar
        items={cart}
        isDark={isDark}
        onOpenCart={() => setShowCartDrawer(true)}
        onClearCart={clearCart}
      />

      {/* Side Cart Drawer */}
      <SideCartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        items={cart}
        isDark={isDark}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        isSubmitting={isSubmittingCheckout}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        isDark={isDark}
        formData={checkoutForm}
        error={checkoutError}
        isSubmitting={isSubmittingCheckout}
        onClose={() => {
          if (!isSubmittingCheckout) setShowCheckoutModal(false);
        }}
        onChange={updateCheckoutField}
        onSubmit={confirmAndInitiatePayment}
      />

      {/* Bottom Padding for Cart Bar */}

      {cart.length > 0 && <div className="h-24" />}
    </div>
  );
}
export default AccessoriesPage;
