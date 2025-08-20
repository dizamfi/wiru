// src/components/profile/PersonProfileForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PersonProfile } from '@/types/user';

// Schema corregido con campos requeridos donde corresponde
const personProfileSchema = z.object({
  firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  dateOfBirth: z.string().min(1, 'Fecha de nacimiento es requerida'),
  identificationType: z.enum(['cedula', 'passport', 'license']),
  identificationNumber: z.string().min(8, 'Número de identificación inválido'),
  
  // Dirección - campos requeridos para perfil completo
  street: z.string().min(5, 'Dirección debe tener al menos 5 caracteres'),
  neighborhood: z.string().min(2, 'Barrio/Sector es requerido'),
  city: z.string().min(2, 'Ciudad requerida'),
  state: z.string().min(2, 'Estado/Provincia requerida'),
  zipCode: z.string().min(5, 'Código postal inválido'),
  country: z.string().min(2, 'País requerido'),
  
  // Preferencias con valores por defecto
  currency: z.string(),
  language: z.string(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingNotifications: z.boolean(),
  showProfile: z.boolean(),
  shareReferralStats: z.boolean()
});

type PersonProfileFormData = z.infer<typeof personProfileSchema>;

interface PersonProfileFormProps {
  user: PersonProfile;
  onSave: (data: PersonProfileFormData) => Promise<void>;
  onCancel: () => void;
}

export const PersonProfileForm: React.FC<PersonProfileFormProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    control, // Agregado para usar con Controller
    formState: { errors, isValid, isSubmitting },
    watch
  } = useForm<PersonProfileFormData>({
    resolver: zodResolver(personProfileSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      identificationType: user.identificationType || 'cedula',
      identificationNumber: user.identificationNumber || '',
      
      // Dirección con valores por defecto
      street: user.address?.street || '',
      neighborhood: user.address?.neighborhood || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || 'Ecuador',
      
      // Preferencias con valores por defecto
      currency: user.preferences?.currency || 'USD',
      language: user.preferences?.language || 'es',
      emailNotifications: user.preferences?.notifications?.email ?? true,
      smsNotifications: user.preferences?.notifications?.sms ?? false,
      pushNotifications: user.preferences?.notifications?.push ?? true,
      marketingNotifications: user.preferences?.notifications?.marketing ?? false,
      showProfile: user.preferences?.privacy?.showProfile ?? true,
      shareReferralStats: user.preferences?.privacy?.shareReferralStats ?? true
    }
  });

  // Datos de configuración
  const identificationTypes = [
    { value: 'cedula', label: 'Cédula de Ciudadanía' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'license', label: 'Licencia de Conducir' }
  ];

  const currencies = [
    { value: 'USD', label: 'Dólar Estadounidense (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'COP', label: 'Peso Colombiano (COP)' }
  ];

  const languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' }
  ];

  const countries = [
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Perú', label: 'Perú' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Otro', label: 'Otro' }
  ];

  const onSubmit = async (data: PersonProfileFormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Perfil Personal</h3>
            <p className="text-gray-600 mt-2">
              Completa tu información para una mejor experiencia en la plataforma
            </p>
          </div>
        </div>

        {/* Información Personal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-primary-500 rounded mr-3"></div>
            Información Personal
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre *"
                placeholder="Ingresa tu nombre"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
            </div>
            
            <div>
              <Input
                label="Apellido *"
                placeholder="Ingresa tu apellido"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            
            <div>
              <Input
                label="Teléfono *"
                type="tel"
                placeholder="+593 99 999 9999"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            
            <div>
              <Input
                label="Fecha de Nacimiento *"
                type="date"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
            </div>
            
            {/* Select con Controller */}
            <div>
              <Controller
                name="identificationType"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    label="Tipo de Identificación *"
                    options={identificationTypes}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </div>
            
            <div>
              <Input
                label="Número de Identificación *"
                placeholder="Número de documento"
                error={errors.identificationNumber?.message}
                {...register('identificationNumber')}
              />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded mr-3"></div>
            Dirección
          </h4>
          
          <div className="space-y-6">
            <div>
              <Input
                label="Dirección Completa *"
                placeholder="Calle, número, sector, referencias"
                error={errors.street?.message}
                {...register('street')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Barrio/Sector *"
                  placeholder="Nombre del barrio o sector"
                  error={errors.neighborhood?.message}
                  {...register('neighborhood')}
                />
              </div>
              
              <div>
                <Input
                  label="Ciudad *"
                  placeholder="Ciudad de residencia"
                  error={errors.city?.message}
                  {...register('city')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Estado/Provincia *"
                  placeholder="Estado o provincia"
                  error={errors.state?.message}
                  {...register('state')}
                />
              </div>
              
              <div>
                <Input
                  label="Código Postal *"
                  placeholder="Código postal"
                  error={errors.zipCode?.message}
                  {...register('zipCode')}
                />
              </div>
              
              {/* Select con Controller */}
              <div>
                <Controller
                  name="country"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select
                      label="País *"
                      options={countries}
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-green-500 rounded mr-3"></div>
            Preferencias
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select con Controller */}
            <div>
              <Controller
                name="currency"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    label="Moneda Preferida"
                    options={currencies}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </div>
            
            {/* Select con Controller */}
            <div>
              <Controller
                name="language"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    label="Idioma"
                    options={languages}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-purple-500 rounded mr-3"></div>
            Notificaciones
          </h4>
          
          <div className="space-y-6">
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Notificaciones por Email</h5>
                <p className="text-sm text-gray-600">
                  Recibir notificaciones importantes sobre transacciones y actividad de cuenta
                </p>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('emailNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Notificaciones SMS</h5>
                <p className="text-sm text-gray-600">
                  Recibir confirmaciones importantes por mensaje de texto
                </p>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('smsNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Notificaciones Push</h5>
                <p className="text-sm text-gray-600">
                  Recibir notificaciones instantáneas en el navegador
                </p>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('pushNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Marketing y Promociones</h5>
                <p className="text-sm text-gray-600">
                  Recibir ofertas especiales, promociones y novedades de la plataforma
                </p>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('marketingNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-red-500 rounded mr-3"></div>
            Configuración de Privacidad
          </h4>
          
          <div className="space-y-6">
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Perfil Público</h5>
                <p className="text-sm text-gray-600">
                  Permitir que otros usuarios vean tu perfil y estadísticas básicas
                </p>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('showProfile')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">Compartir Estadísticas de Referidos</h5>
                <p className="text-sm text-gray-600">
                  Mostrar públicamente tus logros y estadísticas del programa de referidos
                </p>
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...register('shareReferralStats')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 h-12"
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              className="flex-1 h-12 bg-primary-600 hover:bg-primary-700"
            >
              {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
            </Button>
          </div>
          
          {/* Indicador de campos requeridos */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </p>
          </div>
        </div>

        {/* Debug Info (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Debug: Estado del formulario
              </summary>
              <div className="mt-2 text-xs">
                <p>Válido: {isValid ? 'Sí' : 'No'}</p>
                <p>Enviando: {isSubmitting ? 'Sí' : 'No'}</p>
                <p>Errores: {Object.keys(errors).length}</p>
                {Object.keys(errors).length > 0 && (
                  <pre className="mt-2 bg-white p-2 rounded text-red-600">
                    {JSON.stringify(errors, null, 2)}
                  </pre>
                )}
              </div>
            </details>
          </div>
        )}

      </form>
    </div>
  );
};