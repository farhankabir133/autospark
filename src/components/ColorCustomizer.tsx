import { motion } from 'framer-motion';
import { useState } from 'react';

export interface VehicleColor {
  name: string;
  hex: string;
  rgb: string;
}

interface ColorCustomizerProps {
  onColorSelect: (color: VehicleColor) => void;
  selectedColor?: VehicleColor;
  colors: VehicleColor[];
  theme: string;
  language: string;
}

export const ColorCustomizer = ({
  onColorSelect,
  selectedColor,
  colors,
  theme,
  language,
}: ColorCustomizerProps) => {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {language === 'en' ? 'Choose Color' : 'রঙ নির্বাচন করুন'}
      </h4>

      <div className="grid grid-cols-4 gap-3">
        {colors.map((color, index) => (
          <motion.button
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden group"
            onClick={() => onColorSelect(color)}
            onMouseEnter={() => setHoveredColor(color.hex)}
            onMouseLeave={() => setHoveredColor(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Color swatch */}
            <motion.div
              className={`absolute inset-0 border-2 ${
                selectedColor?.hex === color.hex
                  ? 'border-white shadow-lg'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: color.hex }}
              animate={{
                borderWidth: selectedColor?.hex === color.hex ? '2px' : '1px',
                boxShadow: selectedColor?.hex === color.hex ? '0 0 20px rgba(0,0,0,0.5)' : 'none',
              }}
            />

            {/* Hover overlay with color name */}
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredColor === color.hex ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-white text-center">
                <p className="text-xs font-semibold">{color.name}</p>
                <p className="text-[10px] text-gray-200">{color.hex}</p>
              </div>
            </motion.div>

            {/* Selected checkmark */}
            {selectedColor?.hex === color.hex && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3, type: 'spring' }}
              >
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Color preview */}
      {selectedColor && (
        <motion.div
          className="mt-4 p-3 rounded-lg border-2"
          style={{
            borderColor: selectedColor.hex,
            backgroundColor: `${selectedColor.hex}20`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {language === 'en' ? 'Selected:' : 'নির্বাচিত:'} <span className="ml-1">{selectedColor.name}</span>
          </p>
          <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {selectedColor.rgb}
          </p>
        </motion.div>
      )}
    </div>
  );
};
