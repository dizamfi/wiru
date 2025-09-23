// src/types/cart.ts - Tipos específicos para el carrito de venta
export interface CartItem {
  id: string;
  categoryId: string;
  categoryName: string;
  estimatedPrice: number;
  weight: number;
  quantity: number;
  condition: string;
  images: string[];
  pricePerKg?: number;
  description?: string;
  // Campos adicionales que pueden ser útiles
  deviceType?: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES';
  addedAt?: string;
  lastModified?: string;
}

export interface DeliveryOption {
  id: 'pickup' | 'home';
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  icon?: string;
}

export interface PriceBreakdown {
  subtotal: number;
  deliveryFee: number;
  processingFee: number;
  total: number;
  savings?: number;
}

export interface CartState {
  items: CartItem[];
  selectedDelivery: 'pickup' | 'home';
  breakdown: PriceBreakdown;
}

// Condiciones de dispositivos para el formulario
export interface DeviceCondition {
  value: string;
  label: string;
  description: string;
  multiplier: number;
  color?: string;
}

export const DEVICE_CONDITIONS: DeviceCondition[] = [
  { 
    value: 'EXCELLENT', 
    label: 'Excelente', 
    description: 'Como nuevo, sin signos de uso visible', 
    multiplier: 1.0,
    color: 'green'
  },
  { 
    value: 'VERY_GOOD', 
    label: 'Muy bueno', 
    description: 'Signos mínimos de uso, funciona perfecto', 
    multiplier: 0.85,
    color: 'blue'
  },
  { 
    value: 'GOOD', 
    label: 'Bueno', 
    description: 'Uso normal, funciona correctamente', 
    multiplier: 0.70,
    color: 'yellow'
  },
  { 
    value: 'FAIR', 
    label: 'Regular', 
    description: 'Uso evidente pero completamente funcional', 
    multiplier: 0.50,
    color: 'orange'
  },
  { 
    value: 'POOR', 
    label: 'Malo', 
    description: 'Funcional pero con problemas estéticos significativos', 
    multiplier: 0.30,
    color: 'red'
  }
];

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'pickup',
    name: 'Punto Servientrega',
    description: 'Entregar en la oficina de Servientrega más cercana',
    price: 0,
    estimatedTime: '1-2 días hábiles',
    icon: '🏪'
  },
  {
    id: 'home',
    name: 'Recolección a Domicilio',
    description: 'Recogemos en tu dirección registrada',
    price: 15,
    estimatedTime: '2-3 días hábiles',
    icon: '🚚'
  }
];