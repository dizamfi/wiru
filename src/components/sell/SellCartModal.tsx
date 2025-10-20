// // src/components/sell/SellCartModal.tsx
// import React from 'react';
// import { XMarkIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
// import { CartItem } from '@/types/categories';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { Badge } from '@/components/ui/Badge';

// interface SellCartModalProps {
//   cart: CartItem[];
//   onClose: () => void;
//   onRemoveItem: (index: number) => void;
//   onCheckout: () => void;
// }

// const SellCartModal: React.FC<SellCartModalProps> = ({
//   cart,
//   onClose,
//   onRemoveItem,
//   onCheckout
// }) => {
//   const totalEstimated = cart.reduce((sum, item) => sum + item.estimatedValue, 0);
//   const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       {/* Overlay */}
//       <div 
//         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div 
//           className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <ShoppingBagIcon className="w-6 h-6 text-[#D0FF5B]" />
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Mi Venta</h2>
//                 <p className="text-sm text-gray-500">{cart.length} item(s) en el carrito</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <XMarkIcon className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {cart.length === 0 ? (
//               <div className="text-center py-12">
//                 <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
//                 <p className="text-sm text-gray-400">Agrega categorías para comenzar tu venta</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {cart.map((item, index) => (
//                   <Card key={item.id} className="p-4">
//                     <div className="flex items-start space-x-4">
//                       {/* Imagen preview */}
//                       <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
//                         {item.images.length > 0 ? (
//                           <img 
//                             src={URL.createObjectURL(item.images[0])} 
//                             alt={item.categoryName}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-gray-400">
//                             📦
//                           </div>
//                         )}
//                       </div>

//                       {/* Info */}
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1">
//                           {item.categoryName}
//                         </h3>
//                         <p className="text-xs text-gray-500 mb-2">{item.categoryPath}</p>
                        
//                         <div className="flex items-center space-x-4 text-sm">
//                           <span className="text-gray-600">
//                             {item.weight} kg × {item.quantity}
//                           </span>
//                           <span className="text-gray-400">•</span>
//                           <span className="text-gray-600">
//                             ${item.pricePerKg}/kg
//                           </span>
//                           <span className="text-gray-400">•</span>
//                           <span className="font-semibold text-green-600">
//                             ${item.estimatedValue.toFixed(2)}
//                           </span>
//                         </div>

//                         {item.notes && (
//                           <p className="text-xs text-gray-500 mt-2 line-clamp-1">
//                             📝 {item.notes}
//                           </p>
//                         )}
//                       </div>

//                       {/* Acciones */}
//                       <button
//                         onClick={() => onRemoveItem(index)}
//                         className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <TrashIcon className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           {cart.length > 0 && (
//             <div className="border-t bg-gray-50 px-6 py-4 space-y-4">
//               {/* Resumen */}
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Peso total:</span>
//                   <span className="font-medium">{totalWeight.toFixed(2)} kg</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Items:</span>
//                   <span className="font-medium">{cart.length}</span>
//                 </div>
//                 <div className="flex justify-between items-center pt-2 border-t">
//                   <div>
//                     <span className="text-gray-600">Valor estimado:</span>
//                     <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
//                       Pendiente verificación
//                     </Badge>
//                   </div>
//                   <span className="text-2xl font-bold text-green-600">
//                     ${totalEstimated.toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               {/* Botones */}
//               <div className="flex space-x-3">
//                 <Button
//                   variant="outline"
//                   onClick={onClose}
//                   className="flex-1"
//                 >
//                   Continuar Comprando
//                 </Button>
//                 <Button
//                   onClick={onCheckout}
//                   className="flex-1 bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90"
//                 >
//                   Proceder al Checkout
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellCartModal;




// src/components/sell/SellCartModal.tsx
import React from 'react';
import { XMarkIcon, TrashIcon, ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { CartItem } from '@/types/categories';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface SellCartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const SellCartModal: React.FC<SellCartModalProps> = ({
  cart,
  onClose,
  onRemoveItem,
  onCheckout
}) => {
  const totalEstimated = cart.reduce((sum, item) => sum + item.estimatedValue, 0);
  const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer/Sidebar desde la derecha */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div 
          className={cn(
            "relative w-screen max-w-md transform transition-transform duration-300 ease-in-out",
            "translate-x-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header fijo */}
            <div className="bg-gradient-to-r from-[#a8c241] to-[#719428] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-white">
                  <ShoppingBagIcon className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">Mi Venta</h2>
                    <p className="text-sm opacity-90">
                      {cart.length} {cart.length === 1 ? 'item' : 'items'} agregado{cart.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Resumen rápido en el header */}
              {cart.length > 0 && (
                <div className="mt-4 bg-white/20 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs opacity-80">Valor estimado total</p>
                      <p className="text-2xl font-bold">${totalEstimated.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80">Peso total</p>
                      <p className="text-lg font-semibold">{totalWeight.toFixed(2)} kg</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                /* Estado vacío */
                <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Agrega categorías para comenzar tu venta
                  </p>
                  <Button 
                    onClick={onClose}
                    className="bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90"
                  >
                    Explorar Categorías
                  </Button>
                </div>
              ) : (
                /* Lista de items */
                <div className="p-6 space-y-4">
                  {cart.map((item, index) => (
                    <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        {/* Imagen preview */}
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.images.length > 0 ? (
                            <img 
                              src={URL.createObjectURL(item.images[0])} 
                              alt={item.categoryName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              📦
                            </div>
                          )}
                          {/* Badge de cantidad de fotos */}
                          {item.images.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                              +{item.images.length - 1}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">
                            {item.categoryName}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2 truncate">
                            {item.categoryPath}
                          </p>
                          
                          {/* Detalles en grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-gray-500">Peso:</span>
                              <span className="ml-1 font-medium">{item.weight} kg</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Cantidad:</span>
                              <span className="ml-1 font-medium">×{item.quantity}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Precio/kg:</span>
                              <span className="ml-1 font-medium">${item.pricePerKg.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <span className="ml-1 font-semibold text-green-600">
                                ${(item.weight * item.quantity * item.pricePerKg).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Notas si existen */}
                          {item.notes && (
                            <div className="bg-gray-50 rounded p-2 text-xs text-gray-600 line-clamp-2">
                              📝 {item.notes}
                            </div>
                          )}
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Eliminar del carrito"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Estimado badge */}
                      <div className="mt-3 flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-gray-500">Valor estimado del item</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Estimado
                          </Badge>
                          <span className="font-bold text-green-600">
                            ${item.estimatedValue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Información adicional */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>💡 Recuerda:</strong> Los valores mostrados son estimados. 
                      El monto final se determinará después de la verificación física en nuestra bodega.
                    </p>
                  </Card>
                </div>
              )}
            </div>

            {/* Footer fijo con acciones */}
            {cart.length > 0 && (
              <div className="border-t bg-white px-6 py-4 space-y-4">
                {/* Resumen detallado */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cart.length} items):</span>
                    <span className="font-medium text-gray-900">
                      ${totalEstimated.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Peso total:</span>
                    <span className="font-medium text-gray-900">
                      {totalWeight.toFixed(2)} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fotos adjuntas:</span>
                    <span className="font-medium text-gray-900">
                      {cart.reduce((sum, item) => sum + item.images.length, 0)} imágenes
                    </span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <span className="text-sm text-gray-600">Total estimado:</span>
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                        Pendiente verificación
                      </Badge>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      ${totalEstimated.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-2">
                  <Button
                    onClick={onCheckout}
                    className="w-full bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90 font-semibold py-3 flex items-center justify-center space-x-2"
                  >
                    <span>Proceder al Checkout</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCartModal;