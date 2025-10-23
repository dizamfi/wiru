// src/components/notifications/NotificationDropdown.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification, NotificationType } from '@/services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Mostrar solo las primeras 5 notificaciones en el dropdown
  const recentNotifications = notifications.slice(0, 5);

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

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await markAllAsRead();
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className="relative p-2 text-gray-700 hover:text-[#a8c241] hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(open)}
          >
            {unreadCount > 0 ? (
              <BellAlertIcon className="h-6 w-6 text-[#a8c241] animate-pulse" />
            ) : (
              <BellIcon className="h-6 w-6" />
            )}
            
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute right-0 mt-2 w-96 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#a8c241] hover:text-[#8ea635]"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Marcar todas
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {loading && recentNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#a8c241] border-r-transparent"></div>
                    <p className="mt-2 text-sm text-gray-500">Cargando...</p>
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">
                      No tienes notificaciones
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentNotifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            onClick={() => handleNotificationClick(notification)}
                            className={cn(
                              'relative px-4 py-3 cursor-pointer transition-colors',
                              active && 'bg-gray-50',
                              notification.status === 'UNREAD' && 'bg-blue-50/30'
                            )}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Icon */}
                              <div
                                className={cn(
                                  'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl border',
                                  getNotificationColor(notification.type)
                                )}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    'text-sm font-medium text-gray-900 truncate',
                                    notification.status === 'UNREAD' && 'font-semibold'
                                  )}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: es,
                                  })}
                                </p>
                              </div>

                              {/* Unread indicator */}
                              {notification.status === 'UNREAD' && (
                                <div className="flex-shrink-0">
                                  <div className="h-2 w-2 rounded-full bg-[#a8c241]"></div>
                                </div>
                              )}
                            </div>

                            {/* Actions on hover */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-2">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 text-sm font-medium text-[#a8c241] hover:text-[#8ea635] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Ver todas las notificaciones
                </Link>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NotificationDropdown;