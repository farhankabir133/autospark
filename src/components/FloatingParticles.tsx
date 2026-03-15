import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  theme: string;
  speed?: 'slow' | 'normal' | 'fast';
  particleColor?: string;
}

export const FloatingParticles = ({
  count = 30,
  theme,
  speed = 'normal',
  particleColor,
}: FloatingParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const speedMap = {
    slow: 15,
    normal: 8,
    fast: 5,
  };

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: speedMap[speed] + Math.random() * 5,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, [count, speed]);

  const color = particleColor
    ? particleColor
    : theme === 'dark'
      ? 'rgba(147, 197, 253, 0.4)'
      : 'rgba(59, 130, 246, 0.3)';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: 'blur(0.5px)',
          }}
          initial={{
            y: 0,
            opacity: particle.opacity,
          }}
          animate={{
            y: -window.innerHeight * 1.5,
            opacity: [particle.opacity, particle.opacity * 0.3, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

interface OrbitingParticlesProps {
  theme: string;
  count?: number;
  radius?: number;
}

export const OrbitingParticles = ({
  theme,
  count = 8,
  radius = 150,
}: OrbitingParticlesProps) => {
  const color = theme === 'dark' ? 'rgb(59, 130, 246)' : 'rgb(59, 130, 246)';

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 border border-blue-500/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 border border-blue-500/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Particles */}
        {Array.from({ length: count }).map((_, i) => {
          const angle = (i / count) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: color,
                left: '50%',
                top: '50%',
                marginLeft: '-4px',
                marginTop: '-4px',
              }}
              animate={{
                x: [x, x * 0.5, x],
                y: [y, y * 0.5, y],
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Center orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-blue-500/50"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 10px rgba(59, 130, 246, 0.8)',
              '0 0 20px rgba(59, 130, 246, 1)',
              '0 0 10px rgba(59, 130, 246, 0.8)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
};

interface GradientOrbsProps {
  theme: string;
}

export const GradientOrbs = ({ theme }: GradientOrbsProps) => {
  const colors =
    theme === 'dark'
      ? [
        { color: 'from-blue-600 to-purple-600', x: '-20%', y: '-30%' },
        { color: 'from-purple-600 to-pink-600', x: '50%', y: '-60%' },
        { color: 'from-pink-600 to-orange-600', x: '80%', y: '10%' },
      ]
      : [
        { color: 'from-blue-400 to-purple-400', x: '-20%', y: '-30%' },
        { color: 'from-purple-400 to-pink-400', x: '50%', y: '-60%' },
        { color: 'from-pink-400 to-orange-400', x: '80%', y: '10%' },
      ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {colors.map((orb, idx) => (
        <motion.div
          key={idx}
          className={`absolute w-72 h-72 rounded-full bg-gradient-to-r ${orb.color} opacity-20 blur-3xl`}
          style={{
            left: orb.x,
            top: orb.y,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 8 + idx * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
