// src/pages/auth/elite/EliteForgotPasswordPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Hooks
import { useAuth } from "@/hooks/useAuth";

// Validation Schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const EliteForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string>("");

  // Configurar formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Manejar envío del formulario
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Solicitando recuperación de contraseña para:", data.email);

      // Llamar al servicio de forgot password
      await forgotPassword(data.email);

      // Guardar email para mostrar en confirmación
      setSentEmail(data.email);
      setEmailSent(true);

      toast.success("Email de recuperación enviado correctamente");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err?.message || "Error al enviar el email. Intenta nuevamente."
      );
      toast.error("Error al enviar el email de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reintentar
  const handleRetry = () => {
    setEmailSent(false);
    setError(null);
    setSentEmail("");
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
          <div className="flex justify-center ">
                     <Link to="/" className="transition-all duration-300 hover:scale-105">
                       <img
                         src="/assets/logo.svg"
                         alt="Wiru Logo"
                         className="w-28 h-28"
                       />
                     </Link>
                   </div>

          {children}
        </div>
      </div>
    </div>
  );

  // Estado: Email enviado exitosamente
  if (emailSent) {
    return (
      <Layout>
        <div className="text-center mb-8">
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            ¡Email enviado!
          </h1>
          <p className="text-gray-600 text-lg">
            Hemos enviado las instrucciones para recuperar tu contraseña
          </p>
        </div>

        {/* Email Info */}
        <div className="bg-[#a8c241]/5 rounded-xl p-4 border border-[#a8c241]/20 mb-8">
          <div className="flex items-start space-x-3">
            <EnvelopeIcon className="w-5 h-5 text-[#a8c241] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-1">
                Email enviado a:
              </p>
              <p className="text-gray-600 break-all">{sentEmail}</p>
            </div>
          </div>
        </div>

        

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleRetry}
            className="w-full py-3 px-4 border-2 border-[#a8c241] text-[#a8c241] font-semibold rounded-full transition-all duration-200 hover:bg-[#a8c241] hover:text-white hover:scale-[1.02]"
          >
            Enviar otro email
          </button>

          <Link
            to="/auth/login"
            className="block w-full py-3 px-4 bg-[#a8c241] hover:bg-[#9bb73d] text-white font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] text-center"
          >
            Volver al login
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm mb-8 text-gray-500">
          <p>
            ¿Problemas para recibir el email?{" "}
            <Link
              to="/contact"
              className="text-[#a8c241] hover:text-[#8ea635] font-medium"
            >
              Contacta soporte
            </Link>
          </p>
        </div>
      </Layout>
    );
  }

  // Estado: Formulario para solicitar recuperación
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Recuperar contraseña
        </h1>
        <p className="text-gray-600 text-lg">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error al enviar email</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            <EnvelopeIcon className="inline w-4 h-4 mr-2" />
            Correo electrónico
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            autoFocus
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-[#a8c241] focus:outline-none hover:border-gray-400 transition-colors"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Te enviaremos un enlace a este email para restablecer tu contraseña
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-4 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <EnvelopeIcon className="h-5 w-5" />
              <span>Enviar enlace de recuperación</span>
            </>
          )}
        </button>
      </form>

      

      {/* Footer Links */}
      <div className="text-center text-sm text-gray-600 space-y-2 mb-8">
        <p>
          ¿Recordaste tu contraseña?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
          >
            Iniciar sesión
          </Link>
        </p>
        <p>
          ¿No tienes una cuenta?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </Layout>
  );
};