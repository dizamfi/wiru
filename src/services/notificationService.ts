// src/services/notificationService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// ============= INTERFACES =============

export type NotificationType =
  | 'ORDER_UPDATE'
  | 'PAYMENT_RECEIVED'
  | 'WITHDRAWAL_COMPLETED'
  | 'VERIFICATION_REQUIRED'
  | 'SYSTEM_MAINTENANCE';

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

export interface NotificationFilters {
  status?: NotificationStatus;
  type?: NotificationType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<NotificationType, number>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============= SERVICIO =============

class NotificationService {
  private getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Obtener notificaciones
   */
  async getNotifications(filters?: NotificationFilters): Promise<NotificationsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(
        `${API_URL}/notifications?${params.toString()}`,
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener notificaciones');
    }
  }

  /**
   * Eliminar todas las notificaciones leídas
   */
  async deleteAllRead(): Promise<{ count: number }> {
    try {
      const response = await axios.delete(
        `${API_URL}/notifications/read`,
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error deleting read notifications:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar notificaciones');
    }
  }

  /**
   * Crear notificación de prueba (solo desarrollo)
   */
  async createTestNotification(type: NotificationType = 'ORDER_UPDATE'): Promise<Notification> {
    try {
      const response = await axios.post(
        `${API_URL}/notifications/test`,
        { type },
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating test notification:', error);
      throw new Error(error.response?.data?.message || 'Error al crear notificación de prueba');
    }
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/stats`,
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching notification stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }

  /**
   * Obtener contador de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/unread-count`,
        this.getAuthHeader()
      );

      return response.data.data.count;
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw new Error(error.response?.data?.message || 'Error al marcar como leída');
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<{ count: number }> {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      throw new Error(error.response?.data?.message || 'Error al marcar todas como leídas');
    }
  }

  /**
   * Archivar notificación
   */
  async archive(notificationId: string): Promise<Notification> {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/archive`,
        {},
        this.getAuthHeader()
      );

      return response.data.data;
    } catch (error: any) {
      console.error('Error archiving notification:', error);
      throw new Error(error.response?.data?.message || 'Error al archivar');
    }
  }

  /**
   * Eliminar notificación
   */
  async delete(notificationId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la notificación');
    }
  }
}

export default new NotificationService();