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





// src/pages/auth/LoginPage.tsx
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
};