// src/components/wallet/WithdrawalModal.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/utils/currency';
import { BankAccount } from '@/types/user';

const withdrawalSchema = z.object({
  amount: z.number().min(10, 'Monto mínimo: $10').max(5000, 'Monto máximo: $5000'),
  bankAccountId: z.string().min(1, 'Selecciona una cuenta bancaria'),
  description: z.string().optional()
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
  bankAccounts: BankAccount[];
  onWithdraw: (data: any) => Promise<void>;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  availableAmount,
  bankAccounts,
  onWithdraw
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    mode: 'onChange'
  });

  const amount = watch('amount');
  const kushkiFee = amount ? Math.max(amount * 0.029, 2) : 0; // 2.9% con mínimo de $2
  const finalAmount = amount ? amount - kushkiFee : 0;

  const onSubmit = async (data: WithdrawalFormData) => {
    setIsLoading(true);
    try {
      await onWithdraw({
        ...data,
        fee: kushkiFee,
        finalAmount
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error in withdrawal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Retirar Dinero">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Available amount */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Disponible para retiro: <span className="font-semibold">{formatCurrency(availableAmount)}</span>
          </p>
        </div>

        {/* Amount input */}
        <div>
          <Input
            label="Monto a retirar"
            type="number"
            step="0.01"
            min="10"
            max={availableAmount}
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <div className="mt-2 flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('amount', Math.min(50, availableAmount))}
            >
              $50
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('amount', Math.min(100, availableAmount))}
            >
              $100
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('amount', availableAmount)}
            >
              Todo
            </Button>
          </div>
        </div>

        {/* Bank account selection */}
        <div>
          <Select
            label="Cuenta bancaria"
            options={bankAccounts.map(account => ({
              value: account.id,
              label: `${account.bankName} - ****${account.accountNumber.slice(-4)}`
            }))}
            error={errors.bankAccountId?.message}
            {...register('bankAccountId')}
            onChange={(value) => {
              setValue('bankAccountId', value);
              setSelectedAccount(bankAccounts.find(acc => acc.id === value) || null);
            }}
          />
        </div>

        {/* Fee breakdown */}
        {amount && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monto solicitado:</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Comisión Kushki (2.9%):</span>
              <span>-{formatCurrency(kushkiFee)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Recibirás:</span>
              <span className="text-green-600">{formatCurrency(finalAmount)}</span>
            </div>
          </div>
        )}

        {/* Description */}
        <Input
          label="Descripción (opcional)"
          placeholder="Motivo del retiro..."
          {...register('description')}
        />

        {/* Submit buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
            {isLoading ? 'Procesando...' : 'Confirmar Retiro'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};