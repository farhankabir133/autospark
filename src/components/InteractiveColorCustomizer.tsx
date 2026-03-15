import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef } from 'react';
import { X, Check } from 'lucide-react';

export interface VehicleColor {
  name: string;
  hex: string;
  rgb: string;
  filterClass: string;
}

interface InteractiveColorCustomizerProps {
  vehicleImage: string;
  vehicleModel: string;
  availableColors: VehicleColor[];
  theme: string;
  language: string;
  onColorSelect?: (color: VehicleColor) => void;
}

export const InteractiveColorCustomizer = ({
  vehicleImage,
  vehicleModel,
  availableColors,
  theme,
  language,
  onColorSelect,
}: InteractiveColorCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<VehicleColor | null>(
    availableColors[0] || null
  );
  const [imageFilter, setImageFilter] = useState('');
  const imageRef = useRef<HTMLDivElement>(null);

  const getColorFilter = (color: VehicleColor) => {
    // Use CSS filters to create color overlay effects
    const filterMap: Record<string, string> = {
      'Pearl White': 'brightness(1.1) saturate(0.8)',
      'Black Metallic': 'brightness(0.7) contrast(1.2)',
      'Steel Blue': 'hue-rotate(200deg) saturate(1.2)',
      'Crimson Red': 'hue-rotate(-30deg) saturate(1.3)',
      'Forest Green': 'hue-rotate(120deg) saturate(1.1)',
      'Gold': 'hue-rotate(40deg) saturate(1.4)',
      'Silver': 'brightness(1) saturate(0.5)',
      'Midnight Purple': 'hue-rotate(280deg) saturate(1.2)',
    };
    return filterMap[color.name] || 'saturate(1)';
  };

  const handleColorSelect = (color: VehicleColor) => {
    setSelectedColor(color);
    const filter = getColorFilter(color);
    setImageFilter(filter);
    onColorSelect?.(color);
    
    // Save to localStorage
    try {
      localStorage.setItem(`vehicle_color_${vehicleModel}`, JSON.stringify(color));
    } catch (e) {
      console.debug('Could not save color preference');
    }
  };

  // Load saved color on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`vehicle_color_${vehicleModel}`);
      if (saved) {
        const savedColor = JSON.parse(saved);
        const match = availableColors.find(c => c.name === savedColor.name);
        if (match) {
          handleColorSelect(match);
        }
      }
    } catch (e) {
      console.debug('Could not load saved color');
    }
  }, [vehicleModel, availableColors]);

  const bgColor = theme === 'dark'
    ? 'bg-gray-900'
    : 'bg-white';

  const borderColor = theme === 'dark'
    ? 'border-gray-800'
    : 'border-gray-200';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div
      className={`rounded-2xl ${bgColor} border ${borderColor} overflow-hidden shadow-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 h-80 overflow-hidden group">
        <motion.div
          ref={imageRef}
          className="relative w-full h-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={vehicleImage}
            alt={vehicleModel}
            className="w-full h-full object-cover"
            style={{
              filter: imageFilter,
            }}
            animate={{
              filter: imageFilter,
            }}
            transition={{ duration: 0.6 }}
          />

          {/* Click to customize overlay */}
          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center"
          >
            <motion.div
              className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {language === 'en' ? 'Click to customize color' : 'রঙ কাস্টমাইজ করতে ক্লিক করুন'}
            </motion.div>
          </motion.div>

          {/* Current color indicator */}
          <motion.div
            className="absolute bottom-4 left-4 flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-4 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: selectedColor?.hex }}
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {selectedColor?.name}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Color Swatches Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`border-t ${borderColor} p-6 space-y-4`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-lg font-bold ${textColor}`}>
                {language === 'en' ? 'Available Colors' : 'উপলব্ধ রঙ'}
              </h4>
              <motion.button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded hover:${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Color Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {availableColors.map((color, idx) => (
                <motion.button
                  key={color.name}
                  onClick={() => handleColorSelect(color)}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Color swatch */}
                  <motion.div
                    className={`w-full aspect-square rounded-xl border-2 ${
                      selectedColor?.name === color.name
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-300 dark:border-gray-700'
                    } transition-all duration-200`}
                    style={{ backgroundColor: color.hex }}
                    whileHover={{
                      boxShadow: `0 0 20px ${color.hex}80`,
                    }}
                  >
                    {/* Selected checkmark */}
                    {selectedColor?.name === color.name && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Check className="w-6 h-6 text-white drop-shadow-lg" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Color name tooltip */}
                  <motion.div
                    className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-900 text-white'
                    } rounded px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    {color.name}
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Color Details */}
            {selectedColor && (
              <motion.div
                className={`mt-6 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h5 className={`font-bold mb-2 ${textColor}`}>
                  {selectedColor.name}
                </h5>
                <div className="space-y-1 text-sm">
                  <p className={secondaryText}>
                    HEX: <span className="font-mono">{selectedColor.hex}</span>
                  </p>
                  <p className={secondaryText}>
                    RGB: <span className="font-mono">{selectedColor.rgb}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
