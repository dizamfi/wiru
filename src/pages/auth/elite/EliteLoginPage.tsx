// // src/pages/auth/elite/EliteLoginPage.tsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { 
//   EnvelopeIcon, 
//   LockClosedIcon,
//   ArrowRightIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon 
// } from '@heroicons/react/24/outline';

// // Components
// import { EliteAuthLayout } from '@/components/layout/EliteAuthLayout';
// import { EliteInput } from '@/components/ui/elite/EliteInput';
// import { EliteButton } from '@/components/ui/elite/EliteButton';

// // Hooks (mantenemos la funcionalidad existente)
// import { useAuth } from '@/hooks/useAuth';

// // Validation
// const loginSchema = z.object({
//   email: z.string().email('Ingresa un email válido'),
//   password: z.string().min(1, 'La contraseña es requerida'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export const EliteLoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated, login } = useAuth();
  
//   // Estados
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Mensajes desde navegación
//   const registrationMessage = location.state?.message;
//   const registrationEmail = location.state?.email;
//   const redirectTo = location.state?.from || '/dashboard';

//   // Redirigir si ya está autenticado
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(redirectTo, { replace: true });
//     }
//   }, [isAuthenticated, navigate, redirectTo]);

//   // Mostrar mensaje de éxito si viene del registro
//   useEffect(() => {
//     if (registrationMessage) {
//       setSuccess(registrationMessage);
//     }
//   }, [registrationMessage]);

//   // Configurar formulario
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: registrationEmail || '',
//       password: ''
//     }
//   });

//   // Manejar envío del formulario
//   const onSubmit = async (data: LoginFormData) => {
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       await login({
//         email: data.email,
//         password: data.password
//       });
      
//       // La redirección se maneja automáticamente por el useEffect
//     } catch (err: any) {
//       console.error('Login error:', err);
//       setError(err?.message || 'Error al iniciar sesión. Intenta nuevamente.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Manejar login con Google
//   const handleGoogleLogin = async () => {
//     setError(null);
//     try {
//       // Implementar Google OAuth aquí si existe
//       console.log('Google login clicked');
//     } catch (err: any) {
//       setError(err?.message || 'Error al iniciar sesión con Google');
//     }
//   };

//   // Manejar login con Facebook
//   const handleFacebookLogin = async () => {
//     setError(null);
//     try {
//       // Implementar Facebook OAuth aquí si existe
//       console.log('Facebook login clicked');
//     } catch (err: any) {
//       setError(err?.message || 'Error al iniciar sesión con Facebook');
//     }
//   };

//   return (
//     <EliteAuthLayout 
//       title="Bienvenido de vuelta"
//       subtitle="Inicia sesión en tu cuenta para continuar"
//     >
//       {/* Alert Messages */}
//       {error && (
//         <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
//           <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//           <div>
//             <p className="text-red-800 font-medium">Error de autenticación</p>
//             <p className="text-red-700 text-sm mt-1">{error}</p>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-3">
//           <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//           <div>
//             <p className="text-green-800 font-medium">¡Perfecto!</p>
//             <p className="text-green-700 text-sm mt-1">{success}</p>
//           </div>
//         </div>
//       )}

//       {/* Login Form */}
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Email Field */}
//         <EliteInput
//           {...register('email')}
//           type="email"
//           label="Correo electrónico"
//           placeholder="tu@email.com"
//           error={errors.email?.message}
//           leftIcon={<EnvelopeIcon className="h-5 w-5" />}
//           variant="floating"
//         />

//         {/* Password Field */}
//         <EliteInput
//           {...register('password')}
//           type="password"
//           label="Contraseña"
//           placeholder="Tu contraseña"
//           error={errors.password?.message}
//           leftIcon={<LockClosedIcon className="h-5 w-5" />}
//           showPasswordToggle
//           variant="floating"
//         />

//         {/* Forgot Password Link */}
//         <div className="flex justify-end">
//           <Link
//             to="/auth/forgot-password"
//             className="text-sm font-medium text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
//           >
//             ¿Olvidaste tu contraseña?
//           </Link>
//         </div>

//         {/* Submit Button */}
//         <EliteButton
//           type="submit"
//           variant="primary"
//           size="lg"
//           fullWidth
//           loading={isLoading}
//           rightIcon={!isLoading && <ArrowRightIcon className="h-5 w-5" />}
//         >
//           {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
//         </EliteButton>
//       </form>

//       {/* Divider */}
//       <div className="my-8 flex items-center">
//         <div className="flex-1 border-t border-gray-200"></div>
//         <span className="px-4 text-sm font-medium text-gray-500 bg-white">
//           O continúa con
//         </span>
//         <div className="flex-1 border-t border-gray-200"></div>
//       </div>

//       {/* Social Login Buttons */}
//       <div className="space-y-3">
//         {/* Google Button */}
//         <EliteButton
//           type="button"
//           variant="secondary"
//           size="lg"
//           fullWidth
//           onClick={handleGoogleLogin}
//           leftIcon={
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//           }
//         >
//           Continuar con Google
//         </EliteButton>

//         {/* Facebook Button */}
//         <EliteButton
//           type="button"
//           variant="secondary"
//           size="lg"
//           fullWidth
//           onClick={handleFacebookLogin}
//           leftIcon={
//             <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
//               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//             </svg>
//           }
//         >
//           Continuar con Facebook
//         </EliteButton>
//       </div>

//       {/* Register Link */}
//       <div className="mt-8 text-center">
//         <p className="text-gray-600">
//           ¿No tienes cuenta?{' '}
//           <Link
//             to="/auth/register"
//             className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
//           >
//             Crear cuenta gratis
//           </Link>
//         </p>
//       </div>

//       {/* Terms */}
//       <div className="mt-6 text-center">
//         <p className="text-xs text-gray-500">
//           Al continuar, aceptas nuestros{' '}
//           <Link to="/terms" className="text-[#a8c241] hover:underline">
//             Términos de Servicio
//           </Link>
//           {' '}y{' '}
//           <Link to="/privacy" className="text-[#a8c241] hover:underline">
//             Política de Privacidad
//           </Link>
//         </p>
//       </div>
//     </EliteAuthLayout>
//   );
// };




// // src/pages/auth/elite/EliteLoginPage.tsx - ESTILO SPOTIFY LIGHT
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { 
//   EnvelopeIcon, 
//   LockClosedIcon,
//   ArrowRightIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon 
// } from '@heroicons/react/24/outline';

// // Components
// import { EliteAuthLayout } from '@/components/layout/EliteAuthLayout';
// import { EliteInput } from '@/components/ui/elite/EliteInput';
// import { EliteButton } from '@/components/ui/elite/EliteButton';

// // Hooks (mantenemos la funcionalidad existente)
// import { useAuth } from '@/hooks/useAuth';

// // Validation
// const loginSchema = z.object({
//   email: z.string().email('Ingresa un email válido'),
//   password: z.string().min(1, 'La contraseña es requerida'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export const EliteLoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAuthenticated, login, loginWithGoogle, loginWithFacebook } = useAuth();
  
//   // Estados
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [socialLoading, setSocialLoading] = useState<string | null>(null);

//   // Mensajes desde navegación
//   const registrationMessage = location.state?.message;
//   const registrationEmail = location.state?.email;
//   const redirectTo = location.state?.from || '/dashboard';

//   // Redirigir si ya está autenticado
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(redirectTo, { replace: true });
//     }
//   }, [isAuthenticated, navigate, redirectTo]);

//   // Mostrar mensaje de éxito si viene del registro
//   useEffect(() => {
//     if (registrationMessage) {
//       setSuccess(registrationMessage);
//     }
//   }, [registrationMessage]);

//   // Configurar formulario
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: registrationEmail || '',
//       password: ''
//     }
//   });

//   // Manejar envío del formulario
//   const onSubmit = async (data: LoginFormData) => {
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       await login({
//         email: data.email,
//         password: data.password
//       });
//     } catch (err: any) {
//       console.error('Login error:', err);
//       setError(err?.message || 'Error al iniciar sesión. Intenta nuevamente.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Manejar login con Google
//   const handleGoogleLogin = async () => {
//     setSocialLoading('google');
//     setError(null);
//     try {
//       await loginWithGoogle('google-credential-placeholder');
//     } catch (err: any) {
//       setError(err?.message || 'Error al iniciar sesión con Google');
//     } finally {
//       setSocialLoading(null);
//     }
//   };

//   // Manejar login con Facebook
//   const handleFacebookLogin = async () => {
//     setSocialLoading('facebook');
//     setError(null);
//     try {
//       // await loginWithFacebook();
//     } catch (err: any) {
//       setError(err?.message || 'Error al iniciar sesión con Facebook');
//     } finally {
//       setSocialLoading(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Header con Logo */}
//       <div className="w-full flex justify-between items-center p-6 md:p-8">
//         <Link to="/" className="transition-all duration-300 hover:scale-105">
//           <div className="w-10 h-10">
//             <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
//               {/* Logo placeholder - REEMPLAZAR con tu logo */}
//               <circle cx="50" cy="50" r="40" fill="#a8c241"/>
//               <text x="50" y="55" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">W</text>
//             </svg>
//           </div>
//         </Link>
        
//         <Link 
//           to="/"
//           className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
//         >
//           <svg 
//             className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           <span>Volver al inicio</span>
//         </Link>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-4">
//         <div className="w-full max-w-md">
//           {/* Title */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               Inicia sesión en Wiru
//             </h1>
//           </div>

//           {/* Error/Success Messages */}
//           {error && (
//             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-red-800 font-medium">Error de autenticación</p>
//                 <p className="text-red-700 text-sm mt-1">{error}</p>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-3">
//               <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-green-800 font-medium">¡Perfecto!</p>
//                 <p className="text-green-700 text-sm mt-1">{success}</p>
//               </div>
//             </div>
//           )}

//           {/* Social Login Buttons - ESTILO SPOTIFY */}
//           <div className="space-y-4 mb-8">
//             {/* Google Button */}
//             <button
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={socialLoading === 'google'}
//               className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 rounded-full text-gray-900 font-semibold hover:border-gray-400 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
//             >
//               {socialLoading === 'google' ? (
//                 <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
//               ) : (
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="#4285F4"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="#34A853"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="#FBBC05"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="#EA4335"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//               )}
//               <span>Continuar con Google</span>
//             </button>

//             {/* Facebook Button */}
//             <button
//               type="button"
//               onClick={handleFacebookLogin}
//               disabled={socialLoading === 'facebook'}
//               className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 rounded-full text-gray-900 font-semibold hover:border-gray-400 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
//             >
//               {socialLoading === 'facebook' ? (
//                 <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
//               ) : (
//                 <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//               )}
//               <span>Continuar con Facebook</span>
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="relative my-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-4 bg-white text-gray-500 font-medium">o</span>
//             </div>
//           </div>

//           {/* Email/Password Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Email Label */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Email o nombre de usuario
//               </label>
//               <input
//                 {...register('email')}
//                 type="email"
//                 placeholder="Email o nombre de usuario"
//                 className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
//               />
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Contraseña
//               </label>
//               <input
//                 {...register('password')}
//                 type="password"
//                 placeholder="Contraseña"
//                 className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
//               />
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-4 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                   Iniciando sesión...
//                 </div>
//               ) : (
//                 'Continuar'
//               )}
//             </button>

//             {/* Forgot Password */}
//             <div className="text-center">
//               <Link
//                 to="/auth/forgot-password"
//                 className="text-sm font-medium text-gray-900 hover:text-[#a8c241] underline transition-colors"
//               >
//                 ¿Olvidaste tu contraseña?
//               </Link>
//             </div>
//           </form>

//           {/* Divider */}
//           <div className="my-8 border-t border-gray-300"></div>

//           {/* Register Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-700 mb-4">
//               ¿No tienes cuenta?
//             </p>
//             <Link
//               to="/auth/register"
//               className="text-sm font-medium text-gray-900 hover:text-[#a8c241] underline transition-colors"
//             >
//               Regístrate en Wiru
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// // src/pages/auth/elite/EliteLoginPage.tsx - USANDO COMPONENTES OAUTH EXISTENTES
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { 
//   ExclamationTriangleIcon,
//   CheckCircleIcon 
// } from '@heroicons/react/24/outline';

// // Componentes OAuth existentes
// import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
// import { FacebookSignInButton } from '@/components/auth/FacebookSignInButton';

// // Hooks
// import { useAuth } from '@/hooks/useAuth';
// import { env } from '@/utils/env';
// import toast from 'react-hot-toast';

// // Validation
// const loginSchema = z.object({
//   email: z.string().email('Ingresa un email válido'),
//   password: z.string().min(1, 'La contraseña es requerida'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export const EliteLoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams] = useSearchParams();
//   const { isAuthenticated, login, loginWithGoogle, loginWithFacebook, isLoading } = useAuth();
  
//   // Estados
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Mensajes desde navegación y URL
//   const registrationMessage = location.state?.message;
//   const registrationEmail = location.state?.email;
//   const redirectTo = location.state?.from || '/dashboard';
//   const verified = searchParams.get('verified');
//   const message = searchParams.get('message');

//   // Redirigir si ya está autenticado
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate(redirectTo, { replace: true });
//     }
//   }, [isAuthenticated, navigate, redirectTo]);

//   // Mostrar mensajes
//   useEffect(() => {
//     if (registrationMessage) {
//       setSuccess(registrationMessage);
//     } else if (verified === 'true') {
//       setSuccess('¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
//     } else if (message === 'verify-email') {
//       setError('Por favor verifica tu email antes de iniciar sesión.');
//     }
//   }, [registrationMessage, verified, message]);

//   // Configurar formulario
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: registrationEmail || '',
//       password: ''
//     }
//   });

//   // Manejar envío del formulario
//   const onSubmit = async (data: LoginFormData) => {
//     setError(null);
//     setSuccess(null);

//     try {
//       await login({ email: data.email, password: data.password });
//     } catch (err: any) {
//       console.error('Login error:', err);
//       setError(err?.message || 'Error al iniciar sesión. Intenta nuevamente.');
//     }
//   };

//   // Handlers para OAuth
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

//   const handleFacebookSuccess = async (accessToken: string, userID: string) => {
//     try {
//       await loginWithFacebook(accessToken, userID);
//     } catch (error) {
//       // El error ya se maneja en el hook useAuth
//     }
//   };

//   const handleFacebookError = (error: string) => {
//     console.error('Facebook Sign-In error:', error);
//     toast.error(error);
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Header con Logo */}
//       <div className="w-full flex justify-end items-center p-6 md:p-8">
//         {/* <Link to="/" className="transition-all duration-300 hover:scale-105">
//     <img 
//       src="/assets/logo.svg" 
//       alt="Wiru Logo" 
//       className="w-16 h-16"
//     />
//   </Link> */}
        
//         <Link 
//           to="/"
//           className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
//         >
//           <svg 
//             className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           <span>Volver al inicio</span>
//         </Link>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-4">
//         <div className="w-full max-w-md">
//           {/* Title */}
//           {/* <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//               Inicia sesión en Wiru
//             </h1>
//           </div>
          
//           */}

// <div className="text-center mb-8">
//   <div className="flex justify-center mb-4">
//     <div className="w-full flex justify-center">
//       <Link to="/" className="transition-all duration-300 hover:scale-105">
//     <img 
//       src="/assets/logo.svg" 
//       alt="Wiru Logo" 
//       className="w-20 h-20"
//     />
//   </Link>
//     </div>
//   </div>
//   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//     Inicia sesión en tu cuenta
//   </h1>
// </div>
//           {/* Error/Success Messages */}
//           {error && (
//             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
//               <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-red-800 font-medium">Error de autenticación</p>
//                 <p className="text-red-700 text-sm mt-1">{error}</p>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-3">
//               <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-green-800 font-medium">¡Perfecto!</p>
//                 <p className="text-green-700 text-sm mt-1">{success}</p>
//               </div>
//             </div>
//           )}

//           {/* OAuth Buttons - Solo si están habilitados */}
//           {env.ENABLE_OAUTH && (env.GOOGLE_CLIENT_ID || env.FACEBOOK_APP_ID) && (
//             <>
//               <div className="space-y-4 mb-8">
//                 {/* Google Button */}
//                 {env.GOOGLE_CLIENT_ID && (
//                   <GoogleSignInButton
//                     onSuccess={handleGoogleSuccess}
//                     onError={handleGoogleError}
//                     disabled={isLoading}
//                     text="Continuar con Google"
//                   />
//                 )}

//                 {/* Facebook Button */}
//                 {env.FACEBOOK_APP_ID && (
//                   <FacebookSignInButton
//                     onSuccess={handleFacebookSuccess}
//                     onError={handleFacebookError}
//                     disabled={isLoading}
//                     text="Continuar con Facebook"
//                   />
//                 )}
//               </div>

//               {/* Divider */}
//               <div className="relative my-8">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500 font-medium">o</span>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Email/Password Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Email o nombre de usuario
//               </label>
//               <input
//                 {...register('email')}
//                 type="email"
//                 placeholder="Email o nombre de usuario"
//                 className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
//               />
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Contraseña
//               </label>
//               <input
//                 {...register('password')}
//                 type="password"
//                 placeholder="Contraseña"
//                 className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
//               />
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-4 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                   Iniciando sesión...
//                 </div>
//               ) : (
//                 'Continuar'
//               )}
//             </button>

//             {/* Forgot Password */}
//             <div className="text-center">
//               <Link
//                 to="/auth/forgot-password"
//                 className="text-sm font-medium text-gray-900 hover:text-[#a8c241] underline transition-colors"
//               >
//                 ¿Olvidaste tu contraseña?
//               </Link>
//             </div>
//           </form>

//           {/* Divider */}
//           <div className="my-8 border-t border-gray-300"></div>

//           {/* Register Link */}
//           <div className="text-center">
//             <p className="text-sm text-gray-700 mb-4">
//               ¿No tienes cuenta?
//             </p>
//             <Link
//               to="/auth/register"
//               className="text-sm font-medium text-gray-900 hover:text-[#a8c241] underline transition-colors"
//             >
//               Regístrate en Wiru
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };










// src/pages/auth/elite/EliteLoginPage.tsx - ESTILO STARLINK CON PASOS
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

// Componentes OAuth existentes
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { FacebookSignInButton } from '@/components/auth/FacebookSignInButton';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { env } from '@/utils/env';
import toast from 'react-hot-toast';

// Validation schemas
const emailSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
});

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const EliteLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, login, loginWithGoogle, loginWithFacebook, isLoading } = useAuth();
  
  // Estados
  const [currentStep, setCurrentStep] = useState<'email' | 'password'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mensajes desde navegación y URL
  const registrationMessage = location.state?.message;
  const registrationEmail = location.state?.email;
  const redirectTo = location.state?.from || '/dashboard';
  const verified = searchParams.get('verified');
  const message = searchParams.get('message');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // Mostrar mensajes y precargar email si viene del registro
  useEffect(() => {
    if (registrationMessage) {
      setSuccess(registrationMessage);
    } else if (verified === 'true') {
      setSuccess('Email verificado exitosamente. Ahora puedes iniciar sesión.');
    } else if (message === 'verify-email') {
      setError('Por favor verifica tu email antes de iniciar sesión.');
    }

    if (registrationEmail) {
      setUserEmail(registrationEmail);
      setCurrentStep('password'); // Ir directo a contraseña si viene del registro
    }
  }, [registrationMessage, verified, message, registrationEmail]);

  // Formulario para email
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: userEmail }
  });

  // Formulario para contraseña
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' }
  });

  // Manejar envío de email
  const onEmailSubmit = (data: EmailFormData) => {
    setUserEmail(data.email);
    setCurrentStep('password');
    setError(null);
  };

  // Manejar envío de contraseña (login final)
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setError(null);
    setSuccess(null);

    try {
      await login({ 
        email: userEmail, 
        password: data.password 
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Error al iniciar sesión. Intenta nuevamente.');
    }
  };

  // Handlers para OAuth
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

  // Volver al paso anterior
  const goBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('email');
      setError(null);
      passwordForm.reset();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header con Logo */}
      <div className="w-full flex justify-between items-center p-6 md:pt-8 pb-0 pr-8">
        {currentStep === 'password' ? (
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
          >
            <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Atrás</span>
          </button>
        ) : (
          <div></div>
        )}
        
        <Link 
          to="/"
          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
        >
          <svg 
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo grande centrado */}
          <div className="flex justify-center ">
            <Link to="/" className="transition-all duration-300 hover:scale-105">
              <img
                src="/assets/logo.svg"
                alt="Wiru Logo"
                className="w-28 h-28"
              />
            </Link>
          </div>

          {/* Title dinámico */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {currentStep === 'email' ? 'Inicia sesión' : 'Ingresa tu contraseña'}
            </h1>
            {currentStep === 'password' && (
              <p className="text-gray-600 text-lg">
                para {userEmail}
              </p>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error de autenticación</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium">Perfecto</p>
                <p className="text-green-700 text-sm mt-1">{success}</p>
              </div>
            </div>
          )}

          {/* Step 1: Email */}
          {currentStep === 'email' && (
            <>
              {/* OAuth Buttons - Solo si están habilitados */}
              {env.ENABLE_OAUTH && (env.GOOGLE_CLIENT_ID || env.FACEBOOK_APP_ID) && (
                <>
                  <div className="space-y-4 mb-6">
                    {/* Google Button */}
                    {env.GOOGLE_CLIENT_ID && (
                      <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        disabled={isLoading}
                        text="Continuar con Google"
                      />
                    )}

                    {/* Facebook Button */}
                    {env.FACEBOOK_APP_ID && (
                      <FacebookSignInButton
                        onSuccess={handleFacebookSuccess}
                        onError={handleFacebookError}
                        disabled={isLoading}
                        text="Continuar con Facebook"
                      />
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">o</span>
                    </div>
                  </div>
                </>
              )}

              {/* Email Form */}
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    {...emailForm.register('email')}
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

               <button
  type="submit"
  className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-semibold py-4 px-6 text-sm rounded-full transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
>
                  <span>Siguiente</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

          {/* Step 2: Password */}
          {currentStep === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contraseña
                </label>
                <input
                  {...passwordForm.register('password')}
                  type="password"
                  placeholder="Tu contraseña"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
                  autoFocus
                />
                {passwordForm.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {passwordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-4 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-medium text-gray-900 hover:text-[#a8c241] underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          )}

          {/* Register Link */}
          <div className="mt-8 pb-8 text-center">
            <p className="text-sm text-gray-700">
              ¿No tienes cuenta?{' '}
              <Link
                to="/auth/register"
                className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
              >
                Regístrate en Wiru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};