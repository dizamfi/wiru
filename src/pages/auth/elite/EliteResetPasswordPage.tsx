// src/pages/auth/elite/EliteResetPasswordPage.tsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeftIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Hooks
import { useAuth } from "@/hooks/useAuth";

// Validation Schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const EliteResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();

  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Obtener token de la URL
  const token = searchParams.get("token");

  // Configurar formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Validar token al cargar la página
  useEffect(() => {
    if (!token) {
      setTokenError("Token de restablecimiento no encontrado en la URL");
      return;
    }

    // Validación básica del token (formato)
    if (token.length < 20) {
      setTokenError("Token de restablecimiento no válido");
      return;
    }

    setTokenValidated(true);
  }, [token]);

  // Manejar envío del formulario
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Token de restablecimiento no válido");
      return;
    }

    setError(null);

    try {
      console.log(
        "🔐 Restableciendo contraseña con token:",
        token.substring(0, 10) + "..."
      );

      await resetPassword(token, data.password);

      setSuccess(true);
      toast.success("Contraseña restablecida exitosamente");

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/auth/login", {
          state: {
            message:
              "Contraseña restablecida exitosamente. Inicia sesión con tu nueva contraseña.",
          },
        });
      }, 3000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(
        err?.message ||
          "Error al restablecer la contraseña. Intenta nuevamente."
      );
      toast.error("Error al restablecer la contraseña");
    }
  };

  // Layout común
  const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full flex justify-between items-center p-6 md:pt-8 pb-0 pr-8">
        <Link
          to="/auth/forgot-password"
          className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Volver</span>
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
            <Link
              to="/"
              className="transition-all duration-300 hover:scale-105"
            >
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

  // Estado: Token inválido o error
  if (tokenError) {
    return (
      <Layout>
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <XCircleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Enlace no válido
          </h1>
          <p className="text-gray-600 text-lg mb-8">{tokenError}</p>
        </div>

        {/* Error Info */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 mb-2">Posibles causas:</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• El enlace ha expirado (válido por 2 horas)</li>
                <li>• El enlace ya fue utilizado</li>
                <li>• El enlace está incompleto o dañado</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link
            to="/auth/forgot-password"
            className="block w-full py-3 px-4 bg-[#a8c241] hover:bg-[#9bb73d] text-white font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] text-center"
          >
            Solicitar nuevo enlace
          </Link>

          <Link
            to="/auth/login"
            className="block w-full py-3 px-4 border-2 border-[#a8c241] text-[#a8c241] font-semibold rounded-full transition-all duration-200 hover:bg-[#a8c241] hover:text-white hover:scale-[1.02] text-center"
          >
            Volver al login
          </Link>
        </div>
      </Layout>
    );
  }

  // Estado: Contraseña restablecida exitosamente
  if (success) {
    return (
      <Layout>
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#a8c241]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-8 h-8 text-[#a8c241]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            ¡Contraseña restablecida!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu contraseña ha sido actualizada exitosamente
          </p>
        </div>

        {/* Success Info */}
        <div className="bg-[#a8c241]/5 rounded-xl p-6 border border-[#a8c241]/20 mb-8">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-[#a8c241] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-2">
                Cambios de seguridad aplicados:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Contraseña actualizada correctamente</li>
                <li>• Todas las sesiones anteriores han sido cerradas</li>
                <li>• Tokens de acceso anteriores invalidados</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto redirect info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-8">
          <p className="text-sm text-blue-700 text-center">
            Serás redirigido automáticamente al login en unos segundos...
          </p>
        </div>

        {/* Manual redirect button */}
        <Link
          to="/auth/login"
          className="block w-full py-3 px-4 bg-[#a8c241] hover:bg-[#9bb73d] text-white font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] text-center"
        >
          Ir al login ahora
        </Link>
      </Layout>
    );
  }

  // Estado: Formulario principal
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Nueva contraseña
        </h1>
        <p className="text-gray-600 text-lg">
          Crea una contraseña segura para proteger tu cuenta
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">
              Error al restablecer contraseña
            </p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            <LockClosedIcon className="inline w-4 h-4 mr-2" />
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className="w-full px-4 py-4 pr-12 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-[#a8c241] focus:outline-none hover:border-gray-400 transition-colors"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            <LockClosedIcon className="inline w-4 h-4 mr-2" />
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu nueva contraseña"
              autoComplete="new-password"
              className="w-full px-4 py-4 pr-12 border-2 border-gray-300 rounded-lg text-base font-medium placeholder-gray-500 focus:border-[#a8c241] focus:outline-none hover:border-gray-400 transition-colors"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !tokenValidated}
          className="w-full bg-[#a8c241] hover:bg-[#9bb73d] text-white font-bold py-4 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Actualizando contraseña...</span>
            </>
          ) : (
            <>
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Restablecer contraseña</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="text-center text-sm text-gray-600">
        <p>
          ¿Recordaste tu contraseña?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-[#a8c241] hover:text-[#8ea635] transition-colors duration-200"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </Layout>
  );
};
