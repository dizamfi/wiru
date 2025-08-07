// // tailwind.config.js - Nueva configuración con paleta Verde/Lima

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Paleta principal basada en #08673B (Verde oscuro) y #D0FF5B (Lima/Verde claro)
//         primary: {
//           50: '#f0fdf4',   // Verde muy claro
//           100: '#dcfce7',  // Verde claro
//           200: '#bbf7d0',  // Verde suave
//           300: '#86efac',  // Verde medio claro
//           400: '#4ade80',  // Verde medio
//           500: '#22c55e',  // Verde estándar
//           600: '#08673B',  // Verde principal oscuro (#08673B)
//           700: '#065a32',  // Verde más oscuro
//           800: '#064e2a',  // Verde muy oscuro
//           900: '#053e22',  // Verde casi negro
//           950: '#022c16',  // Verde negro
//         },
        
//         // Paleta secundaria basada en #D0FF5B (Lima)
//         secondary: {
//           50: '#fefff0',   // Lima muy claro
//           100: '#fefde8',  // Lima claro
//           200: '#fefacd',  // Lima suave
//           300: '#fef4a7',  // Lima medio claro
//           400: '#fdea76',  // Lima medio
//           500: '#D0FF5B',  // Lima principal (#D0FF5B)
//           600: '#bce849',  // Lima más saturado
//           700: '#a8d43a',  // Lima oscuro
//           800: '#8ba82e',  // Lima muy oscuro
//           900: '#748c26',  // Lima casi verde
//           950: '#425010',  // Lima muy oscuro
//         },
        
//         // Colores de feedback manteniendo armonía
//         success: {
//           50: '#f0fdf4',
//           100: '#dcfce7',
//           200: '#bbf7d0',
//           300: '#86efac',
//           400: '#4ade80',
//           500: '#22c55e',
//           600: '#16a34a',  // Verde éxito
//           700: '#15803d',
//           800: '#166534',
//           900: '#14532d',
//           950: '#052e16',
//         },
        
//         warning: {
//           50: '#fffbeb',
//           100: '#fef3c7',
//           200: '#fde68a',
//           300: '#fcd34d',
//           400: '#fbbf24',
//           500: '#f59e0b',  // Amarillo warning
//           600: '#d97706',
//           700: '#b45309',
//           800: '#92400e',
//           900: '#78350f',
//           950: '#451a03',
//         },
        
//         danger: {
//           50: '#fef2f2',
//           100: '#fee2e2',
//           200: '#fecaca',
//           300: '#fca5a5',
//           400: '#f87171',
//           500: '#ef4444',  // Rojo error
//           600: '#dc2626',
//           700: '#b91c1c',
//           800: '#991b1b',
//           900: '#7f1d1d',
//           950: '#450a0a',
//         },
        
//         info: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',  // Azul info
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//           950: '#172554',
//         },
        
//         // Grises neutros
//         gray: {
//           50: '#f9fafb',
//           100: '#f3f4f6',
//           200: '#e5e7eb',
//           300: '#d1d5db',
//           400: '#9ca3af',
//           500: '#6b7280',
//           600: '#4b5563',
//           700: '#374151',
//           800: '#1f2937',
//           900: '#111827',
//           950: '#030712',
//         },
        
//         // Colores especiales
//         white: '#ffffff',
//         black: '#000000',
        
//         // Aliases para facilitar el uso
//         'verde-principal': '#08673B',
//         'lima-principal': '#D0FF5B',
//         'verde-oscuro': '#08673B',
//         'verde-claro': '#D0FF5B',
//       },
      
//       // Gradientes predefinidos con la nueva paleta
//       backgroundImage: {
//         'gradient-primary': 'linear-gradient(135deg, #08673B 0%, #22c55e 100%)',
//         'gradient-secondary': 'linear-gradient(135deg, #D0FF5B 0%, #fbbf24 100%)',
//         'gradient-hero': 'linear-gradient(135deg, #08673B 0%, #065a32 50%, #022c16 100%)',
//         'gradient-card': 'linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%)',
//       },
      
//       // Sombras personalizadas
//       boxShadow: {
//         'primary': '0 4px 14px 0 rgba(8, 103, 59, 0.1)',
//         'primary-lg': '0 10px 25px -3px rgba(8, 103, 59, 0.1), 0 4px 6px -2px rgba(8, 103, 59, 0.05)',
//         'secondary': '0 4px 14px 0 rgba(208, 255, 91, 0.2)',
//         'green': '0 4px 14px 0 rgba(34, 197, 94, 0.1)',
//       },
      
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//       },
      
//       // Animaciones personalizadas
//       animation: {
//         'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'bounce-slow': 'bounce 2s infinite',
//         'fade-in': 'fadeIn 0.5s ease-in-out',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'scale-in': 'scaleIn 0.2s ease-out',
//       },
      
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         scaleIn: {
//           '0%': { transform: 'scale(0.95)', opacity: '0' },
//           '100%': { transform: 'scale(1)', opacity: '1' },
//         },
//       },
//     },
//   },
//   plugins: [
//     require('@tailwindcss/forms'),
//   ],
// }






/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Colores personalizados de Wiru
      colors: {
        'wiru': {
          'primary': '#a8c241',
          'secondary': '#8ea635',
          'tertiary': '#719428',
          'light': '#c5d96f',
          'dark': '#5d7a1c',
        },
        primary: {
          50: '#f7fae6',
          100: '#ecf4c9',
          200: '#dcea9a',
          300: '#c5d96f',
          400: '#a8c241', // Color principal
          500: '#8ea635',
          600: '#719428',
          700: '#5d7a1c',
          800: '#4a6117',
          900: '#3d5115',
        },
        secondary: {
          50: '#f6f7f0',
          100: '#e9ecdc',
          200: '#d4dabc',
          300: '#b9c393',
          400: '#9eab70',
          500: '#8ea635', // Color secundario
          600: '#719428',
          700: '#5a7520',
          800: '#4a5e1c',
          900: '#3f501c',
        }
      },
      // Animaciones personalizadas
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'text-glow': 'textGlow 2s ease-in-out infinite',
        'bounce-zoom': 'bounceZoom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'shake': 'shake 0.5s ease-in-out',
        'gentle-rotate': 'gentleRotate 20s linear infinite',
        'money-fall': 'moneyFall 3s linear infinite',
        'wave': 'wave 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'ripple': 'ripple 0.6s linear',
        'typing': 'typing 3s steps(40, end) 1s both',
        'blink': 'blink 1s step-end infinite',
        'progress-shine': 'progressShine 2s infinite',
        'particle-float': 'particleFloat 20s linear infinite',
      },
      // Keyframes para las animaciones
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '25%': { 
            transform: 'translateY(-15px) rotate(2deg)' 
          },
          '50%': { 
            transform: 'translateY(-30px) rotate(0deg)' 
          },
          '75%': { 
            transform: 'translateY(-15px) rotate(-2deg)' 
          },
        },
        floatReverse: {
          '0%, 100%': { 
            transform: 'translateY(-20px) rotate(0deg)' 
          },
          '50%': { 
            transform: 'translateY(0px) rotate(3deg)' 
          },
        },
        slideUp: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(50px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        slideInLeft: {
          'from': { 
            opacity: '0', 
            transform: 'translateX(-50px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        slideInRight: {
          'from': { 
            opacity: '0', 
            transform: 'translateX(50px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(168, 194, 65, 0.3), 0 0 40px rgba(168, 194, 65, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(168, 194, 65, 0.6), 0 0 80px rgba(168, 194, 65, 0.3)',
          },
        },
        textGlow: {
          '0%, 100%': {
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5)',
          },
        },
        bounceZoom: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.15)',
            opacity: '0.8',
          },
          '70%': {
            transform: 'scale(0.95)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        gentleRotate: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        moneyFall: {
          '0%': {
            opacity: '1',
            transform: 'translateY(-100px) scale(1) rotate(0deg)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'translateY(50px) scale(1.2) rotate(180deg)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(200px) scale(0.5) rotate(360deg)',
          },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateX(5px) translateY(-5px) rotate(1deg)' },
          '50%': { transform: 'translateX(0) translateY(-10px) rotate(0deg)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px) rotate(-1deg)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        ripple: {
          'to': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
        progressShine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      // Tipografía personalizada
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
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
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05), 0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08), 0 8px 40px rgba(0, 0, 0, 0.08)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'neo': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        'neo-inset': 'inset 20px 20px 60px #bebebe, inset -20px -20px 60px #ffffff',
      },
      // Blur personalizado
      blur: {
        'xs': '2px',
      },
      // Border radius personalizado
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // Gradientes personalizados
      backgroundImage: {
        'wiru-gradient': 'linear-gradient(135deg, #a8c241 0%, #8ea635 100%)',
        'wiru-gradient-dark': 'linear-gradient(135deg, #8ea635 0%, #719428 100%)',
        'hero-gradient': 'linear-gradient(135deg, #a8c241 0%, #8ea635 50%, #719428 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
      // Z-index personalizado
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      // Max width personalizado
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Grid template columns
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      // Transiciones personalizadas
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '1500': '1500ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [
    // Plugin para animaciones de scroll
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-gradient-wiru': {
          background: 'linear-gradient(135deg, #a8c241 0%, #8ea635 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-effect-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          'backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.neo-card': {
          background: '#f0f0f0',
          'border-radius': '20px',
          'box-shadow': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
          transition: 'all 0.3s ease',
        },
        '.neo-card:hover': {
          'box-shadow': 'inset 20px 20px 60px #bebebe, inset -20px -20px 60px #ffffff',
        },
        '.btn-wiru': {
          background: 'linear-gradient(135deg, #a8c241 0%, #8ea635 100%)',
          border: 'none',
          'border-radius': '12px',
          color: 'white',
          'font-weight': '600',
          padding: '12px 24px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          'box-shadow': '0 4px 15px rgba(168, 194, 65, 0.3)',
        },
        '.btn-wiru:hover': {
          transform: 'translateY(-2px)',
          'box-shadow': '0 8px 25px rgba(168, 194, 65, 0.4)',
        },
        '.animated-gradient': {
          background: 'linear-gradient(-45deg, #a8c241, #8ea635, #7ba529, #6d941d)',
          'background-size': '400% 400%',
          animation: 'gradientShift 15s ease infinite',
        },
        '.hover-lift': {
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        '.hover-lift:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 60px rgba(168, 194, 65, 0.3)',
        },
        '.interactive-scale': {
          transition: 'transform 0.2s ease',
        },
        '.interactive-scale:hover': {
          transform: 'scale(1.05)',
        },
        '.interactive-scale:active': {
          transform: 'scale(0.98)',
        },
      };

      addUtilities(newUtilities);
    },
    // Otros plugins aquí si es necesario
  ],
  // Configuración para modo oscuro
  darkMode: 'class',
};