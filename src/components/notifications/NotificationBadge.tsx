// src/components/notifications/NotificationBadge.tsx

import React, { useEffect, useState } from 'react';
import notificationService from '@/services/notificationService';

interface NotificationBadgeProps {
  className?: string;
}

/**
 * Badge simple para mostrar contador de notificaciones no leídas
 * Útil para usar en el sidebar o navegación
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Cargar contador inicial
    const fetchCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchCount();

    // Actualizar cada 30 segundos
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (unreadCount === 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;