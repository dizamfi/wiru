// src/components/profile/SecuritySettings.tsx
import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { User } from '@/types/user';
import { useProfile } from '@/hooks/useProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/useToast';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener mayúscula, minúscula y número'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface SecuritySettingsProps {
  user: User;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'profile_update' | 'device_added';
  description: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'suspicious';
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActivity: string;
  isCurrent: boolean;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ user }) => {
  const { updatePassword, verifyEmail, verifyPhone, loading } = useProfile();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema)
  });

  // Datos simulados para demo
  const recentActivity: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      description: 'Inicio de sesión exitoso',
      timestamp: '2024-08-20T10:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'Guayaquil, Ecuador',
      device: 'Chrome en Windows',
      status: 'success'
    },
    {
      id: '2',
      type: 'profile_update',
      description: 'Actualización de información personal',
      timestamp: '2024-08-19T15:45:00Z',
      ipAddress: '192.168.1.100',
      location: 'Guayaquil, Ecuador',
      device: 'Chrome en Windows',
      status: 'success'
    },
    {
      id: '3',
      type: 'login',
      description: 'Intento de inicio de sesión fallido',
      timestamp: '2024-08-18T09:15:00Z',
      ipAddress: '203.45.67.89',
      location: 'Quito, Ecuador',
      device: 'Firefox en Android',
      status: 'failed'
    }
  ];

  const activeSessions: ActiveSession[] = [
    {
      id: '1',
      device: 'Windows PC',
      browser: 'Chrome 116',
      ipAddress: '192.168.1.100',
      location: 'Guayaquil, Ecuador',
      lastActivity: '2024-08-20T10:30:00Z',
      isCurrent: true
    },
    {
      id: '2',
      device: 'iPhone',
      browser: 'Safari Mobile',
      ipAddress: '192.168.1.105',
      location: 'Guayaquil, Ecuador',
      lastActivity: '2024-08-19T20:15:00Z',
      isCurrent: false
    }
  ];

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      reset();
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al cambiar contraseña',
        variant: 'destructive'
      });
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail();
      toast({
        title: 'Email de verificación enviado',
        description: 'Revisa tu bandeja de entrada',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el email de verificación',
        variant: 'destructive'
      });
    }
  };

  const handleVerifyPhone = async () => {
    if (!user.phone) {
      toast({
        title: 'Teléfono no configurado',
        description: 'Agrega un número de teléfono en tu perfil primero',
        variant: 'warning'
      });
      return;
    }

    try {
      await verifyPhone(user.phone);
      toast({
        title: 'SMS de verificación enviado',
        description: 'Revisa tus mensajes',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el SMS de verificación',
        variant: 'destructive'
      });
    }
  };

  const terminateSession = (sessionId: string) => {
    toast({
      title: 'Sesión terminada',
      description: 'La sesión ha sido cerrada exitosamente',
      variant: 'success'
    });
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'login':
        return <ComputerDesktopIcon className="h-5 w-5" />;
      case 'password_change':
        return <KeyIcon className="h-5 w-5" />;
      case 'profile_update':
        return <ShieldCheckIcon className="h-5 w-5" />;
      case 'device_added':
        return <DevicePhoneMobileIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: SecurityEvent['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Exitoso</Badge>;
      case 'failed':
        return <Badge variant="danger">Fallido</Badge>;
      case 'suspicious':
        return <Badge variant="warning">Sospechoso</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cambiar Contraseña */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <KeyIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h3>
              <p className="text-sm text-gray-600">Actualiza tu contraseña regularmente para mayor seguridad</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="Contraseña Actual"
                type={showCurrentPassword ? 'text' : 'password'}
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Nueva Contraseña"
                type={showNewPassword ? 'text' : 'password'}
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmar Nueva Contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Requisitos de contraseña</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Mínimo 8 caracteres</li>
                <li>• Al menos una letra mayúscula</li>
                <li>• Al menos una letra minúscula</li>
                <li>• Al menos un número</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={!isValid || loading}
              loading={loading}
              className="w-full"
            >
              Cambiar Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Verificación de Cuenta */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Verificación de Cuenta</h3>
              <p className="text-sm text-gray-600">Verifica tu email y teléfono para mayor seguridad</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {user.emailVerified ? (
                  <Badge variant="success">Verificado</Badge>
                ) : (
                  <>
                    <Badge variant="warning">Pendiente</Badge>
                    <Button size="sm" onClick={handleVerifyEmail} loading={loading}>
                      Verificar
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Teléfono</p>
                  <p className="text-sm text-gray-600">
                    {user.phone || 'No configurado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {user.phone ? (
                  <>
                    <Badge variant="warning">No verificado</Badge>
                    <Button size="sm" onClick={handleVerifyPhone} loading={loading}>
                      Verificar
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary">No configurado</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Autenticación de Dos Factores */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Autenticación de Dos Factores</h3>
                <p className="text-sm text-gray-600">Agrega una capa extra de seguridad a tu cuenta</p>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
            />
          </div>

          {!twoFactorEnabled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-900">Recomendado</h5>
                  <p className="text-sm text-yellow-700">
                    Habilita la autenticación de dos factores para proteger mejor tu cuenta contra accesos no autorizados.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuraciones de Notificaciones de Seguridad */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones de Seguridad</h3>
              <p className="text-sm text-gray-600">Configura cuándo recibir alertas de seguridad</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Inicios de Sesión</p>
                <p className="text-sm text-gray-600">Notificarme sobre nuevos inicios de sesión</p>
              </div>
              <Switch
                checked={loginNotifications}
                onChange={setLoginNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sesiones Activas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ComputerDesktopIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sesiones Activas</h3>
              <p className="text-sm text-gray-600">Dispositivos donde tienes sesión iniciada</p>
            </div>
          </div>

          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{session.device}</p>
                      {session.isCurrent && <Badge variant="success">Actual</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{session.browser}</p>
                    <p className="text-xs text-gray-500">
                      {session.location} • {session.ipAddress}
                    </p>
                    <p className="text-xs text-gray-500">
                      Última actividad: {new Date(session.lastActivity).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                  >
                    Terminar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              <p className="text-sm text-gray-600">Eventos de seguridad de los últimos 30 días</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    event.status === 'success' ? 'bg-green-100' :
                    event.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.description}</p>
                    <p className="text-sm text-gray-600">{event.device}</p>
                    <p className="text-xs text-gray-500">
                      {event.location} • {event.ipAddress} • {new Date(event.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                {getStatusBadge(event.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};