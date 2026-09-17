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

export const ResponsiveCarImage: React.FC<ResponsiveCarImageProps> = ({ alt, images, className, sizes = '100vw' }) => (
  <picture>
    {images.avif && <source srcSet={images.avif} type="image/avif" sizes={sizes} />}
    {/* P-01 fix: always serve webp source; modern browsers handle png fallback correctly */}
    <source srcSet={images.webp} type="image/webp" sizes={sizes} />
    <img
      src={images.fallback}
      alt={alt}
      width={images.width}
      height={images.height}
      decoding="async"
      loading="lazy"
      className={className}
      sizes={sizes}
      style={{ aspectRatio: `${images.width}/${images.height}` }}
    />
  </picture>
);
