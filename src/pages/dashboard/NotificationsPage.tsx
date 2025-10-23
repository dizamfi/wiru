// src/pages/dashboard/NotificationsPage.tsx

import React, { useState } from 'react';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  ArchiveBoxIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification, NotificationType, NotificationStatus } from '@/services/notificationService';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    stats,
    loading,
    hasMore,
    markAsRead,
    markAllAsRead,
    archive,
    deleteNotification,
    deleteAllRead,
    loadMore,
    fetchNotifications,
    createTestNotification,
  } = useNotifications();

  const [selectedFilter, setSelectedFilter] = useState<NotificationStatus | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<NotificationType | 'ALL'>('ALL');

  const isDevelopment = import.meta.env.DEV;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return '📦';
      case 'PAYMENT_RECEIVED':
        return '💰';
      case 'WITHDRAWAL_COMPLETED':
        return '✅';
      case 'VERIFICATION_REQUIRED':
        return '⚠️';
      case 'SYSTEM_MAINTENANCE':
        return '🔧';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return 'bg-blue-50 border-blue-200';
      case 'PAYMENT_RECEIVED':
        return 'bg-green-50 border-green-200';
      case 'WITHDRAWAL_COMPLETED':
        return 'bg-purple-50 border-purple-200';
      case 'VERIFICATION_REQUIRED':
        return 'bg-yellow-50 border-yellow-200';
      case 'SYSTEM_MAINTENANCE':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    const labels: Record<NotificationType, string> = {
      ORDER_UPDATE: 'Orden',
      PAYMENT_RECEIVED: 'Pago',
      WITHDRAWAL_COMPLETED: 'Retiro',
      VERIFICATION_REQUIRED: 'Verificación',
      SYSTEM_MAINTENANCE: 'Sistema',
    };
    return labels[type] || type;
  };

  const handleFilter = (status: NotificationStatus | 'ALL', type: NotificationType | 'ALL') => {
    setSelectedFilter(status);
    setSelectedType(type);
    
    fetchNotifications({
      status: status === 'ALL' ? undefined : status,
      type: type === 'ALL' ? undefined : type,
    });
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      await markAsRead(notification.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BellIcon className="h-8 w-8 mr-3 text-[#a8c241]" />
            Notificaciones
          </h1>
          <p className="text-gray-600 mt-1">
            Mantente al día con las actualizaciones de tu cuenta
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isDevelopment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => createTestNotification()}
            >
              🧪 Crear prueba
            </Button>
          )}
          
          {unreadCount > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Marcar todas leídas
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={deleteAllRead}
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Eliminar leídas
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BellIcon className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">No leídas</p>
                  <p className="text-2xl font-bold text-[#a8c241]">{stats.unread}</p>
                </div>
                <BellAlertIcon className="h-10 w-10 text-[#a8c241]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leídas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
                </div>
                <CheckIcon className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Archivadas</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                </div>
                <ArchiveBoxIcon className="h-10 w-10 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <div className="flex space-x-2">
                {['ALL', 'UNREAD', 'READ', 'ARCHIVED'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilter(status as any, selectedType)}
                  >
                    {status === 'ALL' ? 'Todas' : 
                     status === 'UNREAD' ? 'No leídas' :
                     status === 'READ' ? 'Leídas' : 'Archivadas'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tipo:</span>
              <select
                value={selectedType}
                onChange={(e) => handleFilter(selectedFilter, e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c241]"
              >
                <option value="ALL">Todos</option>
                <option value="ORDER_UPDATE">Órdenes</option>
                <option value="PAYMENT_RECEIVED">Pagos</option>
                <option value="WITHDRAWAL_COMPLETED">Retiros</option>
                <option value="VERIFICATION_REQUIRED">Verificaciones</option>
                <option value="SYSTEM_MAINTENANCE">Sistema</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {loading && notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#a8c241] border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Cargando notificaciones...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <BellIcon className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No hay notificaciones
              </h3>
              <p className="mt-2 text-gray-500">
                Cuando recibas notificaciones, aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'p-6 hover:bg-gray-50 transition-colors cursor-pointer group relative',
                    notification.status === 'UNREAD' && 'bg-blue-50/30'
                  )}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2',
                        getNotificationColor(notification.type)
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={cn(
                                'text-base text-gray-900',
                                notification.status === 'UNREAD' && 'font-semibold'
                              )}
                            >
                              {notification.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {notification.status === 'UNREAD' && (
                              <div className="h-2 w-2 rounded-full bg-[#a8c241]"></div>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              {format(new Date(notification.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", {
                                locale: es,
                              })}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {notification.status === 'UNREAD' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-blue-600 hover:bg-blue-50"
                              title="Marcar como leída"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              archive(notification.id);
                            }}
                            className="text-gray-600 hover:bg-gray-100"
                            title="Archivar"
                          >
                            <ArchiveBoxIcon className="h-5 w-5" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-red-600 hover:bg-red-50"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Metadata (si existe) */}
                      {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            <strong>Detalles:</strong>
                          </p>
                          <div className="mt-1 text-xs text-gray-700">
                            {notification.metadata.orderNumber && (
                              <p>Orden: #{notification.metadata.orderNumber}</p>
                            )}
                            {notification.metadata.amount && (
                              <p>Monto: ${notification.metadata.amount.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Cargar más notificaciones'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;