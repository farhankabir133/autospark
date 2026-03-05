/**
 * CarShowcase3DCanvas.tsx
 * ─────────────────────────────────────────────
 * All Three.js / R3F code lives here so the ~987 KB three.js chunk
 * is only downloaded when this module is dynamically imported
 * (mid- and high-tier devices only).
 *
 * Key fixes baked in:
 *  • Named THREE imports (tree-shakeable)
 *  • Self-hosted Ferrari GLB + DRACO decoder (no 3rd-party latency)
 *  • Color lerp inside useFrame (no standalone rAF)
 *  • Wheel animation pauses when tab hidden (document.hidden)
 *  • matchMedia for responsive hooks (no resize spam)
 *  • 8-second model-load timeout with skip button
 */

import { Suspense, useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
  Stars,
  useProgress,
  PerformanceMonitor,
} from '@react-three/drei';

// ── Named THREE imports (tree-shakeable) ──
import {
  Color,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  ACESFilmicToneMapping,
  Group,
  Mesh,
  Object3D,
  Points,
  GridHelper,
  PerspectiveCamera,
} from 'three';
import type { WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ── Types ──
export type DeviceTier = 'low' | 'mid' | 'high';

// ── Self-hosted assets ──
const FERRARI_MODEL_URL = import.meta.env.BASE_URL + 'models/ferrari.glb';
const DRACO_DECODER_PATH = import.meta.env.BASE_URL + 'draco/';

// ── matchMedia-based responsive hooks (no resize event spam) ──
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}
function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

// ── Floating particles ──
// All hooks MUST run before any conditional return to satisfy React's
// rules of hooks (hook count must be identical on every render).
function FloatingParticles({ count = 80, tier }: { count?: number; tier: DeviceTier }) {
  const mesh = useRef<Points>(null);
  const actualCount = tier === 'low' ? 0 : tier === 'mid' ? Math.min(count, 20) : count;

  const particles = useMemo(() => {
    if (actualCount === 0) return { positions: new Float32Array(0), colors: new Float32Array(0) };
    const positions = new Float32Array(actualCount * 3);
    const colors = new Float32Array(actualCount * 3);
    for (let i = 0; i < actualCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      const isRed = Math.random() > 0.75;
      colors[i * 3] = isRed ? 0.75 : 1;
      colors[i * 3 + 1] = isRed ? 0 : 1;
      colors[i * 3 + 2] = isRed ? 0 : 1;
    }
    return { positions, colors };
  }, [actualCount]);

  useFrame((state) => {
    if (mesh.current && tier !== 'low') {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  // Early return AFTER all hooks have been called
  if (tier === 'low') return null;

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ── Ferrari Model ──
function FerrariModel({ color, tier }: { color: string; tier: DeviceTier }) {
  const group = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const wheelsRef = useRef<Object3D[]>([]);

  // Stable material — created once, color animated inside useFrame
  const bodyMaterialRef = useRef<MeshPhysicalMaterial>(
    new MeshPhysicalMaterial({
      color: new Color(color),
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.2,
    }),
  );

  const detailsMaterial = useMemo(
    () => new MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 }),
    [],
  );

  const glassMaterial = useMemo(
    () => new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 }),
    [],
  );

  // ── Color lerp INSIDE useFrame (no standalone rAF) ──
  const targetColorRef = useRef(new Color(color));
  useEffect(() => {
    targetColorRef.current.set(color);
  }, [color]);

  useFrame(() => {
    const mat = bodyMaterialRef.current;
    if (!mat.color.equals(targetColorRef.current)) {
      mat.color.lerp(targetColorRef.current, 0.08);
      mat.needsUpdate = true;
    }
  });

  // ── Load Ferrari GLTF ──
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let cancelled = false;

    loader.load(
      FERRARI_MODEL_URL,
      (gltf) => {
        if (cancelled) return;
        const carModel = gltf.scene.children[0] as Group;

        const body = carModel.getObjectByName('body');
        if (body && (body as Mesh).material) (body as Mesh).material = bodyMaterialRef.current;

        ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl'].forEach((name) => {
          const rim = carModel.getObjectByName(name);
          if (rim && (rim as Mesh).material) (rim as Mesh).material = detailsMaterial;
        });

        const trim = carModel.getObjectByName('trim');
        if (trim && (trim as Mesh).material) (trim as Mesh).material = detailsMaterial;

        const glass = carModel.getObjectByName('glass');
        if (glass && (glass as Mesh).material) (glass as Mesh).material = glassMaterial;

        wheelsRef.current = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']
          .map((n) => carModel.getObjectByName(n))
          .filter(Boolean) as Object3D[];

        // LOD-aware shadow & geometry optimisation
        // High-tier: full shadows on every mesh
        // Mid-tier: only body casts shadow (saves GPU), reduce geometry detail
        const bodyNames = new Set(['body', 'trim', 'glass']);
        carModel.traverse((child) => {
          if ((child as Mesh).isMesh) {
            const mesh = child as Mesh;
            if (tier === 'high') {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            } else {
              // Mid-tier: only large meshes cast shadows, all receive
              mesh.castShadow = bodyNames.has(mesh.name);
              mesh.receiveShadow = true;
              // Simplify geometry on mid-tier: skip frustum culling optimisation
              mesh.frustumCulled = true;
            }
          }
        });

        setModel(carModel);
      },
      undefined,
      (error) => {
        if (!cancelled) console.error('Error loading Ferrari model:', error);
      },
    );

    return () => {
      cancelled = true;
      dracoLoader.dispose();
    };
  }, []);

  // ── Wheel animation – pauses when tab is hidden ──
  useFrame((state) => {
    if (document.hidden) return;
    const time = -state.clock.elapsedTime;
    for (const wheel of wheelsRef.current) {
      wheel.rotation.x = time * Math.PI * 0.5;
    }
  });

  if (!model) return null;

  return (
    <group ref={group} position={[0, -0.01, 0]}>
      <primitive object={model} />
    </group>
  );
}

// ── Responsive camera ──
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    const isPortrait = size.height > size.width;
    if (size.width < 640) {
      cam.fov = isPortrait ? 48 : 55;
      cam.position.set(isPortrait ? 5.5 : 5, isPortrait ? 1.8 : 2, isPortrait ? -6 : -5.5);
    } else if (size.width < 1024) {
      cam.fov = 45;
      cam.position.set(4.5, 1.6, -5);
    } else {
      cam.fov = 40;
      cam.position.set(4.25, 1.4, -4.5);
    }
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

// ── Animated grid ──
function AnimatedGrid({ tier }: { tier: DeviceTier }) {
  const gridRef = useRef<GridHelper>(null);
  useFrame((state) => {
    if (gridRef.current && tier !== 'low') {
      gridRef.current.position.z = -((-state.clock.elapsedTime) % 1);
    }
  });
  return (
    <gridHelper
      ref={gridRef}
      args={[20, tier === 'low' ? 20 : 40, 0xffffff, 0xffffff]}
      position={[0, 0.001, 0]}
      material-opacity={0.15}
      material-depthWrite={false}
      material-transparent={true}
    />
  );
}

// ── Floors ──
function SimpleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.8} />
    </mesh>
  );
}

// Lazy-loaded MeshReflectorMaterial — only rendered for high-tier devices.
// Since CarShowcase3DCanvas.tsx is itself dynamically imported (only for mid/high),
// and MeshReflectorMaterial is bundled into the same 'three' chunk by manualChunks,
// the real code-split already happens at the wrapper level. ReflectiveFloor is only
// conditionally rendered when effectiveTier === 'high'.
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  );
}

// ── Scene ──
function Scene({
  selectedColor,
  tier,
  reducedMotion = false,
  isMobile = false,
}: {
  selectedColor: string;
  tier: DeviceTier;
  reducedMotion?: boolean;
  isMobile?: boolean;
}) {
  const { gl, invalidate } = useThree();
  const [degraded, setDegraded] = useState(false);
  const effectiveTier: DeviceTier = degraded ? 'low' : tier;

  useEffect(() => {
    (gl as WebGLRenderer).toneMapping = ACESFilmicToneMapping;
    (gl as WebGLRenderer).toneMappingExposure = 0.85;
  }, [gl]);

  useEffect(() => {
    invalidate();
  }, [selectedColor, invalidate]);

  return (
    <>
      <PerformanceMonitor onDecline={() => setDegraded(true)} flipflops={2} onFallback={() => setDegraded(true)} />

      <ResponsiveCamera />

      {/* Lighting */}
      <ambientLight intensity={effectiveTier === 'low' ? 0.6 : 0.4} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow={effectiveTier !== 'low'}
        shadow-mapSize={effectiveTier === 'high' ? [2048, 2048] : isMobile ? [256, 256] : [512, 512]}
      />
      {effectiveTier !== 'low' && (
        <spotLight position={[-10, 15, -10]} angle={0.3} penumbra={1} intensity={1.5} color="#ff4444" />
      )}
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      {effectiveTier === 'high' && <pointLight position={[5, 3, 5]} intensity={0.3} color="#ff6600" />}

      {/* Environment */}
      {effectiveTier === 'low' ? (
        <>
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#8888ff" />
          <hemisphereLight args={['#ffffff', '#444444', 0.8]} />
        </>
      ) : (
        <Environment preset="city" />
      )}

      {/* Stars */}
      {effectiveTier !== 'low' && !reducedMotion && (
        <Stars
          radius={100}
          depth={50}
          count={effectiveTier === 'high' ? 2000 : 400}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}

      {/* Particles */}
      {!reducedMotion && <FloatingParticles count={effectiveTier === 'high' ? 100 : 20} tier={effectiveTier} />}

      {/* Ferrari */}
      <FerrariModel color={selectedColor} tier={effectiveTier} />

      {/* Grid */}
      <AnimatedGrid tier={effectiveTier} />

      {/* Floor */}
      {effectiveTier === 'high' ? <ReflectiveFloor /> : <SimpleFloor />}

      {/* Contact shadows */}
      {effectiveTier !== 'low' && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={effectiveTier === 'high' ? 0.8 : 0.5}
          scale={15}
          blur={effectiveTier === 'high' ? 2.5 : 1.5}
          far={10}
        />
      )}
    </>
  );
}

// ── Loading screen with 8-second timeout + skip ──
function LoadingScreen({ onSkip }: { onSkip: () => void }) {
  const { progress } = useProgress();
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-red-600/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="text-white text-lg font-medium tracking-wider">Loading Ferrari 458...</p>
        <p className="text-gray-400 text-sm">Preparing your experience</p>
        {showSkip && (
          <button
            onClick={onSkip}
            className="mt-2 px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded-full transition-colors"
          >
            Skip loading &rarr;
          </button>
        )}
      </div>
    </Html>
  );
}

// ── Canvas props based on tier ──
function getCanvasProps(tier: DeviceTier) {
  switch (tier) {
    case 'low':
      return {
        shadows: false,
        gl: { antialias: false, alpha: false, powerPreference: 'low-power' as const, stencil: false, depth: true },
        dpr: [1, 1] as [number, number],
        frameloop: 'demand' as const,
      };
    case 'mid':
      return {
        shadows: true,
        gl: { antialias: false, alpha: false, powerPreference: 'default' as const, stencil: false, depth: true },
        dpr: [1, 1] as [number, number],
        frameloop: 'always' as const,
      };
    default:
      return {
        shadows: true,
        gl: { antialias: true, alpha: false, powerPreference: 'high-performance' as const },
        dpr: [1, 1.5] as [number, number],
        frameloop: 'always' as const,
      };
  }
}

// ── Exported Canvas component ──
export interface CarShowcase3DCanvasProps {
  selectedColor: string;
  tier: DeviceTier;
  reducedMotion: boolean;
}

export default function CarShowcase3DCanvas({ selectedColor, tier, reducedMotion }: CarShowcase3DCanvasProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const canvasProps = useMemo(() => getCanvasProps(tier), [tier]);
  const [skipped, setSkipped] = useState(false);
  const handleSkip = useCallback(() => setSkipped(true), []);

  return (
    <Canvas
      shadows={canvasProps.shadows}
      camera={{ position: [4.25, 1.4, -4.5], fov: 40 }}
      gl={canvasProps.gl}
      dpr={canvasProps.dpr}
      frameloop={canvasProps.frameloop}
    >
      <Suspense fallback={skipped ? null : <LoadingScreen onSkip={handleSkip} />}>
        <Scene selectedColor={selectedColor} tier={tier} reducedMotion={reducedMotion} isMobile={isMobile} />
        <OrbitControls
          enablePan={false}
          enableZoom={!isMobile && !isTablet}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.5, 0]}
          autoRotate={!reducedMotion}
          autoRotateSpeed={tier === 'mid' ? 0.6 : 0.8}
        />
      </Suspense>
    </Canvas>
  );
}
