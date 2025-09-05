// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// import { Button, Input, Alert, Card, CardContent } from '@/components/ui';
// import { useForgotPasswordForm } from '@/hooks/useAuthForm';

// export const ForgotPasswordPage: React.FC = () => {
//   const [emailSent, setEmailSent] = useState(false);
//   const { form, onSubmit, isLoading, error, clearError } = useForgotPasswordForm();

//   const {
//     register,
//     formState: { errors },
//     watch,
//   } = form;

//   const email = watch('email');

//   const handleSubmit = async (data: any) => {
//     await onSubmit(data);
//     if (!error) {
//       setEmailSent(true);
//     }
//   };

//   if (emailSent) {
//     return (
//       <div className="w-full max-w-md mx-auto">
//         <Card>
//           <CardContent className="p-8 text-center">
//             <div className="w-16 h-16 mx-auto mb-4 bg-success-100 rounded-full flex items-center justify-center">
//               <CheckCircleIcon className="w-8 h-8 text-success-600" />
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Email Enviado
//             </h2>
            
//             <p className="text-gray-600 mb-6">
//               Hemos enviado un enlace de recuperación a{' '}
//               <span className="font-medium">{email}</span>
//             </p>

//             <div className="space-y-4">
//               <Button
//                 variant="outline"
//                 fullWidth
//                 onClick={() => setEmailSent(false)}
//               >
//                 Enviar a otro email
//               </Button>
              
//               <Link to="/login">
//                 <Button variant="ghost" fullWidth>
//                   Volver al login
//                 </Button>
//               </Link>
//             </div>

//             <p className="text-xs text-gray-500 mt-6">
//               ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
//               <button 
//                 onClick={() => setEmailSent(false)}
//                 className="text-primary-600 hover:text-primary-500 underline"
//               >
//                 intenta de nuevo
//               </button>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <Card>
//         <CardContent className="p-8">
//           {/* Back Button */}
//           <Link 
//             to="/login"
//             className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
//           >
//             <ArrowLeftIcon className="w-4 h-4 mr-1" />
//             Volver al login
//           </Link>

//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900">
//               Recuperar Contraseña
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Ingresa tu email para recibir un enlace de recuperación
//             </p>
//           </div>

//           {/* Error Alert */}
//           {error && (
//             <Alert 
//               variant="danger" 
//               className="mb-6"
//               dismissible
//               onDismiss={clearError}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Form */}
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <Input
//               {...register('email')}
//               type="email"
//               label="Email"
//               placeholder="tu@email.com"
//               error={errors.email?.message}
//               leftIcon={<EnvelopeIcon className="h-4 w-4" />}
//               autoComplete="email"
//               autoFocus
//               required
//             />

//             <Button
//               type="submit"
//               fullWidth
//               loading={isLoading}
//               disabled={isLoading}
//             >
//               Enviar Enlace de Recuperación
//             </Button>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               ¿Recordaste tu contraseña?{' '}
//               <Link
//                 to="/login"
//                 className="font-medium text-primary-600 hover:text-primary-500"
//               >
//                 Inicia sesión
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };






// src/pages/auth/ForgotPasswordPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForgotPasswordForm, ForgotPasswordFormData } from '@/hooks/useAuthForm';

// Esquema de validación
const forgotPasswordSchema = z.object({
  email: z.string().email('Ingresa un email válido').min(1, 'El email es requerido'),
});

export const ForgotPasswordPage: React.FC = () => {
  const { onSubmit, isLoading, error, success, clearError, clearSuccess } = useForgotPasswordForm();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    clearError();
    clearSuccess();
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
          <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              No te preocupes, te ayudamos a recuperarla
            </p>
          </div>

          {/* Mensaje de éxito */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={clearSuccess}
                    className="text-green-400 hover:text-green-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {!success ? (
            <>
              {/* Instrucciones */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      ¿Cómo funciona?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Ingresa tu dirección de email</li>
                        <li>Te enviaremos un enlace seguro</li>
                        <li>Haz clic en el enlace del email</li>
                        <li>Crea tu nueva contraseña</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <Input
                  label="Dirección de Email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Enviando enlace...' : 'Enviar enlace de restablecimiento'}
                </Button>
              </form>
            </>
          ) : (
            /* Estado de éxito - mostrar acciones adicionales */
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 text-green-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Email enviado!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Revisa tu bandeja de entrada y carpeta de spam.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Enviar otro enlace
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Volver al login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Enlaces de navegación */}
          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Volver al inicio de sesión
            </Link>
          </div>

          {/* Ayuda adicional */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ¿Tienes problemas para recuperar tu cuenta?{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-500">
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};