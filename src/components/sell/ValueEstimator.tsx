import React from 'react';
import { Card, CardContent, Alert } from '@/components/ui';
import { 
  CurrencyDollarIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { categories } from './CategorySelector';

interface ValueEstimatorProps {
  categoryId: string;
  weight: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  hasCharger: boolean;
  hasBox: boolean;
  hasDocuments: boolean;
  className?: string;
}

const conditionMultipliers = {
  excellent: { multiplier: 1.0, label: 'Excelente - Como nuevo' },
  good: { multiplier: 0.8, label: 'Bueno - Funciona perfectamente' },
  fair: { multiplier: 0.6, label: 'Regular - Funciona con defectos menores' },
  poor: { multiplier: 0.3, label: 'Malo - No funciona o daños graves' }
};

export const ValueEstimator: React.FC<ValueEstimatorProps> = ({
  categoryId,
  weight,
  condition,
  hasCharger,
  hasBox,
  hasDocuments,
  className = ''
}) => {
  const category = categories.find(c => c.id === categoryId);
  
  if (!category || !weight || !condition) {
    return null;
  }

  // Calculate estimated value
  const baseValue = category.pricePerKg * weight;
  const conditionMultiplier = conditionMultipliers[condition].multiplier;
  const accessoryBonus = (
    (hasCharger ? 0.1 : 0) +
    (hasBox ? 0.05 : 0) +
    (hasDocuments ? 0.05 : 0)
  );
  
  const finalValue = Math.round(baseValue * conditionMultiplier * (1 + accessoryBonus));
  
  // Calculate difference from base value
  const difference = finalValue - baseValue;
  const percentageChange = ((finalValue - baseValue) / baseValue) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Valor estimado
          </h3>
          
          <div className="bg-primary-50 rounded-lg p-6 text-center mb-4">
            <CurrencyDollarIcon className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <p className="text-4xl font-bold text-primary-600 mb-2">
              ${finalValue}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Valor estimado para tu {category.name.toLowerCase()}
            </p>
            
            {difference !== 0 && (
              <div className="flex items-center justify-center space-x-1">
                {difference > 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success-600" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600" />
                )}
                <span className={`text-sm ${difference > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {difference > 0 ? '+' : ''}${Math.abs(difference)} ({percentageChange.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
          
          {/* Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Precio base ({category.pricePerKg}/kg × {weight}kg):</span>
              <span className="font-medium">${Math.round(baseValue)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Estado ({conditionMultipliers[condition].label}):</span>
              <span className="font-medium">×{conditionMultipliers[condition].multiplier}</span>
            </div>
            
            {accessoryBonus > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus accesorios:</span>
                <span className="font-medium text-success-600">
                  +{Math.round(accessoryBonus * 100)}%
                </span>
              </div>
            )}
            
            <hr className="my-2" />
            
            <div className="flex justify-between font-semibold text-primary-600">
              <span>Total estimado:</span>
              <span>${finalValue}</span>
            </div>
          </div>
          
          {/* Tips for better value */}
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-gray-900">💡 Tips para mejor valor:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {!hasCharger && <li>• Incluir cargador original (+10%)</li>}
              {!hasBox && <li>• Incluir caja original (+5%)</li>}
              {!hasDocuments && <li>• Incluir manuales/documentos (+5%)</li>}
              <li>• Limpiar bien el dispositivo antes del envío</li>
              <li>• Incluir fotos de todos los ángulos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Alert variant="warning">
        <InformationCircleIcon className="h-4 w-4" />
        <div>
          <p className="font-medium">Nota importante:</p>
          <p className="text-sm">
            Este es un valor estimado basado en la información proporcionada. 
            El valor final se determinará después de la verificación física 
            del dispositivo en nuestras instalaciones.
          </p>
        </div>
      </Alert>
    </div>
  );
};