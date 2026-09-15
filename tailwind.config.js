/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: {
            DEFAULT: '#0D0D0D',
            light: '#111111',
            deep: '#0A0A0A',
            soft: '#1A1A1A',
          },
          red: {
            DEFAULT: '#C00000',
            light: '#FF1A1A',
            dark: '#8B0000',
            glow: '#FF3333',
            muted: '#991B1B',
          },
        },
        primary: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        accent: {
          red: '#FF1A1A',
          crimson: '#DC143C',
          scarlet: '#FF2400',
        },
        surface: {
          dark: 'rgba(255,255,255,0.03)',
          'dark-hover': 'rgba(255,255,255,0.06)',
          light: 'rgba(0,0,0,0.02)',
          'light-hover': 'rgba(0,0,0,0.05)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #C00000 0%, #FF1A1A 100%)',
        'gradient-brand-dark': 'linear-gradient(135deg, #8B0000 0%, #C00000 100%)',
        'gradient-black-red': 'linear-gradient(135deg, #0D0D0D 0%, #1A0000 50%, #0D0D0D 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(192,0,0,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(192, 0, 0, 0.5), 0 0 40px rgba(192, 0, 0, 0.3)',
        'glow-red-lg': '0 0 30px rgba(192, 0, 0, 0.6), 0 0 60px rgba(192, 0, 0, 0.4)',
        'glow-red-sm': '0 0 10px rgba(192, 0, 0, 0.3), 0 0 20px rgba(192, 0, 0, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'elevated': '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'lift': '0 24px 80px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-lg': '40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'draw-in': 'draw-in 0.8s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up-fade': {
          '0%': { opacity: 0, transform: 'translateY(20px)', filter: 'blur(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'draw-in': {
          '0%': { strokeDashoffset: '1', opacity: 0 },
          '100%': { strokeDashoffset: '0', opacity: 1 },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bengali: ['Hind Siliguri', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '1400px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
