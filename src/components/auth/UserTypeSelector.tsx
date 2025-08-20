// src/components/auth/UserTypeSelector.tsx
import React, { useState } from 'react';
import { UserIcon, BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { UserType } from '@/types/user';
import { cn } from '@/utils/cn';

interface UserTypeSelectorProps {
  selectedType: UserType | null;
  onTypeSelect: (type: UserType) => void;
  className?: string;
}

interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    type: 'person',
    title: 'Persona Natural',
    description: 'Para usuarios individuales que venden su chatarra electrónica',
    features: [
      'Billetera virtual integrada',
      'Sistema de puntos y recompensas',
      'Programa de referidos',
      'Recolección a domicilio',
      'Retiros automáticos con Kushki',
      'Acceso a puntos de acopio'
    ],
    icon: UserIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    type: 'company',
    title: 'Empresa u Organización',
    description: 'Para empresas que gestionan residuos electrónicos a mayor escala',
    features: [
      'Gestión directa de pagos',
      'Recolección programada',
      'Reportes empresariales',
      'Gestión de múltiples ubicaciones',
      'Términos de pago flexibles',
      'Soporte empresarial dedicado'
    ],
    icon: BuildingOfficeIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200'
  }
];

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  className
}) => {
  const [hoveredType, setHoveredType] = useState<UserType | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Elige tu tipo de cuenta
        </h2>
        <p className="text-gray-600">
          Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userTypeOptions.map((option) => {
          const isSelected = selectedType === option.type;
          const isHovered = hoveredType === option.type;
          const IconComponent = option.icon;

          return (
            <div
              key={option.type}
              onClick={() => onTypeSelect(option.type)}
              onMouseEnter={() => setHoveredType(option.type)}
              onMouseLeave={() => setHoveredType(null)}
              className={cn(
                'relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200',
                'hover:shadow-lg transform hover:-translate-y-1',
                isSelected
                  ? `${option.bgColor} border-current ${option.color} shadow-lg`
                  : 'bg-white border-gray-200 hover:border-gray-300',
                isHovered && !isSelected && 'shadow-md'
              )}
            >
              {/* Icono de selección */}
              {isSelected && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-white rounded-full p-1 shadow-lg">
                    <CheckCircleIcon className={cn('h-6 w-6', option.color)} />
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className={cn(
                  'p-3 rounded-lg',
                  isSelected ? 'bg-white bg-opacity-70' : option.bgColor
                )}>
                  <IconComponent className={cn(
                    'h-8 w-8',
                    isSelected ? option.color : 'text-gray-600'
                  )} />
                </div>
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold',
                    isSelected ? option.color : 'text-gray-900'
                  )}>
                    {option.title}
                  </h3>
                </div>
              </div>

              {/* Descripción */}
              <p className={cn(
                'text-sm mb-4',
                isSelected ? 'text-gray-700' : 'text-gray-600'
              )}>
                {option.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className={cn(
                  'text-sm font-medium',
                  isSelected ? option.color : 'text-gray-700'
                )}>
                  Características principales:
                </h4>
                <ul className="space-y-1">
                  {option.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className={cn(
                        'text-xs flex items-center space-x-2',
                        isSelected ? 'text-gray-700' : 'text-gray-600'
                      )}
                    >
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? option.color.replace('text-', 'bg-') : 'bg-gray-400'
                      )} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to action */}
              <div className="mt-6">
                <div className={cn(
                  'text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                  isSelected
                    ? `${option.color} bg-white bg-opacity-70`
                    : 'text-gray-600 bg-gray-50'
                )}>
                  {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {selectedType && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Tipo de cuenta seleccionado
              </h4>
              <p className="text-sm text-blue-700">
                {selectedType === 'person' 
                  ? 'Has seleccionado una cuenta personal. Tendrás acceso a billetera virtual, sistema de puntos y programa de referidos.'
                  : 'Has seleccionado una cuenta empresarial. Los pagos se gestionarán directamente con términos comerciales.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para usar el selector de tipo de usuario
export const useUserTypeSelector = () => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isValidSelection, setIsValidSelection] = useState(false);

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type);
    setIsValidSelection(true);
  };

  const resetSelection = () => {
    setSelectedType(null);
    setIsValidSelection(false);
  };

  return {
    selectedType,
    isValidSelection,
    handleTypeSelect,
    resetSelection
  };
};