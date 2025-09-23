// src/components/sell/CategoryDetailModal.tsx - Modal para agregar dispositivo al carrito
import React, { useState, useRef } from 'react';
import { 
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
  MinusIcon,
  CameraIcon,
  InformationCircleIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Category } from '@/types/categories';
import { categoryService } from '@/services/categoryService';

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onAddToCart: (item: {
    id: string;
    categoryId: string;
    categoryName: string;
    estimatedPrice: number;
    weight: number;
    quantity: number;
    condition: string;
    images: string[];
    description?: string;
    pricePerKg?: number;
  }) => void;
}

const CONDITIONS = [
  { value: 'EXCELLENT', label: 'Excelente', description: 'Como nuevo, sin signos de uso', multiplier: 1.0 },
  { value: 'VERY_GOOD', label: 'Muy bueno', description: 'Signos mínimos de uso', multiplier: 0.85 },
  { value: 'GOOD', label: 'Bueno', description: 'Uso normal, funciona perfectamente', multiplier: 0.70 },
  { value: 'FAIR', label: 'Regular', description: 'Uso evidente pero funcional', multiplier: 0.50 },
  { value: 'POOR', label: 'Malo', description: 'Funcional pero con problemas estéticos', multiplier: 0.30 }
];

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  isOpen,
  onClose,
  category,
  onAddToCart
}) => {
  const [weight, setWeight] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [condition, setCondition] = useState<string>('GOOD');
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !category) return null;

  // Calcular precio estimado
  const selectedCondition = CONDITIONS.find(c => c.value === condition) || CONDITIONS[2];
  const priceEstimate = categoryService.getQuickPriceEstimate(
    category.pricePerKg || 0, 
    weight, 
    condition
  );
  const totalEstimated = priceEstimate.estimated * quantity;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Simular upload de imágenes (reemplazar con lógica real)
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddToCart = async () => {
    setLoading(true);
    
    try {
      const item = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2), // Generate a unique id
        categoryId: category.id,
        categoryName: category.name,
        estimatedPrice: priceEstimate.estimated,
        weight,
        quantity,
        condition: selectedCondition.label,
        images,
        description: description.trim() || undefined,
        pricePerKg: category.pricePerKg
      };
      
      onAddToCart(item);
      onClose();
      
      // Reset form
      setWeight(1);
      setQuantity(1);
      setCondition('GOOD');
      setImages([]);
      setDescription('');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {category.thumbnailImage ? (
                <img 
                  src={category.thumbnailImage} 
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <PhotoIcon className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[60vh]">
          
          {/* Left Column - Product Info and Images */}
          <div className="space-y-6">
            
            {/* Price Display */}
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Precio base</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${category.pricePerKg}/kg
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Estimación actual</div>
                  <div className="text-xl font-bold text-green-600">
                    ${priceEstimate.estimated.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${priceEstimate.min.toFixed(2)} - ${priceEstimate.max.toFixed(2)}
                  </div>
                </div>
              </div>
            </Card>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos del dispositivo *
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="aspect-square relative">
                    <img 
                      src={image} 
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <CameraIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Agregar</span>
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <p className="text-xs text-gray-500 mt-2">
                Máximo 5 fotos. Muestra el estado real del dispositivo.
              </p>
            </div>

            {/* Reference Images */}
            {category.images && category.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes de referencia
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {category.images.slice(0, 6).map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`Referencia ${index + 1}`}
                      className="aspect-square object-cover rounded border opacity-75"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="space-y-6">
            
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ScaleIcon className="h-4 w-4 inline mr-1" />
                Peso estimado (kg) *
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWeight(Math.max(0.1, weight - 0.1))}
                >
                  <MinusIcon className="h-3 w-3" />
                </Button>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-20 text-center border border-gray-300 rounded-md px-3 py-2"
                  step="0.1"
                  min="0.1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setWeight(weight + 0.1)}
                >
                  <PlusIcon className="h-3 w-3" />
                </Button>
                <span className="text-sm text-gray-500">kg</span>
              </div>
              {category.minWeight && (
                <p className="text-xs text-gray-500 mt-1">
                  Peso mínimo: {category.minWeight}kg
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusIcon className="h-3 w-3" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon className="h-3 w-3" />
                </Button>
                <span className="text-sm text-gray-500">unidades</span>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del dispositivo *
              </label>
              <div className="space-y-2">
                {CONDITIONS.map((cond) => (
                  <label key={cond.value} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="condition"
                      value={cond.value}
                      checked={condition === cond.value}
                      onChange={(e) => setCondition(e.target.value)}
                      className="mt-1 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{cond.label}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${cond.multiplier >= 0.8 ? 'text-green-700' : cond.multiplier >= 0.6 ? 'text-yellow-700' : 'text-orange-700'}`}
                        >
                          {Math.round(cond.multiplier * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{cond.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción adicional (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles sobre el estado, accesorios incluidos, etc."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 caracteres
              </p>
            </div>

            {/* Price Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium mb-3 flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                Resumen de tu venta
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Precio base ({weight}kg × ${category.pricePerKg}/kg)</span>
                  <span>${(weight * (category.pricePerKg || 0)).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Estado: {selectedCondition.label} ({Math.round(selectedCondition.multiplier * 100)}%)</span>
                  <span>${priceEstimate.estimated.toFixed(2)}</span>
                </div>
                
                {quantity > 1 && (
                  <div className="flex justify-between">
                    <span>Cantidad × {quantity}</span>
                    <span>${totalEstimated.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total estimado:</span>
                  <span className="text-green-600">${totalEstimated.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    El precio final puede variar después de la evaluación física del dispositivo.
                  </p>
                </div>
              </div>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Evaluación gratuita</div>
              </div>
              <div className="p-2">
                <StarIcon className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Expertos certificados</div>
              </div>
              <div className="p-2">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Pago en 24h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Ganancia estimada:</div>
              <div className="text-xl font-bold text-green-600">
                ${totalEstimated.toFixed(2)}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAddToCart}
                loading={loading}
                disabled={images.length === 0 || weight <= 0}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {loading ? 'Agregando...' : 'Agregar a mi Venta'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailModal;