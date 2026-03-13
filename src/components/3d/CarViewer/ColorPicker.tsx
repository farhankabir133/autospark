/**
 * ColorPicker Component
 * 
 * A beautiful, accessible color picker for selecting vehicle paint colors.
 * Features animated selection, tooltips, and responsive design.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { ColorPickerProps, CarColor } from './types';

/**
 * Color swatch button component
 */
interface ColorSwatchProps {
  color: CarColor;
  index: number;
  isSelected: boolean;
  size: 'sm' | 'md' | 'lg';
  showLabel: boolean;
  onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  index,
  isSelected,
  size,
  showLabel,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size mapping
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const checkSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Determine if color is dark (for contrast)
  const isDarkColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const checkColor = isDarkColor(color.hex) ? '#ffffff' : '#1a1a1a';

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          ${sizeClasses[size]}
          rounded-full relative overflow-hidden
          border-2 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${isSelected 
            ? 'border-blue-500 ring-2 ring-blue-400 ring-offset-2' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
        `}
        style={{ backgroundColor: color.hex }}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        title={color.name}
        aria-label={`Select ${color.name} color`}
        aria-pressed={isSelected}
      >
        {/* Metallic/glossy effect overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`,
          }}
        />
        
        {/* Selection checkmark */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check 
                className={checkSizeClasses[size]} 
                style={{ color: checkColor }}
                strokeWidth={3}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Color name tooltip/label */}
      <AnimatePresence>
        {(showLabel || isHovered) && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`
              mt-1 text-xs font-medium text-center
              ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
              ${showLabel ? '' : 'absolute top-full mt-2 whitespace-nowrap px-2 py-1 bg-gray-900 text-white rounded shadow-lg z-10'}
            `}
          >
            {color.name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Main ColorPicker component
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedIndex,
  onSelect,
  orientation = 'horizontal',
  size = 'md',
  showLabels = false,
  className = '',
}) => {
  const handleColorSelect = useCallback((color: CarColor, index: number) => {
    onSelect(color, index);
  }, [onSelect]);

  if (colors.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center gap-4
        ${className}
      `}
    >
      {/* Color palette icon */}
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Palette className="w-4 h-4" />
        <span className="text-xs font-medium hidden sm:inline">Color</span>
      </div>

      {/* Color swatches container */}
      <div 
        className={`
          flex gap-2 p-2 rounded-xl
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
          border border-gray-200 dark:border-gray-700
          shadow-sm
          ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
        role="radiogroup"
        aria-label="Select vehicle color"
      >
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color.name}-${index}`}
            color={color}
            index={index}
            isSelected={selectedIndex === index}
            size={size}
            showLabel={showLabels}
            onClick={() => handleColorSelect(color, index)}
          />
        ))}
      </div>

      {/* Selected color name display */}
      {!showLabels && colors[selectedIndex] && (
        <motion.span
          key={selectedIndex}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block"
        >
          {colors[selectedIndex].name}
        </motion.span>
      )}
    </motion.div>
  );
};

/**
 * Compact color picker for mobile/small spaces
 */
export const ColorPickerCompact: React.FC<{
  colors: CarColor[];
  selectedIndex: number;
  onSelect: (color: CarColor, index: number) => void;
  className?: string;
}> = ({ colors, selectedIndex, onSelect, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Selected color trigger */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div 
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: colors[selectedIndex]?.hex || '#ffffff' }}
        />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {colors[selectedIndex]?.name || 'Select color'}
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Expanded color options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50"
          >
            <div className="flex flex-wrap gap-2 max-w-[200px]">
              {colors.map((color, index) => (
                <motion.button
                  key={color.name}
                  onClick={() => {
                    onSelect(color, index);
                    setIsExpanded(false);
                  }}
                  className={`
                    w-8 h-8 rounded-full border-2 relative
                    ${selectedIndex === index ? 'border-blue-500' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={color.name}
                >
                  {selectedIndex === index && (
                    <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
