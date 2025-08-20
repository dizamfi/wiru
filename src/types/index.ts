// Tipos base para la aplicación
export interface User {
  status: string;
  role(role: any): boolean;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isVerified: boolean;
  avatar?: string;
  referralCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  pricePerKg: number;
  image?: string;
  isActive: boolean;
}

export interface OrderItem {
  id?: string;
  categoryId: string;
  category?: Category;
  estimatedWeight: number;
  images: string[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'VERIFIED' | 'PAID' | 'CANCELLED';
  estimatedTotal: number;
  finalTotal?: number;
  estimatedWeight: number;
  actualWeight?: number;
  pickupAddress?: any;
  pickupDate?: string;
  deliveryDate?: string;
  trackingNumber?: string;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export * from './payment';