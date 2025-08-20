// src/components/profile/CompanyProfileForm.tsx
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CompanyProfile } from '@/types/user';

// Schema corregido - todos los campos requeridos para evitar conflictos de tipos
const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'Nombre de empresa requerido'),
  legalName: z.string().min(2, 'Razón social requerida'),
  taxId: z.string().min(8, 'RUC o identificación fiscal requerida'),
  industry: z.string().min(1, 'Industria requerida'),
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']),
  
  // Representante legal - todos requeridos
  legalRepFirstName: z.string().min(2, 'Nombre del representante legal requerido'),
  legalRepLastName: z.string().min(2, 'Apellido del representante legal requerido'),
  legalRepPosition: z.string().min(2, 'Cargo del representante legal requerido'),
  legalRepEmail: z.string().email('Email del representante legal inválido'),
  legalRepPhone: z.string().min(10, 'Teléfono del representante legal requerido'),
  legalRepId: z.string().min(8, 'Identificación del representante legal requerida'),
  
  // Dirección comercial - todos requeridos con defaults
  businessStreet: z.string().min(5, 'Dirección comercial requerida'),
  businessNeighborhood: z.string(), // Puede ser string vacío
  businessCity: z.string().min(2, 'Ciudad requerida'),
  businessState: z.string().min(2, 'Estado/Provincia requerida'),
  businessZipCode: z.string().min(5, 'Código postal requerido'),
  businessCountry: z.string().min(1, 'País requerido'),
  
  // Información de facturación - todos requeridos
  billingLegalName: z.string().min(2, 'Razón social para facturación requerida'),
  billingTaxId: z.string().min(8, 'RUC para facturación requerido'),
  billingAddress: z.string().min(5, 'Dirección de facturación requerida'),
  billingEmail: z.string().email('Email de facturación inválido'),
  billingPhone: z.string().min(10, 'Teléfono de facturación requerido'),
  
  // Configuraciones comerciales - todos requeridos con defaults
  preferredPickupDays: z.array(z.string()),
  minimumWeight: z.number().min(1, 'Peso mínimo debe ser mayor a 1 kg'),
  specialRequirements: z.string(), // Puede ser string vacío
  contractType: z.enum(['standard', 'custom', 'volume']),
  paymentTerms: z.enum(['immediate', 'net15', 'net30'])
});

type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;

interface CompanyProfileFormProps {
  user: CompanyProfile;
  onSave: (data: CompanyProfileFormData) => Promise<void>;
  onCancel: () => void;
}

export const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  user,
  onSave,
  onCancel
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue
  } = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: user.companyName || '',
      legalName: user.legalName || '',
      taxId: user.taxId || '',
      industry: user.industry || '',
      companySize: user.companySize || 'small',
      
      // Representante legal con defaults seguros
      legalRepFirstName: user.legalRepresentative?.firstName || '',
      legalRepLastName: user.legalRepresentative?.lastName || '',
      legalRepPosition: user.legalRepresentative?.position || '',
      legalRepEmail: user.legalRepresentative?.email || '',
      legalRepPhone: user.legalRepresentative?.phone || '',
      legalRepId: user.legalRepresentative?.identificationNumber || '',
      
      // Dirección comercial con defaults seguros
      businessStreet: user.businessAddress?.street || '',
      businessNeighborhood: user.businessAddress?.neighborhood || '',
      businessCity: user.businessAddress?.city || '',
      businessState: user.businessAddress?.state || '',
      businessZipCode: user.businessAddress?.zipCode || '',
      businessCountry: user.businessAddress?.country || 'Ecuador',
      
      // Información de facturación con defaults seguros
      billingLegalName: user.billingInfo?.legalName || '',
      billingTaxId: user.billingInfo?.taxId || '',
      billingAddress: user.billingInfo?.address || '',
      billingEmail: user.billingInfo?.email || '',
      billingPhone: user.billingInfo?.phone || '',
      
      // Configuraciones comerciales con defaults seguros
      preferredPickupDays: user.businessSettings?.preferredPickupDays || [],
      minimumWeight: user.businessSettings?.minimumWeight || 1,
      specialRequirements: user.businessSettings?.specialRequirements || '',
      contractType: user.businessSettings?.contractType || 'standard',
      paymentTerms: user.businessSettings?.paymentTerms || 'immediate'
    }
  });

  const companySizes = [
    { value: 'small', label: 'Pequeña (1-10 empleados)' },
    { value: 'medium', label: 'Mediana (11-50 empleados)' },
    { value: 'large', label: 'Grande (51-200 empleados)' },
    { value: 'enterprise', label: 'Corporación (200+ empleados)' }
  ];

  const industries = [
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

  const contractTypes = [
    { value: 'standard', label: 'Estándar' },
    { value: 'custom', label: 'Personalizado' },
    { value: 'volume', label: 'Por Volumen' }
  ];

  const paymentTerms = [
    { value: 'immediate', label: 'Inmediato' },
    { value: 'net15', label: 'Net 15 días' },
    { value: 'net30', label: 'Net 30 días' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' }
  ];

  const onSubmit: SubmitHandler<CompanyProfileFormData> = async (data) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving company profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Perfil Empresarial</h3>
            <p className="text-gray-600 mt-2">
              Completa la información de tu empresa para acceder a servicios comerciales
            </p>
          </div>
        </div>

        {/* Información de la Empresa */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-primary-500 rounded mr-3"></div>
            Información de la Empresa
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre Comercial *"
                placeholder="Nombre comercial de la empresa"
                error={errors.companyName?.message}
                {...register('companyName')}
              />
            </div>
            
            <div>
              <Input
                label="Razón Social *"
                placeholder="Razón social legal"
                error={errors.legalName?.message}
                {...register('legalName')}
              />
            </div>
            
            <div>
              <Input
                label="RUC / Tax ID *"
                placeholder="Número de identificación fiscal"
                error={errors.taxId?.message}
                {...register('taxId')}
              />
            </div>
            
            <div>
              <Controller
                name="industry"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    label="Industria *"
                    options={industries}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </div>
            
            <div className="md:col-span-2">
              <Controller
                name="companySize"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    label="Tamaño de la Empresa *"
                    options={companySizes}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Representante Legal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded mr-3"></div>
            Representante Legal
          </h4>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Nombre *"
                  placeholder="Nombre del representante"
                  error={errors.legalRepFirstName?.message}
                  {...register('legalRepFirstName')}
                />
              </div>
              
              <div>
                <Input
                  label="Apellido *"
                  placeholder="Apellido del representante"
                  error={errors.legalRepLastName?.message}
                  {...register('legalRepLastName')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Cargo *"
                  placeholder="Cargo en la empresa"
                  error={errors.legalRepPosition?.message}
                  {...register('legalRepPosition')}
                />
              </div>
              
              <div>
                <Input
                  label="Identificación *"
                  placeholder="Cédula o pasaporte"
                  error={errors.legalRepId?.message}
                  {...register('legalRepId')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Email *"
                  type="email"
                  placeholder="email@empresa.com"
                  error={errors.legalRepEmail?.message}
                  {...register('legalRepEmail')}
                />
              </div>
              
              <div>
                <Input
                  label="Teléfono *"
                  type="tel"
                  placeholder="+593 99 999 9999"
                  error={errors.legalRepPhone?.message}
                  {...register('legalRepPhone')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dirección Comercial */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-green-500 rounded mr-3"></div>
            Dirección Comercial
          </h4>
          
          <div className="space-y-6">
            <div>
              <Input
                label="Dirección *"
                placeholder="Dirección completa de la empresa"
                error={errors.businessStreet?.message}
                {...register('businessStreet')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Barrio/Sector"
                  placeholder="Barrio o sector"
                  error={errors.businessNeighborhood?.message}
                  {...register('businessNeighborhood')}
                />
              </div>
              
              <div>
                <Input
                  label="Ciudad *"
                  placeholder="Ciudad"
                  error={errors.businessCity?.message}
                  {...register('businessCity')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Estado/Provincia *"
                  placeholder="Estado o provincia"
                  error={errors.businessState?.message}
                  {...register('businessState')}
                />
              </div>
              
              <div>
                <Input
                  label="Código Postal *"
                  placeholder="Código postal"
                  error={errors.businessZipCode?.message}
                  {...register('businessZipCode')}
                />
              </div>
              
              <div>
                <Input
                  label="País *"
                  placeholder="País"
                  error={errors.businessCountry?.message}
                  {...register('businessCountry')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información de Facturación */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-yellow-500 rounded mr-3"></div>
            Información de Facturación
          </h4>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Razón Social (Facturación) *"
                  placeholder="Razón social para facturación"
                  error={errors.billingLegalName?.message}
                  {...register('billingLegalName')}
                />
              </div>
              
              <div>
                <Input
                  label="RUC (Facturación) *"
                  placeholder="RUC para facturación"
                  error={errors.billingTaxId?.message}
                  {...register('billingTaxId')}
                />
              </div>
            </div>
            
            <div>
              <Input
                label="Dirección de Facturación *"
                placeholder="Dirección completa para facturación"
                error={errors.billingAddress?.message}
                {...register('billingAddress')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Email de Facturación *"
                  type="email"
                  placeholder="facturacion@empresa.com"
                  error={errors.billingEmail?.message}
                  {...register('billingEmail')}
                />
              </div>
              
              <div>
                <Input
                  label="Teléfono de Facturación *"
                  type="tel"
                  placeholder="+593 99 999 9999"
                  error={errors.billingPhone?.message}
                  {...register('billingPhone')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configuraciones Comerciales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-purple-500 rounded mr-3"></div>
            Configuraciones Comerciales
          </h4>
          
          <div className="space-y-6">
            {/* Días Preferidos para Recolección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Días Preferidos para Recolección
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {weekDays.map((day) => (
                  <label key={day.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      value={day.value}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      {...register('preferredPickupDays')}
                    />
                    <span className="text-sm text-gray-700 font-medium">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Peso Mínimo (kg) *"
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="1.0"
                  error={errors.minimumWeight?.message}
                  {...register('minimumWeight', { valueAsNumber: true })}
                />
              </div>
              
              <div>
                <Controller
                  name="contractType"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select
                      label="Tipo de Contrato *"
                      options={contractTypes}
                      value={value}
                      onChange={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </div>
            </div>
            
            <div>
              <Controller
                name="paymentTerms"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Select
                    label="Términos de Pago *"
                    options={paymentTerms}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                  />
                )}
              />
            </div>
            
            {/* Requerimientos Especiales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requerimientos Especiales
              </label>
              <textarea
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                rows={4}
                placeholder="Describe cualquier requerimiento especial para la recolección, manejo de materiales, horarios específicos, etc."
                {...register('specialRequirements')}
              />
              {errors.specialRequirements && (
                <p className="mt-2 text-sm text-red-600">{errors.specialRequirements.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
            <div className="w-5 h-5 bg-blue-500 rounded-full mr-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            Información Importante
          </h5>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start">
              <span className="font-medium mr-1">•</span>
              <span>Los cambios en la información de facturación pueden tardar hasta 48 horas en aplicarse</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-1">•</span>
              <span>El peso mínimo afecta la disponibilidad del servicio de recolección</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-1">•</span>
              <span>Los términos de pago se aplicarán a partir del próximo período de facturación</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-1">•</span>
              <span>Los contratos personalizados requieren aprobación adicional de nuestro equipo comercial</span>
            </li>
          </ul>
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