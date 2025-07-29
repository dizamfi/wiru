import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardContent } from '@/components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            {/* 404 Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400">404</span>
            </div>
            
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Página No Encontrada
            </h2>
            
            <p className="text-gray-600 mb-8">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.history.back()}
                leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              >
                Volver Atrás
              </Button>
              
              <Link to="/">
                <Button
                  fullWidth
                  leftIcon={<HomeIcon className="h-4 w-4" />}
                >
                  Ir al Inicio
                </Button>
              </Link>
            </div>

            {/* Help */}
            <p className="text-xs text-gray-500 mt-6">
              ¿Necesitas ayuda?{' '}
              <Link 
                to="/help" 
                className="text-primary-600 hover:text-primary-500 underline"
              >
                Contacta soporte
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;