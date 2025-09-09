// src/pages/auth/RegisterPage.tsx - VERSIÓN SIMPLIFICADA QUE FUNCIONA
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useRegisterForm } from '@/hooks/useAuthForm';

// Tipos simplificados
type UserType = 'person' | 'company';

// Hook simplificado para el selector de tipo de usuario
const useUserTypeSelector = () => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  
  return {
    selectedType,
    isValidSelection: !!selectedType,
    handleTypeSelect: setSelectedType
  };
};

// Componente simplificado para selector de tipo de usuario
const UserTypeSelector: React.FC<{
  selectedType: UserType | null;
  onTypeSelect: (type: UserType) => void;
}> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ¿Qué tipo de cuenta necesitas?
        </h2>
        <p className="text-gray-600">
          Selecciona el tipo que mejor describe tu situación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onTypeSelect('person')}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedType === 'person'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Persona Natural
            </h3>
            <p className="text-sm text-gray-600">
              Para usuarios individuales que quieren reciclar sus dispositivos electrónicos
            </p>
          </div>
        </div>

        <div
          onClick={() => onTypeSelect('company')}
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedType === 'company'
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Empresa
            </h3>
            <p className="text-sm text-gray-600">
              Para empresas u organizaciones que manejan residuos electrónicos a mayor escala
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { onSubmit, isLoading, error, success, clearError, clearSuccess } = useRegisterForm();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'type' | 'form'>('type');
  
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    identificationNumber: '',
    identificationType: '',
    dateOfBirth: '',
    companyName: '',
    legalName: '',
    taxId: '',
    industry: '',
    companySize: '',
    legalRepFirstName: '',
    legalRepLastName: '',
    legalRepPosition: '',
    legalRepPhone: '',
    legalRepEmail: '',
    legalRepId: '',
    businessStreet: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessCountry: 'Ecuador',
    referralCode: searchParams.get('ref') || '',
  });
  
  // Estados para checkboxes
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  
  // Estado para errores locales
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { selectedType, isValidSelection, handleTypeSelect } = useUserTypeSelector();

  // Función para actualizar campos del formulario
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validaciones básicas
  const validateForm = () => {
    if (!formData.email) {
      setLocalError('El email es requerido');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setLocalError('Ingresa un email válido');
      return false;
    }
    
    if (!formData.password) {
      setLocalError('La contraseña es requerida');
      return false;
    }
    
    if (formData.password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return false;
    }
    
    if (!acceptTerms) {
      setLocalError('Debes aceptar los términos y condiciones para continuar');
      return false;
    }
    
    if (!acceptPrivacy) {
      setLocalError('Debes aceptar la política de privacidad para continuar');
      return false;
    }
    
    // Validaciones específicas por tipo
    if (selectedType === 'person') {
      if (!formData.firstName) {
        setLocalError('El nombre es requerido');
        return false;
      }
      if (!formData.lastName) {
        setLocalError('El apellido es requerido');
        return false;
      }
    }
    
    if (selectedType === 'company') {
      if (!formData.companyName) {
        setLocalError('El nombre de la empresa es requerido');
        return false;
      }
      if (!formData.taxId) {
        setLocalError('El RUC es requerido');
        return false;
      }
    }
    
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) return;
    
    console.log('=== DEBUGGING FORMULARIO ===');
    console.log('Términos aceptados:', acceptTerms);
    console.log('Privacidad aceptada:', acceptPrivacy);
    console.log('Datos del formulario:', formData);
    
    // Limpiar errores
    setLocalError(null);
    clearError();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    // Preparar datos para envío
    const allowedTypes = ['cedula', 'passport', 'license'] as const;
    const identificationTypeValue = allowedTypes.includes(formData.identificationType as any)
      ? (formData.identificationType as 'cedula' | 'passport' | 'license')
      : undefined;

    const allowedCompanySizes = ['small', 'medium', 'large', 'enterprise'] as const;
    const companySizeValue = allowedCompanySizes.includes(formData.companySize as any)
      ? (formData.companySize as 'small' | 'medium' | 'large' | 'enterprise')
      : undefined;

    const dataToSend = {
      ...formData,
      identificationType: identificationTypeValue,
      companySize: companySizeValue,
      userType: selectedType,
      acceptTerms: acceptTerms,
      acceptPrivacy: acceptPrivacy,
    };

    console.log('Datos finales para envío:', dataToSend);

    await onSubmit(dataToSend);
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
    { value: '', label: 'Selecciona...' },
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'license', label: 'Licencia de Conducir' }
  ];

  const companySizes = [
    { value: '', label: 'Selecciona...' },
    { value: 'small', label: 'Pequeña (1-10 empleados)' },
    { value: 'medium', label: 'Mediana (11-50 empleados)' },
    { value: 'large', label: 'Grande (51-200 empleados)' },
    { value: 'enterprise', label: 'Corporación (200+ empleados)' }
  ];

  const industries = [
    { value: '', label: 'Selecciona...' },
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
            <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
          </div>

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Wiru</h1>
          <p className="text-gray-600 mt-2">Plataforma de Reciclaje Inteligente</p>
        </div>

        {renderStepIndicator()}
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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

          {/* Mensajes de error/éxito */}
          {(error || localError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-red-600 text-sm">{error || localError}</p>
                <button
                  onClick={() => {
                    clearError();
                    setLocalError(null);
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-green-600 text-sm">{success}</p>
                <button
                  onClick={clearSuccess}
                  className="text-green-400 hover:text-green-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {selectedType === 'person' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Identificación (opcional)
                    </label>
                    <select
                      value={formData.identificationType}
                      onChange={(e) => updateFormData('identificationType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {identificationTypes.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Identificación (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.identificationNumber}
                      onChange={(e) => updateFormData('identificationNumber', e.target.value)}
                      placeholder="Ej: 1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+593 99 999 9999"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento (opcional)
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Comercial *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de contacto
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    
                    />
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUC / Tax ID *
                    </label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => updateFormData('taxId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  </div>
                  
                </div>
              </>
            )}

            {/* Credenciales */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Credenciales de Acceso
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
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

              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Referido (opcional)
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => updateFormData('referralCode', e.target.value)}
                placeholder="Ingresa el código de quien te invitó"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Términos y condiciones */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500" target="_blank">
                    términos y condiciones
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Acepto la{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500" target="_blank">
                    política de privacidad
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading || !acceptTerms || !acceptPrivacy}
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


