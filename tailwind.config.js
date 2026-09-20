/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors - desaturated, single accent
        brand: {
          red: {
            DEFAULT: '#B80000',        // Desaturated from #C00000 (75% saturation)
            light: '#D41A1A',          // Lighter variant
            dark: '#8A0000',           // Darker variant
            glow: 'rgba(184, 0, 0, 0.25)', // Subtle glow
            muted: 'rgba(184, 0, 0, 0.12)', // Muted for borders
          },
        },
        // Semantic surface tokens (single cool-gray family)
        surface: {
          bg: {
            primary: '#050505',        // Vantablack
            secondary: '#0A0A0A',
            tertiary: '#111111',
            elevated: '#1A1A1A',
          },
          border: {
            DEFAULT: '#1E1E1E',
            subtle: '#161616',
            accent: 'rgba(184, 0, 0, 0.15)',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#E5E5E5',
            muted: '#999999',
            subtle: '#666666',
            inverse: '#050505',
          },
          // Glassmorphism tokens
          glass: {
            light: 'rgba(255, 255, 255, 0.03)',
            medium: 'rgba(255, 255, 255, 0.05)',
            heavy: 'rgba(255, 255, 255, 0.08)',
            border: 'rgba(255, 255, 255, 0.08)',
            borderStrong: 'rgba(255, 255, 255, 0.12)',
            highlight: 'rgba(255, 255, 255, 0.15)',
          },
        },
        // Light mode surfaces (for completeness)
        surfaceLight: {
          bg: {
            primary: '#FAFAFA',
            secondary: '#F5F5F5',
            tertiary: '#EEEEEE',
            elevated: '#FFFFFF',
          },
          border: {
            DEFAULT: '#E5E5E5',
            subtle: '#EFEFEF',
            accent: 'rgba(184, 0, 0, 0.15)',
          },
          text: {
            primary: '#050505',
            secondary: '#1A1A1A',
            muted: '#666666',
            subtle: '#999999',
            inverse: '#FAFAFA',
          },
          glass: {
            light: 'rgba(0, 0, 0, 0.02)',
            medium: 'rgba(0, 0, 0, 0.04)',
            heavy: 'rgba(0, 0, 0, 0.06)',
            border: 'rgba(0, 0, 0, 0.06)',
            borderStrong: 'rgba(0, 0, 0, 0.1)',
            highlight: 'rgba(255, 255, 255, 0.8)',
          },
        },
      },
      backgroundImage: {
        // Refined gradients - no AI purple
        'gradient-brand': 'linear-gradient(135deg, #B80000 0%, #D41A1A 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, rgba(184,0,0,0.08) 0%, rgba(212,26,26,0.04) 100%)',
        'gradient-surface': 'linear-gradient(180deg, #0A0A0A 0%, #050505 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-glow-brand': 'radial-gradient(ellipse at center, rgba(184,0,0,0.08) 0%, transparent 60%)',
        'gradient-hero': 'linear-gradient(135deg, #050505 0%, #0A0A0A 50%, #050505 100%)',
      },
      boxShadow: {
        // Colored shadows - tinted to brand red on dark
        'brand-sm': '0 2px 8px rgba(184, 0, 0, 0.15), 0 0 0 1px rgba(184, 0, 0, 0.08)',
        'brand-md': '0 8px 24px rgba(184, 0, 0, 0.18), 0 0 0 1px rgba(184, 0, 0, 0.1)',
        'brand-lg': '0 16px 48px rgba(184, 0, 0, 0.22), 0 0 0 1px rgba(184, 0, 0, 0.12)',
        'brand-glow': '0 0 30px rgba(184, 0, 0, 0.18), 0 0 60px rgba(184, 0, 0, 0.1)',
        
        // Glass shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glass-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.1)',
        
        // Elevation scale
        'elevate-1': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'elevate-2': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'elevate-3': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'elevate-4': '0 24px 64px rgba(0, 0, 0, 0.55)',
        
        // Double-bezel specific
        'bezel-outer': '0 0 0 1px rgba(255, 255, 255, 0.06), 0 4px 16px rgba(0, 0, 0, 0.3)',
        'bezel-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.12), inset 0 -1px 1px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-lg': '40px',
        'glass-xl': '60px',
      },
      fontFamily: {
        display: ['Geist', 'Clash Display', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
      },
      fontSize: {
        // Display scale - clamp for fluid typography
        'display-2xl': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        
        // Heading scale
        'heading-xl': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-lg': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.35', letterSpacing: '0', fontWeight: '600' }],
        'heading-md': ['clamp(1.125rem, 1.5vw, 1.25rem)', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'heading-sm': ['clamp(1rem, 1.25vw, 1.125rem)', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '600' }],
        
        // Body scale
        'body-xl': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-lg': ['1rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.65', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-xs': ['0.8125rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        
        // Label/UI scale
        'label-lg': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-md': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.015em', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-xs': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.025em', fontWeight: '600' }],
        
        // Micro copy
        'micro': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.03em', fontWeight: '500' }],
      },
      spacing: {
        // Macro whitespace scale
        'section-xs': 'clamp(2.5rem, 4vw, 4rem)',    // py-10 to py-16
        'section-sm': 'clamp(3rem, 5vw, 5rem)',      // py-12 to py-20
        'section-md': 'clamp(4rem, 6vw, 6rem)',      // py-16 to py-24
        'section-lg': 'clamp(5rem, 7vw, 8rem)',      // py-20 to py-32
        'section-xl': 'clamp(6rem, 8vw, 10rem)',     // py-24 to py-40
        'section-2xl': 'clamp(8rem, 10vw, 12rem)',   // py-32 to py-48
        
        // Container padding
        'container-xs': 'clamp(1rem, 2vw, 1.5rem)',  // px-4 to px-6
        'container-sm': 'clamp(1.25rem, 3vw, 2rem)', // px-5 to px-8
        'container-md': 'clamp(1.5rem, 4vw, 2.5rem)', // px-6 to px-10
        'container-lg': 'clamp(2rem, 5vw, 3rem)',    // px-8 to px-12
        'container-xl': 'clamp(2.5rem, 6vw, 4rem)',  // px-10 to px-16
        
        // Component spacing
        'gap-xs': '0.5rem',    // 8px
        'gap-sm': '0.75rem',   // 12px
        'gap-md': '1rem',      // 16px
        'gap-lg': '1.5rem',    // 24px
        'gap-xl': '2rem',      // 32px
        'gap-2xl': '3rem',     // 48px
        'gap-3xl': '4rem',     // 64px
      },
      maxWidth: {
        'container': '1400px',
        'content': '72ch',      // ~65ch for body text
        'prose': '65ch',
        'narrow': '48ch',
      },
      borderRadius: {
        // Double-bezel radius scale
        'bezel-outer': '2rem',           // 32px - outer shell
        'bezel-inner': 'calc(2rem - 0.375rem)', // ~29px - inner core (6px padding)
        'bezel-outer-sm': '1.5rem',      // 24px
        'bezel-inner-sm': 'calc(1.5rem - 0.375rem)', // ~21px
        'bezel-outer-lg': '2.5rem',      // 40px
        'bezel-inner-lg': 'calc(2.5rem - 0.375rem)', // ~36px
        'bezel-pill': '9999px',          // Full pill for buttons
        'bezel-card': '1.5rem',          // 24px - standard card
        'bezel-card-inner': 'calc(1.5rem - 0.25rem)', // ~20px
      },
      transitionTimingFunction: {
        // Custom cubic-beziers - no linear/ease-in-out defaults
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',       // Bouncy spring
        'spring-gentle': 'cubic-bezier(0.32, 0.72, 0, 1)',   // Heavy, smooth (Apple-style)
        'spring-snappy': 'cubic-bezier(0.2, 0.8, 0.2, 1)',   // Quick response
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',   // Decelerating
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)', // Accelerating
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)', // Symmetric smooth
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',   // Smooth out
        'ease-out-circ': 'cubic-bezier(0.08, 0.82, 0.17, 1)', // Circular out
      },
      transitionDuration: {
        'instant': '50ms',
        'fast': '150ms',
        'normal': '200ms',
        'smooth': '300ms',
        'slow': '400ms',
        'slower': '500ms',
        'slowest': '700ms',
        'enter': '800ms',
        'exit': '500ms',
      },
      animation: {
        // Purposeful animations only
        'fade-in': 'fadeIn 0.6s ease-out-expo forwards',
        'fade-out': 'fadeOut 0.4s ease-in-expo forwards',
        'slide-up': 'slideUp 0.6s ease-out-expo forwards',
        'slide-down': 'slideDown 0.5s ease-out-expo forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out-expo forwards',
        'scale-in': 'scaleIn 0.4s spring-gentle forwards',
        'scale-out': 'scaleOut 0.3s ease-in-expo forwards',
        'blur-in': 'blurIn 0.6s ease-out-expo forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      // Z-index scale - systemic only
      zIndex: {
        'base': '0',
        'dropdown': '100',
        'sticky': '200',
        'overlay': '300',
        'modal': '400',
        'popover': '500',
        'tooltip': '600',
        'toast': '700',
        'max': '9999',
      },
      // Screen sizes for container queries
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1680px',
      },
    },
  },
  plugins: [],
};