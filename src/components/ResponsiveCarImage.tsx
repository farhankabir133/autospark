import React from 'react';

interface ResponsiveCarImageProps {
  alt: string;
  images: {
    webp: string;
    avif?: string;
    fallback: string;
    width: number;
    height: number;
  };
  className?: string;
  sizes?: string;
}

export const ResponsiveCarImage: React.FC<ResponsiveCarImageProps> = ({ alt, images, className }) => (
  <picture>
    {images.avif && <source srcSet={images.avif} type="image/avif" />}
    {/* Only add .webp source if the fallback is not a .png (since .webp may not exist for provided PNGs) */}
    {!images.fallback.endsWith('.png') && (
      <source srcSet={images.webp} type="image/webp" sizes="100vw" />
    )}
    <img
      src={images.fallback}
      alt={alt}
      width={images.width}
      height={images.height}
      decoding="async"
      loading="lazy"
      className={className}
      sizes="100vw"
      style={{ aspectRatio: `${images.width}/${images.height}` }}
    />
  </picture>
);
