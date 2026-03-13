import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterPanelProps {
  filters: {
    vehicleType?: FilterOption[];
    fuelType?: FilterOption[];
    priceRange?: { min: number; max: number };
    transmission?: FilterOption[];
  };
  onFilterChange: (filters: any) => void;
  theme: string;
  language: string;
}

export const FilterPanel = ({
  filters,
  onFilterChange,
  theme,
  language,
}: FilterPanelProps) => {
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    vehicleType?: string[];
    fuelType?: string[];
    priceRange?: { min: number; max: number };
    transmission?: string[];
  }>({});

  const toggleExpand = (filterId: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleFilterSelect = (
    filterType: string,
    value: string,
    isChecked: boolean
  ) => {
    const newFilters = { ...activeFilters };
    const filterKey = filterType as keyof typeof newFilters;

    if (filterType !== 'priceRange') {
      if (isChecked) {
        if (!newFilters[filterKey]) {
          (newFilters as any)[filterKey] = [];
        }
        ((newFilters as any)[filterKey] as string[]).push(value);
      } else {
        if (newFilters[filterKey]) {
          ((newFilters as any)[filterKey] as string[]) = (
            (newFilters as any)[filterKey] as string[]
          ).filter((v: string) => v !== value);
        }
      }
    }

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => Array.isArray(v) ? v.length > 0 : v
  );

  return (
    <motion.div
      className={`${bgColor} border ${borderColor} rounded-lg p-4 space-y-4`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${textColor}`}>
          {language === 'en' ? 'Filters' : 'ফিল্টার'}
        </h3>
        {hasActiveFilters && (
          <motion.button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 rounded bg-red-500/20 text-red-500 text-sm hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={14} />
            {language === 'en' ? 'Clear' : 'পরিষ্কার'}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {filters.vehicleType && filters.vehicleType.length > 0 && (
          <FilterSection
            title={language === 'en' ? 'Vehicle Type' : 'গাড়ির ধরন'}
            sectionId="vehicleType"
            items={filters.vehicleType}
            expanded={expandedFilters.includes('vehicleType')}
            onToggle={() => toggleExpand('vehicleType')}
            onSelect={(value, checked) =>
              handleFilterSelect('vehicleType', value, checked)
            }
            selectedItems={activeFilters.vehicleType || []}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filters.fuelType && filters.fuelType.length > 0 && (
          <FilterSection
            title={language === 'en' ? 'Fuel Type' : 'জ্বালানীর ধরন'}
            sectionId="fuelType"
            items={filters.fuelType}
            expanded={expandedFilters.includes('fuelType')}
            onToggle={() => toggleExpand('fuelType')}
            onSelect={(value, checked) =>
              handleFilterSelect('fuelType', value, checked)
            }
            selectedItems={activeFilters.fuelType || []}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filters.transmission && filters.transmission.length > 0 && (
          <FilterSection
            title={language === 'en' ? 'Transmission' : 'ট্রান্সমিশন'}
            sectionId="transmission"
            items={filters.transmission}
            expanded={expandedFilters.includes('transmission')}
            onToggle={() => toggleExpand('transmission')}
            onSelect={(value, checked) =>
              handleFilterSelect('transmission', value, checked)
            }
            selectedItems={activeFilters.transmission || []}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface FilterSectionProps {
  title: string;
  sectionId: string;
  items: FilterOption[];
  expanded: boolean;
  onToggle: () => void;
  onSelect: (value: string, checked: boolean) => void;
  selectedItems: string[];
  theme: string;
}

const FilterSection = ({
  title,
  items,
  expanded,
  onToggle,
  onSelect,
  selectedItems,
  theme,
}: FilterSectionProps) => {
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <motion.div
      className={`border-t ${borderColor} pt-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${hoverBg} p-2 rounded transition-colors`}
      >
        <span className={`font-medium ${textColor}`}>{title}</span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className={secondaryText} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="space-y-2 mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {items.map((item, idx) => (
              <motion.label
                key={item.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${hoverBg} transition-colors`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.value)}
                  onChange={(e) => onSelect(item.value, e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
                <span className={`text-sm ${textColor}`}>{item.label}</span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
