import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveCarImage } from './ResponsiveCarImage';
import { VehicleSpecCardBack } from './VehicleSpecCardBack';

interface ShowcaseVehicle {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  engine: string;
  fuel: string;
  transmission: string;
  year: number;
  gradient: string;
  lightGradient: string;
  safetyRating: number;
  warrantyYears: number;
  mileage: string;
  emissions: string;
  horsepower: number;
  torque: string;
  efficiency: number;
  features: string[];
}

interface VehicleFlipCardProps {
  vehicle: ShowcaseVehicle;
  index: number;
  theme: string;
  language: string;
  isSelected: boolean;
  onSelect: () => void;
  flipTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  animate: boolean;
}

const VehicleFlipCardMotion = ({ vehicle, index, theme, language, isSelected, onSelect, flipTimeoutRef, animate }: VehicleFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={`relative h-32 cursor-pointer group ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
      style={{ perspective: '1000px' }}
      initial={animate ? { opacity: 0, x: 30 } : false}
      whileInView={animate ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={onSelect}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={isFlipped ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onHoverStart={() => {
          if (!animate) return;
          setIsFlipped(true);
          if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
          flipTimeoutRef.current = setTimeout(() => setIsFlipped(false), 3000);
        }}
        onHoverEnd={() => {
          if (!animate) return;
          if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
          flipTimeoutRef.current = setTimeout(() => setIsFlipped(false), 500);
        }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-xl p-4 flex items-center gap-4 bg-gradient-to-br ${
            theme === 'dark' ? vehicle.gradient : vehicle.lightGradient
          } shadow-lg`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
            <ResponsiveCarImage
              alt={vehicle.name}
              images={{ webp: vehicle.image.replace(/\.(jpg|jpeg|png)$/i, '.webp'), fallback: vehicle.image, width: 96, height: 80 }}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-white/90 text-gray-800 rounded">{vehicle.year}</span>
            {vehicle.fuel === 'Hybrid' && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-bold bg-green-500 text-white rounded">HYBRID</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">{vehicle.name}</h3>
            <p className="text-white/80 text-xs mt-0.5 truncate">{vehicle.subtitle}</p>
            <p className="text-white font-bold text-sm mt-2">{vehicle.price}</p>
          </div>
          {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />}
          {animate && (
            <div className="absolute bottom-2 right-2 text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              {language === 'en' ? 'Hover to see specs →' : 'স্পেক দেখতে হোভার করুন →'}
            </div>
          )}
        </div>
        {/* BACK */}
        <VehicleSpecCardBack vehicle={vehicle as any} theme={theme} />
      </motion.div>
    </motion.div>
  );
};

export default VehicleFlipCardMotion;
