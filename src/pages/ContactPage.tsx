import React from 'react';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contacto
        </h1>
        <p className="text-xl text-gray-600">
          ¿Tienes preguntas? Estamos aquí para ayudarte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-primary-600" />
                  <span>+57 300 123 4567</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-primary-600" />
                  <span>contacto@chatarraelectronica.com</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-primary-600" />
                  <span>Bogotá, Colombia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Envíanos un Mensaje</h3>
              
              <form className="space-y-4">
                <Input label="Nombre" placeholder="Tu nombre completo" />
                <Input label="Email" type="email" placeholder="tu@email.com" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
                <Button fullWidth>Enviar Mensaje</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;