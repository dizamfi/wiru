// // src/pages/dashboard/CheckoutPage.tsx - CHECKOUT COMPLETO
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   HomeIcon,
//   ChevronRightIcon,
//   ShoppingCartIcon,
//   TruckIcon,
//   BuildingStorefrontIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
//   MapPinIcon,
//   PhoneIcon,
//   UserIcon,
//   DocumentTextIcon,
//   CreditCardIcon,
// } from '@heroicons/react/24/outline';
// import { CartItem } from '@/types/categories';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { Badge } from '@/components/ui/Badge';
// import { cn } from '@/utils/cn';
// import toast from 'react-hot-toast';

// interface DeliveryMethod {
//   id: 'pickup' | 'home';
//   name: string;
//   description: string;
//   icon: React.ReactNode;
//   price: number;
//   estimatedTime: string;
// }

// interface CheckoutFormData {
//   // Datos personales
//   fullName: string;
//   phone: string;
//   email: string;
//   idNumber: string;
  
//   // Dirección (solo para recolección a domicilio)
//   address: string;
//   city: string;
//   province: string;
//   reference: string;
  
//   // Método de entrega
//   deliveryMethod: 'pickup' | 'home';
  
//   // Notas adicionales
//   notes: string;
// }

// const DELIVERY_METHODS: DeliveryMethod[] = [
//   {
//     id: 'pickup',
//     name: 'Punto Servientrega',
//     description: 'Entrega en oficina de Servientrega más cercana',
//     icon: <BuildingStorefrontIcon className="w-6 h-6" />,
//     price: 0,
//     estimatedTime: '1-2 días hábiles',
//   },
//   {
//     id: 'home',
//     name: 'Recolección a Domicilio',
//     description: 'Recogemos en tu dirección (solo 5kg+)',
//     icon: <TruckIcon className="w-6 h-6" />,
//     price: 15,
//     estimatedTime: '2-3 días hábiles',
//   },
// ];

// const CheckoutPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const cart: CartItem[] = location.state?.cart || [];

//   const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<CheckoutFormData>({
//     fullName: '',
//     phone: '',
//     email: '',
//     idNumber: '',
//     address: '',
//     city: '',
//     province: '',
//     reference: '',
//     deliveryMethod: 'pickup',
//     notes: '',
//   });

//   // Calcular totales
//   const subtotal = cart.reduce((sum, item) => sum + item.estimatedValue, 0);
//   const deliveryFee = formData.deliveryMethod === 'home' ? 15 : 0;
//   const total = subtotal + deliveryFee;
//   const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

//   // Validar si el carrito está vacío
//   useEffect(() => {
//     if (cart.length === 0) {
//       toast.error('Tu carrito está vacío');
//       navigate('/sell');
//     }
//   }, [cart, navigate]);

//   // Validar peso mínimo para recolección a domicilio
//   const canUseHomeDelivery = totalWeight >= 5;

//   // Manejar cambios en el formulario
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Seleccionar método de entrega
//   const handleDeliveryMethodSelect = (method: 'pickup' | 'home') => {
//     if (method === 'home' && !canUseHomeDelivery) {
//       toast.error('Recolección a domicilio requiere mínimo 5kg');
//       return;
//     }
//     setFormData(prev => ({ ...prev, deliveryMethod: method }));
//   };

//   // Validar paso actual
//   const validateCurrentStep = (): boolean => {
//     if (currentStep === 1) {
//       // Validar datos personales
//       if (!formData.fullName.trim()) {
//         toast.error('Ingresa tu nombre completo');
//         return false;
//       }
//       if (!formData.phone.trim() || formData.phone.length < 10) {
//         toast.error('Ingresa un teléfono válido');
//         return false;
//       }
//       if (!formData.email.trim() || !formData.email.includes('@')) {
//         toast.error('Ingresa un email válido');
//         return false;
//       }
//       if (!formData.idNumber.trim() || formData.idNumber.length < 10) {
//         toast.error('Ingresa una cédula válida');
//         return false;
//       }
//       return true;
//     }

//     if (currentStep === 2) {
//       // Validar método de entrega y dirección
//       if (formData.deliveryMethod === 'home') {
//         if (!formData.address.trim()) {
//           toast.error('Ingresa tu dirección');
//           return false;
//         }
//         if (!formData.city.trim()) {
//           toast.error('Ingresa tu ciudad');
//           return false;
//         }
//         if (!formData.province.trim()) {
//           toast.error('Ingresa tu provincia');
//           return false;
//         }
//       }
//       return true;
//     }

//     return true;
//   };

//   // Avanzar al siguiente paso
//   const handleNextStep = () => {
//     if (validateCurrentStep()) {
//       setCurrentStep(prev => Math.min(3, prev + 1) as 1 | 2 | 3);
//     }
//   };

//   // Retroceder al paso anterior
//   const handlePrevStep = () => {
//     setCurrentStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3);
//   };

//   // Confirmar orden
//   const handleConfirmOrder = async () => {
//     if (!validateCurrentStep()) return;

//     setLoading(true);

//     try {
//       // Aquí iría la lógica para crear la orden en el backend
//       // const orderData = {
//       //   items: cart,
//       //   customer: {
//       //     fullName: formData.fullName,
//       //     phone: formData.phone,
//       //     email: formData.email,
//       //     idNumber: formData.idNumber,
//       //   },
//       //   delivery: {
//       //     method: formData.deliveryMethod,
//       //     address: formData.deliveryMethod === 'home' ? {
//       //       address: formData.address,
//       //       city: formData.city,
//       //       province: formData.province,
//       //       reference: formData.reference,
//       //     } : null,
//       //   },
//       //   notes: formData.notes,
//       //   totals: {
//       //     subtotal,
//       //     deliveryFee,
//       //     total,
//       //   },
//       // };

//       // const response = await orderService.createOrder(orderData);

//       // Simular creación de orden
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       toast.success('¡Orden creada exitosamente!');
      
//      // Redirigir a confirmación
// navigate('/dashboard/order/confirmation', { 
//   state: { 
//     orderNumber: 'ORD-' + Date.now().toString().slice(-6),
//     orderData: {
//       items: cart,
//       total: total,
//       deliveryMethod: formData.deliveryMethod,
//     }
//   } 
// });

//     } catch (error) {
//       console.error('Error creating order:', error);
//       toast.error('Error al crear la orden. Intenta nuevamente.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           {/* Breadcrumb */}
//           <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
//             <button onClick={() => navigate('/dashboard')} className="hover:text-gray-700">
//               <HomeIcon className="w-4 h-4" />
//             </button>
//             <ChevronRightIcon className="w-4 h-4" />
//             <button onClick={() => navigate('/sell')} className="hover:text-gray-700">
//               Vender
//             </button>
//             <ChevronRightIcon className="w-4 h-4" />
//             <span className="text-gray-900 font-medium">Checkout</span>
//           </div>

//           {/* Título */}
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Venta</h1>
//               <p className="text-gray-600">Completa los datos para generar tu orden</p>
//             </div>
//             <div className="hidden md:flex items-center space-x-2 text-gray-600">
//               <ShoppingCartIcon className="w-5 h-5" />
//               <span className="text-sm">{cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stepper */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             {[
//               { step: 1, name: 'Datos Personales', icon: UserIcon },
//               { step: 2, name: 'Método de Entrega', icon: TruckIcon },
//               { step: 3, name: 'Confirmación', icon: CheckCircleIcon },
//             ].map((item, index) => (
//               <React.Fragment key={item.step}>
//                 <div className="flex flex-col items-center flex-1">
//                   <div
//                     className={cn(
//                       'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all',
//                       currentStep >= item.step
//                         ? 'bg-[#a8c241] text-white'
//                         : 'bg-gray-200 text-gray-400'
//                     )}
//                   >
//                     {currentStep > item.step ? (
//                       <CheckCircleIcon className="w-6 h-6" />
//                     ) : (
//                       <item.icon className="w-6 h-6" />
//                     )}
//                   </div>
//                   <span
//                     className={cn(
//                       'text-sm font-medium',
//                       currentStep >= item.step ? 'text-gray-900' : 'text-gray-400'
//                     )}
//                   >
//                     {item.name}
//                   </span>
//                 </div>
//                 {index < 2 && (
//                   <div className="flex-1 h-0.5 mx-4 mt-6">
//                     <div
//                       className={cn(
//                         'h-full transition-all',
//                         currentStep > item.step ? 'bg-[#a8c241]' : 'bg-gray-200'
//                       )}
//                     />
//                   </div>
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Contenido */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Formulario */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Paso 1: Datos Personales */}
//             {currentStep === 1 && (
//               <Card className="p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">Datos Personales</h2>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Nombre Completo *
//                     </label>
//                     <div className="relative">
//                       <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         type="text"
//                         name="fullName"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         placeholder="Juan Pérez"
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Teléfono *
//                       </label>
//                       <div className="relative">
//                         <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           placeholder="0999999999"
//                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Cédula/RUC *
//                       </label>
//                       <div className="relative">
//                         <DocumentTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                           type="text"
//                           name="idNumber"
//                           value={formData.idNumber}
//                           onChange={handleInputChange}
//                           placeholder="0123456789"
//                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="juan@ejemplo.com"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-6">
//                   <Button
//                     onClick={handleNextStep}
//                     className="bg-[#a8c241] hover:bg-[#719428] text-white px-8"
//                   >
//                     Continuar
//                   </Button>
//                 </div>
//               </Card>
//             )}

//             {/* Paso 2: Método de Entrega */}
//             {currentStep === 2 && (
//               <div className="space-y-6">
//                 <Card className="p-6">
//                   <h2 className="text-xl font-bold text-gray-900 mb-2">Método de Entrega</h2>
//                   <p className="text-sm text-gray-600 mb-6">
//                     Peso total: <span className="font-semibold">{totalWeight.toFixed(2)} kg</span>
//                   </p>

//                   <div className="grid md:grid-cols-2 gap-4 mb-6">
//                     {DELIVERY_METHODS.map((method) => {
//                       const isDisabled = method.id === 'home' && !canUseHomeDelivery;
//                       const isSelected = formData.deliveryMethod === method.id;

//                       return (
//                         <button
//                           key={method.id}
//                           onClick={() => handleDeliveryMethodSelect(method.id)}
//                           disabled={isDisabled}
//                           className={cn(
//                             'relative p-6 border-2 rounded-xl text-left transition-all',
//                             isSelected && !isDisabled
//                               ? 'border-[#a8c241] bg-green-50'
//                               : 'border-gray-200 hover:border-gray-300',
//                             isDisabled && 'opacity-50 cursor-not-allowed bg-gray-50'
//                           )}
//                         >
//                           {isSelected && !isDisabled && (
//                             <div className="absolute top-4 right-4">
//                               <CheckCircleIcon className="w-6 h-6 text-[#a8c241]" />
//                             </div>
//                           )}

//                           <div className="flex items-start space-x-4">
//                             <div className={cn(
//                               'p-3 rounded-lg',
//                               isSelected ? 'bg-[#a8c241] text-white' : 'bg-gray-100 text-gray-600'
//                             )}>
//                               {method.icon}
//                             </div>
//                             <div className="flex-1">
//                               <h3 className="font-semibold text-gray-900 mb-1">
//                                 {method.name}
//                               </h3>
//                               <p className="text-sm text-gray-600 mb-3">
//                                 {method.description}
//                               </p>
//                               <div className="flex items-center justify-between text-sm">
//                                 <span className="text-gray-500">{method.estimatedTime}</span>
//                                 <span className="font-semibold text-[#719428]">
//                                   {method.price === 0 ? 'Gratis' : `$${method.price.toFixed(2)}`}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {isDisabled && (
//                             <div className="mt-3 flex items-center text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
//                               <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
//                               <span>Requiere mínimo 5kg de material</span>
//                             </div>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>

//                   {/* Dirección (solo si es recolección a domicilio) */}
//                   {formData.deliveryMethod === 'home' && (
//                     <div className="border-t pt-6 space-y-4">
//                       <h3 className="font-semibold text-gray-900 mb-4">Dirección de Recolección</h3>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Dirección Completa *
//                         </label>
//                         <div className="relative">
//                           <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                           <input
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleInputChange}
//                             placeholder="Calle principal y secundaria, número de casa"
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Ciudad *
//                           </label>
//                           <input
//                             type="text"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleInputChange}
//                             placeholder="Guayaquil"
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Provincia *
//                           </label>
//                           <select
//                             name="province"
//                             value={formData.province}
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                           >
//                             <option value="">Selecciona...</option>
//                             <option value="Guayas">Guayas</option>
//                             <option value="Pichincha">Pichincha</option>
//                             <option value="Azuay">Azuay</option>
//                             <option value="Manabí">Manabí</option>
//                             <option value="El Oro">El Oro</option>
//                             {/* Agregar más provincias */}
//                           </select>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Referencia (opcional)
//                         </label>
//                         <input
//                           type="text"
//                           name="reference"
//                           value={formData.reference}
//                           onChange={handleInputChange}
//                           placeholder="Cerca del parque, casa color azul..."
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </Card>

//                 <div className="flex justify-between">
//                   <Button
//                     variant="outline"
//                     onClick={handlePrevStep}
//                   >
//                     Atrás
//                   </Button>
//                   <Button
//                     onClick={handleNextStep}
//                     className="bg-[#a8c241] hover:bg-[#719428] text-white px-8"
//                   >
//                     Continuar
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Paso 3: Confirmación */}
//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <Card className="p-6">
//                   <h2 className="text-xl font-bold text-gray-900 mb-6">Confirmar Orden</h2>

//                   {/* Resumen de datos personales */}
//                   <div className="mb-6 pb-6 border-b">
//                     <h3 className="font-semibold text-gray-900 mb-3">Datos Personales</h3>
//                     <div className="space-y-2 text-sm">
//                       <p className="text-gray-600">
//                         <span className="font-medium">Nombre:</span> {formData.fullName}
//                       </p>
//                       <p className="text-gray-600">
//                         <span className="font-medium">Teléfono:</span> {formData.phone}
//                       </p>
//                       <p className="text-gray-600">
//                         <span className="font-medium">Email:</span> {formData.email}
//                       </p>
//                       <p className="text-gray-600">
//                         <span className="font-medium">Cédula:</span> {formData.idNumber}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Resumen de entrega */}
//                   <div className="mb-6 pb-6 border-b">
//                     <h3 className="font-semibold text-gray-900 mb-3">Método de Entrega</h3>
//                     <div className="flex items-start space-x-3">
//                       <div className="p-2 bg-green-100 rounded-lg">
//                         {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.icon}
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium text-gray-900">
//                           {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.name}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.description}
//                         </p>
//                         {formData.deliveryMethod === 'home' && (
//                           <div className="mt-2 text-sm text-gray-600">
//                             <p>{formData.address}</p>
//                             <p>{formData.city}, {formData.province}</p>
//                             {formData.reference && <p>Ref: {formData.reference}</p>}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Notas adicionales */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Notas Adicionales (opcional)
//                     </label>
//                     <textarea
//                       name="notes"
//                       value={formData.notes}
//                       onChange={handleInputChange}
//                       rows={4}
//                       placeholder="Información adicional que quieras compartir..."
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent resize-none"
//                     />
//                   </div>
//                 </Card>

//                 <div className="flex justify-between">
//                   <Button
//                     variant="outline"
//                     onClick={handlePrevStep}
//                     disabled={loading}
//                   >
//                     Atrás
//                   </Button>
//                   <Button
//                     onClick={handleConfirmOrder}
//                     disabled={loading}
//                     className="bg-[#a8c241] hover:bg-[#719428] text-white px-8"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//                         Procesando...
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircleIcon className="w-5 h-5 mr-2" />
//                         Confirmar Orden
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Resumen del carrito - Sidebar fijo */}
//           <div className="lg:col-span-1">
//             <Card className="p-6 sticky top-24">
//               <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen de Venta</h2>

//               {/* Items */}
//               <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
//                 {cart.map((item, index) => (
//                   <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
//                     {item.images && item.images.length > 0 && (
//                       <img
//                         src={URL.createObjectURL(item.images[0])}
//                         alt={item.categoryName}
//                         className="w-16 h-16 object-cover rounded-lg"
//                       />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-gray-900 text-sm truncate">
//                         {item.categoryName}
//                       </h4>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {item.weight} kg × {item.quantity}
//                       </p>
//                       <p className="text-sm font-semibold text-[#719428] mt-1">
//                         ${item.estimatedValue.toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Totales */}
//               <div className="space-y-3 pt-4 border-t">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Costo de entrega</span>
//                   <span className="font-medium text-gray-900">
//                     {deliveryFee === 0 ? 'Gratis' : `$${deliveryFee.toFixed(2)}`}
//                   </span>
//                 </div>
//                 <div className="flex justify-between pt-3 border-t">
//                   <span className="font-semibold text-gray-900">Total Estimado</span>
//                   <span className="font-bold text-xl text-[#719428]">${total.toFixed(2)}</span>
//                 </div>
//               </div>

//               {/* Info adicional */}
//               <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-start space--x-2">
//                   <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                   <div className="text-xs text-blue-800">
//                     <p className="font-semibold mb-1">Valor Estimado</p>
//                     <p>
//                       El valor final será determinado después de la verificación en bodega.
//                       Esta es una estimación basada en los datos proporcionados.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="mt-6 grid grid-cols-2 gap-3">
//                 <div className="p-3 bg-gray-50 rounded-lg text-center">
//                   <p className="text-2xl font-bold text-gray-900">{cart.length}</p>
//                   <p className="text-xs text-gray-600">Artículos</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg text-center">
//                   <p className="text-2xl font-bold text-gray-900">{totalWeight.toFixed(1)}</p>
//                   <p className="text-xs text-gray-600">kg Total</p>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;







// src/pages/dashboard/CheckoutPage.tsx - CON FACTURACIÓN CORRECTA
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { CartItem } from '@/types/categories';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import orderService from '@/services/orderService';
import uploadService from '@/services/uploadService';

interface DeliveryMethod {
  id: 'pickup' | 'home';
  name: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  estimatedTime: string;
}

interface CheckoutFormData {
  // Datos personales (obligatorios)
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  
  // Datos de facturación (opcionales - para que Wiru emita factura al usuario)
  needsInvoice: boolean;
  ruc?: string;
  businessName?: string;
  fiscalAddress?: string;
  
  // Dirección (solo para recolección a domicilio)
  address: string;
  city: string;
  province: string;
  reference: string;
  
  // Método de entrega
  deliveryMethod: 'pickup' | 'home';
  
  // Notas adicionales
  notes: string;
}

const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'pickup',
    name: 'Punto Servientrega',
    description: 'Entrega en oficina de Servientrega más cercana',
    icon: <BuildingStorefrontIcon className="w-6 h-6" />,
    price: 0,
    estimatedTime: '1-2 días hábiles',
  },
  {
    id: 'home',
    name: 'Recolección a Domicilio',
    description: 'Recogemos en tu dirección (solo 5kg+)',
    icon: <TruckIcon className="w-6 h-6" />,
    price: 15,
    estimatedTime: '2-3 días hábiles',
  },
];

const PROVINCES = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
  'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
  'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
  'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const cart: CartItem[] = location.state?.cart || [];
  const { clearCart } = useCart();

  const cartFromState: CartItem[] = location.state?.cart || [];
  const [cart] = useState<CartItem[]>(cartFromState);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    needsInvoice: false,
    ruc: '',
    businessName: '',
    fiscalAddress: '',
    address: '',
    city: '',
    province: '',
    reference: '',
    deliveryMethod: 'pickup',
    notes: '',
  });

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + item.estimatedValue, 0);
  const deliveryFee = formData.deliveryMethod === 'home' ? 15 : 0;
  const total = subtotal + deliveryFee;
  const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

  // Validar si el carrito está vacío
  useEffect(() => {
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      navigate('/dashboard/sell');
    }
  }, [cart, navigate]);

  const canUseHomeDelivery = totalWeight >= 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDeliveryMethodSelect = (method: 'pickup' | 'home') => {
    if (method === 'home' && !canUseHomeDelivery) {
      toast.error('Recolección a domicilio requiere mínimo 5kg');
      return;
    }
    setFormData(prev => ({ ...prev, deliveryMethod: method }));
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      // Validar datos personales
      if (!formData.fullName.trim()) {
        toast.error('Ingresa tu nombre completo');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        toast.error('Ingresa un teléfono válido (10 dígitos)');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        toast.error('Ingresa un email válido');
        return false;
      }
      if (!formData.idNumber.trim() || formData.idNumber.length < 10) {
        toast.error('Ingresa una cédula válida (10 dígitos)');
        return false;
      }

      // Validar datos de facturación si está marcado
      if (formData.needsInvoice) {
        if (!formData.ruc?.trim() || formData.ruc.length !== 13) {
          toast.error('Ingresa un RUC válido (13 dígitos)');
          return false;
        }
        if (!formData.businessName?.trim()) {
          toast.error('Ingresa la razón social');
          return false;
        }
        if (!formData.fiscalAddress?.trim()) {
          toast.error('Ingresa la dirección fiscal');
          return false;
        }
      }
      
      return true;
    }

    if (currentStep === 2) {
      // Validar método de entrega y dirección
      if (formData.deliveryMethod === 'home') {
        if (!formData.address.trim()) {
          toast.error('Ingresa tu dirección');
          return false;
        }
        if (!formData.city.trim()) {
          toast.error('Ingresa tu ciudad');
          return false;
        }
        if (!formData.province.trim()) {
          toast.error('Selecciona tu provincia');
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(3, prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3);
  };

  const handleConfirmOrder = async () => {
  if (!validateCurrentStep()) return;

  setLoading(true);
  setUploadingImages(true);

  try {
    // 1. Subir todas las imágenes a Cloudinary
    toast.loading('Subiendo imágenes...', { id: 'upload-images' });
    
    const itemsWithUploadedImages = await Promise.all(
      cart.map(async (item) => {
        const uploadedImageUrls = await uploadService.uploadMultipleImages(
          item.images
        );
        
        const estimatedWeight = parseFloat(item.weight.toString()) * parseInt(item.quantity.toString());
        const pricePerKg = parseFloat(item.pricePerKg.toString());
        const estimatedValue = parseFloat(item.estimatedValue.toString());

        console.log('📦 Item for order:', {
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          estimatedWeight,
          pricePerKg,
          estimatedValue,
          imagesCount: uploadedImageUrls.length
        });

        if (isNaN(estimatedWeight) || estimatedWeight <= 0) {
          throw new Error(`Peso inválido para ${item.categoryName}`);
        }

        if (isNaN(pricePerKg) || pricePerKg <= 0) {
          throw new Error(`Precio inválido para ${item.categoryName}`);
        }

        if (isNaN(estimatedValue) || estimatedValue <= 0) {
          throw new Error(`Valor estimado inválido para ${item.categoryName}`);
        }
        
        return {
          categoryId: item.categoryId,
          estimatedWeight: estimatedWeight,
          pricePerKg: pricePerKg,
          estimatedValue: estimatedValue,
          images: uploadedImageUrls,
          notes: item.notes || '',
        };
      })
    );

    toast.success('Imágenes subidas exitosamente', { id: 'upload-images' });
    setUploadingImages(false);

    // 2. Preparar pickupAddress
    const pickupAddressData: any = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      idNumber: formData.idNumber,
    };

    if (formData.deliveryMethod === 'home') {
      pickupAddressData.address = formData.address;
      pickupAddressData.city = formData.city;
      pickupAddressData.province = formData.province;
      pickupAddressData.reference = formData.reference || '';
    }

    if (formData.needsInvoice) {
      pickupAddressData.needsInvoice = true;
      pickupAddressData.ruc = formData.ruc;
      pickupAddressData.businessName = formData.businessName;
      pickupAddressData.fiscalAddress = formData.fiscalAddress;
    }

    // 3. Preparar payload completo
        const deliveryMethodValue: 'PICKUP_POINT' | 'HOME_PICKUP' =
          formData.deliveryMethod === 'pickup' ? 'PICKUP_POINT' : 'HOME_PICKUP';
    
        const orderPayload = {
          items: itemsWithUploadedImages,
          deliveryMethod: deliveryMethodValue,
          pickupAddress: pickupAddressData,
        };

    console.log('📤 Sending order payload:', orderPayload);

    // 4. Crear orden en el backend
    toast.loading('Creando orden...', { id: 'create-order' });
    const order = await orderService.createOrder(orderPayload);
    
    console.log('✅ Order created successfully:', order);

    // ✅ VALIDAR QUE LA ORDEN TENGA LOS DATOS NECESARIOS
    if (!order || !order.orderNumber || !order.id) {
      throw new Error('La orden se creó pero la respuesta es inválida');
    }

    toast.success('¡Orden creada exitosamente!', { id: 'create-order' });

    // 5. Limpiar carrito
    clearCart();

    // 6. Redirigir a confirmación
    navigate('/dashboard/order/confirmation', {
      state: {
        orderNumber: order.orderNumber,
        orderId: order.id,
        orderData: {
          customer: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
          },
          delivery: {
            method: formData.deliveryMethod,
          },
          items: cart,
          totals: {
            subtotal,
            deliveryFee,
            total: typeof order.estimatedTotal === 'number'
              ? order.estimatedTotal
              : parseFloat(String(order.estimatedTotal ?? '0')),
          },
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    
    toast.error(
      error.message || 'Error al crear la orden. Intenta nuevamente.'
    );
    setUploadingImages(false);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-gray-700">
              <HomeIcon className="w-4 h-4" />
            </button>
            <ChevronRightIcon className="w-4 h-4" />
            <button onClick={() => navigate('/dashboard/sell')} className="hover:text-gray-700">
              Vender
            </button>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>

          {/* Título */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Venta</h1>
              <p className="text-gray-600">Completa los datos para generar tu orden</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="text-sm">{cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, name: 'Datos Personales', icon: UserIcon },
              { step: 2, name: 'Método de Entrega', icon: TruckIcon },
              { step: 3, name: 'Confirmación', icon: CheckCircleIcon },
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all',
                      currentStep >= item.step
                        ? 'bg-[#a8c241] text-white'
                        : 'bg-gray-200 text-gray-400'
                    )}
                  >
                    {currentStep > item.step ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <item.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium text-center',
                      currentStep >= item.step ? 'text-gray-900' : 'text-gray-400'
                    )}
                  >
                    {item.name}
                  </span>
                </div>
                {index < 2 && (
                  <div className="flex-1 h-0.5 mx-4 mt-6">
                    <div
                      className={cn(
                        'h-full transition-all',
                        currentStep > item.step ? 'bg-[#a8c241]' : 'bg-gray-200'
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paso 1: Datos Personales */}
            {currentStep === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Datos Personales</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Juan Pérez"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0999999999"
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cédula *
                      </label>
                      <div className="relative">
                        <DocumentTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          placeholder="0123456789"
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="juan@ejemplo.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sección de Facturación */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-start space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="needsInvoice"
                      name="needsInvoice"
                      checked={formData.needsInvoice}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-[#a8c241] border-gray-300 rounded focus:ring-[#a8c241]"
                    />
                    <div>
                      <label htmlFor="needsInvoice" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Necesito que Wiru me emita factura (tengo RUC)
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Si tienes RUC, Wiru te emitirá una factura electrónica por tu venta
                      </p>
                    </div>
                  </div>

                  {formData.needsInvoice && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-2 mb-4">
                        <BuildingOfficeIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Datos para Facturación</p>
                          <p>Wiru emitirá una factura electrónica a tu nombre con estos datos</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          RUC *
                        </label>
                        <input
                          type="text"
                          name="ruc"
                          value={formData.ruc}
                          onChange={handleInputChange}
                          placeholder="1234567890001"
                          maxLength={13}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">13 dígitos</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Razón Social *
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Mi Empresa S.A. o Juan Pérez"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección Fiscal *
                        </label>
                        <input
                          type="text"
                          name="fiscalAddress"
                          value={formData.fiscalAddress}
                          onChange={handleInputChange}
                          placeholder="Dirección registrada en el RUC"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleNextStep}
                    className="bg-[#a8c241] hover:bg-[#719428] text-white px-8"
                  >
                    Continuar
                  </Button>
                </div>
              </Card>
            )}

            {/* Paso 2: Método de Entrega */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Método de Entrega</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Peso total: <span className="font-semibold">{totalWeight.toFixed(2)} kg</span>
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {DELIVERY_METHODS.map((method) => {
                      const isDisabled = method.id === 'home' && !canUseHomeDelivery;
                      const isSelected = formData.deliveryMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          onClick={() => handleDeliveryMethodSelect(method.id)}
                          disabled={isDisabled}
                          className={cn(
                            'relative p-6 border-2 rounded-xl text-left transition-all',
                            isSelected && !isDisabled
                              ? 'border-[#a8c241] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300',
                            isDisabled && 'opacity-50 cursor-not-allowed bg-gray-50'
                          )}
                        >
                          {isSelected && !isDisabled && (
                            <div className="absolute top-4 right-4">
                              <CheckCircleIcon className="w-6 h-6 text-[#a8c241]" />
                            </div>
                          )}

                          <div className="flex items-start space-x-4">
                            <div className={cn(
                              'p-3 rounded-lg',
                              isSelected ? 'bg-[#a8c241] text-white' : 'bg-gray-100 text-gray-600'
                            )}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {method.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3">
                                {method.description}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{method.estimatedTime}</span>
                                <span className="font-semibold text-[#719428]">
                                  {method.price === 0 ? 'Gratis' : `$${method.price.toFixed(2)}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isDisabled && (
                            <div className="mt-3 flex items-center text-xs text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
                              <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>Requiere mínimo 5kg de material</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dirección (solo si es recolección a domicilio) */}
                  {formData.deliveryMethod === 'home' && (
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Dirección de Recolección</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección Completa *
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Calle principal y secundaria, número de casa"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Guayaquil"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Provincia *
                          </label>
                          <select
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                          >
                            <option value="">Selecciona...</option>
                            {PROVINCES.map(province => (
                              <option key={province} value={province}>{province}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referencia (opcional)
                        </label>
                        <input
                          type="text"
                          name="reference"
                          value={formData.reference}
                          onChange={handleInputChange}
                          placeholder="Cerca del parque, casa color azul..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="bg-[#a8c241] hover:bg-[#719428] text-white px-8"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Confirmar Orden</h2>

                  {/* Resumen de datos personales */}
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-gray-900 mb-3">Datos Personales</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Nombre:</span> {formData.fullName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Teléfono:</span> {formData.phone}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {formData.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Cédula:</span> {formData.idNumber}
                      </p>
                    </div>
                  </div>

                  {/* Resumen de facturación */}
                  {formData.needsInvoice && (
                    <div className="mb-6 pb-6 border-b">
                      <h3 className="font-semibold text-gray-900 mb-3">Datos de Facturación</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 mb-3">
                          Wiru emitirá una factura electrónica a:
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            <span className="font-medium">RUC:</span> {formData.ruc}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Razón Social:</span> {formData.businessName}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Dirección Fiscal:</span> {formData.fiscalAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resumen de entrega */}
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-gray-900 mb-3">Método de Entrega</h3>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {DELIVERY_METHODS.find(m => m.id === formData.deliveryMethod)?.description}
                        </p>
                        {formData.deliveryMethod === 'home' && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>{formData.address}</p>
                            <p>{formData.city}, {formData.province}</p>
                            {formData.reference && <p>Ref: {formData.reference}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notas adicionales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Adicionales (opcional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Información adicional que quieras compartir..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent resize-none"
                    />
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={loading}
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    className="bg-[#a8c241] hover:bg-[#719428] text-white px-8"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Confirmar Orden
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del carrito - Sidebar fijo */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen de Venta</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                    {item.images && item.images.length > 0 && (
                      <img
                        src={URL.createObjectURL(item.images[0])}
                        alt={item.categoryName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {item.categoryName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.weight} kg × {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#719428] mt-1">
                        ${item.estimatedValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo de entrega</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? 'Gratis' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold text-gray-900">Total Estimado</span>
                  <span className="font-bold text-xl text-[#719428]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Info adicional */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Valor Estimado</p>
                    <p>
                      El valor final será determinado después de la verificación en bodega.
                      Esta es una estimación basada en los datos proporcionados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{cart.length}</p>
                  <p className="text-xs text-gray-600">Artículos</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalWeight.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">kg Total</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;