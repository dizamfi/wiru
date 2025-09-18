// src/pages/auth/elite/EliteVerifyEmailPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Hooks
import { useAuth } from "@/hooks/useAuth";

// Tipos de estado
type VerificationState = 'verifying' | 'success' | 'error' | 'expired' | 'invalid';

// Schema para reenvío de verificación
const resendSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});

type ResendFormData = z.infer<typeof resendSchema>;

export const EliteVerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  // Estados
  const [state, setState] = useState<VerificationState>('verifying');
  const [message, setMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Refs para evitar llamadas duplicadas
  const hasVerified = useRef(false);
  const isVerifying = useRef(false);

  // Obtener token y email de la URL
  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  // Configurar formulario para reenvío
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: emailFromUrl || userEmail || '',
    },
  });

  // Countdown timer para reenvío
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Función principal de verificación
  useEffect(() => {
    const performVerification = async () => {
      // Verificar si ya se ha procesado este token o si ya está en proceso
      if (!token || hasVerified.current || isVerifying.current) {
        if (!token) {
          setState('invalid');
          setMessage('Token de verificación no encontrado en la URL');
        }
        return;
      }

      // Marcar como "en proceso" para evitar llamadas duplicadas
      isVerifying.current = true;

      try {
        console.log('🔍 Verificando email con token:', token.substring(0, 10) + '...');
        
        await verifyEmail(token);
        
        // Marcar como procesado exitosamente
        hasVerified.current = true;
        setState('success');
        setMessage('¡Email verificado exitosamente!');
        
        // Mostrar toast de éxito
        toast.success('¡Email verificado exitosamente!');
        
        // Auto-redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/auth/login', { 
            replace: true,
            state: {
              message: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
            }
          });
        }, 3000);
        
      } catch (error: any) {
        console.error('❌ Error al verificar email:', error);
        
        // Manejar diferentes tipos de errores
        if (error.message.includes('expirado')) {
          setState('expired');
          setMessage('El enlace de verificación ha expirado');
        } else if (error.message.includes('inválido') || error.message.includes('utilizado')) {
          setState('invalid');
          setMessage('El enlace de verificación es inválido o ya ha sido utilizado');
        } else {
          setState('error');
          setMessage(error.message || 'Error al verificar el email');
        }
        
        // Mostrar toast de error
        toast.error(error.message || 'Error al verificar el email');
      } finally {
        // Marcar como no "en proceso"
        isVerifying.current = false;
      }
    };

    // Solo ejecutar si tenemos un token y no se ha verificado antes
    if (token && !hasVerified.current) {
      performVerification();
    }
  }, [token, navigate, verifyEmail]);

  // Actualizar email en el formulario cuando cambie
  useEffect(() => {
    if (emailFromUrl) {
      setUserEmail(emailFromUrl);
      setValue('email', emailFromUrl);
    }
  }, [emailFromUrl, setValue]);

  // Manejar reenvío de verificación
  const handleResendVerification = async (data: ResendFormData) => {
    if (countdown > 0) return;

    setIsResending(true);
    
    try {
      await resendVerification(data.email);
      
      toast.success('Nuevo email de verificación enviado');
      setMessage('Se ha enviado un nuevo email de verificación a tu bandeja de entrada');
      setCountdown(60); // 60 segundos antes de poder reenviar de nuevo
      setUserEmail(data.email);
      
    } catch (error: any) {
      toast.error(error.message || 'Error al reenviar verificación');
    } finally {
      setIsResending(false);
    }
  };

  // Layout común
  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full flex justify-between items-center p-6 md:p-8">
        <Link
          to="/auth/login"
          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Volver al login</span>
        </Link>

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
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="transition-all duration-300 hover:scale-105">
              <img src="/assets/logo.svg" alt="Wiru Logo" className="w-20 h-20" />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );

  // Estado: Verificando
  if (state === 'verifying') {
    return (
      <Layout>
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Verificando tu email...
          </h1>
          <p className="text-gray-600 text-lg">
            Por favor espera mientras verificamos tu dirección de email
          </p>
        </div>

        {/* Loading Info */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                Estamos procesando tu verificación. Esto puede tomar unos segundos...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Estado: Verificación exitosa
  if (state === 'success') {
    return (
      <Layout>
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-[#a8c241]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-12 h-12 text-[#a8c241]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ¡Email verificado exitosamente!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Tu cuenta ha sido activada correctamente y ya puedes acceder a todas las funcionalidades de Wiru
          </p>
        </div>

        {/* Success Details */}
        <div className="bg-[#a8c241]/5 rounded-xl p-6 border border-[#a8c241]/20 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-6 h-6 text-[#a8c241] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">
                ¡Bienvenido a la comunidad Wiru! 🎉
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#a8c241] rounded-full"></div>
                  <span>Tu email ha sido verificado correctamente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#a8c241] rounded-full"></div>
                  <span>Cuenta activada y lista para usar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#a8c241] rounded-full"></div>
                  <span>Acceso completo a la plataforma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-8">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-3">
                ¿Qué puedes hacer ahora?
              </h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Inicia sesión en tu cuenta</p>
                    <p className="text-blue-600">Accede a tu dashboard personalizado</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Completa tu perfil</p>
                    <p className="text-blue-600">Agrega información adicional para mejores precios</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Empieza a reciclar</p>
                    <p className="text-blue-600">Crea tu primera orden y empieza a ganar dinero</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-gradient-to-r from-[#a8c241]/5 to-[#719428]/5 rounded-xl p-6 border border-[#a8c241]/20 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">
            Descubre lo que puedes hacer en Wiru
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#a8c241]/20 rounded-lg flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-[#a8c241]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Vende dispositivos electrónicos</p>
                <p className="text-gray-600 text-xs">Obtén dinero por tus dispositivos usados</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#a8c241]/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-[#a8c241]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Seguimiento de órdenes</p>
                <p className="text-gray-600 text-xs">Rastrea tus ventas en tiempo real</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#a8c241]/20 rounded-lg flex items-center justify-center">
                <ArrowPathIcon className="w-5 h-5 text-[#a8c241]" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Impacto ambiental</p>
                <p className="text-gray-600 text-xs">Ve cuánto ayudas al medio ambiente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto redirect info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <ClockIcon className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-blue-700">
              Serás redirigido automáticamente al login en unos segundos...
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <Link
            to="/auth/login"
            className="block w-full py-4 px-6 bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold rounded-full transition-all duration-200 hover:scale-[1.02] text-center text-lg"
          >
            Iniciar sesión ahora
          </Link>
          
          <Link
            to="/how-it-works"
            className="block w-full py-3 px-6 border-2 border-[#a8c241] text-[#a8c241] font-semibold rounded-full transition-all duration-200 hover:bg-[#a8c241] hover:text-white hover:scale-[1.02] text-center"
          >
            Aprende cómo funciona
          </Link>
        </div>

        {/* Footer Help */}
        <div className="text-center text-sm text-gray-500">
          <p>
            ¿Necesitas ayuda para empezar?{" "}
            <Link
              to="/contact"
              className="text-[#a8c241] hover:text-[#8ea635] font-medium"
            >
              Contacta nuestro soporte
            </Link>
          </p>
        </div>
      </Layout>
    );
  }

  // Estados de error: expired, invalid, error
  if (state === 'expired' || state === 'invalid' || state === 'error') {
    const errorConfig = {
      expired: {
        icon: ClockIcon,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        title: 'Enlace expirado',
        subtitle: 'El enlace de verificación ha expirado',
      },
      invalid: {
        icon: XCircleIcon,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Enlace inválido',
        subtitle: 'El enlace de verificación no es válido',
      },
      error: {
        icon: ExclamationTriangleIcon,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        title: 'Error de verificación',
        subtitle: 'No se pudo verificar tu email',
      },
    };

    const config = errorConfig[state];
    const IconComponent = config.icon;

    return (
      <Layout>
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}>
            <IconComponent className={`w-8 h-8 ${config.color}`} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {config.title}
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            {config.subtitle}
          </p>
          {message && (
            <p className="text-sm text-gray-500">
              {message}
            </p>
          )}
        </div>

        {/* Error Info */}
        <div className={`${config.bgColor} rounded-xl p-6 ${config.borderColor} border mb-8`}>
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
            <div>
              <p className="font-medium text-gray-900 mb-2">
                Posibles causas:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• El enlace ha expirado (válido por 24 horas)</li>
                <li>• El enlace ya fue utilizado anteriormente</li>
                <li>• El enlace está incompleto o dañado</li>
                <li>• Tu email ya está verificado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resend Form */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Solicitar nuevo enlace
          </h3>
          
          <form onSubmit={handleSubmit(handleResendVerification)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <EnvelopeIcon className="inline w-4 h-4 mr-2" />
                Correo electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-[#a8c241] focus:outline-none hover:border-gray-400 transition-colors"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isResending || countdown > 0}
              className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Enviando...</span>
                </>
              ) : countdown > 0 ? (
                <>
                  <ClockIcon className="h-5 w-5" />
                  <span>Reenviar en {countdown}s</span>
                </>
              ) : (
                <>
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>Enviar nuevo enlace</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success message for resend */}
        {message && state === 'error' && message.includes('enviado') && (
          <div className="bg-[#a8c241]/5 rounded-xl p-4 border border-[#a8c241]/20 mb-8">
            <p className="text-sm text-[#a8c241] text-center font-medium">
              {message}
            </p>
          </div>
        )}

        {/* Alternative Actions */}
        <div className="space-y-4">
          <Link
            to="/auth/login"
            className="block w-full py-3 px-4 border-2 border-[#a8c241] text-[#a8c241] font-semibold rounded-full transition-all duration-200 hover:bg-[#a8c241] hover:text-white hover:scale-[1.02] text-center"
          >
            Volver al login
          </Link>

          <Link
            to="/auth/register"
            className="block w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full transition-all duration-200 hover:border-gray-400 hover:scale-[1.02] text-center"
          >
            Crear nueva cuenta
          </Link>
        </div>

        {/* Help Info */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                <strong>¿Sigues teniendo problemas?</strong> Contacta a nuestro soporte y te ayudaremos a verificar tu cuenta manualmente.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Fallback (nunca debería llegar aquí)
  return null;
};