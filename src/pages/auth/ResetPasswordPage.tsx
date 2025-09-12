import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

// Schema de validación
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Debe contener al menos una minúscula, una mayúscula y un número'
    ),
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const { resetPassword, isLoading } = useAuth();

  // Obtener token de la URL
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Validar que existe el token
    if (!token) {
      setTokenError('Token de restablecimiento no encontrado en la URL');
      return;
    }

    // El token se validará en el servidor cuando se envíe el formulario
    setTokenValidated(true);
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Token de restablecimiento no válido');
      return;
    }

    try {
      await resetPassword(token, data.password);
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  // Validador de fortaleza de contraseña
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { strength: score, label: 'Débil', color: 'text-red-600' };
    if (score <= 3) return { strength: score, label: 'Regular', color: 'text-yellow-600' };
    if (score <= 4) return { strength: score, label: 'Buena', color: 'text-blue-600' };
    return { strength: score, label: 'Muy fuerte', color: 'text-green-600' };
  };

  // Si hay error con el token, mostrar página de error
  if (tokenError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Enlace no válido
              </h2>
              
              <p className="text-gray-600 mb-6">
                {tokenError}
              </p>

              <div className="space-y-4">
                <Link to="/forgot-password">
                  <Button className="w-full bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90">
                    Solicitar nuevo enlace
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    Volver al login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Establece una contraseña segura para tu cuenta
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Nueva Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
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

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar nueva contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repite tu nueva contraseña"
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a8c241] focus:border-[#a8c241] sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Requisitos de contraseña */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2">
                Tu nueva contraseña debe tener:
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Al menos 8 caracteres</li>
                <li>• Una letra minúscula (a-z)</li>
                <li>• Una letra mayúscula (A-Z)</li>
                <li>• Un número (0-9)</li>
              </ul>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !tokenValidated}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#D0FF5B] hover:bg-[#D0FF5B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a8c241] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Actualizando contraseña...
                  </div>
                ) : (
                  'Restablecer Contraseña'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-[#a8c241] hover:text-[#719428] transition-colors"
              >
                ¿Recordaste tu contraseña? Inicia sesión
              </Link>
            </div>
          </div>
        </div>

        {/* Debug Info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && token && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Debug Info:</strong><br />
              Token: {token.substring(0, 20)}...<br />
              Token válido: {tokenValidated ? 'Sí' : 'No'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};