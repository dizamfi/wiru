// // src/pages/auth/LoginPage.tsx - LOGIN COMPLETO
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'react-hot-toast';

// // Validaciones
// import { loginSchema, LoginFormData } from '@/utils/validations';

// // Componentes UI
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';

// // Servicios
// import { AuthService } from '@/services/authService';

// // Hooks
// import { useAuth } from '@/hooks/useAuth';

// // Iconos
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// export const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated } = useAuth();

//   // Estados
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Mensajes desde navegación
//   const registrationMessage = location.state?.message;
//   const registrationEmail = location.state?.email;
//   const redirectTo = location.state?.from || '/dashboard';

//   // ✅ REDIRIGIR SI YA ESTÁ AUTENTICADO
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(redirectTo, { replace: true });
//     }
//   }, [isAuthenticated, navigate, redirectTo]);

//   // ✅ CONFIGURAR FORMULARIO
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: registrationEmail || '',
//       password: ''
//     }
//   });

//   // ✅ MANEJAR ENVÍO DEL FORMULARIO
//   const onSubmit = async (data: LoginFormData) => {
//     setIsLoading(true);

//     try {
//       console.log('🚀 Attempting login for:', data.email);

//       const result = await AuthService.login({
//         email: data.email,
//         password: data.password
//       });

//       if (result.success) {
//         // ✅ GUARDAR DATOS EN LOCALSTORAGE
//         localStorage.setItem('accessToken', result.data.accessToken);
//         localStorage.setItem('refreshToken', result.data.refreshToken);
//         localStorage.setItem('user', JSON.stringify(result.data.user));

//         // ✅ MENSAJE DE ÉXITO
//         toast.success(result.message || 'Inicio de sesión exitoso');

//         // // ✅ ALERTA SI NECESITA VERIFICAR EMAIL
//         // if (result.data.user.needsEmailVerification) {
//         //   setTimeout(() => {
//         //     toast('Recuerda verificar tu email para acceder a todas las funciones', {
//         //       icon: '📧',
//         //       duration: 5000
//         //     });
//         //   }, 1000);
//         // }

//         // ✅ REDIRIGIR
//         navigate(redirectTo, { replace: true });

//       } else {
//         toast.error(result.message || 'Error al iniciar sesión');
//       }

//     } catch (error: any) {
//       console.error('❌ Login error:', error);
      
//       // ✅ MANEJAR ERRORES ESPECÍFICOS
//       if (error.message.includes('Credenciales inválidas')) {
//         toast.error('Email o contraseña incorrectos');
//       } else if (error.message.includes('suspendida')) {
//         toast.error('Tu cuenta ha sido suspendida. Contacta al soporte.');
//       } else if (error.message.includes('inactiva')) {
//         toast.error('Tu cuenta está inactiva. Contacta al soporte.');
//       } else {
//         toast.error(error.message || 'Error al iniciar sesión');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ PRE-LLENAR EMAIL SI VIENE DE REGISTRO
//   useEffect(() => {
//     if (registrationEmail) {
//       setValue('email', registrationEmail);
//     }
//   }, [registrationEmail, setValue]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
        
//         {/* ✅ HEADER */}
//         <div className="text-center">
//           <Link to="/" className="flex items-center justify-center mb-6">
//             <div className="text-3xl font-black text-[#a8c241]">WIRU</div>
//           </Link>
          
//           <h2 className="text-3xl font-bold text-gray-900">
//             Iniciar Sesión
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Accede a tu cuenta para continuar
//           </p>
//         </div>

//         {/* ✅ MENSAJE DE REGISTRO EXITOSO */}
//         {registrationMessage && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-green-700">
//                   {registrationMessage}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ✅ FORMULARIO DE LOGIN */}
//         <div className="bg-white rounded-lg shadow-md p-8">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
//             {/* Email */}
//             <div>
//               <Input
//                 label="Email"
//                 type="email"
//                 error={errors.email?.message}
//                 {...register('email')}
//                 placeholder="tu@email.com"
//                 autoComplete="email"
//               />
//             </div>

//             {/* Contraseña */}
//             <div className="relative">
//               <Input
//                 label="Contraseña"
//                 type={showPassword ? 'text' : 'password'}
//                 error={errors.password?.message}
//                 {...register('password')}
//                 placeholder="••••••••"
//                 autoComplete="current-password"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeSlashIcon className="h-5 w-5" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5" />
//                 )}
//               </button>
//             </div>

//             {/* Recordar / Olvidé contraseña */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-[#a8c241] focus:ring-[#a8c241] border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Recordarme
//                 </label>
//               </div>

//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-[#a8c241] hover:text-[#8ea635] font-medium"
//               >
//                 ¿Olvidaste tu contraseña?
//               </Link>
//             </div>

//             {/* Botón de envío */}
//             <Button
//               type="submit"
//               className="w-full bg-[#a8c241] hover:bg-[#8ea635] text-white"
//               loading={isLoading}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
//             </Button>
//           </form>

//           {/* ✅ OAUTH BUTTONS (Future implementation) */}
//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">O continúa con</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                 disabled
//               >
//                 <svg className="h-5 w-5" viewBox="0 0 24 24">
//                   <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span className="ml-2">Google</span>
//               </button>

//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                 disabled
//               >
//                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//                 <span className="ml-2">Facebook</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ✅ FOOTER */}
//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             ¿No tienes una cuenta?{' '}
//             <Link to="/register" className="font-medium text-[#a8c241] hover:text-[#8ea635]">
//               Regístrate gratis
//             </Link>
//           </p>
//         </div>

//         {/* ✅ SECURITY BADGE */}
//         <div className="text-center">
//           <p className="text-xs text-gray-500 flex items-center justify-center">
//             <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//             </svg>
//             Tu información está protegida con encriptación SSL
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };





// // src/pages/auth/LoginPage.tsx
// import React from 'react';
// import { LoginForm } from '@/components/auth/LoginForm';

// export const LoginPage: React.FC = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <LoginForm />
//     </div>
//   );
// };



// Actualizar src/pages/auth/LoginPage.tsx para incluir Google Sign-In

// import React, { useState } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/Button';
// import { Alert } from '@/components/ui/Alert';
// import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
// import { FacebookSignInButton } from '@/components/auth/FacebookSignInButton';
// import { useAuth } from '@/hooks/useAuth';
// import { env } from '@/utils/env';
// import toast from 'react-hot-toast';

// // Schema de validación
// const loginSchema = z.object({
//   email: z.string().email('Email inválido'),
//   password: z.string().min(1, 'Contraseña requerida'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export const LoginPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, loginWithGoogle, isLoading } = useAuth();

//   // Mensajes basados en parámetros de URL
//   const verified = searchParams.get('verified');
//   const message = searchParams.get('message');

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       await login({ email: data.email, password: data.password });
//     } catch (error) {
//       // El error ya se maneja en el hook useAuth
//     }
//   };

//   const handleGoogleSuccess = async (credential: string) => {
//     try {
//       await loginWithGoogle(credential);
//     } catch (error) {
//       // El error ya se maneja en el hook useAuth
//     }
//   };

//   const handleGoogleError = (error: string) => {
//     console.error('Google Sign-In error:', error);
//     toast.error(error);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         {/* Logo */}
//         <Link to="/" className="flex justify-center mb-8">
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-xl blur-lg opacity-30"></div>
//               <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-2 rounded-xl shadow-lg">
//                 <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                 </svg>
//               </div>
//             </div>
//             <span className="text-xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
//               WIRU
//             </span>
//           </div>
//         </Link>

//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Iniciar Sesión
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           ¿No tienes cuenta?{' '}
//           <Link
//             to="/register"
//             className="font-medium text-[#a8c241] hover:text-[#719428] transition-colors"
//           >
//             Regístrate aquí
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {/* Alertas */}
//           {verified === 'true' && (
//             <Alert variant="success" className="mb-6">
//               ¡Email verificado exitosamente! Ahora puedes iniciar sesión.
//             </Alert>
//           )}

//           {message === 'verify-email' && (
//             <Alert variant="default" className="mb-6">
//               Por favor verifica tu email antes de iniciar sesión.
//             </Alert>
//           )}

//           {/* Google Sign-In */}
//           {env.ENABLE_OAUTH && env.GOOGLE_CLIENT_ID && (
//             <div className="mb-6">
//               <GoogleSignInButton
//                 onSuccess={handleGoogleSuccess}
//                 onError={handleGoogleError}
//                 disabled={isLoading}
//                 text="Iniciar sesión con Google"
//               />
              
//               <div className="mt-6 relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">O continúa con</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Formulario de login */}
//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <div className="mt-1">
//                 <input
//                   {...register('email')}
//                   type="email"
//                   autoComplete="email"
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
//                   placeholder="tu@email.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                 )}
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Contraseña
//               </label>
//               <div className="mt-1 relative">
//                 <input
//                   {...register('password')}
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
//                   placeholder="Tu contraseña"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//               )}
//             </div>

//             {/* Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="text-sm">
//                 <Link
//                   to="/forgot-password"
//                   className="font-medium text-[#a8c241] hover:text-[#719428] transition-colors"
//                 >
//                   ¿Olvidaste tu contraseña?
//                 </Link>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#D0FF5B] hover:bg-[#D0FF5B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a8c241] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
//                     Iniciando sesión...
//                   </div>
//                 ) : (
//                   'Iniciar Sesión'
//                 )}
//               </Button>
//             </div>
//           </form>

//           {/* Links adicionales */}
//           <div className="mt-6">
//             <div className="relative">
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">
//                   ¿Primera vez en Wiru?{' '}
//                   <Link
//                     to="/register"
//                     className="font-medium text-[#a8c241] hover:text-[#719428] transition-colors"
//                   >
//                     Crear cuenta
//                   </Link>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };





import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { FacebookSignInButton } from '@/components/auth/FacebookSignInButton';
import { useAuth } from '@/hooks/useAuth';
import { env } from '@/utils/env';
import toast from 'react-hot-toast';

// Schema de validación
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook, isLoading } = useAuth();

  // Mensajes basados en parámetros de URL
  const verified = searchParams.get('verified');
  const message = searchParams.get('message');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      await loginWithGoogle(credential);
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  const handleGoogleError = (error: string) => {
    console.error('Google Sign-In error:', error);
    toast.error(error);
  };

  const handleFacebookSuccess = async (accessToken: string, userID: string) => {
    try {
      await loginWithFacebook(accessToken, userID);
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  const handleFacebookError = (error: string) => {
    console.error('Facebook Sign-In error:', error);
    toast.error(error);
  };

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

        <h2 className="text-center text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-[#a8c241] hover:text-[#719428] transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Alertas */}
          {verified === 'true' && (
            <Alert variant="success" className="mb-6">
              ¡Email verificado exitosamente! Ahora puedes iniciar sesión.
            </Alert>
          )}

          {message === 'verify-email' && (
            <Alert variant="default" className="mb-6">
              Por favor verifica tu email antes de iniciar sesión.
            </Alert>
          )}

          {/* OAuth Buttons */}
          {env.ENABLE_OAUTH && (env.GOOGLE_CLIENT_ID || env.FACEBOOK_APP_ID) && (
            <div className="mb-6">
              {/* Google Sign-In */}
              {env.GOOGLE_CLIENT_ID && (
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  disabled={isLoading}
                  text="Iniciar sesión con Google"
                />
              )}
              
              {/* Facebook Sign-In */}
              {env.FACEBOOK_APP_ID && (
                <div className={env.GOOGLE_CLIENT_ID ? "mt-3" : ""}>
                  <FacebookSignInButton
                    onSuccess={handleFacebookSuccess}
                    onError={handleFacebookError}
                    disabled={isLoading}
                    text="Iniciar sesión con Facebook"
                  />
                </div>
              )}
              
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O continúa con email</span>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de login */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#a8c241] hover:text-[#719428] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#D0FF5B] hover:bg-[#D0FF5B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a8c241] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </div>
          </form>

          {/* Links adicionales */}
          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Primera vez en Wiru?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-[#a8c241] hover:text-[#719428] transition-colors"
                  >
                    Crear cuenta
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};