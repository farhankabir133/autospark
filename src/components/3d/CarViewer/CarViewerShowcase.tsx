/**
 * CarViewerShowcase Component
 * 
 * A ready-to-use showcase section that combines the CarViewer
 * with vehicle selection and additional features.
 * 
 * Drop this directly into any page for a complete 3D experience.
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car, Sparkles, Eye, Fuel, Gauge, Settings } from 'lucide-react';
import { CarViewer } from './CarViewer';
import { VEHICLES } from './vehicleData';
import type { VehicleModelData } from './types';

interface CarViewerShowcaseProps {
  /** Title for the section */
  title?: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Initial vehicle ID to display */
  initialVehicleId?: string;
  /** Show vehicle selector dropdown */
  showVehicleSelector?: boolean;
  /** Show specs panel */
  showSpecs?: boolean;
  /** Custom className */
  className?: string;
  /** Theme */
  theme?: 'light' | 'dark';
  /** Language */
  language?: 'en' | 'bn';
}

export const CarViewerShowcase: React.FC<CarViewerShowcaseProps> = ({
  title,
  subtitle,
  initialVehicleId = 'toyota-harrier',
  showVehicleSelector = true,
  showSpecs = true,
  className = '',
  theme = 'light',
  language = 'en',
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Get current vehicle
  const selectedVehicle = useMemo(() => {
    return VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[0];
  }, [selectedVehicleId]);

  // Group vehicles by brand
  const vehiclesByBrand = useMemo(() => {
    const grouped: Record<string, VehicleModelData[]> = {};
    VEHICLES.forEach(v => {
      if (!grouped[v.brand]) {
        grouped[v.brand] = [];
      }
      grouped[v.brand].push(v);
    });
    return grouped;
  }, []);

  const isDark = theme === 'dark';

  // Translations
  const t = {
    title: language === 'en' ? 'Interactive 3D Showroom' : 'ইন্টারেক্টিভ 3D শোরুম',
    subtitle: language === 'en' 
      ? 'Experience our premium vehicles in stunning 3D. Rotate, zoom, and customize colors.' 
      : 'অত্যাশ্চর্য 3D তে আমাদের প্রিমিয়াম যানবাহন অনুভব করুন।',
    selectVehicle: language === 'en' ? 'Select Vehicle' : 'গাড়ি নির্বাচন করুন',
    specs: language === 'en' ? 'Specifications' : 'স্পেসিফিকেশন',
    engine: language === 'en' ? 'Engine' : 'ইঞ্জিন',
    power: language === 'en' ? 'Power' : 'শক্তি',
    transmission: language === 'en' ? 'Transmission' : 'ট্রান্সমিশন',
    fuel: language === 'en' ? 'Fuel' : 'জ্বালানি',
    viewDetails: language === 'en' ? 'View Full Details' : 'সম্পূর্ণ বিবরণ দেখুন',
  };

  return (
    <motion.section
      className={`
        py-16 relative overflow-hidden
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }
        ${className}
      `}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/40'}`} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-purple-900/20' : 'bg-purple-200/40'}`} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
            <span className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {language === 'en' ? '3D Experience' : '3D অভিজ্ঞতা'}
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title || t.title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {subtitle || t.subtitle}
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left sidebar - Vehicle selector */}
          {showVehicleSelector && (
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`
                rounded-2xl p-4
                ${isDark 
                  ? 'bg-gray-800/80 border border-gray-700' 
                  : 'bg-white/80 border border-gray-200'
                }
                backdrop-blur-sm shadow-xl
              `}>
                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.selectVehicle}
                </h3>
                
                {/* Vehicle list by brand */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(vehiclesByBrand).map(([brand, vehicles]) => (
                    <div key={brand}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {brand}
                      </p>
                      <div className="space-y-2">
                        {vehicles.map((vehicle) => (
                          <motion.button
                            key={vehicle.id}
                            onClick={() => {
                              setSelectedVehicleId(vehicle.id);
                              setSelectedColorIndex(0);
                            }}
                            className={`
                              w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all
                              ${selectedVehicleId === vehicle.id
                                ? isDark
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-500 text-white'
                                : isDark
                                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Car className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{vehicle.name}</p>
                              <p className={`text-xs ${selectedVehicleId === vehicle.id ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {vehicle.price}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Center - 3D Viewer */}
          <motion.div
            className={showVehicleSelector ? 'lg:col-span-2' : 'lg:col-span-3'}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CarViewer
              vehicleId={selectedVehicleId}
              showColorPicker={true}
              showSpecs={false} // We have external specs panel
              autoRotate={true}
              autoRotateSpeed={1}
              height="550px"
              lightingMode="studio"
              enableFullscreen={true}
              onColorChange={(_color, index) => setSelectedColorIndex(index)}
            />
          </motion.div>

          {/* Right sidebar - Specs */}
          {showSpecs && (
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className={`
                rounded-2xl p-5
                ${isDark 
                  ? 'bg-gray-800/80 border border-gray-700' 
                  : 'bg-white/80 border border-gray-200'
                }
                backdrop-blur-sm shadow-xl
              `}>
                {/* Vehicle name */}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedVehicle.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedVehicle.year} • {selectedVehicle.category}
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {selectedVehicle.price}
                  </p>
                </div>

                {/* Specs grid */}
                <div className="space-y-4">
                  <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.specs}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <Settings className={`w-4 h-4 mb-1 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.engine}</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedVehicle.specs.engine}
                      </p>
                    </div>
                    
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <Gauge className={`w-4 h-4 mb-1 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.power}</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedVehicle.specs.horsepower}
                      </p>
                    </div>
                    
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <Car className={`w-4 h-4 mb-1 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.transmission}</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedVehicle.specs.transmission}
                      </p>
                    </div>
                    
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <Fuel className={`w-4 h-4 mb-1 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.fuel}</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedVehicle.specs.fuelType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected color indicator */}
                <div className={`mt-6 p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    {language === 'en' ? 'Selected Color' : 'নির্বাচিত রঙ'}
                  </p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: selectedVehicle.colors[selectedColorIndex]?.hex || '#ffffff' }}
                    />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedVehicle.colors[selectedColorIndex]?.name || 'Default'}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`
                    w-full mt-6 py-3 px-4 rounded-xl font-semibold
                    flex items-center justify-center gap-2
                    ${isDark
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    }
                    shadow-lg transition-all
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4" />
                  {t.viewDetails}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick select chips - Mobile friendly */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {VEHICLES.slice(0, 6).map((vehicle) => (
            <motion.button
              key={vehicle.id}
              onClick={() => setSelectedVehicleId(vehicle.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedVehicleId === vehicle.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {vehicle.name}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CarViewerShowcase;
