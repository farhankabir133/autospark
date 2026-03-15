import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Enable theme transitions only after first paint (avoids Lighthouse penalty)
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add('theme-ready');
  });
});

// Register Service Worker for asset caching (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
  .register('/sw.js', { scope: '/' })
      .catch(() => {/* SW registration failed — non-critical */});
  });
}

// Prefetch 3D model only for mid/high-tier devices (not mobile low-tier)
// Deferred to 'load' event so it never competes with critical resources
window.addEventListener('load', () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const gl = document.createElement('canvas').getContext('webgl');
  const renderer = gl?.getExtension('WEBGL_debug_renderer_info');
  const gpu = renderer ? gl?.getParameter(renderer.UNMASKED_RENDERER_WEBGL) || '' : '';
  const isLowTier = isMobile && /mali-4|adreno 3|sgx|apple gpu/i.test(gpu);
  if (!isLowTier) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${import.meta.env.BASE_URL}models/ferrari.glb`;
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
});
