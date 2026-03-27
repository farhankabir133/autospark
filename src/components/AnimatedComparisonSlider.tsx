import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Check } from 'lucide-react';

interface ComparisonSpec {
  label: string;
  standard: string | number;
  premium: string | number;
  isNew?: boolean; // Mark new features in premium
  highlight?: boolean; // Highlight spec differences
}

interface AnimatedComparisonSliderProps {
  standardImage: string;
  premiumImage: string;
  standardModel: string;
  premiumModel: string;
  specs: ComparisonSpec[];
  theme: string;
  language: string;
}

export const AnimatedComparisonSlider = ({
  standardImage,
  premiumImage,
  standardModel,
  premiumModel,
  specs,
  theme,
  language,
}: AnimatedComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const lastClientX = useRef<number | null>(null);
  const ticking = useRef(false);

  // Handle mouse drag
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Initialize web worker for position calculations and message handler
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      workerRef.current = new Worker('/workers/positionWorker.js');
      workerRef.current.onmessage = (ev: MessageEvent) => {
        const { percent, x } = ev.data as { percent: number; x: number };
        // Update overlay width (layout) and internal state
        if (containerRef.current) {
          const overlay = containerRef.current.querySelector('.overlay') as HTMLElement | null;
          if (overlay) overlay.style.width = `${percent}%`;
        }
        setSliderPosition(percent);

        // Move handle using GPU-accelerated transform
        if (handleRef.current) {
          handleRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
        }

        ticking.current = false;
      };
    } catch (err) {
      console.warn('Worker could not be created', err);
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Mouse move handling (throttled via rAF and computed in worker)
  useEffect(() => {
    if (!isDragging) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && workerRef.current) {
      // send initial rect to worker so it can compute percent and x
      workerRef.current.postMessage({ type: 'init', rect: { left: rect.left, width: rect.width } });
      // set initial handle position
      const initialX = (sliderPosition / 100) * rect.width;
      if (handleRef.current) handleRef.current.style.transform = `translate3d(${initialX}px, 0, 0)`;
    }

    const handleMouseMove = (e: MouseEvent) => {
      lastClientX.current = e.clientX;
      if (!ticking.current && workerRef.current) {
        ticking.current = true;
        // throttle to rAF
        requestAnimationFrame(() => {
          if (lastClientX.current != null) {
            workerRef.current!.postMessage({ type: 'compute', clientX: lastClientX.current });
          }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, sliderPosition]);

  // Touch support
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      lastClientX.current = touch.clientX;
      if (!ticking.current && workerRef.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          if (lastClientX.current != null) {
            workerRef.current!.postMessage({ type: 'compute', clientX: lastClientX.current });
          }
        });
      }
    };

    const handleTouchEnd = () => setIsDragging(false);

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const labelBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  return (
    <motion.div
      className={`rounded-2xl ${bgColor} border ${borderColor} overflow-hidden shadow-xl`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Comparison Slider Section */}
      <div className="p-6">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className={`text-2xl font-bold ${textColor} mb-2`}>
            {language === 'en' ? 'Standard vs Premium' : 'স্ট্যান্ডার্ড বনাম প্রিমিয়াম'}
          </h3>
          <p className={secondaryText}>
            {language === 'en'
              ? 'Drag the slider to compare features'
              : 'বৈশিষ্ট্য তুলনা করতে স্লাইডার টানুন'}
          </p>
        </motion.div>

        {/* Image Comparison with Slider */}
        <motion.div
          ref={containerRef}
          className="relative w-full rounded-xl overflow-hidden shadow-lg mb-8 h-96 group cursor-grab active:cursor-grabbing"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Premium Image (Base) */}
          <img
            src={premiumImage}
            alt={premiumModel}
            className="w-full h-full object-cover"
          />

          {/* Standard Image (Overlay) */}
          <div
            className="absolute inset-0 overflow-hidden overlay"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={standardImage}
              alt={standardModel}
              className="w-full h-full object-cover"
              // use transform for GPU-accelerated movement instead of marginLeft
              style={{ transform: `translate3d(-${sliderPosition}%, 0, 0)` }}
            />
          </div>

          {/* Slider Handle */}
          <motion.div
            ref={handleRef as any}
            className={`absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-col-resize ${
              isDragging ? 'bg-blue-400' : ''
            }`}
            // start with left so SSR shows correct location; runtime updates use translate3d from worker
            style={{ left: `${sliderPosition}%`, willChange: 'transform' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            animate={{ x: isDragging ? 0 : 0 }}
          >
            {/* Handle Icon */}
            <motion.div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-full shadow-lg flex items-center justify-center border-2 border-white`}
              animate={{
                scale: isDragging ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-5 h-5 text-blue-500" />
              <ChevronLeft className="w-5 h-5 text-blue-500 -ml-2" />
            </motion.div>

            {/* Standard label on left */}
            <motion.div
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-white font-bold text-sm ${labelBg} px-3 py-1 rounded-lg whitespace-nowrap`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {language === 'en' ? 'Standard' : 'স্ট্যান্ডার্ড'}
            </motion.div>
          </motion.div>

          {/* Premium label on right */}
          <motion.div
            className={`absolute right-4 bottom-4 text-white font-bold text-sm ${labelBg} px-3 py-1 rounded-lg`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {language === 'en' ? 'Premium' : 'প্রিমিয়াম'}
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-gray-900/50 via-transparent to-gray-900/50'
                : 'from-white/30 via-transparent to-white/30'
            }`} />
          </div>
        </motion.div>

        {/* Model Names */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            className={`p-4 rounded-lg ${labelBg} text-center`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className={`text-sm font-semibold ${secondaryText}`}>
              {language === 'en' ? 'Left (Dragged)' : 'বাম (ড্র্যাগ করা)'}
            </p>
            <p className={`text-lg font-bold ${textColor} mt-1`}>{standardModel}</p>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg ${labelBg} text-center`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className={`text-sm font-semibold ${secondaryText}`}>
              {language === 'en' ? 'Right (Base)' : 'ডান (বেস)'}
            </p>
            <p className={`text-lg font-bold ${textColor} mt-1`}>{premiumModel}</p>
          </motion.div>
        </div>

        {/* Specifications Comparison */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h4 className={`text-lg font-bold ${textColor} mb-4`}>
            {language === 'en' ? 'Key Differences' : 'মূল পার্থক্য'}
          </h4>

          {specs.map((spec, idx) => {
            const isDifferent = spec.standard !== spec.premium;

            return (
              <motion.div
                key={idx}
                className={`p-4 rounded-lg transition-all ${
                  (spec.highlight || isDifferent)
                    ? theme === 'dark'
                      ? 'bg-blue-900/30 border border-blue-500/50'
                      : 'bg-blue-50 border border-blue-200'
                    : theme === 'dark'
                    ? 'bg-gray-800/30'
                    : 'bg-gray-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${secondaryText} mb-2`}>
                      {spec.label}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Standard */}
                      <div className={`text-sm font-mono ${textColor}`}>
                        <span className={`text-xs ${secondaryText} block mb-1`}>
                          {language === 'en' ? 'Standard' : 'স্ট্যান্ডার্ড'}
                        </span>
                        <span className={isDifferent ? 'text-gray-500 line-through' : ''}>
                          {spec.standard}
                        </span>
                      </div>

                      {/* Premium */}
                      <div>
                        <span className={`text-xs ${
                          spec.isNew
                            ? 'text-green-500 font-bold'
                            : secondaryText
                        } block mb-1`}>
                          {language === 'en' ? 'Premium' : 'প্রিমিয়াম'}
                          {spec.isNew && ` ✨ ${language === 'en' ? 'NEW' : 'নতুন'}`}
                        </span>
                        <span className={`${
                          isDifferent || spec.isNew
                            ? 'font-bold text-blue-600 dark:text-blue-400'
                            : ''
                        }`}>
                          {spec.premium}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Indicator icon */}
                  {spec.isNew && (
                    <motion.div
                      className="p-2 rounded-full bg-green-500/20 flex-shrink-0"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer info */}
      <motion.div
        className={`border-t ${borderColor} p-4 ${labelBg}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className={`text-sm ${secondaryText}`}>
          {language === 'en'
            ? '💡 Tip: Drag the slider left and right to compare. Green indicators show features unique to the Premium model.'
            : '💡 টিপ: স্লাইডার বাম এবং ডান দিকে টেনে তুলনা করুন।'}
        </p>
      </motion.div>
    </motion.div>
  );
};
