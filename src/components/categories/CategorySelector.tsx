// // src/components/categories/CategorySelector.tsx
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MagnifyingGlassIcon,
//   ChevronRightIcon,
//   PhotoIcon,
//   InformationCircleIcon,
//   CheckCircleIcon,
//   ExclamationTriangleIcon,
// } from "@heroicons/react/24/outline";
// import { Card, CardContent } from "@/components/ui/Card";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { Badge } from "@/components/ui/Badge";
// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import { useCategories } from "@/hooks/useCategories";
// import {
//   CategoryType,
//   Category,
//   getCategoryTypeLabel,
//   MATERIAL_GRADE_INFO,
//   CategoryMainType,
// } from "@/types/categories";

// interface CategorySelectorProps {
//   onCategorySelect: (category: Category) => void;
//   selectedCategoryId?: string;
//   className?: string;
//   types: CategoryMainType[];
//   categories: Category[];
//   selectedType?: CategoryType;
//   onTypeSelect: (type: CategoryType) => void;
//   loading?: boolean;
// }

// export const CategorySelector: React.FC<CategorySelectorProps> = ({
//   onCategorySelect,
//   selectedCategoryId,
//   className = "",
  
// }) => {
//   const {
//     types,
//     selectedType,
//     currentCategories,
//     searchResults,
//     searchTerm,
//     loading,
//     loadingCategories,
//     searchLoading,
//     error,
//     selectType,
//     searchCategories,
//     clearSearch,
//   } = useCategories();

//   const [searchInput, setSearchInput] = useState("");

//   // Handle search
//   const handleSearch = async (term: string) => {
//     setSearchInput(term);
//     if (term.length >= 2) {
//       await searchCategories(term, selectedType);
//     } else {
//       clearSearch();
//     }
//   };

//   // Handle category selection
//   const handleCategorySelect = (category: Category) => {
//     onCategorySelect(category);
//   };

//   // Get categories to display
//   const categoriesToShow = searchTerm ? searchResults : currentCategories;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <LoadingSpinner size="lg" text="Cargando categorías..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">
//           Error al cargar categorías
//         </h3>
//         <p className="text-gray-600 mb-4">{error}</p>
//         <Button onClick={() => window.location.reload()}>Reintentar</Button>
//       </div>
//     );
//   }

//   return (
//     <div className={`space-y-6 ${className}`}>
//       {/* Header */}
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           ¿Qué tipo de dispositivo quieres vender?
//         </h2>
//         <p className="text-gray-600">
//           Selecciona la categoría que mejor describa tu dispositivo electrónico
//         </p>
//       </div>

//       {/* Type Selection */}
//       {!selectedType && (
//         <div className="grid md:grid-cols-2 gap-6">
//           {types.map((type) => (
//             <motion.div
//               key={type.id}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <Card
//                 className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-[#a8c241]"
//                 onClick={() => selectType(type.type)}
//               >
//                 <CardContent className="p-6 text-center">
//                   <div className="text-4xl mb-4">{type.icon}</div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {type.name}
//                   </h3>
//                   <p className="text-gray-600 mb-4">{type.description}</p>
//                   <div className="flex items-center justify-center text-[#a8c241]">
//                     <span className="text-sm font-medium">Seleccionar</span>
//                     <ChevronRightIcon className="h-4 w-4 ml-1" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Category Selection */}
//       {selectedType && (
//         <div className="space-y-6">
//           {/* Header with back button */}
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900">
//                 {getCategoryTypeLabel(selectedType)}
//               </h3>
//               <p className="text-gray-600">
//                 Selecciona la categoría específica de tu dispositivo
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               onClick={() => selectType(undefined as any)}
//             >
//               ← Cambiar tipo
//             </Button>
//           </div>

//           {/* Search */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <Input
//               type="text"
//               placeholder="Buscar por marca, modelo o tipo..."
//               value={searchInput}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="pl-10"
//             />
//             {searchLoading && (
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                 <LoadingSpinner size="sm" />
//               </div>
//             )}
//           </div>

//           {/* Categories Grid */}
//           {loadingCategories ? (
//             <div className="flex items-center justify-center py-8">
//               <LoadingSpinner text="Cargando categorías..." />
//             </div>
//           ) : (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={selectedType}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
//               >
//                 {categoriesToShow.map((category) => (
//                   <CategoryCard
//                     key={category.id}
//                     category={category}
//                     isSelected={selectedCategoryId === category.id}
//                     onSelect={handleCategorySelect}
//                   />
//                 ))}
//               </motion.div>
//             </AnimatePresence>
//           )}

//           {/* No results */}
//           {categoriesToShow.length === 0 && !loadingCategories && (
//             <div className="text-center py-8">
//               <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 {searchTerm
//                   ? "No se encontraron resultados"
//                   : "No hay categorías disponibles"}
//               </h3>
//               <p className="text-gray-600">
//                 {searchTerm
//                   ? "Intenta con otros términos de búsqueda"
//                   : "Las categorías se están cargando..."}
//               </p>
//               {searchTerm && (
//                 <Button
//                   variant="outline"
//                   onClick={() => handleSearch("")}
//                   className="mt-4"
//                 >
//                   Limpiar búsqueda
//                 </Button>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Componente para cada tarjeta de categoría
// interface CategoryCardProps {
//   category: Category;
//   isSelected: boolean;
//   onSelect: (category: Category) => void;
// }

// const CategoryCard: React.FC<CategoryCardProps> = ({
//   category,
//   isSelected,
//   onSelect,
// }) => {
//   const materialGradeInfo = category.materialGrade
//     ? MATERIAL_GRADE_INFO[category.materialGrade]
//     : null;

//   return (
//     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//       <Card
//         className={`cursor-pointer transition-all duration-200 border-2 ${
//           isSelected
//             ? "border-[#a8c241] bg-green-50 shadow-lg"
//             : "border-gray-200 hover:border-[#a8c241] hover:shadow-md"
//         }`}
//         onClick={() => onSelect(category)}
//       >
//         <CardContent className="p-4">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-3">
//             <div className="flex items-center space-x-2">
//               <span className="text-2xl">{category.icon}</span>
//               {isSelected && (
//                 <CheckCircleIcon className="h-5 w-5 text-[#a8c241]" />
//               )}
//             </div>
//             {materialGradeInfo && (
//               <Badge className={materialGradeInfo.color}>
//                 {materialGradeInfo.icon}
//               </Badge>
//             )}
//           </div>

//           {/* Title */}
//           <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>

//           {/* Description */}
//           <p className="text-sm text-gray-600 mb-3">{category.description}</p>

//           {/* Price Info */}
//           <div className="space-y-2 mb-3">
//             {category.type === CategoryType.COMPLETE_DEVICES ? (
//               <div className="text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Precio estimado:</span>
//                   <span className="font-medium text-gray-900">
//                     ${category.minPrice} - ${category.maxPrice}
//                   </span>
//                 </div>
//                 {category.estimatedWeight && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Peso aprox:</span>
//                     <span className="text-gray-700">
//                       {category.estimatedWeight} kg
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Precio por kg:</span>
//                   <span className="font-medium text-gray-900">
//                     ${category.pricePerKg}/kg
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Rango:</span>
//                   <span className="text-gray-700">
//                     ${category.minPrice} - ${category.maxPrice}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Examples */}
//           {category.examples.length > 0 && (
//             <div className="text-xs text-gray-500">
//               <span className="font-medium">Ejemplos: </span>
//               {category.examples.slice(0, 3).join(", ")}
//               {category.examples.length > 3 && "..."}
//             </div>
//           )}

//           {/* Reference Images Indicator */}
//           {category.referenceImages.length > 0 && (
//             <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
//               <div className="flex items-center text-xs text-gray-500">
//                 <PhotoIcon className="h-4 w-4 mr-1" />
//                 {category.referenceImages.length} fotos de referencia
//               </div>
//               <div className="flex items-center text-xs text-[#a8c241]">
//                 <InformationCircleIcon className="h-4 w-4 mr-1" />
//                 Más info
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };




// src/components/categories/CategorySelector.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Category, CategorySelectorProps, CategorySelectionState } from '@/types/categories';
import categoryService from '@/services/categoryService';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import  CategoryBreadcrumb  from './CategoryBreadcrumb';
import  CategoryCard  from './CategoryCard';
import  CategoryImageGallery  from './CategoryImageGallery';

const CategorySelector: React.FC<CategorySelectorProps> = ({
  type = 'DISMANTLED_DEVICES',
  onCategorySelect,
  onPathChange,
  selectedCategoryId,
  className
}) => {
  // Estado principal
  const [selectionState, setSelectionState] = useState<CategorySelectionState>({
    selectedPath: [],
    availableChildren: [],
    isComplete: false,
    canProceed: false
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Cargar categorías iniciales
  useEffect(() => {
    loadInitialCategories();
  }, [type]);

  // Manejar cambios en el path seleccionado
  useEffect(() => {
    if (onPathChange) {
      onPathChange(selectionState.selectedPath);
    }
  }, [selectionState.selectedPath, onPathChange]);

  /**
   * Cargar categorías raíz
   */
  const loadInitialCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const rootCategories = await categoryService.getRootCategories(type);
      
      setSelectionState({
        selectedPath: [],
        availableChildren: rootCategories,
        isComplete: false,
        canProceed: false
      });
    } catch (err) {
      setError('Error al cargar las categorías. Por favor intenta de nuevo.');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar selección de categoría
   */
  const handleCategoryClick = async (category: Category) => {
    try {
      setLoading(true);
      
      const newPath = [...selectionState.selectedPath, category];
      
      if (category.isLeaf) {
        // Es una categoría final - completar selección
        setSelectionState({
          selectedPath: newPath,
          currentCategory: category,
          availableChildren: [],
          isComplete: true,
          canProceed: true
        });
        
        onCategorySelect(category);
      } else {
        // Cargar subcategorías
        const children = await categoryService.getCategoryChildren(category.id);
        
        setSelectionState({
          selectedPath: newPath,
          currentCategory: category,
          availableChildren: children,
          isComplete: false,
          canProceed: false
        });
      }
    } catch (err) {
      setError('Error al cargar las subcategorías.');
      console.error('Error loading subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retroceder en la selección
   */
  const handleGoBack = async () => {
    try {
      setLoading(true);
      
      if (selectionState.selectedPath.length === 0) {
        return;
      }
      
      if (selectionState.selectedPath.length === 1) {
        // Volver al inicio
        await loadInitialCategories();
        return;
      }

      // Volver al nivel anterior
      const newPath = selectionState.selectedPath.slice(0, -1);
      const parentCategory = newPath[newPath.length - 1];
      const children = await categoryService.getCategoryChildren(parentCategory.id);

      setSelectionState({
        selectedPath: newPath,
        currentCategory: parentCategory,
        availableChildren: children,
        isComplete: false,
        canProceed: false
      });
    } catch (err) {
      setError('Error al retroceder.');
      console.error('Error going back:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar clic en breadcrumb
   */
  const handleBreadcrumbClick = async (clickedCategory: Category, index: number) => {
    try {
      setLoading(true);
      
      if (index === -1) {
        // Clic en "Inicio" - volver al principio
        await loadInitialCategories();
        return;
      }

      const newPath = selectionState.selectedPath.slice(0, index + 1);
      
      if (clickedCategory.isLeaf) {
        setSelectionState({
          selectedPath: newPath,
          currentCategory: clickedCategory,
          availableChildren: [],
          isComplete: true,
          canProceed: true
        });
      } else {
        const children = await categoryService.getCategoryChildren(clickedCategory.id);
        
        setSelectionState({
          selectedPath: newPath,
          currentCategory: clickedCategory,
          availableChildren: children,
          isComplete: false,
          canProceed: false
        });
      }
    } catch (err) {
      setError('Error al navegar.');
      console.error('Error navigating breadcrumb:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar búsqueda
   */
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await categoryService.searchCategories(query, { 
        type,
        leafOnly: true 
      });
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [type]);

  /**
   * Manejar selección desde búsqueda
   */
  const handleSearchResultClick = async (category: Category) => {
    try {
      setLoading(true);
      
      // Construir el path completo
      const fullPath = await categoryService.buildCategoryPath(category.id);
      
      setSelectionState({
        selectedPath: fullPath,
        currentCategory: category,
        availableChildren: [],
        isComplete: true,
        canProceed: true
      });
      
      onCategorySelect(category);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError('Error al seleccionar categoría.');
      console.error('Error selecting from search:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resetear selección
   */
  const handleReset = () => {
    loadInitialCategories();
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading && selectionState.selectedPath.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header con búsqueda */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {type === 'COMPLETE_DEVICES' ? 'Selecciona tu dispositivo' : 'Selecciona la categoría específica'}
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center space-x-2"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>{showSearch ? 'Cerrar' : 'Buscar'}</span>
          </Button>
          
          {selectionState.selectedPath.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              Reiniciar
            </Button>
          )}
        </div>
      </div>

      {/* Barra de búsqueda */}
      {showSearch && (
        <Card>
          <CardContent className="pt-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Buscar ${type === 'COMPLETE_DEVICES' ? 'dispositivo' : 'categoría'} específica...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Resultados de búsqueda */}
            {searchLoading && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" />
                <span className="ml-2 text-sm text-gray-500">Buscando...</span>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleSearchResultClick(category)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.fullPath.replace(/\//g, ' > ')}</p>
                      </div>
                      {category.pricePerKg && (
                        <Badge variant="secondary" className="ml-2">
                          ${category.pricePerKg}/kg
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {searchQuery.trim().length >= 2 && !searchLoading && searchResults.length === 0 && (
              <div className="mt-4 text-center py-4 text-gray-500">
                No se encontraron resultados para "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Breadcrumb */}
      {selectionState.selectedPath.length > 0 && (
        <CategoryBreadcrumb
          items={[
            { id: 'root', name: 'Inicio', slug: 'inicio' },
            ...selectionState.selectedPath.map((cat: Category) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug
            }))
          ]}
          onItemClick={(item, index) => {
            if (index === 0) {
              handleReset();
            } else {
              const category = selectionState.selectedPath[index - 1];
              handleBreadcrumbClick(category, index - 1);
            }
          }}
        />
      )}

      {/* Navegación de retroceso */}
      {selectionState.selectedPath.length > 0 && (
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Volver atrás</span>
        </Button>
      )}

      {/* Error */}
      {error && (
        <Alert variant="danger">
          <ExclamationCircleIcon className="h-4 w-4" />
          {error}
        </Alert>
      )}

      {/* Categoría actual seleccionada (si es hoja) */}
      {selectionState.isComplete && selectionState.currentCategory && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">
                {type === 'COMPLETE_DEVICES' ? 'Dispositivo seleccionado' : 'Categoría seleccionada'}
              </h4>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryCard
              category={selectionState.currentCategory}
              onClick={() => {}}
              isSelected={true}
              showPrice={true}
              showImages={true}
              size="lg"
            />
            
            {/* Galería de imágenes de referencia */}
            {selectionState.currentCategory.images.length > 0 && (
              <div className="mt-4">
                <CategoryImageGallery category={selectionState.currentCategory} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de categorías disponibles */}
      {!selectionState.isComplete && selectionState.availableChildren.length > 0 && (
        <Card>
          <CardHeader>
            <h4 className="font-medium text-gray-900">
              {selectionState.selectedPath.length === 0 
                ? `Selecciona una categoría ${type === 'COMPLETE_DEVICES' ? 'de dispositivo' : 'principal'}` 
                : `Subcategorías de "${selectionState.selectedPath[selectionState.selectedPath.length - 1]?.name}"`
              }
            </h4>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
                <span className="ml-3 text-gray-600">Cargando subcategorías...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectionState.availableChildren.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={handleCategoryClick}
                    isSelected={selectedCategoryId === category.id}
                    showPrice={category.isLeaf}
                    showImages={category.isLeaf && category.images.length > 0}
                    size="md"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estado vacío */}
      {!loading && !selectionState.isComplete && selectionState.availableChildren.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            <PhotoIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No hay subcategorías disponibles</p>
            <p className="text-sm">Esta categoría no tiene elementos adicionales.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;