import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button, Alert, Card, CardContent, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

type VerificationStatus = 'loading' | 'success' | 'error' | 'pending';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isLoading, user } = useAuth();
  
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const token = searchParams.get('token');
  const email = location.state?.email || user?.email || '';

  // Verificar automáticamente si hay token en la URL
  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token]);

  // Countdown para reenvío
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const handleVerification = async () => {
    if (!token) return;
    
    setStatus('loading');
    setMessage('');
    
    try {
      const success = await verifyEmail(token);
      
      if (success) {
        setStatus('success');
        setMessage('¡Tu email ha sido verificado exitosamente!');
        
        // Auto-redirigir al dashboard después de 3 segundos si está autenticado
        if (user) {
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 3000);
        }
      } else {
        throw new Error('Verificación fallida');
      }
    } catch (error) {
      setStatus('error');
      setMessage('El enlace de verificación es inválido o ha expirado.');
    }
  };

  const handleResendVerification = async () => {
    if (!email || countdown > 0) return;
    
    try {
      const success = await resendVerification(email);
      if (success) {
        setMessage('Se ha enviado un nuevo email de verificación a tu bandeja de entrada.');
        setCountdown(60); // 60 segundos antes de poder reenviar de nuevo
      }
    } catch (error) {
      setMessage('Error al enviar el email. Inténtalo de nuevo.');
    }
  };

  // Estado de carga durante verificación
  if (status === 'loading') {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <LoadingSpinner size="lg" text="Verificando tu email..." />
            <p className="mt-4 text-sm text-gray-600">
              Por favor espera mientras verificamos tu cuenta
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificación exitosa
  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-success-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-success-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Email Verificado!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido verificada exitosamente. 
              Ya puedes acceder a todas las funcionalidades de la plataforma.
            </p>

            <div className="space-y-3">
              <Link to="/dashboard">
                <Button fullWidth>
                  Ir al Dashboard
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Iniciar Sesión
                </Button>
              </Link>
            </div>

            {user && (
              <p className="text-xs text-gray-500 mt-4">
                Serás redirigido automáticamente en unos segundos...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error en verificación
  if (status === 'error') {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-danger-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-danger-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error de Verificación
            </h2>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <div className="space-y-3">
              {email && (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleResendVerification}
                  loading={isLoading}
                  disabled={countdown > 0}
                  leftIcon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  {countdown > 0 
                    ? `Reenviar en ${countdown}s` 
                    : 'Reenviar Email de Verificación'
                  }
                </Button>
              )}
              
              <Link to="/register">
                <Button variant="ghost" fullWidth>
                  Crear Nueva Cuenta
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="ghost" fullWidth>
                  Volver al Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado inicial - instrucciones de verificación
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <EnvelopeIcon className="w-8 h-8 text-primary-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifica tu Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            {email ? (
              <>
                Hemos enviado un enlace de verificación a{' '}
                <span className="font-medium break-all">{email}</span>
              </>
            ) : (
              'Revisa tu email y haz clic en el enlace de verificación para activar tu cuenta'
            )}
          </p>

          {message && (
            <Alert 
              variant="success" 
              className="mb-6 text-left"
              dismissible
              onDismiss={() => setMessage('')}
            >
              {message}
            </Alert>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              ¿No encuentras el email?
            </h3>
            <ul className="text-xs text-gray-600 space-y-1 text-left">
              <li>• Revisa tu carpeta de spam o correo no deseado</li>
              <li>• Verifica que escribiste correctamente tu email</li>
              <li>• El email puede tardar unos minutos en llegar</li>
            </ul>
          </div>

          <div className="space-y-3">
            {email && (
              <Button
                variant="outline"
                fullWidth
                onClick={handleResendVerification}
                loading={isLoading}
                disabled={countdown > 0}
                leftIcon={<ArrowPathIcon className="h-4 w-4" />}
              >
                {countdown > 0 
                  ? `Reenviar en ${countdown}s` 
                  : 'Reenviar Email'
                }
              </Button>
            )}
            
            <Link to="/login">
              <Button variant="ghost" fullWidth>
                Volver al Login
              </Button>
            </Link>

            {!email && (
              <Link to="/register">
                <Button variant="ghost" fullWidth>
                  Crear Cuenta
                </Button>
              </Link>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            ¿Necesitas ayuda?{' '}
            <Link 
              to="/help" 
              className="text-primary-600 hover:text-primary-500 underline"
            >
              Contacta soporte
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};