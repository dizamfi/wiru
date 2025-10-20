// src/components/sell/CategoryDetailModal.tsx
import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon, ScaleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Category, CartItem } from '@/types/categories';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

interface CategoryDetailModalProps {
  category: Category;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  category,
  onClose,
  onAddToCart
}) => {
  const [weight, setWeight] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Calcular valor estimado
  const pricePerKg = category.pricePerKg ? parseFloat(category.pricePerKg.toString()) : 0;
  const weightNum = parseFloat(weight) || 0;
  const estimatedValue = pricePerKg * weightNum * quantity;

  // Manejo de imágenes
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    // Generar URLs de preview
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Liberar URL del objeto
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    // Validaciones
    if (!weight || weightNum <= 0) {
      toast.error('Por favor ingresa un peso válido');
      return;
    }

    if (category.minWeight && weightNum < parseFloat(category.minWeight.toString())) {
      toast.error(`El peso mínimo es ${category.minWeight} kg`);
      return;
    }

    if (category.maxWeight && weightNum > parseFloat(category.maxWeight.toString())) {
      toast.error(`El peso máximo es ${category.maxWeight} kg`);
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Por favor agrega al menos una imagen');
      return;
    }

    // Crear item del carrito
    const cartItem: CartItem = {
      id: `${category.id}-${Date.now()}`,
      categoryId: category.id,
      categoryName: category.name,
      categoryPath: category.fullPath,
      weight: weightNum,
      quantity,
      pricePerKg,
      estimatedValue,
      images: selectedImages,
      notes,
      createdAt: new Date().toISOString(),
      estimatedPrice: 0
    };

    onAddToCart(cartItem);
    toast.success('Agregado al carrito');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{category.fullPath}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Información de la categoría */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Acerca de esta categoría</h3>
                  <p className="text-sm text-blue-800">
                    {category.description || 'Componentes electrónicos para reciclaje'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Grid principal */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Columna izquierda - Imágenes de referencia */}
              <div>
                <h3 className="font-semibold mb-3">Imágenes de Referencia</h3>
                {category.images && category.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {category.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={`${category.name} referencia ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <PhotoIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Precio destacado */}
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Precio por kilogramo</p>
                    <p className="text-4xl font-bold text-green-600">
                      ${pricePerKg.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {category.minWeight && `Mínimo: ${category.minWeight}kg`}
                      {category.minWeight && category.maxWeight && ' • '}
                      {category.maxWeight && `Máximo: ${category.maxWeight}kg`}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Columna derecha - Formulario */}
              <div className="space-y-4">
                <h3 className="font-semibold">Detalles de tu venta</h3>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent"
                    />
                    <ScaleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {category.minWeight && (
                    <p className="text-xs text-gray-500 mt-1">
                      Peso mínimo: {category.minWeight} kg
                    </p>
                  )}
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de lotes
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center px-3 py-2 border rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Total: {(weightNum * quantity).toFixed(2)} kg
                  </p>
                </div>

                {/* Subir fotos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos de tu material * (Máx. 5)
                  </label>
                  
                  {/* Preview de imágenes */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input de archivo */}
                  {selectedImages.length < 5 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click para subir fotos
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedImages.length}/5 imágenes
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Notas adicionales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe el estado, origen, o cualquier detalle relevante..."
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Resumen y acciones */}
            <Card className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Valor estimado total</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${estimatedValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {weightNum.toFixed(2)} kg × {quantity} lote(s) × ${pricePerKg.toFixed(2)}/kg
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 text-sm">
                  📊 Estimado
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Nota:</strong> El valor final será determinado después de la verificación en bodega. 
                  Esta es solo una estimación basada en el peso que indicaste.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!weight || weightNum <= 0 || selectedImages.length === 0}
                  className="flex-1 bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90"
                >
                  Agregar al Carrito
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailModal;