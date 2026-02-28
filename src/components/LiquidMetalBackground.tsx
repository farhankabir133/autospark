import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LiquidMetalBackgroundProps {
  className?: string;
  intensity?: number;
  speed?: number;
}

/**
 * LiquidMetalBackground - Ultra-premium WebGL liquid chrome effect
 * Creates a flowing metallic surface that reacts to mouse movement
 * Optimized for both light and dark modes
 */
export const LiquidMetalBackground = ({
  className = '',
  intensity = 1.0,
  speed = 1.0,
}: LiquidMetalBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const timeRef = useRef(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Vertex shader - simple fullscreen quad
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Fragment shader - liquid metal effect
  const fragmentShaderSource = `
    precision highp float;
    
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_isDark;
    
    // Simplex noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Fractal Brownian Motion for complex noise
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for(int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }
    
    // Create ripple effect from mouse position
    float ripple(vec2 uv, vec2 center, float time) {
      float dist = length(uv - center);
      float wave = sin(dist * 20.0 - time * 3.0) * exp(-dist * 3.0);
      return wave * 0.15;
    }
    
    void main() {
      vec2 uv = v_uv;
      vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 uvAspect = uv * aspect;
      
      float time = u_time * 0.3;
      
      // Mouse influence - creates flowing distortion towards cursor
      vec2 mouseAspect = u_mouse * aspect;
      vec2 toMouse = mouseAspect - uvAspect;
      float mouseDist = length(toMouse);
      float mouseInfluence = exp(-mouseDist * 2.0) * u_intensity;
      
      // Multiple layers of flowing noise
      float flow1 = fbm(uvAspect * 2.0 + vec2(time * 0.5, time * 0.3));
      float flow2 = fbm(uvAspect * 3.0 - vec2(time * 0.4, time * 0.2) + vec2(flow1 * 0.5));
      float flow3 = fbm(uvAspect * 4.0 + vec2(time * 0.3, -time * 0.4) + vec2(flow2 * 0.3));
      
      // Combine flows with mouse distortion
      vec2 distortedUV = uv;
      distortedUV += toMouse * mouseInfluence * 0.1;
      distortedUV += vec2(flow1, flow2) * 0.05 * u_intensity;
      
      // Add ripple from mouse
      float mouseRipple = ripple(uvAspect, mouseAspect, u_time * 2.0) * mouseInfluence * 2.0;
      
      // Calculate "height" for lighting
      float height = flow1 * 0.4 + flow2 * 0.3 + flow3 * 0.3;
      height += mouseRipple;
      
      // Calculate normals for metallic reflection
      float eps = 0.01;
      float heightR = fbm((uvAspect + vec2(eps, 0.0)) * 2.0 + vec2(time * 0.5, time * 0.3));
      float heightU = fbm((uvAspect + vec2(0.0, eps)) * 2.0 + vec2(time * 0.5, time * 0.3));
      vec3 normal = normalize(vec3(height - heightR, height - heightU, eps * 2.0));
      
      // Light direction (from top-right, animated slightly)
      vec3 lightDir = normalize(vec3(
        0.5 + sin(time * 0.5) * 0.2,
        0.8 + cos(time * 0.3) * 0.1,
        1.0
      ));
      
      // View direction
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      
      // Lighting calculations
      float diffuse = max(dot(normal, lightDir), 0.0);
      float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Color palette based on theme
      vec3 baseColorDark, highlightColorDark, accentColorDark;
      vec3 baseColorLight, highlightColorLight, accentColorLight;
      
      // Dark mode - deep metallic chrome with blue/purple tints
      baseColorDark = vec3(0.08, 0.09, 0.12);
      highlightColorDark = vec3(0.4, 0.45, 0.55);
      accentColorDark = vec3(0.3, 0.5, 0.9);
      
      // Light mode - silver/pearl with warm golden highlights
      baseColorLight = vec3(0.85, 0.87, 0.9);
      highlightColorLight = vec3(0.95, 0.93, 0.88);
      accentColorLight = vec3(0.7, 0.75, 0.85);
      
      // Interpolate based on theme
      vec3 baseColor = mix(baseColorLight, baseColorDark, u_isDark);
      vec3 highlightColor = mix(highlightColorLight, highlightColorDark, u_isDark);
      vec3 accentColor = mix(accentColorLight, accentColorDark, u_isDark);
      
      // Create iridescent color shift based on viewing angle
      float iridescence = sin(height * 10.0 + time) * 0.5 + 0.5;
      vec3 iridescentColor = mix(
        vec3(0.4, 0.6, 1.0),
        vec3(0.8, 0.4, 0.9),
        iridescence
      );
      
      // Compose final color
      vec3 color = baseColor;
      
      // Add diffuse lighting
      color = mix(color, highlightColor, diffuse * 0.6);
      
      // Add specular highlights (chrome reflection)
      color += specular * highlightColor * 1.5;
      
      // Add fresnel rim lighting
      color = mix(color, accentColor, fresnel * 0.4);
      
      // Add subtle iridescence
      color = mix(color, iridescentColor, fresnel * 0.15 * u_intensity);
      
      // Add mouse glow
      float mouseGlow = exp(-mouseDist * 4.0) * 0.3 * u_intensity;
      vec3 glowColor = u_isDark > 0.5 ? vec3(0.4, 0.6, 1.0) : vec3(0.6, 0.7, 0.9);
      color += glowColor * mouseGlow;
      
      // Add flowing caustics pattern
      float caustics = pow(abs(sin(flow1 * 8.0 + time * 2.0) * sin(flow2 * 6.0 - time * 1.5)), 4.0);
      color += caustics * highlightColor * 0.2;
      
      // Vignette
      float vignette = 1.0 - length((uv - 0.5) * 1.2);
      vignette = smoothstep(0.0, 0.7, vignette);
      color *= mix(0.7, 1.0, vignette);
      
      // Tone mapping and gamma correction
      color = color / (color + vec3(1.0));
      color = pow(color, vec3(1.0 / 2.2));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Create and compile shader
  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);

  // Create program
  const createProgram = useCallback((gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }, []);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
    });
    
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS');
      return;
    }
    
    glRef.current = gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    
    programRef.current = program;
    gl.useProgram(program);

    // Create fullscreen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Handle resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createShader, createProgram, vertexShaderSource, fragmentShaderSource]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !e.touches[0]) return;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.touches[0].clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1.0 - (e.touches[0].clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    
    if (!gl || !program || !canvas) return;

    const render = () => {
      // Smooth mouse interpolation
      const lerpFactor = 0.08;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpFactor;
      
      timeRef.current += 0.016 * speed;

      // Set uniforms
      const timeLocation = gl.getUniformLocation(program, 'u_time');
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
      const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
      const isDarkLocation = gl.getUniformLocation(program, 'u_isDark');

      gl.uniform1f(timeLocation, timeRef.current);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(intensityLocation, intensity);
      gl.uniform1f(isDarkLocation, isDark ? 1.0 : 0.0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, intensity, speed]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Fallback gradient for devices without WebGL */}
      <noscript>
        <div 
          className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900' 
              : 'bg-gradient-to-br from-gray-100 via-blue-100/50 to-gray-100'
          }`}
        />
      </noscript>
      
      {/* Subtle overlay for text readability */}
      <div 
        className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-b from-black/20 via-transparent to-black/40' 
            : 'bg-gradient-to-b from-white/10 via-transparent to-white/20'
        }`}
      />
    </div>
  );
};

export default LiquidMetalBackground;
