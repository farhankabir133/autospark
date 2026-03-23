import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX, Music } from 'lucide-react';
import { useState } from 'react';
import { AudioManager } from '../utils/AudioManager';

interface VehicleShowcaseProps {
  vehicleName: string;
  vehicleImage: string;
  videoUrl?: string;
  audioUrl?: string;
  price: string;
  specs?: {
    [key: string]: string | number;
  };
  theme: string;
  language: string;
  onPlay?: () => void;
}

export const VehicleShowcase = ({
  vehicleName,
  vehicleImage,
  videoUrl,
  audioUrl,
  price,
  specs,
  theme,
  language,
  onPlay,
}: VehicleShowcaseProps) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  // Auto-play muted video on hover
  const handleShowcaseHover = () => {
    if (videoUrl) {
      // Avoid playing sounds on hover (hover can be triggered by scrolling when elements
      // move under the cursor). Only trigger the visual/video preview callback.
      onPlay?.();
    }
  };

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-white to-gray-50';

  const borderColor = theme === 'dark'
    ? 'border-gray-700'
    : 'border-gray-200';

  return (
    <motion.div
      className={`rounded-2xl ${bgColor} border ${borderColor} overflow-hidden shadow-2xl`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Image/Video Section */}
      <motion.div
        className="relative w-full h-96 overflow-hidden group"
        onMouseEnter={handleShowcaseHover}
      >
        {/* Background image */}
        <motion.img
          src={vehicleImage}
          alt={vehicleName}
          className="w-full h-full object-cover"
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Video overlay */}
        {videoUrl && (
          <motion.div
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            initial={{ opacity: 0 }}
          >
            <motion.button
              onClick={() => {
                AudioManager.playClick();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-6 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-8 h-8 fill-current" />
            </motion.button>
          </motion.div>
        )}

        {/* Price badge */}
        <motion.div
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold"
          animate={{ y: 0 }}
          whileHover={{ y: -5 }}
        >
          {price}
        </motion.div>

        {/* Audio indicator */}
        {audioUrl && (
          <motion.div
            className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-2 rounded-full text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Music className="w-4 h-4" />
            <span>{language === 'en' ? 'Engine Sound' : 'ইঞ্জিনের শব্দ'}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Info Section */}
      <div className="p-6">
        <motion.h3
          className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {vehicleName}
        </motion.h3>

        {/* Specs toggle */}
        {specs && Object.keys(specs).length > 0 && (
          <motion.button
            onClick={() => setShowSpecs(!showSpecs)}
            className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-blue-400'
                : 'hover:bg-gray-100 text-blue-600'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {language === 'en' ? 'View Specs' : 'স্পেসিফিকেশন দেখুন'} →
          </motion.button>
        )}

        {/* Specs display */}
        {showSpecs && specs && (
          <motion.div
            className={`grid grid-cols-2 gap-3 mt-4 p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {Object.entries(specs).slice(0, 4).map(([key, value]) => (
              <motion.div
                key={key}
                className="text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span
                  className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }
                >
                  {key}:
                </span>
                <span
                  className={`ml-2 font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Audio controls */}
        {audioUrl && (
          <motion.div className="flex gap-2 mt-4">
            <motion.button
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isMusicPlaying
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {isMusicPlaying ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {isMusicPlaying
                ? language === 'en'
                  ? 'Stop Audio'
                  : 'অডিও বন্ধ করুন'
                : language === 'en'
                  ? 'Play Audio'
                  : 'অডিও চালান'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
