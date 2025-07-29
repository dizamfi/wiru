import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  PhotoIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Card, 
  CardContent, 
  Input, 
  Select, 
  FileUpload, 
  Badge,
  Alert,
  Modal,
  ModalContent,
  ModalFooter
} from '@/components/ui';
import { PageHeader } from '@/components/layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Categories mock data
const categories = [
  {
    id: 'laptops',
    name: 'Laptops',
    description: 'Portátiles, notebooks, ultrabooks',
    pricePerKg: 450,
    image: '/images/categories/laptops.jpg',
    examples: ['MacBook', 'Dell XPS', 'HP Pavilion', 'Lenovo ThinkPad'],
    minPrice: 150,
    maxPrice: 1200
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Teléfonos inteligentes de todas las marcas',
    pricePerKg: 800,
    image: '/images/categories/smartphones.jpg',
    examples: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'],
    minPrice: 80,
    maxPrice: 800
  },
  {
    id: 'tablets',
    name: 'Tablets',
    description: 'Tabletas y e-readers',
    pricePerKg: 350,
    image: '/images/categories/tablets.jpg',
    examples: ['iPad', 'Samsung Tab', 'Surface Pro', 'Kindle'],
    minPrice: 60,
    maxPrice: 600
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Consolas y accesorios de videojuegos',
    pricePerKg: 300,
    image: '/images/categories/gaming.jpg',
    examples: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Steam Deck'],
    minPrice: 100,
    maxPrice: 500
  },
  {
    id: 'accessories',
    name: 'Accesorios',
    description: 'Auriculares, cables, cargadores, etc.',
    pricePerKg: 200,
    image: '/images/categories/accessories.jpg',
    examples: ['AirPods', 'Cables USB', 'Cargadores', 'Teclados'],
    minPrice: 20,
    maxPrice: 200
  }
];

// Form validation schema
const sellItemSchema = z.object({
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  deviceName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  brand: z.string().min(2, 'Ingresa la marca del dispositivo'),
  model: z.string().min(2, 'Ingresa el modelo del dispositivo'),
  estimatedWeight: z.number()
    .min(0.1, 'El peso mínimo es 0.1 kg')
    .max(50, 'El peso máximo es 50 kg'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor'], {
    message: 'Selecciona el estado del dispositivo'
  }),
  description: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  hasCharger: z.boolean(),
  hasBox: z.boolean(),
  hasDocuments: z.boolean(),
});

type SellItemFormData = z.infer<typeof sellItemSchema>;

const conditionOptions = [
  { value: 'excellent', label: 'Excelente - Como nuevo' },
  { value: 'good', label: 'Bueno - Funciona perfectamente' },
  { value: 'fair', label: 'Regular - Funciona con defectos menores' },
  { value: 'poor', label: 'Malo - No funciona o tiene daños graves' }
];

const conditionMultipliers = {
  excellent: 1.0,
  good: 0.8,
  fair: 0.6,
  poor: 0.3
};

const CategoryCard: React.FC<{
  category: typeof categories[0];
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
}> = ({ category, isSelected, onSelect }) => (
  <Card 
    className={`cursor-pointer transition-all duration-200 ${
      isSelected 
        ? 'ring-2 ring-primary-500 bg-primary-50' 
        : 'hover:shadow-md hover:scale-105'
    }`}
    onClick={() => onSelect(category.id)}
  >
    <CardContent className="p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
          <ScaleIcon className="h-8 w-8 text-gray-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{category.description}</p>
        <Badge variant="outline" className="mb-2">
          ~${category.pricePerKg}/kg
        </Badge>
        <p className="text-xs text-gray-500">
          ${category.minPrice} - ${category.maxPrice}
        </p>
      </div>
    </CardContent>
  </Card>
);

const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [showEstimate, setShowEstimate] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<SellItemFormData>({
    resolver: zodResolver(sellItemSchema),
    mode: 'onChange',
    defaultValues: {
      hasCharger: false,
      hasBox: false,
      hasDocuments: false,
    }
  });

  const watchedValues = watch();

  // Calculate estimated value
  React.useEffect(() => {
    if (selectedCategory && watchedValues.estimatedWeight && watchedValues.condition) {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        const baseValue = category.pricePerKg * watchedValues.estimatedWeight;
        const conditionMultiplier = conditionMultipliers[watchedValues.condition];
        const accessoryBonus = (
          (watchedValues.hasCharger ? 0.1 : 0) +
          (watchedValues.hasBox ? 0.05 : 0) +
          (watchedValues.hasDocuments ? 0.05 : 0)
        );
        
        const finalValue = baseValue * conditionMultiplier * (1 + accessoryBonus);
        setEstimatedValue(Math.round(finalValue));
        setShowEstimate(true);
      }
    } else {
      setShowEstimate(false);
    }
  }, [selectedCategory, watchedValues.estimatedWeight, watchedValues.condition, watchedValues.hasCharger, watchedValues.hasBox, watchedValues.hasDocuments]);

  const onSubmit = async (data: SellItemFormData) => {
    if (images.length === 0) {
      alert('Debes subir al menos una foto del dispositivo');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock order creation
    const orderId = 'ORD-' + Date.now();
    
    // Navigate to order detail or success page
    navigate(`/orders/${orderId}`, {
      state: {
        message: '¡Orden creada exitosamente! Te contactaremos pronto para coordinar la recolección.',
        orderData: {
          ...watchedValues,
          categoryId: selectedCategory,
          estimatedValue,
          images: images.length,
          orderId
        }
      }
    });
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vender Chatarra Electrónica"
        description="Convierte tus dispositivos electrónicos en dinero de forma fácil y segura"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Category Selection */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              1. Selecciona la categoría de tu dispositivo
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={(categoryId) => {
                    setSelectedCategory(categoryId);
                    setValue('categoryId', categoryId);
                  }}
                />
              ))}
            </div>
            
            {errors.categoryId && (
              <p className="text-sm text-danger-600 mt-2">{errors.categoryId.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Device Details */}
        {selectedCategory && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                2. Detalles del dispositivo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  {...register('deviceName')}
                  label="Nombre del dispositivo"
                  placeholder="ej: iPhone 13 Pro"
                  error={errors.deviceName?.message}
                  required
                />
                
                <Input
                  {...register('brand')}
                  label="Marca"
                  placeholder="ej: Apple"
                  error={errors.brand?.message}
                  required
                />
                
                <Input
                  {...register('model')}
                  label="Modelo"
                  placeholder="ej: A2643"
                  error={errors.model?.message}
                  required
                />
                
                <Input
                  {...register('estimatedWeight', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  label="Peso estimado (kg)"
                  placeholder="ej: 1.5"
                  error={errors.estimatedWeight?.message}
                  helperText="Peso aproximado del dispositivo"
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del dispositivo *
                </label>
                <select
                  {...register('condition')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Selecciona el estado</option>
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.condition && (
                  <p className="text-sm text-danger-600 mt-1">{errors.condition.message}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe el estado del dispositivo, cualquier daño, si funciona correctamente, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.description && (
                  <p className="text-sm text-danger-600 mt-1">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {watchedValues.description?.length || 0}/500 caracteres
                </p>
              </div>

              {/* Accessories */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Accesorios incluidos
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      {...register('hasCharger')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Cargador original (+10% valor)
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      {...register('hasBox')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Caja original (+5% valor)
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      {...register('hasDocuments')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Documentos/Manuales (+5% valor)
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Images */}
        {selectedCategory && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                3. Fotos del dispositivo
              </h3>
              
              <Alert variant="default" className="mb-4">
                <InformationCircleIcon className="h-4 w-4" />
                <div>
                  <p className="font-medium">Consejos para mejores fotos:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• Toma fotos con buena iluminación</li>
                    <li>• Incluye fotos de todos los ángulos</li>
                    <li>• Muestra claramente cualquier daño</li>
                    <li>• Incluye accesorios si los tienes</li>
                  </ul>
                </div>
              </Alert>

              <FileUpload
                selectedFiles={images}
                onFilesSelect={(newFiles) => setImages([...images, ...newFiles])}
                onFileRemove={(index) => setImages(images.filter((_, i) => i !== index))}
                maxFiles={5}
                label="Sube fotos de tu dispositivo"
              />
            </CardContent>
          </Card>
        )}

        {/* Step 4: Estimated Value */}
        {showEstimate && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                4. Valor estimado
              </h3>
              
              <div className="bg-primary-50 rounded-lg p-6 text-center">
                <CurrencyDollarIcon className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-primary-600 mb-2">
                  ${estimatedValue}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Valor estimado basado en la información proporcionada
                </p>
                
                {selectedCategoryData && (
                  <div className="text-left space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between text-sm">
                      <span>Precio base ({selectedCategoryData.pricePerKg}/kg × {watchedValues.estimatedWeight}kg):</span>
                      <span>${Math.round(selectedCategoryData.pricePerKg * watchedValues.estimatedWeight)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Condición ({watchedValues.condition}):</span>
                      <span>×{conditionMultipliers[watchedValues.condition]}</span>
                    </div>
                    {(watchedValues.hasCharger || watchedValues.hasBox || watchedValues.hasDocuments) && (
                      <div className="flex justify-between text-sm">
                        <span>Bonus accesorios:</span>
                        <span>+{((watchedValues.hasCharger ? 10 : 0) + (watchedValues.hasBox ? 5 : 0) + (watchedValues.hasDocuments ? 5 : 0))}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Alert variant="warning" className="mt-4">
                <InformationCircleIcon className="h-4 w-4" />
                <div>
                  <p className="font-medium">Nota importante:</p>
                  <p className="text-sm">
                    Este es un valor estimado. El valor final se determinará después de la 
                    verificación física del dispositivo en nuestras instalaciones.
                  </p>
                </div>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        {selectedCategory && (
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!isValid || images.length === 0}
              className="min-w-48"
            >
              Crear Orden de Venta
            </Button>
          </div>
        )}
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar orden de venta"
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que quieres crear esta orden de venta?
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Resumen de la orden:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Dispositivo:</span>
                  <span>{watchedValues.deviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Peso:</span>
                  <span>{watchedValues.estimatedWeight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado:</span>
                  <span>{conditionOptions.find(c => c.value === watchedValues.condition)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fotos:</span>
                  <span>{images.length} imagen{images.length !== 1 ? 'es' : ''}</span>
                </div>
                <div className="flex justify-between font-medium text-primary-600 border-t pt-2 mt-2">
                  <span>Valor estimado:</span>
                  <span>${estimatedValue}</span>
                </div>
              </div>
            </div>
            
            <Alert variant="default">
              <CheckCircleIcon className="h-4 w-4" />
              <div>
                <p className="text-sm">
                  Te contactaremos dentro de 24 horas para coordinar la recolección 
                  de tu dispositivo.
                </p>
              </div>
            </Alert>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowConfirmModal(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            loading={isSubmitting}
          >
            Confirmar Orden
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SellPage;