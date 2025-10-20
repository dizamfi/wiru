// src/services/orderService.ts - SERVICIO COMPLETO DE ÓRDENES

import api from "./api";


export interface OrderItem {
  id: string;
  categoryId: string;
  estimatedWeight: number;
  actualWeight?: number;
  pricePerKg: number;
  estimatedValue: number;
  actualValue?: number;
  images: string[];
  notes?: string;
  category: {
    name: string;
    description?: string;
    pricePerKg: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'VERIFIED' | 'PAID' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  deliveryMethod: 'PICKUP_POINT' | 'HOME_PICKUP';
  estimatedTotal: number;
  finalTotal?: number;
  estimatedWeight: number;
  actualWeight?: number;
  pickupAddress?: any;
  pickupDate?: string;
  deliveryDate?: string;
  trackingNumber?: string;
  qrCode?: string;
  notes?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class OrderService {
  /**
   * Obtener órdenes del usuario
   */
  async getUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<OrdersResponse> {
    try {
      console.log('📦 Fetching user orders with params:', params);

      const response = await api.get('/orders', { params });

      console.log('✅ Orders fetched:', response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error fetching orders:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener órdenes'
      );
    }
  }

  /**
   * Obtener orden por ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      console.log('📦 Fetching order by ID:', orderId);

      const response = await api.get(`/orders/${orderId}`);

      console.log('✅ Order fetched:', response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error fetching order:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener la orden'
      );
    }
  }

  /**
   * Cancelar orden
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      console.log('❌ Cancelling order:', { orderId, reason });

      const response = await api.put(`/orders/${orderId}/cancel`, { reason });

      console.log('✅ Order cancelled:', response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error cancelling order:', error);
      throw new Error(
        error.response?.data?.message || 'Error al cancelar la orden'
      );
    }
  }

  /**
   * Crear nueva orden
   */
  async createOrder(payload: any): Promise<Order> {
    try {
      console.log('📤 Creating order:', payload);

      const response = await api.post('/orders', payload);

      console.log('✅ Order created:', response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      throw new Error(
        error.response?.data?.message || 'Error al crear la orden'
      );
    }
  }
}

export default new OrderService();