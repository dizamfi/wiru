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






import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

// Schema de validación
const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Enviado
              </h2>
              
              <p className="text-gray-600 mb-6">
                Hemos enviado un enlace de recuperación a{' '}
                <span className="font-medium text-[#a8c241]">{email}</span>
              </p>

              <Alert variant="default" className="mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <p><strong>¿No ves el email?</strong> Revisa:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Tu carpeta de spam o correo no deseado</li>
                    <li>Que el email esté escrito correctamente</li>
                    <li>Espera unos minutos, puede tardar en llegar</li>
                  </ul>
                </div>
              </Alert>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  Usar otro email
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Volver al login
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                El enlace de recuperación expira en 2 horas por seguridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-2 rounded-xl shadow-lg">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
              WIRU
            </span>
          </div>
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No te preocupes, te ayudamos a recuperarla
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email de tu cuenta
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#D0FF5B] hover:bg-[#D0FF5B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a8c241] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-[#a8c241] hover:text-[#719428] transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">¿Cómo funciona?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ingresa tu email y haz clic en "Enviar"</li>
                <li>Revisa tu bandeja de entrada</li>
                <li>Haz clic en el enlace del email</li>
                <li>Establece tu nueva contraseña</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};