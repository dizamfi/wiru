// src/types/order.ts - VERSIÓN MEJORADA COMPLETA

import { User } from ".";

// import { User } from './auth';

// Estados de la orden
export type OrderStatus = 
  | 'draft'           // Borrador (en carrito)
  | 'pending'         // Pendiente de confirmación  
  | 'confirmed'       // Confirmada, esperando recolección
  | 'pickup_scheduled'// Recolección programada
  | 'in_transit'      // En tránsito a verificación
  | 'received'        // Recibido en instalaciones
  | 'in_verification' // En proceso de verificación
  | 'verified'        // Verificado, peso/valor ajustado
  | 'payment_pending' // Pendiente de pago
  | 'paid'           // Pagado al usuario
  | 'completed'      // Completado exitosamente
  | 'cancelled'      // Cancelado
  | 'rejected';      // Rechazado en verificación

// Estados de pago
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

// Condición del dispositivo
export type DeviceCondition = 
  | 'excellent'  // Como nuevo
  | 'good'       // Buen estado
  | 'fair'       // Estado regular
  | 'poor'       // Mal estado
  | 'broken';    // No funciona

// Fuentes de invitación para referidos
export type InvitationSource = 
  | 'whatsapp'
  | 'facebook' 
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'email'
  | 'copy_link'
  | 'qr_code'
  | 'direct';

// Dirección
export interface Address {
  id?: string;
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  instructions?: string;
  isDefault?: boolean;
}

// Categoría de dispositivo
export interface DeviceCategory {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  pricePerKg: number;
  image?: string;
  isActive: boolean;
  subcategories?: DeviceSubcategory[];
  estimationFactors: {
    conditionMultiplier: Record<DeviceCondition, number>;
    accessoryBonus: Record<string, number>;
  };
}

export interface DeviceSubcategory {
  id: string;
  name: string;
  priceMultiplier: number;
}

// Item de la orden
export interface OrderItem {
  id: string;
  orderId: string;
  categoryId: string;
  category?: DeviceCategory;
  subcategoryId?: string;
  subcategory?: DeviceSubcategory;
  
  // Información del dispositivo
  deviceName: string;
  brand?: string;
  model?: string;
  description?: string;
  condition: DeviceCondition;
  
  // Peso y valor
  estimatedWeight: number;
  actualWeight?: number;
  estimatedValue: number;
  actualValue?: number;
  
  // Accesorios
  hasCharger: boolean;
  hasBox: boolean;
  hasDocuments: boolean;
  accessories?: string[];
  
  // Multimedia
  images: string[];
  videos?: string[];
  
  // Verificación
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
}

// Información de envío con Servientrega
export interface ShippingInfo {
  // Información básica
  pickupAddress: Address;
  deliveryAddress: Address;
  
  // Programación de recolección
  pickupScheduled: boolean;
  pickupDate?: string;
  pickupTimeSlot?: string;
  
  // Servientrega
  guideNumber?: string; // Número de guía
  trackingNumber?: string;
  trackingUrl?: string;
  
  // Estados de envío
  status: 'pending' | 'scheduled' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  estimatedDelivery?: string;
  actualDelivery?: string;
  
  // Eventos de seguimiento
  shippingEvents: ShippingEvent[];
  
  // Información del conductor/recolector
  driverInfo?: {
    name: string;
    phone: string;
    vehicleInfo?: string;
  };
  
  // Metadatos
  cost?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShippingEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
  isDelivered: boolean;
  metadata?: {
    driverName?: string;
    receivedBy?: string;
    signature?: string;
    photo?: string;
  };
}

// Información de verificación
export interface VerificationInfo {
  notes: any;
  photos: boolean;
  id: string;
  orderId: string;
  
  // Proceso de verificación
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  
  // Ajustes de peso y valor
  originalWeight: number;
  verifiedWeight: number;
  weightVariance: number;
  
  originalValue: number;
  verifiedValue: number;
  valueVariance: number;
  
  // Fotos de verificación
  verificationPhotos: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  
  // Notas
  verificationNotes: string;
  adjustmentReason?: string;
  
  // Aprobación
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
}

// Timeline de la orden
export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  actor?: string; // Usuario, sistema, admin
  isVisible: boolean; // Visible al usuario o solo interno
  metadata?: {
    previousValue?: any;
    newValue?: any;
    automaticAction?: boolean;
    estimatedDuration?: string;
    nextActions?: string[];
  };
}

// Orden principal
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  
  // Estado
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  // Items
  items: OrderItem[];
  
  // Valores
  estimatedTotal: number;
  finalTotal?: number; // Después de ajustes
  
  // Peso total
  estimatedWeight: number;
  actualWeight?: number;
  
  // Información del usuario
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  
  // Envío y logística
  shipping: ShippingInfo;
  
  // Verificación
  verification?: VerificationInfo;
  
  // Información de pago
  payment?: {
    method: 'bank_transfer' | 'paypal' | 'digital_wallet';
    accountInfo?: any;
    transactionId?: string;
    paidAt?: string;
    fees?: {
      platform: number;
      processing: number;
      total: number;
    };
  };
  
  // Metadatos
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  
  // Timeline
  timeline: OrderTimelineEvent[];
  
  // Fechas importantes
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  
  // Referencias
  referralCode?: string;
  campaignId?: string;
  
  // Configuración
  allowPartialValue: boolean;
  requirePhotos: boolean;
  autoAcceptVerification: boolean;
}

// Filtros para órdenes
export interface OrderFilters {
  status?: OrderStatus | OrderStatus[];
  paymentStatus?: PaymentStatus | PaymentStatus[];
  dateRange?: {
    from: string;
    to: string;
  };
  categories?: string[];
  minValue?: number;
  maxValue?: number;
  searchTerm?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'estimatedTotal' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Estadísticas de órdenes
export interface OrderStats {
  total: number;
  byStatus: Record<OrderStatus, number>;
  byPaymentStatus: Record<PaymentStatus, number>;
  totalValue: number;
  totalWeight: number;
  averageOrderValue: number;
  averageProcessingTime: number; // en horas
  satisfactionRate: number;
}

// Respuestas de API específicas para órdenes
export interface CreateOrderRequest {
  items: Omit<OrderItem, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>[];
  shipping: Omit<ShippingInfo, 'shippingEvents' | 'trackingNumber'>;
  notes?: string;
  referralCode?: string;
}

export interface CreateOrderResponse {
  order: Order;
  estimatedPickupDate: string;
  trackingInfo: {
    trackingUrl: string;
    estimatedDelivery: string;
  };
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  items?: Partial<OrderItem>[];
  shipping?: Partial<ShippingInfo>;
  notes?: string;
}

export interface OrderDetailResponse {
  order: Order;
  relatedOrders?: Order[]; // Órdenes relacionadas del usuario
  suggestions?: {
    similarCategories: DeviceCategory[];
    recommendedActions: string[];
  };
}

// Tipos para componentes
export interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  compact?: boolean;
  onClick?: (order: Order) => void;
}

export interface OrderTimelineProps {
  timeline: OrderTimelineEvent[];
  currentStatus: OrderStatus;
  showAllEvents?: boolean;
}

export interface OrderStatusTrackerProps {
  order: Order;
  onStatusUpdate?: (newStatus: OrderStatus) => void;
}

export interface ShippingTrackerProps {
  shipping: ShippingInfo;
  orderId: string;
  onTrackingUpdate?: () => void;
}

export interface VerificationModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete?: (verification: VerificationInfo) => void;
}

// Configuración completa de estados
export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  allowedTransitions: OrderStatus[];
  isTerminal: boolean;
  requiresAction: boolean;
  estimatedDuration?: string;
  userMessage?: string;
}> = {
  draft: {
    label: 'Borrador',
    description: 'Orden en proceso de creación',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: 'DocumentIcon',
    allowedTransitions: ['pending', 'cancelled'],
    isTerminal: false,
    requiresAction: true,
    userMessage: 'Completa la información para enviar tu orden'
  },
  pending: {
    label: 'Pendiente',
    description: 'Esperando confirmación',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: 'ClockIcon',
    allowedTransitions: ['confirmed', 'cancelled'],
    isTerminal: false,
    requiresAction: true,
    estimatedDuration: '2-4 horas',
    userMessage: 'Estamos revisando tu orden'
  },
  confirmed: {
    label: 'Confirmada',
    description: 'Orden confirmada, programando recolección',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: 'CheckCircleIcon',
    allowedTransitions: ['pickup_scheduled', 'cancelled'],
    isTerminal: false,
    requiresAction: false,
    estimatedDuration: '1-2 días',
    userMessage: 'Tu orden fue confirmada. Programaremos la recolección'
  },
  pickup_scheduled: {
    label: 'Recolección Programada',
    description: 'Recolección programada con Servientrega',
    color: 'indigo',
    bgColor: 'bg-indigo-100', 
    textColor: 'text-indigo-800',
    icon: 'TruckIcon',
    allowedTransitions: ['in_transit', 'cancelled'],
    isTerminal: false,
    requiresAction: false,
    userMessage: 'Prepara tu equipo para la recolección'
  },
  in_transit: {
    label: 'En Tránsito',
    description: 'Paquete en camino a nuestras instalaciones',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: 'ArrowPathIcon',
    allowedTransitions: ['received'],
    isTerminal: false,
    requiresAction: false,
    estimatedDuration: '2-3 días',
    userMessage: 'Tu equipo está en camino para verificación'
  },
  received: {
    label: 'Recibido',
    description: 'Recibido en nuestras instalaciones',
    color: 'cyan',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    icon: 'BuildingOfficeIcon',
    allowedTransitions: ['in_verification'],
    isTerminal: false,
    requiresAction: false,
    estimatedDuration: '1 día',
    userMessage: 'Recibimos tu equipo, iniciando verificación'
  },
  in_verification: {
    label: 'En Verificación',
    description: 'Verificando peso, estado y valor',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: 'MagnifyingGlassIcon',
    allowedTransitions: ['verified', 'rejected'],
    isTerminal: false,
    requiresAction: false,
    estimatedDuration: '1-2 días',
    userMessage: 'Estamos verificando tu equipo'
  },
  verified: {
    label: 'Verificado',
    description: 'Verificación completa, valor ajustado',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'CheckBadgeIcon',
    allowedTransitions: ['payment_pending'],
    isTerminal: false,
    requiresAction: false,
    userMessage: 'Verificación completa. Procesando pago'
  },
  payment_pending: {
    label: 'Pago Pendiente',
    description: 'Procesando transferencia',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: 'BanknotesIcon',
    allowedTransitions: ['paid'],
    isTerminal: false,
    requiresAction: false,
    estimatedDuration: '1-2 días',
    userMessage: 'Procesando tu pago'
  },
  paid: {
    label: 'Pagado',
    description: 'Pago transferido exitosamente',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    icon: 'CheckCircleIcon',
    allowedTransitions: ['completed'],
    isTerminal: false,
    requiresAction: false,
    userMessage: '¡Pago realizado! Revisa tu cuenta'
  },
  completed: {
    label: 'Completado',
    description: 'Orden completada exitosamente',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800', 
    icon: 'SparklesIcon',
    allowedTransitions: [],
    isTerminal: true,
    requiresAction: false,
    userMessage: '¡Orden completada! Gracias por reciclar con nosotros'
  },
  cancelled: {
    label: 'Cancelado',
    description: 'Orden cancelada',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: 'XCircleIcon',
    allowedTransitions: [],
    isTerminal: true,
    requiresAction: false,
    userMessage: 'Orden cancelada'
  },
  rejected: {
    label: 'Rechazado',
    description: 'Orden rechazada en verificación',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'ExclamationTriangleIcon',
    allowedTransitions: [],
    isTerminal: true,
    requiresAction: false,
    userMessage: 'Orden rechazada. Contacta soporte para más info'
  }
};

// Configuración de estados de pago
export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}> = {
  pending: {
    label: 'Pendiente',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: 'ClockIcon'
  },
  processing: {
    label: 'Procesando',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: 'ArrowPathIcon'
  },
  completed: {
    label: 'Completado',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'CheckCircleIcon'
  },
  failed: {
    label: 'Fallido',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'ExclamationTriangleIcon'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: 'XCircleIcon'
  },
  refunded: {
    label: 'Reembolsado',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: 'ArrowUturnLeftIcon'
  }
};

// Configuración de condiciones de dispositivos
export const DEVICE_CONDITION_CONFIG: Record<DeviceCondition, {
  label: string;
  description: string;
  priceMultiplier: number;
  color: string;
  icon: string;
}> = {
  excellent: {
    label: 'Excelente',
    description: 'Como nuevo, sin marcas de uso',
    priceMultiplier: 1.0,
    color: 'text-green-600',
    icon: 'SparklesIcon'
  },
  good: {
    label: 'Buen Estado',
    description: 'Ligeras marcas de uso normal',
    priceMultiplier: 0.85,
    color: 'text-blue-600',
    icon: 'CheckCircleIcon'
  },
  fair: {
    label: 'Estado Regular',
    description: 'Marcas visibles pero funcional',
    priceMultiplier: 0.70,
    color: 'text-yellow-600',
    icon: 'ExclamationTriangleIcon'
  },
  poor: {
    label: 'Mal Estado',
    description: 'Daños visibles, funcionalidad limitada',
    priceMultiplier: 0.50,
    color: 'text-orange-600',
    icon: 'XMarkIcon'
  },
  broken: {
    label: 'No Funciona',
    description: 'No enciende o no funciona',
    priceMultiplier: 0.30,
    color: 'text-red-600',
    icon: 'XCircleIcon'
  }
};

// Utilidades para trabajar con órdenes
export const OrderUtils = {
  // Obtener siguiente estado posible
  getNextStatus: (currentStatus: OrderStatus): OrderStatus[] => {
    return ORDER_STATUS_CONFIG[currentStatus].allowedTransitions;
  },
  
  // Verificar si se puede transicionar a un estado
  canTransitionTo: (from: OrderStatus, to: OrderStatus): boolean => {
    return ORDER_STATUS_CONFIG[from].allowedTransitions.includes(to);
  },
  
  // Verificar si el estado es terminal
  isTerminalStatus: (status: OrderStatus): boolean => {
    return ORDER_STATUS_CONFIG[status].isTerminal;
  },
  
  // Verificar si requiere acción del usuario
  requiresUserAction: (status: OrderStatus): boolean => {
    return ORDER_STATUS_CONFIG[status].requiresAction;
  },
  
  // Calcular progreso del estado (0-100%)
  getStatusProgress: (status: OrderStatus): number => {
    const statusOrder: OrderStatus[] = [
      'draft', 'pending', 'confirmed', 'pickup_scheduled', 
      'in_transit', 'received', 'in_verification', 'verified', 
      'payment_pending', 'paid', 'completed'
    ];
    
    const index = statusOrder.indexOf(status);
    return index >= 0 ? Math.round((index / (statusOrder.length - 1)) * 100) : 0;
  },
  
  // Obtener color de progreso
  getProgressColor: (status: OrderStatus): string => {
    const progress = OrderUtils.getStatusProgress(status);
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500'; 
    if (progress < 90) return 'bg-blue-500';
    return 'bg-green-500';
  }
};