import React from 'react';
import { Card, CardContent } from '@/components/ui';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sobre Nosotros
        </h1>
        <p className="text-xl text-gray-600">
          Líderes en reciclaje de chatarra electrónica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Nuestra Misión</h3>
            <p className="text-gray-600">
              Facilitar el reciclaje responsable de dispositivos electrónicos, 
              ofreciendo una forma segura y rentable de deshacerse de la chatarra 
              electrónica mientras contribuimos al cuidado del medio ambiente.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Nuestra Visión</h3>
            <p className="text-gray-600">
              Ser la plataforma líder en reciclaje de electrónicos en América Latina, 
              creando un impacto positivo en el medio ambiente y generando valor 
              para nuestros usuarios.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;