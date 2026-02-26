import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Download, 
  Share2, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Sun,
  Moon,
  Palette,
  ChevronDown,
  Smartphone,
  Box,
  Eye,
  Sparkles,
  Play,
  Pause,
  Info,
  X,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

// Declare model-viewer as a custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'rotation-per-second'?: string;
          'environment-image'?: string;
          exposure?: string;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          'camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'field-of-view'?: string;
          'interaction-prompt'?: string;
          loading?: string;
          reveal?: string;
          tone?: string;
          'skybox-image'?: string;
        },
        HTMLElement
      >;
    }
  }
}

// Vehicle 3D model data - Using free GLB car models
const vehicleModels = [
  {
    id: 'toyota-land-cruiser',
    name: 'Toyota Land Cruiser Prado',
    brand: 'Toyota',
    // Using a free 3D car model from Sketchfab (CC license)
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder - replace with actual car GLB
    poster: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Gray', hex: '#808080' },
    ],
    scale: '1 1 1',
    position: '0 0 0',
  },
  {
    id: 'honda-crv',
    name: 'Honda CR-V',
    brand: 'Honda',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', // Placeholder
    poster: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800',
    colors: [
      { name: 'Red', hex: '#CC0000' },
      { name: 'Blue', hex: '#003399' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
    scale: '1 1 1',
    position: '0 0 0',
  },
  {
    id: 'toyota-crown',
    name: 'Toyota Crown',
    brand: 'Toyota',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder
    poster: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Blue', hex: '#003366' },
    ],
    scale: '1 1 1',
    position: '0 0 0',
  },
  {
    id: 'bmw-x5',
    name: 'BMW X5',
    brand: 'BMW',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', // Placeholder
    poster: 'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=800',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Blue', hex: '#0066CC' },
    ],
    scale: '1 1 1',
    position: '0 0 0',
  },
  {
    id: 'mercedes-gle',
    name: 'Mercedes-Benz GLE',
    brand: 'Mercedes-Benz',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder
    poster: 'https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=800',
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    scale: '1 1 1',
    position: '0 0 0',
  },
  {
    id: 'lexus-rx',
    name: 'Lexus RX 350',
    brand: 'Lexus',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb', // Placeholder
    poster: 'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=800',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Silver', hex: '#A8A8A8' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
    scale: '1 1 1',
    position: '0 0 0',
  },
];

// Environment presets for different lighting
const environmentPresets = [
  { id: 'neutral', name: 'Neutral', icon: Sun, image: 'neutral' },
  { id: 'sunset', name: 'Sunset', icon: Sun, image: 'legacy' },
  { id: 'night', name: 'Night', icon: Moon, image: 'neutral' },
  { id: 'studio', name: 'Studio', icon: Sparkles, image: 'neutral' },
];

interface ARViewerEnhancedProps {
  initialVehicleId?: string;
  onClose?: () => void;
}

export const ARViewerEnhanced: React.FC<ARViewerEnhancedProps> = ({
  initialVehicleId,
  onClose
}) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const modelViewerRef = useRef<HTMLElement>(null);
  
  // State
  const [selectedVehicle, setSelectedVehicle] = useState(
    vehicleModels.find(v => v.id === initialVehicleId) || vehicleModels[0]
  );
  const [selectedColor, setSelectedColor] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [environment, setEnvironment] = useState(environmentPresets[0]);
  const [showEnvironmentMenu, setShowEnvironmentMenu] = useState(false);
  const [exposure, setExposure] = useState(1);
  const [shadowIntensity, setShadowIntensity] = useState(1);
  const [arSupported, setArSupported] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cameraOrbit, setCameraOrbit] = useState('0deg 75deg 2.5m');
  const [fieldOfView, setFieldOfView] = useState('30deg');

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const isARSupported = await (navigator as any).xr?.isSessionSupported?.('immersive-ar');
          setArSupported(!!isARSupported);
        } catch {
          setArSupported(false);
        }
      }
    };
    checkARSupport();
  }, []);

  // Load model-viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Screenshot
  const takeScreenshot = useCallback(() => {
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer?.toBlob) {
      modelViewer.toBlob({ idealAspect: true }).then((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedVehicle.name}-ar-preview.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  }, [selectedVehicle]);

  // Share functionality
  const shareAR = useCallback(async () => {
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer?.toBlob && navigator.share) {
      try {
        const blob = await modelViewer.toBlob({ idealAspect: true });
        const file = new File([blob], `${selectedVehicle.name}-ar.png`, { type: 'image/png' });
        await navigator.share({
          title: `${selectedVehicle.name} - AR Preview`,
          text: language === 'en' 
            ? `Check out this ${selectedVehicle.name} in AR!` 
            : `${selectedVehicle.name} এআর তে দেখুন!`,
          files: [file],
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  }, [selectedVehicle, language]);

  // Reset camera
  const resetCamera = useCallback(() => {
    setCameraOrbit('0deg 75deg 2.5m');
    setFieldOfView('30deg');
    setExposure(1);
    setShadowIntensity(1);
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => {
    const currentFov = parseInt(fieldOfView);
    if (currentFov > 15) {
      setFieldOfView(`${currentFov - 5}deg`);
    }
  }, [fieldOfView]);

  const zoomOut = useCallback(() => {
    const currentFov = parseInt(fieldOfView);
    if (currentFov < 60) {
      setFieldOfView(`${currentFov + 5}deg`);
    }
  }, [fieldOfView]);

  // Activate AR
  const activateAR = useCallback(() => {
    const modelViewer = modelViewerRef.current as any;
    if (modelViewer?.activateAR) {
      modelViewer.activateAR();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden shadow-2xl ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50' 
          : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
      }`}
    >
      {/* Header Controls */}
      <div className={`relative z-20 flex items-center justify-between p-4 ${
        theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'
      } backdrop-blur-md border-b ${
        theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
      }`}>
        {/* Vehicle Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <img
              src={selectedVehicle.poster}
              alt={selectedVehicle.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-sm">{selectedVehicle.name}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedVehicle.brand}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                {vehicleModels.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setSelectedColor(0);
                      setShowDropdown(false);
                      setIsLoading(true);
                    }}
                    className={`w-full flex items-center gap-3 p-3 transition-colors ${
                      selectedVehicle.id === vehicle.id
                        ? theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-50'
                        : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={vehicle.poster}
                      alt={vehicle.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {vehicle.name}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {vehicle.brand}
                      </p>
                    </div>
                    {selectedVehicle.id === vehicle.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AR Button (if supported) */}
          {arSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={activateAR}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'View in AR' : 'এআর-এ দেখুন'}
              </span>
            </motion.button>
          )}

          {/* Info */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Model Viewer Container */}
      <div className="relative aspect-[16/10]">
        {/* Loading Skeleton */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className={`absolute inset-0 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {language === 'en' ? 'Loading 3D Model...' : '3D মডেল লোড হচ্ছে...'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Viewer */}
        <model-viewer
          ref={modelViewerRef}
          src={selectedVehicle.modelUrl}
          poster={selectedVehicle.poster}
          alt={`${selectedVehicle.name} 3D Model`}
          ar={true}
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls={true}
          auto-rotate={isAutoRotate}
          rotation-per-second="30deg"
          environment-image={environment.image}
          exposure={exposure.toString()}
          shadow-intensity={shadowIntensity.toString()}
          shadow-softness="1"
          camera-orbit={cameraOrbit}
          min-camera-orbit="auto auto 1m"
          max-camera-orbit="auto auto 10m"
          field-of-view={fieldOfView}
          min-field-of-view="10deg"
          max-field-of-view="60deg"
          interaction-prompt="auto"
          loading="eager"
          reveal="auto"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
            '--poster-color': theme === 'dark' ? '#111827' : '#f3f4f6',
          } as React.CSSProperties}
          onLoad={() => setIsLoading(false)}
        />

        {/* Floating Controls - Left Side */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {/* Zoom In */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={zoomIn}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
              theme === 'dark' 
                ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
            }`}
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>

          {/* Zoom Out */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={zoomOut}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
              theme === 'dark' 
                ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
            }`}
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>

          {/* Reset */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetCamera}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
              theme === 'dark' 
                ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Floating Controls - Right Side */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {/* Auto Rotate Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
              isAutoRotate
                ? 'bg-blue-600 text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                  : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
            }`}
          >
            {isAutoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>

          {/* Environment */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEnvironmentMenu(!showEnvironmentMenu)}
              className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                  : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
              }`}
            >
              <Sun className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showEnvironmentMenu && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`absolute right-full mr-2 top-0 p-2 rounded-xl shadow-xl ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  {environmentPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setEnvironment(preset);
                        setShowEnvironmentMenu(false);
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors ${
                        environment.id === preset.id
                          ? theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <preset.icon className="w-4 h-4" />
                      <span className="text-sm whitespace-nowrap">{preset.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Screenshot */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={takeScreenshot}
            className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
              theme === 'dark' 
                ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
            }`}
          >
            <Camera className="w-5 h-5" />
          </motion.button>

          {/* Share */}
          {'share' in navigator && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={shareAR}
              className={`p-3 rounded-xl shadow-lg backdrop-blur-md ${
                theme === 'dark' 
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
                  : 'bg-white/80 hover:bg-gray-50/80 text-gray-900'
              }`}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Color Picker - Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          }`}>
            <Palette className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <div className="flex gap-2">
              {selectedVehicle.colors.map((color, index) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(index)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor === index
                      ? 'border-blue-500 ring-2 ring-blue-500/30 scale-110'
                      : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* AR Not Supported Message */}
        {!arSupported && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              theme === 'dark' 
                ? 'bg-amber-900/30 text-amber-400 border border-amber-700/50' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <Smartphone className="w-4 h-4" />
              <span>
                {language === 'en' 
                  ? 'AR available on compatible mobile devices' 
                  : 'এআর সামঞ্জস্যপূর্ণ মোবাইল ডিভাইসে উপলব্ধ'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t ${
              theme === 'dark' ? 'border-gray-700/50 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Move className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Controls' : 'কন্ট্রোল'}
                  </span>
                </div>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• {language === 'en' ? 'Drag to rotate' : 'ঘোরাতে টানুন'}</li>
                  <li>• {language === 'en' ? 'Pinch/scroll to zoom' : 'জুম করতে পিঞ্চ/স্ক্রোল'}</li>
                  <li>• {language === 'en' ? 'Two-finger drag to pan' : 'প্যান করতে দুই আঙুলে টানুন'}</li>
                </ul>
              </div>

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Box className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'AR Mode' : 'এআর মোড'}
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'en' 
                    ? 'On compatible devices, tap "View in AR" to place the vehicle in your real environment using your camera.'
                    : 'সামঞ্জস্যপূর্ণ ডিভাইসে, আপনার ক্যামেরা ব্যবহার করে আপনার পরিবেশে গাড়িটি রাখতে "এআর-এ দেখুন" এ ট্যাপ করুন।'}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'en' ? 'Features' : 'বৈশিষ্ট্য'}
                  </span>
                </div>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <li>• {language === 'en' ? '360° interactive view' : '360° ইন্টারেক্টিভ ভিউ'}</li>
                  <li>• {language === 'en' ? 'Multiple color options' : 'একাধিক রঙের অপশন'}</li>
                  <li>• {language === 'en' ? 'Screenshot & share' : 'স্ক্রিনশট ও শেয়ার'}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with Exposure/Shadow Controls */}
      <div className={`p-4 border-t ${
        theme === 'dark' ? 'border-gray-700/50 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Exposure Slider */}
          <div className="flex items-center gap-3">
            <Sun className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' ? 'Exposure' : 'এক্সপোজার'}
            </span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={exposure}
              onChange={(e) => setExposure(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {exposure.toFixed(1)}
            </span>
          </div>

          {/* Shadow Slider */}
          <div className="flex items-center gap-3">
            <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' ? 'Shadow' : 'ছায়া'}
            </span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={shadowIntensity}
              onChange={(e) => setShadowIntensity(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {shadowIntensity.toFixed(1)}
            </span>
          </div>

          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={takeScreenshot}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'en' ? 'Save Image' : 'ইমেজ সংরক্ষণ'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Shimmer Animation Style */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        
        model-viewer {
          --poster-color: transparent;
        }
        
        model-viewer::part(default-ar-button) {
          display: none;
        }
        
        model-viewer::part(default-progress-bar) {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default ARViewerEnhanced;
