// src/pages/dashboard/OrderConfirmationPage.tsx - CONFIRMACIÓN DE ORDEN
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  TruckIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import confetti from 'canvas-confetti';

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'ORD-XXXXX';

  useEffect(() => {
    // Animación de confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        {/* Icono de éxito */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Orden Creada Exitosamente!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu orden ha sido registrada y está siendo procesada
        </p>

        {/* Número de orden */}
        <div className="bg-gradient-to-r from-[#a8c241]/10 to-[#719428]/10 border-2 border-[#a8c241] rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">Número de Orden</p>
          <p className="text-3xl font-bold text-[#719428]">{orderNumber}</p>
          <p className="text-xs text-gray-500 mt-2">Guarda este número para seguimiento</p>
        </div>

        {/* Próximos pasos */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Próximos Pasos</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Prepara tu Material</h4>
                <p className="text-sm text-gray-600">
                  Empaca tus dispositivos de forma segura para el envío
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Entrega o Recolección</h4>
                <p className="text-sm text-gray-600">
                  Lleva tu material al punto Servientrega o espera la recolección
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Verificación en Bodega</h4>
                <p className="text-sm text-gray-600">
                  Nuestro equipo verificará y pesará tu material
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-green-600">4</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Recibe tu Pago</h4>
                <p className="text-sm text-gray-600">
                  El pago se acreditará en tu billetera virtual
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <DocumentTextIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-900">Notificación</p>
            <p className="text-xs text-gray-600 mt-1">
              Te enviaremos updates por email
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <TruckIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-900">Seguimiento</p>
            <p className="text-xs text-gray-600 mt-1">
              Rastrea tu orden en tiempo real
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <ClockIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-900">Tiempo</p>
            <p className="text-xs text-gray-600 mt-1">
              Proceso completo 3-5 días
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/orders')}
            className="bg-[#a8c241] hover:bg-[#719428] text-white"
          >
            Ver Mis Órdenes
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;