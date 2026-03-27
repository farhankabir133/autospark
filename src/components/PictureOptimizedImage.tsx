import React, { useState } from "react";
import styles from "./PictureOptimizedImage.module.css";

type Srcs = {
  avif?: string;
  webp?: string;
  jpeg: string; // fallback required
  avifSrcSet?: string;
  webpSrcSet?: string;
  jpegSrcSet?: string;
};

interface Props {
  srcs: Srcs;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  placeholderBase64?: string; // low-res base64 placeholder (data:image/...;base64,...)
  style?: React.CSSProperties;
}

/**
 * PictureOptimizedImage
 * - Renders a <picture> tag that prefers AVIF, then WebP, then JPEG
 * - Uses loading="lazy"
 * - Uses a blur-up low-res Base64 placeholder to avoid CLS
 *
 * Props:
 *  - srcs: { avif?, webp?, jpeg } (jpeg required)
 *  - placeholderBase64: data:image/...;base64,... string
 *  - width & height to reserve space (recommended to avoid CLS)
 */
export default function PictureOptimizedImage({
  srcs,
  alt,
  width,
  height,
  sizes,
  className,
  placeholderBase64,
  style,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  // Ensure we have an aspect or width/height to prevent layout shift.
  const wrapperStyle: React.CSSProperties = {
    ...(style || {}),
  };

  if (width && height) {
    wrapperStyle.width = width;
    wrapperStyle.height = height;
  } else if (width && !height) {
    wrapperStyle.width = width;
    wrapperStyle.aspectRatio = "auto";
  } else if (!width && height) {
    wrapperStyle.height = height;
    wrapperStyle.aspectRatio = "auto";
  }

  // background placeholder (if provided) is applied inline to avoid extra CSS config
  const backgroundStyle: React.CSSProperties = placeholderBase64
    ? {
        backgroundImage: `url('${placeholderBase64}')`,
      }
    : {};

  return (
    <div
      className={`${styles.wrapper} ${className || ""}`}
      style={{ ...wrapperStyle, ...backgroundStyle }}
      aria-hidden={false}
    >
      <picture>
        {srcs.avif && (
          <source
            type="image/avif"
            srcSet={srcs.avifSrcSet || srcs.avif}
            sizes={sizes}
          />
        )}
        {srcs.webp && (
          <source
            type="image/webp"
            srcSet={srcs.webpSrcSet || srcs.webp}
            sizes={sizes}
          />
        )}
        <img
          className={`${styles.img} ${loaded ? styles.loaded : ""}`}
          src={srcs.jpeg}
          srcSet={srcs.jpegSrcSet}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          style={{ objectFit: "cover" }}
        />
      </picture>
    </div>
  );
}
