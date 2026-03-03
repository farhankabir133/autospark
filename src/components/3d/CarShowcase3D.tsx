import { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
  Stars,
  useProgress,
  PerformanceMonitor
} from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Ferrari 458 model from Three.js official examples
const FERRARI_MODEL_URL = 'https://threejs.org/examples/models/gltf/ferrari.glb';
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

// ── Device tier detection ──
type DeviceTier = 'low' | 'mid' | 'high';

function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'mid';
  const w = window.innerWidth;
  const isPhone = w < 768;
  const isTablet = w >= 768 && w < 1024;

  // Check GPU capability via WebGL renderer info
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Low-end mobile GPUs
        if (renderer.includes('mali-4') || renderer.includes('adreno 3') || renderer.includes('powervr sgx')) {
          return 'low';
        }
      }
    }
  } catch { /* ignore */ }

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  // Check device memory (Chrome only)
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

  if (isPhone) {
    if (cores <= 4 || memory <= 3) return 'low';
    return 'mid';
  }
  if (isTablet) {
    if (cores <= 4 || memory <= 3) return 'low';
    return 'mid';
  }
  // Desktop
  if (cores >= 8 && memory >= 8) return 'high';
  return 'mid';
}

// ── Responsive hooks ──
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false
  );
  useEffect(() => {
    const onResize = () => setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isTablet;
}

// Color options
const CAR_COLORS = [
  { name: 'Racing Red', color: '#C00000' },
  { name: 'Midnight Black', color: '#111111' },
  { name: 'Arctic White', color: '#F0F0F0' },
  { name: 'Ocean Blue', color: '#0a3d7c' },
  { name: 'Emerald Green', color: '#0a5c38' },
  { name: 'Sunset Orange', color: '#FF6B00' },
  { name: 'Royal Purple', color: '#4B0082' },
];

// Floating particles — completely disabled on low-tier devices
function FloatingParticles({ count = 80, tier }: { count?: number; tier: DeviceTier }) {
  const mesh = useRef<THREE.Points>(null);

  // On low-tier, render nothing
  if (tier === 'low') return null;

  const actualCount = tier === 'mid' ? Math.min(count, 20) : count;

  const particles = useMemo(() => {
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
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

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
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// The actual Ferrari model component
function FerrariModel({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);

  // Stable material refs — created once, color updated reactively
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial>(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.2,
    })
  );

  const detailsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.5,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0,
        transmission: 1.0,
      }),
    []
  );

  // Reactively update the body color when user clicks a new color
  useEffect(() => {
    const mat = bodyMaterialRef.current;
    // Animate color transition using Three.js lerp for smooth feel
    const targetColor = new THREE.Color(color);
    const startColor = mat.color.clone();
    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.05; // ~20 frames to complete
      if (t >= 1) {
        mat.color.copy(targetColor);
        mat.needsUpdate = true;
        return;
      }
      mat.color.copy(startColor).lerp(targetColor, t);
      mat.needsUpdate = true;
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [color]);

  // Load the Ferrari GLTF model — only once
  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      FERRARI_MODEL_URL,
      (gltf) => {
        const carModel = gltf.scene.children[0] as THREE.Group;

        // Apply materials to named parts
        const body = carModel.getObjectByName('body');
        if (body && (body as THREE.Mesh).material) {
          (body as THREE.Mesh).material = bodyMaterialRef.current;
        }

        // Rims
        ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl'].forEach((name) => {
          const rim = carModel.getObjectByName(name);
          if (rim && (rim as THREE.Mesh).material) {
            (rim as THREE.Mesh).material = detailsMaterial;
          }
        });

        // Trim
        const trim = carModel.getObjectByName('trim');
        if (trim && (trim as THREE.Mesh).material) {
          (trim as THREE.Mesh).material = detailsMaterial;
        }

        // Glass
        const glass = carModel.getObjectByName('glass');
        if (glass && (glass as THREE.Mesh).material) {
          (glass as THREE.Mesh).material = glassMaterial;
        }

        // Collect wheels for animation
        const wheelNames = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
        wheelsRef.current = wheelNames
          .map((name) => carModel.getObjectByName(name))
          .filter(Boolean) as THREE.Object3D[];

        // Enable shadows
        carModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setModel(carModel);
      },
      undefined,
      (error) => {
        console.error('Error loading Ferrari model:', error);
      }
    );

    return () => {
      dracoLoader.dispose();
    };
  }, []);

  // Animate wheels
  useFrame((state) => {
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

// Responsive camera — widens FOV and pulls back on mobile
// On mobile portrait, position the camera to frame the car in the CENTER of the viewport
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const isPortrait = size.height > size.width;
    if (size.width < 640) {
      // Phone portrait — pull back more, raise slightly so car sits in middle
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

// Animated ground grid — static on low-tier
function AnimatedGrid({ tier }: { tier: DeviceTier }) {
  const gridRef = useRef<THREE.GridHelper>(null);

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

// Simple dark floor for low/mid-tier devices (replaces MeshReflectorMaterial)
function SimpleFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.8} />
    </mesh>
  );
}

// Reflective floor only for high-tier devices
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

// Mid-tier reflective floor — lighter settings
function MidReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[100, 50]}
        resolution={256}
        mixBlur={1}
        mixStrength={20}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.2}
      />
    </mesh>
  );
}

// Scene — tier-aware rendering
function Scene({ selectedColor, tier }: { selectedColor: string; tier: DeviceTier }) {
  const { gl, invalidate } = useThree();
  const [degraded, setDegraded] = useState(false);

  // Dynamically downgrade if FPS drops below threshold
  const effectiveTier: DeviceTier = degraded ? 'low' : tier;

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.85;
  }, [gl]);

  // Invalidate frame when color changes (needed for frameloop: 'demand')
  useEffect(() => {
    invalidate();
  }, [selectedColor, invalidate]);

  return (
    <>
      {/* Runtime performance monitor — degrades quality if FPS drops */}
      <PerformanceMonitor
        onDecline={() => setDegraded(true)}
        flipflops={2}
        onFallback={() => setDegraded(true)}
      />

      {/* Responsive camera adjustment */}
      <ResponsiveCamera />

      {/* Lighting — simplified on low-tier */}
      <ambientLight intensity={effectiveTier === 'low' ? 0.6 : 0.4} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow={effectiveTier !== 'low'}
        shadow-mapSize={effectiveTier === 'high' ? [2048, 2048] : [512, 512]}
      />
      {effectiveTier !== 'low' && (
        <spotLight
          position={[-10, 15, -10]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          color="#ff4444"
        />
      )}
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      {effectiveTier === 'high' && <pointLight position={[5, 3, 5]} intensity={0.3} color="#ff6600" />}

      {/* Environment map for reflections — skip on low-tier to avoid heavy HDR download (~1-3 MB) */}
      {effectiveTier === 'low' ? (
        <>
          {/* Cheap directional lights to simulate environment reflections on low-tier */}
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#8888ff" />
          <hemisphereLight args={['#ffffff', '#444444', 0.8]} />
        </>
      ) : (
        <Environment preset="city" />
      )}

      {/* Stars — disabled on low, reduced on mid */}
      {effectiveTier !== 'low' && (
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

      {/* Particles — tier-aware */}
      <FloatingParticles count={effectiveTier === 'high' ? 100 : 20} tier={effectiveTier} />

      {/* The real Ferrari 458 Italia */}
      <FerrariModel color={selectedColor} />

      {/* Animated grid on floor — static on low */}
      <AnimatedGrid tier={effectiveTier} />

      {/* Floor — tier-based: simple on low, light reflector on mid, full on high */}
      {effectiveTier === 'low' && <SimpleFloor />}
      {effectiveTier === 'mid' && <MidReflectiveFloor />}
      {effectiveTier === 'high' && <ReflectiveFloor />}

      {/* Contact shadow — only on mid and high */}
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

// Loading screen
function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-red-600/30 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="text-white text-lg font-medium tracking-wider">Loading Ferrari 458...</p>
        <p className="text-gray-400 text-sm">Preparing your experience</p>
      </div>
    </Html>
  );
}

// Inline typewriter hook for the showcase
function useTypewriter(texts: string[], typingSpeed = 60, deletingSpeed = 30, pauseDuration = 3500) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isWaiting) {
      const t = setTimeout(() => { setIsWaiting(false); setIsDeleting(true); }, pauseDuration);
      return () => clearTimeout(t);
    }
    if (isDeleting) {
      if (displayText === '') { setIsDeleting(false); setTextIndex((p) => (p + 1) % texts.length); return; }
      const t = setTimeout(() => setDisplayText((p) => p.slice(0, -1)), deletingSpeed);
      return () => clearTimeout(t);
    }
    if (displayText === currentText) { setIsWaiting(true); return; }
    const t = setTimeout(() => setDisplayText(currentText.slice(0, displayText.length + 1)), typingSpeed);
    return () => clearTimeout(t);
  }, [displayText, textIndex, isDeleting, isWaiting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

// Main export
export default function CarShowcase3D({ ctaButtons }: { ctaButtons?: React.ReactNode }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = CAR_COLORS[selectedColorIndex];
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [tier] = useState<DeviceTier>(() => getDeviceTier());
  const typewriterText = useTypewriter([
    'Exclusive Cars in Rajshahi',
    "North Bengal's Leading Premium Car Showroom",
    'Luxury Redefined, Performance Delivered',
  ]);

  // Canvas settings based on device tier
  const canvasProps = useMemo(() => {
    switch (tier) {
      case 'low':
        return {
          shadows: false,
          gl: { antialias: false, alpha: false, powerPreference: 'low-power' as const, stencil: false, depth: true },
          dpr: [1, 1] as [number, number],
          // On low-end: only re-render when something changes (orbit, color)
          frameloop: 'demand' as const,
        };
      case 'mid':
        return {
          shadows: true,
          gl: { antialias: false, alpha: false, powerPreference: 'default' as const, stencil: false, depth: true },
          dpr: [1, 1] as [number, number],
          frameloop: 'always' as const,
        };
      default: // high
        return {
          shadows: true,
          gl: { antialias: true, alpha: false, powerPreference: 'high-performance' as const },
          dpr: [1, 1.5] as [number, number],
          frameloop: 'always' as const,
        };
    }
  }, [tier]);

  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden">
      {/* 3D Canvas — tier-adaptive settings */}
      <Canvas
        shadows={canvasProps.shadows}
        camera={{ position: [4.25, 1.4, -4.5], fov: 40 }}
        gl={canvasProps.gl}
        dpr={canvasProps.dpr}
        frameloop={canvasProps.frameloop}
      >
        <Suspense fallback={<LoadingScreen />}>
          <Scene selectedColor={selectedColor.color} tier={tier} />
          <OrbitControls
            enablePan={false}
            enableZoom={!isMobile && !isTablet}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0.5, 0]}
            autoRotate
            autoRotateSpeed={tier === 'low' ? 0.4 : 0.8}
          />
          {/* Removed <Preload all /> — Suspense boundary handles progressive loading */}
        </Suspense>
      </Canvas>

      {/* ── Overlay UI ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* ─────────────────────────────────────
             MOBILE LAYOUT  (< 768px / md)
             Top: compact brand bar
             Upper-third: headline + typewriter
             Center: OPEN for 3D car
             Bottom: slim CTA row → color picker
           ───────────────────────────────────── */}

        {/* ─── TOP SECTION (mobile: brand + text compact | desktop: brand bar) ─── */}
        <div className="absolute top-0 left-0 right-0 z-10">
          {/* Brand bar — always visible */}
          <div className="flex items-start justify-between px-4 pt-4 md:px-10 md:pt-8">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-1 h-8 md:h-10 bg-gradient-to-b from-red-600 to-red-900 rounded-full" />
              <div>
                <h1 className="text-base md:text-2xl font-bold text-white tracking-wider leading-none">
                  AUTO<span className="text-red-600">SPARK</span>
                </h1>
                <p className="text-[8px] md:text-[9px] text-gray-500 tracking-[0.3em] uppercase mt-0.5">
                  Premium Automobiles
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[9px] md:text-[10px] tracking-widest uppercase">Featured</p>
              <h2 className="text-white text-sm md:text-lg font-light tracking-wider leading-tight">
                Ferrari <span className="font-bold">458 Italia</span>
              </h2>
            </div>
          </div>

        </div>

        {/* ─── MOBILE ONLY — Hero headline + typewriter (independently positioned) ─── */}
        <div className="absolute left-0 right-0 top-[22%] z-10 px-5 md:hidden">
          <h2 className="text-[1.65rem] font-black text-white tracking-tight leading-[1]">
            EXPERIENCE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
              EXCELLENCE
            </span>
          </h2>
          <div className="w-8 h-[2px] bg-gradient-to-r from-red-600 to-transparent mt-2 mb-1.5" />
          <div className="flex items-center min-h-[20px] max-w-full">
            <span className="text-[11px] font-light text-white/80 tracking-wide truncate">
              {typewriterText}
            </span>
            <span className="ml-0.5 inline-block w-[2px] h-3.5 bg-red-600 rounded-full animate-pulse flex-shrink-0" />
          </div>
        </div>

        {/* ─── DESKTOP ONLY — LEFT SIDE Hero Text (vertically centered) ─── */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 max-w-sm lg:max-w-md hidden md:block">
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] mb-4">
            EXPERIENCE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
              EXCELLENCE
            </span>
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-red-600 to-transparent mb-4" />
          <div className="flex items-center min-h-[32px] mb-4">
            <span className="text-base lg:text-lg font-light text-white/80 tracking-wide">
              {typewriterText}
            </span>
            <span className="ml-0.5 inline-block w-[2px] h-5 bg-red-600 rounded-full animate-pulse" />
          </div>
          <p className="text-gray-600 text-xs tracking-wider">
            Drag to rotate &bull; Scroll to zoom
          </p>
        </div>

        {/* ─── RIGHT SIDE — Specs (desktop only) ─── */}
        <div className="absolute right-10 top-1/2 -translate-y-[30%] z-10 hidden lg:flex flex-col gap-2 items-end">
          {[
            { label: 'Engine', value: '4.5L V8' },
            { label: 'Power', value: '570 HP' },
            { label: '0-60', value: '3.0 sec' },
            { label: 'Top Speed', value: '202 mph' },
          ].map((spec) => (
            <div
              key={spec.label}
              className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5"
            >
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">{spec.label}</span>
              <span className="text-white text-xs font-semibold">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* ─── BOTTOM ZONE — CTA buttons + color picker ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-2 pb-4 md:pb-6">
          {/* CTA buttons — injected from parent */}
          {ctaButtons && (
            <div className="pointer-events-auto w-full px-4 md:px-0">
              {ctaButtons}
            </div>
          )}

          {/* Color Selector */}
          <div className="pointer-events-auto max-w-[calc(100vw-2rem)]">
            <div
              className="flex items-center gap-2 md:gap-6 bg-black/60 backdrop-blur-xl px-3 py-2 md:px-8 md:py-4 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto scrollbar-hide"
              role="radiogroup"
              aria-label="Select car color"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <span className="text-gray-500 text-[10px] uppercase tracking-widest hidden md:block flex-shrink-0">
                Color
              </span>
              <div className="flex gap-1.5 md:gap-3 flex-shrink-0">
                {CAR_COLORS.map((colorOption, index) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColorIndex(index)}
                    aria-label={`Select ${colorOption.name} color`}
                    aria-checked={selectedColorIndex === index}
                    role="radio"
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-300 border-2 flex-shrink-0 ${
                      selectedColorIndex === index
                        ? 'border-white scale-125 shadow-lg shadow-white/20'
                        : 'border-transparent hover:scale-110 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    title={colorOption.name}
                  />
                ))}
              </div>
              <span className="text-white text-sm font-medium min-w-[100px] text-right hidden md:block flex-shrink-0">
                {selectedColor.name}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Corner accents ─── */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 hidden md:block">
          <div className="absolute top-6 right-6 w-16 h-[1px] bg-gradient-to-l from-red-600 to-transparent" />
          <div className="absolute top-6 right-6 w-[1px] h-16 bg-gradient-to-b from-red-600 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 hidden md:block">
          <div className="absolute bottom-6 left-6 w-16 h-[1px] bg-gradient-to-r from-red-600 to-transparent" />
          <div className="absolute bottom-6 left-6 w-[1px] h-16 bg-gradient-to-t from-red-600 to-transparent" />
        </div>
      </div>
    </div>
  );
}
