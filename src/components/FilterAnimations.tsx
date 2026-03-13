import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  name: string;
  key: string;
  options: FilterOption[];
}

interface FilterAnimationsProps {
  filters: FilterCategory[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
  theme: string;
  language: string;
  resultCount?: number;
}

export const FilterAnimations = ({
  filters,
  onFilterChange,
  theme,
  language,
  resultCount = 0,
}: FilterAnimationsProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(true);

  const handleFilterToggle = (categoryKey: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const currentSelected = prev[categoryKey] || [];
      const isSelected = currentSelected.includes(optionId);

      const newFilters = {
        ...prev,
        [categoryKey]: isSelected
          ? currentSelected.filter((id) => id !== optionId)
          : [...currentSelected, optionId],
      };

      // Trigger fade out/in animation
      setShowResults(false);
      setTimeout(() => setShowResults(true), 300);

      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setShowResults(false);
    setTimeout(() => setShowResults(true), 300);
    onFilterChange?.({});
  };

  const selectedCount = Object.values(selectedFilters).reduce(
    (sum, items) => sum + items.length,
    0
  );

  const bgColor = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const pillBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const pillBgActive = theme === 'dark' ? 'bg-blue-600/80' : 'bg-blue-500/80';

  return (
    <motion.div
      className={`rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-sm p-6 mb-8`}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="space-y-6">
        {/* Header with result counter */}
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${textColor}`}>
            {language === 'en' ? 'Quick Filters' : 'দ্রুত ফিল্টার'}
          </h3>

          {/* Animated result counter */}
          <motion.div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={resultCount}
          >
            <span className={`text-sm font-bold ${textColor}`}>
              {resultCount}
            </span>
            <span className={`text-xs ${secondaryText}`}>
              {language === 'en' ? 'Results' : 'ফলাফল'}
            </span>
          </motion.div>
        </div>

        {/* Filter categories */}
        <div className="space-y-4">
          {filters.map((category) => (
            <div key={category.key} className="space-y-3">
              {/* Category label */}
              <motion.h4
                className={`text-sm font-semibold ${secondaryText}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                {category.name}
              </motion.h4>

              {/* Filter pills */}
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {category.options.map((option, idx) => {
                  const isSelected =
                    selectedFilters[category.key]?.includes(option.id) || false;

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleFilterToggle(category.key, option.id)}
                      className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all ${
                        isSelected
                          ? `${pillBgActive} text-white shadow-lg shadow-blue-500/30`
                          : `${pillBg} ${textColor} hover:${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: idx * 0.05,
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Animated background on selection */}
                      {isSelected && (
                        <motion.div
                          className={`absolute inset-0 rounded-full ${pillBgActive}`}
                          layoutId={`filter-${category.key}-${option.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Content */}
                      <span className="relative flex items-center gap-2 z-10">
                        {option.label}

                        {/* Animated checkmark */}
                        <AnimatePresence mode="wait">
                          {isSelected ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: -180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Selected filters summary with clear button */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              className={`pt-4 border-t ${borderColor}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <motion.p className={`text-sm ${secondaryText}`}>
                  {language === 'en'
                    ? `${selectedCount} filter${selectedCount !== 1 ? 's' : ''} applied`
                    : `${selectedCount} ফিল্টার প্রয়োগ করা হয়েছে`}
                </motion.p>

                <motion.button
                  onClick={handleClearAll}
                  className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  } hover:opacity-80 transition-opacity flex items-center gap-1`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === 'en' ? 'Clear All' : 'সব মুছুন'}
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated results transition */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className={`mt-6 pt-6 border-t ${borderColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              className={`text-sm ${secondaryText}`}
              key={resultCount}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {language === 'en'
                ? `Showing ${resultCount} vehicle${resultCount !== 1 ? 's' : ''}`
                : `${resultCount} গাড়ি দেখাচ্ছে`}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
