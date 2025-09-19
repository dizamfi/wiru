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









// src/pages/dashboard/SellPage.tsx - FIXED VERSION
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon,
  ShoppingCartIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CategorySelector } from '@/components/categories/CategorySelector';
import { CategoryDetails } from '@/components/categories/CategoryDetails';
import { useCategories } from '@/hooks/useCategories';
import { Category, CartItemData, DeviceCondition, CategoryType } from '@/types/categories';

type SellStep = 'category-selection' | 'category-details' | 'device-form' | 'cart-review';

export const SellPage: React.FC = () => {
  // 🔧 FIX: Usar el hook corregido
  const categories = useCategories();
  
  const [currentStep, setCurrentStep] = useState<SellStep>('category-selection');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [showCart, setShowCart] = useState(false);

  // 🔧 FIX: Memoized handlers para evitar re-renders
  const handleCategorySelect = useCallback((category: Category) => {
    console.log('🎯 Category selected:', category.name);
    setSelectedCategory(category);
    setCurrentStep('category-details');
  }, []);

  const handleCategoryConfirm = useCallback((category: Category) => {
    console.log('✅ Category confirmed:', category.name);
    setSelectedCategory(category);
    setCurrentStep('device-form');
  }, []);

  const handleDeviceAdd = useCallback((deviceData: Omit<CartItemData, 'addedAt'>) => {
    const newItem: CartItemData = {
      ...deviceData,
      addedAt: new Date().toISOString()
    };
    
    console.log('➕ Device added to cart:', newItem);
    setCartItems(prev => [...prev, newItem]);
    
    // Volver a selección de categorías para agregar más items
    setCurrentStep('category-selection');
    setSelectedCategory(null);
  }, []);

  const handleBackStep = useCallback(() => {
    switch (currentStep) {
      case 'category-details':
        setCurrentStep('category-selection');
        setSelectedCategory(null);
        break;
      case 'device-form':
        setCurrentStep('category-details');
        break;
      case 'cart-review':
        setCurrentStep('category-selection');
        break;
      default:
        setCurrentStep('category-selection');
    }
  }, [currentStep]);

  const handleCartToggle = useCallback(() => {
    setShowCart(prev => !prev);
  }, []);

  const handleCartReview = useCallback(() => {
    setCurrentStep('cart-review');
    setShowCart(false);
  }, []);

  // 🔧 FIX: Memoizar valores computados
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.estimatedPrice || 0), 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  // 🔧 FIX: Error boundary para mostrar errores
  if (categories.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar categorías
          </h2>
          <p className="text-gray-600 mb-4">
            {categories.error}
          </p>
          <Button 
            onClick={categories.refresh}
            loading={categories.loading}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // 🔧 FIX: Loading state mejorado
  if (categories.loading && categories.types.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackStep}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Atrás
              </Button>

              {/* Steps Indicator */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className={currentStep === 'category-selection' ? 'font-medium text-primary-600' : ''}>
                  1. Seleccionar Categoría
                </span>
                <span>→</span>
                <span className={currentStep === 'category-details' ? 'font-medium text-primary-600' : ''}>
                  2. Detalles
                </span>
                <span>→</span>
                <span className={currentStep === 'device-form' ? 'font-medium text-primary-600' : ''}>
                  3. Información del Dispositivo
                </span>
              </div>
            </div>

            {/* Cart Button */}
            <Button
              variant="outline"
              onClick={handleCartToggle}
              className="relative"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Carrito
              {cartItemCount > 0 && (
                <Badge 
                  variant="danger" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {currentStep === 'category-selection' && (
            <motion.div
              key="category-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Convertir tu chatarra electrónica en dinero de forma rápida y segura
                </h1>
                <p className="text-gray-600">
                  Selecciona la categoría de tu dispositivo para comenzar
                </p>
              </div>
              
              <CategorySelector
                types={categories.types}
                categories={categories.currentCategories}
                selectedType={categories.selectedType}
                onTypeSelect={categories.selectType}
                onCategorySelect={handleCategorySelect}
                loading={categories.loading}
              />
            </motion.div>
          )}

          {/* Step 2: Category Details */}
          {currentStep === 'category-details' && selectedCategory && (
            <motion.div
              key="category-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryDetails
                category={selectedCategory}
                onBack={handleBackStep} onConfirm={function (category: Category): void {
                  throw new Error('Function not implemented.');
                } }              />
            </motion.div>
          )}

          {/* Step 3: Device Form */}
          {currentStep === 'device-form' && selectedCategory && (
            <motion.div
              key="device-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* DeviceForm component will be implemented */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Información del dispositivo: {selectedCategory.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  Proporciona los detalles de tu dispositivo para obtener una cotización precisa.
                </p>
                
                {/* Placeholder for DeviceForm */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                      DeviceForm component será implementado aquí
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={handleBackStep}>
                      Atrás
                    </Button>
                    <Button onClick={() => {
                      // Mock device data for now
                      handleDeviceAdd({
                        categoryId: selectedCategory.id,
                        categoryName: selectedCategory.name,

                        // Mock data
                        condition: DeviceCondition.GOOD,
                        weight: 1,
                        description: 'Mock device',
                        images: [],
                        id: '',
                        estimatedValue: 0,
                        estimatedPrice: 0
                      });
                    }}>
                      Agregar al Carrito
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={handleCartToggle}
            />
            
            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Carrito de Compras</h2>
                  <Button variant="ghost" size="sm" onClick={handleCartToggle}>
                    ×
                  </Button>
                </div>
                
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h3 className="font-semibold">{item.categoryName}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-lg font-bold text-primary-600">
                            ${item.estimatedPrice}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Cart Total */}
                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">${cartTotal}</span>
                      </div>
                    </div>
                    
                    {/* Cart Actions */}
                    <div className="space-y-3">
                      <Button onClick={handleCartReview} className="w-full">
                        Revisar Orden
                      </Button>
                      <Button variant="outline" className="w-full">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Agregar más dispositivos
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellPage;