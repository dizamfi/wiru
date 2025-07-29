import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { 
  DevicePhoneMobileIcon,
  PhotoIcon,
  TruckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: DevicePhoneMobileIcon,
      title: 'Selecciona tu dispositivo',
      description: 'Elige la categoría de tu dispositivo electrónico y proporciona los detalles básicos.'
    },
    {
      icon: PhotoIcon,
      title: 'Sube fotos',
      description: 'Toma fotos claras de tu dispositivo desde diferentes ángulos para una evaluación precisa.'
    },
    {
      icon: TruckIcon,
      title: 'Programamos recolección',
      description: 'Coordinamos la recolección gratuita en tu domicilio en una fecha conveniente.'
    },
    {
      icon: BanknotesIcon,
      title: 'Recibe tu pago',
      description: 'Verificamos tu dispositivo y transferimos el dinero directamente a tu cuenta.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ¿Cómo Funciona?
        </h1>
        <p className="text-xl text-gray-600">
          Convierte tu chatarra electrónica en dinero en 4 simples pasos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-8 w-8 text-primary-600" />
              </div>
              <Badge variant="default" className="mb-3">
                Paso {index + 1}
              </Badge>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksPage;