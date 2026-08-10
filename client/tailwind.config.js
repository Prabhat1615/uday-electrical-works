/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B00',
          orangeHover: '#E55A00',
          blue: '#0066FF',
          blueHover: '#0052CC',
          success: '#00C853',
          bg: '#FFFFFF',
          section: '#F8FAFC',
          primary: '#0F172A',
          secondary: '#475569',
          border: '#E2E8F0'
        },
        orange: {
          50: '#FFF4EB',
          100: '#FFE8D6',
          200: '#FFD1AD',
          400: '#FF8A3D',
          500: '#FF6B00',
          600: '#E55A00',
          700: '#C24D00'
        },
        blue: {
          50: '#EBF3FF',
          100: '#D6E6FF',
          200: '#ADCCFF',
          500: '#3385FF',
          600: '#0066FF',
          700: '#0052CC'
        },
        success: '#00C853',
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
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 45%, #FFF4EB 100%)',
        'cta-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF8A3D 50%, #FFB35C 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0066FF 0%, #3385FF 55%, #66A6FF 100%)',
        'brand-gradient': 'linear-gradient(120deg, #FF6B00 0%, #FFB35C 45%, #0066FF 100%)',
        'mesh-dark': 'radial-gradient(circle at 20% 20%, rgba(255,107,0,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(0,102,255,0.15) 0%, transparent 45%), radial-gradient(circle at 50% 80%, rgba(0,200,83,0.10) 0%, transparent 45%)'
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 107, 0, 0.35)',
        'glow-orange-lg': '0 0 45px -10px rgba(255, 107, 0, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(0, 102, 255, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(0, 200, 83, 0.35)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -6px rgba(15,23,42,0.10)',
        'card-hover': '0 2px 4px rgba(15,23,42,0.05), 0 16px 40px -10px rgba(15,23,42,0.18)',
        soft: '0 4px 20px -4px rgba(15,23,42,0.08)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      letterSpacing: {
        tightest: '-0.04em'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-24px) rotate(8deg)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-36px)' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -6px rgba(255,107,0,0.45)' },
          '50%': { boxShadow: '0 0 40px -6px rgba(255,107,0,0.7)' }
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-15deg)' },
          '100%': { transform: 'translateX(220%) skewX(-15deg)' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3.5s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        shine: 'shine 1.1s ease-in-out',
        'spin-slow': 'spin-slow 14s linear infinite'
      }
    },
  },
  plugins: [],
}
