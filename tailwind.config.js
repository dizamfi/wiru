/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Colores personalizados (manteniendo los existentes)
      colors: {
        primary: {
          50: '#f7fdf4',
          100: '#eefbdf',
          200: '#ddf5c0',
          300: '#c5eb96',
          400: '#a8c241', // Color principal
          500: '#96b23a',
          600: '#7a942f',
          700: '#5f7327',
          800: '#4e5d24',
          900: '#424f22',
          950: '#232c0f',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      
      // Configuración de tipografías con League Spartan
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        'spartan': ['League Spartan', 'Inter', 'sans-serif'], // Nueva fuente
        'heading': ['League Spartan', 'Inter', 'sans-serif'], // Alias para headings
        'body': ['Inter', 'system-ui', 'sans-serif'], // Para el cuerpo del texto
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      // Tamaños de fuente optimizados para League Spartan
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      
      // Pesos de fuente específicos para League Spartan
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      
      // Letter spacing personalizado
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      // Animaciones personalizadas
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'pulseGlow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      
      // Keyframes para las animaciones
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-15px) rotate(1deg)' },
          '50%': { transform: 'translateY(-25px) rotate(0deg)' },
          '75%': { transform: 'translateY(-10px) rotate(-1deg)' },
        },
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(168, 194, 65, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(168, 194, 65, 0.4)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Box shadows personalizadas
      boxShadow: {
        'wiru': '0 4px 15px rgba(168, 194, 65, 0.3)',
        'wiru-lg': '0 8px 25px rgba(168, 194, 65, 0.4)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'primary': '0 4px 14px 0 rgba(168, 194, 65, 0.1)',
        'primary-lg': '0 10px 25px -3px rgba(168, 194, 65, 0.1), 0 4px 6px -2px rgba(168, 194, 65, 0.05)',
      },
      
      // Gradientes de fondo
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #a8c241 0%, #96b23a 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-hero': 'linear-gradient(135deg, #a8c241 0%, #96b23a 50%, #7a942f 100%)',
        'gradient-card': 'linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}