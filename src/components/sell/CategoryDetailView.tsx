// src/components/sell/CategoryDetailView.tsx
import React, { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PhotoIcon, 
  ScaleIcon, 
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Category, CartItem } from '@/types/categories';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

interface CategoryDetailViewProps {
  category: Category;
  onAddToCart: (item: CartItem) => void;
  onBack: () => void;
}

const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  onAddToCart,
  onBack
}) => {
  const [weight, setWeight] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Estados para el visor de imágenes de referencia
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoomModal, setShowZoomModal] = useState<boolean>(false);

  // Calcular valor estimado
  const pricePerKg = category.pricePerKg ? parseFloat(category.pricePerKg.toString()) : 0;
  const weightNum = parseFloat(weight) || 0;
  const estimatedValue = pricePerKg * weightNum * quantity;

  const referenceImages = category.images || [];
  const hasReferenceImages = referenceImages.length > 0;

  // Navegación de imágenes de referencia
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? referenceImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === referenceImages.length - 1 ? 0 : prev + 1
    );
  };

  // Manejo de zoom con mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Manejo de imágenes del usuario
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
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
    toast.success('✅ Agregado al carrito exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Información destacada de la categoría */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <InformationCircleIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
            <p className="text-gray-700 mb-3">
              {category.description || 'Componentes electrónicos para reciclaje'}
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                ✓ Categoría Seleccionable
              </Badge>
              <span className="text-sm text-gray-600">{category.fullPath}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Precio por kg</p>
            <p className="text-3xl font-bold text-green-600">
              ${pricePerKg.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Grid principal */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Visor de imágenes de referencia */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Imágenes de Referencia
          </h3>

          {hasReferenceImages ? (
            <div className="space-y-4">
              {/* Visor principal con zoom */}
              <div className="relative bg-white rounded-xl overflow-hidden aspect-square">
                <div
                  className="relative w-full h-full cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setShowZoomModal(true)}
                >
                  <img
                    src={referenceImages[currentImageIndex]}
                    alt={`${category.name} - Referencia ${currentImageIndex + 1}`}
                    className={cn(
                      "w-full h-full object-contain transition-transform duration-200",
                      isZoomed && "scale-150"
                    )}
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          }
                        : undefined
                    }
                  />

                  {/* Indicador de zoom */}
                  {isZoomed && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-2">
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      <span>Zoom activo</span>
                    </div>
                  )}

                  {/* Botones de navegación */}
                  {referenceImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* Contador de imágenes */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {referenceImages.length}
                  </div>
                </div>
              </div>

              {/* Miniaturas */}
              {referenceImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {referenceImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === index
                          ? "border-[#D0FF5B] ring-2 ring-[#D0FF5B] ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-[#D0FF5B]/20" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Ayuda para zoom */}
              <Card className="p-3 bg-gray-50 border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MagnifyingGlassIcon className="w-4 h-4 flex-shrink-0" />
                  <p>
                    Pasa el mouse sobre la imagen para hacer zoom o haz click para vista completa
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center bg-gray-50">
              <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay imágenes de referencia disponibles</p>
            </Card>
          )}

          {/* Info adicional */}
          {(category.minWeight || category.maxWeight) && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm font-medium text-yellow-900 mb-2">
                📏 Especificaciones de peso
              </p>
              <div className="space-y-1 text-sm text-yellow-800">
                {category.minWeight && (
                  <p>• Peso mínimo: {category.minWeight} kg</p>
                )}
                {category.maxWeight && (
                  <p>• Peso máximo: {category.maxWeight} kg</p>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Columna derecha - Formulario */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles de tu Material
            </h3>

            <div className="space-y-5">
              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent"
                  />
                  <ScaleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {category.minWeight && (
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo: {category.minWeight} kg
                    {category.maxWeight && ` • Máximo: ${category.maxWeight} kg`}
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
                    className="px-4"
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4"
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-600">
                    = {(weightNum * quantity).toFixed(2)} kg total
                  </span>
                </div>
              </div>

              {/* Subir fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos de tu material <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal ml-2">(Máx. 5)</span>
                </label>
                
                {/* Preview de imágenes */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input de archivo */}
                {selectedImages.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all">
                    <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click para subir fotos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedImages.length}/5 imágenes agregadas
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
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Resumen y acciones */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valor estimado total</p>
                  <p className="text-4xl font-bold text-green-600">
                    ${estimatedValue.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {weightNum.toFixed(2)} kg × {quantity} lote(s) × ${pricePerKg.toFixed(2)}/kg
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  📊 Estimado
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>ℹ️ Importante:</strong> El valor final será determinado después de la verificación física en bodega. Esta es una estimación basada en el peso indicado.
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!weight || weightNum <= 0 || selectedImages.length === 0}
                  className="w-full bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90 font-semibold py-3 text-lg flex items-center justify-center space-x-2"
                >
                  <CheckCircleIcon className="w-6 h-6" />
                  <span>Agregar al Carrito</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="w-full"
                >
                  Volver a Categorías
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de zoom completo */}
      {showZoomModal && hasReferenceImages && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowZoomModal(false)}
        >
          <button
            onClick={() => setShowZoomModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img
              src={referenceImages[currentImageIndex]}
              alt={`${category.name} - Vista completa`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {referenceImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
                >
                  <ChevronLeftIcon className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
                >
                  <ChevronRightIcon className="w-8 h-8 text-white" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full text-lg">
                  {currentImageIndex + 1} / {referenceImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailView;