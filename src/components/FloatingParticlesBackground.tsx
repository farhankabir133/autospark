import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Car, Star, Circle } from 'lucide-react';

interface FloatingParticlesBackgroundProps {
  theme: string;
  particleCount?: number;
  intensity?: 'subtle' | 'moderate' | 'high';
}

interface Particle {
  id: number;
  type: 'car' | 'star' | 'circle' | 'geometric';
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const FloatingParticlesBackground = ({
  theme,
  particleCount = 12,
  intensity = 'subtle',
}: FloatingParticlesBackgroundProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate particles
  useEffect(() => {
    const generatedParticles: Particle[] = Array.from(
      { length: particleCount },
      (_, i) => ({
        id: i,
        type: ['car', 'star', 'circle', 'geometric'][
          i % 4
        ] as 'car' | 'star' | 'circle' | 'geometric',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 20,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 2,
      })
    );
    setParticles(generatedParticles);
  }, [particleCount]);

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left - rect.width / 2) / 50,
        y: (e.clientY - rect.top - rect.height / 2) / 50,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const opacityMap = {
    subtle: { base: 0.1, hover: 0.2 },
    moderate: { base: 0.2, hover: 0.35 },
    high: { base: 0.3, hover: 0.5 },
  };

  const getParticleColor = (type: string) => {
    if (theme === 'dark') {
      switch (type) {
        case 'car':
          return 'text-blue-400/30';
        case 'star':
          return 'text-yellow-400/30';
        case 'circle':
          return 'text-purple-400/30';
        case 'geometric':
          return 'text-cyan-400/30';
        default:
          return 'text-gray-400/30';
      }
    } else {
      switch (type) {
        case 'car':
          return 'text-blue-300/20';
        case 'star':
          return 'text-yellow-300/20';
        case 'circle':
          return 'text-purple-300/20';
        case 'geometric':
          return 'text-cyan-300/20';
        default:
          return 'text-gray-300/20';
      }
    }
  };

  const renderParticle = (particle: Particle) => {
    const baseVariants = {
      initial: { opacity: 0, scale: 0 },
      animate: {
        opacity: [
          opacityMap[intensity].base,
          opacityMap[intensity].hover,
          opacityMap[intensity].base,
        ],
        scale: [0.8, 1.1, 0.8],
        y: [0, -30, 0],
        x: [-10, 10, -10],
      },
      transition: {
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    };

    switch (particle.type) {
      case 'car':
        return (
          <motion.div
            key={particle.id}
            className={`absolute ${getParticleColor('car')}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            variants={baseVariants}
            initial="initial"
            animate="animate"
          >
            <Car
              style={{
                width: particle.size,
                height: particle.size,
              }}
            />
          </motion.div>
        );

      case 'star':
        return (
          <motion.div
            key={particle.id}
            className={`absolute ${getParticleColor('star')}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            variants={{
              ...baseVariants,
              animate: {
                ...baseVariants.animate,
                rotate: [0, 360],
              },
            }}
            initial="initial"
            animate="animate"
          >
            <Star
              style={{
                width: particle.size,
                height: particle.size,
              }}
            />
          </motion.div>
        );

      case 'circle':
        return (
          <motion.div
            key={particle.id}
            className={`absolute ${getParticleColor('circle')}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            variants={{
              ...baseVariants,
              animate: {
                ...baseVariants.animate,
                scale: [0.8, 1.3, 0.8],
              },
            }}
            initial="initial"
            animate="animate"
          >
            <Circle
              style={{
                width: particle.size,
                height: particle.size,
              }}
            />
          </motion.div>
        );

      case 'geometric':
        return (
          <motion.div
            key={particle.id}
            className={`absolute ${getParticleColor('geometric')}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              rotate: [0, 180, 360],
              y: [0, -40, 0],
              opacity: [
                opacityMap[intensity].base,
                opacityMap[intensity].hover,
                opacityMap[intensity].base,
              ],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Morphing geometric shape */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <motion.polygon
                points="50,10 90,40 70,90 30,90 10,40"
                animate={{
                  points: [
                    '50,10 90,40 70,90 30,90 10,40',
                    '50,20 85,35 75,85 25,85 15,35',
                    '50,10 90,40 70,90 30,90 10,40',
                  ],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
      }}
    >
      {/* Base gradient backdrop */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/50'
            : 'bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30'
        }`}
      />

      {/* Animated particles with parallax */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: 0.5,
        }}
      >
        {particles.map((particle) => renderParticle(particle))}
      </motion.div>

      {/* Morphing circles background elements */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated morphing blob 1 */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill={theme === 'dark' ? '#3b82f6' : '#dbeafe'}
          opacity="0.03"
          animate={{
            r: [150, 200, 150],
            cx: [200, 250, 200],
            cy: [200, 150, 200],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Animated morphing blob 2 */}
        <motion.circle
          cx="800"
          cy="300"
          r="180"
          fill={theme === 'dark' ? '#a855f7' : '#e9d5ff'}
          opacity="0.03"
          animate={{
            r: [180, 220, 180],
            cx: [800, 750, 800],
            cy: [300, 350, 300],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Animated morphing blob 3 */}
        <motion.circle
          cx="500"
          cy="800"
          r="200"
          fill={theme === 'dark' ? '#06b6d4' : '#cffafe'}
          opacity="0.02"
          animate={{
            r: [200, 250, 200],
            cx: [500, 450, 500],
            cy: [800, 750, 800],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Pulsing gradient circles */}
        {[1, 2, 3, 4].map((circle) => (
          <motion.circle
            key={`pulse-${circle}`}
            cx={250 * circle}
            cy={250 * circle}
            r="50"
            fill="none"
            stroke={theme === 'dark' ? '#3b82f6' : '#60a5fa'}
            strokeWidth="1"
            opacity="0.1"
            animate={{
              r: [50, 100, 50],
              opacity: [0.1, 0.05, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: circle * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
};
