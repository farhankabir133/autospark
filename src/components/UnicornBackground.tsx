import { useEffect, useRef } from 'react';

interface UnicornBackgroundProps {
  className?: string;
  projectId?: string;
  scale?: number;
  dpi?: number;
  fps?: number;
  width?: string;
  height?: string;
}

export const UnicornBackground = ({
  className = '',
  projectId = 'EsCBcVP5gBaytXubkPrD',
  scale = 1,
  dpi = 1.5,
  fps = 60,
  width = '800px',
  height = '500px',
}: UnicornBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Unicorn Studio
    const initUnicorn = () => {
      if (window.UnicornStudio && window.UnicornStudio.init) {
        window.UnicornStudio.init();
      } else {
        // If not loaded yet, retry
        setTimeout(initUnicorn, 500);
      }
    };

    // Start initialization after component mounts
    const timer = setTimeout(initUnicorn, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      data-us-project={projectId}
      data-us-scale={scale}
      data-us-dpi={dpi}
      data-us-fps={fps}
      style={{
        width,
        height,
      }}
    />
  );
};

// Add type declaration for UnicornStudio
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
    };
  }
}

export default UnicornBackground;
