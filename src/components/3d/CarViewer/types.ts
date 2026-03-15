/**
 * Type definitions for the Production-Ready 3D Car Viewer
 * 
 * This module defines all TypeScript interfaces and types used
 * throughout the 3D car viewer system.
 */

// ============================================
// COLOR TYPES
// ============================================

export interface CarColor {
  /** Display name for the color */
  name: string;
  /** Hex code for the color */
  hex: string;
  /** Optional metallic factor (0-1) for realistic paint */
  metalness?: number;
  /** Optional roughness factor (0-1) */
  roughness?: number;
  /** Optional preview image URL */
  preview?: string;
}

// ============================================
// ANIMATION TYPES
// ============================================

export interface AnimationConfig {
  /** Enable idle sway animation */
  idleSway?: boolean;
  /** Enable wheel rotation animation */
  wheelRotation?: boolean;
  /** Enable door open/close toggle */
  doorToggle?: boolean;
  /** Enable headlight toggle */
  headlightToggle?: boolean;
  /** Custom animation speed multiplier */
  speedMultiplier?: number;
}

export type AnimationState = {
  doorsOpen: boolean;
  headlightsOn: boolean;
  isAnimating: boolean;
};

// ============================================
// VEHICLE DATA TYPES
// ============================================

export interface VehicleSpec {
  engine: string;
  horsepower: string;
  transmission: string;
  fuelType: string;
  drivetrain?: string;
}

export interface VehicleModelData {
  /** Unique identifier for the vehicle */
  id: string;
  /** Display name */
  name: string;
  /** Brand/manufacturer */
  brand: 'Toyota' | 'Honda' | 'Lexus' | 'Nissan' | 'Mitsubishi' | 'Suzuki';
  /** Vehicle category */
  category: 'SUV' | 'Sedan' | 'Crossover' | 'MPV' | 'Hatchback' | 'Luxury';
  /** Year model */
  year: number;
  /** Price display string */
  price: string;
  /** Path to the GLB/GLTF model file */
  modelPath: string;
  /** Path to low-poly placeholder model (optional) */
  placeholderPath?: string;
  /** Fallback 2D image if 3D fails */
  fallbackImage: string;
  /** Available paint colors */
  colors: CarColor[];
  /** Default color index */
  defaultColorIndex?: number;
  /** Animation configuration */
  animations?: AnimationConfig;
  /** Vehicle specifications */
  specs: VehicleSpec;
  /** Name of the body mesh in the model for color changes */
  bodyMeshName?: string;
  /** Name of wheel meshes for rotation animation */
  wheelMeshNames?: string[];
  /** Camera distance multiplier for this model */
  cameraDistance?: number;
  /** Description text */
  description?: string;
  /** Description in Bengali */
  descriptionBn?: string;
}

// ============================================
// VIEWER COMPONENT PROPS
// ============================================

export interface CarViewerProps {
  /** Vehicle ID to display */
  vehicleId: string;
  /** Override model path */
  modelPath?: string;
  /** Override available colors */
  colors?: CarColor[];
  /** Initial selected color index */
  initialColorIndex?: number;
  /** Enable/disable controls */
  enableControls?: boolean;
  /** Enable/disable auto-rotate */
  autoRotate?: boolean;
  /** Auto-rotate speed */
  autoRotateSpeed?: number;
  /** Show color picker UI */
  showColorPicker?: boolean;
  /** Show animation controls */
  showAnimationControls?: boolean;
  /** Show specs overlay */
  showSpecs?: boolean;
  /** Custom height for the viewer */
  height?: string;
  /** Custom className */
  className?: string;
  /** Enable fullscreen toggle */
  enableFullscreen?: boolean;
  /** Lighting mode */
  lightingMode?: 'day' | 'night' | 'studio';
  /** Callback when color changes */
  onColorChange?: (color: CarColor, index: number) => void;
  /** Callback when model loads */
  onModelLoad?: () => void;
  /** Callback when model fails to load */
  onModelError?: (error: Error) => void;
  /** Custom environment preset */
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
}

export interface ColorPickerProps {
  /** Available colors */
  colors: CarColor[];
  /** Currently selected index */
  selectedIndex: number;
  /** Callback when color is selected */
  onSelect: (color: CarColor, index: number) => void;
  /** Orientation of the picker */
  orientation?: 'horizontal' | 'vertical';
  /** Size of color swatches */
  size?: 'sm' | 'md' | 'lg';
  /** Show color names */
  showLabels?: boolean;
  /** Custom className */
  className?: string;
}

export interface AnimationControlsProps {
  /** Animation configuration */
  config: AnimationConfig;
  /** Current animation state */
  state: AnimationState;
  /** Toggle doors */
  onToggleDoors?: () => void;
  /** Toggle headlights */
  onToggleHeadlights?: () => void;
  /** Toggle auto-animation */
  onToggleAnimation?: () => void;
  /** Custom className */
  className?: string;
}

export interface LoadingPlaceholderProps {
  /** Progress value 0-100 */
  progress?: number;
  /** Loading message */
  message?: string;
  /** Vehicle name being loaded */
  vehicleName?: string;
  /** Custom className */
  className?: string;
}

export interface ErrorFallbackProps {
  /** Error that occurred */
  error: Error;
  /** Fallback image URL */
  fallbackImage?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom className */
  className?: string;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseCarModelResult {
  /** The loaded scene/group */
  scene: THREE.Group | null;
  /** Loading state */
  isLoading: boolean;
  /** Error if loading failed */
  error: Error | null;
  /** Loading progress 0-100 */
  progress: number;
  /** Function to change body color */
  setBodyColor: (color: string, metalness?: number, roughness?: number) => void;
  /** Function to toggle doors */
  toggleDoors: () => void;
  /** Function to toggle headlights */
  toggleHeadlights: () => void;
  /** Current animation state */
  animationState: AnimationState;
  /** Nodes from the model */
  nodes: Record<string, THREE.Object3D>;
  /** Materials from the model */
  materials: Record<string, THREE.Material>;
}

export interface UseCarModelOptions {
  /** Path to the model */
  modelPath: string;
  /** Body mesh name for color changes */
  bodyMeshName?: string;
  /** Wheel mesh names for animations */
  wheelMeshNames?: string[];
  /** Enable DRACO compression */
  useDraco?: boolean;
  /** DRACO decoder path */
  dracoPath?: string;
  /** Preload the model */
  preload?: boolean;
}

// ============================================
// CAMERA & CONTROLS TYPES
// ============================================

export interface CameraSettings {
  /** Field of view */
  fov: number;
  /** Near clipping plane */
  near: number;
  /** Far clipping plane */
  far: number;
  /** Initial position [x, y, z] */
  position: [number, number, number];
  /** Target look-at point [x, y, z] */
  target: [number, number, number];
}

export interface ControlsSettings {
  /** Minimum polar angle (vertical) */
  minPolarAngle: number;
  /** Maximum polar angle (vertical) */
  maxPolarAngle: number;
  /** Minimum distance (zoom) */
  minDistance: number;
  /** Maximum distance (zoom) */
  maxDistance: number;
  /** Enable damping */
  enableDamping: boolean;
  /** Damping factor */
  dampingFactor: number;
  /** Enable pan */
  enablePan: boolean;
  /** Enable zoom */
  enableZoom: boolean;
  /** Auto-rotate */
  autoRotate: boolean;
  /** Auto-rotate speed */
  autoRotateSpeed: number;
}

// ============================================
// LIGHTING TYPES
// ============================================

export interface LightingPreset {
  /** Ambient light intensity */
  ambientIntensity: number;
  /** Ambient light color */
  ambientColor: string;
  /** Main directional light intensity */
  directionalIntensity: number;
  /** Directional light color */
  directionalColor: string;
  /** Directional light position */
  directionalPosition: [number, number, number];
  /** Environment map intensity */
  envMapIntensity: number;
  /** Background color/gradient */
  backgroundColor: string;
  /** Enable shadows */
  shadows: boolean;
}

// Re-export THREE namespace for external use
import * as THREE from 'three';
export { THREE };
