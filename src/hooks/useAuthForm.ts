import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type ChangePasswordFormData,
} from '@/utils/validations';
import React from 'react';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [searchParams] = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data);
    
    if (success) {
      // Redirigir a la página deseada o dashboard
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      referralCode: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const { acceptTerms, ...registerData } = data;
    
    const success = await register(registerData);
    
    if (success) {
      navigate('/verify-email', { 
        state: { email: data.email },
        replace: true 
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
  };
};

export const useForgotPasswordForm = () => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [emailSent, setEmailSent] = React.useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    const success = await resetPassword(data);
    if (success) {
      setEmailSent(true);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    clearError,
    emailSent,
    setEmailSent,
  };
};

export const useChangePasswordForm = () => {
  const { isLoading } = useAuth();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError('');
    setSuccess(false);
    
    try {
      // Aquí iría la llamada a la API para cambiar contraseña
      // await apiService.post('/auth/change-password', data);
      
      setSuccess(true);
      form.reset();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    success,
    clearError: () => setError(''),
  };
};