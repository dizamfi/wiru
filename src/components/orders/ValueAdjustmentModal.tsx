// src/components/orders/ValueAdjustmentModal.tsx
import React, { useState, useEffect } from 'react';
import {
  ScaleIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PhotoIcon,
  InformationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Order, VerificationInfo, OrderItem } from '@/types/order';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from '@/components/ui/use-toast';

// Schema de validación
const verificationSchema = z.object({
  verifiedWeight: z.number().min(0.1, 'El peso debe ser mayor a 0.1 kg'),
  verifiedValue: z.number().min(0, 'El valor no puede ser negativo'),
  verificationNotes: z.string().min(10, 'Las notas deben tener al menos 10 caracteres'),
  adjustmentReason: z.string().optional(),
  requiresApproval: z.boolean().default(false)
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface ValueAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onVerificationComplete?: (verification: VerificationInfo) => void;
  onVerificationUpdate?: (verification: Partial<VerificationInfo>) => void;
  readOnly?: boolean;
}

interface AdjustmentSummary {
  weightChange: number;
  weightChangePercent: number;
  valueChange: number;
  valueChangePercent: number;
  isSignificantChange: boolean;
}

const ValueAdjustmentModal: React.FC<ValueAdjustmentModalProps> = ({
  isOpen,
  onClose,
  order,
  onVerificationComplete,
  onVerificationUpdate,
  readOnly = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([]);
  const [adjustmentSummary, setAdjustmentSummary] = useState<AdjustmentSummary | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verifiedWeight: order.estimatedWeight,
      verifiedValue: order.estimatedTotal,
      verificationNotes: '',
      adjustmentReason: '',
      requiresApproval: false
    }
  });

  const watchedWeight = watch('verifiedWeight');
  const watchedValue = watch('verifiedValue');

  // Calcular resumen de ajustes
  useEffect(() => {
    if (watchedWeight && watchedValue) {
      const weightChange = watchedWeight - order.estimatedWeight;
      const valueChange = watchedValue - order.estimatedTotal;
      
      const weightChangePercent = (weightChange / order.estimatedWeight) * 100;
      const valueChangePercent = (valueChange / order.estimatedTotal) * 100;
      
      // Cambio significativo si es mayor al 15%
      const isSignificantChange = Math.abs(weightChangePercent) > 15 || Math.abs(valueChangePercent) > 15;
      
      setAdjustmentSummary({
        weightChange,
        weightChangePercent,
        valueChange,
        valueChangePercent,
        isSignificantChange
      });

      // Auto-marcar para aprobación si hay cambio significativo
      if (isSignificantChange) {
        setValue('requiresApproval', true);
      }
    }
  }, [watchedWeight, watchedValue, order.estimatedWeight, order.estimatedTotal, setValue]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setVerificationPhotos(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setVerificationPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: VerificationFormData) => {
    if (readOnly) return;

    setIsSubmitting(true);
    try {
      const verification: VerificationInfo = {
        id: `verification-${order.id}-${Date.now()}`,
        orderId: order.id,
        status: data.requiresApproval ? 'pending' : 'completed',
        originalWeight: order.estimatedWeight,
        verifiedWeight: data.verifiedWeight,
        weightVariance: data.verifiedWeight - order.estimatedWeight,
        originalValue: order.estimatedTotal,
        verifiedValue: data.verifiedValue,
        valueVariance: data.verifiedValue - order.estimatedTotal,
        verificationPhotos,
        verificationNotes: data.verificationNotes,
        adjustmentReason: data.adjustmentReason,
        requiresApproval: data.requiresApproval,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (onVerificationComplete) {
        await onVerificationComplete(verification);
      }

      toast({
        title: 'Verificación completada',
        description: data.requiresApproval 
          ? 'La verificación está pendiente de aprobación'
          : 'Los valores han sido actualizados',
        variant: 'success'
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error en verificación',
        description: 'No se pudo completar la verificación',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(2)} kg`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return ArrowUpIcon;
    if (change < 0) return ArrowDownIcon;
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verificación y Ajuste de Valores"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit as (data: any) => void)} className="space-y-6">
        {/* Order summary */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Información de la Orden</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Orden:</span>
                <span className="ml-2 font-medium">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Items:</span>
                <span className="ml-2 font-medium">{order.items.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Peso estimado:</span>
                <span className="ml-2 font-medium">{formatWeight(order.estimatedWeight)}</span>
              </div>
              <div>
                <span className="text-gray-600">Valor estimado:</span>
                <span className="ml-2 font-medium">{formatCurrency(order.estimatedTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ScaleIcon className="h-4 w-4 inline mr-2" />
              Peso Verificado (kg)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.1"
              {...register('verifiedWeight', { valueAsNumber: true })}
              error={errors.verifiedWeight?.message}
              disabled={readOnly}
            />
            {adjustmentSummary && adjustmentSummary.weightChange !== 0 && (
              <div className={`flex items-center mt-2 text-sm ${getChangeColor(adjustmentSummary.weightChange)}`}>
                {(() => {
                  const ChangeIcon = getChangeIcon(adjustmentSummary.weightChange);
                  return ChangeIcon ? <ChangeIcon className="h-4 w-4 mr-1" /> : null;
                })()}
                <span>
                  {adjustmentSummary.weightChange > 0 ? '+' : ''}
                  {formatWeight(adjustmentSummary.weightChange)} 
                  ({adjustmentSummary.weightChangePercent.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          {/* Value verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CurrencyDollarIcon className="h-4 w-4 inline mr-2" />
              Valor Verificado ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('verifiedValue', { valueAsNumber: true })}
              error={errors.verifiedValue?.message}
              disabled={readOnly}
            />
            {adjustmentSummary && adjustmentSummary.valueChange !== 0 && (
              <div className={`flex items-center mt-2 text-sm ${getChangeColor(adjustmentSummary.valueChange)}`}>
                {(() => {
                  const ChangeIcon = getChangeIcon(adjustmentSummary.valueChange);
                  return ChangeIcon ? <ChangeIcon className="h-4 w-4 mr-1" /> : null;
                })()}
                <span>
                  {adjustmentSummary.valueChange > 0 ? '+' : ''}
                  {formatCurrency(adjustmentSummary.valueChange)} 
                  ({adjustmentSummary.valueChangePercent.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Significant change warning */}
        {adjustmentSummary?.isSignificantChange && (
          <Alert variant="warning">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <div>
              <p className="font-medium">Cambio Significativo Detectado</p>
              <p className="text-sm">
                Los cambios superiores al 15% requieren aprobación adicional.
              </p>
            </div>
          </Alert>
        )}

        {/* Verification notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas de Verificación *
          </label>
          <Textarea
            {...register('verificationNotes')}
            placeholder="Describe el estado del dispositivo, ajustes realizados, y cualquier observación relevante..."
            rows={4}
            error={errors.verificationNotes?.message}
            disabled={readOnly}
          />
        </div>

        {/* Adjustment reason */}
        {adjustmentSummary && (adjustmentSummary.weightChange !== 0 || adjustmentSummary.valueChange !== 0) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón del Ajuste
            </label>
            <Textarea
              {...register('adjustmentReason')}
              placeholder="Explica por qué se realizaron los ajustes en peso o valor..."
              rows={3}
              disabled={readOnly}
            />
          </div>
        )}

        {/* Photo upload */}
        {!readOnly && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos de Verificación
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="verification-photos"
              />
              <label
                htmlFor="verification-photos"
                className="cursor-pointer flex flex-col items-center"
              >
                <PhotoIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600 mt-2">
                  Agregar fotos de verificación
                </span>
              </label>
            </div>

            {/* Photos preview */}
            {verificationPhotos.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                {verificationPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Verificación ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 h-auto bg-red-500 text-white hover:bg-red-600 rounded-full"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approval checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('requiresApproval')}
            disabled={readOnly || adjustmentSummary?.isSignificantChange}
            className="mt-1"
          />
          <div>
            <label className="text-sm font-medium text-gray-900">
              Requiere Aprobación Adicional
            </label>
            <p className="text-sm text-gray-600">
              {adjustmentSummary?.isSignificantChange 
                ? 'Requerido automáticamente por cambio significativo'
                : 'Marcar si los cambios requieren revisión adicional'
              }
            </p>
          </div>
        </div>

        {/* Summary */}
        {adjustmentSummary && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <InformationCircleIcon className="h-4 w-4 mr-2" />
                Resumen de Cambios
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Peso:</span>
                  <span className="ml-2">
                    {formatWeight(order.estimatedWeight)} → {formatWeight(watchedWeight)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Valor:</span>
                  <span className="ml-2">
                    {formatCurrency(order.estimatedTotal)} → {formatCurrency(watchedValue)}
                  </span>
                </div>
              </div>
              
              {(adjustmentSummary.weightChange !== 0 || adjustmentSummary.valueChange !== 0) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">Impacto:</p>
                  <div className="space-y-1 text-sm">
                    {adjustmentSummary.weightChange !== 0 && (
                      <p className={getChangeColor(adjustmentSummary.weightChange)}>
                        Peso: {adjustmentSummary.weightChange > 0 ? '+' : ''}
                        {adjustmentSummary.weightChangePercent.toFixed(1)}%
                      </p>
                    )}
                    {adjustmentSummary.valueChange !== 0 && (
                      <p className={getChangeColor(adjustmentSummary.valueChange)}>
                        Valor: {adjustmentSummary.valueChange > 0 ? '+' : ''}
                        {adjustmentSummary.valueChangePercent.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          
          {!readOnly && (
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              {adjustmentSummary?.isSignificantChange 
                ? 'Enviar para Aprobación'
                : 'Completar Verificación'
              }
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ValueAdjustmentModal;