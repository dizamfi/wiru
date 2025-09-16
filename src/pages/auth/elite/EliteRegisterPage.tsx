// // src/pages/auth/elite/EliteRegisterPage.tsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   UserIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   PhoneIcon,
//   BuildingOfficeIcon,
//   DocumentTextIcon,
//   ArrowRightIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   ArrowLeftIcon
// } from '@heroicons/react/24/outline';

// // Components
// import { EliteAuthLayout } from '@/components/layout/EliteAuthLayout';
// import { EliteInput } from '@/components/ui/elite/EliteInput';
// import { EliteButton } from '@/components/ui/elite/EliteButton';

// // Hooks
// import { useAuth } from '@/hooks/useAuth';

// // Validation Schema
// const registerSchema = z.object({
//   email: z.string().email('Ingresa un email válido'),
//   password: z.string()
//     .min(8, 'La contraseña debe tener al menos 8 caracteres')
//     .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
//     .regex(/[0-9]/, 'Debe contener al menos un número'),
//   confirmPassword: z.string(),
//   firstName: z.string().min(2, 'Ingresa tu nombre'),
//   lastName: z.string().min(2, 'Ingresa tu apellido'),
//   phone: z.string().min(10, 'Ingresa un teléfono válido'),
//   userType: z.enum(['person', 'company']),
//   // Company fields (optional)
//   companyName: z.string().optional(),
//   taxId: z.string().optional(),
//   acceptTerms: z.boolean(),
//   acceptPrivacy: z.boolean(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'Las contraseñas no coinciden',
//   path: ['confirmPassword'],
// }).refine((data) => {
//   if (data.userType === 'company') {
//     return data.companyName && data.taxId;
//   }
//   return true;
// }, {
//   message: 'Los datos de empresa son requeridos',
//   path: ['companyName'],
// }).refine((data) => data.acceptTerms, {
//   message: 'Debes aceptar los términos y condiciones',
//   path: ['acceptTerms'],
// }).refine((data) => data.acceptPrivacy, {
//   message: 'Debes aceptar la política de privacidad',
//   path: ['acceptPrivacy'],
// });

// type RegisterFormData = z.infer<typeof registerSchema>;
// type RegistrationStep = 'userType' | 'personalInfo' | 'credentials' | 'terms';

// export const EliteRegisterPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, register: registerUser } = useAuth();

//   // Estados
//   const [currentStep, setCurrentStep] = useState<RegistrationStep>('userType');
//   const [selectedUserType, setSelectedUserType] = useState<'person' | 'company'>('person');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Redirigir si ya está autenticado
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard', { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   // Configurar formulario
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     trigger,
//     watch,
//     setValue
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       userType: 'person',
//       acceptTerms: false,
//       acceptPrivacy: false,
//     }
//   });

//   // Watch para validación en tiempo real
//   const watchedPassword = watch('password');
//   const watchedUserType = watch('userType');

//   // Actualizar userType cuando se selecciona
//   useEffect(() => {
//     setValue('userType', selectedUserType);
//   }, [selectedUserType, setValue]);

//   // Funciones de navegación entre steps
//   const goToNextStep = async () => {
//     let isValid = false;

//     switch (currentStep) {
//       case 'userType':
//         setCurrentStep('personalInfo');
//         return;

//       case 'personalInfo':
//         isValid = await trigger(['firstName', 'lastName', 'phone', 'companyName', 'taxId']);
//         if (isValid) setCurrentStep('credentials');
//         break;

//       case 'credentials':
//         isValid = await trigger(['email', 'password', 'confirmPassword']);
//         if (isValid) setCurrentStep('terms');
//         break;

//       case 'terms':
//         // Final submission handled by form submit
//         break;
//     }
//   };

//   const goToPrevStep = () => {
//     switch (currentStep) {
//       case 'personalInfo':
//         setCurrentStep('userType');
//         break;
//       case 'credentials':
//         setCurrentStep('personalInfo');
//         break;
//       case 'terms':
//         setCurrentStep('credentials');
//         break;
//     }
//   };

//   // Manejar envío del formulario
//   const onSubmit = async (data: RegisterFormData) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await registerUser({
//           email: data.email,
//           password: data.password,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           phone: data.phone,
//           userType: data.userType,
//           companyName: data.companyName,
//           taxId: data.taxId,
//           confirmPassword: '',
//           acceptTerms: false,
//           acceptPrivacy: false
//       });

//       // Redirigir a login con mensaje de éxito
//       navigate('/auth/login', {
//         state: {
//           message: 'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.',
//           email: data.email
//         }
//       });

//     } catch (err: any) {
//       console.error('Registration error:', err);
//       setError(err?.message || 'Error al crear la cuenta. Intenta nuevamente.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Función para obtener el título y subtítulo según el step
//   const getStepContent = () => {
//     switch (currentStep) {
//       case 'userType':
//         return {
//           title: 'Únete a Wiru',
//           subtitle: 'Selecciona el tipo de cuenta que mejor se adapte a ti'
//         };
//       case 'personalInfo':
//         return {
//           title: selectedUserType === 'person' ? 'Datos personales' : 'Datos de empresa',
//           subtitle: 'Ingresa tu información básica para continuar'
//         };
//       case 'credentials':
//         return {
//           title: 'Credenciales de acceso',
//           subtitle: 'Crea una contraseña segura para tu cuenta'
//         };
//       case 'terms':
//         return {
//           title: 'Términos y condiciones',
//           subtitle: 'Revisa y acepta nuestros términos para completar el registro'
//         };
//     }
//   };

//   const { title, subtitle } = getStepContent();

//   return (
//     <EliteAuthLayout title={title} subtitle={subtitle}>
//       {/* Progress Indicator */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           {(['userType', 'personalInfo', 'credentials', 'terms'] as const).map((step, index) => (
//             <div
//               key={step}
//               className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
//                   currentStep === step
//                     ? 'bg-[#a8c241] text-white shadow-lg'
//                     : (['userType', 'personalInfo', 'credentials', 'terms'] as const).indexOf(currentStep) > index
//                     ? 'bg-green-500 text-white'
//                     : 'bg-gray-200 text-gray-500'
//                 }`}
//               >
//                 {(['userType', 'personalInfo', 'credentials', 'terms'] as const).indexOf(currentStep) > index ? (
//                   <CheckCircleIcon className="w-5 h-5" />
//                 ) : (
//                   index + 1
//                 )}
//               </div>
//               {index < 3 && (
//                 <div
//                   className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
//                     (['userType', 'personalInfo', 'credentials', 'terms'] as const).indexOf(currentStep) > index
//                       ? 'bg-green-500'
//                       : 'bg-gray-200'
//                   }`}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
//           <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//           <div>
//             <p className="text-red-800 font-medium">Error en el registro</p>
//             <p className="text-red-700 text-sm mt-1">{error}</p>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Step 1: User Type Selection */}
//         {currentStep === 'userType' && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               {/* Personal Account */}
//               <button
//                 type="button"
//                 onClick={() => setSelectedUserType('person')}
//                 className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
//                   selectedUserType === 'person'
//                     ? 'border-[#a8c241] bg-[#a8c241]/5 ring-4 ring-[#a8c241]/20'
//                     : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
//                 }`}
//               >
//                 <div className="flex items-start space-x-4">
//                   <div className={`p-3 rounded-xl ${
//                     selectedUserType === 'person' ? 'bg-[#a8c241] text-white' : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     <UserIcon className="h-6 w-6" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       Persona Natural
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Perfecto para individuos que quieren reciclar dispositivos personales y ganar dinero extra.
//                     </p>
//                   </div>
//                 </div>
//               </button>

//               {/* Business Account */}
//               <button
//                 type="button"
//                 onClick={() => setSelectedUserType('company')}
//                 className={`p-6 border-2 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] ${
//                   selectedUserType === 'company'
//                     ? 'border-[#a8c241] bg-[#a8c241]/5 ring-4 ring-[#a8c241]/20'
//                     : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
//                 }`}
//               >
//                 <div className="flex items-start space-x-4">
//                   <div className={`p-3 rounded-xl ${
//                     selectedUserType === 'company' ? 'bg-[#a8c241] text-white' : 'bg-gray-100 text-gray-600'
//                   }`}>
//                     <BuildingOfficeIcon className="h-6 w-6" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       Empresa
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       Ideal para empresas que manejan grandes volúmenes de residuos electrónicos y buscan soluciones corporativas.
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Personal/Company Information */}
//         {currentStep === 'personalInfo' && (
//           <div className="space-y-6">
//             {selectedUserType === 'person' ? (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <EliteInput
//                     {...register('firstName')}
//                     label="Nombre"
//                     placeholder="Tu nombre"
//                     error={errors.firstName?.message}
//                     leftIcon={<UserIcon className="h-5 w-5" />}
//                     variant="floating"
//                   />
//                   <EliteInput
//                     {...register('lastName')}
//                     label="Apellido"
//                     placeholder="Tu apellido"
//                     error={errors.lastName?.message}
//                     leftIcon={<UserIcon className="h-5 w-5" />}
//                     variant="floating"
//                   />
//                 </div>
//                 <EliteInput
//                   {...register('phone')}
//                   type="tel"
//                   label="Teléfono"
//                   placeholder="+593 999 999 999"
//                   error={errors.phone?.message}
//                   leftIcon={<PhoneIcon className="h-5 w-5" />}
//                   variant="floating"
//                 />
//               </>
//             ) : (
//               <>
//                 <EliteInput
//                   {...register('companyName')}
//                   label="Nombre de la empresa"
//                   placeholder="Nombre de tu empresa"
//                   error={errors.companyName?.message}
//                   leftIcon={<BuildingOfficeIcon className="h-5 w-5" />}
//                   variant="floating"
//                 />
//                 <EliteInput
//                   {...register('taxId')}
//                   label="RUC / Tax ID"
//                   placeholder="1234567890001"
//                   error={errors.taxId?.message}
//                   leftIcon={<DocumentTextIcon className="h-5 w-5" />}
//                   variant="floating"
//                 />
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <EliteInput
//                     {...register('firstName')}
//                     label="Nombre del representante"
//                     placeholder="Nombre"
//                     error={errors.firstName?.message}
//                     leftIcon={<UserIcon className="h-5 w-5" />}
//                     variant="floating"
//                   />
//                   <EliteInput
//                     {...register('lastName')}
//                     label="Apellido del representante"
//                     placeholder="Apellido"
//                     error={errors.lastName?.message}
//                     leftIcon={<UserIcon className="h-5 w-5" />}
//                     variant="floating"
//                   />
//                 </div>
//                 <EliteInput
//                   {...register('phone')}
//                   type="tel"
//                   label="Teléfono de contacto"
//                   placeholder="+593 999 999 999"
//                   error={errors.phone?.message}
//                   leftIcon={<PhoneIcon className="h-5 w-5" />}
//                   variant="floating"
//                 />
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 3: Credentials */}
//         {currentStep === 'credentials' && (
//           <div className="space-y-6">
//             <EliteInput
//               {...register('email')}
//               type="email"
//               label="Correo electrónico"
//               placeholder="tu@email.com"
//               error={errors.email?.message}
//               leftIcon={<EnvelopeIcon className="h-5 w-5" />}
//               variant="floating"
//             />

//             <EliteInput
//               {...register('password')}
//               type="password"
//               label="Contraseña"
//               placeholder="Mínimo 8 caracteres"
//               error={errors.password?.message}
//               leftIcon={<LockClosedIcon className="h-5 w-5" />}
//               showPasswordToggle
//               variant="floating"
//               hint="Debe contener al menos 8 caracteres, una mayúscula y un número"
//             />

//             <EliteInput
//               {...register('confirmPassword')}
//               type="password"
//               label="Confirmar contraseña"
//               placeholder="Repite tu contraseña"
//               error={errors.confirmPassword?.message}
//               leftIcon={<LockClosedIcon className="h-5 w-5" />}
//               showPasswordToggle
//               variant="floating"
//             />
//           </div>
//         )}

//         {/* Step 4: Terms & Conditions */}
//         {currentStep === 'terms' && (
//           <div className="space-y-6">
//             <div className="bg-gray-50 rounded-xl p-6 space-y-4">
//               <div className="flex items-start space-x-3">
//                 <input
//                   {...register('acceptTerms')}
//                   type="checkbox"
//                   className="mt-1 w-4 h-4 text-[#a8c241] bg-gray-100 border-gray-300 rounded focus:ring-[#a8c241] focus:ring-2"
//                 />
//                 <div className="text-sm">
//                   <label className="text-gray-700">
//                     Acepto los{' '}
//                     <Link to="/terms" className="text-[#a8c241] hover:underline font-medium">
//                       Términos y Condiciones
//                     </Link>
//                     {' '}de uso de la plataforma
//                   </label>
//                   {errors.acceptTerms && (
//                     <p className="text-red-600 text-xs mt-1">{errors.acceptTerms.message}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <input
//                   {...register('acceptPrivacy')}
//                   type="checkbox"
//                   className="mt-1 w-4 h-4 text-[#a8c241] bg-gray-100 border-gray-300 rounded focus:ring-[#a8c241] focus:ring-2"
//                 />
//                 <div className="text-sm">
//                   <label className="text-gray-700">
//                     Acepto la{' '}
//                     <Link to="/privacy" className="text-[#a8c241] hover:underline font-medium">
//                       Política de Privacidad
//                     </Link>
//                     {' '}y el tratamiento de mis datos personales
//                   </label>
//                   {errors.acceptPrivacy && (
//                     <p className="text-red-600 text-xs mt-1">{errors.acceptPrivacy.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex items-center justify-between pt-6">
//           {currentStep !== 'userType' && (
//             <EliteButton
//               type="button"
//               variant="ghost"
//               onClick={goToPrevStep}
//               leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
//             >
//               Anterior
//             </EliteButton>
//           )}

//           {currentStep === 'userType' && <div />}

//           {currentStep !== 'terms' ? (
//             <EliteButton
//               type="button"
//               variant="primary"
//               onClick={goToNextStep}
//               rightIcon={<ArrowRightIcon className="h-4 w-4" />}
//             >
//               Continuar
//             </EliteButton>
//           ) : (
//             <EliteButton
//               type="submit"
//               variant="success"
//               loading={isLoading}
//               rightIcon={!isLoading && <CheckCircleIcon className="h-4 w-4" />}
//             >
//               {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
//             </EliteButton>
//           )}
//         </div>
//       </form>

//       {/* Login Link */}
//       {currentStep === 'userType' && (
//         <div className="mt-8 text-center">
//           <p className="text-gray-600">
//             ¿Ya tienes una cuenta?{' '}
//             <Link
//               to="/auth/login"
//               className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
//             >
//               Iniciar sesión
//             </Link>
//           </p>
//         </div>
//       )}
//     </EliteAuthLayout>
//   );
// };

// src/pages/auth/elite/EliteRegisterPage.tsx - MEJORADO Y CONSISTENTE
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UserIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// Componentes OAuth existentes
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { FacebookSignInButton } from "@/components/auth/FacebookSignInButton";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { env } from "@/utils/env";
import toast from "react-hot-toast";

// Validation Schema
const registerSchema = z
  .object({
    email: z.string().email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "Ingresa tu nombre"),
    lastName: z.string().min(2, "Ingresa tu apellido"),
    phone: z.string().min(10, "Ingresa un teléfono válido"),
    userType: z.enum(["person", "company"]),
    companyName: z.string().optional(),
    taxId: z.string().optional(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.userType === "company") {
        return data.companyName && data.taxId;
      }
      return true;
    },
    {
      message: "Los datos de empresa son requeridos",
      path: ["companyName"],
    }
  )
  .refine((data) => data.acceptTerms, {
    message: "Debes aceptar los términos y condiciones",
    path: ["acceptTerms"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type RegistrationStep = "userType" | "form";

export const EliteRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    register: registerUser,
    loginWithGoogle,
    loginWithFacebook,
  } = useAuth();

  // Estados
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("userType");
  const [selectedUserType, setSelectedUserType] = useState<
    "person" | "company" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Configurar formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: "person",
      acceptTerms: false,
    },
  });

  // Actualizar userType cuando se selecciona
  useEffect(() => {
    if (selectedUserType) {
      setValue("userType", selectedUserType);
    }
  }, [selectedUserType, setValue]);

  // Continuar al siguiente paso
  const handleContinueFromUserType = () => {
    if (selectedUserType) {
      setCurrentStep("form");
    }
  };

  // Volver al paso anterior
  const goBack = () => {
    setCurrentStep("userType");
    setError(null);
  };

  // Manejar envío del formulario
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        userType: data.userType,
        companyName: data.companyName,
        taxId: data.taxId,
        confirmPassword: "",
        acceptTerms: false,
        acceptPrivacy: false,
      });

      navigate("/auth/login", {
        state: {
          message:
            "Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.",
          email: data.email,
        },
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.message || "Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
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
    console.error("Google Sign-In error:", error);
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
    console.error("Facebook Sign-In error:", error);
    toast.error(error);
  };

  // Paso 1: Selección de tipo de usuario
  if (currentStep === "userType") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-6 md:pt-8 pb-0 pr-8">
          {/* <Link to="/" className="transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="40" fill="#a8c241"/>
                <text x="50" y="55" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">W</text>
              </svg>
            </div>
          </Link>
           */}

          <div></div>

          <Link
            to="/"
            className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
          >
            <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Logo grande centrado */}
            <div className="flex justify-center ">
              <Link
                to="/"
                className="transition-all duration-300 hover:scale-105"
              >
                <img
                  src="/assets/logo.svg"
                  alt="Wiru Logo"
                  className="w-28 h-28"
                />
              </Link>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Únete a nosotros
              </h1>
              <p className="text-gray-600 text-lg">
                Selecciona el tipo de cuenta que mejor se adapte a ti
              </p>
            </div>

            

            {/* User Type Selection */}
            <div className="space-y-4 mb-8">
              <button
                type="button"
                onClick={() => setSelectedUserType("person")}
                className={`w-full p-4 border-2 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] ${
                  selectedUserType === "person"
                    ? "border-[#a8c241] bg-[#a8c241]/5 ring-4 ring-[#a8c241]/20"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl ${
                      selectedUserType === "person"
                        ? "bg-[#a8c241] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Personal
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Perfecto para individuos que quieren reciclar dispositivos
                      personales y ganar dinero extra.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUserType("company")}
                className={`w-full p-4 border-2 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] ${
                  selectedUserType === "company"
                    ? "border-[#a8c241] bg-[#a8c241]/5 ring-4 ring-[#a8c241]/20"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl ${
                      selectedUserType === "company"
                        ? "bg-[#a8c241] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <BuildingOfficeIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Empresa
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ideal para empresas que manejan grandes volúmenes de
                      residuos electrónicos.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueFromUserType}
              disabled={!selectedUserType}
              className={`w-full py-3 px-4 text-sm font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedUserType
                  ? "bg-[#a8c241] hover:bg-[#9bb73d] text-white hover:scale-[1.02]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Continuar</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            {/* Login Link */}
            <div className="mt-5 pb-8 text-center">
              <p className="text-sm text-gray-700">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/auth/login"
                  className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paso 2: Formulario
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full flex justify-between items-center p-6 md:p-8">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Atrás</span>
        </button>

        <Link
          to="/"
          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo grande centrado */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <circle cx="50" cy="50" r="40" fill="#a8c241" />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fontSize="24"
                  fill="white"
                  fontWeight="bold"
                >
                  W
                </text>
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {selectedUserType === "person"
                ? "Cuéntanos sobre ti"
                : "Cuéntanos sobre tu empresa"}
            </h1>
            <p className="text-gray-600 text-lg">
              Completa tu información para crear tu cuenta
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error en el registro</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {selectedUserType === "person"
                    ? "Nombre"
                    : "Nombre del representante"}
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {selectedUserType === "person"
                    ? "Apellido"
                    : "Apellido del representante"}
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Tu apellido"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company Fields */}
            {selectedUserType === "company" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nombre de la empresa
                  </label>
                  <input
                    {...register("companyName")}
                    type="text"
                    placeholder="Nombre de tu empresa"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
                  />
                  {errors.companyName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    RUC / Tax ID
                  </label>
                  <input
                    {...register("taxId")}
                    type="text"
                    placeholder="1234567890001"
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
                  />
                  {errors.taxId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.taxId.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Teléfono
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+593 999 999 999"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Debe contener al menos 8 caracteres, una mayúscula y un número
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirmar contraseña
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-gray-900 focus:outline-none hover:border-gray-400 transition-colors"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                className="mt-1 w-4 h-4 text-[#a8c241] bg-gray-100 border-gray-300 rounded focus:ring-[#a8c241] focus:ring-2"
              />
              <div className="text-sm">
                <label className="text-gray-700">
                  Acepto los{" "}
                  <Link
                    to="/terms"
                    className="text-[#a8c241] hover:underline font-medium"
                  >
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    to="/privacy"
                    className="text-[#a8c241] hover:underline font-medium"
                  >
                    Política de Privacidad
                  </Link>
                </label>
                {errors.acceptTerms && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-4 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creando cuenta...
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pb-8 text-center">
            <p className="text-sm text-gray-700">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/auth/login"
                className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
