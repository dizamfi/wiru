// src/components/categories/CategoryImageGallery.tsx
import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CategoryImageGalleryProps } from '@/types/categories';
import { cn } from '@/utils/cn';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const CategoryImageGallery: React.FC<CategoryImageGalleryProps> = ({
  category,
  onImageClick,
  className
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const handleImageClick = (imageUrl: string, index: number) => {
    setSelectedImageIndex(index);
    onImageClick?.(imageUrl, index);
  };

  const handlePrevious = () => {
    if (selectedImageIndex === null) return;
    const newIndex = selectedImageIndex > 0 
      ? selectedImageIndex - 1 
      : category.images.length - 1;
    setSelectedImageIndex(newIndex);
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    const newIndex = selectedImageIndex < category.images.length - 1 
      ? selectedImageIndex + 1 
      : 0;
    setSelectedImageIndex(newIndex);
  };

  if (category.images.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn('space-y-3', className)}>
        <h5 className="text-sm font-medium text-gray-900">
          Imágenes de referencia
        </h5>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {category.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square cursor-pointer group relative overflow-hidden rounded-lg"
              onClick={() => handleImageClick(image, index)}
            >
              <img
                src={image}
                alt={`${category.name} - Imagen ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-category.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500">
          Haz clic en las imágenes para verlas en detalle
        </p>
      </div>

      {/* Modal de imagen ampliada */}
      <Modal
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        size="lg"
      >
        {selectedImageIndex !== null && (
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {category.name} - Imagen {selectedImageIndex + 1} de {category.images.length}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImageIndex(null)}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Imagen */}
            <div className="p-4">
              <div className="relative">
                <img
                  src={category.images[selectedImageIndex]}
                  alt={`${category.name} - Imagen ${selectedImageIndex + 1}`}
                  className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
                />
                
                {/* Controles de navegación */}
                {category.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {category.images.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex space-x-2 overflow-x-auto">
                  {category.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        'w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0',
                        index === selectedImageIndex 
                          ? 'border-green-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default CategoryImageGallery;