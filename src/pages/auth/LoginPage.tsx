// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
// import { Button, Input, Alert, Card, CardContent } from '@/components/ui';
// import { GoogleSignInButton } from '@/components/auth/GoogleLoginButton';
// import { useLoginForm } from '@/hooks/useAuthForm';
// import { env } from '@/utils/env';

// export const LoginPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const { form, onSubmit, isLoading, error, clearError } = useLoginForm();

//   const {
//     register,
//     formState: { errors },
//   } = form;

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <Card>
//         <CardContent className="p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900">
//               Iniciar Sesión
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Accede a tu cuenta para continuar
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

//           {/* Google OAuth Button */}
//           {env.ENABLE_OAUTH && env.GOOGLE_CLIENT_ID && (
//             <div className="mb-6">
//               <GoogleSignInButton 
//                 disabled={isLoading}
//               />

//               {/* Divider */}
//               <div className="relative mt-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">o</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Login Form */}
//           <form onSubmit={onSubmit} className="space-y-6">
//             <Input
//               {...register('email')}
//               type="email"
//               label="Email"
//               placeholder="tu@email.com"
//               error={errors.email?.message}
//               leftIcon={<EnvelopeIcon className="h-4 w-4" />}
//               autoComplete="email"
//               required
//             />

//             <Input
//               {...register('password')}
//               type={showPassword ? 'text' : 'password'}
//               label="Contraseña"
//               placeholder="••••••••"
//               error={errors.password?.message}
//               rightIcon={
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-4 w-4" />
//                   ) : (
//                     <EyeIcon className="h-4 w-4" />
//                   )}
//                 </button>
//               }
//               autoComplete="current-password"
//               required
//             />

//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-600">
//                   Recordarme
//                 </span>
//               </label>
              
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-primary-600 hover:text-primary-500"
//               >
//                 ¿Olvidaste tu contraseña?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               fullWidth
//               loading={isLoading}
//               disabled={isLoading}
//             >
//               Iniciar Sesión
//             </Button>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               ¿No tienes una cuenta?{' '}
//               <Link
//                 to="/register"
//                 className="font-medium text-primary-600 hover:text-primary-500"
//               >
//                 Regístrate gratis
//               </Link>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };




// src/pages/auth/LoginPage.tsx - Página de Login moderna e impactante

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
// import { Button, Input, Alert } from '@/components/ui';
// import { GoogleSignInButton } from '@/components/auth/GoogleLoginButton';
// import { useLoginForm } from '@/hooks/useAuthForm';
// import { env } from '@/utils/env';

// // Importar el logo
// import WiruLogo from '@/assets/logo.svg';

// export const LoginPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const { form, onSubmit, isLoading, error, clearError } = useLoginForm();

//   const {
//     register,
//     formState: { errors },
//   } = form;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
//       {/* Left Side - Visual/Branding */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#08673B] via-[#0a7a42] to-[#065a32] relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-10 left-10 w-72 h-72 bg-[#D0FF5B] rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
//           <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#D0FF5B] rounded-full blur-2xl"></div>
//         </div>

//         {/* Floating Elements */}
//         <div className="absolute top-20 right-20 w-16 h-16 bg-[#D0FF5B]/20 rounded-2xl rotate-12 animate-pulse"></div>
//         <div className="absolute bottom-32 left-16 w-12 h-12 bg-white/20 rounded-full animate-bounce"></div>
//         <div className="absolute top-1/3 left-20 w-8 h-8 bg-[#D0FF5B]/30 rounded-lg rotate-45"></div>

//         {/* Main Content */}
//         <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
//           {/* Logo */}
//           <div className="mb-8">
//             <img src={WiruLogo} alt="Wiru" className="h-16 w-auto filter brightness-0 invert" />
//           </div>

//           {/* Hero Text */}
//           <div className="text-center max-w-md">
//             <h1 className="text-4xl font-bold mb-6 leading-tight">
//               Convierte tu 
//               <span className="text-[#D0FF5B]"> chatarra electrónica</span> 
//               en dinero
//             </h1>
//             <p className="text-lg text-green-100 mb-8 leading-relaxed">
//               La forma más fácil y segura de reciclar tus dispositivos electrónicos mientras generas ingresos.
//             </p>

//             {/* Stats */}
//             <div className="grid grid-cols-2 gap-6 text-center">
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                 <div className="text-2xl font-bold text-[#D0FF5B]">500+</div>
//                 <div className="text-sm text-green-100">Usuarios activos</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//                 <div className="text-2xl font-bold text-[#D0FF5B]">50kg</div>
//                 <div className="text-sm text-green-100">Reciclados hoy</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Wave */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg viewBox="0 0 1200 120" className="w-full h-24 fill-white/5">
//             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
//           </svg>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}
//           <div className="lg:hidden text-center mb-8">
//             <img src={WiruLogo} alt="Wiru" className="h-12 w-auto mx-auto mb-4" />
//           </div>

//           {/* Form Container */}
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 ¡Bienvenido de vuelta!
//               </h2>
//               <p className="text-gray-600">
//                 Accede a tu cuenta para continuar
//               </p>
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <Alert 
//                 variant="danger" 
//                 className="mb-6 rounded-xl"
//                 dismissible
//                 onDismiss={clearError}
//               >
//                 {error}
//               </Alert>
//             )}

//             {/* Google OAuth Button */}
//             {env.ENABLE_OAUTH && env.GOOGLE_CLIENT_ID && (
//               <div className="mb-6">
//                 <GoogleSignInButton 
//                   disabled={isLoading}
//                 />

//                 {/* Divider */}
//                 <div className="relative mt-6">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-200" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-white text-gray-500 font-medium">o continúa con email</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={onSubmit} className="space-y-6">
//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">
//                   Correo electrónico
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register('email')}
//                     type="email"
//                     placeholder="tu@email.com"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                     autoComplete="email"
//                     required
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-sm text-red-600">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">
//                   Contraseña
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register('password')}
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                     autoComplete="current-password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-red-600">{errors.password.message}</p>
//                 )}
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-[#D0FF5B] focus:ring-[#D0FF5B]"
//                   />
//                   <span className="ml-2 text-sm text-gray-600">Recordarme</span>
//                 </label>
//                 <Link 
//                   to="/forgot-password" 
//                   className="text-sm text-[#08673B] hover:text-[#D0FF5B] font-medium transition-colors"
//                 >
//                   ¿Olvidaste tu contraseña?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-[#08673B] to-[#0a7a42] text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Iniciando sesión...
//                   </div>
//                 ) : (
//                   'Iniciar Sesión'
//                 )}
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="mt-8 text-center">
//               <p className="text-gray-600">
//                 ¿No tienes una cuenta?{' '}
//                 <Link 
//                   to="/register" 
//                   className="text-[#08673B] hover:text-[#D0FF5B] font-semibold transition-colors"
//                 >
//                   Regístrate gratis
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Security Badge */}
//           <div className="mt-6 text-center">
//             <p className="text-xs text-gray-500 flex items-center justify-center">
//               <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//               </svg>
//               Tu información está protegida con encriptación SSL
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Button, Input, Alert } from '@/components/ui';
import { GoogleSignInButton } from '@/components/auth/GoogleLoginButton';
import { useLoginForm } from '@/hooks/useAuthForm';
import { env } from '@/utils/env';

// Importar el logo
import WiruLogo from '@/assets/logo.svg';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit, isLoading, error, clearError } = useLoginForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex relative">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#08673B] via-[#0a7a42] to-[#065a32] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#D0FF5B] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#D0FF5B] rounded-full blur-2xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-[#D0FF5B]/20 rounded-2xl rotate-12 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-20 w-8 h-8 bg-[#D0FF5B]/30 rounded-lg rotate-45"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Logo Real de Wiru */}
          <div className="mb-8">
            <img 
              src={WiruLogo} 
              alt="Wiru" 
              className="h-24 w-24 filter brightness-0 invert"
            />
          </div>

          {/* Hero Text */}
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Convierte tu 
              <span className="text-[#D0FF5B]"> chatarra electrónica</span> 
              en dinero
            </h1>
            <p className="text-lg text-green-100 mb-8 leading-relaxed">
              La forma más fácil y segura de reciclar tus dispositivos electrónicos mientras generas ingresos.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-[#D0FF5B]">500+</div>
                <div className="text-sm text-green-100">Usuarios activos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-[#D0FF5B]">50kg</div>
                <div className="text-sm text-green-100">Reciclados hoy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curved Separator - Línea divisoria curva única */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-24 transform -translate-x-1/2 z-20">
        {/* Curved SVG Background */}
        <svg 
          viewBox="0 0 100 800" 
          className="w-full h-full" 
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradient for the main curve */}
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#08673B" />
              <stop offset="50%" stopColor="#D0FF5B" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            
            {/* Animated gradient */}
            <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D0FF5B" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6">
                <animate attributeName="stop-opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#08673B" stopOpacity="0.4">
                <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            
            {/* Filter for glow effect */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main curved path */}
          <path 
            d="M20,0 Q80,100 30,200 Q70,300 25,400 Q75,500 35,600 Q85,700 40,800 L60,800 Q90,700 45,600 Q95,500 50,400 Q80,300 55,200 Q90,100 60,0 Z" 
            fill="url(#curveGradient)" 
            filter="url(#glow)"
          />
          
          {/* Animated overlay curve */}
          <path 
            d="M25,0 Q75,120 35,240 Q65,360 30,480 Q70,600 35,720 Q80,800 45,800 L55,800 Q85,720 50,600 Q90,480 55,360 Q85,240 60,120 Q95,0 65,0 Z" 
            fill="url(#animatedGradient)" 
            opacity="0.7"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 2,10; 0,0; -2,-10; 0,0"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Decorative dots */}
          <circle cx="45" cy="150" r="2" fill="#D0FF5B" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="350" r="1.5" fill="#ffffff" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="550" r="2.5" fill="#D0FF5B" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.4;0.7" dur="1.8s" repeatCount="indefinite" />
          </circle>
          
          {/* Flowing particles */}
          <circle cx="50" cy="100" r="1" fill="#D0FF5B" opacity="0.9">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 5,700; 0,800"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.9;0.5;0" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="50" r="0.8" fill="#ffffff" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -3,750; 2,800"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.7;0.3;0" dur="10s" repeatCount="indefinite" />
          </circle>
        </svg>
        
        {/* Additional geometric elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#D0FF5B] rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-white rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-[#D0FF5B] rounded-full opacity-80 animate-bounce"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={WiruLogo} alt="Wiru" className="h-20 w-20 mx-auto mb-4" />
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Bienvenido de vuelta!
              </h2>
              <p className="text-gray-600">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert 
                variant="danger" 
                className="mb-6 rounded-xl"
                dismissible
                onDismiss={clearError}
              >
                {error}
              </Alert>
            )}

            {/* Google OAuth Button */}
            {env.ENABLE_OAUTH && env.GOOGLE_CLIENT_ID && (
              <div className="mb-6">
                <GoogleSignInButton 
                  disabled={isLoading}
                />

                {/* Divider */}
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">o continúa con email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#D0FF5B] focus:ring-[#D0FF5B]"
                  />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-[#08673B] hover:text-[#D0FF5B] font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#08673B] to-[#0a7a42] text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="text-[#08673B] hover:text-[#D0FF5B] font-semibold transition-colors"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Tu información está protegida con encriptación SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};



// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
// import { Button, Input, Alert } from '@/components/ui';
// import { GoogleSignInButton } from '@/components/auth/GoogleLoginButton';
// import { useLoginForm } from '@/hooks/useAuthForm';
// import { env } from '@/utils/env';

// // Importar el logo
// import WiruLogo from '@/assets/logo.svg';
// import backgroundImg from '@/assets/background.jpeg';

// export const LoginPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const { form, onSubmit, isLoading, error, clearError } = useLoginForm();

//   const {
//     register,
//     formState: { errors },
//   } = form;

//   return (
//     <div
//       className="min-h-screen flex relative"
//       style={{
//         backgroundImage: `url(${backgroundImg})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Left Side - Logo & Info */}
//       <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
//         <img src={WiruLogo} alt="Wiru" className="h-24 w-24 mb-8" />
//         <h1 className="text-4xl font-bold text-[#08673B] mb-4 text-center">¿Qué es Wiru?</h1>
//         <p className="text-lg text-[#08673B] text-center max-w-md mb-6">
//           Wiru es una plataforma que te permite reciclar tus dispositivos electrónicos de manera fácil, segura y responsable. Convierte tu chatarra electrónica en dinero, ayuda al medio ambiente y forma parte de una comunidad comprometida con el reciclaje tecnológico.
//         </p>
//         <ul className="text-[#08673B] text-base list-disc pl-6 max-w-md">
//           <li>Reciclaje responsable de electrónicos</li>
//           <li>Genera ingresos con tus dispositivos usados</li>
//           <li>Proceso seguro y transparente</li>
//           <li>Contribuye al cuidado del planeta</li>
//         </ul>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-20">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}
//           <div className="lg:hidden text-center mb-8">
//             <img src={WiruLogo} alt="Wiru" className="h-20 w-20 mx-auto mb-4" />
//           </div>

//           {/* Form Container */}
//           <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 ¡Bienvenido de vuelta!
//               </h2>
//               <p className="text-gray-600">
//                 Accede a tu cuenta para continuar
//               </p>
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <Alert 
//                 variant="danger" 
//                 className="mb-6 rounded-xl"
//                 dismissible
//                 onDismiss={clearError}
//               >
//                 {error}
//               </Alert>
//             )}

//             {/* Google OAuth Button */}
//             {env.ENABLE_OAUTH && env.GOOGLE_CLIENT_ID && (
//               <div className="mb-6">
//                 <GoogleSignInButton 
//                   disabled={isLoading}
//                 />

//                 {/* Divider */}
//                 <div className="relative mt-6">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-200" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-white text-gray-500 font-medium">o continúa con email</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={onSubmit} className="space-y-6">
//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">
//                   Correo electrónico
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register('email')}
//                     type="email"
//                     placeholder="tu@email.com"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                     autoComplete="email"
//                     required
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-sm text-red-600">{errors.email.message}</p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-700">
//                   Contraseña
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register('password')}
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
//                     autoComplete="current-password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-sm text-red-600">{errors.password.message}</p>
//                 )}
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     className="rounded border-gray-300 text-[#D0FF5B] focus:ring-[#D0FF5B]"
//                   />
//                   <span className="ml-2 text-sm text-gray-600">Recordarme</span>
//                 </label>
//                 <Link 
//                   to="/forgot-password" 
//                   className="text-sm text-[#08673B] hover:text-[#D0FF5B] font-medium transition-colors"
//                 >
//                   ¿Olvidaste tu contraseña?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-[#08673B] to-[#0a7a42] text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Iniciando sesión...
//                   </div>
//                 ) : (
//                   'Iniciar Sesión'
//                 )}
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="mt-8 text-center">
//               <p className="text-gray-600">
//                 ¿No tienes una cuenta?{' '}
//                 <Link 
//                   to="/register" 
//                   className="text-[#08673B] hover:text-[#D0FF5B] font-semibold transition-colors"
//                 >
//                   Regístrate gratis
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Security Badge */}
//           <div className="mt-6 text-center">
//             <p className="text-xs text-gray-500 flex items-center justify-center">
//               <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//               </svg>
//               Tu información está protegida con encriptación SSL
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };