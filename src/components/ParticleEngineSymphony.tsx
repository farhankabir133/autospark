import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface ParticleEngineSymphonyProps {
  particleCount?: number;
  morphSpeed?: number;
  mouseInfluence?: number;
}

// Car silhouette coordinate data (normalized 0-1)
const carShapes = {
  sedan: [
    // Body outline
    { x: 0.1, y: 0.6 }, { x: 0.15, y: 0.55 }, { x: 0.2, y: 0.5 }, { x: 0.25, y: 0.45 },
    { x: 0.3, y: 0.4 }, { x: 0.35, y: 0.38 }, { x: 0.4, y: 0.35 }, { x: 0.45, y: 0.33 },
    { x: 0.5, y: 0.32 }, { x: 0.55, y: 0.33 }, { x: 0.6, y: 0.35 }, { x: 0.65, y: 0.38 },
    { x: 0.7, y: 0.42 }, { x: 0.75, y: 0.48 }, { x: 0.8, y: 0.52 }, { x: 0.85, y: 0.55 },
    { x: 0.9, y: 0.6 }, { x: 0.88, y: 0.65 }, { x: 0.85, y: 0.68 },
    // Bottom line
    { x: 0.8, y: 0.7 }, { x: 0.7, y: 0.7 }, { x: 0.6, y: 0.7 }, { x: 0.5, y: 0.7 },
    { x: 0.4, y: 0.7 }, { x: 0.3, y: 0.7 }, { x: 0.2, y: 0.7 }, { x: 0.15, y: 0.68 },
    { x: 0.12, y: 0.65 },
    // Wheels
    { x: 0.22, y: 0.72 }, { x: 0.24, y: 0.74 }, { x: 0.26, y: 0.72 }, { x: 0.24, y: 0.7 },
    { x: 0.72, y: 0.72 }, { x: 0.74, y: 0.74 }, { x: 0.76, y: 0.72 }, { x: 0.74, y: 0.7 },
    // Windows
    { x: 0.35, y: 0.42 }, { x: 0.4, y: 0.4 }, { x: 0.45, y: 0.38 }, { x: 0.5, y: 0.37 },
    { x: 0.55, y: 0.38 }, { x: 0.6, y: 0.4 }, { x: 0.65, y: 0.42 },
    // Hood details
    { x: 0.75, y: 0.5 }, { x: 0.78, y: 0.52 }, { x: 0.82, y: 0.54 },
    // Trunk details
    { x: 0.15, y: 0.52 }, { x: 0.18, y: 0.5 }, { x: 0.22, y: 0.48 },
  ],
  suv: [
    // Boxy SUV shape
    { x: 0.1, y: 0.55 }, { x: 0.12, y: 0.5 }, { x: 0.15, y: 0.4 }, { x: 0.18, y: 0.35 },
    { x: 0.22, y: 0.32 }, { x: 0.3, y: 0.3 }, { x: 0.4, y: 0.28 }, { x: 0.5, y: 0.28 },
    { x: 0.6, y: 0.28 }, { x: 0.7, y: 0.3 }, { x: 0.75, y: 0.35 }, { x: 0.8, y: 0.4 },
    { x: 0.85, y: 0.48 }, { x: 0.88, y: 0.55 }, { x: 0.9, y: 0.6 },
    // Bottom
    { x: 0.88, y: 0.68 }, { x: 0.8, y: 0.7 }, { x: 0.7, y: 0.72 }, { x: 0.6, y: 0.72 },
    { x: 0.5, y: 0.72 }, { x: 0.4, y: 0.72 }, { x: 0.3, y: 0.72 }, { x: 0.2, y: 0.7 },
    { x: 0.12, y: 0.68 },
    // Wheels (larger)
    { x: 0.2, y: 0.74 }, { x: 0.22, y: 0.77 }, { x: 0.25, y: 0.77 }, { x: 0.27, y: 0.74 },
    { x: 0.7, y: 0.74 }, { x: 0.72, y: 0.77 }, { x: 0.75, y: 0.77 }, { x: 0.77, y: 0.74 },
    // Roof rails
    { x: 0.25, y: 0.28 }, { x: 0.35, y: 0.26 }, { x: 0.45, y: 0.25 }, { x: 0.55, y: 0.25 },
    { x: 0.65, y: 0.26 }, { x: 0.75, y: 0.28 },
    // Windows
    { x: 0.2, y: 0.38 }, { x: 0.3, y: 0.35 }, { x: 0.4, y: 0.33 }, { x: 0.5, y: 0.32 },
    { x: 0.6, y: 0.33 }, { x: 0.7, y: 0.35 }, { x: 0.8, y: 0.42 },
  ],
  sports: [
    // Low sleek sports car
    { x: 0.08, y: 0.58 }, { x: 0.12, y: 0.55 }, { x: 0.18, y: 0.52 }, { x: 0.25, y: 0.48 },
    { x: 0.32, y: 0.44 }, { x: 0.4, y: 0.42 }, { x: 0.48, y: 0.4 }, { x: 0.55, y: 0.4 },
    { x: 0.62, y: 0.42 }, { x: 0.7, y: 0.45 }, { x: 0.78, y: 0.5 }, { x: 0.85, y: 0.54 },
    { x: 0.9, y: 0.58 }, { x: 0.92, y: 0.62 },
    // Bottom (very low)
    { x: 0.9, y: 0.66 }, { x: 0.82, y: 0.67 }, { x: 0.7, y: 0.67 }, { x: 0.58, y: 0.67 },
    { x: 0.46, y: 0.67 }, { x: 0.34, y: 0.67 }, { x: 0.22, y: 0.67 }, { x: 0.1, y: 0.65 },
    // Wheels (wide)
    { x: 0.18, y: 0.69 }, { x: 0.2, y: 0.72 }, { x: 0.24, y: 0.72 }, { x: 0.26, y: 0.69 },
    { x: 0.74, y: 0.69 }, { x: 0.76, y: 0.72 }, { x: 0.8, y: 0.72 }, { x: 0.82, y: 0.69 },
    // Spoiler
    { x: 0.1, y: 0.52 }, { x: 0.08, y: 0.48 }, { x: 0.12, y: 0.48 }, { x: 0.14, y: 0.5 },
    // Hood vents
    { x: 0.6, y: 0.44 }, { x: 0.65, y: 0.44 }, { x: 0.7, y: 0.46 }, { x: 0.75, y: 0.48 },
    // Side intakes
    { x: 0.45, y: 0.55 }, { x: 0.5, y: 0.55 }, { x: 0.55, y: 0.55 },
  ],
  pickup: [
    // Pickup truck
    { x: 0.05, y: 0.5 }, { x: 0.08, y: 0.48 }, { x: 0.12, y: 0.48 }, { x: 0.18, y: 0.48 },
    { x: 0.25, y: 0.48 }, { x: 0.32, y: 0.48 }, { x: 0.38, y: 0.45 }, { x: 0.42, y: 0.4 },
    { x: 0.45, y: 0.35 }, { x: 0.5, y: 0.32 }, { x: 0.58, y: 0.32 }, { x: 0.65, y: 0.35 },
    { x: 0.7, y: 0.42 }, { x: 0.75, y: 0.5 }, { x: 0.82, y: 0.55 }, { x: 0.88, y: 0.58 },
    { x: 0.92, y: 0.6 }, { x: 0.95, y: 0.62 },
    // Bottom
    { x: 0.93, y: 0.72 }, { x: 0.85, y: 0.74 }, { x: 0.75, y: 0.74 }, { x: 0.65, y: 0.74 },
    { x: 0.55, y: 0.74 }, { x: 0.45, y: 0.74 }, { x: 0.35, y: 0.74 }, { x: 0.25, y: 0.74 },
    { x: 0.15, y: 0.72 }, { x: 0.08, y: 0.68 }, { x: 0.05, y: 0.6 },
    // Wheels (big)
    { x: 0.18, y: 0.76 }, { x: 0.21, y: 0.8 }, { x: 0.26, y: 0.8 }, { x: 0.29, y: 0.76 },
    { x: 0.75, y: 0.76 }, { x: 0.78, y: 0.8 }, { x: 0.83, y: 0.8 }, { x: 0.86, y: 0.76 },
    // Bed rails
    { x: 0.08, y: 0.46 }, { x: 0.15, y: 0.45 }, { x: 0.22, y: 0.45 }, { x: 0.3, y: 0.45 },
    // Cab windows
    { x: 0.5, y: 0.36 }, { x: 0.55, y: 0.35 }, { x: 0.6, y: 0.36 }, { x: 0.65, y: 0.38 },
  ],
};

export const ParticleEngineSymphony: React.FC<ParticleEngineSymphonyProps> = ({
  particleCount = 2500,
  morphSpeed = 0.03,
  mouseInfluence = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false });
  const animationRef = useRef<number>(0);
  const currentShapeRef = useRef<number>(0);
  const lastMorphTimeRef = useRef<number>(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const shapeKeys = useMemo(() => Object.keys(carShapes) as (keyof typeof carShapes)[], []);

  // Get colors based on theme
  const getParticleColor = useCallback((index: number): string => {
    if (isDark) {
      const colors = [
        'rgba(59, 130, 246, 1)',   // Blue
        'rgba(139, 92, 246, 1)',   // Purple  
        'rgba(6, 182, 212, 1)',    // Cyan
        'rgba(236, 72, 153, 1)',   // Pink
        'rgba(34, 211, 238, 1)',   // Light cyan
        'rgba(167, 139, 250, 1)', // Light purple
      ];
      return colors[index % colors.length];
    } else {
      const colors = [
        'rgba(37, 99, 235, 1)',    // Blue
        'rgba(109, 40, 217, 1)',   // Purple
        'rgba(8, 145, 178, 1)',    // Cyan
        'rgba(219, 39, 119, 1)',   // Pink
        'rgba(14, 165, 233, 1)',   // Sky
        'rgba(124, 58, 237, 1)',   // Violet
      ];
      return colors[index % colors.length];
    }
  }, [isDark]);

  // Generate target points for a shape
  const generateShapePoints = useCallback((shapeKey: keyof typeof carShapes, width: number, height: number) => {
    const shape = carShapes[shapeKey];
    const points: { x: number; y: number }[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.7;
    const offsetX = centerX - scale * 0.5;
    const offsetY = centerY - scale * 0.25;

    // Generate more points by interpolation
    const targetCount = particleCount;
    const basePoints = shape.length;
    const repeats = Math.ceil(targetCount / basePoints);

    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < basePoints; i++) {
        const point = shape[i];
        // Add some randomness around each point
        const jitterX = (Math.random() - 0.5) * 0.05;
        const jitterY = (Math.random() - 0.5) * 0.05;
        points.push({
          x: offsetX + (point.x + jitterX) * scale,
          y: offsetY + (point.y + jitterY) * scale,
        });
      }
    }

    // Trim to exact count
    return points.slice(0, targetCount);
  }, [particleCount]);

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const initialShape = shapeKeys[0];
    const targetPoints = generateShapePoints(initialShape, width, height);

    for (let i = 0; i < particleCount; i++) {
      const target = targetPoints[i] || { x: width / 2, y: height / 2 };
      // Start scattered
      const startX = Math.random() * width;
      const startY = Math.random() * height;

      particles.push({
        x: startX,
        y: startY,
        targetX: target.x,
        targetY: target.y,
        originX: target.x,
        originY: target.y,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 1,
        color: getParticleColor(i),
        alpha: Math.random() * 0.5 + 0.5,
        life: Math.random(),
      });
    }

    particlesRef.current = particles;
  }, [particleCount, shapeKeys, generateShapePoints, getParticleColor]);

  // Update particle targets to new shape
  const morphToShape = useCallback((shapeIndex: number, width: number, height: number) => {
    const shapeKey = shapeKeys[shapeIndex % shapeKeys.length];
    const targetPoints = generateShapePoints(shapeKey, width, height);
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const target = targetPoints[i] || { x: width / 2, y: height / 2 };
      particles[i].targetX = target.x;
      particles[i].targetY = target.y;
      particles[i].originX = target.x;
      particles[i].originY = target.y;
    }
  }, [shapeKeys, generateShapePoints]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const now = Date.now();

    // Clear canvas with fade effect
    ctx.fillStyle = isDark ? 'rgba(3, 7, 18, 0.15)' : 'rgba(248, 250, 252, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // Auto-morph every 5 seconds
    if (now - lastMorphTimeRef.current > 5000) {
      currentShapeRef.current = (currentShapeRef.current + 1) % shapeKeys.length;
      morphToShape(currentShapeRef.current, width, height);
      lastMorphTimeRef.current = now;
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Calculate distance to mouse
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Mouse repulsion/attraction
      if (dist < mouseInfluence && mouse.isActive) {
        const force = (mouseInfluence - dist) / mouseInfluence;
        const angle = Math.atan2(dy, dx);
        // Magnetic attraction effect
        p.vx += Math.cos(angle) * force * 2;
        p.vy += Math.sin(angle) * force * 2;
      }

      // Move towards target (spring physics)
      const targetDx = p.targetX - p.x;
      const targetDy = p.targetY - p.y;
      
      p.vx += targetDx * morphSpeed;
      p.vy += targetDy * morphSpeed;

      // Apply friction
      p.vx *= 0.92;
      p.vy *= 0.92;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Pulsing alpha
      p.life += 0.02;
      const pulse = Math.sin(p.life) * 0.3 + 0.7;

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      const baseColor = p.color.replace('1)', `${p.alpha * pulse})`);
      const glowColor = p.color.replace('1)', '0)');
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.5, p.color.replace('1)', `${p.alpha * pulse * 0.5})`));
      gradient.addColorStop(1, glowColor);
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }

    // Draw connecting lines between nearby particles
    ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(109, 40, 217, 0.05)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i += 3) {
      for (let j = i + 1; j < particles.length; j += 3) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 50) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isDark, morphSpeed, mouseInfluence, morphToShape, shapeKeys]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Reinitialize particles on resize
    initParticles(rect.width, rect.height);
    lastMorphTimeRef.current = Date.now();
  }, [initParticles]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isActive: true,
    };
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isActive = false;
  }, []);

  // Handle touch
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      isActive: true,
    };
  }, []);

  // Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    lastMorphTimeRef.current = Date.now();
    
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [handleResize, handleMouseMove, handleMouseLeave, handleTouchMove, animate]);

  // Update colors when theme changes
  useEffect(() => {
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      particles[i].color = getParticleColor(i);
    }
  }, [isDark, getParticleColor]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950' 
          : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
      }`} />
      
      {/* Ambient glow spots */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute w-[600px] h-[600px] rounded-full blur-3xl ${
          isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'
        }`} style={{ top: '10%', left: '10%' }} />
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl ${
          isDark ? 'bg-purple-600/10' : 'bg-purple-400/10'
        }`} style={{ bottom: '10%', right: '10%' }} />
        <div className={`absolute w-[400px] h-[400px] rounded-full blur-3xl ${
          isDark ? 'bg-cyan-500/8' : 'bg-cyan-400/8'
        }`} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Subtle grid overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none ${isDark ? 'opacity-5' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), 
                           linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Shape indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 ${
        isDark ? 'opacity-40' : 'opacity-30'
      }`}>
        {shapeKeys.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentShapeRef.current 
                ? (isDark ? 'bg-blue-400 scale-125' : 'bg-blue-600 scale-125')
                : (isDark ? 'bg-gray-600' : 'bg-gray-400')
            }`}
          />
        ))}
      </div>

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
            : 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%)'
        }}
      />
    </div>
  );
};

export default ParticleEngineSymphony;
