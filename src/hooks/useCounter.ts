import { useEffect, useState } from 'react';

interface UseCounterProps {
  end: number;
  duration?: number;
  start?: number;
  shouldStart?: boolean;
}

export const useCounter = ({ end, duration = 2000, start = 0, shouldStart = true }: UseCounterProps) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCount(Math.floor(start + (end - start) * progress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, shouldStart]);

  return count;
};
