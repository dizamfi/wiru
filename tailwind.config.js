// tailwind.config.js - Nueva configuración con paleta Verde/Lima

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal basada en #08673B (Verde oscuro) y #D0FF5B (Lima/Verde claro)
        primary: {
          50: '#f0fdf4',   // Verde muy claro
          100: '#dcfce7',  // Verde claro
          200: '#bbf7d0',  // Verde suave
          300: '#86efac',  // Verde medio claro
          400: '#4ade80',  // Verde medio
          500: '#22c55e',  // Verde estándar
          600: '#08673B',  // Verde principal oscuro (#08673B)
          700: '#065a32',  // Verde más oscuro
          800: '#064e2a',  // Verde muy oscuro
          900: '#053e22',  // Verde casi negro
          950: '#022c16',  // Verde negro
        },
        
        // Paleta secundaria basada en #D0FF5B (Lima)
        secondary: {
          50: '#fefff0',   // Lima muy claro
          100: '#fefde8',  // Lima claro
          200: '#fefacd',  // Lima suave
          300: '#fef4a7',  // Lima medio claro
          400: '#fdea76',  // Lima medio
          500: '#D0FF5B',  // Lima principal (#D0FF5B)
          600: '#bce849',  // Lima más saturado
          700: '#a8d43a',  // Lima oscuro
          800: '#8ba82e',  // Lima muy oscuro
          900: '#748c26',  // Lima casi verde
          950: '#425010',  // Lima muy oscuro
        },
        
        // Colores de feedback manteniendo armonía
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',  // Verde éxito
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Amarillo warning
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
          500: '#ef4444',  // Rojo error
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Azul info
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Grises neutros
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
        
        // Colores especiales
        white: '#ffffff',
        black: '#000000',
        
        // Aliases para facilitar el uso
        'verde-principal': '#08673B',
        'lima-principal': '#D0FF5B',
        'verde-oscuro': '#08673B',
        'verde-claro': '#D0FF5B',
      },
      
      // Gradientes predefinidos con la nueva paleta
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #08673B 0%, #22c55e 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #D0FF5B 0%, #fbbf24 100%)',
        'gradient-hero': 'linear-gradient(135deg, #08673B 0%, #065a32 50%, #022c16 100%)',
        'gradient-card': 'linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%)',
      },
      
      // Sombras personalizadas
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(8, 103, 59, 0.1)',
        'primary-lg': '0 10px 25px -3px rgba(8, 103, 59, 0.1), 0 4px 6px -2px rgba(8, 103, 59, 0.05)',
        'secondary': '0 4px 14px 0 rgba(208, 255, 91, 0.2)',
        'green': '0 4px 14px 0 rgba(34, 197, 94, 0.1)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Animaciones personalizadas
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}