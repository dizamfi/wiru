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










// // src/pages/dashboard/SellPage.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ShoppingCartIcon,
//   ArrowLeftIcon,
//   ChevronRightIcon,
//   SparklesIcon,
//   TrophyIcon,
//   ClockIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';

// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailModal from '@/components/sell/CategoryDetailModal';

// // IDs de las categorías raíz - Reemplaza con los IDs reales de tu BD
// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Estados principales
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<Category | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Filtros
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('price-desc');

//   // Mock data para demostración
//   const mockPopularCategories = [
//     { id: '1', name: 'iPhone 13 - 15 Series', pricePerKg: 850, icon: '📱', estimatedReturn: '$340-$680', condition: 'Excelente estado' },
//     { id: '2', name: 'MacBook Pro 2019+', pricePerKg: 1200, icon: '💻', estimatedReturn: '$480-$960', condition: 'Funcional' },
//     { id: '3', name: 'Motherboards Alto Grado', pricePerKg: 45, icon: '🔧', estimatedReturn: '$18-$36/kg', condition: 'Con componentes' },
//     { id: '4', name: 'Samsung Galaxy S20+', pricePerKg: 650, icon: '📱', estimatedReturn: '$260-$520', condition: 'Buen estado' },
//   ];

//   const mockRecentSales = [
//     { device: 'iPhone 14 Pro', soldFor: '$580', timeAgo: '2 mins ago', seller: 'Maria G.' },
//     { device: 'MacBook Air M2', soldFor: '$720', timeAgo: '5 mins ago', seller: 'Carlos R.' },
//     { device: 'PlayStation 5', soldFor: '$420', timeAgo: '8 mins ago', seller: 'Ana L.' },
//   ];

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     console.log('🎬 [handleDeviceTypeSelect] Starting with type:', type);
    
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' 
//         ? COMPLETE_DEVICES_ROOT_ID 
//         : DISMANTLED_DEVICES_ROOT_ID;
      
//       console.log(`🔄 [handleDeviceTypeSelect] Loading children for rootId: ${rootId}`);
      
//       // Obtener las categorías hijas
//       const children = await categoryService.getCategoryChildren(rootId);
      
//       console.log('🎯 [handleDeviceTypeSelect] Children received:', {
//         type: typeof children,
//         isArray: Array.isArray(children),
//         length: Array.isArray(children) ? children.length : 'N/A',
//         sample: Array.isArray(children) && children.length > 0 ? children[0] : null
//       });
      
//       // Validar y limpiar las categorías
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       console.log('✅ [handleDeviceTypeSelect] Valid categories:', validCategories.length);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles para este tipo de dispositivo');
//       }
      
//       setCategories(validCategories);
      
//       // Crear breadcrumb inicial
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
      
//       console.log('🎉 [handleDeviceTypeSelect] Success! Categories set:', validCategories.length);
      
//     } catch (error) {
//       console.error('❌ [handleDeviceTypeSelect] Error:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar por subcategorías
//   const handleCategoryClick = async (category: Category) => {
//     console.log('🔍 [handleCategoryClick] Category clicked:', category);
    
//     if (category.isLeaf) {
//       // Es categoría final - abrir modal de detalles
//       console.log('🍃 [handleCategoryClick] Leaf category, opening modal');
//       setSelectedCategoryForModal(category);
//       setShowCategoryModal(true);
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log(`🔄 [handleCategoryClick] Loading children for: ${category.id}`);
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       console.log('✅ [handleCategoryClick] Loaded children:', validCategories.length);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
      
//     } catch (error) {
//       console.error('❌ [handleCategoryClick] Error loading subcategories:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar hacia atrás en el breadcrumb
//   const handleBreadcrumbClick = async (index: number) => {
//     console.log('🔙 [handleBreadcrumbClick] Navigating to index:', index);
    
//     if (index === breadcrumb.length - 1) return; // Ya estamos aquí
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
      
//     } catch (error) {
//       console.error('❌ [handleBreadcrumbClick] Error:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Volver al marketplace
//   const handleBackToMarketplace = () => {
//     console.log('🏠 [handleBackToMarketplace] Returning to marketplace');
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setError(null);
//   };

//   // Agregar al carrito
//   const handleAddToCart = (item: CartItem) => {
//     // Asegurarse de que todos los campos requeridos estén presentes
//     const cartItem: CartItem = {
//       ...item,
//       estimatedValue: item.estimatedValue ?? item.estimatedPrice ?? 0,
//       pricePerKg: item.pricePerKg ?? 0,
//       categoryPath: item.categoryPath ?? '',
//       createdAt: item.createdAt ?? new Date().toISOString(),
//     };
//     console.log('🛒 [handleAddToCart] Adding item to cart:', cartItem);
//     setCart(prev => [...prev, cartItem]);
//     setShowCategoryModal(false);
//   };

//   // Búsqueda
//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
    
//     console.log('🔍 [handleSearch] Searching for:', searchQuery);
//     setLoading(true);
    
//     try {
//       const results = await categoryService.searchCategories(searchQuery, {
//         type: selectedDeviceType || undefined,
//         leafOnly: true
//       });
      
//       setCategories(results);
//     } catch (error) {
//       console.error('❌ [handleSearch] Error:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Categorías filtradas y ordenadas
//   const filteredCategories = React.useMemo(() => {
//     let filtered = [...categories];

//     // Filtrar por rango de precio
//     if (priceRange[0] > 0 || priceRange[1] < 1000) {
//       filtered = filtered.filter(cat => {
//         if (!cat.pricePerKg) return true;
//         const price = parseFloat(cat.pricePerKg.toString());
//         return price >= priceRange[0] && price <= priceRange[1];
//       });
//     }

//     // Ordenar
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'popular':
//           return b.sortOrder - a.sortOrder;
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [categories, priceRange, sortBy]);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {currentView === 'category-browse' && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleBackToMarketplace}
//                   className="flex items-center space-x-2"
//                 >
//                   <ArrowLeftIcon className="w-4 h-4" />
//                   <span>Volver</span>
//                 </Button>
//               )}
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Vender</h1>
//                 <p className="text-sm text-gray-500">
//                   {currentView === 'marketplace' 
//                     ? 'Elige qué quieres vender'
//                     : 'Selecciona la categoría de tu dispositivo'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               {/* Carrito */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowCartModal(true)}
//                 className="relative"
//               >
//                 <ShoppingCartIcon className="w-5 h-5" />
//                 {cart.length > 0 && (
//                   <Badge className="absolute -top-2 -right-2 bg-[#D0FF5B] text-black">
//                     {cart.length}
//                   </Badge>
//                 )}
//                 <span className="ml-2">Mi Venta ({cart.length})</span>
//               </Button>

//               {/* Estimación total */}
//               {cart.length > 0 && (
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Estimación total</p>
//                   <p className="text-lg font-bold text-green-600">
//                     ${cart.reduce((sum, item) => sum + item.estimatedValue, 0).toFixed(2)}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Breadcrumb */}
//           {currentView === 'category-browse' && breadcrumb.length > 0 && (
//             <div className="flex items-center space-x-2 mt-4 text-sm">
//               {breadcrumb.map((crumb, index) => (
//                 <React.Fragment key={crumb.id}>
//                   <button
//                     onClick={() => handleBreadcrumbClick(index)}
//                     className={cn(
//                       'hover:text-[#D0FF5B] transition-colors',
//                       index === breadcrumb.length - 1 
//                         ? 'text-gray-900 font-medium' 
//                         : 'text-gray-500'
//                     )}
//                   >
//                     {crumb.name}
//                   </button>
//                   {index < breadcrumb.length - 1 && (
//                     <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Contenido principal */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {currentView === 'marketplace' ? (
//           /* ===== VISTA MARKETPLACE ===== */
//           <div className="space-y-8">
//             {/* Hero Section */}
//             <div className="bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-2xl p-8 text-white">
//               <div className="max-w-3xl">
//                 <h2 className="text-3xl font-bold mb-4">
//                   Convierte tu electrónica en efectivo 💰
//                 </h2>
//                 <p className="text-lg opacity-90 mb-6">
//                   Proceso simple, precios justos y pago inmediato. Vende tus dispositivos o componentes electrónicos de forma rápida y segura.
//                 </p>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-white/10 backdrop-blur rounded-lg p-4">
//                     <div className="text-2xl font-bold">24h</div>
//                     <div className="text-sm opacity-80">Pago rápido</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur rounded-lg p-4">
//                     <div className="text-2xl font-bold">100%</div>
//                     <div className="text-sm opacity-80">Seguro</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur rounded-lg p-4">
//                     <div className="text-2xl font-bold">+5k</div>
//                     <div className="text-sm opacity-80">Ventas</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Tipos de dispositivos */}
//             <div>
//               <h3 className="text-xl font-bold mb-4">¿Qué quieres vender?</h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Dispositivos Completos */}
//                 <Card 
//                   className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500 p-6"
//                   onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-blue-100 p-3 rounded-lg">
//                       <div className="text-3xl">💻</div>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold mb-2">Dispositivos Completos</h3>
//                       <p className="text-gray-600 mb-4">
//                         iPhones, laptops, tablets, consolas y más dispositivos funcionales
//                       </p>
                      
//                       {/* Precios destacados */}
//                       <div className="space-y-2 mb-4">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">iPhone 13-15</span>
//                           <span className="font-semibold text-green-600">$340-$680</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">MacBook Pro</span>
//                           <span className="font-semibold text-green-600">$480-$960</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <Badge variant="secondary" className="text-blue-700">
//                           💰 Mayores valores
//                         </Badge>
//                         <ChevronRightIcon className="h-5 w-5 text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 {/* Componentes y Partes */}
//                 <Card 
//                   className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-500 p-6"
//                   onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-green-100 p-3 rounded-lg">
//                       <div className="text-3xl">🔧</div>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold mb-2">Componentes & Partes</h3>
//                       <p className="text-gray-600 mb-4">
//                         Motherboards, procesadores, chips y componentes individuales
//                       </p>
                      
//                       {/* Precios destacados */}
//                       <div className="space-y-2 mb-4">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">Alto Grado</span>
//                           <span className="font-semibold text-green-600">$45/kg</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">Bajo Grado</span>
//                           <span className="font-semibold text-green-600">$2.50-$3/kg</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <Badge variant="secondary" className="text-green-700">
//                           ♻️ Reciclaje valorado
//                         </Badge>
//                         <ChevronRightIcon className="h-5 w-5 text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             </div>

//             {/* Categorías populares */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold flex items-center space-x-2">
//                   <SparklesIcon className="w-6 h-6 text-yellow-500" />
//                   <span>Categorías Populares</span>
//                 </h3>
//               </div>
//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {mockPopularCategories.map((category) => (
//                   <Card key={category.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
//                     <div className="text-3xl mb-3">{category.icon}</div>
//                     <h4 className="font-semibold mb-2">{category.name}</h4>
//                     <div className="space-y-1 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Estimado:</span>
//                         <span className="font-semibold text-green-600">{category.estimatedReturn}</span>
//                       </div>
//                       <div className="text-xs text-gray-500">{category.condition}</div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* Ventas recientes */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold flex items-center space-x-2">
//                   <TrophyIcon className="w-6 h-6 text-green-500" />
//                   <span>Ventas Recientes</span>
//                 </h3>
//               </div>
//               <Card className="divide-y">
//                 {mockRecentSales.map((sale, index) => (
//                   <div key={index} className="p-4 flex items-center justify-between">
//                     <div>
//                       <p className="font-medium">{sale.device}</p>
//                       <p className="text-sm text-gray-500">{sale.seller}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-green-600">{sale.soldFor}</p>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <ClockIcon className="w-3 h-3 mr-1" />
//                         {sale.timeAgo}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </Card>
//             </div>
//           </div>
//         ) : (
//           /* ===== VISTA CATEGORÍAS ===== */
//           <div className="space-y-6">
//             {/* Barra de búsqueda y filtros */}
//             <div className="flex items-center space-x-4">
//               <form onSubmit={handleSearch} className="flex-1">
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Buscar categorías..."
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent"
//                   />
//                 </div>
//               </form>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-2"
//               >
//                 <FunnelIcon className="w-4 h-4" />
//                 <span>Filtros</span>
//               </Button>
//             </div>

//             {/* Panel de filtros */}
//             {showFilters && (
//               <Card className="p-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Ordenar por</label>
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value as any)}
//                       className="w-full border rounded-lg px-3 py-2"
//                     >
//                       <option value="price-desc">Mayor precio</option>
//                       <option value="price-asc">Menor precio</option>
//                       <option value="name">Nombre A-Z</option>
//                       <option value="popular">Más popular</option>
//                     </select>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* Loading state */}
//             {loading && (
//               <div className="text-center py-12">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0FF5B]"></div>
//                 <p className="mt-4 text-gray-600">Cargando categorías...</p>
//               </div>
//             )}

//             {/* Error state */}
//             {error && !loading && (
//               <Card className="p-8 text-center">
//                 <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
//                 <h3 className="text-xl font-semibold mb-2">Error al cargar categorías</h3>
//                 <p className="text-gray-600 mb-4">{error}</p>
//                 <Button onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}>
//                   Reintentar
//                 </Button>
//               </Card>
//             )}

//             {/* Empty state */}
//             {!loading && !error && filteredCategories.length === 0 && (
//               <Card className="p-12 text-center">
//                 <div className="text-6xl mb-4">📦</div>
//                 <h3 className="text-xl font-semibold mb-2">No hay categorías disponibles</h3>
//                 <p className="text-gray-600">
//                   No se encontraron categorías para este tipo de dispositivo.
//                 </p>
//               </Card>
//             )}

//             {/* Grid de categorías */}
//             {!loading && !error && filteredCategories.length > 0 && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <p className="text-sm text-gray-600">
//                     {filteredCategories.length} categorías disponibles
//                   </p>
//                 </div>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredCategories.map((category) => (
//                     <Card
//                       key={category.id}
//                       className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#D0FF5B]"
//                       onClick={() => handleCategoryClick(category)}
//                     >
//                       {/* Thumbnail */}
//                       {category.thumbnailImage && (
//                         <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
//                           <img
//                             src={category.thumbnailImage}
//                             alt={category.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       )}

//                       {/* Contenido */}
//                       <div>
//                         <div className="flex items-start justify-between mb-2">
//                           <h3 className="font-semibold text-lg">{category.name}</h3>
//                           {category.isLeaf && (
//                             <Badge variant="secondary" className="bg-green-100 text-green-700">
//                               Seleccionable
//                             </Badge>
//                           )}
//                         </div>

//                         {category.description && (
//                           <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                             {category.description}
//                           </p>
//                         )}

//                         {/* Precio */}
//                         {category.pricePerKg && (
//                           <div className="bg-green-50 rounded-lg p-3 mb-3">
//                             <div className="text-xs text-gray-600 mb-1">Precio por kg</div>
//                             <div className="text-xl font-bold text-green-600">
//                               ${parseFloat(category.pricePerKg.toString()).toFixed(2)}
//                             </div>
//                           </div>
//                         )}

//                         {/* Footer */}
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-gray-500">
//                             {category.isLeaf ? 'Listo para vender' : 'Ver subcategorías'}
//                           </span>
//                           <ChevronRightIcon className="w-5 h-5 text-gray-400" />
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modales */}
//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={(index) => setCart(prev => prev.filter((_, i) => i !== Number(index)))}
//           onCheckout={() => {
//             setShowCartModal(false);
//             navigate('/sell/checkout');
//           }}
//         />
//       )}

//       {showCategoryModal && selectedCategoryForModal && (
//         <CategoryDetailModal
//           category={selectedCategoryForModal}
//           onClose={() => {
//             setShowCategoryModal(false);
//             setSelectedCategoryForModal(null);
//           } }
//           onAddToCart={handleAddToCart}        />
//       )}
//     </div>
//   );
// };

// export default SellPage;









// // src/pages/dashboard/SellPage.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ShoppingCartIcon,
//   ArrowLeftIcon,
//   ChevronRightIcon,
//   SparklesIcon,
//   TrophyIcon,
//   ClockIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailView from '@/components/sell/CategoryDetailView';

// // IDs de las categorías raíz
// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Estados principales
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Filtros
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('price-desc');

//   // Mock data para demostración
//   const mockPopularCategories = [
//     { id: '1', name: 'iPhone 13 - 15 Series', pricePerKg: 850, icon: '📱', estimatedReturn: '$340-$680', condition: 'Excelente estado' },
//     { id: '2', name: 'MacBook Pro 2019+', pricePerKg: 1200, icon: '💻', estimatedReturn: '$480-$960', condition: 'Funcional' },
//     { id: '3', name: 'Motherboards Alto Grado', pricePerKg: 45, icon: '🔧', estimatedReturn: '$18-$36/kg', condition: 'Con componentes' },
//     { id: '4', name: 'Samsung Galaxy S20+', pricePerKg: 650, icon: '📱', estimatedReturn: '$260-$520', condition: 'Buen estado' },
//   ];

//   const mockRecentSales = [
//     { device: 'iPhone 14 Pro', soldFor: '$580', timeAgo: '2 mins ago', seller: 'Maria G.' },
//     { device: 'MacBook Air M2', soldFor: '$720', timeAgo: '5 mins ago', seller: 'Carlos R.' },
//     { device: 'PlayStation 5', soldFor: '$420', timeAgo: '8 mins ago', seller: 'Ana L.' },
//   ];

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     console.log('🎬 [handleDeviceTypeSelect] Starting with type:', type);
    
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' 
//         ? COMPLETE_DEVICES_ROOT_ID 
//         : DISMANTLED_DEVICES_ROOT_ID;
      
//       console.log(`🔄 [handleDeviceTypeSelect] Loading children for rootId: ${rootId}`);
      
//       const children = await categoryService.getCategoryChildren(rootId);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       console.log('✅ [handleDeviceTypeSelect] Valid categories:', validCategories.length);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles para este tipo de dispositivo');
//       }
      
//       setCategories(validCategories);
      
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
      
//       console.log('🎉 [handleDeviceTypeSelect] Success! Categories set:', validCategories.length);
      
//     } catch (error) {
//       console.error('❌ [handleDeviceTypeSelect] Error:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar por subcategorías
//   const handleCategoryClick = async (category: Category) => {
//     console.log('🔍 [handleCategoryClick] Category clicked:', category);
    
//     if (category.isLeaf) {
//       // Es categoría final - mostrar vista de detalle
//       console.log('🍃 [handleCategoryClick] Leaf category, showing detail view');
//       setSelectedCategory(category);
//       setCurrentView('category-detail');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log(`🔄 [handleCategoryClick] Loading children for: ${category.id}`);
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       console.log('✅ [handleCategoryClick] Loaded children:', validCategories.length);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
      
//     } catch (error) {
//       console.error('❌ [handleCategoryClick] Error loading subcategories:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar hacia atrás en el breadcrumb
//   const handleBreadcrumbClick = async (index: number) => {
//     console.log('🔙 [handleBreadcrumbClick] Navigating to index:', index);
    
//     if (index === breadcrumb.length - 1) return;
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
//       setCurrentView('category-browse');
      
//     } catch (error) {
//       console.error('❌ [handleBreadcrumbClick] Error:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Volver al marketplace
//   const handleBackToMarketplace = () => {
//     console.log('🏠 [handleBackToMarketplace] Returning to marketplace');
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setSelectedCategory(null);
//     setError(null);
//   };

//   // Volver a categorías desde detalle
//   const handleBackToCategories = () => {
//     console.log('🔙 [handleBackToCategories] Returning to category browse');
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   // Agregar al carrito
//   const handleAddToCart = (item: CartItem) => {
//     console.log('🛒 [handleAddToCart] Adding item to cart:', item);
//     setCart(prev => [...prev, item]);
//     // Volver a la vista de categorías después de agregar
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   // Eliminar del carrito
//   const handleRemoveFromCart = (index: number) => {
//     console.log('🗑️ [handleRemoveFromCart] Removing item at index:', index);
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   // Proceder al checkout
//   const handleCheckout = () => {
//     console.log('💳 [handleCheckout] Proceeding to checkout with cart:', cart);
//     setShowCartModal(false);
//     navigate('/sell/checkout', { state: { cart } });
//   };

//   // Búsqueda
//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
    
//     console.log('🔍 [handleSearch] Searching for:', searchQuery);
//     setLoading(true);
    
//     try {
//       const results = await categoryService.searchCategories(searchQuery, {
//         type: selectedDeviceType || undefined,
//         leafOnly: true
//       });
      
//       setCategories(results);
//     } catch (error) {
//       console.error('❌ [handleSearch] Error:', error);
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Categorías filtradas y ordenadas
//   const filteredCategories = React.useMemo(() => {
//     let filtered = [...categories];

//     if (priceRange[0] > 0 || priceRange[1] < 1000) {
//       filtered = filtered.filter(cat => {
//         if (!cat.pricePerKg) return true;
//         const price = parseFloat(cat.pricePerKg.toString());
//         return price >= priceRange[0] && price <= priceRange[1];
//       });
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'popular':
//           return b.sortOrder - a.sortOrder;
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [categories, priceRange, sortBy]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {(currentView === 'category-browse' || currentView === 'category-detail') && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={currentView === 'category-detail' ? handleBackToCategories : handleBackToMarketplace}
//                   className="flex items-center space-x-2"
//                 >
//                   <ArrowLeftIcon className="w-4 h-4" />
//                   <span>Volver</span>
//                 </Button>
//               )}
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Vender</h1>
//                 <p className="text-sm text-gray-500">
//                   {currentView === 'marketplace' && 'Elige qué quieres vender'}
//                   {currentView === 'category-browse' && 'Selecciona la categoría de tu dispositivo'}
//                   {currentView === 'category-detail' && 'Completa los detalles de tu venta'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowCartModal(true)}
//                 className="relative"
//               >
//                 <ShoppingCartIcon className="w-5 h-5" />
//                 {cart.length > 0 && (
//                   <Badge className="absolute -top-2 -right-2 bg-[#D0FF5B] text-black">
//                     {cart.length}
//                   </Badge>
//                 )}
//                 <span className="ml-2">Mi Venta ({cart.length})</span>
//               </Button>

//               {cart.length > 0 && (
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Estimación total</p>
//                   <p className="text-lg font-bold text-green-600">
//                     ${cart.reduce((sum, item) => sum + item.estimatedValue, 0).toFixed(2)}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Breadcrumb */}
//           {(currentView === 'category-browse' || currentView === 'category-detail') && breadcrumb.length > 0 && (
//             <div className="flex items-center space-x-2 mt-4 text-sm">
//               {breadcrumb.map((crumb, index) => (
//                 <React.Fragment key={crumb.id}>
//                   <button
//                     onClick={() => handleBreadcrumbClick(index)}
//                     className={cn(
//                       'hover:text-[#D0FF5B] transition-colors',
//                       index === breadcrumb.length - 1 
//                         ? 'text-gray-900 font-medium' 
//                         : 'text-gray-500'
//                     )}
//                   >
//                     {crumb.name}
//                   </button>
//                   {index < breadcrumb.length - 1 && (
//                     <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//                   )}
//                 </React.Fragment>
//               ))}
//               {currentView === 'category-detail' && selectedCategory && (
//                 <>
//                   <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//                   <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Contenido principal */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {currentView === 'marketplace' ? (
//           /* ===== VISTA MARKETPLACE ===== */
//           <div className="space-y-8">
//             {/* Hero Section */}
//             <div className="bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-2xl p-8 text-white">
//               <div className="max-w-3xl">
//                 <h2 className="text-3xl font-bold mb-4">
//                   Convierte tu electrónica en efectivo 💰
//                 </h2>
//                 <p className="text-lg opacity-90 mb-6">
//                   Proceso simple, precios justos y pago inmediato. Vende tus dispositivos o componentes electrónicos de forma rápida y segura.
//                 </p>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-white/10 backdrop-blur rounded-lg p-4">
//                     <div className="text-2xl font-bold">24h</div>
//                     <div className="text-sm opacity-80">Pago rápido</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur rounded-lg p-4">
//                     <div className="text-2xl font-bold">100%</div>
//                     <div className="text-sm opacity-80">Seguro</div>
//                   </div>
//                   <div className="bg-white/10 backdrop-blur rounded-lg p-4">
//                     <div className="text-2xl font-bold">+5k</div>
//                     <div className="text-sm opacity-80">Ventas</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Tipos de dispositivos */}
//             <div>
//               <h3 className="text-xl font-bold mb-4">¿Qué quieres vender?</h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <Card 
//                   className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500 p-6"
//                   onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-blue-100 p-3 rounded-lg">
//                       <div className="text-3xl">💻</div>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold mb-2">Dispositivos Completos</h3>
//                       <p className="text-gray-600 mb-4">
//                         iPhones, laptops, tablets, consolas y más dispositivos funcionales
//                       </p>
                      
//                       <div className="space-y-2 mb-4">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">iPhone 13-15</span>
//                           <span className="font-semibold text-green-600">$340-$680</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">MacBook Pro</span>
//                           <span className="font-semibold text-green-600">$480-$960</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <Badge variant="secondary" className="text-blue-700">
//                           💰 Mayores valores
//                         </Badge>
//                         <ChevronRightIcon className="h-5 w-5 text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </Card>

//                 <Card 
//                   className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-500 p-6"
//                   onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-green-100 p-3 rounded-lg">
//                       <div className="text-3xl">🔧</div>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold mb-2">Componentes & Partes</h3>
//                       <p className="text-gray-600 mb-4">
//                         Motherboards, procesadores, chips y componentes individuales
//                       </p>
                      
//                       <div className="space-y-2 mb-4">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">Alto Grado</span>
//                           <span className="font-semibold text-green-600">$45/kg</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">Bajo Grado</span>
//                           <span className="font-semibold text-green-600">$2.50-$3/kg</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <Badge variant="secondary" className="text-green-700">
//                           ♻️ Reciclaje valorado
//                         </Badge>
//                         <ChevronRightIcon className="h-5 w-5 text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             </div>

//             {/* Categorías populares */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold flex items-center space-x-2">
//                   <SparklesIcon className="w-6 h-6 text-yellow-500" />
//                   <span>Categorías Populares</span>
//                 </h3>
//               </div>
//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {mockPopularCategories.map((category) => (
//                   <Card key={category.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
//                     <div className="text-3xl mb-3">{category.icon}</div>
//                     <h4 className="font-semibold mb-2">{category.name}</h4>
//                     <div className="space-y-1 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Estimado:</span>
//                         <span className="font-semibold text-green-600">{category.estimatedReturn}</span>
//                       </div>
//                       <div className="text-xs text-gray-500">{category.condition}</div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* Ventas recientes */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold flex items-center space-x-2">
//                   <TrophyIcon className="w-6 h-6 text-green-500" />
//                   <span>Ventas Recientes</span>
//                 </h3>
//               </div>
//               <Card className="divide-y">
//                 {mockRecentSales.map((sale, index) => (
//                   <div key={index} className="p-4 flex items-center justify-between">
//                     <div>
//                       <p className="font-medium">{sale.device}</p>
//                       <p className="text-sm text-gray-500">{sale.seller}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-green-600">{sale.soldFor}</p>
//                       <div className="flex items-center text-xs text-gray-500">
//                         <ClockIcon className="w-3 h-3 mr-1" />
//                         {sale.timeAgo}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </Card>
//             </div>
//           </div>
//         ) : currentView === 'category-detail' && selectedCategory ? (
//           /* ===== VISTA DETALLE DE CATEGORÍA ===== */
//           <CategoryDetailView
//             category={selectedCategory}
//             onAddToCart={handleAddToCart}
//             onBack={handleBackToCategories}
//           />
//         ) : (
//           /* ===== VISTA CATEGORÍAS ===== */
//           <div className="space-y-6">
//             {/* Barra de búsqueda y filtros */}
//             <div className="flex items-center space-x-4">
//               <form onSubmit={handleSearch} className="flex-1">
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Buscar categorías..."
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D0FF5B] focus:border-transparent"
//                   />
//                 </div>
//               </form>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center space-x-2"
//               >
//                 <FunnelIcon className="w-4 h-4" />
//                 <span>Filtros</span>
//               </Button>
//             </div>

//             {/* Panel de filtros */}
//             {showFilters && (
//               <Card className="p-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Ordenar por</label>
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value as any)}
//                       className="w-full border rounded-lg px-3 py-2"
//                     >
//                       <option value="price-desc">Mayor precio</option>
//                       <option value="price-asc">Menor precio</option>
//                       <option value="name">Nombre A-Z</option>
//                       <option value="popular">Más popular</option>
//                     </select>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* Loading state */}
//             {loading && (
//               <div className="text-center py-12">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0FF5B]"></div>
//                 <p className="mt-4 text-gray-600">Cargando categorías...</p>
//               </div>
//             )}

//             {/* Error state */}
//             {error && !loading && (
//               <Card className="p-8 text-center">
//                 <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
//                 <h3 className="text-xl font-semibold mb-2">Error al cargar categorías</h3>
//                 <p className="text-gray-600 mb-4">{error}</p>
//                 <Button onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}>
//                   Reintentar
//                 </Button>
//               </Card>
//             )}

//             {/* Empty state */}
//             {!loading && !error && filteredCategories.length === 0 && (
//               <Card className="p-12 text-center">
//                 <div className="text-6xl mb-4">📦</div>
//                 <h3 className="text-xl font-semibold mb-2">No hay categorías disponibles</h3>
//                 <p className="text-gray-600">
//                   No se encontraron categorías para este tipo de dispositivo.
//                 </p>
//               </Card>
//             )}

//             {/* Grid de categorías */}
//             {!loading && !error && filteredCategories.length > 0 && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <p className="text-sm text-gray-600">
//                     {filteredCategories.length} categorías disponibles
//                   </p>
//                 </div>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredCategories.map((category) => (
//                     <Card
//                       key={category.id}
//                       className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#D0FF5B]"
//                       onClick={() => handleCategoryClick(category)}
//                     >
//                       {category.thumbnailImage && (
//                         <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
//                           <img
//                             src={category.thumbnailImage}
//                             alt={category.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       )}

//                       <div>
//                         <div className="flex items-start justify-between mb-2">
//                           <h3 className="font-semibold text-lg">{category.name}</h3>
//                           {category.isLeaf && (
//                             <Badge variant="secondary" className="bg-green-100 text-green-700">
//                               Seleccionable
//                             </Badge>
//                           )}
//                         </div>

//                         {category.description && (
//                           <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                             {category.description}
//                           </p>
//                         )}

//                         {category.pricePerKg && (
//                           <div className="bg-green-50 rounded-lg p-3 mb-3">
//                             <div className="text-xs text-gray-600 mb-1">Precio por kg</div>
//                             <div className="text-xl font-bold text-green-600">
//                               ${parseFloat(category.pricePerKg.toString()).toFixed(2)}
//                             </div>
//                           </div>
//                         )}

//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-gray-500">
//                             {category.isLeaf ? 'Listo para vender' : 'Ver subcategorías'}
//                           </span>
//                           <ChevronRightIcon className="w-5 h-5 text-gray-400" />
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Drawer del carrito */}
//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//         />
//       )}
//     </div>
//   );
// };

// export default SellPage;









// // src/pages/dashboard/SellPage.tsx - DISEÑO PROFESIONAL MINIMALISTA
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   MagnifyingGlassIcon,
//   ChevronRightIcon,
//   ShoppingCartIcon,
//   ArrowLeftIcon,
//   FunnelIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailView from '@/components/sell/CategoryDetailView';

// // IDs de las categorías raíz
// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Estados principales
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Filtros
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('popular');

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
//       const children = await categoryService.getCategoryChildren(rootId);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar por subcategorías
//   const handleCategoryClick = async (category: Category) => {
//     if (category.isLeaf) {
//       setSelectedCategory(category);
//       setCurrentView('category-detail');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar hacia atrás en el breadcrumb
//   const handleBreadcrumbClick = async (index: number) => {
//     if (index === breadcrumb.length - 1) return;
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
//       setCurrentView('category-browse');
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToMarketplace = () => {
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setSelectedCategory(null);
//     setError(null);
//   };

//   const handleBackToCategories = () => {
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleAddToCart = (item: CartItem) => {
//     setCart(prev => [...prev, item]);
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleRemoveFromCart = (index: number) => {
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleCheckout = () => {
//     setShowCartModal(false);
//     navigate('/sell/checkout', { state: { cart } });
//   };

//   // Categorías filtradas y ordenadas
//   const filteredCategories = useMemo(() => {
//     let filtered = [...categories];

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'popular':
//           return b.sortOrder - a.sortOrder;
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [categories, sortBy]);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header de la página - Minimalista y limpio */}
//       {(currentView === 'category-browse' || currentView === 'category-detail') && (
//         <div className="bg-white border-b border-gray-200 mb-6">
//           <div className="py-4">
//             {/* Botón volver y título */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={currentView === 'category-detail' ? handleBackToCategories : handleBackToMarketplace}
//                   className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
//                 >
//                   <ArrowLeftIcon className="w-5 h-5 mr-2" />
//                   <span className="text-sm font-medium">Volver</span>
//                 </button>
//                 <div className="h-6 w-px bg-gray-300" />
//                 <h1 className="text-2xl font-bold text-gray-900">Vender</h1>
//               </div>

//               {/* Botón carrito minimalista */}
//               <button
//                 onClick={() => setShowCartModal(true)}
//                 className="relative flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
//                 <span className="text-sm font-medium text-gray-700">
//                   Mi Venta ({cart.length})
//                 </span>
//                 {cart.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-[#a8c241] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                     {cart.length}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Breadcrumb minimalista */}
//             {breadcrumb.length > 0 && (
//               <div className="flex items-center space-x-2 text-sm">
//                 {breadcrumb.map((crumb, index) => (
//                   <React.Fragment key={crumb.id}>
//                     <button
//                       onClick={() => handleBreadcrumbClick(index)}
//                       className={cn(
//                         'hover:text-[#a8c241] transition-colors',
//                         index === breadcrumb.length - 1 
//                           ? 'text-gray-900 font-medium' 
//                           : 'text-gray-500'
//                       )}
//                     >
//                       {crumb.name}
//                     </button>
//                     {index < breadcrumb.length - 1 && (
//                       <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//                     )}
//                   </React.Fragment>
//                 ))}
//                 {currentView === 'category-detail' && selectedCategory && (
//                   <>
//                     <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Contenido principal */}
//       {currentView === 'marketplace' ? (
//         /* ===== MARKETPLACE - ESTILO MINIMALISTA ===== */
//         <div className="space-y-12 py-8">
//           {/* Hero minimalista */}
//           <div className="text-center max-w-3xl mx-auto">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//               ¿Qué quieres vender?
//             </h1>
//             <p className="text-lg text-gray-600">
//               Selecciona el tipo de material que deseas reciclar
//             </p>
//           </div>

//           {/* Cards de selección - Estilo minimalista */}
//           <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//             {/* Dispositivos Completos */}
//             <button
//               onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//               className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#a8c241] hover:shadow-lg transition-all duration-300 text-left"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
//                   <span className="text-3xl">💻</span>
//                 </div>
//                 <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Dispositivos Completos
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Laptops, celulares, tablets y más equipos funcionales
//               </p>
              
//               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                 <span className="text-sm text-gray-500">Valores estimados</span>
//                 <span className="text-lg font-bold text-[#719428]">$340 - $1,200</span>
//               </div>
//             </button>

//             {/* Componentes y Partes */}
//             <button
//               onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//               className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#a8c241] hover:shadow-lg transition-all duration-300 text-left"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
//                   <span className="text-3xl">🔧</span>
//                 </div>
//                 <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Componentes & Partes
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Motherboards, procesadores, chips y componentes individuales
//               </p>
              
//               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                 <span className="text-sm text-gray-500">Precio por kg</span>
//                 <span className="text-lg font-bold text-[#719428]">$2.50 - $45</span>
//               </div>
//             </button>
//           </div>

//           {/* Stats minimalistas */}
//           <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto pt-12 border-t border-gray-200">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">24h</div>
//               <div className="text-sm text-gray-600">Pago rápido</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
//               <div className="text-sm text-gray-600">Seguro y confiable</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-1">+5k</div>
//               <div className="text-sm text-gray-600">Ventas realizadas</div>
//             </div>
//           </div>
//         </div>
//       ) : currentView === 'category-detail' && selectedCategory ? (
//         /* ===== VISTA DETALLE ===== */
//         <CategoryDetailView
//           category={selectedCategory}
//           onAddToCart={handleAddToCart}
//           onBack={handleBackToCategories}
//         />
//       ) : (
//         /* ===== VISTA CATEGORÍAS - ESTILO MINIMALISTA ===== */
//         <div className="space-y-6">
//           {/* Barra de acciones minimalista */}
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-600">
//               {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría' : 'categorías'} disponibles
//             </p>
            
//             <div className="flex items-center space-x-3">
//               {/* Ordenar */}
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as any)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//               >
//                 <option value="popular">Más populares</option>
//                 <option value="price-desc">Mayor precio</option>
//                 <option value="price-asc">Menor precio</option>
//                 <option value="name">Nombre A-Z</option>
//               </select>
//             </div>
//           </div>

//           {/* Loading state minimalista */}
//           {loading && (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8c241]"></div>
//               <p className="mt-4 text-sm text-gray-600">Cargando categorías...</p>
//             </div>
//           )}

//           {/* Error state minimalista */}
//           {error && !loading && (
//             <div className="text-center py-20">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <Button 
//                 onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
//                 className="bg-[#a8c241] hover:bg-[#719428] text-white"
//               >
//                 Reintentar
//               </Button>
//             </div>
//           )}

//           {/* Empty state minimalista */}
//           {!loading && !error && filteredCategories.length === 0 && (
//             <div className="text-center py-20">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
//               <p className="text-gray-600">Intenta con otro tipo de dispositivo</p>
//             </div>
//           )}

//           {/* Grid de categorías - Estilo minimalista */}
//           {!loading && !error && filteredCategories.length > 0 && (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredCategories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category)}
//                   className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#a8c241] hover:shadow-md transition-all duration-200 text-left"
//                 >
//                   {/* Imagen */}
//                   {category.thumbnailImage && (
//                     <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
//                       <img
//                         src={category.thumbnailImage}
//                         alt={category.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                   )}

//                   {/* Contenido */}
//                   <div>
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 group-hover:text-[#719428] transition-colors">
//                         {category.name}
//                       </h3>
//                       {category.isLeaf && (
//                         <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
//                           Seleccionable
//                         </Badge>
//                       )}
//                     </div>

//                     {category.description && (
//                       <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                         {category.description}
//                       </p>
//                     )}

//                     {/* Precio */}
//                     {category.pricePerKg ? (
//                       <div className="flex items-baseline space-x-2 pt-3 border-t border-gray-100">
//                         <span className="text-2xl font-bold text-[#719428]">
//                           ${parseFloat(category.pricePerKg.toString()).toFixed(2)}
//                         </span>
//                         <span className="text-sm text-gray-500">/kg</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                         <span className="text-sm text-gray-600">Ver subcategorías</span>
//                         <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Drawer del carrito */}
//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//         />
//       )}
//     </div>
//   );
// };

// export default SellPage;





// // src/pages/dashboard/SellPage.tsx - CON HEADER ESTILO "MIS ÓRDENES"
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ChevronRightIcon,
//   ShoppingCartIcon,
//   HomeIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailView from '@/components/sell/CategoryDetailView';

// // IDs de las categorías raíz
// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Estados principales
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('popular');

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
//       const children = await categoryService.getCategoryChildren(rootId);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar por subcategorías
//   const handleCategoryClick = async (category: Category) => {
//     if (category.isLeaf) {
//       setSelectedCategory(category);
//       setCurrentView('category-detail');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBreadcrumbClick = async (index: number) => {
//     if (index === breadcrumb.length - 1) return;
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
//       setCurrentView('category-browse');
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToMarketplace = () => {
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setSelectedCategory(null);
//     setError(null);
//   };

//   const handleBackToCategories = () => {
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleAddToCart = (item: CartItem) => {
//     setCart(prev => [...prev, item]);
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleRemoveFromCart = (index: number) => {
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleCheckout = () => {
//     setShowCartModal(false);
//     navigate('/sell/checkout', { state: { cart } });
//   };

//   const filteredCategories = useMemo(() => {
//     let filtered = [...categories];
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });
//     return filtered;
//   }, [categories, sortBy]);

//   // Función para obtener el título según la vista
//   const getPageTitle = () => {
//     if (currentView === 'marketplace') return 'Vender';
//     if (currentView === 'category-detail' && selectedCategory) return selectedCategory.name;
//     if (breadcrumb.length > 0) return breadcrumb[breadcrumb.length - 1].name;
//     return 'Vender';
//   };

//   // Función para obtener la descripción según la vista
//   const getPageDescription = () => {
//     if (currentView === 'marketplace') return 'Selecciona el tipo de material que deseas reciclar';
//     if (currentView === 'category-detail' && selectedCategory) return 'Completa los detalles de tu venta';
//     return 'Selecciona la categoría de tu dispositivo';
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header estilo "Mis Órdenes" */}
//       <div className="mb-8">
//         {/* Breadcrumb minimalista */}
//         <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="hover:text-gray-700 transition-colors"
//           >
//             <HomeIcon className="w-4 h-4" />
//           </button>
//           <ChevronRightIcon className="w-4 h-4" />
//           <button 
//             onClick={handleBackToMarketplace}
//             className={cn(
//               "hover:text-gray-700 transition-colors",
//               currentView === 'marketplace' && "text-gray-900 font-medium"
//             )}
//           >
//             Vender
//           </button>
          
//           {breadcrumb.map((crumb, index) => (
//             <React.Fragment key={crumb.id}>
//               <ChevronRightIcon className="w-4 h-4" />
//               <button
//                 onClick={() => handleBreadcrumbClick(index)}
//                 className={cn(
//                   "hover:text-gray-700 transition-colors",
//                   index === breadcrumb.length - 1 && currentView === 'category-browse' && "text-gray-900 font-medium"
//                 )}
//               >
//                 {crumb.name}
//               </button>
//             </React.Fragment>
//           ))}

//           {currentView === 'category-detail' && selectedCategory && (
//             <>
//               <ChevronRightIcon className="w-4 h-4" />
//               <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
//             </>
//           )}
//         </div>

//         {/* Título y descripción */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {getPageTitle()}
//             </h1>
//             <p className="text-gray-600">
//               {getPageDescription()}
//             </p>
//           </div>

//           {/* Botón carrito - Solo en vistas de categorías */}
//           {(currentView === 'category-browse' || currentView === 'category-detail') && (
//             <button
//               onClick={() => setShowCartModal(true)}
//               className="relative flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
//               <span className="text-sm font-medium text-gray-700">
//                 Mi Venta ({cart.length})
//               </span>
//               {cart.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-[#a8c241] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cart.length}
//                 </span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Contenido principal */}
//       {currentView === 'marketplace' ? (
//         /* ===== MARKETPLACE ===== */
//         <div className="space-y-12">
//           {/* Cards de selección */}
//           <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
//             {/* Dispositivos Completos */}
//             <button
//               onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//               className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#a8c241] hover:shadow-lg transition-all duration-300 text-left"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
//                   <span className="text-3xl">💻</span>
//                 </div>
//                 <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Dispositivos Completos
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Laptops, celulares, tablets y más equipos funcionales
//               </p>
              
//               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                 <span className="text-sm text-gray-500">Valores estimados</span>
//                 <span className="text-lg font-bold text-[#719428]">$340 - $1,200</span>
//               </div>
//             </button>

//             {/* Componentes y Partes */}
//             <button
//               onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//               className="group relative bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#a8c241] hover:shadow-lg transition-all duration-300 text-left"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
//                   <span className="text-3xl">🔧</span>
//                 </div>
//                 <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-2">
//                 Componentes & Partes
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 Motherboards, procesadores, chips y componentes individuales
//               </p>
              
//               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                 <span className="text-sm text-gray-500">Precio por kg</span>
//                 <span className="text-lg font-bold text-[#719428]">$2.50 - $45</span>
//               </div>
//             </button>
//           </div>

         
//         </div>
//       ) : currentView === 'category-detail' && selectedCategory ? (
//         /* ===== VISTA DETALLE ===== */
//         <CategoryDetailView
//           category={selectedCategory}
//           onAddToCart={handleAddToCart}
//           onBack={handleBackToCategories}
//         />
//       ) : (
//         /* ===== VISTA CATEGORÍAS ===== */
//         <div className="space-y-6">
//           {/* Barra de acciones */}
//           <div className="flex items-center justify-between pb-4 border-b border-gray-200">
//             <p className="text-sm text-gray-600">
//               {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
//             </p>
            
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as any)}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a8c241] focus:border-transparent outline-none"
//             >
//               <option value="popular">Más populares</option>
//               <option value="price-desc">Mayor precio</option>
//               <option value="price-asc">Menor precio</option>
//               <option value="name">Nombre A-Z</option>
//             </select>
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8c241]"></div>
//               <p className="mt-4 text-sm text-gray-600">Cargando categorías...</p>
//             </div>
//           )}

//           {/* Error */}
//           {error && !loading && (
//             <div className="text-center py-20">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <Button 
//                 onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
//                 className="bg-[#a8c241] hover:bg-[#719428] text-white"
//               >
//                 Reintentar
//               </Button>
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && !error && filteredCategories.length === 0 && (
//             <div className="text-center py-20">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
//               <p className="text-gray-600">Intenta con otro tipo de dispositivo</p>
//             </div>
//           )}

//           {/* Grid de categorías */}
//           {!loading && !error && filteredCategories.length > 0 && (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredCategories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category)}
//                   className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#a8c241] hover:shadow-md transition-all duration-200 text-left"
//                 >
//                   {category.thumbnailImage && (
//                     <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
//                       <img
//                         src={category.thumbnailImage}
//                         alt={category.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 group-hover:text-[#719428] transition-colors">
//                         {category.name}
//                       </h3>
//                       {category.isLeaf && (
//                         <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
//                           Seleccionable
//                         </Badge>
//                       )}
//                     </div>

//                     {category.description && (
//                       <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                         {category.description}
//                       </p>
//                     )}

//                     {category.pricePerKg ? (
//                       <div className="flex items-baseline space-x-2 pt-3 border-t border-gray-100">
//                         <span className="text-2xl font-bold text-[#719428]">
//                           ${parseFloat(category.pricePerKg.toString()).toFixed(2)}
//                         </span>
//                         <span className="text-sm text-gray-500">/kg</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                         <span className="text-sm text-gray-600">Ver subcategorías</span>
//                         <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Drawer del carrito */}
//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//         />
//       )}
//     </div>
//   );
// };

// export default SellPage;



// // src/pages/dashboard/SellPage.tsx - DISEÑO ESPECTACULAR CON IMÁGENES Y ANIMACIONES
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ChevronRightIcon,
//   ShoppingCartIcon,
//   HomeIcon,
//   SparklesIcon,
//   CheckCircleIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailView from '@/components/sell/CategoryDetailView';

// // IDs de las categorías raíz
// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Estados principales
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('popular');
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null);

//   // Manejar selección de tipo de dispositivo
//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
//       const children = await categoryService.getCategoryChildren(rootId);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navegar por subcategorías
//   const handleCategoryClick = async (category: Category) => {
//     if (category.isLeaf) {
//       setSelectedCategory(category);
//       setCurrentView('category-detail');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBreadcrumbClick = async (index: number) => {
//     if (index === breadcrumb.length - 1) return;
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
//       setCurrentView('category-browse');
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToMarketplace = () => {
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setSelectedCategory(null);
//     setError(null);
//   };

//   const handleBackToCategories = () => {
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleAddToCart = (item: CartItem) => {
//     setCart(prev => [...prev, item]);
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleRemoveFromCart = (index: number) => {
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleCheckout = () => {
//     setShowCartModal(false);
//     navigate('/sell/checkout', { state: { cart } });
//   };

//   const filteredCategories = useMemo(() => {
//     let filtered = [...categories];
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });
//     return filtered;
//   }, [categories, sortBy]);

//   const getPageTitle = () => {
//     if (currentView === 'marketplace') return 'Vender';
//     if (currentView === 'category-detail' && selectedCategory) return selectedCategory.name;
//     if (breadcrumb.length > 0) return breadcrumb[breadcrumb.length - 1].name;
//     return 'Vender';
//   };

//   const getPageDescription = () => {
//     if (currentView === 'marketplace') return 'Selecciona el tipo de material que deseas reciclar';
//     if (currentView === 'category-detail' && selectedCategory) return 'Completa los detalles de tu venta';
//     return 'Selecciona la categoría de tu dispositivo';
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="mb-8">
//         {/* Breadcrumb */}
//         <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="hover:text-gray-700 transition-colors"
//           >
//             <HomeIcon className="w-4 h-4" />
//           </button>
//           <ChevronRightIcon className="w-4 h-4" />
//           <button 
//             onClick={handleBackToMarketplace}
//             className={cn(
//               "hover:text-gray-700 transition-colors",
//               currentView === 'marketplace' && "text-gray-900 font-medium"
//             )}
//           >
//             Vender
//           </button>
          
//           {breadcrumb.map((crumb, index) => (
//             <React.Fragment key={crumb.id}>
//               <ChevronRightIcon className="w-4 h-4" />
//               <button
//                 onClick={() => handleBreadcrumbClick(index)}
//                 className={cn(
//                   "hover:text-gray-700 transition-colors",
//                   index === breadcrumb.length - 1 && currentView === 'category-browse' && "text-gray-900 font-medium"
//                 )}
//               >
//                 {crumb.name}
//               </button>
//             </React.Fragment>
//           ))}

//           {currentView === 'category-detail' && selectedCategory && (
//             <>
//               <ChevronRightIcon className="w-4 h-4" />
//               <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
//             </>
//           )}
//         </div>

//         {/* Título y descripción */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {getPageTitle()}
//             </h1>
//             <p className="text-gray-600">
//               {getPageDescription()}
//             </p>
//           </div>

//           {(currentView === 'category-browse' || currentView === 'category-detail') && (
//             <button
//               onClick={() => setShowCartModal(true)}
//               className="relative flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
//               <span className="text-sm font-medium text-gray-700">
//                 Mi Venta ({cart.length})
//               </span>
//               {cart.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-[#a8c241] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cart.length}
//                 </span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Contenido principal */}
//       {currentView === 'marketplace' ? (
//         /* ===== MARKETPLACE CON IMÁGENES ESPECTACULARES ===== */
//         <div className="space-y-8">
//           <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
//             {/* Dispositivos Completos - CON IMAGEN */}
//             <button
//               onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//               onMouseEnter={() => setHoveredCard('complete')}
//               onMouseLeave={() => setHoveredCard(null)}
//               className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-[#a8c241] transition-all duration-500 hover:shadow-2xl text-left"
//             >
//               {/* Imagen de fondo con overlay */}
//               <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
//                 <img
//                   src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop"
//                   alt="Dispositivos Completos"
//                   className={cn(
//                     "w-full h-full object-cover transition-transform duration-700",
//                     hoveredCard === 'complete' ? "scale-110" : "scale-100"
//                   )}
//                 />
                
//                 {/* Badge flotante animado */}
//                 <div className={cn(
//                   "absolute top-4 right-4 z-20 transition-all duration-500",
//                   hoveredCard === 'complete' ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
//                 )}>
//                   <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2">
//                     <SparklesIcon className="w-4 h-4 text-blue-600" />
//                     <span className="text-xs font-semibold text-blue-600">Valores más altos</span>
//                   </div>
//                 </div>

//                 {/* Icono grande en el centro */}
//                 <div className={cn(
//                   "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500",
//                   hoveredCard === 'complete' ? "scale-110 rotate-3" : "scale-100 rotate-0"
//                 )}>
//                   <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
//                     <span className="text-5xl">💻</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Contenido */}
//               <div className="p-6 relative">
//                 <div className="flex items-start justify-between mb-3">
//                   <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#719428] transition-colors">
//                     Dispositivos Completos
//                   </h3>
//                   <ChevronRightIcon className={cn(
//                     "w-6 h-6 text-gray-400 transition-all duration-300",
//                     hoveredCard === 'complete' && "text-[#a8c241] translate-x-1"
//                   )} />
//                 </div>
                
//                 <p className="text-gray-600 mb-4 leading-relaxed">
//                   Laptops, celulares, tablets y más equipos funcionales
//                 </p>

//                 {/* Features con checkmarks */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-sm text-gray-700">
//                     <CheckCircleIcon className="w-4 h-4 text-[#a8c241] mr-2 flex-shrink-0" />
//                     <span>Evaluación completa del dispositivo</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-700">
//                     <CheckCircleIcon className="w-4 h-4 text-[#a8c241] mr-2 flex-shrink-0" />
//                     <span>Incluye accesorios y componentes</span>
//                   </div>
//                 </div>
                
//                 {/* Footer con precio */}
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <span className="text-sm font-medium text-gray-500">Valores estimados</span>
//                   <div className="flex items-baseline space-x-1">
//                     <span className="text-2xl font-bold text-[#719428]">$340</span>
//                     <span className="text-gray-500">-</span>
//                     <span className="text-2xl font-bold text-[#719428]">$1,200</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Efecto de brillo al hover */}
//               <div className={cn(
//                 "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000",
//                 hoveredCard === 'complete' && "translate-x-full"
//               )} />
//             </button>

//             {/* Componentes y Partes - CON IMAGEN */}
//             <button
//               onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//               onMouseEnter={() => setHoveredCard('dismantled')}
//               onMouseLeave={() => setHoveredCard(null)}
//               className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-[#a8c241] transition-all duration-500 hover:shadow-2xl text-left"
//             >
//               {/* Imagen de fondo con overlay */}
//               <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100">
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
//                 <img
//                   src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop"
//                   alt="Componentes y Partes"
//                   className={cn(
//                     "w-full h-full object-cover transition-transform duration-700",
//                     hoveredCard === 'dismantled' ? "scale-110" : "scale-100"
//                   )}
//                 />
                
//                 {/* Badge flotante animado */}
//                 <div className={cn(
//                   "absolute top-4 right-4 z-20 transition-all duration-500",
//                   hoveredCard === 'dismantled' ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
//                 )}>
//                   <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-2">
//                     <SparklesIcon className="w-4 h-4 text-green-600" />
//                     <span className="text-xs font-semibold text-green-600">Reciclaje premium</span>
//                   </div>
//                 </div>

//                 {/* Icono grande en el centro */}
//                 <div className={cn(
//                   "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500",
//                   hoveredCard === 'dismantled' ? "scale-110 -rotate-3" : "scale-100 rotate-0"
//                 )}>
//                   <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
//                     <span className="text-5xl">🔧</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Contenido */}
//               <div className="p-6 relative">
//                 <div className="flex items-start justify-between mb-3">
//                   <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#719428] transition-colors">
//                     Componentes & Partes
//                   </h3>
//                   <ChevronRightIcon className={cn(
//                     "w-6 h-6 text-gray-400 transition-all duration-300",
//                     hoveredCard === 'dismantled' && "text-[#a8c241] translate-x-1"
//                   )} />
//                 </div>
                
//                 <p className="text-gray-600 mb-4 leading-relaxed">
//                   Motherboards, procesadores, chips y componentes individuales
//                 </p>

//                 {/* Features con checkmarks */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center text-sm text-gray-700">
//                     <CheckCircleIcon className="w-4 h-4 text-[#a8c241] mr-2 flex-shrink-0" />
//                     <span>Clasificación por materiales</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-700">
//                     <CheckCircleIcon className="w-4 h-4 text-[#a8c241] mr-2 flex-shrink-0" />
//                     <span>Recuperación de metales preciosos</span>
//                   </div>
//                 </div>
                
//                 {/* Footer con precio */}
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                   <span className="text-sm font-medium text-gray-500">Precio por kg</span>
//                   <div className="flex items-baseline space-x-1">
//                     <span className="text-2xl font-bold text-[#719428]">$2.50</span>
//                     <span className="text-gray-500">-</span>
//                     <span className="text-2xl font-bold text-[#719428]">$45</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Efecto de brillo al hover */}
//               <div className={cn(
//                 "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000",
//                 hoveredCard === 'dismantled' && "translate-x-full"
//               )} />
//             </button>
//           </div>

//           {/* Stats minimalistas con animación */}
//           <div className="grid grid-cols-3 gap-8 max-w-5xl pt-12 border-t border-gray-200">
//             {[
//               { value: '24h', label: 'Pago rápido', delay: '0ms' },
//               { value: '100%', label: 'Seguro y confiable', delay: '100ms' },
//               { value: '+5k', label: 'Ventas realizadas', delay: '200ms' }
//             ].map((stat, index) => (
//               <div 
//                 key={index}
//                 className="text-center transform transition-all duration-500 hover:scale-110"
//                 style={{ animationDelay: stat.delay }}
//               >
//                 <div className="text-4xl font-bold bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-gray-600">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : currentView === 'category-detail' && selectedCategory ? (
//         /* ===== VISTA DETALLE ===== */
//         <CategoryDetailView
//           category={selectedCategory}
//           onAddToCart={handleAddToCart}
//           onBack={handleBackToCategories}
//         />
//       ) : (
//         /* ===== VISTA CATEGORÍAS ===== */
//         <div className="space-y-6">
//           {/* Barra de acciones */}
//           <div className="flex items-center justify-between pb-4 border-b border-gray-200">
//             <p className="text-sm text-gray-600">
//               {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
//             </p>
            
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as any)}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a8c241] focus:border-transparent outline-none"
//             >
//               <option value="popular">Más populares</option>
//               <option value="price-desc">Mayor precio</option>
//               <option value="price-asc">Menor precio</option>
//               <option value="name">Nombre A-Z</option>
//             </select>
//           </div>

//           {/* Loading */}
//           {loading && (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8c241]"></div>
//               <p className="mt-4 text-sm text-gray-600">Cargando categorías...</p>
//             </div>
//           )}

//           {/* Error */}
//           {error && !loading && (
//             <div className="text-center py-20">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <Button 
//                 onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
//                 className="bg-[#a8c241] hover:bg-[#719428] text-white"
//               >
//                 Reintentar
//               </Button>
//             </div>
//           )}

//           {/* Empty */}
//           {!loading && !error && filteredCategories.length === 0 && (
//             <div className="text-center py-20">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
//               <p className="text-gray-600">Intenta con otro tipo de dispositivo</p>
//             </div>
//           )}

//           {/* Grid de categorías */}
//           {!loading && !error && filteredCategories.length > 0 && (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredCategories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category)}
//                   className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-[#a8c241] hover:shadow-md transition-all duration-200 text-left"
//                 >
//                   {category.thumbnailImage && (
//                     <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
//                       <img
//                         src={category.thumbnailImage}
//                         alt={category.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                   )}

//                   <div>
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 group-hover:text-[#719428] transition-colors">
//                         {category.name}
//                       </h3>
//                       {category.isLeaf && (
//                         <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
//                           Seleccionable
//                         </Badge>
//                       )}
//                     </div>

//                     {category.description && (
//                       <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                         {category.description}
//                       </p>
//                     )}

//                     {category.pricePerKg ? (
//                       <div className="flex items-baseline space-x-2 pt-3 border-t border-gray-100">
//                         <span className="text-2xl font-bold text-[#719428]">
//                           ${parseFloat(category.pricePerKg.toString()).toFixed(2)}
//                         </span>
//                         <span className="text-sm text-gray-500">/kg</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                         <span className="text-sm text-gray-600">Ver subcategorías</span>
//                         <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-[#a8c241] transition-colors" />
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Drawer del carrito */}
//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//         />
//       )}
//     </div>
//   );
// };

// export default SellPage;







// // src/pages/dashboard/SellPage.tsx - DISEÑO DE ÚLTIMA GENERACIÓN
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ChevronRightIcon,
//   ShoppingCartIcon,
//   HomeIcon,
//   CheckCircleIcon,
//   ArrowRightIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailView from '@/components/sell/CategoryDetailView';

// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('popular');
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null);

//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
//       const children = await categoryService.getCategoryChildren(rootId);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryClick = async (category: Category) => {
//     if (category.isLeaf) {
//       setSelectedCategory(category);
//       setCurrentView('category-detail');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBreadcrumbClick = async (index: number) => {
//     if (index === breadcrumb.length - 1) return;
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
//       setCurrentView('category-browse');
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToMarketplace = () => {
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setSelectedCategory(null);
//     setError(null);
//   };

//   const handleBackToCategories = () => {
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleAddToCart = (item: CartItem) => {
//     setCart(prev => [...prev, item]);
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleRemoveFromCart = (index: number) => {
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleCheckout = () => {
//     setShowCartModal(false);
//     navigate('/sell/checkout', { state: { cart } });
//   };

//   const filteredCategories = useMemo(() => {
//     let filtered = [...categories];
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });
//     return filtered;
//   }, [categories, sortBy]);

//   const getPageTitle = () => {
//     if (currentView === 'marketplace') return 'Vender';
//     if (currentView === 'category-detail' && selectedCategory) return selectedCategory.name;
//     if (breadcrumb.length > 0) return breadcrumb[breadcrumb.length - 1].name;
//     return 'Vender';
//   };

//   const getPageDescription = () => {
//     if (currentView === 'marketplace') return 'Selecciona el tipo de material que deseas reciclar';
//     if (currentView === 'category-detail' && selectedCategory) return 'Completa los detalles de tu venta';
//     return 'Selecciona la categoría de tu dispositivo';
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="mb-8">
//         {/* Breadcrumb */}
//         <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="hover:text-gray-700 transition-colors"
//           >
//             <HomeIcon className="w-4 h-4" />
//           </button>
//           <ChevronRightIcon className="w-4 h-4" />
//           <button 
//             onClick={handleBackToMarketplace}
//             className={cn(
//               "hover:text-gray-700 transition-colors",
//               currentView === 'marketplace' && "text-gray-900 font-medium"
//             )}
//           >
//             Vender
//           </button>
          
//           {breadcrumb.map((crumb, index) => (
//             <React.Fragment key={crumb.id}>
//               <ChevronRightIcon className="w-4 h-4" />
//               <button
//                 onClick={() => handleBreadcrumbClick(index)}
//                 className={cn(
//                   "hover:text-gray-700 transition-colors",
//                   index === breadcrumb.length - 1 && currentView === 'category-browse' && "text-gray-900 font-medium"
//                 )}
//               >
//                 {crumb.name}
//               </button>
//             </React.Fragment>
//           ))}

//           {currentView === 'category-detail' && selectedCategory && (
//             <>
//               <ChevronRightIcon className="w-4 h-4" />
//               <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
//             </>
//           )}
//         </div>

//         {/* Título y descripción */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {getPageTitle()}
//             </h1>
//             <p className="text-gray-600">
//               {getPageDescription()}
//             </p>
//           </div>

//           {(currentView === 'category-browse' || currentView === 'category-detail') && (
//             <button
//               onClick={() => setShowCartModal(true)}
//               className="relative flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
//               <span className="text-sm font-medium text-gray-700">
//                 Mi Venta ({cart.length})
//               </span>
//               {cart.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-[#a8c241] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cart.length}
//                 </span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Contenido principal */}
//       {currentView === 'marketplace' ? (
//         /* ===== MARKETPLACE - DISEÑO MODERNO FULL WIDTH ===== */
//         <div className="space-y-8 -mx-4 sm:-mx-6 lg:-mx-8">
//           <div className="grid lg:grid-cols-2 gap-0">
//             {/* Dispositivos Completos - Full Width */}
//             <button
//               onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//               onMouseEnter={() => setHoveredCard('complete')}
//               onMouseLeave={() => setHoveredCard(null)}
//               className="group relative h-[500px] overflow-hidden transition-all duration-700 hover:shadow-2xl"
//             >
//               {/* Imagen de fondo */}
//               <div className="absolute inset-0">
//                 <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/60 z-10 group-hover:from-black/30 group-hover:via-black/20 group-hover:to-black/50 transition-all duration-700" />
//                 <img
//                   src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&auto=format&fit=crop&q=80"
//                   alt="Dispositivos Completos"
//                   className={cn(
//                     "w-full h-full object-cover transition-all duration-700",
//                     hoveredCard === 'complete' ? "scale-105" : "scale-100"
//                   )}
//                 />
//               </div>

//               {/* Contenido */}
//               <div className="relative z-20 h-full flex flex-col justify-end p-12 text-left">
//                 {/* Tag flotante */}
//                 <div className={cn(
//                   "inline-flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full mb-6 transition-all duration-500 w-fit",
//                   hoveredCard === 'complete' ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//                 )}>
//                   <CheckCircleIcon className="w-4 h-4 text-blue-600" />
//                   <span className="text-sm font-semibold text-blue-600">Evaluación completa</span>
//                 </div>

//                 <h2 className="text-5xl font-bold text-white mb-4 transform transition-transform duration-500 group-hover:translate-x-2">
//                   Dispositivos Completos
//                 </h2>
                
//                 <p className="text-xl text-white/90 mb-6 max-w-md leading-relaxed">
//                   Laptops, celulares, tablets y más equipos funcionales
//                 </p>

//                 {/* Features */}
//                 <div className="space-y-3 mb-8">
//                   <div className="flex items-center text-white/90">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span className="text-sm">Incluye accesorios y componentes</span>
//                   </div>
//                   <div className="flex items-center text-white/90">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span className="text-sm">Valuación individual por dispositivo</span>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <div className="flex items-center space-x-3 text-white group-hover:text-[#D0FF5B] transition-colors">
//                   <span className="text-lg font-semibold">Explorar categorías</span>
//                   <ArrowRightIcon className={cn(
//                     "w-6 h-6 transition-transform duration-300",
//                     hoveredCard === 'complete' && "translate-x-2"
//                   )} />
//                 </div>
//               </div>

//               {/* Efecto de gradiente en hover */}
//               <div className={cn(
//                 "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-1000 pointer-events-none",
//                 hoveredCard === 'complete' && "translate-x-full"
//               )} />
//             </button>

//             {/* Componentes y Partes - Full Width */}
//             <button
//               onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//               onMouseEnter={() => setHoveredCard('dismantled')}
//               onMouseLeave={() => setHoveredCard(null)}
//               className="group relative h-[500px] overflow-hidden transition-all duration-700 hover:shadow-2xl"
//             >
//               {/* Imagen de fondo */}
//               <div className="absolute inset-0">
//                 <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/60 z-10 group-hover:from-black/30 group-hover:via-black/20 group-hover:to-black/50 transition-all duration-700" />
//                 <img
//                   src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80"
//                   alt="Componentes y Partes"
//                   className={cn(
//                     "w-full h-full object-cover transition-all duration-700",
//                     hoveredCard === 'dismantled' ? "scale-105" : "scale-100"
//                   )}
//                 />
//               </div>

//               {/* Contenido */}
//               <div className="relative z-20 h-full flex flex-col justify-end p-12 text-left">
//                 {/* Tag flotante */}
//                 <div className={cn(
//                   "inline-flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full mb-6 transition-all duration-500 w-fit",
//                   hoveredCard === 'dismantled' ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//                 )}>
//                   <CheckCircleIcon className="w-4 h-4 text-green-600" />
//                   <span className="text-sm font-semibold text-green-600">Clasificación por materiales</span>
//                 </div>

//                 <h2 className="text-5xl font-bold text-white mb-4 transform transition-transform duration-500 group-hover:translate-x-2">
//                   Componentes & Partes
//                 </h2>
                
//                 <p className="text-xl text-white/90 mb-6 max-w-md leading-relaxed">
//                   Motherboards, procesadores, chips y componentes individuales
//                 </p>

//                 {/* Features */}
//                 <div className="space-y-3 mb-8">
//                   <div className="flex items-center text-white/90">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span className="text-sm">Recuperación de metales preciosos</span>
//                   </div>
//                   <div className="flex items-center text-white/90">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span className="text-sm">Valuación por peso y calidad</span>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <div className="flex items-center space-x-3 text-white group-hover:text-[#D0FF5B] transition-colors">
//                   <span className="text-lg font-semibold">Explorar categorías</span>
//                   <ArrowRightIcon className={cn(
//                     "w-6 h-6 transition-transform duration-300",
//                     hoveredCard === 'dismantled' && "translate-x-2"
//                   )} />
//                 </div>
//               </div>

//               {/* Efecto de gradiente en hover */}
//               <div className={cn(
//                 "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-1000 pointer-events-none",
//                 hoveredCard === 'dismantled' && "translate-x-full"
//               )} />
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto pt-12 border-t border-gray-200">
//               {[
//                 { value: '24h', label: 'Pago rápido' },
//                 { value: '100%', label: 'Seguro' },
//                 { value: '+5k', label: 'Ventas' }
//               ].map((stat, index) => (
//                 <div 
//                   key={index}
//                   className="text-center transform transition-all duration-500 hover:scale-110"
//                 >
//                   <div className="text-4xl font-bold bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent mb-2">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-gray-600">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       ) : currentView === 'category-detail' && selectedCategory ? (
//         <CategoryDetailView
//           category={selectedCategory}
//           onAddToCart={handleAddToCart}
//           onBack={handleBackToCategories}
//         />
//       ) : (
//         /* ===== VISTA CATEGORÍAS ===== */
//         <div className="space-y-6">
//           <div className="flex items-center justify-between pb-4 border-b border-gray-200">
//             <p className="text-sm text-gray-600">
//               {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
//             </p>
            
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as any)}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a8c241] focus:border-transparent outline-none"
//             >
//               <option value="popular">Más populares</option>
//               <option value="price-desc">Mayor precio</option>
//               <option value="price-asc">Menor precio</option>
//               <option value="name">Nombre A-Z</option>
//             </select>
//           </div>

//           {loading && (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8c241]"></div>
//               <p className="mt-4 text-sm text-gray-600">Cargando categorías...</p>
//             </div>
//           )}

//           {error && !loading && (
//             <div className="text-center py-20">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <Button 
//                 onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
//                 className="bg-[#a8c241] hover:bg-[#719428] text-white"
//               >
//                 Reintentar
//               </Button>
//             </div>
//           )}

//           {!loading && !error && filteredCategories.length === 0 && (
//             <div className="text-center py-20">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
//               <p className="text-gray-600">Intenta con otro tipo de dispositivo</p>
//             </div>
//           )}

//           {!loading && !error && filteredCategories.length > 0 && (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredCategories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category)}
//                   className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#a8c241] hover:shadow-md transition-all duration-300 text-left"
//                 >
//                   {category.thumbnailImage && (
//                     <div className="w-full h-48 overflow-hidden bg-gray-50">
//                       <img
//                         src={category.thumbnailImage}
//                         alt={category.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     </div>
//                   )}

//                   <div className="p-5">
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 group-hover:text-[#719428] transition-colors flex-1">
//                         {category.name}
//                       </h3>
//                       {category.isLeaf && (
//                         <Badge className="bg-green-50 text-green-700 border-green-200 text-xs ml-2">
//                           Seleccionable
//                         </Badge>
//                       )}
//                     </div>

//                     {category.description && (
//                       <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                         {category.description}
//                       </p>
//                     )}

//                     <div className="flex items-center text-sm text-gray-500 group-hover:text-[#a8c241] transition-colors">
//                       <span className="font-medium">
//                         {category.isLeaf ? 'Ver detalles' : 'Ver subcategorías'}
//                       </span>
//                       <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//         />
//       )}
//     </div>
//   );
// };

// export default SellPage;



// // src/pages/dashboard/SellPage.tsx - DISEÑO MINIMALISTA ELEGANTE
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ChevronRightIcon,
//   ShoppingCartIcon,
//   HomeIcon,
//   ArrowRightIcon,
// } from '@heroicons/react/24/outline';
// import { Category, CartItem } from '@/types/categories';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import categoryService from '@/services/categoryService';
// import { cn } from '@/utils/cn';
// import { ValidationUtils } from '@/utils/validation.utils';
// import SellCartModal from '@/components/sell/SellCartModal';
// import CategoryDetailView from '@/components/sell/CategoryDetailView';

// const COMPLETE_DEVICES_ROOT_ID = 'cmfr2mc1z00010py8ljs9os94';
// const DISMANTLED_DEVICES_ROOT_ID = 'cmfr2mcac001t0py8bs6j3uy0';

// const SellPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
//   const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showCartModal, setShowCartModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('popular');
//   const [hoveredCard, setHoveredCard] = useState<string | null>(null);

//   const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
//     setSelectedDeviceType(type);
//     setCurrentView('category-browse');
//     setLoading(true);
//     setError(null);

//     try {
//       const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
//       const children = await categoryService.getCategoryChildren(rootId);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron categorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb([{
//         id: rootId,
//         name: type === 'COMPLETE_DEVICES' ? 'Dispositivos Completos' : 'Componentes & Partes',
//         slug: type.toLowerCase(),
//         type: type,
//         status: 'ACTIVE',
//         level: 0,
//         path: [],
//         fullPath: '',
//         isLeaf: false,
//         sortOrder: 0,
//         images: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCategoryClick = async (category: Category) => {
//     if (category.isLeaf) {
//       setSelectedCategory(category);
//       setCurrentView('category-detail');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(category.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       if (validCategories.length === 0) {
//         setError('No se encontraron subcategorías disponibles');
//       }
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => [...prev, category]);
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBreadcrumbClick = async (index: number) => {
//     if (index === breadcrumb.length - 1) return;
    
//     const targetCategory = breadcrumb[index];
//     setLoading(true);
//     setError(null);
    
//     try {
//       const children = await categoryService.getCategoryChildren(targetCategory.id);
//       const validCategories = ValidationUtils.cleanCategoryArray(children);
      
//       setCategories(validCategories);
//       setBreadcrumb(prev => prev.slice(0, index + 1));
//       setCurrentView('category-browse');
//     } catch (error) {
//       setError(ValidationUtils.getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToMarketplace = () => {
//     setCurrentView('marketplace');
//     setSelectedDeviceType(null);
//     setCategories([]);
//     setBreadcrumb([]);
//     setSelectedCategory(null);
//     setError(null);
//   };

//   const handleBackToCategories = () => {
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleAddToCart = (item: CartItem) => {
//     setCart(prev => [...prev, item]);
//     setCurrentView('category-browse');
//     setSelectedCategory(null);
//   };

//   const handleRemoveFromCart = (index: number) => {
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleCheckout = () => {
//     setShowCartModal(false);
//     navigate('/sell/checkout', { state: { cart } });
//   };

//   const filteredCategories = useMemo(() => {
//     let filtered = [...categories];
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-desc':
//           return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
//         case 'price-asc':
//           return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
//         case 'name':
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });
//     return filtered;
//   }, [categories, sortBy]);

//   const getPageTitle = () => {
//     if (currentView === 'marketplace') return 'Vender';
//     if (currentView === 'category-detail' && selectedCategory) return selectedCategory.name;
//     if (breadcrumb.length > 0) return breadcrumb[breadcrumb.length - 1].name;
//     return 'Vender';
//   };

//   const getPageDescription = () => {
//     if (currentView === 'marketplace') return 'Selecciona el tipo de material que deseas reciclar';
//     if (currentView === 'category-detail' && selectedCategory) return 'Completa los detalles de tu venta';
//     return 'Selecciona la categoría de tu dispositivo';
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="mb-10">
//         {/* Breadcrumb */}
//         <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
//           <button 
//             onClick={() => navigate('/dashboard')}
//             className="hover:text-gray-700 transition-colors"
//           >
//             <HomeIcon className="w-4 h-4" />
//           </button>
//           <ChevronRightIcon className="w-4 h-4" />
//           <button 
//             onClick={handleBackToMarketplace}
//             className={cn(
//               "hover:text-gray-700 transition-colors",
//               currentView === 'marketplace' && "text-gray-900 font-medium"
//             )}
//           >
//             Vender
//           </button>
          
//           {breadcrumb.map((crumb, index) => (
//             <React.Fragment key={crumb.id}>
//               <ChevronRightIcon className="w-4 h-4" />
//               <button
//                 onClick={() => handleBreadcrumbClick(index)}
//                 className={cn(
//                   "hover:text-gray-700 transition-colors",
//                   index === breadcrumb.length - 1 && currentView === 'category-browse' && "text-gray-900 font-medium"
//                 )}
//               >
//                 {crumb.name}
//               </button>
//             </React.Fragment>
//           ))}

//           {currentView === 'category-detail' && selectedCategory && (
//             <>
//               <ChevronRightIcon className="w-4 h-4" />
//               <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
//             </>
//           )}
//         </div>

//         {/* Título y descripción */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {getPageTitle()}
//             </h1>
//             <p className="text-gray-600">
//               {getPageDescription()}
//             </p>
//           </div>

//           {(currentView === 'category-browse' || currentView === 'category-detail') && (
//             <button
//               onClick={() => setShowCartModal(true)}
//               className="relative flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
//               <span className="text-sm font-medium text-gray-700">
//                 Mi Venta ({cart.length})
//               </span>
//               {cart.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-[#a8c241] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cart.length}
//                 </span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Contenido principal */}
//       {currentView === 'marketplace' ? (
//         /* ===== MARKETPLACE MINIMALISTA ===== */
//         <div className="space-y-6">
//           {/* Grid de tarjetas con espacio blanco elegante */}
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Dispositivos Completos */}
//             <button
//               onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
//               onMouseEnter={() => setHoveredCard('complete')}
//               onMouseLeave={() => setHoveredCard(null)}
//               className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#a8c241] transition-all duration-500 hover:shadow-xl text-left"
//             >
//               {/* Imagen con aspect ratio controlado */}
//               <div className="relative h-72 overflow-hidden bg-gray-100">
//                 <img
//                   src="/public/assets/completos3.png"
//                   alt="Dispositivos Completos"
//                   className={cn(
//                     "w-full h-full object-cover transition-all duration-700 ease-out",
//                     hoveredCard === 'complete' ? "scale-110" : "scale-100"
//                   )}
//                 />
//                 {/* Overlay sutil */}
//                 <div className={cn(
//                   "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500",
//                   hoveredCard === 'complete' ? "opacity-70" : "opacity-40"
//                 )} />
//               </div>

//               {/* Contenido */}
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#719428] transition-colors duration-300">
//                   Dispositivos Completos
//                 </h3>
                
//                 <p className="text-gray-600 mb-6 leading-relaxed">
//                   Laptops, celulares, tablets y más equipos funcionales
//                 </p>

//                 {/* Características */}
//                 <div className="space-y-2.5 mb-6">
//                   <div className="flex items-center text-sm text-gray-700">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span>Incluye accesorios y componentes</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-700">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span>Valuación individual por dispositivo</span>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <div className="flex items-center text-[#719428] font-medium group-hover:text-[#a8c241] transition-colors">
//                   <span>Explorar categorías</span>
//                   <ArrowRightIcon className={cn(
//                     "w-5 h-5 ml-2 transition-transform duration-300",
//                     hoveredCard === 'complete' && "translate-x-2"
//                   )} />
//                 </div>
//               </div>

//               {/* Indicador visual sutil */}
//               <div className={cn(
//                 "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a8c241] to-[#719428] transition-all duration-500",
//                 hoveredCard === 'complete' ? "opacity-100" : "opacity-0"
//               )} />
//             </button>

//             {/* Componentes y Partes */}
//             <button
//               onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
//               onMouseEnter={() => setHoveredCard('dismantled')}
//               onMouseLeave={() => setHoveredCard(null)}
//               className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#a8c241] transition-all duration-500 hover:shadow-xl text-left"
//             >
//               {/* Imagen con aspect ratio controlado */}
//               <div className="relative h-72 overflow-hidden bg-gray-100">
//                 <img
//                   src="/public/assets/componentes3.png"
//                   alt="Componentes y Partes"
//                   className={cn(
//                     "w-full h-full object-cover transition-all duration-700 ease-out",
//                     hoveredCard === 'dismantled' ? "scale-110" : "scale-100"
//                   )}
//                 />
//                 {/* Overlay sutil */}
//                 <div className={cn(
//                   "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500",
//                   hoveredCard === 'dismantled' ? "opacity-70" : "opacity-40"
//                 )} />
//               </div>

//               {/* Contenido */}
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#719428] transition-colors duration-300">
//                   Componentes & Partes
//                 </h3>
                
//                 <p className="text-gray-600 mb-6 leading-relaxed">
//                   Motherboards, procesadores, chips y componentes individuales
//                 </p>

//                 {/* Características */}
//                 <div className="space-y-2.5 mb-6">
//                   <div className="flex items-center text-sm text-gray-700">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span>Recuperación de metales preciosos</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-700">
//                     <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3" />
//                     <span>Valuación por peso y calidad</span>
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <div className="flex items-center text-[#719428] font-medium group-hover:text-[#a8c241] transition-colors">
//                   <span>Explorar categorías</span>
//                   <ArrowRightIcon className={cn(
//                     "w-5 h-5 ml-2 transition-transform duration-300",
//                     hoveredCard === 'dismantled' && "translate-x-2"
//                   )} />
//                 </div>
//               </div>

//               {/* Indicador visual sutil */}
//               <div className={cn(
//                 "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a8c241] to-[#719428] transition-all duration-500",
//                 hoveredCard === 'dismantled' ? "opacity-100" : "opacity-0"
//               )} />
//             </button>
//           </div>

//           {/* Stats minimalistas */}
//           <div className="grid grid-cols-3 gap-8 pt-16 mt-8 border-t border-gray-100">
//             {[
//               { value: '24h', label: 'Pago rápido', icon: '⚡' },
//               { value: '100%', label: 'Seguro', icon: '🔒' },
//               { value: '+5k', label: 'Ventas', icon: '✓' }
//             ].map((stat, index) => (
//               <div 
//                 key={index}
//                 className="text-center group cursor-default"
//               >
//                 <div className="text-2xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
//                   {stat.icon}
//                 </div>
//                 <div className="text-3xl font-bold text-gray-900 mb-1">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-gray-500">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : currentView === 'category-detail' && selectedCategory ? (
//         <CategoryDetailView
//           category={selectedCategory}
//           onAddToCart={handleAddToCart}
//           onBack={handleBackToCategories}
//         />
//       ) : (
//         /* ===== VISTA CATEGORÍAS ===== */
//         <div className="space-y-6">
//           <div className="flex items-center justify-between pb-4 border-b border-gray-200">
//             <p className="text-sm text-gray-600">
//               {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
//             </p>
            
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as any)}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a8c241] focus:border-transparent outline-none transition-all"
//             >
//               <option value="popular">Más populares</option>
//               <option value="price-desc">Mayor precio</option>
//               <option value="price-asc">Menor precio</option>
//               <option value="name">Nombre A-Z</option>
//             </select>
//           </div>

//           {loading && (
//             <div className="text-center py-20">
//               <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8c241]"></div>
//               <p className="mt-4 text-sm text-gray-600">Cargando categorías...</p>
//             </div>
//           )}

//           {error && !loading && (
//             <div className="text-center py-20">
//               <div className="text-5xl mb-4">⚠️</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
//               <p className="text-gray-600 mb-6">{error}</p>
//               <Button 
//                 onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
//                 className="bg-[#a8c241] hover:bg-[#719428] text-white"
//               >
//                 Reintentar
//               </Button>
//             </div>
//           )}

//           {!loading && !error && filteredCategories.length === 0 && (
//             <div className="text-center py-20">
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
//               <p className="text-gray-600">Intenta con otro tipo de dispositivo</p>
//             </div>
//           )}

//           {!loading && !error && filteredCategories.length > 0 && (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//               {filteredCategories.map((category) => (
//                 <button
//                   key={category.id}
//                   onClick={() => handleCategoryClick(category)}
//                   className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#a8c241] hover:shadow-lg transition-all duration-300 text-left"
//                 >
//                   {category.thumbnailImage && (
//                     <div className="w-full h-48 overflow-hidden bg-gray-50">
//                       <img
//                         src={category.thumbnailImage}
//                         alt={category.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     </div>
//                   )}

//                   <div className="p-5">
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 group-hover:text-[#719428] transition-colors flex-1 pr-2">
//                         {category.name}
//                       </h3>
//                       {category.isLeaf && (
//                         <Badge className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
//                           Seleccionable
//                         </Badge>
//                       )}
//                     </div>

//                     {category.description && (
//                       <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
//                         {category.description}
//                       </p>
//                     )}

//                     <div className="flex items-center text-sm text-[#719428] font-medium group-hover:text-[#a8c241] transition-colors">
//                       <span>
//                         {category.isLeaf ? 'Ver detalles' : 'Ver subcategorías'}
//                       </span>
//                       <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   </div>

//                   {/* Línea de acento inferior */}
//                   <div className="h-1 bg-gradient-to-r from-[#a8c241] to-[#719428] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {showCartModal && (
//         <SellCartModal
//           cart={cart}
//           onClose={() => setShowCartModal(false)}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//         />
//       )}
//     </div>
//   );
// };

// export default SellPage;







// src/pages/dashboard/SellPage.tsx - CON IMÁGENES DE CATEGORÍAS DEL BACKEND
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRightIcon,
  ShoppingCartIcon,
  HomeIcon,
  ArrowRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { Category, CartItem } from '@/types/categories';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import categoryService from '@/services/categoryService';
import { cn } from '@/utils/cn';
import { ValidationUtils } from '@/utils/validation.utils';
import SellCartModal from '@/components/sell/SellCartModal';
import CategoryDetailView from '@/components/sell/CategoryDetailView';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { categories } from '@/components/sell/CategorySelector';

const COMPLETE_DEVICES_ROOT_ID = 'cmgy4jpc800010pk0un0u88fq';
const DISMANTLED_DEVICES_ROOT_ID = 'cmgy4jpfa001t0pk0d57s1oeu';

const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, clearCart, isLoading, isSyncing } = useCart();

  
  const [currentView, setCurrentView] = useState<'marketplace' | 'category-browse' | 'category-detail'>('marketplace');
  const [selectedDeviceType, setSelectedDeviceType] = useState<'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  // const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'popular'>('popular');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleDeviceTypeSelect = async (type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES') => {
    setSelectedDeviceType(type);
    setCurrentView('category-browse');
    setLoading(true);
    setError(null);

    try {
      const rootId = type === 'COMPLETE_DEVICES' ? COMPLETE_DEVICES_ROOT_ID : DISMANTLED_DEVICES_ROOT_ID;
      const children = await categoryService.getCategoryChildren(rootId);
      const validCategories = ValidationUtils.cleanCategoryArray(children);
      
      if (validCategories.length === 0) {
        setError('No se encontraron categorías disponibles');
      }
      
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    } catch (error) {
      setError(ValidationUtils.getErrorMessage(error));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    if (category.isLeaf) {
      setSelectedCategory(category);
      setCurrentView('category-detail');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const children = await categoryService.getCategoryChildren(category.id);
      const validCategories = ValidationUtils.cleanCategoryArray(children);
      
      if (validCategories.length === 0) {
        setError('No se encontraron subcategorías disponibles');
      }
      
      setCategories(validCategories);
      setBreadcrumb(prev => [...prev, category]);
    } catch (error) {
      setError(ValidationUtils.getErrorMessage(error));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBreadcrumbClick = async (index: number) => {
    if (index === breadcrumb.length - 1) return;
    
    const targetCategory = breadcrumb[index];
    setLoading(true);
    setError(null);
    
    try {
      const children = await categoryService.getCategoryChildren(targetCategory.id);
      const validCategories = ValidationUtils.cleanCategoryArray(children);
      
      setCategories(validCategories);
      setBreadcrumb(prev => prev.slice(0, index + 1));
      setCurrentView('category-browse');
    } catch (error) {
      setError(ValidationUtils.getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMarketplace = () => {
    setCurrentView('marketplace');
    setSelectedDeviceType(null);
    setCategories([]);
    setBreadcrumb([]);
    setSelectedCategory(null);
    setError(null);
  };

  const handleBackToCategories = () => {
    setCurrentView('category-browse');
    setSelectedCategory(null);
  };

  // const handleAddToCart = (item: CartItem) => {
  //   setCart(prev => [...prev, item]);
  //   setCurrentView('category-browse');
  //   setSelectedCategory(null);
  // };

  // const handleRemoveFromCart = (index: number) => {
  //   setCart(prev => prev.filter((_, i) => i !== index));
  // };

  // const handleCheckout = () => {

  //   console.log('Navegando a checkout con carrito:', cart);

  // setShowCartModal(false);
  
  // // Navegar al checkout con el estado del carrito
  // navigate('/dashboard/sell/checkout', { 
  //   state: { 
  //     cart: cart 
  //   } 
  // });

  const handleAddToCart = async (item: CartItem) => {
    await addToCart(item);
    setCurrentView('category-browse');
    setSelectedCategory(null);
  };

  const handleRemoveFromCart = async (itemId: string) => {
    await removeFromCart(itemId);
  };

const handleCheckout = () => {
  if (!cart || cart.length === 0) {
    toast.error('Tu carrito está vacío');
    return;
  }

  // Mostrar loading mientras sincroniza
  {isSyncing && (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#a8c241]"></div>
        <span className="text-sm text-gray-600">Sincronizando carrito...</span>
      </div>
    </div>
  )}

  setShowCartModal(false);
  
  navigate('/dashboard/sell/checkout', {
    state: {
      cart: cart,
    },
  });
};

const filteredCategories = useMemo(() => {
    let filtered = [...categories];
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-desc':
          return (parseFloat(b.pricePerKg?.toString() || '0')) - (parseFloat(a.pricePerKg?.toString() || '0'));
        case 'price-asc':
          return (parseFloat(a.pricePerKg?.toString() || '0')) - (parseFloat(b.pricePerKg?.toString() || '0'));
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return filtered;
  }, [categories, sortBy]);

  const getPageTitle = () => {
    if (currentView === 'marketplace') return 'Vender';
    if (currentView === 'category-detail' && selectedCategory) return selectedCategory.name;
    if (breadcrumb.length > 0) return breadcrumb[breadcrumb.length - 1].name;
    return 'Vender';
  };

  const getPageDescription = () => {
    if (currentView === 'marketplace') return 'Selecciona el tipo de material que deseas reciclar';
    if (currentView === 'category-detail' && selectedCategory) return 'Completa los detalles de tu venta';
    return 'Selecciona la categoría de tu dispositivo';
  };

  // Obtener imagen de categoría (thumbnailImage o primera imagen)
  const getCategoryImage = (category: Category): string | null => {
    if (category.thumbnailImage) return category.thumbnailImage;
    if (category.images && category.images.length > 0) return category.images[0];
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-gray-700 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
          </button>
          <ChevronRightIcon className="w-4 h-4" />
          <button 
            onClick={handleBackToMarketplace}
            className={cn(
              "hover:text-gray-700 transition-colors",
              currentView === 'marketplace' && "text-gray-900 font-medium"
            )}
          >
            Vender
          </button>
          
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRightIcon className="w-4 h-4" />
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={cn(
                  "hover:text-gray-700 transition-colors",
                  index === breadcrumb.length - 1 && currentView === 'category-browse' && "text-gray-900 font-medium"
                )}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}

          {currentView === 'category-detail' && selectedCategory && (
            <>
              <ChevronRightIcon className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{selectedCategory.name}</span>
            </>
          )}
        </div>

        {/* Título y descripción */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600">
              {getPageDescription()}
            </p>
          </div>

          {(currentView === 'category-browse' || currentView === 'category-detail') && (
            <button
              onClick={() => setShowCartModal(true)}
              className="relative flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                Mi Venta ({cart.length})
              </span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#a8c241] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      {currentView === 'marketplace' ? (
        /* ===== MARKETPLACE ===== */
        <div className="space-y-6">
          {/* Grid de tarjetas */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dispositivos Completos */}
            <button
              onClick={() => handleDeviceTypeSelect('COMPLETE_DEVICES')}
              onMouseEnter={() => setHoveredCard('complete')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl text-left flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src="/public/assets/completos3.png"
                  alt="Dispositivos Completos"
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700 ease-out",
                    hoveredCard === 'complete' ? "scale-110" : "scale-100"
                  )}
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500",
                  hoveredCard === 'complete' ? "opacity-70" : "opacity-40"
                )} />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#719428] transition-colors duration-300 min-h-[64px] flex items-start">
                  Dispositivos Completos
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed min-h-[56px]">
                  Laptops, celulares, tablets y más equipos funcionales
                </p>

                <div className="space-y-2.5 mb-6 min-h-[60px]">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3 flex-shrink-0" />
                    <span>Incluye accesorios y componentes</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3 flex-shrink-0" />
                    <span>Valuación individual por dispositivo</span>
                  </div>
                </div>

                <div className="flex items-center text-[#719428] font-medium group-hover:text-[#a8c241] transition-colors mt-auto">
                  <span>Explorar categorías</span>
                  <ArrowRightIcon className={cn(
                    "w-5 h-5 ml-2 transition-transform duration-300",
                    hoveredCard === 'complete' && "translate-x-2"
                  )} />
                </div>
              </div>
            </button>

            {/* Componentes y Partes */}
            <button
              onClick={() => handleDeviceTypeSelect('DISMANTLED_DEVICES')}
              onMouseEnter={() => setHoveredCard('dismantled')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl text-left flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src="/public/assets/componentes3.png"
                  alt="Componentes y Partes"
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700 ease-out",
                    hoveredCard === 'dismantled' ? "scale-110" : "scale-100"
                  )}
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500",
                  hoveredCard === 'dismantled' ? "opacity-70" : "opacity-40"
                )} />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#719428] transition-colors duration-300 min-h-[64px] flex items-start">
                  Componentes & Partes
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed min-h-[56px]">
                  Motherboards, procesadores, chips y componentes individuales
                </p>

                <div className="space-y-2.5 mb-6 min-h-[60px]">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3 flex-shrink-0" />
                    <span>Recuperación de metales preciosos</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a8c241] mr-3 flex-shrink-0" />
                    <span>Valuación por peso y calidad</span>
                  </div>
                </div>

                <div className="flex items-center text-[#719428] font-medium group-hover:text-[#a8c241] transition-colors mt-auto">
                  <span>Explorar categorías</span>
                  <ArrowRightIcon className={cn(
                    "w-5 h-5 ml-2 transition-transform duration-300",
                    hoveredCard === 'dismantled' && "translate-x-2"
                  )} />
                </div>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 mt-8 border-t border-gray-100">
            {[
              { value: '24h', label: 'Pago rápido', icon: '⚡' },
              { value: '100%', label: 'Seguro', icon: '🔒' },
              { value: '+5k', label: 'Ventas', icon: '✓' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center group cursor-default"
              >
                <div className="text-2xl mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : currentView === 'category-detail' && selectedCategory ? (
        <CategoryDetailView
          category={selectedCategory}
          onAddToCart={handleAddToCart}
          onBack={handleBackToCategories}
        />
      ) : (
        /* ===== VISTA CATEGORÍAS CON IMÁGENES DEL BACKEND ===== */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría disponible' : 'categorías disponibles'}
            </p>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#a8c241] focus:border-transparent outline-none transition-all"
            >
              <option value="popular">Más populares</option>
              <option value="price-desc">Mayor precio</option>
              <option value="price-asc">Menor precio</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#a8c241]"></div>
              <p className="mt-4 text-sm text-gray-600">Cargando categorías...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar categorías</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => handleDeviceTypeSelect(selectedDeviceType!)}
                className="bg-[#a8c241] hover:bg-[#719428] text-white"
              >
                Reintentar
              </Button>
            </div>
          )}

          {!loading && !error && filteredCategories.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías disponibles</h3>
              <p className="text-gray-600">Intenta con otro tipo de dispositivo</p>
            </div>
          )}

          {!loading && !error && filteredCategories.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((category) => {
                const categoryImage = getCategoryImage(category);
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#a8c241] hover:shadow-lg transition-all duration-300 text-left"
                  >
                    {/* Imagen de la categoría */}
                    {categoryImage ? (
                      <div className="w-full h-48 overflow-hidden bg-gray-50">
                        <img
                          src={categoryImage}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback si la imagen falla
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ) : (
                      // Placeholder si no hay imagen
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <PhotoIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#719428] transition-colors flex-1 pr-2">
                          {category.name}
                        </h3>
                        {category.isLeaf && (
                          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
                            Seleccionable
                          </Badge>
                        )}
                      </div>

                      {category.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center text-sm text-[#719428] font-medium group-hover:text-[#a8c241] transition-colors">
                        <span>
                          {category.isLeaf ? 'Ver detalles' : 'Ver subcategorías'}
                        </span>
                        <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showCartModal && (
        <SellCartModal
          cart={cart}
          onClose={() => setShowCartModal(false)}
          onRemoveItem={(index: number) => {
            const item = cart && cart[index];
            if (item && item.id) {
              // call async remover but don't return the Promise to match expected void signature
              void handleRemoveFromCart(item.id);
            }
          }}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

export default SellPage;