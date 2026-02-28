/**
 * useCarModel Hook
 * 
 * Custom hook for loading and managing 3D car models using GLTF/GLB format.
 * Supports DRACO compression, material manipulation, and animation control.
 * 
 * Features:
 * - Lazy loading with progress tracking
 * - DRACO decoder support for compressed models
 * - Body color manipulation
 * - Animation state management
 * - Error handling with fallback
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { AnimationState, UseCarModelOptions, UseCarModelResult } from './types';

// DRACO decoder path (Google CDN)
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

/**
 * Hook for loading and managing a 3D car model
 */
export const useCarModel = (options: UseCarModelOptions): UseCarModelResult => {
  const {
    modelPath,
    bodyMeshName = 'Body',
    wheelMeshNames: _wheelMeshNames = [], // Reserved for wheel animation
    useDraco = true,
    preload: _preload = false, // Reserved for preload logic
  } = options;

  // Suppress unused variable warnings - these are reserved for future animation features
  void _wheelMeshNames;
  void _preload;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>({
    doorsOpen: false,
    headlightsOn: false,
    isAnimating: true,
  });

  // Refs for material tracking
  const originalMaterialsRef = useRef<Map<string, THREE.Material>>(new Map());
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Load the GLTF model
  // Note: useGLTF handles caching and DRACO internally
  const gltf = useGLTF(modelPath, useDraco ? DRACO_DECODER_PATH : undefined);

  // Extract scene, nodes, and materials
  const scene = useMemo(() => {
    if (gltf?.scene) {
      // Clone the scene to avoid modifying the cached version
      const clonedScene = gltf.scene.clone(true);
      
      // Traverse and setup materials
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Store original materials for reset
          if (child.material) {
            originalMaterialsRef.current.set(child.name, child.material.clone());
          }
          
          // Find and store body mesh material
          if (child.name === bodyMeshName || child.name.toLowerCase().includes('body')) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              bodyMaterialRef.current = child.material;
            } else {
              // Convert to MeshStandardMaterial if needed
              const newMaterial = new THREE.MeshStandardMaterial({
                color: (child.material as THREE.MeshBasicMaterial).color || 0xffffff,
                metalness: 0.5,
                roughness: 0.4,
              });
              child.material = newMaterial;
              bodyMaterialRef.current = newMaterial;
            }
          }
          
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      return clonedScene;
    }
    return null;
  }, [gltf, bodyMeshName]);

  // Extract nodes
  const nodes = useMemo(() => {
    const nodeMap: Record<string, THREE.Object3D> = {};
    if (scene) {
      scene.traverse((child) => {
        if (child.name) {
          nodeMap[child.name] = child;
        }
      });
    }
    return nodeMap;
  }, [scene]);

  // Extract materials
  const materials = useMemo(() => {
    const materialMap: Record<string, THREE.Material> = {};
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat, idx) => {
              materialMap[`${child.name}_${idx}`] = mat;
            });
          } else {
            materialMap[child.name] = child.material;
          }
        }
      });
    }
    return materialMap;
  }, [scene]);

  // Handle loading state
  useEffect(() => {
    if (gltf?.scene) {
      setIsLoading(false);
      setProgress(100);
    }
  }, [gltf]);

  // Handle errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.message.includes(modelPath)) {
        setError(new Error(`Failed to load model: ${modelPath}`));
        setIsLoading(false);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [modelPath]);

  /**
   * Set body color with metalness and roughness
   */
  const setBodyColor = useCallback((
    color: string,
    metalness: number = 0.5,
    roughness: number = 0.4
  ) => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const isBody = 
          child.name === bodyMeshName || 
          child.name.toLowerCase().includes('body') ||
          child.name.toLowerCase().includes('paint') ||
          child.name.toLowerCase().includes('exterior');

        if (isBody && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.set(color);
          child.material.metalness = metalness;
          child.material.roughness = roughness;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, bodyMeshName]);

  /**
   * Toggle door animation
   */
  const toggleDoors = useCallback(() => {
    if (!scene) return;

    setAnimationState(prev => {
      const newDoorsOpen = !prev.doorsOpen;
      
      // Find door meshes and animate
      scene.traverse((child) => {
        if (child.name.toLowerCase().includes('door')) {
          const targetRotation = newDoorsOpen ? Math.PI / 4 : 0;
          
          // Simple rotation animation (in production, use GSAP or spring animation)
          if (child.name.toLowerCase().includes('left') || child.name.toLowerCase().includes('fl') || child.name.toLowerCase().includes('rl')) {
            child.rotation.y = targetRotation;
          } else if (child.name.toLowerCase().includes('right') || child.name.toLowerCase().includes('fr') || child.name.toLowerCase().includes('rr')) {
            child.rotation.y = -targetRotation;
          }
        }
      });
      
      return { ...prev, doorsOpen: newDoorsOpen };
    });
  }, [scene]);

  /**
   * Toggle headlight emissive
   */
  const toggleHeadlights = useCallback(() => {
    if (!scene) return;

    setAnimationState(prev => {
      const newHeadlightsOn = !prev.headlightsOn;
      
      // Find headlight meshes and toggle emissive
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const isHeadlight = 
            child.name.toLowerCase().includes('headlight') ||
            child.name.toLowerCase().includes('light_front') ||
            child.name.toLowerCase().includes('lamp');

          if (isHeadlight && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.set(newHeadlightsOn ? '#ffffff' : '#000000');
            child.material.emissiveIntensity = newHeadlightsOn ? 2 : 0;
            child.material.needsUpdate = true;
          }
        }
      });
      
      return { ...prev, headlightsOn: newHeadlightsOn };
    });
  }, [scene]);

  return {
    scene,
    isLoading,
    error,
    progress,
    setBodyColor,
    toggleDoors,
    toggleHeadlights,
    animationState,
    nodes,
    materials,
  };
};

/**
 * Preload a model for faster subsequent loads
 */
export const preloadCarModel = (modelPath: string, useDraco: boolean = true) => {
  useGLTF.preload(modelPath, useDraco ? DRACO_DECODER_PATH : undefined);
};

/**
 * Clear cached models to free memory
 */
export const clearCarModelCache = (modelPath?: string) => {
  if (modelPath) {
    useGLTF.clear(modelPath);
  }
};

export default useCarModel;
