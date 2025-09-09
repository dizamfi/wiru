// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useAuth } from './useAuth';
// import {
//   loginSchema,
//   registerSchema,
//   forgotPasswordSchema,
//   resetPasswordSchema,
//   changePasswordSchema,
//   type LoginFormData,
//   type RegisterFormData,
//   type ForgotPasswordFormData,
//   type ResetPasswordFormData,
//   type ChangePasswordFormData,
// } from '@/utils/validations';
// import React from 'react';

// export const useLoginForm = () => {
//   const navigate = useNavigate();
//   const { login, isLoading, error, clearError } = useAuth();
//   const [searchParams] = useSearchParams();

//   const form = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     clearError();
//     const success = await login(data);
    
//     if (success) {
//       // Redirigir a la página deseada o dashboard
//       const redirectTo = searchParams.get('redirect') || '/dashboard';
//       navigate(redirectTo, { replace: true });
//     }
//   };

//   return {
//     form,
//     onSubmit: form.handleSubmit(onSubmit),
//     isLoading,
//     error,
//     clearError,
//   };
// };

// export const useRegisterForm = () => {
//   const navigate = useNavigate();
//   const { register, isLoading, error, clearError } = useAuth();

//   const form = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       phone: '',
//       referralCode: '',
//       acceptTerms: false,
//     },
//   });

//   const onSubmit = async (data: RegisterFormData) => {
//     clearError();
//     const { acceptTerms, ...registerData } = data;
    
//     const success = await register(registerData);
    
//     if (success) {
//       navigate('/verify-email', { 
//         state: { email: data.email },
//         replace: true 
//       });
//     }
//   };

//   return {
//     form,
//     onSubmit: form.handleSubmit(onSubmit),
//     isLoading,
//     error,
//     clearError,
//   };
// };

// export const useForgotPasswordForm = () => {
//   const { resetPassword, isLoading, error, clearError } = useAuth();
//   const [emailSent, setEmailSent] = React.useState(false);

//   const form = useForm<ForgotPasswordFormData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: '',
//     },
//   });

//   const onSubmit = async (data: ForgotPasswordFormData) => {
//     clearError();
//     const success = await resetPassword(data);
//     if (success) {
//       setEmailSent(true);
//     }
//   };

//   return {
//     form,
//     onSubmit: form.handleSubmit(onSubmit),
//     isLoading,
//     error,
//     clearError,
//     emailSent,
//     setEmailSent,
//   };
// };

// export const useChangePasswordForm = () => {
//   const { isLoading } = useAuth();
//   const [error, setError] = React.useState('');
//   const [success, setSuccess] = React.useState(false);

//   const form = useForm<ChangePasswordFormData>({
//     resolver: zodResolver(changePasswordSchema),
//     defaultValues: {
//       currentPassword: '',
//       newPassword: '',
//       confirmNewPassword: '',
//     },
//   });

//   const onSubmit = async (data: ChangePasswordFormData) => {
//     setError('');
//     setSuccess(false);
    
//     try {
//       // Aquí iría la llamada a la API para cambiar contraseña
//       // await apiService.post('/auth/change-password', data);
      
//       setSuccess(true);
//       form.reset();
//     } catch (error: any) {
//       setError(error.response?.data?.message || 'Error al cambiar la contraseña');
//     }
//   };

//   return {
//     form,
//     onSubmit: form.handleSubmit(onSubmit),
//     isLoading,
//     error,
//     success,
//     clearError: () => setError(''),
//   };
// };





// src/hooks/useAuthForm.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/authService';


export interface RegisterFormData {
  // Campos base
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  referralCode?: string;
  userType: 'person' | 'company';
  
  // Campos de términos
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  
  // Campos de persona
  identificationNumber?: string;
  identificationType?: 'cedula' | 'passport' | 'license';
  dateOfBirth?: string;
  
  // Campos de empresa
  companyName?: string;
  legalName?: string;
  taxId?: string;
  industry?: string;
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Representante legal
  legalRepFirstName?: string;
  legalRepLastName?: string;
  legalRepPosition?: string;
  legalRepPhone?: string;
  legalRepEmail?: string;
  legalRepId?: string;
  
  // Dirección comercial
  businessStreet?: string;
  businessCity?: string;
  businessState?: string;
  businessZipCode?: string;
  businessCountry?: string;
}


export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Intentando login...');
      
      // // Guardar tokens y usuario
      // authService.saveTokens(
      //   response.data.accessToken,
      //   response.data.refreshToken,
      //   response.data.user
      // );

      console.log('✅ Login exitoso, redirigiendo...');
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    onSubmit,
    isLoading,
    error,
    clearError,
  };
};

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    console.log('🚀 Datos del formulario recibidos:', data);

    // Validaciones del frontend
    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (!data.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setIsLoading(false);
      return;
    }

    if (!data.acceptPrivacy) {
      setError('Debes aceptar la política de privacidad');
      setIsLoading(false);
      return;
    }

    // Validaciones específicas por tipo de usuario
    if (data.userType === 'company') {
      if (!data.companyName && !data.legalName) {
        setError('El nombre de la empresa es requerido');
        setIsLoading(false);
        return;
      }

      if (!data.taxId) {
        setError('El RUC/Tax ID es requerido para empresas');
        setIsLoading(false);
        return;
      }
    }

    try {
      console.log('📤 Enviando datos de registro...');
      
      const response = await AuthService.register(data);
      
      console.log('✅ Respuesta del servidor:', response);
      
      setSuccess(response.message || 'Cuenta creada exitosamente');
      
      // Redirigir a login después de 3 segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.',
            email: data.email
          }
        });
      }, 3000);

    } catch (err: any) {
      console.error('❌ Error en registro:', err);
      const errorMessage = err.message || 'Error desconocido al registrar usuario';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return {
    onSubmit,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};




export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export const useForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    console.log('🔐 Solicitando restablecimiento de contraseña para:', data.email);

    try {
      // const response = await authService.forgotPassword(data.email);

      // console.log('✅ Solicitud enviada exitosamente:', response);
      
      setSuccess(
        `Se ha enviado un enlace de restablecimiento a ${data.email}. Revisa tu bandeja de entrada y carpeta de spam.`
      );
      
      // Opcional: redirigir después de unos segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Revisa tu email para restablecer tu contraseña.',
            email: data.email
          }
        });
      }, 5000);

    } catch (err: any) {
      console.error('❌ Error al solicitar restablecimiento:', err);
      const errorMessage = err.message || 'Error al enviar el enlace de restablecimiento';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return {
    onSubmit,
    isLoading,
    error,
    success,
    clearError,
    clearSuccess,
  };
};


