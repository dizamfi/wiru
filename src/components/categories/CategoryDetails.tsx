// // src/components/categories/CategoryDetails.tsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   PhotoIcon,
//   InformationCircleIcon,
//   ScaleIcon,
//   CurrencyDollarIcon,
//   CheckCircleIcon,
//   XMarkIcon,
//   ChevronLeftIcon
// } from '@heroicons/react/24/outline';
// import { Card, CardContent, CardHeader } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
// import { Modal } from '@/components/ui/Modal';
// import { useCategories } from '@/hooks/useCategories';
// import { 
//   Category,
//   CategoryType,
//   CONDITION_OPTIONS,
//   ACCESSORY_OPTIONS,
//   MATERIAL_GRADE_INFO,
//   DeviceCondition
// } from '@/types/categories';

// interface CategoryDetailsProps {
//   categoryId: string;
//   onBack: () => void;
//   onAddToCart: (category: Category) => void;
//   className?: string;
// }

// export const CategoryDetails: React.FC<CategoryDetailsProps> = ({
//   categoryId,
//   onBack,
//   onAddToCart,
//   className = ''
// }) => {
//   const { 
//     selectedCategory,
//     loadingDetails,
//     error,
//     loadCategoryDetails 
//   } = useCategories();

//   const [showReferenceImages, setShowReferenceImages] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   // Load category details
//   useEffect(() => {
//     if (categoryId) {
//       loadCategoryDetails(categoryId);
//     }
//   }, [categoryId, loadCategoryDetails]);

//   if (loadingDetails) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <LoadingSpinner size="lg" text="Cargando detalles..." />
//       </div>
//     );
//   }

//   if (error || !selectedCategory) {
//     return (
//       <div className="text-center py-12">
//         <InformationCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">
//           Error al cargar los detalles
//         </h3>
//         <p className="text-gray-600 mb-4">
//           {error || 'No se encontró la categoría'}
//         </p>
//         <Button onClick={onBack}>
//           ← Volver
//         </Button>
//       </div>
//     );
//   }

//   const category = selectedCategory;
//   const materialGradeInfo = category.materialGrade 
//     ? MATERIAL_GRADE_INFO[category.materialGrade] 
//     : null;

//   return (
//     <div className={`space-y-6 ${className}`}>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <Button 
//           variant="outline"
//           onClick={onBack}
//           className="flex items-center"
//         >
//           <ChevronLeftIcon className="h-4 w-4 mr-2" />
//           Volver a categorías
//         </Button>
        
//         <Badge variant="outline" className="text-sm">
//           {category.type === CategoryType.COMPLETE_DEVICES 
//             ? 'Dispositivo Completo' 
//             : 'Dispositivo Desarmable'
//           }
//         </Badge>
//       </div>

//       {/* Main Info Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <Card>
//           <CardHeader>
//             <div className="flex items-start justify-between">
//               <div className="flex items-center space-x-3">
//                 <span className="text-3xl">{category.icon}</span>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     {category.name}
//                   </h1>
//                   <p className="text-gray-600 mt-1">
//                     {category.description}
//                   </p>
//                 </div>
//               </div>
              
//               {materialGradeInfo && (
//                 <Badge className={materialGradeInfo.color}>
//                   {materialGradeInfo.icon} {materialGradeInfo.name}
//                 </Badge>
//               )}
//             </div>
//           </CardHeader>
          
//           <CardContent>
//             {/* Price Information */}
//             <div className="grid md:grid-cols-3 gap-6 mb-6">
//               <div className="text-center p-4 bg-gray-50 rounded-lg">
//                 <CurrencyDollarIcon className="h-8 w-8 text-[#a8c241] mx-auto mb-2" />
//                 <div className="text-sm text-gray-500 mb-1">
//                   {category.type === CategoryType.COMPLETE_DEVICES 
//                     ? 'Rango de precio'
//                     : 'Precio por kg'
//                   }
//                 </div>
//                 <div className="text-lg font-semibold text-gray-900">
//                   {category.type === CategoryType.COMPLETE_DEVICES 
//                     ? `${category.minPrice} - ${category.maxPrice}`
//                     : `${category.pricePerKg}/kg`
//                   }
//                 </div>
//               </div>

//               {category.estimatedWeight && (
//                 <div className="text-center p-4 bg-gray-50 rounded-lg">
//                   <ScaleIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
//                   <div className="text-sm text-gray-500 mb-1">Peso aproximado</div>
//                   <div className="text-lg font-semibold text-gray-900">
//                     {category.estimatedWeight} kg
//                   </div>
//                 </div>
//               )}

//               <div className="text-center p-4 bg-gray-50 rounded-lg">
//                 <PhotoIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
//                 <div className="text-sm text-gray-500 mb-1">Fotos requeridas</div>
//                 <div className="text-lg font-semibold text-gray-900">
//                   Mín. {category.minPhotos}
//                 </div>
//               </div>
//             </div>

//             {/* Examples */}
//             {category.examples.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                   Ejemplos de dispositivos
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {category.examples.map((example, index) => (
//                     <Badge key={index} variant="secondary">
//                       {example}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Reference Images */}
//             {category.referenceImages.length > 0 && (
//               <div className="mb-6">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Fotos de referencia
//                   </h3>
//                   <Button 
//                     variant="outline" 
//                     size="sm"
//                     onClick={() => setShowReferenceImages(true)}
//                   >
//                     Ver todas ({category.referenceImages.length})
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2">
//                   {category.referenceImages.slice(0, 3).map((image, index) => (
//                     <div 
//                       key={index}
//                       className="aspect-square bg-gray-200 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                       onClick={() => {
//                         setSelectedImageIndex(index);
//                         setShowReferenceImages(true);
//                       }}
//                     >
//                       <img 
//                         src={image} 
//                         alt={`Referencia ${index + 1}`}
//                         className="w-full h-full object-cover rounded-lg"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src = '/images/placeholder-device.jpg';
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Condition Multipliers */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                 Valores según condición
//               </h3>
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {CONDITION_OPTIONS.map((condition) => {
//                   const multiplier = (category.conditionMultipliers as any)?.[condition.value] || condition.multiplier;
//                   const estimatedPrice = category.type === CategoryType.COMPLETE_DEVICES
//                     ? Math.round(category.basePrice * multiplier)
//                     : Math.round(category.pricePerKg * multiplier);
                  
//                   return (
//                     <div 
//                       key={condition.value}
//                       className="p-3 border border-gray-200 rounded-lg"
//                     >
//                       <div className="flex items-center justify-between mb-1">
//                         <span className={`font-medium ${condition.color}`}>
//                           {condition.label}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           {Math.round(multiplier * 100)}%
//                         </span>
//                       </div>
//                       <div className="text-xs text-gray-500 mb-2">
//                         {condition.description}
//                       </div>
//                       <div className="font-semibold text-gray-900">
//                         ≈ ${estimatedPrice}
//                         {category.type === CategoryType.DISMANTLED_DEVICES && '/kg'}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Accessories (only for complete devices) */}
//             {category.type === CategoryType.COMPLETE_DEVICES && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                   Bonificaciones por accesorios
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-3">
//                   {ACCESSORY_OPTIONS.map((accessory) => (
//                     <div 
//                       key={accessory.value}
//                       className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
//                     >
//                       <div>
//                         <span className="font-medium text-gray-900">
//                           {accessory.label}
//                         </span>
//                         <div className="text-xs text-gray-500">
//                           {accessory.description}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-semibold text-green-600">
//                           +{Math.round(accessory.bonus * 100)}%
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Required Fields */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                 Información requerida
//               </h3>
//               <div className="grid md:grid-cols-2 gap-2">
//                 {category.requiredFields.map((field) => (
//                   <div key={field} className="flex items-center space-x-2">
//                     <CheckCircleIcon className="h-4 w-4 text-green-500" />
//                     <span className="text-sm text-gray-700 capitalize">
//                       {field.replace(/([A-Z])/g, ' $1').trim()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Material Grade Description (for dismantled devices) */}
//             {materialGradeInfo && (
//               <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-start space-x-3">
//                   <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-blue-900 mb-1">
//                       Sobre esta categoría
//                     </h4>
//                     <p className="text-sm text-blue-800">
//                       {materialGradeInfo.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Button */}
//             <div className="text-center pt-4 border-t border-gray-200">
//               <Button 
//                 onClick={() => onAddToCart(category)}
//                 className="bg-[#a8c241] hover:bg-[#8ea635] text-white px-8 py-3"
//                 size="lg"
//               >
//                 Seleccionar esta categoría
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Reference Images Modal */}
//       <Modal
//         isOpen={showReferenceImages}
//         onClose={() => setShowReferenceImages(false)}
//         title="Fotos de referencia"
//         size="lg"
//       >
//         <div className="space-y-4">
//           {/* Main Image */}
//           <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
//             <img 
//               src={category.referenceImages[selectedImageIndex]} 
//               alt={`Referencia ${selectedImageIndex + 1}`}
//               className="w-full h-full object-contain"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src = '/images/placeholder-device.jpg';
//               }}
//             />
//           </div>

//           {/* Thumbnails */}
//           {category.referenceImages.length > 1 && (
//             <div className="grid grid-cols-4 gap-2">
//               {category.referenceImages.map((image, index) => (
//                 <div 
//                   key={index}
//                   className={`aspect-square bg-gray-100 rounded-lg cursor-pointer border-2 transition-colors ${
//                     index === selectedImageIndex 
//                       ? 'border-[#a8c241]' 
//                       : 'border-transparent hover:border-gray-300'
//                   }`}
//                   onClick={() => setSelectedImageIndex(index)}
//                 >
//                   <img 
//                     src={image} 
//                     alt={`Miniatura ${index + 1}`}
//                     className="w-full h-full object-cover rounded-lg"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = '/images/placeholder-device.jpg';
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Close Button */}
//           <div className="flex justify-end">
//             <Button 
//               variant="outline" 
//               onClick={() => setShowReferenceImages(false)}
//             >
//               Cerrar
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };




// src/components/categories/CategoryDetails.tsx - SIMPLE VERSION
import React from 'react';
import { motion } from 'framer-motion';
import { 
  PhotoIcon,
  InformationCircleIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Category,
  CategoryType,
  CONDITION_OPTIONS,
  MATERIAL_GRADE_INFO,
  DeviceCondition,
  getCategoryTypeLabel
} from '@/types/categories';

interface CategoryDetailsProps {
  category: Category;
  onConfirm: (category: Category) => void;
  onBack: () => void;
  loading?: boolean;
  className?: string;
}

export const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  category,
  onConfirm,
  onBack,
  loading = false,
  className = ''
}) => {
  const materialGradeInfo = category.materialGrade 
    ? MATERIAL_GRADE_INFO[category.materialGrade] 
    : null;

  const handleConfirm = () => {
    onConfirm(category);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline"
          onClick={onBack}
          className="flex items-center"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Volver a categorías
        </Button>
        
        <Badge variant="outline" className="text-sm">
          {getCategoryTypeLabel(category.type)}
        </Badge>
      </div>

      {/* Category Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {category.icon ? (
                <span className="text-2xl">{category.icon}</span>
              ) : (
                <ScaleIcon className="h-8 w-8 text-gray-600" />
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mb-3">
                  {category.description}
                </p>
              )}
              
              {/* Material Grade */}
              {materialGradeInfo && (
                <Badge className={`${materialGradeInfo.color} mb-2`}>
                  {materialGradeInfo.icon} {materialGradeInfo.label}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Información de Precios
              </h3>
              
              <div className="space-y-2">
                {category.pricePerKg && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio por kg:</span>
                    <span className="font-medium">${category.pricePerKg}</span>
                  </div>
                )}
                
                {category.pricePerUnit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio por unidad:</span>
                    <span className="font-medium">${category.pricePerUnit}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Rango de precios:</span>
                  <span className="font-medium">
                    ${category.minPrice} - ${category.maxPrice}
                  </span>
                </div>
                
                {category.estimatedWeight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peso estimado:</span>
                    <span className="font-medium">{category.estimatedWeight} kg</span>
                  </div>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Condiciones Aceptadas
              </h3>
              
              <div className="space-y-2">
                {category.acceptedConditions?.map((condition: string | number | bigint | null | undefined) => {
                  const conditionInfo = CONDITION_OPTIONS.find(opt => opt.value === condition);
                  return (
                    <div key={condition} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {conditionInfo?.label || condition}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((conditionInfo?.multiplier || 0) * 100)}%
                      </Badge>
                    </div>
                  );
                }) || (
                  <p className="text-sm text-gray-500">
                    Todas las condiciones aceptadas
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {Array.isArray(category.hierarchyPath) && category.hierarchyPath.length > 1 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Clasificación</h3>
              <div className="flex flex-wrap gap-2">
                {category.hierarchyPath.map((path, index) => (
                  <React.Fragment key={index}>
                    <Badge variant="secondary" className="text-xs">
                      {path}
                    </Badge>
                    {/* {index < category.hierarchyPath.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )} */}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Required Fields */}
          {category.requiredFields && category.requiredFields.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Información Requerida
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.requiredFields.map((field) => (
                  <div key={field} className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference Images Placeholder */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Imágenes de Referencia
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Estas son imágenes de referencia del tipo de dispositivo aceptado
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Cambiar Categoría
        </Button>
        
        <Button 
          onClick={handleConfirm}
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {loading ? 'Cargando...' : 'Continuar con esta Categoría →'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryDetails;