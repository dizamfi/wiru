import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button, Input, Alert, Card, CardContent } from '@/components/ui';
import { useForgotPasswordForm } from '@/hooks/useAuthForm';

export const ForgotPasswordPage: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const { form, onSubmit, isLoading, error, clearError } = useForgotPasswordForm();

  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const email = watch('email');

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    if (!error) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-success-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-success-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Enviado
            </h2>
            
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de recuperación a{' '}
              <span className="font-medium">{email}</span>
            </p>

            <div className="space-y-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setEmailSent(false)}
              >
                Enviar a otro email
              </Button>
              
              <Link to="/login">
                <Button variant="ghost" fullWidth>
                  Volver al login
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
              <button 
                onClick={() => setEmailSent(false)}
                className="text-primary-600 hover:text-primary-500 underline"
              >
                intenta de nuevo
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="p-8">
          {/* Back Button */}
          <Link 
            to="/login"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Volver al login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recuperar Contraseña
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tu email para recibir un enlace de recuperación
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

          {/* Form */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              leftIcon={<EnvelopeIcon className="h-4 w-4" />}
              autoComplete="email"
              autoFocus
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Enviar Enlace de Recuperación
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{' '}
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