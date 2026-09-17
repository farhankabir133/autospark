import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // bundle visualizer - generates dist/stats.html to inspect bundle composition
    visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }),
    // Gzip pre-compression for all assets > 1KB
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024,
      ext: '.gz',
    }),
    // Brotli pre-compression for even better compression ratios
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 1024,
      ext: '.br',
    }),
  ],
    server: {
      watch: {
        ignored: ['**/functions/**'],
      },
      // during local development forward /api/* to the proxy server
      proxy: {
        '/api/agent': {
          target: 'http://localhost:8787',
          changeOrigin: true,
          secure: false,
          ws: false,
        },
        '/api/payment': {
          target: 'http://localhost:8787',
          changeOrigin: true,
          secure: false,
          ws: false,
        }
      }
    },
  // Custom domain deployment - absolute base for https://autosparkbd.com (P0 fix: './' breaks SW scope/preload on deep hash routes)
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Minimize CSS
    cssMinify: true,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Enable minification with terser options
    minify: 'esbuild',
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor chunks
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Animation libraries - loaded on demand
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('gsap')) {
            return 'gsap';
          }
          // Three.js - heavy, separate chunk
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three';
          }
          // Model viewer - separate chunk (heavy, rarely used on homepage)
          if (id.includes('@google/model-viewer') || id.includes('model-viewer')) {
            return 'model-viewer';
          }
          // UI components
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          if (id.includes('react-helmet-async')) return 'helmet';
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'form';
          if (id.includes('@react-three/drei')) return 'drei';
        },
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
});
