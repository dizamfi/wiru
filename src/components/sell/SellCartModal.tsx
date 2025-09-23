// src/components/sell/SellCartModal.tsx - Modal del carrito estilo Amazon
import React, { useState } from 'react';
import { 
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface CartItem {
  id: string;
  categoryId: string;
  categoryName: string;
  estimatedPrice: number;
  weight: number;
  quantity: number;
  condition: string;
  images: string[];
  pricePerKg?: number;
  description?: string;
}

interface SellCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const SellCartModal: React.FC<SellCartModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [selectedDelivery, setSelectedDelivery] = useState<'pickup' | 'home'>('pickup');

  if (!isOpen) return null;

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
  const deliveryFee = selectedDelivery === 'home' ? 15 : 0;
  const processingFee = Math.max(subtotal * 0.03, 5); // 3% o mínimo $5
  const total = subtotal - processingFee - deliveryFee; // En venta, restamos fees

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <ShoppingBagIcon className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold">Tu Venta</h2>
              <p className="text-sm text-gray-600">{items.length} artículo{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          
          {/* Items List */}
          <div className="p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400">Agrega dispositivos para comenzar a vender</p>
              </div>
            ) : (
              items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex space-x-4">
                    
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.images?.[0] ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.categoryName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-2xl">📱</div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.categoryName}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.condition}
                        </Badge>
                        
                        {item.pricePerKg && (
                          <span className="text-xs text-gray-500">
                            ${item.pricePerKg}/kg
                          </span>
                        )}
                        
                        <span className="text-xs text-gray-500">
                          {item.weight}kg
                        </span>
                      </div>
                    </div>

                    {/* Price and Controls */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${(item.estimatedPrice * item.quantity).toFixed(2)}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-6 w-6 p-0"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Delivery Options */}
          {items.length > 0 && (
            <div className="px-6 pb-4">
              <h3 className="font-medium mb-3 flex items-center">
                <TruckIcon className="h-4 w-4 mr-2" />
                Método de Entrega
              </h3>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={selectedDelivery === 'pickup'}
                    onChange={(e) => setSelectedDelivery(e.target.value as 'pickup')}
                    className="text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Punto Servientrega</div>
                    <div className="text-sm text-gray-600">Gratis - Entregar en oficina más cercana</div>
                  </div>
                  <Badge variant="secondary" className="text-green-600">GRATIS</Badge>
                </label>
                
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="home"
                    checked={selectedDelivery === 'home'}
                    onChange={(e) => setSelectedDelivery(e.target.value as 'home')}
                    className="text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Recolección a Domicilio</div>
                    <div className="text-sm text-gray-600">Recogemos en tu dirección - $15</div>
                  </div>
                  <span className="font-medium">$15.00</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Summary and Checkout */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 p-6">
            
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({items.length} artículos)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Costo de recolección</span>
                  <span>-${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-red-600">
                <span className="flex items-center">
                  Tarifa de procesamiento
                  <InformationCircleIcon className="h-3 w-3 ml-1" />
                </span>
                <span>-${processingFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold text-green-600 pt-2 border-t">
                <span>Recibirás</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={onCheckout}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Proceder con la Venta
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Pago en 24h
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Evaluación gratuita
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Seguro incluido
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellCartModal;