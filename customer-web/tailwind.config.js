import daisyui from 'daisyui';

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
        brand: {
          navy: '#0A1128',
          midnight: '#0F172A',
          amber: '#F59E0B',
          amberHover: '#D97706',
          amberLight: '#FEF3C7',
          graphite: '#334155',
          surface: '#FFFFFF',
          bgLight: '#F8FAFC',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#486581',
          600: '#334E68',
          700: '#243B53',
          800: '#102A43',
          900: '#0F172A',
          950: '#0A1128'
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        },
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
          950: '#0A1128'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-amber-lg': '0 0 45px -10px rgba(245, 158, 11, 0.45)',
        'glow-navy': '0 0 25px -5px rgba(10, 17, 40, 0.35)',
        'card': '0 1px 3px rgba(15, 23, 42, 0.05), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 6px 16px -4px rgba(15, 23, 42, 0.1)',
        'soft': '0 2px 8px -2px rgba(15, 23, 42, 0.05)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      colors: {
        brand: {
          primary: '#FF5722',
          primaryHover: '#E64A19',
          teal: '#76ABAE',
          tealHover: '#5B8C90',
          dark: '#303841',
          darkCanvas: '#1E242B',
          darkSurface: '#252C34',
          slate: '#303841',
          navy: '#303841',
          midnight: '#1E242B',
          amber: '#FF5722',
          surface: '#252C34',
          border: 'rgba(118, 171, 174, 0.25)'
        }
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        uday: {
          "primary": "#FF5722",
          "secondary": "#76ABAE",
          "accent": "#FF5722",
          "neutral": "#303841",
          "base-100": "#252C34",
          "base-200": "#1E242B",
          "base-300": "#303841",
          "info": "#76ABAE",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
      "dark",
    ],
    logs: false,
  },
}

