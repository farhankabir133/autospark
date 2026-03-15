import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

interface DesertHighwaySceneProps {
  className?: string;
}

export const DesertHighwayScene: React.FC<DesertHighwaySceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    car: THREE.Group | null;
    wheels: THREE.Mesh[];
    animationId: number;
    clock: THREE.Clock;
    mouse: { x: number; y: number };
    targetCameraOffset: { x: number; y: number };
  } | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Create the scene
  const init = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    
    // Fog for atmosphere
    const fogColor = isDark ? 0x1a1a2e : 0xf4e4c9;
    scene.fog = new THREE.FogExp2(fogColor, 0.008);
    scene.background = new THREE.Color(fogColor);

    // Camera - Cinematic FOV
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(8, 3, 12);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 0.8 : 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    container.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      car: null,
      wheels: [],
      animationId: 0,
      clock: new THREE.Clock(),
      mouse: { x: 0, y: 0 },
      targetCameraOffset: { x: 0, y: 0 }
    };

    // Setup scene elements
    loadEnvironment(scene, isDark);
    createGround(scene, isDark);
    createRoad(scene);
    createCar(scene, sceneRef);
    setupLighting(scene, isDark);
    createAtmosphericParticles(scene, isDark);

    // Start animation
    animate();
  }, [isDark]);

  // Load environment
  const loadEnvironment = (scene: THREE.Scene, isDark: boolean) => {
    // Sky gradient
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(isDark ? 0x0a0a1a : 0x87CEEB) },
        bottomColor: { value: new THREE.Color(isDark ? 0x1a1a2e : 0xf4e4c9) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Sun/Moon
    const celestialGeometry = new THREE.SphereGeometry(15, 32, 32);
    const celestialMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0xffdd88,
    });
    const celestial = new THREE.Mesh(celestialGeometry, celestialMaterial);
    celestial.position.set(100, 60, -200);
    scene.add(celestial);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(25, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x6677aa : 0xffaa44,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(celestial.position);
    scene.add(glow);
  };

  // Create desert ground
  const createGround = (scene: THREE.Scene, isDark: boolean) => {
    // Large desert plane
    const groundGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
    
    // Add subtle displacement
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      // Add sand dune-like displacement
      vertices[i + 2] = Math.sin(x * 0.05) * 0.5 + Math.cos(y * 0.03) * 0.3 + Math.random() * 0.1;
    }
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x3d3424 : 0xd4a574,
      roughness: 0.95,
      metalness: 0.0,
      flatShading: false,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add sand texture variation with smaller planes
    for (let i = 0; i < 50; i++) {
      const duneGeometry = new THREE.CircleGeometry(Math.random() * 5 + 2, 16);
      const duneMaterial = new THREE.MeshStandardMaterial({
        color: isDark ? 0x4d4434 : 0xe4b584,
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0.6
      });
      const dune = new THREE.Mesh(duneGeometry, duneMaterial);
      dune.rotation.x = -Math.PI / 2;
      dune.position.set(
        (Math.random() - 0.5) * 200,
        0.02,
        (Math.random() - 0.5) * 200
      );
      dune.receiveShadow = true;
      scene.add(dune);
    }
  };

  // Create road
  const createRoad = (scene: THREE.Scene) => {
    // Main road
    const roadGeometry = new THREE.PlaneGeometry(12, 500, 1, 100);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c2c2c,
      roughness: 0.8,
      metalness: 0.1,
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    road.receiveShadow = true;
    scene.add(road);

    // Road center line (dashed)
    for (let i = -250; i < 250; i += 8) {
      const lineGeometry = new THREE.PlaneGeometry(0.3, 4);
      const lineMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        roughness: 0.5,
        emissive: 0x332200,
        emissiveIntensity: 0.3
      });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.02, i);
      scene.add(line);
    }

    // Road edge lines
    [-5.5, 5.5].forEach(x => {
      const edgeGeometry = new THREE.PlaneGeometry(0.2, 500);
      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5
      });
      const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
      edge.rotation.x = -Math.PI / 2;
      edge.position.set(x, 0.02, 0);
      scene.add(edge);
    });
  };

  // Create sporty supercar (Bugatti/Pagani/BMW inspired)
  const createCar = (scene: THREE.Scene, sceneRefObj: React.MutableRefObject<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    car: THREE.Group | null;
    wheels: THREE.Mesh[];
    animationId: number;
    clock: THREE.Clock;
    mouse: { x: number; y: number };
    targetCameraOffset: { x: number; y: number };
  } | null>) => {
    const car = new THREE.Group();
    const wheels: THREE.Mesh[] = [];

    // ========== MATERIALS ==========
    // Deep metallic blue/black paint (Bugatti Chiron style)
    const carPaintMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1628,
      roughness: 0.08,
      metalness: 0.98,
      envMapIntensity: 2.0
    });

    // Secondary accent color (Carbon fiber look)
    const carbonFiberMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.7
    });

    // Chrome/Aluminum trim
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8e8e8,
      roughness: 0.02,
      metalness: 1.0
    });

    // Accent color (Blue LED/trim)
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      emissive: 0x0066cc,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.5
    });

    // ========== MAIN BODY - Ultra Low Profile ==========
    // Front nose (very low, pointed)
    const noseShape = new THREE.Shape();
    noseShape.moveTo(0, 0);
    noseShape.lineTo(-0.6, 0);
    noseShape.quadraticCurveTo(-0.65, 0.15, -0.55, 0.25);
    noseShape.lineTo(0.55, 0.25);
    noseShape.quadraticCurveTo(0.65, 0.15, 0.6, 0);
    noseShape.lineTo(0, 0);

    const noseGeometry = new THREE.ExtrudeGeometry(noseShape, {
      depth: 1.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 4
    });
    noseGeometry.translate(0, 0, 1.8);
    const nose = new THREE.Mesh(noseGeometry, carPaintMaterial);
    nose.position.y = 0.25;
    nose.castShadow = true;
    car.add(nose);

    // Main body (low, wide, aggressive)
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-0.95, 0);
    bodyShape.lineTo(-0.95, 0.35);
    bodyShape.quadraticCurveTo(-0.9, 0.5, -0.7, 0.55);
    bodyShape.lineTo(0.7, 0.55);
    bodyShape.quadraticCurveTo(0.9, 0.5, 0.95, 0.35);
    bodyShape.lineTo(0.95, 0);
    bodyShape.lineTo(-0.95, 0);

    const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 3.5,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3
    });
    bodyGeometry.translate(0, 0, -1.5);
    const body = new THREE.Mesh(bodyGeometry, carPaintMaterial);
    body.position.y = 0.22;
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);

    // ========== COCKPIT (Fighter Jet Style Canopy) ==========
    const cockpitShape = new THREE.Shape();
    cockpitShape.moveTo(-0.55, 0);
    cockpitShape.lineTo(-0.55, 0.35);
    cockpitShape.quadraticCurveTo(-0.45, 0.55, 0, 0.6);
    cockpitShape.quadraticCurveTo(0.45, 0.55, 0.55, 0.35);
    cockpitShape.lineTo(0.55, 0);
    cockpitShape.lineTo(-0.55, 0);

    const cockpitGeometry = new THREE.ExtrudeGeometry(cockpitShape, {
      depth: 1.6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 3
    });
    cockpitGeometry.translate(0, 0, -0.8);
    const cockpit = new THREE.Mesh(cockpitGeometry, carbonFiberMaterial);
    cockpit.position.y = 0.55;
    cockpit.castShadow = true;
    car.add(cockpit);

    // ========== WINDSHIELD & WINDOWS (Tinted, Wrap-around) ==========
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1520,
      roughness: 0.02,
      metalness: 0.4,
      transparent: true,
      opacity: 0.9
    });

    // Front windshield (very raked)
    const windshieldGeometry = new THREE.PlaneGeometry(1.05, 0.5);
    const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
    windshield.position.set(0, 0.95, 0.85);
    windshield.rotation.x = -Math.PI / 3.5;
    car.add(windshield);

    // Side windows (teardrop shape)
    [-0.58, 0.58].forEach(x => {
      const sideWindowGeometry = new THREE.PlaneGeometry(1.3, 0.4);
      const sideWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
      sideWindow.position.set(x, 0.85, -0.1);
      sideWindow.rotation.y = x > 0 ? -Math.PI / 2.2 : Math.PI / 2.2;
      car.add(sideWindow);
    });

    // Rear window (small, angled)
    const rearWindowGeometry = new THREE.PlaneGeometry(0.8, 0.3);
    const rearWindow = new THREE.Mesh(rearWindowGeometry, windowMaterial);
    rearWindow.position.set(0, 0.85, -0.85);
    rearWindow.rotation.x = Math.PI / 4;
    car.add(rearWindow);

    // ========== FRONT SPLITTER (Aggressive aero) ==========
    const splitterGeometry = new THREE.BoxGeometry(1.9, 0.03, 0.4);
    const splitter = new THREE.Mesh(splitterGeometry, carbonFiberMaterial);
    splitter.position.set(0, 0.15, 2.9);
    car.add(splitter);

    // Splitter side fins
    [-0.85, 0.85].forEach(x => {
      const finGeometry = new THREE.BoxGeometry(0.15, 0.12, 0.5);
      const fin = new THREE.Mesh(finGeometry, carbonFiberMaterial);
      fin.position.set(x, 0.18, 2.75);
      car.add(fin);
    });

    // ========== HEADLIGHTS (Slim LED Strips - Bugatti/Pagani Style) ==========
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffee,
      emissiveIntensity: 4,
      roughness: 0.0
    });

    [-0.55, 0.55].forEach(x => {
      // Main LED strip (very thin, aggressive)
      const ledStripGeometry = new THREE.BoxGeometry(0.35, 0.025, 0.04);
      const ledStrip = new THREE.Mesh(ledStripGeometry, headlightMaterial);
      ledStrip.position.set(x, 0.45, 2.95);
      car.add(ledStrip);

      // Accent LED below
      const accentLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.015, 0.03),
        accentMaterial
      );
      accentLed.position.set(x, 0.42, 2.96);
      car.add(accentLed);

      // Headlight beam
      const beamGeometry = new THREE.ConeGeometry(2.5, 25, 16, 1, true);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0.025,
        side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.set(x, 0.45, 15);
      beam.rotation.x = Math.PI / 2;
      car.add(beam);
    });

    // ========== FRONT AIR INTAKES (Large, Functional Look) ==========
    const intakeMaterial = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.5,
      metalness: 0.3
    });

    // Center intake (large)
    const centerIntakeGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.1);
    const centerIntake = new THREE.Mesh(centerIntakeGeometry, intakeMaterial);
    centerIntake.position.set(0, 0.28, 2.9);
    car.add(centerIntake);

    // Honeycomb mesh effect
    for (let i = 0; i < 6; i++) {
      const meshBarGeometry = new THREE.BoxGeometry(0.7, 0.015, 0.02);
      const meshBar = new THREE.Mesh(meshBarGeometry, chromeMaterial);
      meshBar.position.set(0, 0.22 + i * 0.02, 2.92);
      car.add(meshBar);
    }

    // Side intakes
    [-0.75, 0.75].forEach(x => {
      const sideIntakeGeometry = new THREE.BoxGeometry(0.25, 0.12, 0.08);
      const sideIntake = new THREE.Mesh(sideIntakeGeometry, intakeMaterial);
      sideIntake.position.set(x, 0.28, 2.9);
      car.add(sideIntake);
    });

    // ========== SIDE SCOOPS (Engine Cooling - Mid-engine style) ==========
    [-0.98, 0.98].forEach(x => {
      // Main scoop opening
      const scoopGeometry = new THREE.BoxGeometry(0.03, 0.2, 0.6);
      const scoop = new THREE.Mesh(scoopGeometry, intakeMaterial);
      scoop.position.set(x, 0.5, -0.5);
      car.add(scoop);

      // Scoop frame
      const frameGeometry = new THREE.BoxGeometry(0.04, 0.22, 0.65);
      const frame = new THREE.Mesh(frameGeometry, chromeMaterial);
      frame.position.set(x * 1.01, 0.5, -0.5);
      car.add(frame);

      // Horizontal vents
      for (let i = 0; i < 4; i++) {
        const ventGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.55);
        const vent = new THREE.Mesh(ventGeometry, carbonFiberMaterial);
        vent.position.set(x, 0.42 + i * 0.05, -0.5);
        car.add(vent);
      }
    });

    // ========== REAR SECTION (Aggressive Diffuser & Exhaust) ==========
    // Rear deck (engine cover for mid-engine)
    const rearDeckGeometry = new THREE.BoxGeometry(1.7, 0.08, 1.2);
    const rearDeck = new THREE.Mesh(rearDeckGeometry, carbonFiberMaterial);
    rearDeck.position.set(0, 0.72, -1.4);
    car.add(rearDeck);

    // Engine louvers
    for (let i = 0; i < 8; i++) {
      const louverGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.08);
      const louver = new THREE.Mesh(louverGeometry, chromeMaterial);
      louver.position.set(0, 0.74, -0.9 - i * 0.12);
      louver.rotation.x = -0.2;
      car.add(louver);
    }

    // Rear diffuser
    const diffuserGeometry = new THREE.BoxGeometry(1.6, 0.15, 0.5);
    const diffuser = new THREE.Mesh(diffuserGeometry, carbonFiberMaterial);
    diffuser.position.set(0, 0.18, -2.25);
    car.add(diffuser);

    // Diffuser fins
    for (let i = 0; i < 5; i++) {
      const diffuserFinGeometry = new THREE.BoxGeometry(0.02, 0.12, 0.45);
      const diffuserFin = new THREE.Mesh(diffuserFinGeometry, carbonFiberMaterial);
      diffuserFin.position.set(-0.5 + i * 0.25, 0.2, -2.25);
      car.add(diffuserFin);
    }

    // ========== EXHAUST (Quad Center Exit - Bugatti Style) ==========
    const exhaustMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.2,
      metalness: 0.9
    });

    const exhaustGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4400,
      emissive: 0xff2200,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });

    // Four exhaust tips (2x2 arrangement)
    [[-0.2, 0.28], [0.2, 0.28], [-0.2, 0.38], [0.2, 0.38]].forEach(([x, y]) => {
      const exhaustGeometry = new THREE.CylinderGeometry(0.055, 0.065, 0.15, 16);
      const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
      exhaust.position.set(x, y, -2.35);
      exhaust.rotation.x = Math.PI / 2;
      car.add(exhaust);

      // Inner glow
      const glowGeometry = new THREE.CylinderGeometry(0.04, 0.045, 0.05, 16);
      const glow = new THREE.Mesh(glowGeometry, exhaustGlowMaterial);
      glow.position.set(x, y, -2.4);
      glow.rotation.x = Math.PI / 2;
      car.add(glow);
    });

    // ========== TAILLIGHTS (Full-width LED bar) ==========
    const taillightMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 2.5,
      roughness: 0.05
    });

    // Main taillight bar
    const taillightBarGeometry = new THREE.BoxGeometry(1.5, 0.03, 0.03);
    const taillightBar = new THREE.Mesh(taillightBarGeometry, taillightMaterial);
    taillightBar.position.set(0, 0.55, -2.0);
    car.add(taillightBar);

    // Side taillight accents
    [-0.85, 0.85].forEach(x => {
      const sideTaillightGeometry = new THREE.BoxGeometry(0.15, 0.06, 0.03);
      const sideTaillight = new THREE.Mesh(sideTaillightGeometry, taillightMaterial);
      sideTaillight.position.set(x, 0.52, -2.0);
      car.add(sideTaillight);
    });

    // ========== REAR WING (Active Aero Style) ==========
    // Wing supports
    [-0.5, 0.5].forEach(x => {
      const supportGeometry = new THREE.BoxGeometry(0.04, 0.25, 0.08);
      const support = new THREE.Mesh(supportGeometry, carbonFiberMaterial);
      support.position.set(x, 0.85, -1.85);
      car.add(support);
    });

    // Main wing element
    const wingGeometry = new THREE.BoxGeometry(1.6, 0.04, 0.25);
    const wing = new THREE.Mesh(wingGeometry, carbonFiberMaterial);
    wing.position.set(0, 0.98, -1.85);
    wing.rotation.x = -0.15;
    car.add(wing);

    // Wing endplates
    [-0.82, 0.82].forEach(x => {
      const endplateGeometry = new THREE.BoxGeometry(0.03, 0.15, 0.3);
      const endplate = new THREE.Mesh(endplateGeometry, carbonFiberMaterial);
      endplate.position.set(x, 0.92, -1.85);
      car.add(endplate);
    });

    // ========== SIDE MIRRORS (Aerodynamic) ==========
    [-0.7, 0.7].forEach(x => {
      const mirrorArmGeometry = new THREE.BoxGeometry(0.15, 0.025, 0.04);
      const mirrorArm = new THREE.Mesh(mirrorArmGeometry, carbonFiberMaterial);
      mirrorArm.position.set(x, 0.65, 0.6);
      car.add(mirrorArm);

      const mirrorHeadGeometry = new THREE.BoxGeometry(0.06, 0.06, 0.12);
      const mirrorHead = new THREE.Mesh(mirrorHeadGeometry, carPaintMaterial);
      mirrorHead.position.set(x * 1.15, 0.65, 0.6);
      car.add(mirrorHead);
    });

    // ========== WHEELS (Large, Sporty Multi-spoke) ==========
    const wheelPositions = [
      { x: -0.85, z: 1.6, scale: 1 },   // Front left
      { x: 0.85, z: 1.6, scale: 1 },    // Front right
      { x: -0.9, z: -1.4, scale: 1.05 }, // Rear left (wider)
      { x: 0.9, z: -1.4, scale: 1.05 }   // Rear right (wider)
    ];

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.85,
      metalness: 0.1
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.1,
      metalness: 0.95
    });

    const rimAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      emissive: 0x0066aa,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.8
    });

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      const wheelScale = pos.scale;

      // Low profile tire (torus)
      const tireGeometry = new THREE.TorusGeometry(0.32 * wheelScale, 0.08, 16, 32);
      const tire = new THREE.Mesh(tireGeometry, tireMaterial);
      tire.rotation.y = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Rim (large diameter, thin)
      const rimGeometry = new THREE.CylinderGeometry(0.28 * wheelScale, 0.28 * wheelScale, 0.18, 32);
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Multi-spoke design (Y-spoke pattern)
      for (let i = 0; i < 10; i++) {
        const spokeGeometry = new THREE.BoxGeometry(0.03, 0.26 * wheelScale, 0.02);
        const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.x = (i / 10) * Math.PI * 2;
        wheelGroup.add(spoke);

        // Accent on every other spoke
        if (i % 2 === 0) {
          const accentGeometry = new THREE.BoxGeometry(0.015, 0.24 * wheelScale, 0.025);
          const accent = new THREE.Mesh(accentGeometry, rimAccentMaterial);
          accent.rotation.z = Math.PI / 2;
          accent.rotation.x = (i / 10) * Math.PI * 2;
          wheelGroup.add(accent);
        }
      }

      // Center lock (single nut - racing style)
      const centerLockGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 6);
      const centerLock = new THREE.Mesh(centerLockGeometry, chromeMaterial);
      centerLock.rotation.z = Math.PI / 2;
      wheelGroup.add(centerLock);

      // Brake disc (carbon ceramic - large)
      const brakeDiscGeometry = new THREE.CylinderGeometry(0.22 * wheelScale, 0.22 * wheelScale, 0.025, 32);
      const brakeDisc = new THREE.Mesh(brakeDiscGeometry, new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.4,
        metalness: 0.8
      }));
      brakeDisc.rotation.z = Math.PI / 2;
      brakeDisc.position.x = pos.x > 0 ? -0.05 : 0.05;
      wheelGroup.add(brakeDisc);

      // Brake caliper (yellow - racing)
      const caliperGeometry = new THREE.BoxGeometry(0.05, 0.08, 0.1);
      const caliper = new THREE.Mesh(caliperGeometry, new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        roughness: 0.3,
        metalness: 0.6
      }));
      caliper.position.set(pos.x > 0 ? -0.08 : 0.08, 0.1, 0);
      wheelGroup.add(caliper);

      wheelGroup.position.set(pos.x, 0.32, pos.z);
      car.add(wheelGroup);
      wheels.push(tire);
    });

    // ========== ACCENT LIGHTING (Underglow - subtle) ==========
    const underglowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      emissive: 0x0088ff,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.8
    });

    // Front underglow
    const frontUnderglowGeometry = new THREE.BoxGeometry(1.2, 0.02, 0.05);
    const frontUnderglow = new THREE.Mesh(frontUnderglowGeometry, underglowMaterial);
    frontUnderglow.position.set(0, 0.12, 2.5);
    car.add(frontUnderglow);

    // Side underglows
    [-0.9, 0.9].forEach(x => {
      const sideUnderglowGeometry = new THREE.BoxGeometry(0.02, 0.02, 3.5);
      const sideUnderglow = new THREE.Mesh(sideUnderglowGeometry, underglowMaterial);
      sideUnderglow.position.set(x, 0.12, 0);
      car.add(sideUnderglow);
    });

    // Position car on road
    car.position.set(0, 0, 0);
    scene.add(car);

    if (sceneRefObj.current) {
      sceneRefObj.current.car = car;
      sceneRefObj.current.wheels = wheels;
    }
  };

  // Setup lighting
  const setupLighting = (scene: THREE.Scene, isDark: boolean) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x404060 : 0xffeedd,
      isDark ? 0.4 : 0.6
    );
    scene.add(ambientLight);

    // Main directional sunlight
    const sunLight = new THREE.DirectionalLight(
      isDark ? 0x8888cc : 0xffdd99,
      isDark ? 1.5 : 2.5
    );
    sunLight.position.set(50, 50, -100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(
      isDark ? 0x6666aa : 0xffeecc,
      isDark ? 0.3 : 0.5
    );
    fillLight.position.set(-30, 20, 50);
    scene.add(fillLight);

    // Rim light (backlight for car)
    const rimLight = new THREE.DirectionalLight(
      isDark ? 0xaaaaff : 0xffcc88,
      isDark ? 0.8 : 1.0
    );
    rimLight.position.set(0, 10, -50);
    scene.add(rimLight);
  };

  // Atmospheric particles (dust, sand)
  const createAtmosphericParticles = (scene: THREE.Scene, isDark: boolean) => {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: isDark ? 0x888899 : 0xddccaa,
      size: 0.3,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.name = 'dustParticles';
    scene.add(particleSystem);
  };

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current) return;

    const { scene, camera, renderer, car, wheels, clock, mouse, targetCameraOffset } = sceneRef.current;
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Smooth camera offset from mouse
    targetCameraOffset.x += (mouse.x * 2 - targetCameraOffset.x) * 0.02;
    targetCameraOffset.y += (mouse.y * 1 - targetCameraOffset.y) * 0.02;

    // Camera movement - tracking alongside car with subtle float
    const cameraFloat = Math.sin(elapsed * 0.5) * 0.2;
    camera.position.x = 8 + targetCameraOffset.x + Math.sin(elapsed * 0.3) * 0.5;
    camera.position.y = 3 + cameraFloat + targetCameraOffset.y * 0.5;
    camera.position.z = 12 + Math.cos(elapsed * 0.2) * 2;
    camera.lookAt(0, 1, 0);

    // Car movement - slow forward motion
    if (car) {
      car.position.z = ((elapsed * 5) % 100) - 50;
      
      // Subtle car body motion
      car.position.y = Math.sin(elapsed * 3) * 0.02;
      car.rotation.x = Math.sin(elapsed * 2) * 0.005;
    }

    // Wheel rotation (torus rotates around Z axis when rotated Y=PI/2)
    wheels.forEach(wheel => {
      wheel.rotation.z += delta * 8;
    });

    // Animate dust particles
    const dustParticles = scene.getObjectByName('dustParticles') as THREE.Points;
    if (dustParticles) {
      const positions = dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsed + i) * 0.01;
        positions[i + 1] += 0.01;
        if (positions[i + 1] > 20) positions[i + 1] = 0;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
      dustParticles.rotation.y = elapsed * 0.02;
    }

    renderer.render(scene, camera);
    sceneRef.current.animationId = requestAnimationFrame(animate);
  }, []);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sceneRef.current) return;
    
    sceneRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    sceneRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!sceneRef.current || !containerRef.current) return;
    
    const { camera, renderer } = sceneRef.current;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, []);

  // Setup and cleanup
  useEffect(() => {
    init();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [init, handleMouseMove, handleResize]);

  // Re-init on theme change
  useEffect(() => {
    if (sceneRef.current) {
      // Cleanup existing
      cancelAnimationFrame(sceneRef.current.animationId);
      sceneRef.current.renderer.dispose();
      if (containerRef.current && sceneRef.current.renderer.domElement) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      sceneRef.current = null;
    }
    init();
  }, [isDark, init]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ 
        background: isDark 
          ? 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a2e 100%)' 
          : 'linear-gradient(to bottom, #87CEEB 0%, #f4e4c9 100%)'
      }}
    >
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Heat distortion hint at horizon */}
      <div 
        className="absolute inset-x-0 top-[40%] h-20 pointer-events-none"
        style={{
          background: isDark 
            ? 'linear-gradient(to bottom, transparent, rgba(100,100,150,0.1), transparent)'
            : 'linear-gradient(to bottom, transparent, rgba(255,200,100,0.15), transparent)',
          filter: 'blur(2px)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />

      {/* Cinematic bars (optional) */}
      <div className="absolute inset-x-0 top-0 h-12 bg-black/30 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-black/30 pointer-events-none" />
    </div>
  );
};

export default DesertHighwayScene;
