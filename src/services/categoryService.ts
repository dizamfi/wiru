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




// src/services/categoryService.ts

import axios from 'axios';
import { 
  Category, 
  CategoryTreeNode, 
  BreadcrumbItem, 
  CategorySearchResult,
  CategoryStats,
  CategoryFilters 
} from '@/types/categories';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class CategoryService {
  private apiClient = axios.create({
    baseURL: `${API_BASE_URL}/categories`,
    timeout: 10000
  });

  constructor() {
    // Interceptor para incluir token de autenticación si existe
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejo de errores
    this.apiClient.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('CategoryService Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error en el servicio de categorías');
      }
    );
  }

  /**
   * Obtener árbol completo de categorías
   */
  async getCategoryTree(type?: string): Promise<CategoryTreeNode[]> {
    const params: any = {};
    if (type) params.type = type;

    const response = await this.apiClient.get('/tree', { params });
    return response.data;
  }

  /**
   * Obtener categorías raíz
   */
  async getRootCategories(type?: string): Promise<Category[]> {
    const params: any = {};
    if (type) params.type = type;

    const response = await this.apiClient.get('/root', { params });
    return response.data;
  }

  /**
   * Obtener hijos directos de una categoría
   */
  async getCategoryChildren(categoryId: string): Promise<Category[]> {
    const response = await this.apiClient.get(`/${categoryId}/children`);
    return response.data;
  }

  /**
   * Obtener categoría por ID
   */
  async getCategoryById(
    categoryId: string, 
    options: { includeChildren?: boolean; includeBreadcrumb?: boolean } = {}
  ): Promise<CategoryTreeNode> {
    const params: any = {};
    if (options.includeChildren) params.includeChildren = 'true';
    if (options.includeBreadcrumb) params.includeBreadcrumb = 'true';

    const response = await this.apiClient.get(`/${categoryId}`, { params });
    return response.data;
  }

  /**
   * Obtener breadcrumb de una categoría
   */
  async getCategoryBreadcrumb(categoryId: string): Promise<BreadcrumbItem[]> {
    const response = await this.apiClient.get(`/${categoryId}/breadcrumb`);
    return response.data;
  }

  /**
   * Obtener solo categorías finales (seleccionables)
   */
  async getLeafCategories(type?: string): Promise<Category[]> {
    const params: any = {};
    if (type) params.type = type;

    const response = await this.apiClient.get('/leaf', { params });
    return response.data;
  }

  /**
   * Buscar categorías
   */
  async searchCategories(
    query: string, 
    options: { type?: string; leafOnly?: boolean } = {}
  ): Promise<CategorySearchResult[]> {
    const params: any = { q: query };
    if (options.type) params.type = options.type;
    if (options.leafOnly) params.leafOnly = 'true';

    const response = await this.apiClient.get('/search', { params });
    return response.data;
  }

  /**
   * Validar si una categoría puede ser seleccionada
   */
  async validateCategorySelection(categoryId: string): Promise<{ valid: boolean; message?: string }> {
    try {
      const category = await this.getCategoryById(categoryId);
      
      if (!category.isLeaf) {
        return {
          valid: false,
          message: 'Debe seleccionar una subcategoría específica'
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        message: 'Categoría no encontrada o no disponible'
      };
    }
  }

  /**
   * Filtrar categorías por criterios
   */
  filterCategories(categories: Category[], filters: CategoryFilters): Category[] {
    return categories.filter(category => {
      // Filtro por tipo
      if (filters.type && category.type !== filters.type) {
        return false;
      }

      // Filtro solo hojas
      if (filters.leafOnly && !category.isLeaf) {
        return false;
      }

      // Filtro por imágenes
      if (filters.hasImages && category.images.length === 0) {
        return false;
      }

      // Filtro por rango de precios
      if (filters.priceRange && category.pricePerKg) {
        const [min, max] = filters.priceRange;
        if (category.pricePerKg < min || category.pricePerKg > max) {
          return false;
        }
      }

      // Filtro por query de búsqueda
      if (filters.query) {
        const query = filters.query.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.description?.toLowerCase().includes(query) ||
          category.slug.includes(query)
        );
      }

      return true;
    });
  }

  /**
   * Construir path de categorías desde ID
   */
  async buildCategoryPath(categoryId: string): Promise<Category[]> {
    const breadcrumb = await this.getCategoryBreadcrumb(categoryId);
    const path: Category[] = [];

    for (const item of breadcrumb) {
      const category = await this.getCategoryById(item.id);
      path.push(category);
    }

    return path;
  }

  /**
   * Obtener siguiente nivel de selección
   */
  async getNextLevel(currentPath: Category[]): Promise<Category[]> {
    if (currentPath.length === 0) {
      return this.getRootCategories('DISMANTLED_DEVICES');
    }

    const lastCategory = currentPath[currentPath.length - 1];
    
    if (lastCategory.isLeaf) {
      return []; // Ya llegó al final
    }

    return this.getCategoryChildren(lastCategory.id);
  }

  /**
   * Verificar si el path está completo (llega a una hoja)
   */
  isPathComplete(path: Category[]): boolean {
    if (path.length === 0) return false;
    return path[path.length - 1].isLeaf;
  }

  /**
   * Obtener información de pricing para una categoría
   */
  getCategoryPricing(category: Category): {
    pricePerKg?: number;
    estimatedValue: (weight: number) => number;
    hasFixedPrice: boolean;
  } {
    return {
      pricePerKg: category.pricePerKg,
      estimatedValue: (weight: number) => category.pricePerKg ? category.pricePerKg * weight : 0,
      hasFixedPrice: !!category.pricePerKg
    };
  }

  /**
   * Cache simple para mejorar rendimiento
   */
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  private getCacheKey(method: string, params: any): string {
    return `${method}-${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Limpiar cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Instancia singleton
export const categoryService = new CategoryService();
export default categoryService;