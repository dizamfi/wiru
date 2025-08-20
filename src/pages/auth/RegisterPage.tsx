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






// src/pages/auth/RegisterPage.tsx - Completo
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { UserTypeSelector, useUserTypeSelector } from '@/components/auth/UserTypeSelector';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types/user';
import { toast } from '@/hooks/useToast';

// Esquemas de validación
const baseSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, 'Debes aceptar los términos y condiciones'),
  acceptPrivacy: z.boolean().refine(val => val, 'Debes aceptar la política de privacidad'),
  referralCode: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

const personSchema = baseSchema.extend({
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos').optional(),
  identificationNumber: z.string().min(8, 'Número de identificación inválido'),
  identificationType: z.enum(['cedula', 'passport', 'license'], {
    required_error: 'Selecciona un tipo de identificación'
  }),
  dateOfBirth: z.string().optional()
});

const companySchema = baseSchema.extend({
  companyName: z.string().min(2, 'Nombre de empresa requerido'),
  legalName: z.string().min(2, 'Razón social requerida'),
  taxId: z.string().min(8, 'RUC o identificación fiscal requerida'),
  industry: z.string().min(2, 'Industria requerida'),
  companySize: z.enum(['small', 'medium', 'large', 'enterprise'], {
    required_error: 'Selecciona el tamaño de la empresa'
  }),
  // Representante legal
  legalRepFirstName: z.string().min(2, 'Nombre del representante legal requerido'),
  legalRepLastName: z.string().min(2, 'Apellido del representante legal requerido'),
  legalRepPosition: z.string().min(2, 'Cargo del representante legal requerido'),
  legalRepPhone: z.string().min(10, 'Teléfono del representante legal requerido'),
  legalRepEmail: z.string().email('Email del representante legal inválido'),
  legalRepId: z.string().min(8, 'Identificación del representante legal requerida'),
  // Dirección comercial
  businessStreet: z.string().min(5, 'Dirección comercial requerida'),
  businessCity: z.string().min(2, 'Ciudad requerida'),
  businessState: z.string().min(2, 'Estado/Provincia requerida'),
  businessZipCode: z.string().min(5, 'Código postal requerido'),
  businessCountry: z.string().default('Ecuador')
});

type PersonFormData = z.infer<typeof personSchema>;
type CompanyFormData = z.infer<typeof companySchema>;
type FormData = PersonFormData | CompanyFormData;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser, loginWithGoogle, loginWithFacebook } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'type' | 'form'>('type');
  const [isLoading, setIsLoading] = useState(false);
  
  const { selectedType, isValidSelection, handleTypeSelect } = useUserTypeSelector();
  
  // Obtener código de referido de URL si existe
  const referralCode = searchParams.get('ref') || '';

  // Determinar esquema y tipo de form basado en el tipo de usuario
  const schema = selectedType === 'person' ? personSchema : companySchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      referralCode: referralCode,
      acceptTerms: false,
      acceptPrivacy: false,
      businessCountry: 'Ecuador'
    }
  });

  // Pre-llenar código de referido si viene en URL
  React.useEffect(() => {
    if (referralCode) {
      setValue('referralCode', referralCode);
    }
  }, [referralCode, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!selectedType) return;
    
    setIsLoading(true);
    try {
      await registerUser({
        ...data,
        userType: selectedType
      });
      
      toast({
        title: 'Registro exitoso',
        description: 'Revisa tu email para verificar tu cuenta',
        variant: 'success'
      });
      
      navigate('/verify-email');
    } catch (error) {
      toast({
        title: 'Error en registro',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (!selectedType) {
      toast({
        title: 'Selecciona tipo de cuenta',
        description: 'Primero debes seleccionar si eres persona o empresa',
        variant: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle({ userType: selectedType, referralCode });
      } else {
        await loginWithFacebook({ userType: selectedType, referralCode });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error en login social',
        description: 'No se pudo completar el registro',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
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
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'license', label: 'Licencia de Conducir' }
  ];

  const companySizes = [
    { value: 'small', label: 'Pequeña (1-10 empleados)' },
    { value: 'medium', label: 'Mediana (11-50 empleados)' },
    { value: 'large', label: 'Grande (51-200 empleados)' },
    { value: 'enterprise', label: 'Corporación (200+ empleados)' }
  ];

  const industries = [
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
        {renderStepIndicator()}
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Header */}
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

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full"
            >
              <GoogleIcon className="h-5 w-5 mr-2" />
              Continuar con Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="w-full"
            >
              <FacebookIcon className="h-5 w-5 mr-2" />
              Continuar con Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {selectedType === 'person' ? (
              // Formulario para personas
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <Input
                    label="Apellido"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Tipo de Identificación"
                    options={identificationTypes}
                    error={errors.identificationType?.message}
                    {...register('identificationType')}
                  />
                  <Input
                    label="Número de Identificación"
                    placeholder="Ej: 1234567890"
                    error={errors.identificationNumber?.message}
                    {...register('identificationNumber')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Teléfono (opcional)"
                    type="tel"
                    placeholder="+593 99 999 9999"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Input
                    label="Fecha de Nacimiento (opcional)"
                    type="date"
                    error={errors.dateOfBirth?.message}
                    {...register('dateOfBirth')}
                  />
                </div>
              </>
            ) : (
              // Formulario para empresas
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Comercial"
                    error={errors.companyName?.message}
                    {...register('companyName')}
                  />
                  <Input
                    label="Razón Social"
                    error={errors.legalName?.message}
                    {...register('legalName')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="RUC / Tax ID"
                    error={errors.taxId?.message}
                    {...register('taxId')}
                  />
                  <Select
                    label="Industria"
                    options={industries}
                    error={errors.industry?.message}
                    {...register('industry')}
                  />
                </div>

                <Select
                  label="Tamaño de la Empresa"
                  options={companySizes}
                  error={errors.companySize?.message}
                  {...register('companySize')}
                />
                
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Representante Legal
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Nombre"
                      error={errors.legalRepFirstName?.message}
                      {...register('legalRepFirstName')}
                    />
                    <Input
                      label="Apellido"
                      error={errors.legalRepLastName?.message}
                      {...register('legalRepLastName')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Cargo"
                      error={errors.legalRepPosition?.message}
                      {...register('legalRepPosition')}
                    />
                    <Input
                      label="Identificación"
                      error={errors.legalRepId?.message}
                      {...register('legalRepId')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      error={errors.legalRepEmail?.message}
                      {...register('legalRepEmail')}
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      error={errors.legalRepPhone?.message}
                      {...register('legalRepPhone')}
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Dirección Comercial
                  </h4>
                  
                  <div className="space-y-4">
                    <Input
                      label="Dirección"
                      error={errors.businessStreet?.message}
                      {...register('businessStreet')}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Ciudad"
                        error={errors.businessCity?.message}
                        {...register('businessCity')}
                      />
                      <Input
                        label="Estado/Provincia"
                        error={errors.businessState?.message}
                        {...register('businessState')}
                      />
                      <Input
                        label="Código Postal"
                        error={errors.businessZipCode?.message}
                        {...register('businessZipCode')}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Campos comunes */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Credenciales de Acceso
              </h4>
              
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative mt-4">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  {...register('password')}
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

              <div className="relative mt-4">
                <Input
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
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
            <Input
              label="Código de Referido (opcional)"
              placeholder="Ingresa el código de quien te invitó"
              error={errors.referralCode?.message}
              {...register('referralCode')}
            />

            {/* Términos y condiciones */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  {...register('acceptTerms')}
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500" target="_blank">
                    términos y condiciones
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  {...register('acceptPrivacy')}
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto la{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500" target="_blank">
                    política de privacidad
                  </Link>
                </label>
              </div>
              {errors.acceptPrivacy && (
                <p className="text-sm text-red-600">{errors.acceptPrivacy.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={!isValid || isLoading}
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