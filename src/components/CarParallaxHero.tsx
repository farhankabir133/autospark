import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './CarParallaxHero.css';

// Premium Collection Featured Vehicles Images
const premiumCarImages = [
  'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota Prado
  'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota Harrier
  'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota Crown
  'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota Yaris
  'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota Premio
  'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota C-HR
  'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png?auto=compress&cs=tinysrgb&w=400&fm=webp', // Toyota Noah
];

export const CarParallaxHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        const layers = heroRef.current.querySelectorAll('.car-layer');
        layers.forEach((layer, idx) => {
          gsap.to(layer, {
            y: scrollY * (0.15 + idx * 0.08),
            scale: 1 + scrollY * 0.0002 * (idx + 1),
            opacity: 0.95 - idx * 0.08,
            filter: `blur(${scrollY * 0.01 * idx}px)`,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="car-parallax-hero" ref={heroRef}>
      {premiumCarImages.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`Premium Car layer ${idx + 1}`}
          className="car-layer"
          style={{ zIndex: 10 - idx, position: 'absolute', width: '100%', pointerEvents: 'none', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
        />
      ))}
      <div className="hero-content">
        <h1>Experience Luxury, Performance & Innovation</h1>
        <p>Scroll to explore our curated premium collection</p>
      </div>
    </div>
  );
};
