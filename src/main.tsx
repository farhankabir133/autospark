import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// HashRouter compatibility for direct callback hits on custom domain.
// SSLCommerz redirects can land on pathname routes like /payment-success,
// but HashRouter expects /#/payment-success.
const callbackPaths = new Set([
  '/payment-success',
  '/payment-fail',
  '/payment-cancel',
  '/payment/success',
  '/payment/fail',
  '/payment/cancel',
]);

if (typeof window !== 'undefined') {
  const { pathname, search, hash } = window.location;
  if (!hash && callbackPaths.has(pathname)) {
    const normalized = `/#${pathname}${search}`;
    window.history.replaceState(null, '', normalized);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

// Window augmentation for service worker refresh flag
declare global {
  interface Window {
    __swRefreshing?: boolean;
  }
}

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
      .then((registration) => {
        // If there's an already-waiting SW, prompt the user to update
        if (registration.waiting) {
          showUpdateAvailable(registration);
        }

        // Listen for updates found (new installing worker)
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && registration.waiting) {
                showUpdateAvailable(registration);
              }
            });
          }
        });

        // If a new service worker takes control, reload to load the new assets
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Avoid infinite reload loop
          if (!window.__swRefreshing) {
            window.__swRefreshing = true;
            window.location.reload();
          }
        });
      })
      .catch(() => {/* SW registration failed — non-critical */});
  });
}

function showUpdateAvailable(registration: ServiceWorkerRegistration) {
  try {
    // Create or reuse a banner element
    let banner = document.getElementById('sw-update-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sw-update-banner';
      banner.style.position = 'fixed';
      banner.style.bottom = '20px';
      banner.style.left = '50%';
      banner.style.transform = 'translateX(-50%)';
      banner.style.zIndex = '9999';
      banner.style.background = '#111';
      banner.style.color = '#fff';
      banner.style.padding = '12px 16px';
      banner.style.borderRadius = '8px';
      banner.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
      banner.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
      banner.innerHTML = `
        <span style="margin-right:12px;">A new version is available.</span>
        <button id="sw-update-refresh" style="background:#C00000;border:none;color:#fff;padding:8px 10px;border-radius:6px;cursor:pointer;font-weight:600">Refresh</button>
        <button id="sw-update-dismiss" style="background:transparent;border:none;color:#aaa;margin-left:8px;cursor:pointer">Dismiss</button>
      `;
      document.body.appendChild(banner);

      const refreshBtn = document.getElementById('sw-update-refresh');
      const dismissBtn = document.getElementById('sw-update-dismiss');
      refreshBtn?.addEventListener('click', () => {
        try {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        } catch (e) { /* ignore */ }
      });
      dismissBtn?.addEventListener('click', () => {
        banner?.remove();
      });
    }
  } catch (e) {
    // best-effort only
    console.warn('SW update UI failed', e);
  }
}

// In development, unregister any previously-registered service workers to avoid cached
// bundles interfering with hot reload / testing. This is intentionally dev-only and
// won't run in production.
if ('serviceWorker' in navigator && !import.meta.env.PROD) {
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
          registrations.forEach((reg) => {
            try { reg.unregister(); } catch (e) { /* ignore */ }
          });
        })
        .catch(() => {/* ignore */});
    } catch (err) {
      // Ignore — best effort only
    }
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

// One-time user-gesture listener: enable AudioManager only after a real user gesture
// (pointerdown/touchstart happens before click, so enabling on pointerdown allows
// click handlers in the same gesture to play audio as expected).
const enableAudioOnUserGesture = () => {
  try {
    import('./utils/AudioManager').then(mod => mod.AudioManager.allowUserGesture()).catch(() => {});
  } catch (e) {
    /* ignore */
  }
};
window.addEventListener('pointerdown', enableAudioOnUserGesture, { once: true, passive: true });
window.addEventListener('touchstart', enableAudioOnUserGesture, { once: true, passive: true });

// Silence any playing sounds when the user is scrolling or performing non-audio interactions.
// Some UI interactions (hover while scrolling, auto animations) can accidentally trigger
// audio. As a safety net, pause all <audio>/<video> elements and stop AudioManager sounds
// when scroll-like events occur.
const silenceOnScrollLike = () => {
  try {
    import('./utils/AudioManager').then(mod => mod.AudioManager.stopAll()).catch(() => {});
  } catch (e) {
    /* ignore */
  }

  try {
    const medias = Array.from(document.querySelectorAll<HTMLMediaElement>('audio, video'));
    medias.forEach(m => {
      try {
        if (!m.paused) {
          m.pause();
          m.currentTime = 0;
        }
      } catch (_) { /* ignore media that can't be controlled */ }
    });
  } catch (_) {
    /* ignore */
  }
};

window.addEventListener('scroll', silenceOnScrollLike, { passive: true });
window.addEventListener('wheel', silenceOnScrollLike, { passive: true });
window.addEventListener('touchmove', silenceOnScrollLike, { passive: true });
