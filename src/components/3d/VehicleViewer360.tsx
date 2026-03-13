import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface VehicleViewer360Props {
  vehicleName?: string;
  brandImage?: string;
}

export const VehicleViewer360: React.FC<VehicleViewer360Props> = ({ 
  vehicleName = 'Toyota Crown 2022',
  brandImage = 'https://images.pexels.com/photos/36317642/pexels-photo-36317642.png'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [imageError, setImageError] = useState(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {

    const onMouseMove = (event: MouseEvent) => {
      if (!autoRotate && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.current = (event.clientX - rect.left) / rect.width - 0.5;
        mouseY.current = (event.clientY - rect.top) / rect.height - 0.5;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!autoRotate && containerRef.current && event.touches[0]) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.current = (event.touches[0].clientX - rect.left) / rect.width - 0.5;
        mouseY.current = (event.touches[0].clientY - rect.top) / rect.height - 0.5;
      }
    };

    containerRef.current?.addEventListener('mousemove', onMouseMove);
    containerRef.current?.addEventListener('touchmove', onTouchMove);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (autoRotate) {
        setRotationY((prev) => (prev + 0.5) % 360);
      } else {
        setRotationY((prev) => prev + mouseX.current * 2);
        setRotationX((prev) => prev + mouseY.current * 1);
      }
    };

    animate();

    return () => {
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [autoRotate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="relative">
        <div
          ref={containerRef}
          className="w-full h-96 md:h-96 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center overflow-hidden"
          style={{ perspective: '1000px' }}
        >
          {imageError && (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p className="text-sm">Image not available</p>
            </div>
          )}

          {!imageError && (
            <motion.div
              style={{
                rotateY: rotationY,
                rotateX: rotationX,
              }}
              transition={{ type: 'tween', duration: 0 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img
                src={brandImage}
                alt={vehicleName}
                className="w-full h-full object-contain p-4"
                onError={() => setImageError(true)}
              />
            </motion.div>
          )}

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-transparent to-blue-500/0 opacity-0"></div>
          </div>
        </div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{vehicleName}</h3>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
          >
            {autoRotate ? '🔄 Auto' : '👆 Manual'}
          </button>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/80 px-3 py-2 rounded-lg">
          {autoRotate ? 'Auto-rotating...' : 'Drag to rotate'}
        </div>
      </div>
    </motion.div>
  );
};
