// // src/services/categoryService.ts
// import  api  from './api';
// import { 
//   CategoryMainType, 
//   Category, 
//   CategoryType, 
//   PriceCalculationRequest, 
//   PriceCalculationResult,
//   FieldValidation,
//   CategoryStats
// } from '@/types/categories';

// export class CategoryService {
  
//   /**
//    * Obtener tipos principales de categorías
//    */
//   static async getCategoryTypes(): Promise<CategoryMainType[]> {
//     try {
//       const response = await api.get('/categories/types');
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching category types:', error);
//       throw new Error('No se pudieron cargar los tipos de categorías');
//     }
//   }

//   /**
//    * Obtener categorías por tipo
//    */
//   static async getCategoriesByType(type: CategoryType): Promise<Category[]> {
//     try {
//       const response = await api.get(`/categories/by-type/${type}`);
//       return response.data.data;
//     } catch (error) {
//       console.error(`Error fetching categories for type ${type}:`, error);
//       throw new Error(`No se pudieron cargar las categorías de ${type}`);
//     }
//   }

//   /**
//    * Obtener detalles de una categoría específica
//    */
//   static async getCategoryDetails(categoryId: string): Promise<Category> {
//     try {
//       const response = await api.get(`/categories/${categoryId}/details`);
//       return response.data.data;
//     } catch (error) {
//       console.error(`Error fetching category details for ${categoryId}:`, error);
//       throw new Error('No se pudieron cargar los detalles de la categoría');
//     }
//   }

//   /**
//    * Calcular precio estimado
//    */
//   static async calculatePrice(
//     categoryId: string, 
//     data: PriceCalculationRequest
//   ): Promise<PriceCalculationResult> {
//     try {
//       const response = await api.post(`/categories/${categoryId}/calculate-price`, data);
//       return response.data.data;
//     } catch (error) {
//       console.error(`Error calculating price for category ${categoryId}:`, error);
//       throw new Error('No se pudo calcular el precio estimado');
//     }
//   }

//   /**
//    * Validar campos de categoría
//    */
//   static async validateFields(
//     categoryId: string,
//     data: Record<string, any>
//   ): Promise<FieldValidation> {
//     try {
//       const response = await api.post(`/categories/${categoryId}/validate`, data);
//       return response.data.data;
//     } catch (error) {
//       console.error(`Error validating fields for category ${categoryId}:`, error);
//       throw new Error('No se pudo validar la información');
//     }
//   }

//   /**
//    * Buscar categorías
//    */
//   static async searchCategories(
//     searchTerm: string, 
//     type?: CategoryType
//   ): Promise<Category[]> {
//     try {
//       const params = new URLSearchParams({
//         q: searchTerm,
//         ...(type && { type })
//       });
      
//       const response = await api.get(`/categories/search?${params}`);
//       return response.data.data;
//     } catch (error) {
//       console.error('Error searching categories:', error);
//       throw new Error('No se pudieron buscar las categorías');
//     }
//   }

//   /**
//    * Obtener estadísticas de categorías
//    */
//   static async getCategoryStats(type?: CategoryType): Promise<CategoryStats> {
//     try {
//       const params = new URLSearchParams();
//       if (type) params.append('type', type);
      
//       const response = await api.get(`/categories/stats?${params}`);
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching category stats:', error);
//       throw new Error('No se pudieron cargar las estadísticas');
//     }
//   }

//   /**
//    * Obtener todas las categorías organizadas por tipo
//    */
//   static async getAllCategoriesByType(): Promise<Record<CategoryType, Category[]>> {
//     try {
//       const [completeDevices, dismantledDevices] = await Promise.all([
//         this.getCategoriesByType(CategoryType.COMPLETE_DEVICES),
//         this.getCategoriesByType(CategoryType.DISMANTLED_DEVICES)
//       ]);

//       return {
//         [CategoryType.COMPLETE_DEVICES]: completeDevices,
//         [CategoryType.DISMANTLED_DEVICES]: dismantledDevices
//       };
//     } catch (error) {
//       console.error('Error fetching all categories:', error);
//       throw new Error('No se pudieron cargar todas las categorías');
//     }
//   }
// }

// // Cache para optimizar requests
// class CategoryCache {
//   private static cache = new Map<string, { data: any; timestamp: number }>();
//   private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

//   static get<T>(key: string): T | null {
//     const cached = this.cache.get(key);
//     if (!cached) return null;
    
//     const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
//     if (isExpired) {
//       this.cache.delete(key);
//       return null;
//     }
    
//     return cached.data as T;
//   }

//   static set<T>(key: string, data: T): void {
//     this.cache.set(key, {
//       data,
//       timestamp: Date.now()
//     });
//   }

//   static clear(): void {
//     this.cache.clear();
//   }

//   static delete(key: string): void {
//     this.cache.delete(key);
//   }
// }

// // Servicio con cache
// export class CachedCategoryService extends CategoryService {
  
//   /**
//    * Obtener tipos principales con cache
//    */
//   static async getCategoryTypes(): Promise<CategoryMainType[]> {
//     const cacheKey = 'category-types';
//     const cached = CategoryCache.get<CategoryMainType[]>(cacheKey);
    
//     if (cached) return cached;
    
//     const data = await super.getCategoryTypes();
//     CategoryCache.set(cacheKey, data);
//     return data;
//   }

//   /**
//    * Obtener categorías por tipo con cache
//    */
//   static async getCategoriesByType(type: CategoryType): Promise<Category[]> {
//     const cacheKey = `categories-${type}`;
//     const cached = CategoryCache.get<Category[]>(cacheKey);
    
//     if (cached) return cached;
    
//     const data = await super.getCategoriesByType(type);
//     CategoryCache.set(cacheKey, data);
//     return data;
//   }

//   /**
//    * Obtener detalles de categoría con cache
//    */
//   static async getCategoryDetails(categoryId: string): Promise<Category> {
//     const cacheKey = `category-details-${categoryId}`;
//     const cached = CategoryCache.get<Category>(cacheKey);
    
//     if (cached) return cached;
    
//     const data = await super.getCategoryDetails(categoryId);
//     CategoryCache.set(cacheKey, data);
//     return data;
//   }

//   /**
//    * Limpiar cache cuando sea necesario
//    */
//   static clearCache(): void {
//     CategoryCache.clear();
//   }
// }

// // Hook personalizado para usar el servicio de categorías
// export const useCategoryService = () => {
//   return {
//     getCategoryTypes: CachedCategoryService.getCategoryTypes,
//     getCategoriesByType: CachedCategoryService.getCategoriesByType,
//     getCategoryDetails: CachedCategoryService.getCategoryDetails,
//     calculatePrice: CategoryService.calculatePrice,
//     validateFields: CategoryService.validateFields,
//     searchCategories: CategoryService.searchCategories,
//     getCategoryStats: CategoryService.getCategoryStats,
//     getAllCategoriesByType: CachedCategoryService.getAllCategoriesByType,
//     clearCache: CachedCategoryService.clearCache
//   };
// };





// src/services/categoryService.ts - SIMPLE VERSION FOR DEBUG
import { 
  CategoryMainType, 
  Category, 
  CategoryType, 
  PriceCalculationRequest,
  PriceCalculationResult,
  FieldValidation
} from '@/types/categories';
import { apiService } from './api';

class CategoryService {
  // 🔧 SIMPLE getCategoryTypes sin cache ni debounce
  async getCategoryTypes(): Promise<CategoryMainType[]> {
    console.log('🔄 CategoryService.getCategoryTypes called');
    
    try {
      console.log('📡 Making API call to /categories/types');
      
      const response = await apiService.get('/categories/types');
      
      console.log('📨 Raw API response:', response);
      console.log('📊 Response success:', response?.success);
      console.log('📊 Response data:', response?.data);
      console.log('📊 Data is array:', Array.isArray(response?.data));
      
      if (!response) {
        console.error('❌ No response from API');
        throw new Error('No response from server');
      }
      
      if (!response.success) {
        console.error('❌ API returned success: false', response);
        throw new Error(response.message || 'Failed to fetch category types');
      }
      
      if (!response.data) {
        console.error('❌ No data in response');
        throw new Error('No data in response');
      }
      
      if (!Array.isArray(response.data)) {
        console.error('❌ Data is not an array:', typeof response.data, response.data);
        throw new Error('Response data is not an array');
      }
      
      const types = response.data as CategoryMainType[];
      
      console.log('✅ Category types processed:', types);
      console.log('✅ Types length:', types.length);
      console.log('✅ First type:', types[0]);
      
      return types;
      
    } catch (error) {
      console.error('❌ Error in getCategoryTypes:', error);
      
      // Log more details about the error
      if (typeof error === 'object' && error !== null) {
        if ('response' in error && typeof (error as any).response === 'object') {
          console.error('❌ Response error:', {
            status: (error as any).response.status,
            statusText: (error as any).response.statusText,
            data: (error as any).response.data
          });
        }
        
        if ('request' in error) {
          console.error('❌ Request error (no response):', (error as any).request);
        }
        
        if ('message' in error) {
          console.error('❌ Error message:', (error as any).message);
        }
        
        // Re-throw with more context
        throw new Error(`Failed to load category types: ${(error as any).message || 'Unknown error'}`);
      } else {
        throw new Error('Failed to load category types: Unknown error');
      }
    }
  }

  // 🔧 SIMPLE getCategoriesByType
  async getCategoriesByType(type: CategoryType): Promise<Category[]> {
    console.log(`🔄 getCategoriesByType called for: ${type}`);
    
    try {
      const response = await apiService.get(`/categories?type=${type}&limit=100`);
      
      console.log(`📨 Categories response for ${type}:`, response);
      
      if (!response || !response.success) {
        throw new Error(`Failed to fetch categories for type: ${type}`);
      }
      
      const categories = response.data || [];
      console.log(`✅ Categories loaded for ${type}:`, categories.length);
      
      return categories;
      
    } catch (error) {
      console.error(`❌ Error fetching categories for type ${type}:`, error);
      throw new Error(`Failed to load categories for type: ${type}`);
    }
  }

  // 🔧 SIMPLE getCategoryDetails
  async getCategoryDetails(categoryId: string): Promise<Category> {
    console.log(`🔍 getCategoryDetails called for: ${categoryId}`);
    
    try {
      const response = await apiService.get(`/categories/${categoryId}`);
      
      if (!response || !response.success) {
        throw new Error(`Failed to fetch category details: ${categoryId}`);
      }
      
      console.log(`✅ Category details loaded:`, response.data);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error fetching category details ${categoryId}:`, error);
      throw new Error(`Failed to load category details`);
    }
  }

  // Placeholder methods
  async searchCategories(term: string, type?: CategoryType): Promise<Category[]> {
    console.log(`🔍 searchCategories: "${term}" type: ${type}`);
    return [];
  }

  async calculatePrice(categoryId: string, data: PriceCalculationRequest): Promise<PriceCalculationResult> {
    throw new Error('calculatePrice not implemented in debug version');
  }

  async validateFields(categoryId: string, data: Record<string, any>): Promise<FieldValidation> {
    throw new Error('validateFields not implemented in debug version');
  }

  clearCache(): void {
    console.log('🗑️ clearCache called (no-op in simple version)');
  }

  getCacheInfo(): { size: number; keys: string[] } {
    return { size: 0, keys: [] };
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

// Hook para usar el servicio
export const useCategoryService = () => {
  return categoryService;
};