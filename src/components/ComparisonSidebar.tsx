import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import usePrefetchOnHover from '../hooks/usePrefetchOnHover';
import { useState } from 'react';

interface ComparisonVehicle {
  id: string;
  name: string;
  price: string;
  engine: string;
  fuel: string;
  transmission: string;
  horsepower?: number;
  efficiency?: number;
  safetyRating?: number;
}

interface ComparisonSidebarProps {
  vehicles: ComparisonVehicle[];
  theme: string;
  language: string;
  onRemove: (vehicleId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onExport?: () => void;
}

export const ComparisonSidebar = ({
  vehicles,
  theme,
  language,
  onRemove,
  isOpen,
  onToggle,
  onExport,
}: ComparisonSidebarProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (vehicles.length === 0) return null;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-40 px-3 py-6 rounded-l-lg shadow-lg ${
          theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold transition-all`}
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: 0 }}
        animate={{ x: isOpen ? 350 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {language === 'en' ? '⚖' : '⚖'}
        </motion.div>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />

            {/* Sidebar Panel */}
            <motion.div
              className={`fixed right-0 top-0 bottom-0 w-96 overflow-y-auto z-40 ${
                theme === 'dark'
                  ? 'bg-gray-900 border-l border-gray-700'
                  : 'bg-white border-l border-gray-200'
              }`}
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className={`sticky top-0 p-4 border-b ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {language === 'en' ? 'Compare Vehicles' : 'গাড়ি তুলনা করুন'}
                  </h3>
                  <motion.button
                    onClick={onToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {vehicles.length} {vehicles.length === 1 ? language === 'en' ? 'vehicle' : 'গাড়ি' : language === 'en' ? 'vehicles' : 'গাড়ি'}
                </p>
              </div>

              {/* Vehicle List */}
              <div className="p-4 space-y-3">
                {vehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      expandedIndex === index
                        ? theme === 'dark'
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-blue-50 border-blue-300'
                        : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    whileHover={{ y: -2 }}
                  >
                    {/* Vehicle Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicle.name}
                        </h4>
                        <p className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {vehicle.price}
                        </p>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(vehicle.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-red-600/20 text-red-500'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        <p className="font-semibold">{language === 'en' ? 'Engine' : 'ইঞ্জিন'}</p>
                        <p>{vehicle.engine}</p>
                      </div>
                      <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        <p className="font-semibold">{language === 'en' ? 'Transmission' : 'ট্রান্সমিশন'}</p>
                        <p>{vehicle.transmission}</p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2 text-xs"
                        >
                          {vehicle.horsepower && (
                            <div className="flex justify-between">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {language === 'en' ? 'Horsepower' : 'হর্সপাওয়ার'}
                              </span>
                              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {vehicle.horsepower} hp
                              </span>
                            </div>
                          )}
                          {vehicle.efficiency && (
                            <div className="flex justify-between">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {language === 'en' ? 'Mileage' : 'মাইলেজ'}
                              </span>
                              <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                {vehicle.efficiency} km/l
                              </span>
                            </div>
                          )}
                          {vehicle.safetyRating && (
                            <div className="flex justify-between">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {language === 'en' ? 'Safety' : 'সেফটি'}
                              </span>
                              <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                {'★'.repeat(vehicle.safetyRating)}
                              </span>
                            </div>
                          )}
                          <motion.a
                            href="#"
                            ref={usePrefetchOnHover(`/vehicle/${vehicle.id}`, `/api/vehicle/${vehicle.id}`) as any}
                            className={`flex items-center gap-1 mt-2 pt-2 border-t ${
                              theme === 'dark'
                                ? 'border-gray-600 text-blue-400 hover:text-blue-300'
                                : 'border-gray-300 text-blue-600 hover:text-blue-700'
                            }`}
                            whileHover={{ x: 5 }}
                          >
                            {language === 'en' ? 'View Details' : 'বিস্তারিত দেখুন'}
                            <ArrowRight className="w-3 h-3" />
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Export Button */}
              {vehicles.length > 0 && (
                <motion.div
                  className="sticky bottom-0 p-4 border-t"
                  style={{
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    backgroundColor: theme === 'dark' ? '#111827' : '#fff',
                  }}
                >
                  <motion.button
                    onClick={onExport}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Export Comparison' : 'তুলনা রপ্তানি করুন'}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
