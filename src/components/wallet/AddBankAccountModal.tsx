// src/components/wallet/AddBankAccountModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon, BanknotesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { BankAccount } from '@/types/user';
  import type { SubmitHandler } from 'react-hook-form';

const bankAccountSchema = z.object({
  bankName: z.string().min(1, 'Selecciona un banco'),
  bankCode: z.string().min(3, 'Código de banco requerido'),
  accountType: z.enum(['savings', 'checking'], {
    error: 'Selecciona el tipo de cuenta'
  }),
  accountNumber: z.string()
    .min(10, 'Número de cuenta debe tener al menos 10 dígitos')
    .max(20, 'Número de cuenta muy largo')
    .regex(/^\d+$/, 'Solo se permiten números'),
  accountHolder: z.string().min(2, 'Nombre del titular requerido'),
  identificationType: z.enum(['cedula', 'passport'], {
    error: 'Selecciona el tipo de identificación'
  }),
  identificationNumber: z.string().min(8, 'Número de identificación inválido'),
  isDefault: z.boolean()
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: BankAccountFormData) => Promise<void>;
  existingAccounts?: BankAccount[];
}

// Lista de bancos en Ecuador
const BANKS = [
  { value: 'banco-pichincha', label: 'Banco Pichincha', code: '1007' },
  { value: 'banco-guayaquil', label: 'Banco de Guayaquil', code: '1002' },
  { value: 'banco-pacifico', label: 'Banco del Pacífico', code: '1003' },
  { value: 'produbanco', label: 'Produbanco', code: '1005' },
  { value: 'banco-internacional', label: 'Banco Internacional', code: '1009' },
  { value: 'banco-bolivariano', label: 'Banco Bolivariano', code: '1006' },
  { value: 'banco-austro', label: 'Banco del Austro', code: '1010' },
  { value: 'banco-machala', label: 'Banco de Machala', code: '1011' },
  { value: 'banco-loja', label: 'Banco de Loja', code: '1012' },
  { value: 'cooperativa-jep', label: 'Cooperativa JEP', code: '1013' },
  { value: 'cooperativa-andalucia', label: 'Cooperativa Andalucía', code: '1014' },
  { value: 'otro', label: 'Otro banco', code: '9999' }
];

const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Cuenta de Ahorros' },
  { value: 'checking', label: 'Cuenta Corriente' }
];

const ID_TYPES = [
  { value: 'cedula', label: 'Cédula de Ciudadanía' },
  { value: 'passport', label: 'Pasaporte' }
];

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingAccounts = []
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verification'>('form');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm<BankAccountFormData>({

    resolver: zodResolver(bankAccountSchema) ,
    mode: 'onChange',
    defaultValues: {
      isDefault: existingAccounts.length === 0 // Primera cuenta es predeterminada
    }
  });

  const selectedBank = watch('bankName');
  const accountNumber = watch('accountNumber');

  React.useEffect(() => {
    const bank = BANKS.find(b => b.value === selectedBank);
    if (bank) {
      setValue('bankCode', bank.code);
    }
  }, [selectedBank, setValue]);



  const onSubmit: SubmitHandler<BankAccountFormData> = async (data) => {
    setIsLoading(true);
    try {
      await onAdd(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding bank account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setStep('form');
    onClose();
  };

  const formatAccountNumber = (value: string) => {
    // Formatear número de cuenta para mostrar solo los últimos 4 dígitos
    if (value.length <= 4) return value;
    const masked = '*'.repeat(value.length - 4) + value.slice(-4);
    return masked;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agregar Cuenta Bancaria" size="lg">
      {step === 'form' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información del banco */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Información del Banco</h4>
            
            <Select
              label="Banco"
              options={BANKS}
              error={errors.bankName?.message}
              {...register('bankName')}
              onChange={(value) => setValue('bankName', value as string)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Cuenta"
                options={ACCOUNT_TYPES}
                value={watch('accountType')}
                onChange={(value) => setValue('accountType', value as 'savings' | 'checking', { shouldValidate: true })}
                error={errors.accountType?.message}
              />
              
              <Input
                label="Número de Cuenta"
                placeholder="1234567890"
                maxLength={20}
                error={errors.accountNumber?.message}
                {...register('accountNumber')}
              />
            </div>
          </div>

          {/* Información del titular */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Información del Titular</h4>
            
            <Input
              label="Nombre Completo del Titular"
              placeholder="Tal como aparece en la cuenta bancaria"
              error={errors.accountHolder?.message}
              {...register('accountHolder')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Identificación"
                options={ID_TYPES}
                value={watch('identificationType')}
                onChange={(value) => setValue('identificationType', value as 'cedula' | 'passport', { shouldValidate: true })}
                error={errors.identificationType?.message}
              />
              
              <Input
                label="Número de Identificación"
                placeholder="1234567890"
                error={errors.identificationNumber?.message}
                {...register('identificationNumber')}
              />
            </div>
          </div>

          {/* Configuraciones */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Cuenta Predeterminada</h4>
                <p className="text-sm text-gray-600">
                  Usar esta cuenta para retiros automáticos
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register('isDefault')}
              />
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h5 className="font-medium text-blue-900 mb-1">Información Segura</h5>
                <p className="text-blue-700 mb-2">
                  Tu información bancaria está protegida con encriptación de nivel bancario.
                </p>
                <ul className="text-blue-600 text-xs space-y-1">
                  <li>• Solo tú puedes ver tu información completa</li>
                  <li>• Los retiros requieren verificación adicional</li>
                  <li>• Puedes eliminar esta cuenta en cualquier momento</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview de la cuenta */}
          {selectedBank && accountNumber && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Vista Previa</h5>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded border">
                  <BanknotesIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {BANKS.find(b => b.value === selectedBank)?.label}
                  </p>
                  <p className="text-sm text-gray-600">
                    {watch('accountType') === 'savings' ? 'Ahorros' : 'Corriente'} - 
                    {formatAccountNumber(accountNumber)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              loading={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Agregando...' : 'Agregar Cuenta'}
            </Button>
          </div>
        </form>
      ) : (
        // Paso de verificación (si es necesario)
        <div className="text-center py-8">
          <ShieldCheckIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cuenta Agregada Exitosamente
          </h3>
          <p className="text-gray-600 mb-6">
            Tu cuenta bancaria ha sido agregada y está lista para usar en retiros.
          </p>
          <Button onClick={handleClose}>
            Continuar
          </Button>
        </div>
      )}
    </Modal>
  );
};