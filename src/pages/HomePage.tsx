// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
// //   RecycleIcon, 
//   CurrencyDollarIcon, 
//   ShieldCheckIcon,
//   ArrowRightIcon 
// } from '@heroicons/react/24/outline';
// import { Button, Card, CardContent, Badge } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';

// const HomePage: React.FC = () => {
//   const { isAuthenticated } = useAuth();

//   const features = [
//     {
//       icon: CurrencyDollarIcon,
//       title: 'Reciclaje Fácil',
//       description: 'Proceso simple y rápido para convertir tu chatarra en dinero'
//     },
//     {
//       icon: CurrencyDollarIcon,
//       title: 'Pagos Seguros',
//       description: 'Transferencias directas a tu cuenta bancaria'
//     },
//     {
//       icon: ShieldCheckIcon,
//       title: 'Confiable',
//       description: 'Plataforma segura y confiable para tus transacciones'
//     }
//   ];

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Convierte tu{' '}
//               <span className="text-yellow-400">Chatarra Electrónica</span>{' '}
//               en Dinero
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
//               La plataforma más fácil y segura para reciclar tus dispositivos 
//               electrónicos y obtener dinero al instante
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               {isAuthenticated ? (
//                 <Link to="/sell">
//                   <Button size="lg" variant="secondary">
//                     Vender Ahora
//                     <ArrowRightIcon className="ml-2 h-5 w-5" />
//                   </Button>
//                 </Link>
//               ) : (
//                 <>
//                   <Link to="/register">
//                     <Button size="lg" variant="secondary">
//                       Comenzar Gratis
//                       <ArrowRightIcon className="ml-2 h-5 w-5" />
//                     </Button>
//                   </Link>
//                   <Link to="/how-it-works">
//                     <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
//                       Cómo Funciona
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>

//             <div className="mt-8 flex flex-wrap justify-center gap-4">
//               <Badge variant="secondary" className="text-primary-800">
//                 +10,000 usuarios satisfechos
//               </Badge>
//               <Badge variant="secondary" className="text-primary-800">
//                 +1M kg reciclados
//               </Badge>
//               <Badge variant="secondary" className="text-primary-800">
//                 Pagos en 24h
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               ¿Por qué elegirnos?
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Ofrecemos la mejor experiencia para reciclar tu chatarra electrónica
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <Card key={index}>
//                 <CardContent className="p-8 text-center">
//                   <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-600">
//                     {feature.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-primary-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             ¿Listo para comenzar?
//           </h2>
//           <p className="text-xl text-primary-100 mb-8">
//             Únete a miles de usuarios que ya están ganando dinero reciclando
//           </p>
          
//           {!isAuthenticated && (
//             <Link to="/register">
//               <Button size="lg" variant="secondary">
//                 Crear Cuenta Gratis
//                 <ArrowRightIcon className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;




import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  CurrencyDollarIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon,
  StarIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TvIcon,
  CameraIcon,
  SpeakerWaveIcon,
  ClockIcon,
  BanknotesIcon,
  TruckIcon,
  DocumentCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { 
  CheckIcon as CheckIconSolid,
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

// Hook para intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting] as const;
};

// Componente de contador animado
const AnimatedCounter: React.FC<{ 
  value: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
}> = ({ value, suffix = '', prefix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progressRatio, 3);
      setCount(Math.floor(value * easeOutCubic));

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isVisible]);

  return (
    <div ref={ref}>
      <span className="font-bold">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
    </div>
  );
};

// Ilustración de reciclaje electrónico SVG - Lado izquierdo
const LeftRecyclingIllustration: React.FC = () => (
  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-10 hidden lg:block">
    <svg width="400" height="600" viewBox="0 0 400 600" className="text-[#a8c241]">
      {/* Dispositivos flotantes */}
      <g className="animate-float">
        <rect x="50" y="100" width="80" height="120" rx="15" fill="currentColor" opacity="0.3">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-10; 0,0"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="60" y="110" width="60" height="90" rx="5" fill="white" opacity="0.8"/>
        <circle cx="90" cy="200" r="8" fill="currentColor"/>
      </g>
      
      {/* Laptop flotante */}
      <g className="animate-float" style={{ animationDelay: '1s' }}>
        <rect x="150" y="200" width="100" height="60" rx="8" fill="currentColor" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-15; 0,0"
            dur="5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="155" y="205" width="90" height="45" rx="3" fill="white" opacity="0.9"/>
        <rect x="145" y="260" width="110" height="8" rx="4" fill="currentColor" opacity="0.5"/>
      </g>

      {/* Símbolos de reciclaje */}
      <g className="animate-pulse">
        <circle cx="80" cy="350" r="25" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6"/>
        <path d="M65,335 L80,365 L95,335" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M95,365 L80,335 L65,365" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M80,320 L95,350 L65,350 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
      </g>

      {/* Flechas de dinero */}
      <g className="animate-bounce" style={{ animationDelay: '2s' }}>
        <path d="M200,450 Q250,420 300,450" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4"/>
        <circle cx="250" cy="435" r="4" fill="currentColor"/>
        <text x="260" y="440" fill="currentColor" fontSize="12" opacity="0.7">$$$</text>
      </g>

      {/* Partículas flotantes */}
      <g className="animate-pulse">
        <circle cx="120" cy="80" r="3" fill="currentColor" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="180" cy="120" r="2" fill="currentColor" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="90" cy="480" r="4" fill="currentColor" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  </div>
);

// Ilustración de reciclaje electrónico SVG - Lado derecho
const RightRecyclingIllustration: React.FC = () => (
  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10 hidden lg:block">
    <svg width="400" height="600" viewBox="0 0 400 600" className="text-[#a8c241]">
      {/* Cámara flotante */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        <rect x="250" y="150" width="90" height="60" rx="12" fill="currentColor" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-12; 0,0"
            dur="6s"
            repeatCount="indefinite"
          />
        </rect>
        <circle cx="295" cy="170" r="20" fill="white" opacity="0.8"/>
        <circle cx="295" cy="170" r="12" fill="currentColor" opacity="0.6"/>
        <rect x="320" y="160" width="8" height="8" rx="2" fill="currentColor"/>
      </g>

      {/* TV/Monitor */}
      <g className="animate-float" style={{ animationDelay: '1.5s' }}>
        <rect x="280" y="280" width="80" height="50" rx="8" fill="currentColor" opacity="0.3">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-8; 0,0"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="285" y="285" width="70" height="35" rx="3" fill="white" opacity="0.9"/>
        <rect x="310" y="330" width="20" height="15" rx="3" fill="currentColor" opacity="0.5"/>
      </g>

      {/* Altavoz */}
      <g className="animate-float" style={{ animationDelay: '2.5s' }}>
        <rect x="200" y="400" width="40" height="80" rx="20" fill="currentColor" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-10; 0,0"
            dur="5.5s"
            repeatCount="indefinite"
          />
        </rect>
        <circle cx="220" cy="430" r="12" fill="white" opacity="0.8"/>
        <circle cx="220" cy="460" r="8" fill="white" opacity="0.8"/>
      </g>

      {/* Proceso de conversión */}
      <g className="animate-pulse">
        <path d="M100,380 Q150,350 200,380" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5"/>
        <circle cx="150" cy="365" r="15" fill="currentColor" opacity="0.3"/>
        <text x="140" y="370" fill="currentColor" fontSize="16" opacity="0.8">→</text>
      </g>

      {/* Símbolos de dinero */}
      <g className="animate-bounce" style={{ animationDelay: '1s' }}>
        <text x="320" y="100" fill="currentColor" fontSize="24" opacity="0.6">$</text>
        <text x="300" y="500" fill="currentColor" fontSize="18" opacity="0.5">$$$</text>
        <text x="350" y="450" fill="currentColor" fontSize="20" opacity="0.7">💰</text>
      </g>

      {/* Líneas de conexión */}
      <g className="animate-pulse" style={{ animationDelay: '3s' }}>
        <line x1="250" y1="100" x2="300" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <line x1="320" y1="250" x2="280" y2="300" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <line x1="240" y1="450" x2="300" y2="420" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      </g>
    </svg>
  </div>
);

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Datos de métricas más impactantes
  const stats = [
    { value: 25000, suffix: '+', label: 'Usuarios Satisfechos', prefix: '' },
    { value: 2.8, suffix: 'M', label: 'Kg Reciclados', prefix: '' },
    { value: 98.5, suffix: '%', label: 'Satisfacción', prefix: '' },
    { value: 24, suffix: 'h', label: 'Pago Garantizado', prefix: '<' },
  ];

  // Dispositivos con mejor presentación
  const devices = [
    { 
      type: 'phone', 
      name: 'Smartphones', 
      price: '$50-500',
      examples: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei'],
      icon: DevicePhoneMobileIcon,
      popular: true
    },
    { 
      type: 'laptop', 
      name: 'Laptops', 
      price: '$150-1200',
      examples: ['MacBook', 'Dell', 'HP', 'Lenovo'],
      icon: ComputerDesktopIcon,
      popular: true
    },
    { 
      type: 'tv', 
      name: 'Smart TVs', 
      price: '$100-800',
      examples: ['Samsung', 'LG', 'Sony', 'TCL'],
      icon: TvIcon,
      popular: false
    },
    { 
      type: 'camera', 
      name: 'Cámaras', 
      price: '$40-400',
      examples: ['Canon', 'Nikon', 'GoPro', 'Sony'],
      icon: CameraIcon,
      popular: false
    },
    { 
      type: 'speaker', 
      name: 'Audio', 
      price: '$25-300',
      examples: ['JBL', 'Bose', 'Beats', 'Sony'],
      icon: SpeakerWaveIcon,
      popular: false
    },
  ];

  // Testimoniales mejorados
  const testimonials = [
    {
      name: "Ana Rodríguez",
      location: "CDMX, México",
      amount: "$380",
      device: "iPhone 13 Pro",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "El proceso fue increíblemente fácil y rápido. Recibí mi dinero en menos de 24 horas tal como prometieron."
    },
    {
      name: "Carlos Mendoza",
      location: "Bogotá, Colombia", 
      amount: "$650",
      device: "MacBook Air M2",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "Excelente servicio y precio justo. Definitivamente la mejor opción para vender electrónicos usados."
    },
    {
      name: "María González",
      location: "Lima, Perú",
      amount: "$180",
      device: "Samsung Galaxy S22",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Confiable y transparente. Me encanta que ayudan al medio ambiente mientras genero ingresos extra."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Estilos CSS mejorados */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(1deg); }
          50% { transform: translateY(-25px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 194, 65, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 194, 65, 0.4);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-pulseGlow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section Mejorado - Más Limpio */}
      <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
        {/* Ilustraciones de fondo */}
        {/* <LeftRecyclingIllustration />
        <RightRecyclingIllustration /> */}

        {/* Gradiente sutil de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge de confianza minimalista */}
          <div className="mb-8 animate-fadeInUp">
            <Badge className="bg-[#a8c241]/10 text-[#a8c241] border-[#a8c241]/20 px-6 py-2 text-sm font-semibold">
              ✅ Plataforma Líder en Reciclaje Electrónico
            </Badge>
          </div>

          {/* Título principal elegante */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight text-gray-900">
              Convierte tu{' '}
              <span className="text-[#a8c241] relative">
                E-waste
                {/* <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#a8c241]/30 rounded-full"></div> */}
              </span>
              {' '}en{' '}
              <span className="text-[#a8c241]">Dinero</span>
            </h1>
          </div>

          {/* Subtítulo más elegante */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl sm:text-2xl lg:text-2xl text-gray-600 mb-4 font-medium max-w-4xl mx-auto leading-relaxed">
              En Wiru transformamos lo que llaman residuos electrónicos en dinero para ti y recursos para el planeta.{' '}
              <span className="text-gray-800 font-semibold">Simple, justo y necesario.</span>
            </p>
          </div>

          {/* CTA Principal más elegante */}
          <div className="animate-fadeInUp mb-16" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {isAuthenticated ? (
                <Link to="/sell">
                  <Button 
                    size="lg" 
                    className="bg-[#a8c241] hover:bg-[#8ea635] text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Vender Ahora
                    <ArrowRightIcon className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-[#a8c241] hover:bg-[#8ea635] text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Regístrate y empieza
                    <ArrowRightIcon className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Métricas limpias */}
          <div className="animate-fadeInUp grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-[#a8c241] mb-2">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    prefix={stat.prefix}
                  />
                </div>
                <div className="text-gray-600 font-medium text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Dispositivos - Más Limpia */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué dispositivos <span className="text-[#a8c241]">compramos</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aceptamos una amplia variedad de dispositivos electrónicos en cualquier condición.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {devices.map((device, index) => (
              <div key={index} className="group">
                <Card className="relative h-full border-2 border-gray-100 hover:border-[#a8c241] transition-all duration-300 hover:shadow-lg bg-white">
                  {device.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#a8c241] text-white text-xs px-3 py-1">
                        Más Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#a8c241]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#a8c241] group-hover:scale-110 transition-all duration-300">
                      <device.icon className="h-8 w-8 text-[#a8c241] group-hover:text-white transition-colors duration-300" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {device.name}
                    </h3>
                    
                    <div className="text-2xl font-black text-[#a8c241] mb-4">
                      {device.price}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      {device.examples.slice(0, 3).join(' • ')}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full text-[#a8c241] border-[#a8c241] hover:bg-[#a8c241] hover:text-white transition-all duration-300"
                    >
                      Cotizar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Cómo Funciona - Simplificada */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Proceso <span className="text-[#a8c241]">simple y rápido</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solo 3 pasos para convertir tu electrónica en dinero real
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Evalúa tu dispositivo',
                description: 'Responde algunas preguntas sobre tu dispositivo y obtén una cotización instantánea',
                icon: DocumentCheckIcon
              },
              {
                step: '02', 
                title: 'Envío gratuito',
                description: 'Enviamos un kit de empaque gratuito. Solo empaca y envía tu dispositivo',
                icon: TruckIcon
              },
              {
                step: '03',
                title: 'Recibe tu pago',
                description: 'Una vez verificado tu dispositivo, recibes el pago en menos de 24 horas',
                icon: BanknotesIcon
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-[#a8c241] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-black text-gray-900">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Más Elegante */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
            Lo que dicen nuestros <span className="text-[#a8c241]">usuarios</span>
          </h2>
          
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid key={i} className="h-6 w-6 text-yellow-400 mx-1" />
              ))}
            </div>
            
            <blockquote className="text-xl lg:text-2xl text-gray-700 italic mb-8 leading-relaxed">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover border-3 border-[#a8c241]/20"
              />
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-500 text-sm">
                  {testimonials[currentTestimonial].location}
                </div>
                <div className="text-[#a8c241] font-bold">
                  Ganó {testimonials[currentTestimonial].amount}
                </div>
              </div>
            </div>
            
            {/* Indicadores */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-[#a8c241]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Confianza y Seguridad */}
      <section className="py-16 bg-gray-50/30 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#a8c241]/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-[#a8c241]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Seguro</h3>
              <p className="text-gray-600 text-sm">Tus datos y pagos están completamente protegidos</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#a8c241]/10 rounded-full flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6 text-[#a8c241]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pago Rápido</h3>
              <p className="text-gray-600 text-sm">Recibe tu dinero en menos de 24 horas</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#a8c241]/10 rounded-full flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6 text-[#a8c241]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Ayudamos a reducir la basura electrónica</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA minimalista */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                ¿Tienes preguntas?
              </h3>
              <p className="text-gray-600">
                Nuestro equipo está aquí para ayudarte
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/how-it-works">
                <Button variant="outline" className="border-[#a8c241] text-[#a8c241] hover:bg-[#a8c241] hover:text-white">
                  Cómo Funciona
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-[#a8c241] text-[#a8c241] hover:bg-[#a8c241] hover:text-white">
                  Contacto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;