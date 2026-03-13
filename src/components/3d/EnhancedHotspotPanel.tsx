import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Zap, 
  Gauge, 
  CheckCircle2,
  ArrowRight,
  Share2,
  BookmarkPlus
} from 'lucide-react';

export interface HotspotFeature {
  id: string;
  icon?: React.ReactNode;
  text: string;
  checked?: boolean;
}

export interface EnhancedHotspot {
  id: number;
  x: number;
  y: number;
  label: string;
  description: string;
  videoUrl?: string;
  specs?: Record<string, string | number>;
  features?: HotspotFeature[];
  relatedVehicles?: string[];
}

interface EnhancedHotspotPanelProps {
  hotspot: EnhancedHotspot;
  onClose: () => void;
  isDarkTheme?: boolean;
}

const defaultSpecs: Record<string, string> = {
  'Material': 'Premium aluminum alloy',
  'Weight': 'Reduced vs standard',
  'Durability': 'Weather resistant',
};

const defaultFeatures: HotspotFeature[] = [
  { id: '1', text: 'Auto-adjusting capability', checked: true },
  { id: '2', text: 'Night vision compatible', checked: true },
  { id: '3', text: 'Integration with mobile app', checked: true },
];

export const EnhancedHotspotPanel: React.FC<EnhancedHotspotPanelProps> = ({
  hotspot,
  onClose,
  isDarkTheme = false,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'video'>('specs');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const specs = hotspot.specs || defaultSpecs;
  const features = hotspot.features || defaultFeatures;
  const hasVideo = !!hotspot.videoUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3 }}
        className={`absolute z-50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm
          ${isDarkTheme
            ? 'bg-slate-900/95 border border-slate-700/50 text-white'
            : 'bg-white/95 border border-gray-200/50 text-slate-900'
          }
          w-80 sm:w-96
        `}
        style={{
          left: `${Math.min(hotspot.x + 10, 85)}%`,
          top: `${Math.min(hotspot.y + 10, 85)}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDarkTheme ? 'border-slate-700/50' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold leading-tight">{hotspot.label}</h3>
              <p className={`text-sm mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                {hotspot.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? isDarkTheme
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-amber-100 text-amber-600'
                    : isDarkTheme
                    ? 'hover:bg-slate-800 text-slate-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <BookmarkPlus size={18} />
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme
                    ? 'hover:bg-slate-800 text-slate-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-2 px-4 pt-3 border-b ${isDarkTheme ? 'border-slate-700/50' : 'border-gray-200'}`}>
          {hasVideo && (
            <button
              onClick={() => setActiveTab('video')}
              className={`pb-3 px-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'video'
                  ? isDarkTheme
                    ? 'text-blue-400 border-blue-400'
                    : 'text-blue-600 border-blue-600'
                  : isDarkTheme
                  ? 'text-slate-400 border-transparent hover:text-slate-200'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Play size={16} className="inline mr-1" />
              Video
            </button>
          )}
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'specs'
                ? isDarkTheme
                  ? 'text-blue-400 border-blue-400'
                  : 'text-blue-600 border-blue-600'
                : isDarkTheme
                ? 'text-slate-400 border-transparent hover:text-slate-200'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Zap size={16} className="inline mr-1" />
            Specs
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 px-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'features'
                ? isDarkTheme
                  ? 'text-blue-400 border-blue-400'
                  : 'text-blue-600 border-blue-600'
                : isDarkTheme
                ? 'text-slate-400 border-transparent hover:text-slate-200'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <CheckCircle2 size={16} className="inline mr-1" />
            Features
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-64">
          <AnimatePresence mode="wait">
            {activeTab === 'video' && hasVideo && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                  <iframe
                    src={hotspot.videoUrl}
                    title={hotspot.label}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {Object.entries(specs).map(([key, value], idx) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      isDarkTheme
                        ? 'bg-slate-800/50 hover:bg-slate-800'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <span className={`font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                      {key}
                    </span>
                    <span className={`${isDarkTheme ? 'text-slate-200' : 'text-slate-900'} font-semibold`}>
                      {value}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isDarkTheme
                        ? 'bg-slate-800/50 hover:bg-slate-800'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <div className={`flex-shrink-0 ${feature.checked ? 'text-green-500' : 'text-gray-400'}`}>
                      <CheckCircle2 size={20} />
                    </div>
                    <span className={isDarkTheme ? 'text-slate-300' : 'text-slate-700'}>
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex gap-2 ${isDarkTheme ? 'border-slate-700/50' : 'border-gray-200'}`}>
          <button className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            <ArrowRight size={16} />
            Learn More
          </button>
          <button className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            isDarkTheme
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
          }`}>
            <Share2 size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
