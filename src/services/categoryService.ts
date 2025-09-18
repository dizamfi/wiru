// src/services/categoryService.ts
import  api  from './api';
import { 
  CategoryMainType, 
  Category, 
  CategoryType, 
  PriceCalculationRequest, 
  PriceCalculationResult,
  FieldValidation,
  CategoryStats
} from '@/types/categories';

export class CategoryService {
  
  /**
   * Obtener tipos principales de categorías
   */
  static async getCategoryTypes(): Promise<CategoryMainType[]> {
    try {
      const response = await api.get('/categories/types');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category types:', error);
      throw new Error('No se pudieron cargar los tipos de categorías');
    }
  }

  /**
   * Obtener categorías por tipo
   */
  static async getCategoriesByType(type: CategoryType): Promise<Category[]> {
    try {
      const response = await api.get(`/categories/by-type/${type}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching categories for type ${type}:`, error);
      throw new Error(`No se pudieron cargar las categorías de ${type}`);
    }
  }

  /**
   * Obtener detalles de una categoría específica
   */
  static async getCategoryDetails(categoryId: string): Promise<Category> {
    try {
      const response = await api.get(`/categories/${categoryId}/details`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching category details for ${categoryId}:`, error);
      throw new Error('No se pudieron cargar los detalles de la categoría');
    }
  }

  /**
   * Calcular precio estimado
   */
  static async calculatePrice(
    categoryId: string, 
    data: PriceCalculationRequest
  ): Promise<PriceCalculationResult> {
    try {
      const response = await api.post(`/categories/${categoryId}/calculate-price`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error calculating price for category ${categoryId}:`, error);
      throw new Error('No se pudo calcular el precio estimado');
    }
  }

  /**
   * Validar campos de categoría
   */
  static async validateFields(
    categoryId: string,
    data: Record<string, any>
  ): Promise<FieldValidation> {
    try {
      const response = await api.post(`/categories/${categoryId}/validate`, data);
      return response.data.data;
    } catch (error) {
      console.error(`Error validating fields for category ${categoryId}:`, error);
      throw new Error('No se pudo validar la información');
    }
  }

  /**
   * Buscar categorías
   */
  static async searchCategories(
    searchTerm: string, 
    type?: CategoryType
  ): Promise<Category[]> {
    try {
      const params = new URLSearchParams({
        q: searchTerm,
        ...(type && { type })
      });
      
      const response = await api.get(`/categories/search?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw new Error('No se pudieron buscar las categorías');
    }
  }

  /**
   * Obtener estadísticas de categorías
   */
  static async getCategoryStats(type?: CategoryType): Promise<CategoryStats> {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      
      const response = await api.get(`/categories/stats?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw new Error('No se pudieron cargar las estadísticas');
    }
  }

  /**
   * Obtener todas las categorías organizadas por tipo
   */
  static async getAllCategoriesByType(): Promise<Record<CategoryType, Category[]>> {
    try {
      const [completeDevices, dismantledDevices] = await Promise.all([
        this.getCategoriesByType(CategoryType.COMPLETE_DEVICES),
        this.getCategoriesByType(CategoryType.DISMANTLED_DEVICES)
      ]);

      return {
        [CategoryType.COMPLETE_DEVICES]: completeDevices,
        [CategoryType.DISMANTLED_DEVICES]: dismantledDevices
      };
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw new Error('No se pudieron cargar todas las categorías');
    }
  }
}

// Cache para optimizar requests
class CategoryCache {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  static set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  static clear(): void {
    this.cache.clear();
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }
}

// Servicio con cache
export class CachedCategoryService extends CategoryService {
  
  /**
   * Obtener tipos principales con cache
   */
  static async getCategoryTypes(): Promise<CategoryMainType[]> {
    const cacheKey = 'category-types';
    const cached = CategoryCache.get<CategoryMainType[]>(cacheKey);
    
    if (cached) return cached;
    
    const data = await super.getCategoryTypes();
    CategoryCache.set(cacheKey, data);
    return data;
  }

  /**
   * Obtener categorías por tipo con cache
   */
  static async getCategoriesByType(type: CategoryType): Promise<Category[]> {
    const cacheKey = `categories-${type}`;
    const cached = CategoryCache.get<Category[]>(cacheKey);
    
    if (cached) return cached;
    
    const data = await super.getCategoriesByType(type);
    CategoryCache.set(cacheKey, data);
    return data;
  }

  /**
   * Obtener detalles de categoría con cache
   */
  static async getCategoryDetails(categoryId: string): Promise<Category> {
    const cacheKey = `category-details-${categoryId}`;
    const cached = CategoryCache.get<Category>(cacheKey);
    
    if (cached) return cached;
    
    const data = await super.getCategoryDetails(categoryId);
    CategoryCache.set(cacheKey, data);
    return data;
  }

  /**
   * Limpiar cache cuando sea necesario
   */
  static clearCache(): void {
    CategoryCache.clear();
  }
}

// Hook personalizado para usar el servicio de categorías
export const useCategoryService = () => {
  return {
    getCategoryTypes: CachedCategoryService.getCategoryTypes,
    getCategoriesByType: CachedCategoryService.getCategoriesByType,
    getCategoryDetails: CachedCategoryService.getCategoryDetails,
    calculatePrice: CategoryService.calculatePrice,
    validateFields: CategoryService.validateFields,
    searchCategories: CategoryService.searchCategories,
    getCategoryStats: CategoryService.getCategoryStats,
    getAllCategoriesByType: CachedCategoryService.getAllCategoriesByType,
    clearCache: CachedCategoryService.clearCache
  };
};