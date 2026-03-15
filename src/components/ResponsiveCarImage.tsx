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
}

export const ResponsiveCarImage: React.FC<ResponsiveCarImageProps> = ({ alt, images, className }) => (
  <picture>
    {images.avif && <source srcSet={images.avif} type="image/avif" />}
    <source srcSet={images.webp} type="image/webp" />
    <img
      src={images.fallback}
      alt={alt}
      width={images.width}
      height={images.height}
      decoding="async"
      loading="lazy"
      className={className}
      style={{ aspectRatio: `${images.width}/${images.height}` }}
    />
  </picture>
);
