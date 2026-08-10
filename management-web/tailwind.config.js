/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors - Refined electrical theme
        brand: {
          // Primary electrical accent - warm orange
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
          // Alias for compatibility
          orange: '#F97316',
          orangeHover: '#EA580C',
        },
        // Secondary accent - professional blue
        accent: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
          // Alias for compatibility
          blue: '#3B82F6',
          blueHover: '#2563EB',
        },
        // Surface colors - clean light theme foundation
        surface: {
          0: '#FFFFFF',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
        },
        // Text colors
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#64748B',
          muted: '#94A3B8',
        },
        // Semantic colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        danger: {
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
        },
        info: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // Neutral slate scale
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617'
        }
      },
      fontFamily: {
        // Primary UI font - Inter for clean, professional readability
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Display font - Plus Jakarta Sans for headings
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Monospace for code/data
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Display sizes
        'display-xs': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        'display-sm': ['2.625rem', { lineHeight: '2.75rem', letterSpacing: '-0.025em' }],
        'display-md': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.025em' }],
        'display-lg': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.025em' }],
        'display-xl': ['4.5rem', { lineHeight: '4.75rem', letterSpacing: '-0.025em' }],
        // Body sizes with refined line heights
        'body-xs': ['0.75rem', { lineHeight: '1rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'body-base': ['1rem', { lineHeight: '1.5rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'body-xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
      spacing: {
        // Consistent spacing scale
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        // Refined radius scale
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        // Subtle background gradients
        'gradient-subtle': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        'gradient-brand': 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 55%, #93C5FD 100%)',
        // Mesh gradients for subtle depth
        'mesh-light': 'radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.06) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        // Refined shadow system
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Card shadows
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.08)',
        // Inner shadows
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'inner-md': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Brand glow (subtle)
        'glow-brand': '0 0 20px -5px rgba(249, 115, 22, 0.3)',
        'glow-brand-lg': '0 0 30px -8px rgba(249, 115, 22, 0.25)',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.01em',
        'wider': '0.02em',
        'widest': '0.04em',
      },
      keyframes: {
        // Motion primitives - production-ready animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        // Subtle shimmer for loading states
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Subtle pulse for attention
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        // Gentle float for decorative elements
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 150ms ease-in',
        'slide-in-from-top': 'slide-in-from-top 300ms ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 300ms ease-out',
        'slide-in-from-left': 'slide-in-from-left 300ms ease-out',
        'slide-in-from-right': 'slide-in-from-right 300ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        'scale-out': 'scale-out 150ms ease-in',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'motion': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'motion-in': 'cubic-bezier(0, 0, 0.2, 1)',
        'motion-out': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '350': '350ms',
        '450': '450ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}
