import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button, Input, Alert, Card, CardContent } from '@/components/ui';
import { GoogleSignInButton } from '@/components/auth/GoogleLoginButton';
import { useLoginForm } from '@/hooks/useAuthForm';
import { env } from '@/utils/env';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit, isLoading, error, clearError } = useLoginForm();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Accede a tu cuenta para continuar
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

          {/* Google OAuth Button */}
          {env.ENABLE_OAUTH && env.GOOGLE_CLIENT_ID && (
            <div className="mb-6">
              <GoogleSignInButton 
                disabled={isLoading}
              />

              {/* Divider */}
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
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
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Recordarme
                </span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};