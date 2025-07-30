// src/types/order.ts

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

// Timeline de la orden
export interface OrderTimelineEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  actor?: string; // Usuario, sistema, admin
  metadata?: {
    previousValue?: any;
    newValue?: any;
    automaticAction?: boolean;
    [key: string]: any;
  };
  isVisible: boolean;
}

// Información de envío/logística
export interface ShippingInfo {
  provider: 'servientrega' | 'other';
  trackingNumber?: string;
  guideNumber?: string;
  
  // Recolección
  pickupScheduled: boolean;
  pickupDate?: string;
  pickupTimeSlot?: string;
  pickupAddress: Address;
  pickupInstructions?: string;
  
  // Envío
  shippedAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  
  // Estado del envío
  shippingStatus: 'pending' | 'scheduled' | 'collected' | 'in_transit' | 'delivered' | 'failed';
  shippingEvents: ShippingEvent[];
}

export interface ShippingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  isDelivery?: boolean;
}

// Información de verificación
export interface VerificationInfo {
  verificationId: string;
  verifiedAt: string;
  verifiedBy: string;
  
  // Resultados
  totalEstimatedWeight: number;
  totalActualWeight: number;
  weightVariance: number;
  
  totalEstimatedValue: number;
  totalActualValue: number;
  valueVariance: number;
  
  // Detalles por item
  itemVerifications: ItemVerification[];
  
  // Notas y observaciones
  notes?: string;
  images?: string[];
  rejectionReason?: string;
  
  // Aprobación
  requiresApproval: boolean;
  approvedAt?: string;
  approvedBy?: string;
  customerNotified: boolean;
}

export interface ItemVerification {
  itemId: string;
  actualWeight: number;
  actualValue: number;
  condition: DeviceCondition;
  functionalityTest: boolean;
  cosmeticAssessment: string;
  notes?: string;
  images?: string[];
}

// Orden principal
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  
  // Estado general
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  // Items
  items: OrderItem[];
  
  // Valores totales
  estimatedTotal: number;
  actualTotal?: number;
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

// Configuración de estados
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
    requiresAction: true
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
    requiresAction: true
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
    requiresAction: false
  },
  pickup_scheduled: {
    label: 'Recolección Programada',
    description: 'Recolección programada',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    icon: 'CalendarIcon',
    allowedTransitions: ['in_transit', 'cancelled'],
    isTerminal: false,
    requiresAction: false
  },
  in_transit: {
    label: 'En Tránsito',
    description: 'En camino a verificación',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: 'TruckIcon',
    allowedTransitions: ['received', 'cancelled'],
    isTerminal: false,
    requiresAction: false
  },
  received: {
    label: 'Recibido',
    description: 'Recibido en instalaciones',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'InboxIcon',
    allowedTransitions: ['in_verification'],
    isTerminal: false,
    requiresAction: false
  },
  in_verification: {
    label: 'En Verificación',
    description: 'Verificando peso y estado',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: 'MagnifyingGlassIcon',
    allowedTransitions: ['verified', 'rejected'],
    isTerminal: false,
    requiresAction: false
  },
  verified: {
    label: 'Verificado',
    description: 'Verificado, procesando pago',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    icon: 'ShieldCheckIcon',
    allowedTransitions: ['payment_pending'],
    isTerminal: false,
    requiresAction: false
  },
  payment_pending: {
    label: 'Pago Pendiente',
    description: 'Procesando pago al usuario',
    color: 'cyan',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    icon: 'CreditCardIcon',
    allowedTransitions: ['paid'],
    isTerminal: false,
    requiresAction: false
  },
  paid: {
    label: 'Pagado',
    description: 'Pago completado',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'CheckIcon',
    allowedTransitions: ['completed'],
    isTerminal: false,
    requiresAction: false
  },
  completed: {
    label: 'Completado',
    description: 'Orden completada exitosamente',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: 'CheckBadgeIcon',
    allowedTransitions: [],
    isTerminal: true,
    requiresAction: false
  },
  cancelled: {
    label: 'Cancelado',
    description: 'Orden cancelada',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'XCircleIcon',
    allowedTransitions: [],
    isTerminal: true,
    requiresAction: false
  },
  rejected: {
    label: 'Rechazado',
    description: 'Rechazado en verificación',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: 'XMarkIcon',
    allowedTransitions: ['cancelled'],
    isTerminal: false,
    requiresAction: true
  }
};