// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
// import { 
//   CheckCircleIcon, 
//   ExclamationTriangleIcon,
//   EnvelopeIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/outline';
// import { Button, Alert, Card, CardContent, LoadingSpinner } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';

// type VerificationStatus = 'loading' | 'success' | 'error' | 'pending';

// export const VerifyEmailPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { verifyEmail, resendVerification, isLoading, user } = useAuth();
  
//   const [status, setStatus] = useState<VerificationStatus>('pending');
//   const [message, setMessage] = useState('');
//   const [countdown, setCountdown] = useState(0);
  
//   const token = searchParams.get('token');
//   const email = location.state?.email || user?.email || '';

//   // Verificar automáticamente si hay token en la URL
//   useEffect(() => {
//     if (token) {
//       handleVerification();
//     }
//   }, [token]);

//   // Countdown para reenvío
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (countdown > 0) {
//       interval = setInterval(() => {
//         setCountdown(countdown - 1);
//       }, 1000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [countdown]);

//   const handleVerification = async () => {
//     if (!token) return;
    
//     setStatus('loading');
//     setMessage('');
    
//     try {
//       const success = await verifyEmail(token);
      
//       if (success) {
//         setStatus('success');
//         setMessage('¡Tu email ha sido verificado exitosamente!');
        
//         // Auto-redirigir al dashboard después de 3 segundos si está autenticado
//         if (user) {
//           setTimeout(() => {
//             navigate('/dashboard', { replace: true });
//           }, 3000);
//         }
//       } else {
//         throw new Error('Verificación fallida');
//       }
//     } catch (error) {
//       setStatus('error');
//       setMessage('El enlace de verificación es inválido o ha expirado.');
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!email || countdown > 0) return;
    
//     try {
//       const success = await resendVerification(email);
//       if (success) {
//         setMessage('Se ha enviado un nuevo email de verificación a tu bandeja de entrada.');
//         setCountdown(60); // 60 segundos antes de poder reenviar de nuevo
//       }
//     } catch (error) {
//       setMessage('Error al enviar el email. Inténtalo de nuevo.');
//     }
//   };

//   // Estado de carga durante verificación
//   if (status === 'loading') {
//     return (
//       <div className="w-full max-w-md mx-auto">
//         <Card>
//           <CardContent className="p-8 text-center">
//             <LoadingSpinner size="lg" text="Verificando tu email..." />
//             <p className="mt-4 text-sm text-gray-600">
//               Por favor espera mientras verificamos tu cuenta
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Verificación exitosa
//   if (status === 'success') {
//     return (
//       <div className="w-full max-w-md mx-auto">
//         <Card>
//           <CardContent className="p-8 text-center">
//             <div className="w-16 h-16 mx-auto mb-4 bg-success-100 rounded-full flex items-center justify-center">
//               <CheckCircleIcon className="w-8 h-8 text-success-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               ¡Email Verificado!
//             </h2>
            
//             <p className="text-gray-600 mb-6">
//               Tu cuenta ha sido verificada exitosamente. 
//               Ya puedes acceder a todas las funcionalidades de la plataforma.
//             </p>

//             <div className="space-y-3">
//               <Link to="/dashboard">
//                 <Button>
//                   Ir al Dashboard
//                 </Button>
//               </Link>
              
//               <Link to="/login">
//                 <Button variant="outline">
//                   Iniciar Sesión
//                 </Button>
//               </Link>
//             </div>

//             {user && (
//               <p className="text-xs text-gray-500 mt-4">
//                 Serás redirigido automáticamente en unos segundos...
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Error en verificación
//   if (status === 'error') {
//     return (
//       <div className="w-full max-w-md mx-auto">
//         <Card>
//           <CardContent className="p-8 text-center">
//             <div className="w-16 h-16 mx-auto mb-4 bg-danger-100 rounded-full flex items-center justify-center">
//               <ExclamationTriangleIcon className="w-8 h-8 text-danger-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Error de Verificación
//             </h2>
            
//             <p className="text-gray-600 mb-6">
//               {message}
//             </p>

//             <div className="space-y-3">
//               {email && (
//                 <Button
//                   variant="outline"
//                   onClick={handleResendVerification}
//                   loading={isLoading}
//                   disabled={countdown > 0}
//                 >
//                   {countdown > 0 
//                     ? `Reenviar en ${countdown}s` 
//                     : 'Reenviar Email de Verificación'
//                   }
//                 </Button>
//               )}
              
//               <Link to="/register">
//                 <Button variant="ghost">
//                   Crear Nueva Cuenta
//                 </Button>
//               </Link>
              
//               <Link to="/login">
//                 <Button variant="ghost">
//                   Volver al Login
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Estado inicial - instrucciones de verificación
//   return (
//     <div className="w-full max-w-md mx-auto">
//       <Card>
//         <CardContent className="p-8 text-center">
//           <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
//             <EnvelopeIcon className="w-8 h-8 text-primary-600" />
//           </div>
          
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Verifica tu Email
//           </h2>
          
//           <p className="text-gray-600 mb-6">
//             {email ? (
//               <>
//                 Hemos enviado un enlace de verificación a{' '}
//                 <span className="font-medium break-all">{email}</span>
//               </>
//             ) : (
//               'Revisa tu email y haz clic en el enlace de verificación para activar tu cuenta'
//             )}
//           </p>

//           {message && (
//             <Alert 
//               variant="success" 
//               className="mb-6 text-left"
//               dismissible
//               onDismiss={() => setMessage('')}
//             >
//               {message}
//             </Alert>
//           )}

//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-2">
//               ¿No encuentras el email?
//             </h3>
//             <ul className="text-xs text-gray-600 space-y-1 text-left">
//               <li>• Revisa tu carpeta de spam o correo no deseado</li>
//               <li>• Verifica que escribiste correctamente tu email</li>
//               <li>• El email puede tardar unos minutos en llegar</li>
//             </ul>
//           </div>

//           <div className="space-y-3">
//             {email && (
//               <Button
//                 variant="outline"
//                 onClick={handleResendVerification}
//                 loading={isLoading}
//                 disabled={countdown > 0}
//               >
//                 {countdown > 0 
//                   ? `Reenviar en ${countdown}s` 
//                   : 'Reenviar Email'
//                 }
//               </Button>
//             )}
            
//             <Link to="/login">
//               <Button variant="ghost">
//                 Volver al Login
//               </Button>
//             </Link>

//             {!email && (
//               <Link to="/register">
//                 <Button variant="ghost">
//                   Crear Cuenta
//                 </Button>
//               </Link>
//             )}
//           </div>

//           <p className="text-xs text-gray-500 mt-6">
//             ¿Necesitas ayuda?{' '}
//             <Link 
//               to="/help" 
//               className="text-primary-600 hover:text-primary-500 underline"
//             >
//               Contacta soporte
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };






// src/pages/auth/VerifyEmailPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { AuthService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

type VerificationState = 'verifying' | 'success' | 'error' | 'expired' | 'invalid';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerificationState>('verifying');
  const [message, setMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Obtener token de la URL
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setState('invalid');
        setMessage('Token de verificación no encontrado en la URL');
        return;
      }

      try {
        console.log('🔍 Verificando email con token:', token);
        
        const result = await AuthService.verifyEmail(token);
        
        if (result.success) {
          setState('success');
          setMessage(result.message || '¡Email verificado exitosamente!');
          console.log('✅ Email verificado exitosamente');
        } else {
          setState('error');
          setMessage(result.message || 'Error al verificar el email');
        }
      } catch (error: any) {
        console.error('❌ Error verificando email:', error);
        
        // Manejar diferentes tipos de errores
        if (error.message.includes('expirado') || error.message.includes('expired')) {
          setState('expired');
          setMessage('El enlace de verificación ha expirado');
        } else if (error.message.includes('inválido') || error.message.includes('invalid')) {
          setState('invalid');
          setMessage('El enlace de verificación es inválido');
        } else {
          setState('error');
          setMessage(error.message || 'Error al verificar el email');
        }
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerification = async () => {
    if (!userEmail) {
      setUserEmail(prompt('Ingresa tu email para reenviar la verificación:') || '');
      return;
    }

    try {
      await AuthService.resendVerification(userEmail);
      setMessage('Se ha enviado un nuevo enlace de verificación a tu email');
    } catch (error: any) {
      setMessage(error.message || 'Error al reenviar la verificación');
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verificando email...
            </h1>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu dirección de email.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Email verificado exitosamente!
            </h1>
            <p className="text-gray-600 mb-8">
              {message}
            </p>
            
            <Alert variant="success" className="mb-6">
              <div>
                <h4 className="font-medium">¡Bienvenido a Wiru!</h4>
                <p className="text-sm mt-1">
                  Tu cuenta ha sido verificada. Ahora puedes iniciar sesión y comenzar a vender tus dispositivos electrónicos.
                </p>
              </div>
            </Alert>

            <div className="space-y-4">
              <Link to="/auth/login" className="block">
                <Button className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
              <XCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enlace expirado
            </h1>
            <p className="text-gray-600 mb-8">
              {message}
            </p>

            <Alert variant="warning" className="mb-6">
              <div>
                <h4 className="font-medium">Enlace de verificación expirado</h4>
                <p className="text-sm mt-1">
                  Los enlaces de verificación expiran por seguridad. Puedes solicitar uno nuevo.
                </p>
              </div>
            </Alert>

            <div className="space-y-4">
              <Button 
                onClick={handleResendVerification}
                className="w-full"
              >
                Reenviar enlace de verificación
              </Button>
              <Link to="/auth/login" className="block">
                <Button variant="outline" className="w-full">
                  Ir al Login
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enlace inválido
            </h1>
            <p className="text-gray-600 mb-8">
              {message}
            </p>

            <Alert variant="danger" className="mb-6">
              <div>
                <h4 className="font-medium">Enlace de verificación inválido</h4>
                <p className="text-sm mt-1">
                  Este enlace no es válido o ya ha sido utilizado. Verifica la URL o solicita un nuevo enlace.
                </p>
              </div>
            </Alert>

            <div className="space-y-4">
              <Button 
                onClick={handleResendVerification}
                className="w-full"
              >
                Reenviar enlace de verificación
              </Button>
              <Link to="/auth/register" className="block">
                <Button variant="outline" className="w-full">
                  Crear nueva cuenta
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error de verificación
            </h1>
            <p className="text-gray-600 mb-8">
              {message}
            </p>

            <Alert variant="danger" className="mb-6">
              <div>
                <h4 className="font-medium">Error al verificar email</h4>
                <p className="text-sm mt-1">
                  Ha ocurrido un error inesperado. Inténtalo nuevamente o contacta soporte.
                </p>
              </div>
            </Alert>

            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Intentar nuevamente
              </Button>
              <Link to="/contact" className="block">
                <Button variant="outline" className="w-full">
                  Contactar Soporte
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="ghost" className="w-full">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {renderContent()}
      
      {/* Debug info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <p><strong>Debug Info:</strong></p>
          <p>Token: {token || 'No token found'}</p>
          <p>State: {state}</p>
          <p>Message: {message}</p>
        </div>
      )}
    </div>
  );
};