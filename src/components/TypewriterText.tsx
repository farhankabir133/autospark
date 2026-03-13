import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

/**
 * TypewriterText Component
 * 
 * Premium typewriter animation with:
 * - Smooth typing and deleting effects
 * - Glowing cursor
 * - Subtle glass background that doesn't block video
 * - Multiple rotating texts
 */
export const TypewriterText: React.FC<TypewriterTextProps> = memo(({
  texts,
  className = '',
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2500
}) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    if (isWaiting) {
      const waitTimeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(waitTimeout);
    }

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }
      
      const deleteTimeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, deletingSpeed);
      return () => clearTimeout(deleteTimeout);
    }

    if (displayText === currentText) {
      setIsWaiting(true);
      return;
    }

    const typeTimeout = setTimeout(() => {
      setDisplayText(currentText.slice(0, displayText.length + 1));
    }, typingSpeed);
    
    return () => clearTimeout(typeTimeout);
  }, [displayText, textIndex, isDeleting, isWaiting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Subtle glass container - semi-transparent to show video */}
      <div className="relative px-6 py-4 md:px-10 md:py-6 rounded-2xl bg-black/20 backdrop-blur-[2px] border border-white/10">
        {/* Glow effect behind text */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C00000]/5 via-[#FF1A1A]/5 to-[#8B0000]/5 blur-xl" />
        
        {/* Text container */}
        <div className="relative flex items-center min-h-[2.5rem] md:min-h-[3.5rem]">
          {/* Animated text */}
          <AnimatePresence mode="wait">
            <motion.span
              key={displayText}
              className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-lg"
              style={{
                textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)'
              }}
            >
              {displayText}
            </motion.span>
          </AnimatePresence>
          
          {/* Blinking cursor with glow - Brand Red */}
          <motion.span
            className="ml-1 inline-block w-[3px] md:w-[4px] h-8 md:h-12 bg-gradient-to-b from-[#FF1A1A] via-[#C00000] to-[#8B0000] rounded-full"
            animate={{
              opacity: [1, 0.3, 1],
              scaleY: [1, 0.95, 1],
              boxShadow: [
                '0 0 20px rgba(192, 0, 0, 0.8), 0 0 40px rgba(192, 0, 0, 0.4)',
                '0 0 10px rgba(192, 0, 0, 0.4), 0 0 20px rgba(192, 0, 0, 0.2)',
                '0 0 20px rgba(192, 0, 0, 0.8), 0 0 40px rgba(192, 0, 0, 0.4)'
              ]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        {/* Subtle animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(192, 0, 0, 0.1), transparent)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['200% 0%', '-200% 0%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
    </motion.div>
  );
});

TypewriterText.displayName = 'TypewriterText';

export default TypewriterText;
