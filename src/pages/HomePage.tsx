import React from 'react';
import { Link } from 'react-router-dom';
import { 
//   RecycleIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Reciclaje Fácil',
      description: 'Proceso simple y rápido para convertir tu chatarra en dinero'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Pagos Seguros',
      description: 'Transferencias directas a tu cuenta bancaria'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Confiable',
      description: 'Plataforma segura y confiable para tus transacciones'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Convierte tu{' '}
              <span className="text-yellow-400">Chatarra Electrónica</span>{' '}
              en Dinero
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              La plataforma más fácil y segura para reciclar tus dispositivos 
              electrónicos y obtener dinero al instante
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/sell">
                  <Button size="lg" variant="secondary">
                    Vender Ahora
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" variant="secondary">
                      Comenzar Gratis
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/how-it-works">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
                      Cómo Funciona
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-primary-800">
                +10,000 usuarios satisfechos
              </Badge>
              <Badge variant="secondary" className="text-primary-800">
                +1M kg reciclados
              </Badge>
              <Badge variant="secondary" className="text-primary-800">
                Pagos en 24h
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia para reciclar tu chatarra electrónica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-8 text-center">
                  <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a miles de usuarios que ya están ganando dinero reciclando
          </p>
          
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Crear Cuenta Gratis
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;