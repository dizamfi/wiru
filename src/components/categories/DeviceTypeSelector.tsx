// src/components/categories/DeviceTypeSelector.tsx
import React, { useState } from 'react';
import { 
  ComputerDesktopIcon,
  CpuChipIcon,
  ArrowRightIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { DeviceTypeSelectorProps } from '@/types/categories';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const DeviceTypeSelector: React.FC<DeviceTypeSelectorProps> = ({
  onTypeSelect,
  selectedType,
  className
}) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const deviceTypes = [
    {
      type: 'COMPLETE_DEVICES' as const,
      title: 'Dispositivos Completos',
      subtitle: 'Equipos completos y funcionales',
      description: 'Evalúamos tu dispositivo como una unidad completa considerando su funcionamiento, estado físico y accesorios incluidos.',
      icon: ComputerDesktopIcon,
      color: '#3B82F6',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-300',
      selectedBorder: 'border-blue-500',
      examples: [
        'Laptops (MacBooks, Gaming, Empresariales)',
        'Celulares (iPhones, Samsung, etc.)',
        'Tablets (iPads, Android)',
        'Consolas (PlayStation, Xbox, Nintendo)',
        'Computadoras de escritorio',
        'Accesorios (AirPods, Smartwatches)'
      ],
      priceRange: '$45 - $1,200/kg',
      features: [
        'Evaluación del dispositivo completo',
        'Consideramos funcionalidad',
        'Incluye accesorios',
        'Valores más altos por unidad'
      ]
    },
    {
      type: 'DISMANTLED_DEVICES' as const,
      title: 'Dispositivos Desarmables',
      subtitle: 'Componentes y partes por separado',
      description: 'Valuamos los componentes internos y materiales reciclables de dispositivos que serán desarmados.',
      icon: CpuChipIcon,
      color: '#10B981',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBorder: 'hover:border-green-300',
      selectedBorder: 'border-green-500',
      examples: [
        'Motherboards (Bajo/Medio/Alto grado)',
        'Boards Pentium III y IV',
        'Componentes de tablets/laptops',
        'Boards de impresoras/modems',
        'Centrales telefónicas',
        'Componentes electrónicos'
      ],
      priceRange: '$2.50 - $45/kg',
      features: [
        'Evaluación por componentes',
        'Clasificación por materiales',
        'Precio por peso (kg)',
        'Recuperación de metales preciosos'
      ]
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          ¿Qué tipo de dispositivo tienes?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecciona el tipo de evaluación que mejor se adapte a tu dispositivo para obtener 
          una cotización más precisa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {deviceTypes.map((deviceType) => (
          <Card
            key={deviceType.type}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:shadow-lg',
              selectedType === deviceType.type 
                ? `${deviceType.selectedBorder} ${deviceType.bgColor} shadow-md` 
                : `${deviceType.borderColor} ${deviceType.hoverBorder} hover:shadow-md`,
              hoveredType === deviceType.type ? 'transform -translate-y-1' : ''
            )}
            onClick={() => onTypeSelect(deviceType.type)}
            onMouseEnter={() => setHoveredType(deviceType.type)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <CardContent className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: deviceType.color + '15',
                      border: `2px solid ${deviceType.color}25`
                    }}
                  >
                    <deviceType.icon 
                      className="w-8 h-8" 
                      style={{ color: deviceType.color }}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {deviceType.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {deviceType.subtitle}
                    </p>
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    selectedType === deviceType.type
                      ? ""
                      : ""
                  )}
                  // Use Tailwind classes for color, or add conditional classes if needed
                >
                  {deviceType.priceRange}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {deviceType.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  ✨ Características:
                </h4>
                <ul className="space-y-2">
                  {deviceType.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div 
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: deviceType.color }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div className="mb-6 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  📱 Ejemplos incluidos:
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {deviceType.examples.map((example, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-2 py-1">
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                className={cn(
                  'w-full flex items-center justify-center space-x-2 transition-all duration-200',
                  selectedType === deviceType.type
                    ? 'shadow-md transform scale-105'
                    : 'hover:shadow-md'
                )}
                style={{
                  backgroundColor: selectedType === deviceType.type ? deviceType.color : undefined,
                  borderColor: deviceType.color
                }}
                variant={selectedType === deviceType.type ? "default" : "outline"}
              >
                <span>
                  {selectedType === deviceType.type ? '✓ Seleccionado' : 'Seleccionar'}
                </span>
                {selectedType !== deviceType.type && (
                  <ArrowRightIcon className="w-4 h-4" />
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900">
                💡 ¿No estás seguro de cuál elegir?
              </h4>
              
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Elige "Dispositivos Completos"</strong> si tu equipo está completo, 
                  funciona (aunque sea parcialmente) y quieres venderlo como una unidad.
                </p>
                <p>
                  <strong>Elige "Dispositivos Desarmables"</strong> si tu equipo está dañado, 
                  no funciona, le faltan partes, o prefieres que valuemos sus componentes internos.
                </p>
              </div>

              <div className="bg-white border border-blue-200 rounded-lg p-4 mt-4">
                <h5 className="font-medium text-blue-900 mb-2">¿Puedo cambiar después?</h5>
                <p className="text-sm text-blue-700">
                  Sí, puedes cambiar el tipo de evaluación en cualquier momento durante el proceso. 
                  Nuestro equipo técnico también puede recomendar el tipo más apropiado durante la verificación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DeviceTypeSelector;