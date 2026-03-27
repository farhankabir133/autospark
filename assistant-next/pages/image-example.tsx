import React from "react";
import PictureOptimizedImage from "../../src/components/PictureOptimizedImage";

// Example page demonstrating how to use PictureOptimizedImage
export default function ImageExample() {
  // Example: you should generate real AVIF/WebP versions and a small base64 placeholder.
  const jpeg = "/imgs/example-car.jpg";
  const webp = "/imgs/example-car.webp";
  const avif = "/imgs/example-car.avif";

  // Small demo placeholder (1x1 px light gray) — replace with a real tiny blurred base64 image for production.
  const placeholderBase64 = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12"><rect width="100%" height="100%" fill="#e6e7e8"/></svg>');

  return (
    <main style={{ padding: 24 }}>
      <h1>Image example (AVIF → WebP → JPEG) with blur-up placeholder</h1>
      <div style={{ maxWidth: 800 }}>
        <PictureOptimizedImage
          srcs={{ avif, webp, jpeg }}
          alt="Example car"
          width={800}
          height={450}
          placeholderBase64={placeholderBase64}
        />
      </div>
      <p style={{ marginTop: 16 }}>
        Notes: replace the sample srcs and placeholderBase64 with your real optimized files and a real
        tiny blurred base64 placeholder (generated from a low-res resized image).
      </p>
    </main>
  );
}
