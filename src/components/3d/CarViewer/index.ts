/**
 * CarViewer Module - Production-Ready 3D Vehicle Viewer
 * 
 * This module provides a complete 3D car viewing experience with:
 * - Dynamic model loading with DRACO support
 * - Interactive orbit controls
 * - Color customization
 * - Day/Night lighting modes
 * - Animation support
 * - Responsive design
 * 
 * @example
 * ```tsx
 * import { CarViewer, ColorPicker, VEHICLES } from '@/components/3d/CarViewer';
 * 
 * <CarViewer 
 *   vehicleId="toyota-harrier"
 *   showColorPicker={true}
 *   autoRotate={true}
 * />
 * ```
 */

// Main components
export { CarViewer, default } from './CarViewer';
export { CarViewerShowcase } from './CarViewerShowcase';
export { ColorPicker, ColorPickerCompact } from './ColorPicker';
export { LoadingPlaceholder, ViewerSkeleton } from './LoadingPlaceholder';
export { ErrorFallback, ViewerErrorBoundary } from './ErrorFallback';

// Hooks
export { useCarModel, preloadCarModel, clearCarModelCache } from './useCarModel';

// Data and configuration
export { 
  VEHICLES,
  COMMON_COLORS,
  LIGHTING_PRESETS,
  DEFAULT_CAMERA_SETTINGS,
  MOBILE_CAMERA_SETTINGS,
  DEFAULT_CONTROLS_SETTINGS,
  getVehicleById,
  getVehiclesByBrand,
  getVehiclesByCategory,
  getAllVehicleIds,
  getFeaturedVehicles,
} from './vehicleData';

// Types
export type {
  CarColor,
  AnimationConfig,
  AnimationState,
  VehicleSpec,
  VehicleModelData,
  CarViewerProps,
  ColorPickerProps,
  AnimationControlsProps,
  LoadingPlaceholderProps,
  ErrorFallbackProps,
  UseCarModelResult,
  UseCarModelOptions,
  CameraSettings,
  ControlsSettings,
  LightingPreset,
} from './types';
