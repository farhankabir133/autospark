import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Share2,
  RotateCcw,
  Download,
  Eye,
  Palette,
} from 'lucide-react';

export interface ColorOption {
  name: string;
  hex: string;
  preview?: string;
  category: 'exterior' | 'interior' | 'wheels';
}

interface VehicleColorCustomizerProps {
  vehicleImage?: string;
  onColorChange?: (colors: SelectedColors) => void;
  isDarkTheme?: boolean;
}

export interface SelectedColors {
  exterior: ColorOption;
  interior: ColorOption;
  wheels: ColorOption;
  finish: 'metallic' | 'matte' | 'pearl';
}

const defaultExteriorColors: ColorOption[] = [
  { name: 'Pearl White', hex: '#F5F5F5', category: 'exterior' },
  { name: 'Black Metallic', hex: '#1a1a1a', category: 'exterior' },
  { name: 'Red Mica', hex: '#8B0000', category: 'exterior' },
  { name: 'Navy Blue', hex: '#191970', category: 'exterior' },
  { name: 'Silver', hex: '#C0C0C0', category: 'exterior' },
  { name: 'Bronze', hex: '#8B4513', category: 'exterior' },
];

const defaultInteriorColors: ColorOption[] = [
  { name: 'Black Leather', hex: '#1a1a1a', category: 'interior' },
  { name: 'Beige', hex: '#F5DEB3', category: 'interior' },
  { name: 'Brown', hex: '#8B4513', category: 'interior' },
  { name: 'Gray', hex: '#808080', category: 'interior' },
  { name: 'Cream', hex: '#FFFDD0', category: 'interior' },
];

const defaultWheelColors: ColorOption[] = [
  { name: 'Silver', hex: '#C0C0C0', category: 'wheels' },
  { name: 'Gunmetal', hex: '#2F4F4F', category: 'wheels' },
  { name: 'Black', hex: '#000000', category: 'wheels' },
  { name: 'Gold', hex: '#FFD700', category: 'wheels' },
  { name: 'Bronze', hex: '#8B4513', category: 'wheels' },
];

export const VehicleColorCustomizer: React.FC<VehicleColorCustomizerProps> = ({
  vehicleImage = 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=1200',
  onColorChange,
  isDarkTheme = false,
}) => {
  const [selectedColors, setSelectedColors] = useState<SelectedColors>({
    exterior: defaultExteriorColors[0],
    interior: defaultInteriorColors[0],
    wheels: defaultWheelColors[0],
    finish: 'metallic',
  });

  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    onColorChange?.(selectedColors);
  }, [selectedColors, onColorChange]);

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColors((prev) => ({
      ...prev,
      [color.category]: color,
    }));
  };

  const handleFinishToggle = (finish: 'metallic' | 'matte' | 'pearl') => {
    setSelectedColors((prev) => ({
      ...prev,
      finish,
    }));
  };

  const handleSaveConfiguration = () => {
    const config = {
      timestamp: new Date().toISOString(),
      colors: selectedColors,
    };
    localStorage.setItem(
      `color-config-${Date.now()}`,
      JSON.stringify(config)
    );
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleShare = () => {
    const shareText = `Check out my custom vehicle color configuration: ${selectedColors.exterior.name} exterior with ${selectedColors.interior.name} interior!`;
    if (navigator.share) {
      navigator.share({
        title: 'My Vehicle Configuration',
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleReset = () => {
    setSelectedColors({
      exterior: defaultExteriorColors[0],
      interior: defaultInteriorColors[0],
      wheels: defaultWheelColors[0],
      finish: 'metallic',
    });
  };

  const getBackgroundStyle = (finish: string) => {
    const baseColor = selectedColors.exterior.hex;
    if (finish === 'metallic') {
      return `linear-gradient(135deg, ${baseColor} 0%, ${lightOrDarken(baseColor, 20)} 50%, ${baseColor} 100%)`;
    } else if (finish === 'matte') {
      return baseColor;
    } else {
      return `radial-gradient(circle at 30% 30%, ${lightOrDarken(baseColor, 10)} 0%, ${baseColor} 50%)`;
    }
  };

  const lightOrDarken = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
  };

  return (
    <div className={`rounded-xl p-6 ${isDarkTheme ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
        <Palette size={28} className="text-blue-500" />
        Color Customizer
      </h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Preview */}
        <motion.div
          key={`${selectedColors.exterior.hex}-${selectedColors.finish}`}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl overflow-hidden ${isDarkTheme ? 'bg-slate-900/50' : 'bg-gray-100'} p-4`}
        >
          <div className="space-y-4">
            {/* Main Preview */}
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{ background: getBackgroundStyle(selectedColors.finish) }}
              />
              <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <img
                  src={vehicleImage}
                  alt="Vehicle preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 text-white text-sm">
                  <Eye size={16} />
                  {selectedColors.finish.charAt(0).toUpperCase() + selectedColors.finish.slice(1)} Finish
                </div>
              </div>
            </div>

            {/* Color Swatches Display */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`rounded-lg p-3 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'}`}>
                <p className={`text-xs font-bold mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  EXTERIOR
                </p>
                <div
                  className="w-full h-12 rounded border-2 border-white shadow-lg"
                  style={{ backgroundColor: selectedColors.exterior.hex }}
                  title={selectedColors.exterior.name}
                />
                <p className={`text-xs mt-2 font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedColors.exterior.name}
                </p>
              </div>

              <div className={`rounded-lg p-3 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'}`}>
                <p className={`text-xs font-bold mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  INTERIOR
                </p>
                <div
                  className="w-full h-12 rounded border-2 border-white shadow-lg"
                  style={{ backgroundColor: selectedColors.interior.hex }}
                  title={selectedColors.interior.name}
                />
                <p className={`text-xs mt-2 font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedColors.interior.name}
                </p>
              </div>

              <div className={`rounded-lg p-3 ${isDarkTheme ? 'bg-slate-800' : 'bg-white'}`}>
                <p className={`text-xs font-bold mb-2 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  WHEELS
                </p>
                <div
                  className="w-full h-12 rounded border-2 border-white shadow-lg"
                  style={{ backgroundColor: selectedColors.wheels.hex }}
                  title={selectedColors.wheels.name}
                />
                <p className={`text-xs mt-2 font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                  {selectedColors.wheels.name}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Exterior Colors */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              Exterior Color
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {defaultExteriorColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(color)}
                  className={`rounded-lg p-3 transition-all ${
                    selectedColors.exterior.hex === color.hex
                      ? isDarkTheme
                        ? 'ring-2 ring-blue-500 bg-blue-500/20'
                        : 'ring-2 ring-blue-500 bg-blue-100'
                      : isDarkTheme
                      ? 'hover:bg-slate-700/50'
                      : 'hover:bg-gray-100'
                  }`}
                  title={color.name}
                >
                  <div
                    className="w-full h-10 rounded mb-2 shadow border-2 border-white/50"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={`text-xs font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                    {color.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Interior Colors */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              Interior Color
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {defaultInteriorColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(color)}
                  className={`rounded-lg p-3 transition-all ${
                    selectedColors.interior.hex === color.hex
                      ? isDarkTheme
                        ? 'ring-2 ring-blue-500 bg-blue-500/20'
                        : 'ring-2 ring-blue-500 bg-blue-100'
                      : isDarkTheme
                      ? 'hover:bg-slate-700/50'
                      : 'hover:bg-gray-100'
                  }`}
                  title={color.name}
                >
                  <div
                    className="w-full h-10 rounded mb-2 shadow border-2 border-white/50"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={`text-xs font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                    {color.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Wheel Colors */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              Wheel Color
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {defaultWheelColors.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(color)}
                  className={`rounded-lg p-3 transition-all ${
                    selectedColors.wheels.hex === color.hex
                      ? isDarkTheme
                        ? 'ring-2 ring-blue-500 bg-blue-500/20'
                        : 'ring-2 ring-blue-500 bg-blue-100'
                      : isDarkTheme
                      ? 'hover:bg-slate-700/50'
                      : 'hover:bg-gray-100'
                  }`}
                  title={color.name}
                >
                  <div
                    className="w-full h-10 rounded mb-2 shadow border-2 border-white/50"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={`text-xs font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                    {color.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Finish Selection */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              Paint Finish
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['metallic', 'matte', 'pearl'] as const).map((finish) => (
                <motion.button
                  key={finish}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFinishToggle(finish)}
                  className={`rounded-lg p-3 font-medium transition-all ${
                    selectedColors.finish === finish
                      ? isDarkTheme
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : isDarkTheme
                      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                  } capitalize transition-colors`}
                >
                  {finish}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveConfiguration}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
                  isDarkTheme
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Save size={18} />
                {showSaved ? 'Saved!' : 'Save'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
                  isDarkTheme
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Share2 size={18} />
                Share
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
                isDarkTheme
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  : 'bg-gray-300 hover:bg-gray-400 text-slate-700'
              }`}
            >
              <RotateCcw size={18} />
              Reset
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
