// src/components/categories/CategoryCard.tsx
import React from 'react';
import { 
  ChevronRightIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { CategoryCardProps } from '@/types/categories';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  isSelected = false,
  showPrice = false,
  showImages = false,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const textSizeClasses = {
    sm: { title: 'text-sm', description: 'text-xs' },
    md: { title: 'text-base', description: 'text-sm' },
    lg: { title: 'text-lg', description: 'text-base' }
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected 
          ? 'ring-2 ring-green-500 border-green-200 bg-green-50' 
          : 'hover:border-gray-300 hover:shadow-sm',
        className
      )}
      onClick={() => onClick(category)}
    >
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header con ícono y nombre */}
            <div className="flex items-center space-x-2 mb-2">
              {category.icon && (
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <i 
                    className={`${category.icon} text-sm`}
                    style={{ color: category.color }}
                  />
                </div>
              )}
              
              <h3 className={cn(
                'font-semibold text-gray-900 truncate',
                textSizeClasses[size].title
              )}>
                {category.name}
              </h3>
              
              {category.isLeaf && (
                <Badge variant="secondary" size="sm">
                  Final
                </Badge>
              )}
            </div>

            {/* Descripción */}
            {category.description && (
              <p className={cn(
                'text-gray-600 mb-3 line-clamp-2',
                textSizeClasses[size].description
              )}>
                {category.description}
              </p>
            )}

            {/* Información de precio */}
            {showPrice && category.pricePerKg && (
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1 text-green-600">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    ${category.pricePerKg}/kg
                  </span>
                </div>
                
                {(category.minWeight || category.maxWeight) && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ScaleIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {category.minWeight && `Min: ${category.minWeight}kg`}
                      {category.minWeight && category.maxWeight && ' • '}
                      {category.maxWeight && `Max: ${category.maxWeight}kg`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Vista previa de imágenes */}
            {showImages && category.images.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center space-x-1 mb-2">
                  <PhotoIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {category.images.length} imagen{category.images.length > 1 ? 'es' : ''} de referencia
                  </span>
                </div>
                
                <div className="flex space-x-2 overflow-x-auto">
                  {category.images.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${category.name} ${index + 1}`}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-category.jpg';
                      }}
                    />
                  ))}
                  
                  {category.images.length > 3 && (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        +{category.images.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Indicador de navegación */}
          {!category.isLeaf && (
            <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;