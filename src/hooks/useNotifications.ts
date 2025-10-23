// // src/hooks/useNotifications.ts

// import { useState, useEffect, useCallback } from 'react';
// import notificationService, {
//   Notification,
//   NotificationFilters,
//   NotificationStats,
//   NotificationType,
// } from '@/services/notificationService';
// import { toast } from 'react-hot-toast';

// interface UseNotificationsReturn {
//   notifications: Notification[];
//   unreadCount: number;
//   stats: NotificationStats | null;
//   loading: boolean;
//   error: string | null;
//   hasMore: boolean;
  
//   // Actions
//   fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
//   loadMore: () => Promise<void>;
//   markAsRead: (notificationId: string) => Promise<void>;
//   markAllAsRead: () => Promise<void>;
//   archive: (notificationId: string) => Promise<void>;
//   deleteNotification: (notificationId: string) => Promise<void>;
//   deleteAllRead: () => Promise<void>;
//   refreshUnreadCount: () => Promise<void>;
//   refreshStats: () => Promise<void>;
//   createTestNotification: (type?: NotificationType) => Promise<void>;
// }

// export const useNotifications = (): UseNotificationsReturn => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [stats, setStats] = useState<NotificationStats | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filters, setFilters] = useState<NotificationFilters>({});

//   const hasMore = currentPage < totalPages;

//   /**
//    * Obtener notificaciones
//    */
//   const fetchNotifications = useCallback(async (newFilters?: NotificationFilters) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const finalFilters = { ...newFilters, page: 1, limit: 20 };
//       setFilters(finalFilters);
      
//       const response = await notificationService.getNotifications(finalFilters);
      
//       setNotifications(response.notifications);
//       setCurrentPage(response.pagination.page);
//       setTotalPages(response.pagination.totalPages);
//     } catch (err: any) {
//       setError(err.message);
//       console.error('Error fetching notifications:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Cargar más notificaciones (paginación)
//    */
//   const loadMore = useCallback(async () => {
//     if (!hasMore || loading) return;

//     try {
//       setLoading(true);
      
//       const nextPage = currentPage + 1;
//       const response = await notificationService.getNotifications({
//         ...filters,
//         page: nextPage,
//       });
      
//       setNotifications(prev => [...prev, ...response.notifications]);
//       setCurrentPage(response.pagination.page);
//       setTotalPages(response.pagination.totalPages);
//     } catch (err: any) {
//       setError(err.message);
//       console.error('Error loading more notifications:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, filters, hasMore, loading]);

//   /**
//    * Marcar notificación como leída
//    */
//   const markAsRead = useCallback(async (notificationId: string) => {
//     try {
//       const updatedNotification = await notificationService.markAsRead(notificationId);
      
//       setNotifications(prev =>
//         prev.map(n => (n.id === notificationId ? updatedNotification : n))
//       );
      
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (err: any) {
//       toast.error(err.message);
//       console.error('Error marking notification as read:', err);
//     }
//   }, []);

//   /**
//    * Marcar todas como leídas
//    */
//   const markAllAsRead = useCallback(async () => {
//     try {
//       const result = await notificationService.markAllAsRead();
      
//       setNotifications(prev =>
//         prev.map(n => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() }))
//       );
      
//       setUnreadCount(0);
//       toast.success(`${result.count} notificaciones marcadas como leídas`);
//     } catch (err: any) {
//       toast.error(err.message);
//       console.error('Error marking all as read:', err);
//     }
//   }, []);

//   /**
//    * Archivar notificación
//    */
//   const archive = useCallback(async (notificationId: string) => {
//     try {
//       const updatedNotification = await notificationService.archive(notificationId);
      
//       setNotifications(prev =>
//         prev.map(n => (n.id === notificationId ? updatedNotification : n))
//       );
      
//       toast.success('Notificación archivada');
//     } catch (err: any) {
//       toast.error(err.message);
//       console.error('Error archiving notification:', err);
//     }
//   }, []);

//   /**
//    * Eliminar notificación
//    */
//   const deleteNotification = useCallback(async (notificationId: string) => {
//     try {
//       await notificationService.delete(notificationId);
      
//       setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
//       // Si la notificación era no leída, decrementar el contador
//       const notification = notifications.find(n => n.id === notificationId);
//       if (notification?.status === 'UNREAD') {
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       }
      
//       toast.success('Notificación eliminada');
//     } catch (err: any) {
//       toast.error(err.message);
//       console.error('Error deleting notification:', err);
//     }
//   }, [notifications]);

//   /**
//    * Eliminar todas las notificaciones leídas
//    */
//   const deleteAllRead = useCallback(async () => {
//     try {
//       const result = await notificationService.deleteAllRead();
      
//       setNotifications(prev => prev.filter(n => n.status !== 'READ'));
      
//       toast.success(`${result.count} notificaciones eliminadas`);
//     } catch (err: any) {
//       toast.error(err.message);
//       console.error('Error deleting read notifications:', err);
//     }
//   }, []);

//   /**
//    * Refrescar contador de no leídas
//    */
//   const refreshUnreadCount = useCallback(async () => {
//     try {
//       const count = await notificationService.getUnreadCount();
//       setUnreadCount(count);
//     } catch (err: any) {
//       console.error('Error refreshing unread count:', err);
//     }
//   }, []);

//   /**
//    * Refrescar estadísticas
//    */
//   const refreshStats = useCallback(async () => {
//     try {
//       const newStats = await notificationService.getStats();
//       setStats(newStats);
//     } catch (err: any) {
//       console.error('Error refreshing stats:', err);
//     }
//   }, []);

//   /**
//    * Crear notificación de prueba (solo desarrollo)
//    */
//   const createTestNotification = useCallback(async (type?: NotificationType) => {
//     try {
//       const notification = await notificationService.createTestNotification(type);
      
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
      
//       toast.success('Notificación de prueba creada');
//     } catch (err: any) {
//       toast.error(err.message);
//       console.error('Error creating test notification:', err);
//     }
//   }, []);

//   /**
//    * Inicializar: cargar notificaciones y contador
//    */
//   useEffect(() => {
//     fetchNotifications();
//     refreshUnreadCount();
//     refreshStats();
//   }, []);

//   /**
//    * Polling para actualizar contador cada 30 segundos
//    */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refreshUnreadCount();
//     }, 30000); // 30 segundos

//     return () => clearInterval(interval);
//   }, [refreshUnreadCount]);

//   return {
//     notifications,
//     unreadCount,
//     stats,
//     loading,
//     error,
//     hasMore,
    
//     fetchNotifications,
//     loadMore,
//     markAsRead,
//     markAllAsRead,
//     archive,
//     deleteNotification,
//     deleteAllRead,
//     refreshUnreadCount,
//     refreshStats,
//     createTestNotification,
//   };
// };

// export default useNotifications;







import { useState, useEffect, useCallback } from 'react';
import notificationService, {
  Notification,
  NotificationFilters,
  NotificationStats,
  NotificationType,
} from '@/services/notificationService';
import websocketClient from '@/services/websocketClient'; // ← NUEVO IMPORT
import { toast } from 'react-hot-toast';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isConnected: boolean; // ← NUEVO
  
  // Actions
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archive: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  refreshStats: () => Promise<void>;
  createTestNotification: (type?: NotificationType) => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [isConnected, setIsConnected] = useState(false); // ← NUEVO

  const hasMore = currentPage < totalPages;

  /**
   * Obtener notificaciones
   */
  const fetchNotifications = useCallback(async (newFilters?: NotificationFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalFilters = { ...newFilters, page: 1, limit: 20 };
      setFilters(finalFilters);
      
      const response = await notificationService.getNotifications(finalFilters);
      
      setNotifications(response.notifications);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar más notificaciones (paginación)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      
      const nextPage = currentPage + 1;
      const response = await notificationService.getNotifications({
        ...filters,
        page: nextPage,
      });
      
      setNotifications(prev => [...prev, ...response.notifications]);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading more notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, hasMore, loading]);

  /**
   * Marcar notificación como leída
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? updatedNotification : n))
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // También notificar al servidor via WebSocket
      websocketClient.markAsRead(notificationId);
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error marking notification as read:', err);
    }
  }, []);

  /**
   * Marcar todas como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const result = await notificationService.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() }))
      );
      
      setUnreadCount(0);
      toast.success(`${result.count} notificaciones marcadas como leídas`);
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error marking all as read:', err);
    }
  }, []);

  /**
   * Archivar notificación
   */
  const archive = useCallback(async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.archive(notificationId);
      
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? updatedNotification : n))
      );
      
      toast.success('Notificación archivada');
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error archiving notification:', err);
    }
  }, []);

  /**
   * Eliminar notificación
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.delete(notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      const notification = notifications.find(n => n.id === notificationId);
      if (notification?.status === 'UNREAD') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notificación eliminada');
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  /**
   * Eliminar todas las notificaciones leídas
   */
  const deleteAllRead = useCallback(async () => {
    try {
      const result = await notificationService.deleteAllRead();
      
      setNotifications(prev => prev.filter(n => n.status !== 'READ'));
      
      toast.success(`${result.count} notificaciones eliminadas`);
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error deleting read notifications:', err);
    }
  }, []);

  /**
   * Refrescar contador de no leídas
   */
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Error refreshing unread count:', err);
    }
  }, []);

  /**
   * Refrescar estadísticas
   */
  const refreshStats = useCallback(async () => {
    try {
      const newStats = await notificationService.getStats();
      setStats(newStats);
    } catch (err: any) {
      console.error('Error refreshing stats:', err);
    }
  }, []);

  /**
   * Crear notificación de prueba (solo desarrollo)
   */
  const createTestNotification = useCallback(async (type?: NotificationType) => {
    try {
      const notification = await notificationService.createTestNotification(type);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast.success('Notificación de prueba creada');
    } catch (err: any) {
      toast.error(err.message);
      console.error('Error creating test notification:', err);
    }
  }, []);

  /**
   * ✅ CONFIGURAR WEBSOCKETS
   */
  useEffect(() => {
    // Conectar al WebSocket
    websocketClient.connect();

    // Listener de conexión
    const handleConnected = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      refreshUnreadCount(); // Actualizar contador al conectar
    };

    // Listener de desconexión
    const handleDisconnected = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    // Listener de nueva notificación en tiempo real
    const handleNewNotification = (data: any) => {
      console.log('🔔 Nueva notificación recibida via WebSocket:', data);
      
      // Refrescar notificaciones
      fetchNotifications(filters);
      
      // Incrementar contador
      setUnreadCount(prev => prev + 1);
      
      // Mostrar toast
      toast.success('🔔 Nueva notificación', {
        duration: 3000,
      });
    };

    // Listener de contador actualizado
    const handleUnreadCountUpdated = (count: number) => {
      setUnreadCount(count);
    };

    // Registrar listeners
    websocketClient.on('connected', handleConnected);
    websocketClient.on('disconnected', handleDisconnected);
    websocketClient.on('notification', handleNewNotification);
    websocketClient.on('unreadCountUpdated', handleUnreadCountUpdated);

    // Cleanup
    return () => {
      websocketClient.off('connected', handleConnected);
      websocketClient.off('disconnected', handleDisconnected);
      websocketClient.off('notification', handleNewNotification);
      websocketClient.off('unreadCountUpdated', handleUnreadCountUpdated);
    };
  }, [filters, fetchNotifications, refreshUnreadCount]);

  /**
   * Inicializar: cargar notificaciones y contador
   */
  useEffect(() => {
    fetchNotifications();
    refreshUnreadCount();
    refreshStats();
  }, []);

  return {
    notifications,
    unreadCount,
    stats,
    loading,
    error,
    hasMore,
    isConnected, // ← NUEVO
    
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    archive,
    deleteNotification,
    deleteAllRead,
    refreshUnreadCount,
    refreshStats,
    createTestNotification,
  };
};

export default useNotifications;