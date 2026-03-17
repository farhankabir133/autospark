/**
 * useDeviceCapability
 * Detects if the device is "low-end" so heavy animations can be disabled.
 * Criteria: deviceMemory ≤ 2 GB  OR  hardwareConcurrency ≤ 2  OR
 *           prefers-reduced-motion  OR  connection is 2G/slow-2G.
 * All checks are optional (APIs not universally available) so we default
 * to "capable" when we cannot tell.
 */

import { useMemo } from 'react';

interface DeviceCapability {
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  /** safe particle count for this device */
  particleCount: number;
  /** whether to show 3D / WebGL content */
  supports3D: boolean;
  /** whether to run stagger / parallax animations */
  supportsRichAnimations: boolean;
}

export function useDeviceCapability(): DeviceCapability {
  return useMemo(() => {
    // --- 1. prefers-reduced-motion ---
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 2. mobile breakpoint ---
    const isMobile =
      typeof window !== 'undefined' && window.innerWidth < 768;

    // --- 3. hardware signals (best-effort) ---
    const memory =
      typeof navigator !== 'undefined'
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
        : 4;

    const cores =
      typeof navigator !== 'undefined'
        ? navigator.hardwareConcurrency ?? 4
        : 4;

    // --- 4. network (best-effort) ---
    const conn = (navigator as Navigator & {
      connection?: { effectiveType?: string };
    }).connection;
    const slowNetwork =
      conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';

    // --- 5. WebGL support ---
    let hasWebGL = true;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL = !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch {
      hasWebGL = false;
    }

    const isLowEnd =
      prefersReducedMotion ||
      slowNetwork ||
      memory <= 2 ||
      cores <= 2 ||
      (isMobile && memory <= 3);

    return {
      isLowEnd,
      isMobile,
      prefersReducedMotion,
      particleCount: isLowEnd ? 0 : isMobile ? 6 : 15,
      supports3D: hasWebGL && !isLowEnd,
      supportsRichAnimations: !isLowEnd && !prefersReducedMotion,
    };
  }, []);
}
