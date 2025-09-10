// import React from 'react';
// import { useAuth } from '@/hooks/useAuth';

// export const LoginExample: React.FC = () => {
//   const { 
//     isAuthenticated, 
//     user, 
//     isLoading, 
//     error, 
//     login, 
//     logout,
//     clearError 
//   } = useAuth();

//   const handleLogin = async () => {
//     clearError();
//     await login({
//       email: 'test@example.com',
//       password: 'password123'
//     });
//   };

//   const handleLogout = async () => {
//     await logout();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-4">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="card max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">
//         {isAuthenticated ? 'Autenticado' : 'No autenticado'}
//       </h2>
      
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {isAuthenticated && user ? (
//         <div>
//           <p className="mb-2">
//             <strong>Nombre:</strong> {user.firstName} {user.lastName}
//           </p>
//           <p className="mb-2">
//             <strong>Email:</strong> {user.email}
//           </p>
//           <p className="mb-4">
//             <strong>Verificado:</strong> {user.isVerified ? 'Sí' : 'No'}
//           </p>
//           <button 
//             onClick={handleLogout}
//             className="btn-secondary w-full"
//             disabled={isLoading}
//           >
//             Cerrar Sesión
//           </button>
//         </div>
//       ) : (
//         <button 
//           onClick={handleLogin}
//           className="btn-primary w-full"
//           disabled={isLoading}
//         >
//           Iniciar Sesión (Demo)
//         </button>
//       )}
//     </div>
//   );
// };





// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

// Schema de validación
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const { login, isLoading } = useAuth();
  const [searchParams] = useSearchParams();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Manejar envío del formulario
  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(''); // Limpiar errores previos
      console.log('🚀 Submitting login form with:', { email: data.email });
      
      await login(data);
      
      // Si llegamos aquí, el login fue exitoso
      // La redirección se maneja en el hook useAuth
      
    } catch (error: any) {
      console.error('❌ Login form error:', error);
      setApiError(error.message || 'Error al iniciar sesión');
    }
  };

  // Mostrar mensaje de verificación si viene de registro
  const showVerifyMessage = searchParams.get('message') === 'verify-email';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-600">
          Accede a tu cuenta de Wiru
        </p>
      </div>

      {/* Mensaje de verificación */}
      {showVerifyMessage && (
        <Alert variant="default" className="mb-6">
          <div>
            <h4 className="font-medium">¡Registro exitoso!</h4>
            <p className="text-sm mt-1">
              Revisa tu email y haz clic en el enlace de verificación antes de iniciar sesión.
            </p>
          </div>
        </Alert>
      )}

      {/* Error de API */}
      {apiError && (
        <Alert variant="danger" className="mb-6">
          {apiError}
        </Alert>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isSubmitting || isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tu contraseña"
              {...register('password')}
              error={errors.password?.message}
              disabled={isSubmitting || isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isSubmitting || isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-[#a8c241] hover:text-[#8ea635] font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#a8c241] hover:bg-[#8ea635] text-white font-medium py-3"
          disabled={isSubmitting || isLoading}
          loading={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      {/* OAuth Buttons */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting || isLoading}
            onClick={() => console.log('Google login - TODO')}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isSubmitting || isLoading}
            onClick={() => console.log('Facebook login - TODO')}
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-[#a8c241] hover:text-[#8ea635] font-medium"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};