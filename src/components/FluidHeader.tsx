import React from 'react';

interface FluidHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const FluidHeader: React.FC<FluidHeaderProps> = ({ children, className }) => (
  <h1
    className={className}
    style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', lineHeight: 1.1, fontWeight: 700 }}
  >
    {children}
  </h1>
);
