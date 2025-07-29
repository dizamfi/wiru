import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  VideoCameraIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

export interface Category {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
  minPrice: number;
  maxPrice: number;
  popularItems?: string[];
}

export const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Teléfonos inteligentes de todas las marcas',
    pricePerKg: 800,
    icon: DevicePhoneMobileIcon,
    examples: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'],
    minPrice: 80,
    maxPrice: 800,
    popularItems: ['iPhone 12', 'Samsung S21', 'Google Pixel 6']
  },
  {
    id: 'laptops',
    name: 'Laptops',
    description: 'Portátiles, notebooks, ultrabooks',
    pricePerKg: 450,
    icon: ComputerDesktopIcon,
    examples: ['MacBook', 'Dell XPS', 'HP Pavilion', 'Lenovo ThinkPad'],
    minPrice: 150,
    maxPrice: 1200,
    popularItems: ['MacBook Air', 'Dell XPS 13', 'HP Pavilion']
  },
  {
    id: 'tablets',
    name: 'Tablets',
    description: 'Tabletas y e-readers',
    pricePerKg: 350,
    icon: DeviceTabletIcon,
    examples: ['iPad', 'Samsung Tab', 'Surface Pro', 'Kindle'],
    minPrice: 60,
    maxPrice: 600,
    popularItems: ['iPad Air', 'Samsung Tab S7', 'Surface Pro']
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Consolas y accesorios de videojuegos',
    pricePerKg: 300,
    icon: VideoCameraIcon,
    examples: ['PlayStation', 'Xbox', 'Nintendo Switch', 'Steam Deck'],
    minPrice: 100,
    maxPrice: 500,
    popularItems: ['PS5', 'Xbox Series X', 'Nintendo Switch']
  },
  {
    id: 'accessories',
    name: 'Accesorios',
    description: 'Auriculares, cables, cargadores, etc.',
    pricePerKg: 200,
    icon: SpeakerWaveIcon,
    examples: ['AirPods', 'Cables USB', 'Cargadores', 'Teclados'],
    minPrice: 20,
    maxPrice: 200,
    popularItems: ['AirPods', 'Apple Watch', 'Cables Lightning']
  }
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  showPopular?: boolean;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  showPopular = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:shadow-md hover:scale-105'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                  <Badge variant="outline" className="mb-2">
                    ~${category.pricePerKg}/kg
                  </Badge>
                  <p className="text-xs text-gray-500">
                    ${category.minPrice} - ${category.maxPrice}
                  </p>
                  
                  {showPopular && category.popularItems && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Popular:</p>
                      <div className="space-y-1">
                        {category.popularItems.slice(0, 2).map((item, index) => (
                          <p key={index} className="text-xs text-primary-600">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedCategory && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-medium text-primary-900 mb-2">
                Categoría seleccionada: {categories.find(c => c.id === selectedCategory)?.name}
              </h4>
              <p className="text-sm text-primary-700">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};