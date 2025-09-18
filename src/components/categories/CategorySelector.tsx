// src/components/categories/CategorySelector.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  ChevronRightIcon,
  PhotoIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCategories } from '@/hooks/useCategories';
import { 
  CategoryType, 
  Category,
  getCategoryTypeLabel,
  MATERIAL_GRADE_INFO
} from '@/types/categories';

interface CategorySelectorProps {
  onCategorySelect: (category: Category) => void;
  selectedCategoryId?: string;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategorySelect,
  selectedCategoryId,
  className = ''
}) => {
  const {
    types,
    selectedType,
    currentCategories,
    searchResults,
    searchTerm,
    loading,
    loadingCategories,
    searchLoading,
    error,
    selectType,
    searchCategories,
    clearSearch
  } = useCategories();

  const [searchInput, setSearchInput] = useState('');

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchInput(term);
    if (term.length >= 2) {
      await searchCategories(term, selectedType);
    } else {
      clearSearch();
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    onCategorySelect(category);
  };

  // Get categories to display
  const categoriesToShow = searchTerm ? searchResults : currentCategories;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Cargando categorías..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar categorías</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Qué tipo de dispositivo quieres vender?
        </h2>
        <p className="text-gray-600">
          Selecciona la categoría que mejor describa tu dispositivo electrónico
        </p>
      </div>

      {/* Type Selection */}
      {!selectedType && (
        <div className="grid md:grid-cols-2 gap-6">
          {types.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-[#a8c241]"
                onClick={() => selectType(type.type)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-center text-[#a8c241]">
                    <span className="text-sm font-medium">Seleccionar</span>
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Selection */}
      {selectedType && (
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {getCategoryTypeLabel(selectedType)}
              </h3>
              <p className="text-gray-600">
                Selecciona la categoría específica de tu dispositivo
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => selectType(undefined as any)}
            >
              ← Cambiar tipo
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por marca, modelo o tipo..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {searchLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>

          {/* Categories Grid */}
          {loadingCategories ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner text="Cargando categorías..." />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {categoriesToShow.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={selectedCategoryId === category.id}
                    onSelect={handleCategorySelect}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* No results */}
          {categoriesToShow.length === 0 && !loadingCategories && (
            <div className="text-center py-8">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay categorías disponibles'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Las categorías se están cargando...'
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => handleSearch('')}
                  className="mt-4"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para cada tarjeta de categoría
interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onSelect
}) => {
  const materialGradeInfo = category.materialGrade 
    ? MATERIAL_GRADE_INFO[category.materialGrade] 
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 border-2 ${
          isSelected 
            ? 'border-[#a8c241] bg-green-50 shadow-lg' 
            : 'border-gray-200 hover:border-[#a8c241] hover:shadow-md'
        }`}
        onClick={() => onSelect(category)}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{category.icon}</span>
              {isSelected && (
                <CheckCircleIcon className="h-5 w-5 text-[#a8c241]" />
              )}
            </div>
            {materialGradeInfo && (
              <Badge className={materialGradeInfo.color}>
                {materialGradeInfo.icon}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h4 className="font-semibold text-gray-900 mb-2">
            {category.name}
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3">
            {category.description}
          </p>

          {/* Price Info */}
          <div className="space-y-2 mb-3">
            {category.type === CategoryType.COMPLETE_DEVICES ? (
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Precio estimado:</span>
                  <span className="font-medium text-gray-900">
                    ${category.minPrice} - ${category.maxPrice}
                  </span>
                </div>
                {category.estimatedWeight && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Peso aprox:</span>
                    <span className="text-gray-700">
                      {category.estimatedWeight} kg
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Precio por kg:</span>
                  <span className="font-medium text-gray-900">
                    ${category.pricePerKg}/kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rango:</span>
                  <span className="text-gray-700">
                    ${category.minPrice} - ${category.maxPrice}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Examples */}
          {category.examples.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Ejemplos: </span>
              {category.examples.slice(0, 3).join(', ')}
              {category.examples.length > 3 && '...'}
            </div>
          )}

          {/* Reference Images Indicator */}
          {category.referenceImages.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <PhotoIcon className="h-4 w-4 mr-1" />
                {category.referenceImages.length} fotos de referencia
              </div>
              <div className="flex items-center text-xs text-[#a8c241]">
                <InformationCircleIcon className="h-4 w-4 mr-1" />
                Más info
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};