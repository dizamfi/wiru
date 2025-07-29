import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  GiftIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';
import { Button, Input, Alert, Card, CardContent } from '@/components/ui';
import { useRegisterForm } from '@/hooks/useAuthForm';
import { env } from '@/utils/env';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { form, onSubmit, isLoading, error, clearError } = useRegisterForm();

  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const password = watch('password');

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Crear Cuenta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Únete y comienza a reciclar hoy mismo
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert 
              variant="danger" 
              className="mb-6"
              dismissible
              onDismiss={clearError}
            >
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                label="Nombre"
                placeholder="Juan"
                error={errors.firstName?.message}
                leftIcon={<UserIcon className="h-4 w-4" />}
                autoComplete="given-name"
                required
              />
              
              <Input
                {...register('lastName')}
                label="Apellido"
                placeholder="Pérez"
                error={errors.lastName?.message}
                autoComplete="family-name"
                required
              />
            </div>

            {/* Email */}
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              leftIcon={<EnvelopeIcon className="h-4 w-4" />}
              autoComplete="email"
              required
            />

            {/* Teléfono */}
            <Input
              {...register('phone')}
              type="tel"
              label="Teléfono"
              placeholder="+57 300 123 4567"
              error={errors.phone?.message}
              leftIcon={<PhoneIcon className="h-4 w-4" />}
              autoComplete="tel"
              helperText="Opcional - Para notificaciones de recolección"
            />

            {/* Contraseña */}
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              }
              autoComplete="new-password"
              helperText="Mínimo 6 caracteres"
              required
            />

            {/* Confirmar Contraseña */}
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar Contraseña"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              }
              autoComplete="new-password"
              required
            />

            {/* Código de Referido */}
            {env.ENABLE_REFERRALS && (
              <Input
                {...register('referralCode')}
                label="Código de Referido"
                placeholder="ABC123"
                error={errors.referralCode?.message}
                leftIcon={<GiftIcon className="h-4 w-4" />}
                helperText="Opcional - Ingresa el código de quien te invitó"
              />
            )}

            {/* Términos y Condiciones */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">
                  Acepto los{' '}
                  <Link 
                    to="/terms" 
                    className="text-primary-600 hover:text-primary-500 underline"
                    target="_blank"
                  >
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link 
                    to="/privacy" 
                    className="text-primary-600 hover:text-primary-500 underline"
                    target="_blank"
                  >
                    política de privacidad
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-danger-600">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              className="mt-6"
            >
              Crear Cuenta
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};