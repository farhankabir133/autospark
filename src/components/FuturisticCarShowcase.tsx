import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FuturisticCarShowcase.css';

interface AnimationValues {
  // Scroll progress
  scrollProgress: number;
  
  // Car reveal
  carMaskPosition: number;
  carOpacity: number;
  carRotateY: number;
  carScale: number;
  carTranslateY: number;
  
  // Scanning light
  scanLinePosition: number;
  scanLineOpacity: number;
  
  // Headline
  headlineScale: number;
  headlineOpacity: number;
  headlineRotateZ: number;
  
  // Specs labels
  specsOpacity: number;
  specsLabelScale: number;
  
  // Background layers
  particleOpacity: number;
  gridOpacity: number;
  horizonGlowIntensity: number;
  
  // CTA
  ctaOpacity: number;
  ctaBorderProgress: number;
}

const FuturisticCarShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const carImageRef = useRef<HTMLImageElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const specsContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  const [inView, setInView] = useState(false);
  
  const animationValuesRef = useRef<AnimationValues>({
    scrollProgress: 0,
    carMaskPosition: -100,
    carOpacity: 0,
    carRotateY: 0,
    carScale: 0.8,
    carTranslateY: 50,
    scanLinePosition: 0,
    scanLineOpacity: 0,
    headlineScale: 1.5,
    headlineOpacity: 0,
    headlineRotateZ: 0,
    specsOpacity: 0,
    specsLabelScale: 0,
    particleOpacity: 0,
    gridOpacity: 0,
    horizonGlowIntensity: 0,
    ctaOpacity: 0,
    ctaBorderProgress: 0,
  });

  const animationFrameRef = useRef<number>();

  // Calculate scroll progress
  const calculateScrollProgress = useCallback(() => {
    if (!sectionRef.current || !containerRef.current) return 0;

    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    
    let progress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
    progress = Math.max(0, Math.min(1, progress));
    
    return progress;
  }, []);

  // Update animation values based on scroll progress
  const updateAnimationValues = useCallback((progress: number) => {
    const values = animationValuesRef.current;

    // STAGE 1 (0-0.15): Void opens - thin glow line appears
    if (progress < 0.15) {
      const stageProgress = progress / 0.15;
      values.scanLinePosition = stageProgress * 120 - 20;
      values.scanLineOpacity = Math.sin(stageProgress * Math.PI) * 0.8;
      values.particleOpacity = stageProgress * 0.3;
      values.gridOpacity = stageProgress * 0.15;
      values.horizonGlowIntensity = stageProgress * 0.5;
      values.carMaskPosition = -100 + stageProgress * 20;
      values.carOpacity = 0;
    }
    // STAGE 2 (0.15-0.35): Car reveals with mask wipe
    else if (progress < 0.35) {
      const stageProgress = (progress - 0.15) / 0.2;
      values.scanLinePosition = 100 + stageProgress * 80;
      values.scanLineOpacity = Math.max(0, 0.8 - stageProgress * 1.5);
      values.carMaskPosition = -80 + stageProgress * 180;
      values.carOpacity = stageProgress;
      values.carScale = 0.8 + stageProgress * 0.15;
      values.carTranslateY = 50 - stageProgress * 40;
      values.particleOpacity = 0.3 + stageProgress * 0.2;
      values.gridOpacity = 0.15 + stageProgress * 0.25;
      values.horizonGlowIntensity = 0.5 + stageProgress * 0.4;
    }
    // STAGE 3 (0.35-0.6): Car rotates, headline appears, specs animate in
    else if (progress < 0.6) {
      const stageProgress = (progress - 0.35) / 0.25;
      values.scanLinePosition = 180;
      values.scanLineOpacity = 0;
      values.carMaskPosition = 100;
      values.carOpacity = 1;
      values.carRotateY = stageProgress * 15;
      values.carScale = 0.95 + stageProgress * 0.05;
      values.carTranslateY = 10;
      values.headlineOpacity = stageProgress;
      values.headlineScale = 1.5 - stageProgress * 0.3;
      values.headlineRotateZ = stageProgress * 5;
      values.specsOpacity = Math.max(0, stageProgress - 0.3);
      values.specsLabelScale = 0.8 + stageProgress * 0.2;
      values.particleOpacity = 0.5;
      values.gridOpacity = 0.4;
      values.horizonGlowIntensity = 0.9;
    }
    // STAGE 4 (0.6-1.0): Specs stabilize, CTA appears with border trace
    else {
      const stageProgress = (progress - 0.6) / 0.4;
      values.carMaskPosition = 100;
      values.carOpacity = 1;
      values.carRotateY = 15;
      values.carScale = 1;
      values.carTranslateY = 10;
      values.headlineOpacity = 1;
      values.headlineScale = 1.2;
      values.headlineRotateZ = 5;
      values.specsOpacity = 1;
      values.specsLabelScale = 1;
      values.ctaOpacity = stageProgress;
      values.ctaBorderProgress = stageProgress;
      values.particleOpacity = 0.5;
      values.gridOpacity = 0.4;
      values.horizonGlowIntensity = 0.9;
    }

    values.scrollProgress = progress;

    // Apply transforms to DOM elements
    applyDOMUpdates(values);
  }, []);

  const applyDOMUpdates = useCallback((values: AnimationValues) => {
    // Update car image
    if (carImageRef.current) {
      carImageRef.current.style.setProperty('--mask-position', `${values.carMaskPosition}%`);
      carImageRef.current.style.opacity = `${values.carOpacity}`;
      carImageRef.current.style.transform = `
        rotateY(${values.carRotateY}deg)
        scale(${values.carScale})
        translateY(${values.carTranslateY}px)
      `;
    }

    // Update headline
    if (headlineRef.current) {
      headlineRef.current.style.opacity = `${values.headlineOpacity}`;
      headlineRef.current.style.transform = `
        scale(${values.headlineScale})
        rotateZ(${values.headlineRotateZ}deg)
      `;
    }

    // Update specs container
    if (specsContainerRef.current) {
      specsContainerRef.current.style.opacity = `${values.specsOpacity}`;
      specsContainerRef.current.style.setProperty('--label-scale', `${values.specsLabelScale}`);
    }

    // Update CTA
    if (ctaRef.current) {
      ctaRef.current.style.opacity = `${values.ctaOpacity}`;
      ctaRef.current.style.setProperty('--border-progress', `${values.ctaBorderProgress}`);
    }

    // Update background canvas opacity values
    document.documentElement.style.setProperty('--particle-opacity', `${values.particleOpacity}`);
    document.documentElement.style.setProperty('--grid-opacity', `${values.gridOpacity}`);
    document.documentElement.style.setProperty('--horizon-glow', `${values.horizonGlowIntensity}`);
  }, []);

  // Draw particles on canvas
  const drawParticles = useCallback(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
    
    // Create stable particle positions based on scroll progress
    const particleCount = 50;
    const progress = animationValuesRef.current.scrollProgress;
    
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 12.9898;
      const x = (Math.sin(seed) * 0.5 + 0.5) * canvas.width;
      const y = (Math.cos(seed + progress * 10) * 0.5 + 0.5) * canvas.height;
      const size = 1 + Math.sin(seed * 3) * 0.5;
      
      ctx.fillRect(x, y, size, size);
    }
  }, []);

  // Draw grid floor on canvas
  const drawGrid = useCallback(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 1;

    const gridSize = 80;
    const gridOffsetY = canvas.height * 0.6;
    const perspective = 500;

    for (let x = -4; x < 5; x++) {
      for (let z = 1; z < 6; z++) {
        const scale = perspective / (perspective + z * 100);
        const y1 = gridOffsetY + z * 40 * scale;
        const x1 = canvas.width / 2 + x * gridSize * scale;
        const x2 = canvas.width / 2 + (x + 1) * gridSize * scale;

        if (y1 < canvas.height) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y1);
          ctx.stroke();
        }
      }
    }
  }, []);

  // Main scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (!inView) return;

      const progress = calculateScrollProgress();
      updateAnimationValues(progress);
      drawParticles();
      drawGrid();
    });
  }, [inView, calculateScrollProgress, updateAnimationValues, drawParticles, drawGrid]);

  // IntersectionObserver for viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  // Initial draw
  useEffect(() => {
    drawParticles();
    drawGrid();
  }, [drawParticles, drawGrid]);

  return (
    <section ref={sectionRef} className="dimensional-showcase">
      {/* Background layers */}
      <div className="bg-void" />
      
      {/* Particles canvas */}
      <canvas ref={particlesCanvasRef} className="particles-canvas" />
      
      {/* Grid floor canvas */}
      <canvas ref={gridCanvasRef} className="grid-canvas" />
      
      {/* Horizon glow */}
      <div className="horizon-glow" />

      {/* Main content container */}
      <div ref={containerRef} className="showcase-container">
        {/* Headline - positioned behind car, oversized */}
        <div ref={headlineRef} className="dimensional-headline">
          <h1>DIMENSIONED REALITY</h1>
          <p>The Future Arrives</p>
        </div>

        {/* Car display area with mask animation */}
        <div className="car-reveal-zone">
          <img
            ref={carImageRef}
            src="https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=1200&fm=webp"
            alt="Futuristic Vehicle"
            className="dimensional-car"
            loading="lazy"
            decoding="async"
          />
          
          {/* Scanning light overlay */}
          <div className="scan-light-overlay">
            <canvas ref={scanCanvasRef} className="scan-canvas" />
          </div>
        </div>

        {/* Floating specs labels around car */}
        <div ref={specsContainerRef} className="specs-annotations">
          <div className="spec-label top-left" data-x="15" data-y="20">
            <span className="spec-value">650 HP</span>
            <span className="spec-name">Peak Power</span>
            <div className="connecting-line" />
          </div>
          
          <div className="spec-label top-right" data-x="85" data-y="15">
            <span className="spec-name">Range</span>
            <span className="spec-value">380 km</span>
            <div className="connecting-line" />
          </div>
          
          <div className="spec-label bottom-right" data-x="80" data-y="85">
            <span className="spec-value">98%</span>
            <span className="spec-name">Efficiency</span>
            <div className="connecting-line" />
          </div>
          
          <div className="spec-label bottom-left" data-x="20" data-y="80">
            <span className="spec-name">Level 5</span>
            <span className="spec-value">Autonomous</span>
            <div className="connecting-line" />
          </div>

          <div className="spec-label top-center" data-x="50" data-y="10">
            <span className="spec-name">Technology</span>
            <span className="spec-value">Quantum Core</span>
            <div className="connecting-line" />
          </div>
        </div>

        {/* CTA with animated border trace */}
        <button ref={ctaRef} className="dimensional-cta">
          <span className="cta-text">Initialize Sequence</span>
          <div className="cta-border-trace" />
        </button>
      </div>
    </section>
  );
};

export default FuturisticCarShowcase;
