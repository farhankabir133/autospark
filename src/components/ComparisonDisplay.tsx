import { motion } from 'framer-motion';
import { ChevronDown, Download, X } from 'lucide-react';
import { useState } from 'react';

interface ComparisonSpec {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface VehicleComparison {
  id: string;
  name: string;
  price: string;
  specs: Record<string, ComparisonSpec>;
}

interface ComparisonDisplayProps {
  vehicles: VehicleComparison[];
  theme: string;
  language: string;
  onRemove?: (vehicleId: string) => void;
  onExport?: () => void;
}

export const ComparisonDisplay = ({
  vehicles,
  theme,
  language,
  onRemove,
  onExport,
}: ComparisonDisplayProps) => {
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  if (vehicles.length === 0) {
    return null;
  }

  const bgColor = theme === 'dark'
    ? 'bg-gray-900 border-gray-800'
    : 'bg-white border-gray-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const highlightBg = theme === 'dark'
    ? 'bg-blue-500/20'
    : 'bg-blue-50';

  const toggleSpec = (specKey: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [specKey]: !prev[specKey],
    }));
  };

  // Get all unique spec keys
  const allSpecKeys = Array.from(
    new Set(vehicles.flatMap(v => Object.keys(v.specs)))
  );

  return (
    <motion.div
      className={`rounded-2xl border ${bgColor} p-6 overflow-x-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className={`text-2xl font-bold ${textColor}`}>
          {language === 'en' ? 'Comparison' : 'তুলনা'}
        </h3>
        <div className="flex gap-2">
          {onExport && (
            <motion.button
              onClick={onExport}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              {language === 'en' ? 'Export' : 'রপ্তানি'}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Vehicle Headers */}
      <div className="min-w-full">
        <div className="grid gap-4" style={{ gridTemplateColumns: `250px repeat(${vehicles.length}, 1fr)` }}>
          {/* Spec column header */}
          <div />

          {/* Vehicle cards */}
          {vehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              className={`rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className={`font-bold text-sm line-clamp-2 ${textColor}`}>
                    {vehicle.name}
                  </h4>
                  <p className={`text-lg font-bold mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {vehicle.price}
                  </p>
                </div>
                {onRemove && (
                  <motion.button
                    onClick={() => onRemove(vehicle.id)}
                    className={`p-1 rounded hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}

          {/* Specs rows */}
          {allSpecKeys.map((specKey, specIdx) => (
            <motion.div
              key={specKey}
              className={`contents`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + specIdx * 0.05 }}
            >
              {/* Spec label */}
              <motion.button
                onClick={() => toggleSpec(specKey)}
                className={`flex items-center justify-between py-3 px-4 rounded-lg border border-transparent hover:border ${
                  theme === 'dark'
                    ? 'hover:border-gray-700 hover:bg-gray-800'
                    : 'hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className={`font-semibold text-sm ${textColor}`}>
                  {specKey}
                </span>
                <ChevronDown
                  className={`w-4 h-4 ${secondaryText} transition-transform ${
                    expandedSpecs[specKey] ? 'rotate-180' : ''
                  }`}
                />
              </motion.button>

              {/* Spec values */}
              {vehicles.map((vehicle) => {
                const spec = vehicle.specs[specKey];
                const isBestValue = spec?.highlight;

                return (
                  <motion.div
                    key={`${vehicle.id}-${specKey}`}
                    className={`py-3 px-4 rounded-lg border border-transparent ${
                      isBestValue
                        ? `${highlightBg} border-blue-300 dark:border-blue-600`
                        : theme === 'dark'
                          ? 'bg-gray-800/50'
                          : 'bg-gray-50'
                    }`}
                    animate={
                      isBestValue
                        ? { boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 8px rgba(59, 130, 246, 0)'] }
                        : {}
                    }
                    transition={isBestValue ? { duration: 2, repeat: Infinity } : {}}
                  >
                    <p className={`text-sm font-semibold ${textColor}`}>
                      {spec?.value || 'N/A'}
                    </p>
                    {isBestValue && (
                      <motion.div
                        className="mt-1 text-xs text-blue-500 font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        ✓ {language === 'en' ? 'Best' : 'সেরা'}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
