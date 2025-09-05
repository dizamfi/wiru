// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   UserIcon,
//   EnvelopeIcon,
//   PhoneIcon,
//   GiftIcon,
//   EyeIcon,
//   EyeSlashIcon
// } from '@heroicons/react/24/outline';
// import { Button, Input, Alert, Card, CardContent } from '@/components/ui';
// import { useRegisterForm } from '@/hooks/useAuthForm';
// import { env } from '@/utils/env';

// export const RegisterPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { form, onSubmit, isLoading, error, clearError } = useRegisterForm();

//   const {
//     register,
//     formState: { errors },
//     watch,
//   } = form;

//   const password = watch('password');

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <Card>
//         <CardContent className="p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900">
//               Crear Cuenta
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Únete y comienza a reciclar hoy mismo
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

//           {/* Register Form */}
//           <form onSubmit={onSubmit} className="space-y-4">
//             {/* Nombre y Apellido */}
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 {...register('firstName')}
//                 label="Nombre"
//                 placeholder="Juan"
//                 error={errors.firstName?.message}
//                 leftIcon={<UserIcon className="h-4 w-4" />}
//                 autoComplete="given-name"
//                 required
//               />

//               <Input
//                 {...register('lastName')}
//                 label="Apellido"
//                 placeholder="Pérez"
//                 error={errors.lastName?.message}
//                 autoComplete="family-name"
//                 required
//               />
//             </div>

//             {/* Email */}
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

//             {/* Teléfono */}
//             <Input
//               {...register('phone')}
//               type="tel"
//               label="Teléfono"
//               placeholder="+57 300 123 4567"
//               error={errors.phone?.message}
//               leftIcon={<PhoneIcon className="h-4 w-4" />}
//               autoComplete="tel"
//               helperText="Opcional - Para notificaciones de recolección"
//             />

//             {/* Contraseña */}
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
//               autoComplete="new-password"
//               helperText="Mínimo 6 caracteres"
//               required
//             />

//             {/* Confirmar Contraseña */}
//             <Input
//               {...register('confirmPassword')}
//               type={showConfirmPassword ? 'text' : 'password'}
//               label="Confirmar Contraseña"
//               placeholder="••••••••"
//               error={errors.confirmPassword?.message}
//               rightIcon={
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeSlashIcon className="h-4 w-4" />
//                   ) : (
//                     <EyeIcon className="h-4 w-4" />
//                   )}
//                 </button>
//               }
//               autoComplete="new-password"
//               required
//             />

//             {/* Código de Referido */}
//             {env.ENABLE_REFERRALS && (
//               <Input
//                 {...register('referralCode')}
//                 label="Código de Referido"
//                 placeholder="ABC123"
//                 error={errors.referralCode?.message}
//                 leftIcon={<GiftIcon className="h-4 w-4" />}
//                 helperText="Opcional - Ingresa el código de quien te invitó"
//               />
//             )}

//             {/* Términos y Condiciones */}
//             <div className="space-y-2">
//               <label className="flex items-start space-x-3">
//                 <input
//                   {...register('acceptTerms')}
//                   type="checkbox"
//                   className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <span className="text-sm text-gray-600">
//                   Acepto los{' '}
//                   <Link
//                     to="/terms"
//                     className="text-primary-600 hover:text-primary-500 underline"
//                     target="_blank"
//                   >
//                     términos y condiciones
//                   </Link>{' '}
//                   y la{' '}
//                   <Link
//                     to="/privacy"
//                     className="text-primary-600 hover:text-primary-500 underline"
//                     target="_blank"
//                   >
//                     política de privacidad
//                   </Link>
//                 </span>
//               </label>
//               {errors.acceptTerms && (
//                 <p className="text-sm text-danger-600">
//                   {errors.acceptTerms.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               fullWidth
//               loading={isLoading}
//               disabled={isLoading}
//               className="mt-6"
//             >
//               Crear Cuenta
//             </Button>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               ¿Ya tienes una cuenta?{' '}
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

// // src/pages/auth/RegisterPage.tsx - Completo
// import React, { useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import { GoogleIcon } from '@/components/icons/GoogleIcon';
// import { FacebookIcon } from '@/components/icons/FacebookIcon';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { UserTypeSelector, useUserTypeSelector } from '@/components/auth/UserTypeSelector';
// import { useAuth } from '@/hooks/useAuth';
// import { UserType } from '@/types/user';
// import { toast } from '@/hooks/useToast';

// // Esquemas de validación
// const baseSchema = z.object({
//   email: z.string().email('Email inválido'),
//   password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos una mayúscula, una minúscula y un número'),
//   confirmPassword: z.string(),
//   acceptTerms: z.boolean().refine(val => val, 'Debes aceptar los términos y condiciones'),
//   acceptPrivacy: z.boolean().refine(val => val, 'Debes aceptar la política de privacidad'),
//   referralCode: z.string().optional()
// }).refine(data => data.password === data.confirmPassword, {
//   message: 'Las contraseñas no coinciden',
//   path: ['confirmPassword']
// });

// const personSchema = baseSchema.extend({
//   firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres')
//     .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
//   lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres')
//     .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
//   phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos').optional(),
//   identificationNumber: z.string().min(8, 'Número de identificación inválido'),
//   identificationType: z.enum(['cedula', 'passport', 'license'], 'Selecciona un tipo de identificación'),
//   dateOfBirth: z.string().optional()
// });

// const companySchema = baseSchema.extend({
//   companyName: z.string().min(2, 'Nombre de empresa requerido'),
//   legalName: z.string().min(2, 'Razón social requerida'),
//   taxId: z.string().min(8, 'RUC o identificación fiscal requerida'),
//   industry: z.string().min(2, 'Industria requerida'),
//   companySize: z.enum(['small', 'medium', 'large', 'enterprise'], {
//     message: 'Selecciona el tamaño de la empresa'
//   }),
//   // Representante legal
//   legalRepFirstName: z.string().min(2, 'Nombre del representante legal requerido'),
//   legalRepLastName: z.string().min(2, 'Apellido del representante legal requerido'),
//   legalRepPosition: z.string().min(2, 'Cargo del representante legal requerido'),
//   legalRepPhone: z.string().min(10, 'Teléfono del representante legal requerido'),
//   legalRepEmail: z.string().email('Email del representante legal inválido'),
//   legalRepId: z.string().min(8, 'Identificación del representante legal requerida'),
//   // Dirección comercial
//   businessStreet: z.string().min(5, 'Dirección comercial requerida'),
//   businessCity: z.string().min(2, 'Ciudad requerida'),
//   businessState: z.string().min(2, 'Estado/Provincia requerida'),
//   businessZipCode: z.string().min(5, 'Código postal requerido'),
//   businessCountry: z.string().min(2, 'País requerido')
// });

// type PersonFormData = z.infer<typeof personSchema>;
// type CompanyFormData = z.infer<typeof companySchema>;
// type FormData = PersonFormData | CompanyFormData;

// export const RegisterPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { register: registerUser, loginWithGoogle, loginWithFacebook } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [currentStep, setCurrentStep] = useState<'type' | 'form'>('type');
//   const [isLoading, setIsLoading] = useState(false);

//   const { selectedType, isValidSelection, handleTypeSelect } = useUserTypeSelector();

//   // Obtener código de referido de URL si existe
//   const referralCode = searchParams.get('ref') || '';

//   // Determinar esquema y tipo de form basado en el tipo de usuario
//   const schema = selectedType === 'person' ? personSchema : companySchema;

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     watch,
//     setValue
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     mode: 'onChange',
//     defaultValues: {
//       referralCode: referralCode,
//       acceptTerms: false,
//       acceptPrivacy: false,
//       businessCountry: 'Ecuador'
//     }
//   });

//   // Pre-llenar código de referido si viene en URL
//   React.useEffect(() => {
//     if (referralCode) {
//       setValue('referralCode', referralCode);
//     }
//   }, [referralCode, setValue]);

//   const onSubmit = async (data: FormData) => {
//     if (!selectedType) return;

//     setIsLoading(true);
//     try {
//       await registerUser({
//         ...data,
//         userType: selectedType,
//       });

//       toast({
//         title: 'Registro exitoso',
//         description: 'Revisa tu email para verificar tu cuenta',
//         variant: 'success'
//       });

//       navigate('/verify-email');
//     } catch (error) {
//       toast({
//         title: 'Error en registro',
//         description: error instanceof Error ? error.message : 'Error desconocido',
//         variant: 'destructive'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider: 'google' | 'facebook') => {
//     if (!selectedType) {
//       toast({
//         title: 'Selecciona tipo de cuenta',
//         description: 'Primero debes seleccionar si eres persona o empresa',
//         variant: 'warning'
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       if (provider === 'google') {
//         await loginWithGoogle({ userType: selectedType, referralCode });
//       } else {
//         await loginWithFacebook({ userType: selectedType, referralCode });
//       }
//       navigate('/dashboard');
//     } catch (error) {
//       toast({
//         title: 'Error en login social',
//         description: 'No se pudo completar el registro',
//         variant: 'destructive'
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderStepIndicator = () => (
//     <div className="flex items-center justify-center space-x-4 mb-8">
//       <div className="flex items-center">
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//           currentStep === 'type'
//             ? 'bg-primary-600 text-white'
//             : isValidSelection
//               ? 'bg-green-600 text-white'
//               : 'bg-gray-200 text-gray-600'
//         }`}>
//           1
//         </div>
//         <span className="ml-2 text-sm font-medium text-gray-700">Tipo de cuenta</span>
//       </div>

//       <div className={`w-8 h-0.5 ${isValidSelection ? 'bg-primary-600' : 'bg-gray-200'}`} />

//       <div className="flex items-center">
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//           currentStep === 'form' && isValidSelection
//             ? 'bg-primary-600 text-white'
//             : 'bg-gray-200 text-gray-600'
//         }`}>
//           2
//         </div>
//         <span className="ml-2 text-sm font-medium text-gray-700">Información</span>
//       </div>
//     </div>
//   );

//   // Opciones para selects
//   const identificationTypes = [
//     { value: 'cedula', label: 'Cédula de Ciudadanía' },
//     { value: 'passport', label: 'Pasaporte' },
//     { value: 'license', label: 'Licencia de Conducir' }
//   ];

//   const companySizes = [
//     { value: 'small', label: 'Pequeña (1-10 empleados)' },
//     { value: 'medium', label: 'Mediana (11-50 empleados)' },
//     { value: 'large', label: 'Grande (51-200 empleados)' },
//     { value: 'enterprise', label: 'Corporación (200+ empleados)' }
//   ];

//   const industries = [
//     { value: 'technology', label: 'Tecnología' },
//     { value: 'manufacturing', label: 'Manufactura' },
//     { value: 'retail', label: 'Retail' },
//     { value: 'healthcare', label: 'Salud' },
//     { value: 'education', label: 'Educación' },
//     { value: 'finance', label: 'Finanzas' },
//     { value: 'government', label: 'Gobierno' },
//     { value: 'nonprofit', label: 'Sin fines de lucro' },
//     { value: 'other', label: 'Otro' }
//   ];

//   if (currentStep === 'type') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
//           {renderStepIndicator()}

//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <UserTypeSelector
//               selectedType={selectedType}
//               onTypeSelect={handleTypeSelect}
//             />

//             {isValidSelection && (
//               <div className="mt-8 flex justify-center">
//                 <Button
//                   onClick={() => setCurrentStep('form')}
//                   className="px-8 py-2"
//                 >
//                   Continuar
//                 </Button>
//               </div>
//             )}

//             <div className="mt-6 text-center">
//               <span className="text-sm text-gray-600">
//                 ¿Ya tienes una cuenta?{' '}
//                 <Link to="/login" className="text-primary-600 hover:text-primary-500">
//                   Inicia sesión
//                 </Link>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
//         {renderStepIndicator()}

//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {/* Header */}
//           <div className="text-center mb-6">
//             <button
//               onClick={() => setCurrentStep('type')}
//               className="text-sm text-primary-600 hover:text-primary-500 mb-4"
//             >
//               ← Cambiar tipo de cuenta
//             </button>
//             <h2 className="text-2xl font-bold text-gray-900">
//               {selectedType === 'person' ? 'Registro Personal' : 'Registro Empresarial'}
//             </h2>
//             <p className="text-sm text-gray-600 mt-2">
//               {selectedType === 'person'
//                 ? 'Completa tu información personal'
//                 : 'Completa la información de tu empresa'
//               }
//             </p>
//           </div>

//           {/* Social Login */}
//           <div className="space-y-3 mb-6">
//             <Button
//               variant="outline"
//               onClick={() => handleSocialLogin('google')}
//               disabled={isLoading}
//               className="w-full"
//             >
//               <GoogleIcon className="h-5 w-5 mr-2" />
//               Continuar con Google
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => handleSocialLogin('facebook')}
//               disabled={isLoading}
//               className="w-full"
//             >
//               <FacebookIcon className="h-5 w-5 mr-2" />
//               Continuar con Facebook
//             </Button>
//           </div>

//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">O continúa con email</span>
//             </div>
//           </div>

//           {/* Registration Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {selectedType === 'person' ? (
//               // Formulario para personas
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Nombre"
//                     error={errors.firstName?.message}
//                     {...register('firstName')}
//                   />
//                   <Input
//                     label="Apellido"
//                     error={errors.lastName?.message}
//                     {...register('lastName')}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Select
//                     label="Tipo de Identificación"
//                     options={identificationTypes}
//                     error={errors.identificationType?.message}
//                     {...register('identificationType')}
//                   />
//                   <Input
//                     label="Número de Identificación"
//                     placeholder="Ej: 1234567890"
//                     error={errors.identificationNumber?.message}
//                     {...register('identificationNumber')}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Teléfono (opcional)"
//                     type="tel"
//                     placeholder="+593 99 999 9999"
//                     error={errors.phone?.message}
//                     {...register('phone')}
//                   />
//                   <Input
//                     label="Fecha de Nacimiento (opcional)"
//                     type="date"
//                     error={errors.dateOfBirth?.message}
//                     {...register('dateOfBirth')}
//                   />
//                 </div>
//               </>
//             ) : (
//               // Formulario para empresas
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Nombre Comercial"
//                     error={errors.companyName?.message}
//                     {...register('companyName')}
//                   />
//                   <Input
//                     label="Razón Social"
//                     error={errors.legalName?.message}
//                     {...register('legalName')}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="RUC / Tax ID"
//                     error={errors.taxId?.message}
//                     {...register('taxId')}
//                   />
//                   <Select
//                     label="Industria"
//                     options={industries}
//                     error={errors.industry?.message}
//                     {...register('industry')}
//                   />
//                 </div>

//                 <Select
//                   label="Tamaño de la Empresa"
//                   options={companySizes}
//                   error={errors.companySize?.message}
//                   {...register('companySize')}
//                 />

//                 <div className="border-t pt-6 mt-6">
//                   <h4 className="text-sm font-medium text-gray-900 mb-4">
//                     Representante Legal
//                   </h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <Input
//                       label="Nombre"
//                       error={errors.legalRepFirstName?.message}
//                       {...register('legalRepFirstName')}
//                     />
//                     <Input
//                       label="Apellido"
//                       error={errors.legalRepLastName?.message}
//                       {...register('legalRepLastName')}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <Input
//                       label="Cargo"
//                       error={errors.legalRepPosition?.message}
//                       {...register('legalRepPosition')}
//                     />
//                     <Input
//                       label="Identificación"
//                       error={errors.legalRepId?.message}
//                       {...register('legalRepId')}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                       label="Email"
//                       type="email"
//                       error={errors.legalRepEmail?.message}
//                       {...register('legalRepEmail')}
//                     />
//                     <Input
//                       label="Teléfono"
//                       type="tel"
//                       error={errors.legalRepPhone?.message}
//                       {...register('legalRepPhone')}
//                     />
//                   </div>
//                 </div>

//                 <div className="border-t pt-6 mt-6">
//                   <h4 className="text-sm font-medium text-gray-900 mb-4">
//                     Dirección Comercial
//                   </h4>

//                   <div className="space-y-4">
//                     <Input
//                       label="Dirección"
//                       error={errors.businessStreet?.message}
//                       {...register('businessStreet')}
//                     />

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <Input
//                         label="Ciudad"
//                         error={errors.businessCity?.message}
//                         {...register('businessCity')}
//                       />
//                       <Input
//                         label="Estado/Provincia"
//                         error={errors.businessState?.message}
//                         {...register('businessState')}
//                       />
//                       <Input
//                         label="Código Postal"
//                         error={errors.businessZipCode?.message}
//                         {...register('businessZipCode')}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Campos comunes */}
//             <div className="border-t pt-6 mt-6">
//               <h4 className="text-sm font-medium text-gray-900 mb-4">
//                 Credenciales de Acceso
//               </h4>

//               <Input
//                 label="Email"
//                 type="email"
//                 error={errors.email?.message}
//                 {...register('email')}
//               />

//               <div className="relative mt-4">
//                 <Input
//                   label="Contraseña"
//                   type={showPassword ? 'text' : 'password'}
//                   error={errors.password?.message}
//                   {...register('password')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-5 w-5" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>

//               <div className="relative mt-4">
//                 <Input
//                   label="Confirmar Contraseña"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   error={errors.confirmPassword?.message}
//                   {...register('confirmPassword')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeSlashIcon className="h-5 w-5" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Código de referido */}
//             <Input
//               label="Código de Referido (opcional)"
//               placeholder="Ingresa el código de quien te invitó"
//               error={errors.referralCode?.message}
//               {...register('referralCode')}
//             />

//             {/* Términos y condiciones */}
//             <div className="space-y-4">
//               <div className="flex items-start">
//                 <input
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                   {...register('acceptTerms')}
//                 />
//                 <label className="ml-2 text-sm text-gray-600">
//                   Acepto los{' '}
//                   <Link to="/terms" className="text-primary-600 hover:text-primary-500" target="_blank">
//                     términos y condiciones
//                   </Link>
//                 </label>
//               </div>
//               {errors.acceptTerms && (
//                 <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
//               )}

//               <div className="flex items-start">
//                 <input
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                   {...register('acceptPrivacy')}
//                 />
//                 <label className="ml-2 text-sm text-gray-600">
//                   Acepto la{' '}
//                   <Link to="/privacy" className="text-primary-600 hover:text-primary-500" target="_blank">
//                     política de privacidad
//                   </Link>
//                 </label>
//               </div>
//               {errors.acceptPrivacy && (
//                 <p className="text-sm text-red-600">{errors.acceptPrivacy.message}</p>
//               )}
//             </div>

//             {/* Submit button */}
//             <Button
//               type="submit"
//               disabled={!isValid || isLoading}
//               loading={isLoading}
//               className="w-full"
//             >
//               {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
//             </Button>
//           </form>

//           {/* Login link */}
//           <div className="mt-6 text-center">
//             <span className="text-sm text-gray-600">
//               ¿Ya tienes una cuenta?{' '}
//               <Link to="/login" className="text-primary-600 hover:text-primary-500">
//                 Inicia sesión
//               </Link>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // src/pages/auth/RegisterPage.tsx
// import React, { useState } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { useRegisterForm, RegisterFormData } from '@/hooks/useAuthForm';

// // Tipos simplificados para evitar conflictos
// type UserType = 'person' | 'company';

// // Hook simplificado para el selector de tipo de usuario
// const useUserTypeSelector = () => {
//   const [selectedType, setSelectedType] = useState<UserType | null>(null);

//   return {
//     selectedType,
//     isValidSelection: !!selectedType,
//     handleTypeSelect: setSelectedType
//   };
// };

// // Componente simplificado para selector de tipo de usuario
// const UserTypeSelector: React.FC<{
//   selectedType: UserType | null;
//   onTypeSelect: (type: UserType) => void;
// }> = ({ selectedType, onTypeSelect }) => {
//   return (
//     <div className="space-y-4">
//       <div className="text-center mb-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-2">
//           ¿Qué tipo de cuenta necesitas?
//         </h2>
//         <p className="text-gray-600">
//           Selecciona el tipo que mejor describe tu situación
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div
//           onClick={() => onTypeSelect('person')}
//           className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
//             selectedType === 'person'
//               ? 'border-primary-600 bg-primary-50'
//               : 'border-gray-200 hover:border-gray-300'
//           }`}
//         >
//           <div className="text-center">
//             <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Persona Natural
//             </h3>
//             <p className="text-sm text-gray-600">
//               Para usuarios individuales que quieren reciclar sus dispositivos electrónicos
//             </p>
//           </div>
//         </div>

//         <div
//           onClick={() => onTypeSelect('company')}
//           className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
//             selectedType === 'company'
//               ? 'border-primary-600 bg-primary-50'
//               : 'border-gray-200 hover:border-gray-300'
//           }`}
//         >
//           <div className="text-center">
//             <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Empresa
//             </h3>
//             <p className="text-sm text-gray-600">
//               Para empresas u organizaciones que manejan residuos electrónicos a mayor escala
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Esquema de validación unificado - SIMPLIFICADO
// const registerSchema = z.object({
//   // Campos base
//   email: z.string().email('Email inválido'),
//   password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos una mayúscula, una minúscula y un número'),
//   confirmPassword: z.string(),
//   acceptTerms: z.boolean().refine(val => val, 'Debes aceptar los términos y condiciones'),
//   acceptPrivacy: z.boolean().refine(val => val, 'Debes aceptar la política de privacidad'),
//   referralCode: z.string().optional(),

//   // Campos de persona (siempre opcionales)
//   firstName: z.string().optional(),
//   lastName: z.string().optional(),
//   phone: z.string().optional(),
//   identificationNumber: z.string().optional(),
//   identificationType: z.enum(['cedula', 'passport', 'license']).optional(),
//   dateOfBirth: z.string().optional(),

//   // Campos de empresa (siempre opcionales)
//   companyName: z.string().optional(),
//   legalName: z.string().optional(),
//   taxId: z.string().optional(),
//   industry: z.string().optional(),
//   companySize: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
//   legalRepFirstName: z.string().optional(),
//   legalRepLastName: z.string().optional(),
//   legalRepPosition: z.string().optional(),
//   legalRepPhone: z.string().optional(),
//   legalRepEmail: z.string().optional(),
//   legalRepId: z.string().optional(),
//   businessStreet: z.string().optional(),
//   businessCity: z.string().optional(),
//   businessState: z.string().optional(),
//   businessZipCode: z.string().optional(),
//   businessCountry: z.string().optional(),
// }).refine(data => data.password === data.confirmPassword, {
//   message: 'Las contraseñas no coinciden',
//   path: ['confirmPassword']
// });

// type FormData = z.infer<typeof registerSchema>;

// export const RegisterPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const { onSubmit, isLoading, error, success, clearError, clearSuccess } = useRegisterForm();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [currentStep, setCurrentStep] = useState<'type' | 'form'>('type');

//   const { selectedType, isValidSelection, handleTypeSelect } = useUserTypeSelector();

//   // Obtener código de referido de URL si existe
//   const referralCode = searchParams.get('ref') || '';

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     setValue,
//     clearErrors,
//     watch
//   } = useForm<FormData>({
//     resolver: zodResolver(registerSchema),
//     mode: 'onChange',
//     defaultValues: {
//       referralCode: referralCode,
//       acceptTerms: false,
//       acceptPrivacy: false,
//       businessCountry: 'Ecuador',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       firstName: '',
//       lastName: '',
//       phone: '',
//       identificationNumber: '',
//       dateOfBirth: '',
//       companyName: '',
//       legalName: '',
//       taxId: '',
//       industry: '',
//       legalRepFirstName: '',
//       legalRepLastName: '',
//       legalRepPosition: '',
//       legalRepPhone: '',
//       legalRepEmail: '',
//       legalRepId: '',
//       businessStreet: '',
//       businessCity: '',
//       businessState: '',
//       businessZipCode: '',
//     }
//   });

//   // Pre-llenar código de referido si viene en URL
//   React.useEffect(() => {
//     if (referralCode) {
//       setValue('referralCode', referralCode);
//     }
//   }, [referralCode, setValue]);

//   // Limpiar errores cuando se cambia el tipo de usuario
//   React.useEffect(() => {
//     clearErrors();
//   }, [selectedType, clearErrors]);

//   const handleFormSubmit = async (data: FormData) => {
//     if (!selectedType) return;

//     // Crear objeto con solo los campos necesarios según el tipo
//     const dataWithUserType: RegisterFormData = {
//       ...Object.fromEntries(
//         Object.entries(data).map(([key, value]) => [
//           key,
//           typeof value === 'undefined' ? '' : value
//         ])
//       ),
//       userType: selectedType,
//       email: '',
//       password: '',
//       confirmPassword: '',
//       firstName: '',
//       lastName: '',
//       acceptTerms: false,
//       acceptPrivacy: false
//     };

//     console.log('📝 Datos del formulario completos:', dataWithUserType);

//     await onSubmit(dataWithUserType);
//   };

//   const renderStepIndicator = () => (
//     <div className="flex items-center justify-center space-x-4 mb-8">
//       <div className="flex items-center">
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//           currentStep === 'type'
//             ? 'bg-primary-600 text-white'
//             : isValidSelection
//               ? 'bg-green-600 text-white'
//               : 'bg-gray-200 text-gray-600'
//         }`}>
//           1
//         </div>
//         <span className="ml-2 text-sm font-medium text-gray-700">Tipo de cuenta</span>
//       </div>

//       <div className={`w-8 h-0.5 ${isValidSelection ? 'bg-primary-600' : 'bg-gray-200'}`} />

//       <div className="flex items-center">
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//           currentStep === 'form' && isValidSelection
//             ? 'bg-primary-600 text-white'
//             : 'bg-gray-200 text-gray-600'
//         }`}>
//           2
//         </div>
//         <span className="ml-2 text-sm font-medium text-gray-700">Información</span>
//       </div>
//     </div>
//   );

//   // Opciones para selects
//   const identificationTypes = [
//     { value: 'cedula', label: 'Cédula de Ciudadanía' },
//     { value: 'passport', label: 'Pasaporte' },
//     { value: 'license', label: 'Licencia de Conducir' }
//   ];

//   const companySizes = [
//     { value: 'small', label: 'Pequeña (1-10 empleados)' },
//     { value: 'medium', label: 'Mediana (11-50 empleados)' },
//     { value: 'large', label: 'Grande (51-200 empleados)' },
//     { value: 'enterprise', label: 'Corporación (200+ empleados)' }
//   ];

//   const industries = [
//     { value: 'technology', label: 'Tecnología' },
//     { value: 'manufacturing', label: 'Manufactura' },
//     { value: 'retail', label: 'Retail' },
//     { value: 'healthcare', label: 'Salud' },
//     { value: 'education', label: 'Educación' },
//     { value: 'finance', label: 'Finanzas' },
//     { value: 'government', label: 'Gobierno' },
//     { value: 'nonprofit', label: 'Sin fines de lucro' },
//     { value: 'other', label: 'Otro' }
//   ];

//   if (currentStep === 'type') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
//           {/* Logo */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
//             <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
//           </div>

//           {renderStepIndicator()}

//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <UserTypeSelector
//               selectedType={selectedType}
//               onTypeSelect={handleTypeSelect}
//             />

//             {isValidSelection && (
//               <div className="mt-8 flex justify-center">
//                 <Button
//                   onClick={() => setCurrentStep('form')}
//                   className="px-8 py-2"
//                 >
//                   Continuar
//                 </Button>
//               </div>
//             )}

//             <div className="mt-6 text-center">
//               <span className="text-sm text-gray-600">
//                 ¿Ya tienes una cuenta?{' '}
//                 <Link to="/login" className="text-primary-600 hover:text-primary-500">
//                   Inicia sesión
//                 </Link>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
//           <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
//         </div>

//         {renderStepIndicator()}

//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {/* Header */}
//           <div className="text-center mb-6">
//             <button
//               onClick={() => setCurrentStep('type')}
//               className="text-sm text-primary-600 hover:text-primary-500 mb-4"
//             >
//               ← Cambiar tipo de cuenta
//             </button>
//             <h2 className="text-2xl font-bold text-gray-900">
//               {selectedType === 'person' ? 'Registro Personal' : 'Registro Empresarial'}
//             </h2>
//             <p className="text-sm text-gray-600 mt-2">
//               {selectedType === 'person'
//                 ? 'Completa tu información personal'
//                 : 'Completa la información de tu empresa'
//               }
//             </p>
//           </div>

//           {/* Mensajes de error/éxito */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
//               <div className="flex items-center justify-between">
//                 <p className="text-red-600 text-sm">{error}</p>
//                 <button
//                   onClick={clearError}
//                   className="text-red-400 hover:text-red-600"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
//               <div className="flex items-center justify-between">
//                 <p className="text-green-600 text-sm">{success}</p>
//                 <button
//                   onClick={clearSuccess}
//                   className="text-green-400 hover:text-green-600"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Social Login */}
//           <div className="space-y-3 mb-6">
//             <Button
//               variant="outline"
//               disabled={isLoading}
//               className="w-full"
//             >
//               <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Continuar con Google
//             </Button>
//           </div>

//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">O completa el formulario</span>
//             </div>
//           </div>

//           {/* Registration Form */}
//           <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//             {selectedType === 'person' ? (
//               // Formulario para personas
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Nombre"
//                     error={errors.firstName?.message}
//                     {...register('firstName')}
//                   />
//                   <Input
//                     label="Apellido"
//                     error={errors.lastName?.message}
//                     {...register('lastName')}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Select
//                     label="Tipo de Identificación (opcional)"
//                     options={identificationTypes}
//                     error={errors.identificationType?.message}
//                     value={watch('identificationType') || ''}
//                     onChange={value => setValue('identificationType', value as 'cedula' | 'passport' | 'license' | undefined)}
//                     name="identificationType"
//                   />
//                   <Input
//                     label="Número de Identificación (opcional)"
//                     placeholder="Ej: 1234567890"
//                     error={errors.identificationNumber?.message}
//                     {...register('identificationNumber')}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Teléfono (opcional)"
//                     type="tel"
//                     placeholder="+593 99 999 9999"
//                     error={errors.phone?.message}
//                     {...register('phone')}
//                   />
//                   <Input
//                     label="Fecha de Nacimiento (opcional)"
//                     type="date"
//                     error={errors.dateOfBirth?.message}
//                     {...register('dateOfBirth')}
//                   />
//                 </div>
//               </>
//             ) : (
//               // Formulario para empresas
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="Nombre Comercial"
//                     error={errors.companyName?.message}
//                     {...register('companyName')}
//                   />
//                   <Input
//                     label="Razón Social"
//                     error={errors.legalName?.message}
//                     {...register('legalName')}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Input
//                     label="RUC / Tax ID"
//                     error={errors.taxId?.message}
//                     {...register('taxId')}
//                   />
//                   <Select
//                     label="Industria"
//                     options={industries}
//                     error={errors.industry?.message}
//                     value={watch('industry') || ''}
//                     onChange={value => setValue('industry', value)}
//                     name="industry"
//                   />
//                 </div>

//                 <Select
//                   label="Tamaño de la Empresa"
//                   options={companySizes}
//                   error={errors.companySize?.message}
//                   value={watch('companySize') || ''}
//                   onChange={value => setValue('companySize', value as 'small' | 'medium' | 'large' | 'enterprise' | undefined)}
//                   name="companySize"
//                 />

//                 <div className="border-t pt-6 mt-6">
//                   <h4 className="text-sm font-medium text-gray-900 mb-4">
//                     Representante Legal
//                   </h4>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <Input
//                       label="Nombre"
//                       error={errors.legalRepFirstName?.message}
//                       {...register('legalRepFirstName')}
//                     />
//                     <Input
//                       label="Apellido"
//                       error={errors.legalRepLastName?.message}
//                       {...register('legalRepLastName')}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <Input
//                       label="Cargo"
//                       error={errors.legalRepPosition?.message}
//                       {...register('legalRepPosition')}
//                     />
//                     <Input
//                       label="Identificación"
//                       error={errors.legalRepId?.message}
//                       {...register('legalRepId')}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                       label="Email"
//                       type="email"
//                       error={errors.legalRepEmail?.message}
//                       {...register('legalRepEmail')}
//                     />
//                     <Input
//                       label="Teléfono"
//                       type="tel"
//                       error={errors.legalRepPhone?.message}
//                       {...register('legalRepPhone')}
//                     />
//                   </div>
//                 </div>

//                 <div className="border-t pt-6 mt-6">
//                   <h4 className="text-sm font-medium text-gray-900 mb-4">
//                     Dirección Comercial
//                   </h4>

//                   <div className="space-y-4">
//                     <Input
//                       label="Dirección"
//                       error={errors.businessStreet?.message}
//                       {...register('businessStreet')}
//                     />

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <Input
//                         label="Ciudad"
//                         error={errors.businessCity?.message}
//                         {...register('businessCity')}
//                       />
//                       <Input
//                         label="Estado/Provincia"
//                         error={errors.businessState?.message}
//                         {...register('businessState')}
//                       />
//                       <Input
//                         label="Código Postal"
//                         error={errors.businessZipCode?.message}
//                         {...register('businessZipCode')}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Campos comunes */}
//             <div className="border-t pt-6 mt-6">
//               <h4 className="text-sm font-medium text-gray-900 mb-4">
//                 Credenciales de Acceso
//               </h4>

//               <Input
//                 label="Email"
//                 type="email"
//                 error={errors.email?.message}
//                 {...register('email')}
//               />

//               <div className="relative mt-4">
//                 <Input
//                   label="Contraseña"
//                   type={showPassword ? 'text' : 'password'}
//                   error={errors.password?.message}
//                   {...register('password')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-5 w-5" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>

//               <div className="relative mt-4">
//                 <Input
//                   label="Confirmar Contraseña"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   error={errors.confirmPassword?.message}
//                   {...register('confirmPassword')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeSlashIcon className="h-5 w-5" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Código de referido */}
//             <Input
//               label="Código de Referido (opcional)"
//               placeholder="Ingresa el código de quien te invitó"
//               error={errors.referralCode?.message}
//               {...register('referralCode')}
//             />

//             {/* Términos y condiciones */}
//             <div className="space-y-4">
//               <div className="flex items-start">
//                 <input
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                   {...register('acceptTerms')}
//                 />
//                 <label className="ml-2 text-sm text-gray-600">
//                   Acepto los{' '}
//                   <Link to="/terms" className="text-primary-600 hover:text-primary-500" target="_blank">
//                     términos y condiciones
//                   </Link>
//                 </label>
//               </div>
//               {errors.acceptTerms && (
//                 <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
//               )}

//               <div className="flex items-start">
//                 <input
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                   {...register('acceptPrivacy')}
//                 />
//                 <label className="ml-2 text-sm text-gray-600">
//                   Acepto la{' '}
//                   <Link to="/privacy" className="text-primary-600 hover:text-primary-500" target="_blank">
//                     política de privacidad
//                   </Link>
//                 </label>
//               </div>
//               {errors.acceptPrivacy && (
//                 <p className="text-sm text-red-600">{errors.acceptPrivacy.message}</p>
//               )}
//             </div>

//             {/* Submit button */}
//             <Button
//               type="submit"
//               disabled={!isValid || isLoading}
//               loading={isLoading}
//               className="w-full"
//             >
//               {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
//             </Button>
//           </form>

//           {/* Login link */}
//           <div className="mt-6 text-center">
//             <span className="text-sm text-gray-600">
//               ¿Ya tienes una cuenta?{' '}
//               <Link to="/login" className="text-primary-600 hover:text-primary-500">
//                 Inicia sesión
//               </Link>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




// src/pages/auth/RegisterPage.tsx - VERSIÓN SIMPLIFICADA QUE FUNCIONA
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useRegisterForm } from '@/hooks/useAuthForm';

// Tipos simplificados
type UserType = 'person' | 'company';

// Hook simplificado para el selector de tipo de usuario
const useUserTypeSelector = () => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  
  return {
    selectedType,
    isValidSelection: !!selectedType,
    handleTypeSelect: setSelectedType
  };
};

// Componente simplificado para selector de tipo de usuario
const UserTypeSelector: React.FC<{
  selectedType: UserType | null;
  onTypeSelect: (type: UserType) => void;
}> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ¿Qué tipo de cuenta necesitas?
        </h2>
        <p className="text-gray-600">
          Selecciona el tipo que mejor describe tu situación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onTypeSelect('person')}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedType === 'person'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Persona Natural
            </h3>
            <p className="text-sm text-gray-600">
              Para usuarios individuales que quieren reciclar sus dispositivos electrónicos
            </p>
          </div>
        </div>

        <div
          onClick={() => onTypeSelect('company')}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedType === 'company'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Empresa
            </h3>
            <p className="text-sm text-gray-600">
              Para empresas u organizaciones que manejan residuos electrónicos a mayor escala
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { onSubmit, isLoading, error, success, clearError, clearSuccess } = useRegisterForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'type' | 'form'>('type');
  
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    identificationNumber: '',
    identificationType: '',
    dateOfBirth: '',
    companyName: '',
    legalName: '',
    taxId: '',
    industry: '',
    companySize: '',
    legalRepFirstName: '',
    legalRepLastName: '',
    legalRepPosition: '',
    legalRepPhone: '',
    legalRepEmail: '',
    legalRepId: '',
    businessStreet: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessCountry: 'Ecuador',
    referralCode: searchParams.get('ref') || '',
  });
  
  // Estados para checkboxes
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  
  // Estado para errores locales
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { selectedType, isValidSelection, handleTypeSelect } = useUserTypeSelector();

  // Función para actualizar campos del formulario
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validaciones básicas
  const validateForm = () => {
    if (!formData.email) {
      setLocalError('El email es requerido');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setLocalError('Ingresa un email válido');
      return false;
    }
    
    if (!formData.password) {
      setLocalError('La contraseña es requerida');
      return false;
    }
    
    if (formData.password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return false;
    }
    
    if (!acceptTerms) {
      setLocalError('Debes aceptar los términos y condiciones para continuar');
      return false;
    }
    
    if (!acceptPrivacy) {
      setLocalError('Debes aceptar la política de privacidad para continuar');
      return false;
    }
    
    // Validaciones específicas por tipo
    if (selectedType === 'person') {
      if (!formData.firstName) {
        setLocalError('El nombre es requerido');
        return false;
      }
      if (!formData.lastName) {
        setLocalError('El apellido es requerido');
        return false;
      }
    }
    
    if (selectedType === 'company') {
      if (!formData.companyName) {
        setLocalError('El nombre de la empresa es requerido');
        return false;
      }
      if (!formData.taxId) {
        setLocalError('El RUC es requerido');
        return false;
      }
    }
    
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) return;
    
    console.log('=== DEBUGGING FORMULARIO ===');
    console.log('Términos aceptados:', acceptTerms);
    console.log('Privacidad aceptada:', acceptPrivacy);
    console.log('Datos del formulario:', formData);
    
    // Limpiar errores
    setLocalError(null);
    clearError();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    // Preparar datos para envío
    const allowedTypes = ['cedula', 'passport', 'license'] as const;
    const identificationTypeValue = allowedTypes.includes(formData.identificationType as any)
      ? (formData.identificationType as 'cedula' | 'passport' | 'license')
      : undefined;

    const allowedCompanySizes = ['small', 'medium', 'large', 'enterprise'] as const;
    const companySizeValue = allowedCompanySizes.includes(formData.companySize as any)
      ? (formData.companySize as 'small' | 'medium' | 'large' | 'enterprise')
      : undefined;

    const dataToSend = {
      ...formData,
      identificationType: identificationTypeValue,
      companySize: companySizeValue,
      userType: selectedType,
      acceptTerms: acceptTerms,
      acceptPrivacy: acceptPrivacy,
    };

    console.log('Datos finales para envío:', dataToSend);

    await onSubmit(dataToSend);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 'type' 
            ? 'bg-primary-600 text-white' 
            : isValidSelection 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-600'
        }`}>
          1
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700">Tipo de cuenta</span>
      </div>
      
      <div className={`w-8 h-0.5 ${isValidSelection ? 'bg-primary-600' : 'bg-gray-200'}`} />
      
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep === 'form' && isValidSelection
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}>
          2
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700">Información</span>
      </div>
    </div>
  );

  // Opciones para selects
  const identificationTypes = [
    { value: '', label: 'Selecciona...' },
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'license', label: 'Licencia de Conducir' }
  ];

  const companySizes = [
    { value: '', label: 'Selecciona...' },
    { value: 'small', label: 'Pequeña (1-10 empleados)' },
    { value: 'medium', label: 'Mediana (11-50 empleados)' },
    { value: 'large', label: 'Grande (51-200 empleados)' },
    { value: 'enterprise', label: 'Corporación (200+ empleados)' }
  ];

  const industries = [
    { value: '', label: 'Selecciona...' },
    { value: 'technology', label: 'Tecnología' },
    { value: 'manufacturing', label: 'Manufactura' },
    { value: 'retail', label: 'Retail' },
    { value: 'healthcare', label: 'Salud' },
    { value: 'education', label: 'Educación' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'government', label: 'Gobierno' },
    { value: 'nonprofit', label: 'Sin fines de lucro' },
    { value: 'other', label: 'Otro' }
  ];

  if (currentStep === 'type') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
            <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
          </div>

          {renderStepIndicator()}
          
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <UserTypeSelector
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
            />
            
            {isValidSelection && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setCurrentStep('form')}
                  className="px-8 py-2"
                >
                  Continuar
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500">
                  Inicia sesión
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
          <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
        </div>

        {renderStepIndicator()}
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <button
              onClick={() => setCurrentStep('type')}
              className="text-sm text-primary-600 hover:text-primary-500 mb-4"
            >
              ← Cambiar tipo de cuenta
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedType === 'person' ? 'Registro Personal' : 'Registro Empresarial'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {selectedType === 'person' 
                ? 'Completa tu información personal'
                : 'Completa la información de tu empresa'
              }
            </p>
          </div>

          {/* Mensajes de error/éxito */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-red-600 text-sm">{error || localError}</p>
                <button
                  onClick={() => {
                    clearError();
                    setLocalError(null);
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-green-600 text-sm">{success}</p>
                <button
                  onClick={clearSuccess}
                  className="text-green-400 hover:text-green-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {selectedType === 'person' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Identificación (opcional)
                    </label>
                    <select
                      value={formData.identificationType}
                      onChange={(e) => updateFormData('identificationType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {identificationTypes.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Identificación (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.identificationNumber}
                      onChange={(e) => updateFormData('identificationNumber', e.target.value)}
                      placeholder="Ej: 1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+593 99 999 9999"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento (opcional)
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Comercial *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUC / Tax ID *
                    </label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateFormData('taxId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Credenciales */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Credenciales de Acceso
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Código de referido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Referido (opcional)
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => updateFormData('referralCode', e.target.value)}
                placeholder="Ingresa el código de quien te invitó"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Términos y condiciones */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500" target="_blank">
                    términos y condiciones
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto la{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500" target="_blank">
                    política de privacidad
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading || !acceptTerms || !acceptPrivacy}
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500">
                Inicia sesión
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};