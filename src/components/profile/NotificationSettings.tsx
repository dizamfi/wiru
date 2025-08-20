// src/components/profile/NotificationSettings.tsx
import React, { useState } from 'react';
import { 
  BellIcon, 
  EnvelopeIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, isPersonProfile } from '@/types/user';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/useToast';

interface NotificationSettingsProps {
  user: User;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  notifications: NotificationItem[];
}

interface NotificationItem {
  id: string;
  name: string;
  description: string;
  channels: ('email' | 'sms' | 'push')[];
  defaultEnabled: boolean;
  required?: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ user }) => {
  const { updateProfile, loading } = useProfile();
  const [settings, setSettings] = useState({
    // Email notifications
    orderUpdates: true,
    paymentConfirmations: true,
    referralUpdates: true,
    promotions: false,
    systemAlerts: true,
    weeklyReports: true,
    
    // SMS notifications
    smsOrderUpdates: false,
    smsPaymentConfirmations: true,
    smsSecurityAlerts: true,
    
    // Push notifications
    pushOrderUpdates: true,
    pushPaymentConfirmations: true,
    pushReferralUpdates: true,
    pushPromotions: false
  });

  const isPerson = isPersonProfile(user);

  const notificationCategories: NotificationCategory[] = [
    {
      id: 'orders',
      name: 'Órdenes y Ventas',
      description: 'Actualizaciones sobre tus órdenes y procesos de venta',
      icon: ChartBarIcon,
      notifications: [
        {
          id: 'orderUpdates',
          name: 'Actualizaciones de Órdenes',
          description: 'Cambios de estado, recolección, verificación',
          channels: ['email', 'sms', 'push'],
          defaultEnabled: true,
          required: true
        },
        {
          id: 'pickupReminders',
          name: 'Recordatorios de Recolección',
          description: 'Notificaciones antes de la recolección programada',
          channels: ['email', 'sms', 'push'],
          defaultEnabled: true
        },
        {
          id: 'verificationComplete',
          name: 'Verificación Completada',
          description: 'Cuando se complete la verificación de tus dispositivos',
          channels: ['email', 'push'],
          defaultEnabled: true
        }
      ]
    },
    {
      id: 'payments',
      name: 'Pagos y Finanzas',
      description: 'Confirmaciones de pagos y transacciones financieras',
      icon: BellIcon,
      notifications: [
        {
          id: 'paymentConfirmations',
          name: 'Confirmaciones de Pago',
          description: 'Cuando recibas pagos en tu billetera',
          channels: ['email', 'sms', 'push'],
          defaultEnabled: true,
          required: true
        },
        {
          id: 'withdrawalUpdates',
          name: 'Actualizaciones de Retiros',
          description: 'Estado de tus solicitudes de retiro',
          channels: ['email', 'push'],
          defaultEnabled: true
        },
        {
          id: 'lowBalance',
          name: 'Balance Bajo',
          description: 'Cuando tu balance sea menor a $10',
          channels: ['email', 'push'],
          defaultEnabled: false
        }
      ]
    }
  ];

  // Agregar categoría de referidos solo para personas
  if (isPerson) {
    notificationCategories.push({
      id: 'referrals',
      name: 'Referidos y Recompensas',
      description: 'Actividad de tu programa de referidos y puntos',
      icon: MegaphoneIcon,
      notifications: [
        {
          id: 'referralUpdates',
          name: 'Nuevos Referidos',
          description: 'Cuando alguien se registre con tu código',
          channels: ['email', 'push'],
          defaultEnabled: true
        },
        {
          id: 'referralEarnings',
          name: 'Ganancias por Referidos',
          description: 'Cuando recibas comisiones por referidos',
          channels: ['email', 'push'],
          defaultEnabled: true
        },
        {
          id: 'pointsEarned',
          name: 'Puntos Ganados',
          description: 'Cuando ganes puntos de recompensa',
          channels: ['push'],
          defaultEnabled: false
        },
        {
          id: 'rewardsAvailable',
          name: 'Recompensas Disponibles',
          description: 'Nuevas recompensas para canjear',
          channels: ['email', 'push'],
          defaultEnabled: true
        }
      ]
    });
  }

  // Agregar categorías comunes
  notificationCategories.push(
    {
      id: 'security',
      name: 'Seguridad',
      description: 'Alertas de seguridad y acceso a tu cuenta',
      icon: ShieldCheckIcon,
      notifications: [
        {
          id: 'securityAlerts',
          name: 'Alertas de Seguridad',
          description: 'Inicios de sesión y cambios importantes',
          channels: ['email', 'sms'],
          defaultEnabled: true,
          required: true
        },
        {
          id: 'passwordChanges',
          name: 'Cambios de Contraseña',
          description: 'Cuando se cambie tu contraseña',
          channels: ['email', 'sms'],
          defaultEnabled: true,
          required: true
        },
        {
          id: 'profileChanges',
          name: 'Cambios de Perfil',
          description: 'Modificaciones en tu información personal',
          channels: ['email'],
          defaultEnabled: true
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing y Promociones',
      description: 'Ofertas especiales, noticias y actualizaciones del producto',
      icon: MegaphoneIcon,
      notifications: [
        {
          id: 'promotions',
          name: 'Ofertas Especiales',
          description: 'Promociones exclusivas y descuentos',
          channels: ['email', 'push'],
          defaultEnabled: false
        },
        {
          id: 'productUpdates',
          name: 'Actualizaciones del Producto',
          description: 'Nuevas características y mejoras',
          channels: ['email'],
          defaultEnabled: false
        },
        {
          id: 'weeklyReports',
          name: 'Reportes Semanales',
          description: 'Resumen semanal de tu actividad',
          channels: ['email'],
          defaultEnabled: true
        },
        {
          id: 'surveys',
          name: 'Encuestas y Feedback',
          description: 'Invitaciones a compartir tu opinión',
          channels: ['email'],
          defaultEnabled: false
        }
      ]
    }
  );

  const handleSettingChange = (settingId: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await updateProfile({
        preferences: {
          ...(user && (user as any).preferences ? (user as any).preferences : {}),
          notifications: {
            email: settings.orderUpdates,
            sms: settings.smsOrderUpdates,
            push: settings.pushOrderUpdates,
            marketing: settings.promotions
          }
        }
      });
      
      toast({
        title: 'Configuración guardada',
        description: 'Tus preferencias de notificaciones han sido actualizadas',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las configuraciones',
        variant: 'destructive'
      });
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <EnvelopeIcon className="h-4 w-4" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'push':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      default:
        return <BellIcon className="h-4 w-4" />;
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'email':
        return 'Email';
      case 'sms':
        return 'SMS';
      case 'push':
        return 'Push';
      default:
        return channel;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>
              <p className="text-sm text-gray-600">
                Controla cómo y cuándo recibes notificaciones
              </p>
            </div>
            <Button onClick={handleSaveSettings} loading={loading}>
              Guardar Cambios
            </Button>
          </div>

          {/* Channels Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <EnvelopeIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">Email</h4>
              <p className="text-sm text-blue-700">{user.email}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <DevicePhoneMobileIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-900">SMS</h4>
              <p className="text-sm text-green-700">
                {isPerson && user.phone ? user.phone : 'No configurado'}
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <ComputerDesktopIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-900">Push</h4>
              <p className="text-sm text-purple-700">Navegador web</p>
            </div>
          </div>

          {/* Notification Categories */}
          <div className="space-y-6">
            {notificationCategories.map((category) => {
              const IconComponent = category.icon;
              
              return (
                <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.notifications.map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-gray-900">{notification.name}</h5>
                            {notification.required && (
                              <Badge variant="secondary" className="text-xs">Requerido</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
                          <div className="flex items-center space-x-3">
                            {notification.channels.map((channel) => (
                              <div key={channel} className="flex items-center space-x-1 text-xs text-gray-500">
                                {getChannelIcon(channel)}
                                <span>{getChannelLabel(channel)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Switch
                            checked={settings[notification.id as keyof typeof settings] || false}
                            onChange={(checked) => handleSettingChange(notification.id, checked)}
                            disabled={notification.required}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Settings */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Configuraciones Adicionales</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Resumen Diario</p>
                  <p className="text-sm text-gray-600">Recibir un resumen diario de actividad</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onChange={(checked) => handleSettingChange('weeklyReports', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Modo No Molestar</p>
                  <p className="text-sm text-gray-600">Pausar notificaciones no críticas (22:00 - 08:00)</p>
                </div>
                <Switch
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2">Información Importante</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Las notificaciones de seguridad no se pueden desactivar</li>
              <li>• Los cambios pueden tardar hasta 5 minutos en aplicarse</li>
              <li>• Para SMS necesitas verificar tu número de teléfono</li>
              <li>• Las notificaciones push requieren permisos del navegador</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};