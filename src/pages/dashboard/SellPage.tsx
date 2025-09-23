// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   PlusIcon,
//   PhotoIcon,
//   ScaleIcon,
//   CurrencyDollarIcon,
//   InformationCircleIcon,
//   XMarkIcon,
//   CheckCircleIcon
// } from '@heroicons/react/24/outline';
// import { 
//   Button, 
//   Card, 
//   CardContent, 
//   Input, 
//   Select, 
//   FileUpload, 
//   Badge,
//   Alert,
//   Modal,
//   ModalContent,
//   ModalFooter
// } from '@/components/ui';
// import { PageHeader } from '@/components/layout';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// // Categories mock data
// const categories = [
//   {
//     id: 'laptops',
//     name: 'Laptops',
//     description: 'Portátiles, notebooks, ultrabooks',
//     pricePerKg: 450,
//     image: '/images/categories/laptops.jpg',
//     examples: ['MacBook', 'Dell XPS', 'HP Pavilion', 'Lenovo ThinkPad'],
//     minPrice: 150,
//     maxPrice: 1200
//   },
//   {
//     id: 'smartphones',
//     name: 'Smartphones',
//     description: 'Teléfonos inteligentes de todas las marcas',
//     pricePerKg: 800,
//     image: '/images/categories/smartphones.jpg',
//     examples: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'],
//     minPrice: 80,
//     maxPrice: 800
//   },
//   {
//     id: 'tablets',
//     name: 'Tablets',
//     description: 'Tabletas y e-readers',
//     pricePerKg: 350,
//     image: '/images/categories/tablets.jpg',
//     examples: ['iPad', 'Samsung Tab', 'Surface Pro', 'Kindle'],
//     minPrice: 60,
//     maxPrice: 600
//   },
//   {
//     id: 'gaming',
//     name: 'Gaming',
//     description: 'Consolas y accesorios de videojuegos',
//     pricePerKg: 300,
//     image: '/images/categories/gaming.jpg',
//     examples: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Steam Deck'],
//     minPrice: 100,
//     maxPrice: 500
//   },
//   {
//     id: 'accessories',
//     name: 'Accesorios',
//     description: 'Auriculares, cables, cargadores, etc.',
//     pricePerKg: 200,
//     image: '/images/categories/accessories.jpg',
//     examples: ['AirPods', 'Cables USB', 'Cargadores', 'Teclados'],
//     minPrice: 20,
//     maxPrice: 200
//   }
// ];

// // Form validation schema
// const sellItemSchema = z.object({
//   categoryId: z.string().min(1, 'Selecciona una categoría'),
//   deviceName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
//   brand: z.string().min(2, 'Ingresa la marca del dispositivo'),
//   model: z.string().min(2, 'Ingresa el modelo del dispositivo'),
//   estimatedWeight: z.number()
//     .min(0.1, 'El peso mínimo es 0.1 kg')
//     .max(50, 'El peso máximo es 50 kg'),
//   condition: z.enum(['excellent', 'good', 'fair', 'poor'], {
//     message: 'Selecciona el estado del dispositivo'
//   }),
//   description: z.string()
//     .min(20, 'La descripción debe tener al menos 20 caracteres')
//     .max(500, 'La descripción no puede exceder 500 caracteres'),
//   hasCharger: z.boolean(),
//   hasBox: z.boolean(),
//   hasDocuments: z.boolean(),
// });

// type SellItemFormData = z.infer<typeof sellItemSchema>;

// const conditionOptions = [
//   { value: 'excellent', label: 'Excelente - Como nuevo' },
//   { value: 'good', label: 'Bueno - Funciona perfectamente' },
//   { value: 'fair', label: 'Regular - Funciona con defectos menores' },
//   { value: 'poor', label: 'Malo - No funciona o tiene daños graves' }
// ];

// const conditionMultipliers = {
//   excellent: 1.0,
//   good: 0.8,
//   fair: 0.6,
//   poor: 0.3
// };

// const CategoryCard: React.FC<{
//   category: typeof categories[0];
//   isSelected: boolean;
//   onSelect: (categoryId: string) => void;
// }> = ({ category, isSelected, onSelect }) => (
//   <Card 
//     className={`cursor-pointer transition-all duration-200 ${
//       isSelected 
//         ? 'ring-2 ring-primary-500 bg-primary-50' 
//         : 'hover:shadow-md hover:scale-105'
//     }`}
//     onClick={() => onSelect(category.id)}
//   >
//     <CardContent className="p-4">
//       <div className="text-center">
//         <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
//           <ScaleIcon className="h-8 w-8 text-gray-600" />
//         </div>
//         <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
//         <p className="text-xs text-gray-600 mb-2">{category.description}</p>
//         <Badge variant="outline" className="mb-2">
//           ~${category.pricePerKg}/kg
//         </Badge>
//         <p className="text-xs text-gray-500">
//           ${category.minPrice} - ${category.maxPrice}
//         </p>
//       </div>
//     </CardContent>
//   </Card>
// );

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [images, setImages] = useState<File[]>([]);
//   const [showEstimate, setShowEstimate] = useState(false);
//   const [estimatedValue, setEstimatedValue] = useState(0);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isValid }
//   } = useForm<SellItemFormData>({
//     resolver: zodResolver(sellItemSchema),
//     mode: 'onChange',
//     defaultValues: {
//       hasCharger: false,
//       hasBox: false,
//       hasDocuments: false,
//     }
//   });

//   const watchedValues = watch();

//   // Calculate estimated value
//   React.useEffect(() => {
//     if (selectedCategory && watchedValues.estimatedWeight && watchedValues.condition) {
//       const category = categories.find(c => c.id === selectedCategory);
//       if (category) {
//         const baseValue = category.pricePerKg * watchedValues.estimatedWeight;
//         const conditionMultiplier = conditionMultipliers[watchedValues.condition];
//         const accessoryBonus = (
//           (watchedValues.hasCharger ? 0.1 : 0) +
//           (watchedValues.hasBox ? 0.05 : 0) +
//           (watchedValues.hasDocuments ? 0.05 : 0)
//         );
        
//         const finalValue = baseValue * conditionMultiplier * (1 + accessoryBonus);
//         setEstimatedValue(Math.round(finalValue));
//         setShowEstimate(true);
//       }
//     } else {
//       setShowEstimate(false);
//     }
//   }, [selectedCategory, watchedValues.estimatedWeight, watchedValues.condition, watchedValues.hasCharger, watchedValues.hasBox, watchedValues.hasDocuments]);

//   const onSubmit = async (data: SellItemFormData) => {
//     if (images.length === 0) {
//       alert('Debes subir al menos una foto del dispositivo');
//       return;
//     }

//     setShowConfirmModal(true);
//   };

//   const handleConfirmSubmit = async () => {
//     setIsSubmitting(true);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // Mock order creation
//     const orderId = 'ORD-' + Date.now();
    
//     // Navigate to order detail or success page
//     navigate(`/orders/${orderId}`, {
//       state: {
//         message: '¡Orden creada exitosamente! Te contactaremos pronto para coordinar la recolección.',
//         orderData: {
//           ...watchedValues,
//           categoryId: selectedCategory,
//           estimatedValue,
//           images: images.length,
//           orderId
//         }
//       }
//     });
//   };

//   const selectedCategoryData = categories.find(c => c.id === selectedCategory);

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Vender Chatarra Electrónica"
//         description="Convierte tus dispositivos electrónicos en dinero de forma fácil y segura"
//       />

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         {/* Step 1: Category Selection */}
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">
//               1. Selecciona la categoría de tu dispositivo
//             </h3>
            
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//               {categories.map((category) => (
//                 <CategoryCard
//                   key={category.id}
//                   category={category}
//                   isSelected={selectedCategory === category.id}
//                   onSelect={(categoryId) => {
//                     setSelectedCategory(categoryId);
//                     setValue('categoryId', categoryId);
//                   }}
//                 />
//               ))}
//             </div>
            
//             {errors.categoryId && (
//               <p className="text-sm text-danger-600 mt-2">{errors.categoryId.message}</p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Step 2: Device Details */}
//         {selectedCategory && (
//           <Card>
//             <CardContent className="p-6">
//               <h3 className="text-lg font-semibold mb-4">
//                 2. Detalles del dispositivo
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Input
//                   {...register('deviceName')}
//                   label="Nombre del dispositivo"
//                   placeholder="ej: iPhone 13 Pro"
//                   error={errors.deviceName?.message}
//                   required
//                 />
                
//                 <Input
//                   {...register('brand')}
//                   label="Marca"
//                   placeholder="ej: Apple"
//                   error={errors.brand?.message}
//                   required
//                 />
                
//                 <Input
//                   {...register('model')}
//                   label="Modelo"
//                   placeholder="ej: A2643"
//                   error={errors.model?.message}
//                   required
//                 />
                
//                 <Input
//                   {...register('estimatedWeight', { valueAsNumber: true })}
//                   type="number"
//                   step="0.1"
//                   label="Peso estimado (kg)"
//                   placeholder="ej: 1.5"
//                   error={errors.estimatedWeight?.message}
//                   helperText="Peso aproximado del dispositivo"
//                   required
//                 />
//               </div>

//               <div className="mt-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Estado del dispositivo *
//                 </label>
//                 <select
//                   {...register('condition')}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="">Selecciona el estado</option>
//                   {conditionOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.condition && (
//                   <p className="text-sm text-danger-600 mt-1">{errors.condition.message}</p>
//                 )}
//               </div>

//               <div className="mt-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Descripción *
//                 </label>
//                 <textarea
//                   {...register('description')}
//                   rows={4}
//                   placeholder="Describe el estado del dispositivo, cualquier daño, si funciona correctamente, etc."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                 />
//                 {errors.description && (
//                   <p className="text-sm text-danger-600 mt-1">{errors.description.message}</p>
//                 )}
//                 <p className="text-xs text-gray-500 mt-1">
//                   {watchedValues.description?.length || 0}/500 caracteres
//                 </p>
//               </div>

//               {/* Accessories */}
//               <div className="mt-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Accesorios incluidos
//                 </label>
//                 <div className="space-y-2">
//                   <label className="flex items-center">
//                     <input
//                       {...register('hasCharger')}
//                       type="checkbox"
//                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       Cargador original (+10% valor)
//                     </span>
//                   </label>
                  
//                   <label className="flex items-center">
//                     <input
//                       {...register('hasBox')}
//                       type="checkbox"
//                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       Caja original (+5% valor)
//                     </span>
//                   </label>
                  
//                   <label className="flex items-center">
//                     <input
//                       {...register('hasDocuments')}
//                       type="checkbox"
//                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">
//                       Documentos/Manuales (+5% valor)
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Step 3: Images */}
//         {selectedCategory && (
//           <Card>
//             <CardContent className="p-6">
//               <h3 className="text-lg font-semibold mb-4">
//                 3. Fotos del dispositivo
//               </h3>
              
//               <Alert variant="default" className="mb-4">
//                 <InformationCircleIcon className="h-4 w-4" />
//                 <div>
//                   <p className="font-medium">Consejos para mejores fotos:</p>
//                   <ul className="text-sm mt-1 space-y-1">
//                     <li>• Toma fotos con buena iluminación</li>
//                     <li>• Incluye fotos de todos los ángulos</li>
//                     <li>• Muestra claramente cualquier daño</li>
//                     <li>• Incluye accesorios si los tienes</li>
//                   </ul>
//                 </div>
//               </Alert>

//               <FileUpload
//                 selectedFiles={images}
//                 onFilesSelect={(newFiles) => setImages([...images, ...newFiles])}
//                 onFileRemove={(index) => setImages(images.filter((_, i) => i !== index))}
//                 maxFiles={5}
//                 label="Sube fotos de tu dispositivo"
//               />
//             </CardContent>
//           </Card>
//         )}

//         {/* Step 4: Estimated Value */}
//         {showEstimate && (
//           <Card>
//             <CardContent className="p-6">
//               <h3 className="text-lg font-semibold mb-4">
//                 4. Valor estimado
//               </h3>
              
//               <div className="bg-primary-50 rounded-lg p-6 text-center">
//                 <CurrencyDollarIcon className="h-12 w-12 text-primary-600 mx-auto mb-3" />
//                 <p className="text-3xl font-bold text-primary-600 mb-2">
//                   ${estimatedValue}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Valor estimado basado en la información proporcionada
//                 </p>
                
//                 {selectedCategoryData && (
//                   <div className="text-left space-y-2 max-w-md mx-auto">
//                     <div className="flex justify-between text-sm">
//                       <span>Precio base ({selectedCategoryData.pricePerKg}/kg × {watchedValues.estimatedWeight}kg):</span>
//                       <span>${Math.round(selectedCategoryData.pricePerKg * watchedValues.estimatedWeight)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Condición ({watchedValues.condition}):</span>
//                       <span>×{conditionMultipliers[watchedValues.condition]}</span>
//                     </div>
//                     {(watchedValues.hasCharger || watchedValues.hasBox || watchedValues.hasDocuments) && (
//                       <div className="flex justify-between text-sm">
//                         <span>Bonus accesorios:</span>
//                         <span>+{((watchedValues.hasCharger ? 10 : 0) + (watchedValues.hasBox ? 5 : 0) + (watchedValues.hasDocuments ? 5 : 0))}%</span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               <Alert variant="warning" className="mt-4">
//                 <InformationCircleIcon className="h-4 w-4" />
//                 <div>
//                   <p className="font-medium">Nota importante:</p>
//                   <p className="text-sm">
//                     Este es un valor estimado. El valor final se determinará después de la 
//                     verificación física del dispositivo en nuestras instalaciones.
//                   </p>
//                 </div>
//               </Alert>
//             </CardContent>
//           </Card>
//         )}

//         {/* Submit Button */}
//         {selectedCategory && (
//           <div className="flex justify-center">
//             <Button
//               type="submit"
//               size="lg"
//               disabled={!isValid || images.length === 0}
//               className="min-w-48"
//             >
//               Crear Orden de Venta
//             </Button>
//           </div>
//         )}
//       </form>

//       {/* Confirmation Modal */}
//       <Modal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         title="Confirmar orden de venta"
//         size="md"
//       >
//         <ModalContent>
//           <div className="space-y-4">
//             <p className="text-gray-600">
//               ¿Estás seguro de que quieres crear esta orden de venta?
//             </p>
            
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="font-medium mb-2">Resumen de la orden:</h4>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between">
//                   <span>Dispositivo:</span>
//                   <span>{watchedValues.deviceName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Peso:</span>
//                   <span>{watchedValues.estimatedWeight} kg</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Estado:</span>
//                   <span>{conditionOptions.find(c => c.value === watchedValues.condition)?.label}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Fotos:</span>
//                   <span>{images.length} imagen{images.length !== 1 ? 'es' : ''}</span>
//                 </div>
//                 <div className="flex justify-between font-medium text-primary-600 border-t pt-2 mt-2">
//                   <span>Valor estimado:</span>
//                   <span>${estimatedValue}</span>
//                 </div>
//               </div>
//             </div>
            
//             <Alert variant="default">
//               <CheckCircleIcon className="h-4 w-4" />
//               <div>
//                 <p className="text-sm">
//                   Te contactaremos dentro de 24 horas para coordinar la recolección 
//                   de tu dispositivo.
//                 </p>
//               </div>
//             </Alert>
//           </div>
//         </ModalContent>
        
//         <ModalFooter>
//           <Button
//             variant="outline"
//             onClick={() => setShowConfirmModal(false)}
//             disabled={isSubmitting}
//           >
//             Cancelar
//           </Button>
//           <Button
//             onClick={handleConfirmSubmit}
//             loading={isSubmitting}
//           >
//             Confirmar Orden
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// };

// export default SellPage;








// // src/pages/dashboard/SellPage.tsx
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ArrowLeftIcon,
//   ShoppingCartIcon,
//   PlusIcon
// } from '@heroicons/react/24/outline';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { CategorySelector } from '@/components/categories/CategorySelector';
// import { CategoryDetails } from '@/components/categories/CategoryDetails';
// // import { DeviceForm } from '@/components/sell/DeviceForm';
// // import { CartSummary } from '@/components/sell/CartSummary';
// import { Category, CartItemData, CategoryType } from '@/types/categories';

// type SellStep = 'category-selection' | 'category-details' | 'device-form' | 'cart-review';

// export const SellPage: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState<SellStep>('category-selection');
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [cartItems, setCartItems] = useState<CartItemData[]>([]);
//   const [showCart, setShowCart] = useState(false);

//   // Navigation handlers
//   const handleCategorySelect = (category: Category) => {
//     setSelectedCategory(category);
//     setCurrentStep('category-details');
//   };

//   const handleCategoryConfirm = (category: Category) => {
//     setSelectedCategory(category);
//     setCurrentStep('device-form');
//   };

//   const handleDeviceAdd = (deviceData: Omit<CartItemData, 'addedAt'>) => {
//     const newItem: CartItemData = {
//       ...deviceData,
//       addedAt: new Date().toISOString()
//     };
    
//     setCartItems(prev => [...prev, newItem]);
//     setCurrentStep('category-selection');
//     setSelectedCategory(null);
//   };

//   const handleBackToCategories = () => {
//     setCurrentStep('category-selection');
//     setSelectedCategory(null);
//   };

//   const handleBackToCategoryDetails = () => {
//     setCurrentStep('category-details');
//   };

//   const handleRemoveItem = (index: number) => {
//     setCartItems(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleClearCart = () => {
//     setCartItems([]);
//     setShowCart(false);
//   };

//   const handleCheckout = () => {
//     // TODO: Implement checkout logic
//     console.log('Proceeding to checkout with items:', cartItems);
//   };

//   // Calculate cart totals
//   const cartTotal = cartItems.reduce((sum, item) => sum + item.estimatedPrice, 0);
//   const cartItemCount = cartItems.length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Vender Dispositivos
//               </h1>
//               <p className="text-gray-600">
//                 Convierte tu chatarra electrónica en dinero de forma rápida y segura
//               </p>
//             </div>
            
//             {/* Cart Button */}
//             {cartItemCount > 0 && (
//               <div className="relative">
//                 <Button
//                   onClick={() => setShowCart(!showCart)}
//                   className="bg-[#a8c241] hover:bg-[#8ea635] text-white relative"
//                 >
//                   <ShoppingCartIcon className="h-5 w-5 mr-2" />
//                   Carrito ({cartItemCount})
//                   <Badge 
//                     className="absolute -top-2 -right-2 bg-red-500 text-white"
//                   >
//                     {cartItemCount}
//                   </Badge>
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Progress Steps */}
//           <div className="mt-6">
//             <StepIndicator 
//               currentStep={currentStep} 
//               cartItemCount={cartItemCount}
//             />
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-4 gap-8">
          
//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <AnimatePresence mode="wait">
              
//               {/* Step 1: Category Selection */}
//               {currentStep === 'category-selection' && (
//                 <motion.div
//                   key="category-selection"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <CategorySelector
//                     onCategorySelect={handleCategorySelect} types={[]} categories={[]} onTypeSelect={function (type: CategoryType): void {
//                       throw new Error('Function not implemented.');
//                     } }                  />
//                 </motion.div>
//               )}

//               {/* Step 2: Category Details */}
//               {currentStep === 'category-details' && selectedCategory && (
//                 <motion.div
//                   key="category-details"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <CategoryDetails
//                     categoryId={selectedCategory.id}
//                     onBack={handleBackToCategories}
//                     onAddToCart={handleCategoryConfirm}
//                   />
//                 </motion.div>
//               )}

//               {/* Step 3: Device Form */}
//               {currentStep === 'device-form' && selectedCategory && (
//                 <motion.div
//                   key="device-form"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {/* <DeviceForm
//                     category={selectedCategory}
//                     onBack={handleBackToCategoryDetails}
//                     onSubmit={handleDeviceAdd}
//                   /> */}
//                 </motion.div>
//               )}

//             </AnimatePresence>
//           </div>

//           {/* Sidebar - Cart */}
//           {/* <div className="lg:col-span-1">
//             <div className="sticky top-8">
//               <CartSummary
//                 items={cartItems}
//                 total={cartTotal}
//                 onRemoveItem={handleRemoveItem}
//                 onClearCart={handleClearCart}
//                 onCheckout={handleCheckout}
//                 onAddMore={() => setCurrentStep('category-selection')}
//                 isVisible={showCart || cartItemCount > 0}
//               />
//             </div>
//           </div> */}
//         </div>

//         {/* Floating Add Button */}
//         {cartItemCount > 0 && currentStep === 'category-selection' && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             className="fixed bottom-8 right-8 z-50"
//           >
//             <Button
//               onClick={() => setCurrentStep('category-selection')}
//               className="bg-[#a8c241] hover:bg-[#8ea635] text-white rounded-full h-14 w-14 shadow-lg"
//             >
//               <PlusIcon className="h-6 w-6" />
//             </Button>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Step Indicator Component
// interface StepIndicatorProps {
//   currentStep: SellStep;
//   cartItemCount: number;
// }

// const StepIndicator: React.FC<StepIndicatorProps> = ({ 
//   currentStep, 
//   cartItemCount 
// }) => {
//   const steps = [
//     { 
//       id: 'category-selection', 
//       label: 'Seleccionar Categoría', 
//       completed: cartItemCount > 0 || ['category-details', 'device-form'].includes(currentStep)
//     },
//     { 
//       id: 'category-details', 
//       label: 'Detalles', 
//       completed: ['device-form'].includes(currentStep)
//     },
//     { 
//       id: 'device-form', 
//       label: 'Información del Dispositivo', 
//       completed: false
//     }
//   ];

//   return (
//     <div className="flex items-center space-x-4">
//       {steps.map((step, index) => {
//         const isActive = step.id === currentStep;
//         const isCompleted = step.completed;
        
//         return (
//           <React.Fragment key={step.id}>
//             <div className="flex items-center space-x-2">
//               <div className={`
//                 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
//                 ${isCompleted 
//                   ? 'bg-green-500 text-white' 
//                   : isActive 
//                     ? 'bg-[#a8c241] text-white' 
//                     : 'bg-gray-200 text-gray-500'
//                 }
//               `}>
//                 {isCompleted ? '✓' : index + 1}
//               </div>
//               <span className={`
//                 text-sm font-medium
//                 ${isActive 
//                   ? 'text-[#a8c241]' 
//                   : isCompleted 
//                     ? 'text-green-600' 
//                     : 'text-gray-500'
//                 }
//               `}>
//                 {step.label}
//               </span>
//             </div>
            
//             {index < steps.length - 1 && (
//               <div className={`
//                 flex-1 h-0.5
//                 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
//               `} />
//             )}
//           </React.Fragment>
//         );
//       })}
//     </div>
//   );
// };

// export default SellPage;









// // src/pages/dashboard/SellPage.tsx - FIXED VERSION
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ArrowLeftIcon,
//   ShoppingCartIcon,
//   PlusIcon
// } from '@heroicons/react/24/outline';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { CategorySelector } from '@/components/categories/CategorySelector';
// import { CategoryDetails } from '@/components/categories/CategoryDetails';
// import { useCategories } from '@/hooks/useCategories';
// import { Category, CartItemData, DeviceCondition, CategoryType } from '@/types/categories';

// type SellStep = 'category-selection' | 'category-details' | 'device-form' | 'cart-review';

// export const SellPage: React.FC = () => {
//   // 🔧 FIX: Usar el hook corregido
//   const categories = useCategories();
  
//   const [currentStep, setCurrentStep] = useState<SellStep>('category-selection');
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [cartItems, setCartItems] = useState<CartItemData[]>([]);
//   const [showCart, setShowCart] = useState(false);

//   // 🔧 FIX: Memoized handlers para evitar re-renders
//   const handleCategorySelect = useCallback((category: Category) => {
//     console.log('🎯 Category selected:', category.name);
//     setSelectedCategory(category);
//     setCurrentStep('category-details');
//   }, []);

//   const handleCategoryConfirm = useCallback((category: Category) => {
//     console.log('✅ Category confirmed:', category.name);
//     setSelectedCategory(category);
//     setCurrentStep('device-form');
//   }, []);

//   const handleDeviceAdd = useCallback((deviceData: Omit<CartItemData, 'addedAt'>) => {
//     const newItem: CartItemData = {
//       ...deviceData,
//       addedAt: new Date().toISOString()
//     };
    
//     console.log('➕ Device added to cart:', newItem);
//     setCartItems(prev => [...prev, newItem]);
    
//     // Volver a selección de categorías para agregar más items
//     setCurrentStep('category-selection');
//     setSelectedCategory(null);
//   }, []);

//   const handleBackStep = useCallback(() => {
//     switch (currentStep) {
//       case 'category-details':
//         setCurrentStep('category-selection');
//         setSelectedCategory(null);
//         break;
//       case 'device-form':
//         setCurrentStep('category-details');
//         break;
//       case 'cart-review':
//         setCurrentStep('category-selection');
//         break;
//       default:
//         setCurrentStep('category-selection');
//     }
//   }, [currentStep]);

//   const handleCartToggle = useCallback(() => {
//     setShowCart(prev => !prev);
//   }, []);

//   const handleCartReview = useCallback(() => {
//     setCurrentStep('cart-review');
//     setShowCart(false);
//   }, []);

//   // 🔧 FIX: Memoizar valores computados
//   const cartTotal = useMemo(() => {
//     return cartItems.reduce((total, item) => total + (item.estimatedPrice || 0), 0);
//   }, [cartItems]);

//   const cartItemCount = useMemo(() => {
//     return cartItems.length;
//   }, [cartItems]);

//   // 🔧 FIX: Error boundary para mostrar errores
//   if (categories.error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center p-8 max-w-md">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             Error al cargar categorías
//           </h2>
//           <p className="text-gray-600 mb-4">
//             {categories.error}
//           </p>
//           <Button 
//             onClick={categories.refresh}
//             loading={categories.loading}
//           >
//             Reintentar
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // 🔧 FIX: Loading state mejorado
//   if (categories.loading && categories.types.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Cargando categorías...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               {/* Back Button */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleBackStep}
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 <ArrowLeftIcon className="h-5 w-5 mr-2" />
//                 Atrás
//               </Button>

//               {/* Steps Indicator */}
//               <div className="flex items-center space-x-2 text-sm text-gray-500">
//                 <span className={currentStep === 'category-selection' ? 'font-medium text-primary-600' : ''}>
//                   1. Seleccionar Categoría
//                 </span>
//                 <span>→</span>
//                 <span className={currentStep === 'category-details' ? 'font-medium text-primary-600' : ''}>
//                   2. Detalles
//                 </span>
//                 <span>→</span>
//                 <span className={currentStep === 'device-form' ? 'font-medium text-primary-600' : ''}>
//                   3. Información del Dispositivo
//                 </span>
//               </div>
//             </div>

//             {/* Cart Button */}
//             <Button
//               variant="outline"
//               onClick={handleCartToggle}
//               className="relative"
//             >
//               <ShoppingCartIcon className="h-5 w-5 mr-2" />
//               Carrito
//               {cartItemCount > 0 && (
//                 <Badge 
//                   variant="danger" 
//                   className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
//                 >
//                   {cartItemCount}
//                 </Badge>
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <AnimatePresence mode="wait">
//           {/* Step 1: Category Selection */}
//           {currentStep === 'category-selection' && (
//             <motion.div
//               key="category-selection"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="mb-6">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   Convertir tu chatarra electrónica en dinero de forma rápida y segura
//                 </h1>
//                 <p className="text-gray-600">
//                   Selecciona la categoría de tu dispositivo para comenzar
//                 </p>
//               </div>
              
//               <CategorySelector
//                 types={categories.types}
//                 categories={categories.currentCategories}
//                 selectedType={categories.selectedType}
//                 onTypeSelect={categories.selectType}
//                 onCategorySelect={handleCategorySelect}
//                 loading={categories.loading}
//               />
//             </motion.div>
//           )}

//           {/* Step 2: Category Details */}
//           {currentStep === 'category-details' && selectedCategory && (
//             <motion.div
//               key="category-details"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <CategoryDetails
//                 category={selectedCategory}
//                 onBack={handleBackStep} onConfirm={function (category: Category): void {
//                   throw new Error('Function not implemented.');
//                 } }              />
//             </motion.div>
//           )}

//           {/* Step 3: Device Form */}
//           {currentStep === 'device-form' && selectedCategory && (
//             <motion.div
//               key="device-form"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {/* DeviceForm component will be implemented */}
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-2xl font-bold mb-4">
//                   Información del dispositivo: {selectedCategory.name}
//                 </h2>
//                 <p className="text-gray-600 mb-4">
//                   Proporciona los detalles de tu dispositivo para obtener una cotización precisa.
//                 </p>
                
//                 {/* Placeholder for DeviceForm */}
//                 <div className="space-y-4">
//                   <div className="p-4 bg-gray-100 rounded-lg">
//                     <p className="text-sm text-gray-600">
//                       DeviceForm component será implementado aquí
//                     </p>
//                   </div>
                  
//                   <div className="flex space-x-4">
//                     <Button variant="outline" onClick={handleBackStep}>
//                       Atrás
//                     </Button>
//                     <Button onClick={() => {
//                       // Mock device data for now
//                       handleDeviceAdd({
//                         categoryId: selectedCategory.id,
//                         categoryName: selectedCategory.name,

//                         // Mock data
//                         condition: DeviceCondition.GOOD,
//                         weight: 1,
//                         description: 'Mock device',
//                         images: [],
//                         id: '',
//                         estimatedValue: 0,
//                         estimatedPrice: 0
//                       });
//                     }}>
//                       Agregar al Carrito
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Cart Sidebar */}
//       <AnimatePresence>
//         {showCart && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50 z-50"
//               onClick={handleCartToggle}
//             />
            
//             {/* Cart Panel */}
//             <motion.div
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ type: 'tween', duration: 0.3 }}
//               className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto"
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold">Carrito de Compras</h2>
//                   <Button variant="ghost" size="sm" onClick={handleCartToggle}>
//                     ×
//                   </Button>
//                 </div>
                
//                 {cartItems.length === 0 ? (
//                   <div className="text-center text-gray-500 py-8">
//                     <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                     <p>Tu carrito está vacío</p>
//                   </div>
//                 ) : (
//                   <>
//                     {/* Cart Items */}
//                     <div className="space-y-4 mb-6">
//                       {cartItems.map((item, index) => (
//                         <div key={index} className="border rounded-lg p-4">
//                           <h3 className="font-semibold">{item.categoryName}</h3>
//                           <p className="text-sm text-gray-600">{item.description}</p>
//                           <p className="text-lg font-bold text-primary-600">
//                             ${item.estimatedPrice}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* Cart Total */}
//                     <div className="border-t pt-4 mb-6">
//                       <div className="flex justify-between text-xl font-bold">
//                         <span>Total:</span>
//                         <span className="text-primary-600">${cartTotal}</span>
//                       </div>
//                     </div>
                    
//                     {/* Cart Actions */}
//                     <div className="space-y-3">
//                       <Button onClick={handleCartReview} className="w-full">
//                         Revisar Orden
//                       </Button>
//                       <Button variant="outline" className="w-full">
//                         <PlusIcon className="h-4 w-4 mr-2" />
//                         Agregar más dispositivos
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default SellPage;




// // src/pages/CategorySelectionPage.tsx - PÁGINA COMPLETA
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { 
//   ArrowRightIcon, 
//   ArrowLeftIcon,
//   CheckCircleIcon,
//   InformationCircleIcon 
// } from '@heroicons/react/24/outline';
// import { Category } from '@/types/categories';
// import CategorySelector from '@/components/categories/CategorySelector';
// import DeviceTypeSelector from '@/components/categories/DeviceTypeSelector';
// import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { Alert } from '@/components/ui/Alert';
// import { PageHeader } from '@/components/layout/PageHeader';

// type DeviceType = 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES';
// type SelectionStep = 'type' | 'category';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Estado de la selección
//   const [currentStep, setCurrentStep] = useState<SelectionStep>('type');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  
//   // Datos que pueden venir de la navegación anterior
//   const orderData = location.state?.orderData || {};

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = (type: DeviceType) => {
//     setSelectedDeviceType(type);
    
//     // Limpiar selección anterior si cambió el tipo
//     if (selectedCategory && selectedCategory.type !== type) {
//       setSelectedCategory(null);
//       setSelectedPath([]);
//     }
//   };

//   // Continuar a selección de categorías
//   const handleContinueToCategories = () => {
//     if (!selectedDeviceType) return;
//     setCurrentStep('category');
//   };

//   // Volver a selección de tipo
//   const handleBackToType = () => {
//     setCurrentStep('type');
//   };

//   // Manejar selección de categoría
//   const handleCategorySelect = (category: Category) => {
//     console.log('Categoría seleccionada:', category);
//     setSelectedCategory(category);
//   };

//   // Manejar cambios en el path
//   const handlePathChange = (path: Category[]) => {
//     setSelectedPath(path);
//   };

//   // Continuar al siguiente paso
//   const handleContinue = () => {
//     if (!selectedCategory || !selectedDeviceType) return;

//     // Navegar al siguiente paso con los datos
//     navigate('/create-order/details', {
//       state: {
//         orderData: {
//           ...orderData,
//           deviceType: selectedDeviceType,
//           category: selectedCategory,
//           categoryPath: selectedPath
//         }
//       }
//     });
//   };

//   // Volver al paso anterior
//   const handleGoBack = () => {
//     if (currentStep === 'category') {
//       setCurrentStep('type');
//     } else {
//       navigate(-1);
//     }
//   };

//   // Calcular valor estimado basado en peso
//   const calculateEstimatedValue = (weight: number): number => {
//     if (!selectedCategory?.pricePerKg) return 0;
//     return selectedCategory.pricePerKg * weight;
//   };

//   // Obtener título dinámico según el paso
//   const getPageTitle = () => {
//     switch (currentStep) {
//       case 'type':
//         return 'Tipo de Dispositivo';
//       case 'category':
//         return selectedDeviceType === 'COMPLETE_DEVICES' 
//           ? 'Selecciona tu Dispositivo' 
//           : 'Selecciona los Componentes';
//       default:
//         return 'Selección de Categoría';
//     }
//   };

//   // Obtener subtitle dinámico
//   const getPageSubtitle = () => {
//     switch (currentStep) {
//       case 'type':
//         return 'Primero, dinos si tienes un dispositivo completo o componentes por separado';
//       case 'category':
//         return selectedDeviceType === 'COMPLETE_DEVICES'
//           ? 'Encuentra tu dispositivo específico en nuestro catálogo'
//           : 'Navega por las categorías hasta encontrar la más específica para tus componentes';
//       default:
//         return '';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <PageHeader
//         title={getPageTitle()}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Progress Indicator */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center space-x-4">
//             <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
//               currentStep === 'type' 
//                 ? 'bg-blue-100 text-blue-800' 
//                 : 'bg-green-100 text-green-800'
//             }`}>
//               <span className="font-medium">1</span>
//               <span>Tipo de dispositivo</span>
//               {currentStep !== 'type' && <CheckCircleIcon className="w-4 h-4" />}
//             </div>
            
//             <div className={`w-8 h-0.5 ${
//               currentStep === 'category' ? 'bg-blue-500' : 'bg-gray-300'
//             }`} />
            
//             <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
//               currentStep === 'category' 
//                 ? 'bg-blue-100 text-blue-800' 
//                 : 'bg-gray-100 text-gray-600'
//             }`}>
//               <span className="font-medium">2</span>
//               <span>Categoría específica</span>
//               {selectedCategory && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
//             </div>
//           </div>
//         </div>

//         {/* Step 1: Device Type Selection */}
//         {currentStep === 'type' && (
//           <div className="space-y-8">
//             <DeviceTypeSelector
//               onTypeSelect={handleDeviceTypeSelect}
//               selectedType={selectedDeviceType || undefined}
//             />
//           </div>
//         )}

//         {/* Step 2: Category Selection */}
//         {currentStep === 'category' && selectedDeviceType && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
//             {/* Columna principal - Selector */}
//             <div className="lg:col-span-2">
//               <CategorySelector
//                 type={selectedDeviceType}
//                 onCategorySelect={handleCategorySelect}
//                 onPathChange={handlePathChange}
//                 selectedCategoryId={selectedCategory?.id}
//               />
//             </div>

//             {/* Sidebar - Resumen y acciones */}
//             <div className="space-y-6">
              
//               {/* Tipo seleccionado */}
//               <Card className="border-blue-200 bg-blue-50">
//                 <CardHeader className="pb-3">
//                   <div className="flex items-center space-x-2">
//                     <CheckCircleIcon className="h-5 w-5 text-blue-600" />
//                     <h3 className="font-semibold text-blue-800">Tipo Seleccionado</h3>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <h4 className="font-semibold text-gray-900">
//                       {selectedDeviceType === 'COMPLETE_DEVICES' 
//                         ? 'Dispositivos Completos' 
//                         : 'Dispositivos Desarmables'}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       {selectedDeviceType === 'COMPLETE_DEVICES'
//                         ? 'Evaluación de dispositivos completos y funcionales'
//                         : 'Evaluación de componentes y materiales reciclables'
//                       }
//                     </p>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={handleBackToType}
//                       className="text-blue-600 hover:text-blue-700 p-0 h-auto"
//                     >
//                       Cambiar tipo →
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Resumen de selección */}
//               {selectedCategory && (
//                 <Card className="border-green-200 bg-green-50">
//                   <CardHeader>
//                     <div className="flex items-center space-x-2">
//                       <CheckCircleIcon className="h-5 w-5 text-green-600" />
//                       <h3 className="font-semibold text-green-800">
//                         Categoría Seleccionada
//                       </h3>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {/* Nombre y path */}
//                       <div>
//                         <h4 className="font-semibold text-gray-900 mb-1">
//                           {selectedCategory.name}
//                         </h4>
//                         <p className="text-sm text-gray-600">
//                           {selectedPath.map(cat => cat.name).join(' > ')}
//                         </p>
//                       </div>

//                       {/* Información de precio */}
//                       {selectedCategory.pricePerKg && (
//                         <div className="bg-white rounded-lg p-4 border border-green-200">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-sm font-medium text-gray-700">
//                               {selectedDeviceType === 'COMPLETE_DEVICES' 
//                                 ? 'Valor de referencia:' 
//                                 : 'Precio por kg:'}
//                             </span>
//                             <Badge variant="secondary" className="bg-green-100 text-green-800">
//                               ${selectedCategory.pricePerKg}/kg
//                             </Badge>
//                           </div>
                          
//                           {/* Calculadora rápida */}
//                           <div className="space-y-2">
//                             <p className="text-xs text-gray-600">
//                               {selectedDeviceType === 'COMPLETE_DEVICES'
//                                 ? 'Estimación por peso del dispositivo:'
//                                 : 'Ejemplos de valor estimado:'
//                               }
//                             </p>
//                             <div className="grid grid-cols-2 gap-2 text-xs">
//                               <div className="flex justify-between">
//                                 <span>{selectedDeviceType === 'COMPLETE_DEVICES' ? '1.5 kg:' : '1 kg:'}</span>
//                                 <span className="font-medium">
//                                   ${calculateEstimatedValue(selectedDeviceType === 'COMPLETE_DEVICES' ? 1.5 : 1).toFixed(2)}
//                                 </span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span>{selectedDeviceType === 'COMPLETE_DEVICES' ? '2.5 kg:' : '5 kg:'}</span>
//                                 <span className="font-medium">
//                                   ${calculateEstimatedValue(selectedDeviceType === 'COMPLETE_DEVICES' ? 2.5 : 5).toFixed(2)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Información adicional */}
//               <Alert>
//                 <InformationCircleIcon className="h-4 w-4" />
//                 <div>
//                   <h4 className="text-sm font-medium">¿No encuentras tu categoría?</h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Si no puedes encontrar la categoría exacta, selecciona la más similar. 
//                     Nuestro equipo técnico realizará la clasificación final durante la verificación.
//                   </p>
//                 </div>
//               </Alert>
//             </div>
//           </div>
//         )}

//         {/* Acciones */}
//         <div className="mt-8 flex items-center justify-between">
//           <Button
//             variant="outline"
//             onClick={handleGoBack}
//             className="flex items-center space-x-2"
//           >
//             <ArrowLeftIcon className="h-4 w-4" />
//             <span>
//               {currentStep === 'type' ? 'Volver' : 'Cambiar tipo'}
//             </span>
//           </Button>

//           {currentStep === 'type' ? (
//             <Button
//               onClick={handleContinueToCategories}
//               disabled={!selectedDeviceType}
//               className="flex items-center space-x-2"
//             >
//               <span>
//                 {selectedDeviceType ? 'Seleccionar categoría' : 'Selecciona un tipo'}
//               </span>
//               <ArrowRightIcon className="h-4 w-4" />
//             </Button>
//           ) : (
//             <Button
//               onClick={handleContinue}
//               disabled={!selectedCategory}
//               className="flex items-center space-x-2"
//             >
//               <span>
//                 {selectedCategory ? 'Continuar con los detalles' : 'Selecciona una categoría'}
//               </span>
//               <ArrowRightIcon className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellPage;








// // src/pages/dashboard/SellPage.tsx - APPLE PAY STYLE CON FUNCIONALIDAD REAL
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ArrowRightIcon, 
//   ArrowLeftIcon,
//   CheckCircleIcon,
//   InformationCircleIcon,
//   DevicePhoneMobileIcon,
//   ComputerDesktopIcon,
//   CpuChipIcon,
//   SparklesIcon,
//   CurrencyDollarIcon,
//   ChevronRightIcon
// } from '@heroicons/react/24/outline';
// import { Category } from '@/types/categories';
// import CategorySelector from '@/components/categories/CategorySelector';
// import DeviceTypeSelector from '@/components/categories/DeviceTypeSelector';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';

// type DeviceType = 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES';
// type SelectionStep = 'type' | 'category';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Estado de la selección
//   const [currentStep, setCurrentStep] = useState<SelectionStep>('type');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  
//   // Datos que pueden venir de la navegación anterior
//   const orderData = location.state?.orderData || {};

//   // Opciones de tipos de dispositivo con diseño Apple
//   const deviceTypes = [
//     {
//       type: 'COMPLETE_DEVICES' as const,
//       title: 'Dispositivos Completos',
//       subtitle: 'Equipos funcionales listos para usar',
//       description: 'Evaluación de dispositivos completos y funcionales',
//       icon: <DevicePhoneMobileIcon className="w-12 h-12" />,
//       color: 'from-[#a8c241] to-[#8ea635]',
//       image: '/public/assets/complete.png'
//     },
//     {
//       type: 'DISMANTLED_DEVICES' as const,
//       title: 'Componentes & Partes',
//       subtitle: 'Placas, chips y componentes individuales',
//       description: 'Evaluación de componentes y materiales reciclables',
//       icon: <CpuChipIcon className="w-12 h-12" />,
//       color: 'from-[#719428] to-[#5d7a1c]',
//       image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800'
//     }
//   ];

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = (type: DeviceType) => {
//     setSelectedDeviceType(type);
    
//     // Limpiar selección anterior si cambió el tipo
//     if (selectedCategory && selectedCategory.type !== type) {
//       setSelectedCategory(null);
//       setSelectedPath([]);
//     }
//   };

//   // Continuar a selección de categorías
//   const handleContinueToCategories = () => {
//     if (!selectedDeviceType) return;
//     setCurrentStep('category');
//   };

//   // Volver a selección de tipo
//   const handleBackToType = () => {
//     setCurrentStep('type');
//   };

//   // Manejar selección de categoría
//   const handleCategorySelect = (category: Category) => {
//     console.log('Categoría seleccionada:', category);
//     setSelectedCategory(category);
//   };

//   // Manejar cambios en el path
//   const handlePathChange = (path: Category[]) => {
//     setSelectedPath(path);
//   };

//   // Continuar al siguiente paso
//   const handleContinue = () => {
//     if (!selectedCategory || !selectedDeviceType) return;

//     // Navegar al siguiente paso con los datos
//     navigate('/sell/device-form', {
//       state: {
//         orderData: {
//           ...orderData,
//           deviceType: selectedDeviceType,
//           category: selectedCategory,
//           categoryPath: selectedPath
//         }
//       }
//     });
//   };

//   // Volver al paso anterior
//   const handleGoBack = () => {
//     if (currentStep === 'category') {
//       setCurrentStep('type');
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   // Calcular valor estimado basado en peso
//   const calculateEstimatedValue = (weight: number): number => {
//     if (!selectedCategory?.pricePerKg) return 0;
//     return selectedCategory.pricePerKg * weight;
//   };

//   return (
//     <div className="min-h-screen bg-[#fafafa]">
//       {/* Header estilo Apple */}
      

//       {/* Contenido principal */}
//       <main className="max-w-6xl mx-auto px-6 py-8">
//         <AnimatePresence mode="wait">
//           {/* Selección inicial de tipo */}
//           {currentStep === 'type' && (
//             <motion.div
//               key="type-selection"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-12"
//             >
             

//               {/* Tipos de dispositivos estilo Apple Pay */}
//               <div className="grid md:grid-cols-2 gap-8">
//                 {deviceTypes.map((deviceType, index) => (
//                   <motion.div
//                     key={deviceType.type}
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 + index * 0.1 }}
//                     whileHover={{ scale: 1.02, y: -4 }}
//                     whileTap={{ scale: 0.98 }}
//                     className={`group cursor-pointer ${
//                       selectedDeviceType === deviceType.type ? 'ring-2 ring-[#a8c241]' : ''
//                     }`}
//                     onClick={() => handleDeviceTypeSelect(deviceType.type)}
//                   >
//                     <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50">
//                       {/* Imagen de fondo */}
//                       <div className="aspect-[3/3] overflow-hidden">
//                         <img
//                           src={deviceType.image}
//                           alt={deviceType.title}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                       </div>
                      
//                       {/* Contenido */}
//                       <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
//                         <div className={`mb-4 p-4 rounded-2xl bg-gradient-to-r ${deviceType.color} w-fit backdrop-blur-sm`}>
//                           {deviceType.icon}
//                         </div>
//                         <h3 className="text-2xl font-bold mb-2">{deviceType.title}</h3>
//                         <p className="text-white/90 mb-4">{deviceType.subtitle}</p>
                        
//                         <div className="flex items-center gap-2 text-sm font-medium">
//                           <span>
//                             {selectedDeviceType === deviceType.type ? 'Seleccionado' : 'Seleccionar'}
//                           </span>
//                           {selectedDeviceType === deviceType.type ? (
//                             <CheckCircleIcon className="w-4 h-4" />
//                           ) : (
//                             <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Botón para continuar */}
//               {selectedDeviceType && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-center"
//                 >
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleContinueToCategories}
//                     className="bg-gradient-to-r from-[#a8c241] to-[#719428] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
//                   >
//                     <span>Continuar a categorías</span>
//                     <ArrowRightIcon className="w-5 h-5" />
//                   </motion.button>
//                 </motion.div>
//               )}
//             </motion.div>
//           )}

//           {/* Selección de categorías estilo Apple Pay */}
//           {currentStep === 'category' && selectedDeviceType && (
//             <motion.div
//               key="category-selection"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="grid grid-cols-1 lg:grid-cols-3 gap-8"
//             >
//               {/* Columna principal - Selector estilo Apple Pay */}
//               <div className="lg:col-span-2 space-y-8">
//                 {/* Header del nivel actual */}
//                 <div className="text-center">
//                   <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a8c241] to-[#719428] text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
//                     <CheckCircleIcon className="w-4 h-4" />
//                     {selectedDeviceType === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes'}
//                   </div>
                  
//                   <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                     Selecciona la categoría específica
//                   </h2>
//                   <p className="text-gray-600">
//                     Navega por las categorías hasta encontrar la más específica para tu dispositivo
//                   </p>
//                 </div>

//                 {/* CategorySelector en contenedor estilo Apple Pay */}
//                 <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-xl overflow-hidden">
//                   <div className="p-8">
//                     <CategorySelector
//                       type={selectedDeviceType}
//                       onCategorySelect={handleCategorySelect}
//                       onPathChange={handlePathChange}
//                       selectedCategoryId={selectedCategory?.id}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Sidebar estilo Apple Pay */}
//               <div className="space-y-6">
//                 {/* Tipo seleccionado con glassmorphism */}
//                 <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-xl">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#a8c241]/5 to-[#719428]/5 rounded-3xl" />
//                   <div className="relative">
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-br from-[#a8c241] to-[#719428] rounded-full flex items-center justify-center">
//                         <CheckCircleIcon className="w-5 h-5 text-white" />
//                       </div>
//                       <h3 className="font-semibold text-gray-900">Tipo Seleccionado</h3>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-2xl p-4 text-white">
//                         <h4 className="font-bold text-lg mb-1">
//                           {selectedDeviceType === 'COMPLETE_DEVICES' 
//                             ? 'Dispositivos Completos' 
//                             : 'Componentes & Partes'}
//                         </h4>
//                         <p className="text-white/90 text-sm">
//                           {deviceTypes.find(t => t.type === selectedDeviceType)?.description}
//                         </p>
//                       </div>
//                       <button
//                         onClick={handleBackToType}
//                         className="w-full flex items-center justify-center gap-2 py-3 text-[#a8c241] hover:bg-[#a8c241]/10 rounded-xl transition-colors font-medium"
//                       >
//                         <ArrowLeftIcon className="w-4 h-4" />
//                         Cambiar tipo
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Resumen de selección estilo Apple Pay */}
//                 {selectedCategory && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.3, ease: "easeOut" }}
//                     className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-green-200/50 shadow-xl overflow-hidden"
//                   >
//                     {/* Fondo animado */}
//                     <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-100/50 rounded-3xl" />
//                     <motion.div 
//                       className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-xl"
//                       animate={{ 
//                         scale: [1, 1.2, 1],
//                         opacity: [0.3, 0.6, 0.3]
//                       }}
//                       transition={{ 
//                         duration: 3,
//                         repeat: Infinity,
//                         ease: "easeInOut"
//                       }}
//                     />
                    
//                     <div className="relative">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
//                           <CheckCircleIcon className="w-5 h-5 text-white" />
//                         </div>
//                         <h3 className="font-semibold text-green-800">Categoría Seleccionada</h3>
//                       </div>
                      
//                       <div className="space-y-4">
//                         {/* Información de la categoría */}
//                         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50">
//                           <h4 className="font-bold text-gray-900 mb-1">
//                             {selectedCategory.name}
//                           </h4>
//                           {selectedPath.length > 0 && (
//                             <div className="flex items-center gap-1 mb-3 flex-wrap">
//                               {selectedPath.map((cat, index) => (
//                                 <React.Fragment key={cat.id}>
//                                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                                     {cat.name}
//                                   </span>
//                                   {index < selectedPath.length - 1 && (
//                                     <ChevronRightIcon className="w-3 h-3 text-green-400" />
//                                   )}
//                                 </React.Fragment>
//                               ))}
//                             </div>
//                           )}
//                         </div>

//                         {/* Información de precio estilo Apple Pay */}
//                         {selectedCategory.pricePerKg && (
//                           <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
//                             <div className="flex items-center justify-between mb-3">
//                               <span className="text-sm font-medium text-gray-700">
//                                 Precio por kilogramo
//                               </span>
//                               <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
//                                 ${selectedCategory.pricePerKg}/kg
//                               </div>
//                             </div>
                            
//                             {/* Calculadora estilo Apple */}
//                             <div className="space-y-3">
//                               <p className="text-xs text-gray-600 font-medium">
//                                 Estimaciones de valor:
//                               </p>
//                               <div className="grid grid-cols-1 gap-2">
//                                 {[1, 2.5, 5].map((weight) => (
//                                   <div key={weight} className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-100">
//                                     <span className="text-sm font-medium text-gray-700">
//                                       {weight} kg
//                                     </span>
//                                     <span className="text-sm font-bold text-green-600">
//                                       ${calculateEstimatedValue(weight).toFixed(2)}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* Botón continuar estilo Apple Pay */}
//                         <motion.button
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                           onClick={handleContinue}
//                           className="w-full bg-gradient-to-r from-[#a8c241] to-[#719428] text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                         >
//                           <span>Continuar con los detalles</span>
//                           <ArrowRightIcon className="w-5 h-5" />
//                         </motion.button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Información adicional estilo Apple */}
//                 <div className="relative bg-blue-50/80 backdrop-blur-xl rounded-3xl p-6 border border-blue-200/50 shadow-lg overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/30 rounded-3xl" />
//                   <div className="relative">
//                     <div className="flex items-start gap-4">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                         <InformationCircleIcon className="w-5 h-5 text-white" />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-blue-900 mb-2">
//                           ¿No encuentras tu categoría?
//                         </h4>
//                         <p className="text-sm text-blue-700 leading-relaxed">
//                           Si no puedes encontrar la categoría exacta, selecciona la más similar. 
//                           Nuestro equipo técnico realizará la clasificación final durante la verificación.
//                         </p>
//                         <div className="mt-3 flex items-center gap-2">
//                           <div className="w-2 h-2 bg-blue-400 rounded-full" />
//                           <span className="text-xs text-blue-600 font-medium">Clasificación profesional incluida</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>


//     </div>
//   );
// };

// export default SellPage;










// src/pages/dashboard/SellPage.tsx - Estilo Amazon/Shopify Inverso
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  StarIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  PhotoIcon,
  TruckIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  FilmIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/categories';
import { CartItem } from '@/types/cart';
import { cn } from '@/utils/cn';
import { ValidationUtils, safeArray, safeArrayLength } from '@/utils/validation.utils';
import SellCartModal from '@/components/sell/SellCartModal';
import CategoryDetailModal from '@/components/sell/CategoryDetailModal';

// Hardcoded category IDs - Reemplaza con los IDs reales de tu BD
const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

const SellPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse'>('marketplace');
  const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('price-desc');

  // Mock data para demostración (eliminar cuando integres con API real)
  const mockPopularCategories = [
    { id: '1', name: 'iPhone 13 - 15 Series', pricePerKg: 850, icon: '📱', estimatedReturn: '$340-$680', condition: 'Excelente estado' },
    { id: '2', name: 'MacBook Pro 2019+', pricePerKg: 1200, icon: '💻', estimatedReturn: '$480-$960', condition: 'Funcional' },
    { id: '3', name: 'Motherboards Alto Grado', pricePerKg: 45, icon: '🔧', estimatedReturn: '$18-$36/kg', condition: 'Con componentes' },
    { id: '4', name: 'Samsung Galaxy S20+', pricePerKg: 650, icon: '📱', estimatedReturn: '$260-$520', condition: 'Buen estado' },
  ];

  const mockRecentSales = [
    { device: 'iPhone 14 Pro', soldFor: '$580', timeAgo: '2 mins ago', seller: 'Maria G.' },
    { device: 'MacBook Air M2', soldFor: '$720', timeAgo: '5 mins ago', seller: 'Carlos R.' },
    { device: 'PlayStation 5', soldFor: '$420', timeAgo: '8 mins ago', seller: 'Ana L.' },
  ];

  // Manejar selección directa de tipo (saltando el GET inicial)
  const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
    setSelectedDeviceType(type);
    setCurrentView('category-browse');
    setLoading(true);
    setError(null);

    try {
      // Ir directo al ID específico sin hacer GET /root
      const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
      
      console.log(`🔄 Attempting to load children for: ${rootId}`);
      const children = await categoryService.getCategoryChildren(rootId);
      
      console.log('🎯 Received children response:', children);
      console.log('📊 Children type:', typeof children);
      console.log('📋 Is array?', Array.isArray(children));
      console.log('📏 Length:', children?.length || 'No length property');
      
      // Validar y limpiar las categorías recibidas
      const validCategories = ValidationUtils.cleanCategoryArray(children);
      
      console.log('✅ Valid categories after cleaning:', validCategories.length);
      
      setCategories(validCategories);
      
      setBreadcrumb([{
        id: rootId,
        name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
        slug: type.toLowerCase(),
        type: type,
        status: 'ACTIVE',
        level: 0,
        path: [],
        fullPath: '',
        isLeaf: false,
        sortOrder: 0,
        images: [],
        createdAt: '',
        updatedAt: ''
      }]);
    } catch (error) {
      console.error('❌ Error in handleDeviceTypeSelect:', error);
      setError(ValidationUtils.getErrorMessage(error));
      setCategories([]); // Asegurar array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Navegar por subcategorías
  const handleCategoryClick = async (category: Category) => {
    if (category.isLeaf) {
      // Es categoría final - abrir modal de detalles
      setSelectedCategoryForModal(category);
      setShowCategoryModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const children = await categoryService.getCategoryChildren(category.id);
      const validCategories = ValidationUtils.cleanCategoryArray(children);
      setCategories(validCategories);
      setBreadcrumb(prev => [...prev, category]);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setError(ValidationUtils.getErrorMessage(error));
      setCategories([]); // Asegurar array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Volver en breadcrumb
  const handleBreadcrumbClick = async (category: Category, index: number) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    
    setLoading(true);
    setError(null);
    
    try {
      const children = await categoryService.getCategoryChildren(category.id);
      const validCategories = ValidationUtils.cleanCategoryArray(children);
      setCategories(validCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError(ValidationUtils.getErrorMessage(error));
      setCategories([]); // Asegurar array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Calcular valor total del carrito
  const cartTotal = safeArray(cart).reduce((sum, item) => {
    const price = ValidationUtils.safeNumber(item.estimatedPrice);
    const quantity = ValidationUtils.safeNumber(item.quantity, 1);
    return sum + (price * quantity);
  }, 0);

  // Handlers para el carrito
  const handleAddToCart = (item: CartItem) => {
    // Validar el item antes de agregarlo
    if (!ValidationUtils.isValidCartItem(item)) {
      console.error('Invalid cart item:', item);
      return;
    }

    setCart(prevCart => {
      const safeCart = safeArray(prevCart);
      const existingIndex = safeCart.findIndex(cartItem => 
        cartItem.categoryId === item.categoryId && 
        cartItem.condition === item.condition
      );
      
      if (existingIndex >= 0) {
        // Si ya existe, actualizar cantidad
        const newCart = [...safeCart];
        newCart[existingIndex].quantity += item.quantity;
        newCart[existingIndex].estimatedPrice = item.estimatedPrice; // Actualizar precio por si cambió
        return newCart;
      } else {
        // Si no existe, agregar nuevo item con ID temporal
        const newItem = { 
          ...item, 
          id: item.id || ValidationUtils.generateTempId()
        };
        return [...safeCart, newItem];
      }
    });
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    if (!ValidationUtils.isValidId(itemId) || !ValidationUtils.isValidNumber(quantity) || quantity < 1) {
      return;
    }

    setCart(prevCart => 
      safeArray(prevCart).map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    if (!ValidationUtils.isValidId(itemId)) {
      return;
    }

    setCart(prevCart => safeArray(prevCart).filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    // Validar el carrito antes del checkout
    const validItems = ValidationUtils.cleanCartItemArray(cart);
    
    if (validItems.length === 0) {
      setError('No hay items válidos en el carrito para proceder');
      return;
    }

    // Navegar al checkout o siguiente paso
    console.log('Proceeding to checkout with cart:', validItems);
    // navigate('/checkout', { state: { cartItems: validItems } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header estilo Amazon */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navegación y búsqueda */}
            <div className="flex items-center space-x-4 flex-1">
              {currentView === 'category-browse' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentView('marketplace')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Volver
                </Button>
              )}
              
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="¿Qué dispositivo quieres vender hoy?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Carrito y acciones */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Estimación total</div>
                <div className="text-lg font-bold text-green-600">${cartTotal.toFixed(2)}</div>
              </div>
              
              <Button className="bg-orange-500 hover:bg-orange-600 text-white relative"
                onClick={() => setShowCartModal(true)}>
                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                Mi Venta ({safeArrayLength(cart)})
                {safeArrayLength(cart) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {safeArrayLength(cart)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Vista Marketplace Principal */}
      {currentView === 'marketplace' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-white p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  Convierte tu electrónica en dinero 💰
                </h1>
                <p className="text-lg mb-6 text-blue-100">
                  Millones de personas confían en Wiru para vender sus dispositivos. 
                  Evaluación instantánea, pago garantizado en 24h.
                </p>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">$2.4M+</div>
                    <div className="text-sm text-blue-200">Pagado este mes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15k+</div>
                    <div className="text-sm text-blue-200">Dispositivos vendidos</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {mockRecentSales.map((sale, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="text-sm font-medium">{sale.device}</div>
                    <div className="text-lg font-bold text-green-300">{sale.soldFor}</div>
                    <div className="text-xs text-blue-200">{sale.timeAgo}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selección de Tipo - Estilo Amazon */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">¿Qué tienes para vender?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Dispositivos Completos */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500 p-6"
                onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="text-3xl">📱</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Dispositivos Completos</h3>
                    <p className="text-gray-600 mb-4">
                      iPhones, laptops, tablets, consolas y más dispositivos funcionales
                    </p>
                    
                    {/* Precios destacados */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">iPhone 13-15</span>
                        <span className="font-semibold text-green-600">$340-$680</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">MacBook Pro</span>
                        <span className="font-semibold text-green-600">$480-$960</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-blue-700">
                        💰 Mayores valores
                      </Badge>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Componentes y Partes */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-500 p-6"
                onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="text-3xl">🔧</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Componentes & Partes</h3>
                    <p className="text-gray-600 mb-4">
                      Motherboards, procesadores, chips y componentes individuales
                    </p>
                    
                    {/* Precios por peso */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Alto Grado</span>
                        <span className="font-semibold text-green-600">$45/kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pentium IV</span>
                        <span className="font-semibold text-green-600">$12/kg</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-green-700">
                        ⚖️ Precio por peso
                      </Badge>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sección de Populares */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Más vendidos hoy 🔥</h2>
              <Button variant="ghost" className="text-blue-600">
                Ver todos
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockPopularCategories.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow p-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                    <div className="text-lg font-bold text-green-600">{item.estimatedReturn}</div>
                    <div className="text-xs text-gray-500">{item.condition}</div>
                    <div className="flex items-center justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="h-3 w-3 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Beneficios y Garantías */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckBadgeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Evaluación Gratuita</h3>
              <p className="text-gray-600 text-sm">Expertos certificados evalúan tu dispositivo sin costo</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Pago Garantizado</h3>
              <p className="text-gray-600 text-sm">Recibe tu dinero en máximo 24 horas hábiles</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Recolección Gratis</h3>
              <p className="text-gray-600 text-sm">Recogemos en tu domicilio o punto Servientrega</p>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Navegación por Categorías */}
      {currentView === 'category-browse' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Breadcrumb estilo Amazon */}
          <div className="flex items-center space-x-2 mb-6 text-sm">
            <span className="text-gray-500">Vender</span>
            {breadcrumb && breadcrumb.map((item, index) => (
              <React.Fragment key={item.id}>
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                <button 
                  onClick={() => handleBreadcrumbClick(item, index)}
                  className="text-blue-600 hover:underline"
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Filtros y ordenamiento */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="border"
              >
                <FilmIcon className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="price-desc">Mayor precio</option>
                <option value="price-asc">Menor precio</option>
                <option value="name">A-Z</option>
                <option value="popular">Más populares</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {safeArrayLength(categories)} categorías disponibles
            </div>
          </div>

          {/* Grid de categorías estilo producto */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Reintentar
              </Button>
            </div>
          ) : !ValidationUtils.isValidArray(categories) ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
              <p className="text-gray-600">No se encontraron categorías para este tipo de dispositivo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {safeArray(categories).map((category) => (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg relative overflow-hidden">
                    {category.thumbnailImage ? (
                      <img 
                        src={category.thumbnailImage} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Badge de precio si es categoría final */}
                    {category.isLeaf && category.pricePerKg && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white">
                          ${category.pricePerKg}/kg
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    {category.isLeaf ? (
                      <div className="space-y-2">
                        {category.pricePerKg && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Precio base:</span>
                            <span className="font-semibold text-green-600">
                              ${category.pricePerKg}/kg
                            </span>
                          </div>
                        )}
                        <Button size="sm" className="w-full">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          Vender aquí
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Ver subcategorías</span>
                        <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <SellCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <CategoryDetailModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={selectedCategoryForModal}
        onAddToCart={(item) => {
          // Ensure item has an id for CartItem type
          const cartItem = {
            ...item,
            id: item.id || ValidationUtils.generateTempId(),
          };
          handleAddToCart(cartItem);
        }}
      />
    </div>
  );
};

export default SellPage;