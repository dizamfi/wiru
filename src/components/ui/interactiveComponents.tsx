import React, { useState, useEffect } from 'react';
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/Button';

// Componente de dispositivo flotante interactivo
export const FloatingDevice: React.FC<{ type: 'phone' | 'laptop'; delay?: number }> = ({ type, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`absolute transition-all duration-1000 ease-in-out cursor-pointer ${
        isHovered ? 'scale-110' : 'scale-100'
      } animate-float`}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {type === 'phone' ? (
          <div className="w-16 h-28 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl border border-gray-600 flex flex-col">
            <div className="h-2 bg-gray-700 rounded-t-lg"></div>
            <div className="flex-1 bg-[#a8c241] m-1 rounded-sm flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-24 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-2xl flex flex-col">
            <div className="h-2 bg-gray-800 rounded-t-lg"></div>
            <div className="flex-1 bg-[#a8c241] m-1 rounded-sm flex items-center justify-center">
              <CurrencyDollarIcon className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
        
        {/* Efecto de dinero flotante */}
        {isHovered && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              +$250
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de partículas de dinero animadas
export const MoneyParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-[#a8c241] opacity-30 animate-money-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <CurrencyDollarIcon className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
};

// Componente de calculadora interactiva de precio
export const PriceCalculator: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('phone');
  const [condition, setCondition] = useState('good');
  const [estimatedPrice, setEstimatedPrice] = useState(180);

  const devices = {
    phone: { name: 'Smartphone', basePrice: 200 },
    laptop: { name: 'Laptop', basePrice: 400 },
    tablet: { name: 'Tablet', basePrice: 150 },
    camera: { name: 'Cámara', basePrice: 120 }
  };

  const conditions = {
    excellent: { name: 'Excelente', multiplier: 1.0 },
    good: { name: 'Bueno', multiplier: 0.8 },
    fair: { name: 'Regular', multiplier: 0.6 },
    poor: { name: 'Malo', multiplier: 0.4 }
  };

  useEffect(() => {
    const basePrice = devices[selectedDevice as keyof typeof devices].basePrice;
    const multiplier = conditions[condition as keyof typeof conditions].multiplier;
    const newPrice = Math.floor(basePrice * multiplier);
    
    // Animar el cambio de precio
    let current = estimatedPrice;
    const step = (newPrice - current) / 20;
    
    const animatePrice = () => {
      current += step;
      if ((step > 0 && current >= newPrice) || (step < 0 && current <= newPrice)) {
        setEstimatedPrice(newPrice);
      } else {
        setEstimatedPrice(Math.floor(current));
        requestAnimationFrame(animatePrice);
      }
    };
    
    requestAnimationFrame(animatePrice);
  }, [selectedDevice, condition, estimatedPrice]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border-2 border-[#a8c241]/20">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Calculadora de Precio
      </h3>
      
      <div className="space-y-6">
        {/* Selector de dispositivo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tipo de Dispositivo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(devices).map(([key, device]) => (
              <button
                key={key}
                onClick={() => setSelectedDevice(key)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                  selectedDevice === key
                    ? 'border-[#a8c241] bg-[#a8c241]/10 text-[#a8c241]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{device.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de condición */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Condición del Dispositivo
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#a8c241] focus:outline-none transition-colors duration-300"
          >
            {Object.entries(conditions).map(([key, cond]) => (
              <option key={key} value={key}>
                {cond.name}
              </option>
            ))}
          </select>
        </div>

        {/* Precio estimado */}
        <div className="bg-gradient-to-r from-[#a8c241]/10 to-[#8ea635]/10 rounded-xl p-6 text-center border border-[#a8c241]/20">
          <div className="text-sm text-gray-600 mb-2">Precio Estimado</div>
          <div className="text-4xl font-bold text-[#a8c241] mb-2">
            ${estimatedPrice}
          </div>
          <div className="text-xs text-gray-500">
            *Precio final sujeto a evaluación
          </div>
        </div>

        {/* Botón de acción */}
        <Button className="w-full bg-[#a8c241] hover:bg-[#8ea635] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Obtener Cotización Exacta
          <ArrowRightIcon className="inline h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Componente de testimonial con video
export const VideoTestimonial: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Ana Rodríguez",
      location: "CDMX, México",
      amount: "$320",
      device: "iPhone 12 Pro",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "Increíble experiencia. Vendí mi iPhone y el dinero llegó en menos de 24 horas como prometieron."
    },
    {
      name: "Carlos Mendez",
      location: "Bogotá, Colombia", 
      amount: "$580",
      device: "MacBook Air",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "La mejor plataforma para vender electrónicos usados. Precio justo y proceso súper rápido."
    },
    {
      name: "María González",
      location: "Buenos Aires, Argentina",
      amount: "$150",
      device: "Samsung Galaxy",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Confiable y seguro. Me encanta que se preocupen por el medio ambiente mientras gano dinero."
    }
  ];

  const currentTestimonialData = testimonials[currentTestimonial];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Historias de Éxito
        </h3>
        <div className="flex space-x-2">
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

      <div className="relative">
        {/* Video placeholder */}
        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6 aspect-video">
          <img 
            src={currentTestimonialData.image}
            alt={currentTestimonialData.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-[#a8c241] hover:bg-[#8ea635] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110"
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8 text-white" />
              ) : (
                <PlayIcon className="h-8 w-8 text-white ml-1" />
              )}
            </button>
          </div>
          
          {/* Overlay con información */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3 text-white backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{currentTestimonialData.name}</div>
                <div className="text-sm opacity-75">{currentTestimonialData.location}</div>
              </div>
              <div className="text-right">
                <div className="text-[#a8c241] font-bold text-lg">{currentTestimonialData.amount}</div>
                <div className="text-sm opacity-75">{currentTestimonialData.device}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial content */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
            ))}
          </div>
          
          <blockquote className="text-gray-700 text-lg italic leading-relaxed mb-6">
            "{currentTestimonialData.quote}"
          </blockquote>
          
          <div className="flex items-center justify-center space-x-3">
            <img
              src={currentTestimonialData.image}
              alt={currentTestimonialData.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#a8c241]"
            />
            <div className="text-left">
              <div className="font-semibold text-gray-900">{currentTestimonialData.name}</div>
              <div className="text-sm text-gray-600">{currentTestimonialData.location}</div>
            </div>
            <div className="ml-4">
              <CheckIcon className="h-6 w-6 text-[#a8c241]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de estadísticas en tiempo real
export const LiveStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalEarned: 2847392,
    devicesRecycled: 12845,
    co2Saved: 1847,
    activeUsers: 3421
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalEarned: prev.totalEarned + Math.floor(Math.random() * 50) + 10,
        devicesRecycled: prev.devicesRecycled + (Math.random() > 0.7 ? 1 : 0),
        co2Saved: prev.co2Saved + (Math.random() > 0.8 ? 1 : 0),
        activeUsers: prev.activeUsers + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      label: "Total Ganado",
      value: `${stats.totalEarned.toLocaleString()}`,
      color: "text-green-500",
      bgColor: "bg-green-50",
      icon: "💰"
    },
    {
      label: "Dispositivos Reciclados",
      value: stats.devicesRecycled.toLocaleString(),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: "📱"
    },
    {
      label: "CO2 Ahorrado (kg)",
      value: stats.co2Saved.toLocaleString(),
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: "🌱"
    },
    {
      label: "Usuarios Activos",
      value: stats.activeUsers.toLocaleString(),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      icon: "👥"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Estadísticas en Vivo</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">En tiempo real</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-4 transition-all duration-500 hover:scale-105`}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Datos actualizados cada 3 segundos
      </div>
    </div>
  );
};

// Componente de comparación de precios
export const PriceComparison: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('iPhone 13');
  
  const comparisons = {
    'iPhone 13': {
      wiru: 280,
      competitor1: 220,
      competitor2: 195,
      market: 240
    },
    'Samsung Galaxy S22': {
      wiru: 240,
      competitor1: 180,
      competitor2: 165,
      market: 200
    },
    'MacBook Air M1': {
      wiru: 650,
      competitor1: 520,
      competitor2: 480,
      market: 580
    }
  };

  const currentComparison = comparisons[selectedDevice as keyof typeof comparisons];
  const savings = currentComparison.wiru - currentComparison.market;
  const savingsPercentage = Math.round((savings / currentComparison.market) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-lg mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Comparador de Precios
      </h3>

      {/* Selector de dispositivo */}
      <select
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
        className="w-full p-3 mb-6 border-2 border-gray-200 rounded-lg focus:border-[#a8c241] focus:outline-none"
      >
        {Object.keys(comparisons).map((device) => (
          <option key={device} value={device}>{device}</option>
        ))}
      </select>

      {/* Comparación de precios */}
      <div className="space-y-4 mb-6">
        {/* Wiru */}
        <div className="bg-gradient-to-r from-[#a8c241]/10 to-[#8ea635]/10 rounded-lg p-4 border-2 border-[#a8c241]">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#a8c241] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-gray-900">Wiru</span>
            </div>
            <div className="text-2xl font-bold text-[#a8c241]">
              ${currentComparison.wiru}
            </div>
          </div>
        </div>

        {/* Competidores */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Competidor A</span>
            <span className="text-xl font-semibold text-gray-600">
              ${currentComparison.competitor1}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Competidor B</span>
            <span className="text-xl font-semibold text-gray-600">
              ${currentComparison.competitor2}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Promedio Mercado</span>
            <span className="text-xl font-semibold text-gray-600">
              ${currentComparison.market}
            </span>
          </div>
        </div>
      </div>

      {/* Beneficio */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
        <div className="text-sm text-green-700 mb-1">Ganas extra con Wiru</div>
        <div className="text-3xl font-bold text-green-600">
          +${savings}
        </div>
        <div className="text-sm text-green-600">
          ({savingsPercentage}% más que el promedio)
        </div>
      </div>
    </div>
  );
};