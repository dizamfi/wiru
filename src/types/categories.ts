// src/types/categories.ts - Categorías completas según requerimientos
import React, { useState } from 'react';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  estimatedWeight: number; // Peso promedio en kg
  basePrice: number; // Precio base por kg
  priceRange: {
    min: number;
    max: number;
  };
  subcategories: ProductSubcategory[];
  isActive: boolean;
  multipliers: {
    condition: Record<DeviceCondition, number>;
    accessories: Record<string, number>;
  };
}

export interface ProductSubcategory {
  id: string;
  name: string;
  description: string;
  estimatedWeight: number;
  priceMultiplier: number; // Multiplicador sobre el precio base
  examples: string[];
  requiredFields: string[];
  isActive: boolean;
}

export type DeviceCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';

// Nuevas categorías principales según requerimientos
export const MAIN_CATEGORIES: ProductCategory[] = [
  {
    id: 'complete-devices',
    name: 'Dispositivos Completos',
    description: 'Equipos electrónicos completos y funcionales',
    icon: '📱',
    estimatedWeight: 0.5,
    basePrice: 15.0,
    priceRange: { min: 5, max: 200 },
    isActive: true,
    multipliers: {
      condition: {
        excellent: 1.0,
        good: 0.8,
        fair: 0.6,
        poor: 0.4,
        broken: 0.2
      },
      accessories: {
        charger: 0.1,
        box: 0.05,
        documents: 0.03,
        headphones: 0.08,
        case: 0.05
      }
    },
    subcategories: [
      {
        id: 'smartphones',
        name: 'Smartphones',
        description: 'Teléfonos inteligentes de cualquier marca',
        estimatedWeight: 0.2,
        priceMultiplier: 1.5,
        examples: ['iPhone', 'Samsung Galaxy', 'Huawei', 'Xiaomi', 'Nokia'],
        requiredFields: ['brand', 'model', 'storage', 'condition'],
        isActive: true
      },
      {
        id: 'tablets',
        name: 'Tablets',
        description: 'Tabletas y iPads',
        estimatedWeight: 0.5,
        priceMultiplier: 1.3,
        examples: ['iPad', 'Samsung Tab', 'Lenovo Tab', 'Huawei MatePad'],
        requiredFields: ['brand', 'model', 'screenSize', 'condition'],
        isActive: true
      },
      {
        id: 'laptops',
        name: 'Laptops',
        description: 'Computadoras portátiles',
        estimatedWeight: 2.5,
        priceMultiplier: 2.0,
        examples: ['MacBook', 'Dell Inspiron', 'HP Pavilion', 'Lenovo ThinkPad'],
        requiredFields: ['brand', 'model', 'processor', 'ram', 'condition'],
        isActive: true
      },
      {
        id: 'desktops',
        name: 'Computadoras de Escritorio',
        description: 'PCs de escritorio completas',
        estimatedWeight: 8.0,
        priceMultiplier: 1.8,
        examples: ['Dell OptiPlex', 'HP EliteDesk', 'Lenovo ThinkCentre'],
        requiredFields: ['brand', 'processor', 'ram', 'storage', 'condition'],
        isActive: true
      },
      {
        id: 'monitors',
        name: 'Monitores',
        description: 'Pantallas de computadora',
        estimatedWeight: 3.0,
        priceMultiplier: 1.2,
        examples: ['Dell UltraSharp', 'Samsung Monitor', 'LG Monitor', 'ASUS'],
        requiredFields: ['brand', 'screenSize', 'resolution', 'condition'],
        isActive: true
      },
      {
        id: 'tvs',
        name: 'Televisores',
        description: 'Televisiones LCD, LED, OLED',
        estimatedWeight: 15.0,
        priceMultiplier: 1.4,
        examples: ['Samsung Smart TV', 'LG OLED', 'Sony Bravia', 'TCL'],
        requiredFields: ['brand', 'screenSize', 'technology', 'condition'],
        isActive: true
      },
      {
        id: 'gaming-consoles',
        name: 'Consolas de Videojuegos',
        description: 'PlayStation, Xbox, Nintendo',
        estimatedWeight: 3.0,
        priceMultiplier: 1.6,
        examples: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch'],
        requiredFields: ['brand', 'model', 'storage', 'condition'],
        isActive: true
      },
      {
        id: 'small-appliances',
        name: 'Electrodomésticos Pequeños',
        description: 'Microondas, cafeteras, licuadoras',
        estimatedWeight: 5.0,
        priceMultiplier: 0.8,
        examples: ['Microondas', 'Cafetera', 'Licuadora', 'Tostadora'],
        requiredFields: ['brand', 'type', 'capacity', 'condition'],
        isActive: true
      },
      {
        id: 'audio-equipment',
        name: 'Equipos de Audio',
        description: 'Parlantes, auriculares, equipos de sonido',
        estimatedWeight: 2.0,
        priceMultiplier: 1.1,
        examples: ['Parlantes Bluetooth', 'Auriculares', 'Equipos de sonido'],
        requiredFields: ['brand', 'type', 'connectivity', 'condition'],
        isActive: true
      },
      {
        id: 'cameras',
        name: 'Cámaras y Equipos Fotográficos',
        description: 'Cámaras digitales, lentes, accesorios',
        estimatedWeight: 1.0,
        priceMultiplier: 1.7,
        examples: ['Canon EOS', 'Nikon D series', 'Sony Alpha', 'GoPro'],
        requiredFields: ['brand', 'model', 'type', 'condition'],
        isActive: true
      },
      {
        id: 'networking',
        name: 'Equipos de Red',
        description: 'Routers, switches, access points',
        estimatedWeight: 0.8,
        priceMultiplier: 1.0,
        examples: ['Router WiFi', 'Switch', 'Access Point', 'Modem'],
        requiredFields: ['brand', 'model', 'type', 'condition'],
        isActive: true
      },
      {
        id: 'printers',
        name: 'Impresoras y Multifuncionales',
        description: 'Impresoras, scanners, multifuncionales',
        estimatedWeight: 6.0,
        priceMultiplier: 0.9,
        examples: ['HP LaserJet', 'Canon Pixma', 'Epson EcoTank', 'Brother'],
        requiredFields: ['brand', 'model', 'type', 'condition'],
        isActive: true
      }
    ]
  },
  {
    id: 'disassembled-devices',
    name: 'Placas o Dispositivos Desarmados',
    description: 'Componentes y placas electrónicas por separado',
    icon: '🔧',
    estimatedWeight: 0.3,
    basePrice: 8.0,
    priceRange: { min: 2, max: 50 },
    isActive: true,
    multipliers: {
      condition: {
        excellent: 1.0,
        good: 0.9,
        fair: 0.7,
        poor: 0.5,
        broken: 0.3
      },
      accessories: {}
    },
    subcategories: [
      {
        id: 'motherboards',
        name: 'Placas Madre',
        description: 'Motherboards de computadoras y laptops',
        estimatedWeight: 0.5,
        priceMultiplier: 1.8,
        examples: ['Placa madre laptop', 'Motherboard PC', 'Placa principal'],
        requiredFields: ['deviceOrigin', 'chipset', 'condition'],
        isActive: true
      },
      {
        id: 'processors',
        name: 'Procesadores',
        description: 'CPUs de computadoras y dispositivos móviles',
        estimatedWeight: 0.05,
        priceMultiplier: 3.0,
        examples: ['Intel Core', 'AMD Ryzen', 'Snapdragon', 'Apple A-Series'],
        requiredFields: ['brand', 'model', 'generation', 'condition'],
        isActive: true
      },
      {
        id: 'memory',
        name: 'Memorias RAM',
        description: 'Módulos de memoria DDR3, DDR4, DDR5',
        estimatedWeight: 0.02,
        priceMultiplier: 2.5,
        examples: ['DDR4 8GB', 'DDR3 4GB', 'SO-DIMM', 'Desktop RAM'],
        requiredFields: ['type', 'capacity', 'speed', 'condition'],
        isActive: true
      },
      {
        id: 'storage',
        name: 'Almacenamiento',
        description: 'Discos duros, SSD, memorias flash',
        estimatedWeight: 0.1,
        priceMultiplier: 2.0,
        examples: ['HDD', 'SSD', 'MicroSD', 'USB Flash Drive'],
        requiredFields: ['type', 'capacity', 'interface', 'condition'],
        isActive: true
      },
      {
        id: 'graphics-cards',
        name: 'Tarjetas Gráficas',
        description: 'GPU dedicadas y integradas',
        estimatedWeight: 0.8,
        priceMultiplier: 2.2,
        examples: ['NVIDIA GTX', 'AMD Radeon', 'Intel Graphics'],
        requiredFields: ['brand', 'model', 'memory', 'condition'],
        isActive: true
      },
      {
        id: 'displays',
        name: 'Pantallas',
        description: 'Displays de smartphones, tablets, laptops',
        estimatedWeight: 0.3,
        priceMultiplier: 1.5,
        examples: ['Pantalla smartphone', 'Display laptop', 'Touchscreen'],
        requiredFields: ['deviceType', 'size', 'technology', 'condition'],
        isActive: true
      },
      {
        id: 'batteries',
        name: 'Baterías',
        description: 'Baterías de litio de dispositivos electrónicos',
        estimatedWeight: 0.2,
        priceMultiplier: 1.3,
        examples: ['Batería smartphone', 'Batería laptop', 'Power bank'],
        requiredFields: ['deviceType', 'capacity', 'chemistry', 'condition'],
        isActive: true
      },
      {
        id: 'cables-connectors',
        name: 'Cables y Conectores',
        description: 'Cables, cargadores, adaptadores',
        estimatedWeight: 0.1,
        priceMultiplier: 0.8,
        examples: ['Cargadores', 'Cables USB', 'Adaptadores', 'Conectores'],
        requiredFields: ['type', 'connector', 'length', 'condition'],
        isActive: true
      },
      {
        id: 'circuit-boards',
        name: 'Placas de Circuito',
        description: 'PCBs de diversos dispositivos electrónicos',
        estimatedWeight: 0.15,
        priceMultiplier: 1.2,
        examples: ['PCB smartphone', 'Placa TV', 'Circuito impreso'],
        requiredFields: ['deviceOrigin', 'complexity', 'metalContent', 'condition'],
        isActive: true
      },
      {
        id: 'mixed-components',
        name: 'Componentes Mixtos',
        description: 'Mezcla de componentes pequeños',
        estimatedWeight: 0.5,
        priceMultiplier: 1.0,
        examples: ['Resistencias', 'Capacitores', 'Chips', 'Conectores'],
        requiredFields: ['approximateQuantity', 'primaryMetal', 'condition'],
        isActive: true
      },
      {
        id: 'power-supplies',
        name: 'Fuentes de Poder',
        description: 'Fuentes de alimentación de computadoras',
        estimatedWeight: 1.2,
        priceMultiplier: 1.1,
        examples: ['PSU ATX', 'Adaptador laptop', 'Cargador universal'],
        requiredFields: ['wattage', 'type', 'efficiency', 'condition'],
        isActive: true
      },
      {
        id: 'cooling-systems',
        name: 'Sistemas de Refrigeración',
        description: 'Ventiladores, disipadores, sistemas de cooling',
        estimatedWeight: 0.4,
        priceMultiplier: 0.7,
        examples: ['Ventilador CPU', 'Disipador', 'Cooler líquido'],
        requiredFields: ['type', 'size', 'compatibility', 'condition'],
        isActive: true
      }
    ]
  }
];

// Utility functions para categorías
export const getCategoryById = (categoryId: string): ProductCategory | undefined => {
  return MAIN_CATEGORIES.find(cat => cat.id === categoryId);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): ProductSubcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const calculateEstimatedPrice = (
  categoryId: string,
  subcategoryId: string,
  weight: number,
  condition: DeviceCondition,
  accessories: string[] = []
): number => {
  const category = getCategoryById(categoryId);
  const subcategory = getSubcategoryById(categoryId, subcategoryId);
  
  if (!category || !subcategory) return 0;

  // Precio base por kg * peso * multiplicador de subcategoría
  let basePrice = category.basePrice * weight * subcategory.priceMultiplier;
  
  // Aplicar multiplicador por condición
  basePrice *= category.multipliers.condition[condition];
  
  // Aplicar bonificaciones por accesorios
  let accessoryBonus = 0;
  accessories.forEach(accessory => {
    if (category.multipliers.accessories[accessory]) {
      accessoryBonus += basePrice * category.multipliers.accessories[accessory];
    }
  });
  
  return Math.round((basePrice + accessoryBonus) * 100) / 100;
};

// Validaciones de campos requeridos por categoría
export const validateRequiredFields = (
  categoryId: string,
  subcategoryId: string,
  data: Record<string, any>
): { isValid: boolean; missingFields: string[] } => {
  const subcategory = getSubcategoryById(categoryId, subcategoryId);
  
  if (!subcategory) {
    return { isValid: false, missingFields: [] };
  }
  
  const missingFields = subcategory.requiredFields.filter(field => !data[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

// Helper para obtener todas las subcategorías activas
export const getAllActiveSubcategories = (): Array<ProductSubcategory & { categoryId: string; categoryName: string }> => {
  const result: Array<ProductSubcategory & { categoryId: string; categoryName: string }> = [];
  
  MAIN_CATEGORIES.forEach(category => {
    if (category.isActive) {
      category.subcategories.forEach(subcategory => {
        if (subcategory.isActive) {
          result.push({
            ...subcategory,
            categoryId: category.id,
            categoryName: category.name
          });
        }
      });
    }
  });
  
  return result;
};

// Filtros para búsqueda de categorías
export const filterCategoriesByText = (searchText: string): ProductCategory[] => {
  if (!searchText.trim()) return MAIN_CATEGORIES.filter(cat => cat.isActive);
  
  const lowerSearchText = searchText.toLowerCase();
  
  return MAIN_CATEGORIES.filter(category => {
    if (!category.isActive) return false;
    
    // Buscar en nombre y descripción de categoría
    const categoryMatch = 
      category.name.toLowerCase().includes(lowerSearchText) ||
      category.description.toLowerCase().includes(lowerSearchText);
    
    // Buscar en subcategorías
    const subcategoryMatch = category.subcategories.some(sub =>
      sub.isActive && (
        sub.name.toLowerCase().includes(lowerSearchText) ||
        sub.description.toLowerCase().includes(lowerSearchText) ||
        sub.examples.some(example => example.toLowerCase().includes(lowerSearchText))
      )
    );
    
    return categoryMatch || subcategoryMatch;
  });
};

// Función para obtener condiciones con sus multiplicadores
export const getConditionOptions = () => [
  { 
    value: 'excellent', 
    label: 'Excelente', 
    description: 'Como nuevo, sin daños visibles',
    multiplier: 1.0,
    color: 'text-green-600'
  },
  { 
    value: 'good', 
    label: 'Bueno', 
    description: 'Ligeros signos de uso, funciona perfectamente',
    multiplier: 0.8,
    color: 'text-blue-600'
  },
  { 
    value: 'fair', 
    label: 'Regular', 
    description: 'Uso moderado, algunas marcas pero funcional',
    multiplier: 0.6,
    color: 'text-yellow-600'
  },
  { 
    value: 'poor', 
    label: 'Malo', 
    description: 'Muy usado, funciona con limitaciones',
    multiplier: 0.4,
    color: 'text-orange-600'
  },
  { 
    value: 'broken', 
    label: 'Dañado', 
    description: 'No funciona o funciona parcialmente',
    multiplier: 0.2,
    color: 'text-red-600'
  }
];

// Función para obtener opciones de accesorios comunes
export const getAccessoryOptions = () => [
  { value: 'charger', label: 'Cargador', bonus: 0.1 },
  { value: 'box', label: 'Caja original', bonus: 0.05 },
  { value: 'documents', label: 'Documentos', bonus: 0.03 },
  { value: 'headphones', label: 'Auriculares', bonus: 0.08 },
  { value: 'case', label: 'Funda/Estuche', bonus: 0.05 },
  { value: 'cable', label: 'Cable USB', bonus: 0.03 },
  { value: 'manual', label: 'Manual', bonus: 0.02 }
];

// Componente para mostrar las categorías actualizadas
interface CategorySelectorProps {
  onCategorySelect: (categoryId: string, subcategoryId: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

// export const CategorySelector: React.FC<CategorySelectorProps> = ({
//   onCategorySelect,
//   selectedCategory,
//   selectedSubcategory
// }) => {
//   const [searchText, setSearchText] = useState('');
//   const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
//   const filteredCategories = filterCategoriesByText(searchText);

//   return (
//     <div className="space-y-4">
//       {/* Search */}
//       <div className="relative">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <Input
//           placeholder="Buscar categoría o dispositivo..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="pl-10"
//         />
//       </div>

//       {/* Categories */}
//       <div className="space-y-3">
//         {filteredCategories.map((category) => (
//           <Card key={category.id} className="overflow-hidden">
//             <CardContent className="p-0">
//               {/* Category Header */}
//               <div 
//                 className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
//                 onClick={() => setExpandedCategory(
//                   expandedCategory === category.id ? null : category.id
//                 )}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <span className="text-2xl">{category.icon}</span>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{category.name}</h3>
//                       <p className="text-sm text-gray-600">{category.description}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline">
//                       {category.subcategories.filter(sub => sub.isActive).length} tipos
//                     </Badge>
//                     <ChevronRightIcon 
//                       className={`h-5 w-5 text-gray-400 transition-transform ${
//                         expandedCategory === category.id ? 'rotate-90' : ''
//                       }`}
//                     />
//                   </div>
//                 </div>
                
//                 {/* Price range */}
//                 <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
//                   <span>Precio base: ${category.basePrice}/kg</span>
//                   <span>•</span>
//                   <span>Rango: ${category.priceRange.min} - ${category.priceRange.max}</span>
//                 </div>
//               </div>

//               {/* Subcategories */}
//               {expandedCategory === category.id && (
//                 <div className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {category.subcategories
//                       .filter(sub => sub.isActive)
//                       .map((subcategory) => (
//                         <div
//                           key={subcategory.id}
//                           className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
//                             selectedCategory === category.id && selectedSubcategory === subcategory.id
//                               ? 'border-primary-500 bg-primary-50'
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}
//                           onClick={() => onCategorySelect(category.id, subcategory.id)}
//                         >
//                           <div className="flex justify-between items-start mb-2">
//                             <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
//                             <Badge 
//                               variant="secondary" 
//                               className="text-xs"
//                             >
//                               ~{subcategory.estimatedWeight}kg
//                             </Badge>
//                           </div>
                          
//                           <p className="text-sm text-gray-600 mb-2">
//                             {subcategory.description}
//                           </p>
                          
//                           {/* Examples */}
//                           <div className="flex flex-wrap gap-1">
//                             {subcategory.examples.slice(0, 3).map((example, index) => (
//                               <span 
//                                 key={index}
//                                 className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
//                               >
//                                 {example}
//                               </span>
//                             ))}
//                             {subcategory.examples.length > 3 && (
//                               <span className="text-xs text-gray-500">
//                                 +{subcategory.examples.length - 3} más
//                               </span>
//                             )}
//                           </div>
                          
//                           {/* Price multiplier */}
//                           <div className="mt-2 text-xs text-gray-500">
//                             Multiplicador: {subcategory.priceMultiplier}x
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredCategories.length === 0 && (
//         <div className="text-center py-12">
//           <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">No se encontraron categorías que coincidan con tu búsqueda</p>
//           <Button 
//             variant="outline" 
//             onClick={() => setSearchText('')}
//             className="mt-4"
//           >
//             Limpiar búsqueda
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// Hook para usar las categorías
export const useCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const getSelectedCategoryData = () => {
    if (!selectedCategory || !selectedSubcategory) return null;
    
    const category = getCategoryById(selectedCategory);
    const subcategory = getSubcategoryById(selectedCategory, selectedSubcategory);
    
    return { category, subcategory };
  };

  const calculatePrice = (weight: number, condition: DeviceCondition, accessories: string[] = []) => {
    if (!selectedCategory || !selectedSubcategory) return 0;
    return calculateEstimatedPrice(selectedCategory, selectedSubcategory, weight, condition, accessories);
  };

  return {
    selectedCategory,
    selectedSubcategory,
    handleCategorySelect,
    resetSelection,
    getSelectedCategoryData,
    calculatePrice,
    categories: MAIN_CATEGORIES,
    allSubcategories: getAllActiveSubcategories()
  };
};