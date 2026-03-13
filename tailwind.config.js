/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors - Bold Red & Black Identity
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
        // Primary palette (red-based)
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
        // Accent colors
        accent: {
          red: '#FF1A1A',
          crimson: '#DC143C',
          scarlet: '#FF2400',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #C00000 0%, #FF1A1A 100%)',
        'gradient-brand-dark': 'linear-gradient(135deg, #8B0000 0%, #C00000 100%)',
        'gradient-black-red': 'linear-gradient(135deg, #0D0D0D 0%, #1A0000 50%, #0D0D0D 100%)',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(192, 0, 0, 0.5), 0 0 40px rgba(192, 0, 0, 0.3)',
        'glow-red-lg': '0 0 30px rgba(192, 0, 0, 0.6), 0 0 60px rgba(192, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
