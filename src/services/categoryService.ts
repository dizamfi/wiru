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
//       return response.data.data.data;
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
//       return response.data.data.data;
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
//       return response.data.data.data;
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
//       return response.data.data.data;
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
//       return response.data.data.data;
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
//       return response.data.data.data;
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
//       return response.data.data.data;
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




// // src/services/categoryService.ts

// import axios from 'axios';
// import { 
//   Category, 
//   CategoryTreeNode, 
//   BreadcrumbItem, 
//   CategorySearchResult,
//   CategoryStats,
//   CategoryFilters 
// } from '@/types/categories';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// class CategoryService {
//   private apiClient = axios.create({
//     baseURL: `${API_BASE_URL}/categories`,
//     timeout: 10000
//   });

//   constructor() {
//     // Interceptor para incluir token de autenticación si existe
//     this.apiClient.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Interceptor para manejo de errores
//     this.apiClient.interceptors.response.use(
//       (response) => response.data,
//       (error) => {
//         console.error('CategoryService Error:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Error en el servicio de categorías');
//       }
//     );
//   }

//   /**
//    * Obtener árbol completo de categorías
//    */
//   async getCategoryTree(type?: string): Promise<CategoryTreeNode[]> {
//     const params: any = {};
//     if (type) params.type = type;

//     const response = await this.apiClient.get('/tree', { params });
//     return response.data.data;
//   }

//   /**
//    * Obtener categorías raíz
//    */
//   async getRootCategories(type?: string): Promise<Category[]> {
//     const params: any = {};
//     if (type) params.type = type;

//     const response = await this.apiClient.get('/root', { params });
//     return response.data.data;
//   }

//   /**
//    * Obtener hijos directos de una categoría
//    */
//   async getCategoryChildren(categoryId: string): Promise<Category[]> {
//     const response = await this.apiClient.get(`/${categoryId}/children`);
//     return response.data.data;
//   }

//   /**
//    * Obtener categoría por ID
//    */
//   async getCategoryById(
//     categoryId: string, 
//     options: { includeChildren?: boolean; includeBreadcrumb?: boolean } = {}
//   ): Promise<CategoryTreeNode> {
//     const params: any = {};
//     if (options.includeChildren) params.includeChildren = 'true';
//     if (options.includeBreadcrumb) params.includeBreadcrumb = 'true';

//     const response = await this.apiClient.get(`/${categoryId}`, { params });
//     return response.data.data;
//   }

//   /**
//    * Obtener breadcrumb de una categoría
//    */
//   async getCategoryBreadcrumb(categoryId: string): Promise<BreadcrumbItem[]> {
//     const response = await this.apiClient.get(`/${categoryId}/breadcrumb`);
//     return response.data.data;
//   }

//   /**
//    * Obtener solo categorías finales (seleccionables)
//    */
//   async getLeafCategories(type?: string): Promise<Category[]> {
//     const params: any = {};
//     if (type) params.type = type;

//     const response = await this.apiClient.get('/leaf', { params });
//     return response.data.data;
//   }

//   /**
//    * Buscar categorías
//    */
//   async searchCategories(
//     query: string, 
//     options: { type?: string; leafOnly?: boolean } = {}
//   ): Promise<CategorySearchResult[]> {
//     const params: any = { q: query };
//     if (options.type) params.type = options.type;
//     if (options.leafOnly) params.leafOnly = 'true';

//     const response = await this.apiClient.get('/search', { params });
//     return response.data.data;
//   }

//   /**
//    * Validar si una categoría puede ser seleccionada
//    */
//   async validateCategorySelection(categoryId: string): Promise<{ valid: boolean; message?: string }> {
//     try {
//       const category = await this.getCategoryById(categoryId);
      
//       if (!category.isLeaf) {
//         return {
//           valid: false,
//           message: 'Debe seleccionar una subcategoría específica'
//         };
//       }

//       return { valid: true };
//     } catch (error) {
//       return {
//         valid: false,
//         message: 'Categoría no encontrada o no disponible'
//       };
//     }
//   }

//   /**
//    * Filtrar categorías por criterios
//    */
//   filterCategories(categories: Category[], filters: CategoryFilters): Category[] {
//     return categories.filter(category => {
//       // Filtro por tipo
//       if (filters.type && category.type !== filters.type) {
//         return false;
//       }

//       // Filtro solo hojas
//       if (filters.leafOnly && !category.isLeaf) {
//         return false;
//       }

//       // Filtro por imágenes
//       if (filters.hasImages && category.images.length === 0) {
//         return false;
//       }

//       // Filtro por rango de precios
//       if (filters.priceRange && category.pricePerKg) {
//         const [min, max] = filters.priceRange;
//         if (category.pricePerKg < min || category.pricePerKg > max) {
//           return false;
//         }
//       }

//       // Filtro por query de búsqueda
//       if (filters.query) {
//         const query = filters.query.toLowerCase();
//         return (
//           category.name.toLowerCase().includes(query) ||
//           category.description?.toLowerCase().includes(query) ||
//           category.slug.includes(query)
//         );
//       }

//       return true;
//     });
//   }

//   /**
//    * Construir path de categorías desde ID
//    */
//   async buildCategoryPath(categoryId: string): Promise<Category[]> {
//     const breadcrumb = await this.getCategoryBreadcrumb(categoryId);
//     const path: Category[] = [];

//     for (const item of breadcrumb) {
//       const category = await this.getCategoryById(item.id);
//       path.push(category);
//     }

//     return path;
//   }

//   /**
//    * Obtener siguiente nivel de selección
//    */
//   async getNextLevel(currentPath: Category[]): Promise<Category[]> {
//     if (currentPath.length === 0) {
//       return this.getRootCategories('DISMANTLED_DEVICES');
//     }

//     const lastCategory = currentPath[currentPath.length - 1];
    
//     if (lastCategory.isLeaf) {
//       return []; // Ya llegó al final
//     }

//     return this.getCategoryChildren(lastCategory.id);
//   }

//   /**
//    * Verificar si el path está completo (llega a una hoja)
//    */
//   isPathComplete(path: Category[]): boolean {
//     if (path.length === 0) return false;
//     return path[path.length - 1].isLeaf;
//   }

//   /**
//    * Obtener información de pricing para una categoría
//    */
//   getCategoryPricing(category: Category): {
//     pricePerKg?: number;
//     estimatedValue: (weight: number) => number;
//     hasFixedPrice: boolean;
//   } {
//     return {
//       pricePerKg: category.pricePerKg,
//       estimatedValue: (weight: number) => category.pricePerKg ? category.pricePerKg * weight : 0,
//       hasFixedPrice: !!category.pricePerKg
//     };
//   }

//   /**
//    * Cache simple para mejorar rendimiento
//    */
//   private cache = new Map<string, { data: any; timestamp: number }>();
//   private CACHE_TTL = 5 * 60 * 1000; // 5 minutos

//   private getCacheKey(method: string, params: any): string {
//     return `${method}-${JSON.stringify(params)}`;
//   }

//   private getFromCache<T>(key: string): T | null {
//     const cached = this.cache.get(key);
//     if (!cached) return null;

//     if (Date.now() - cached.timestamp > this.CACHE_TTL) {
//       this.cache.delete(key);
//       return null;
//     }

//     return cached.data as T;
//   }

//   private setCache(key: string, data: any): void {
//     this.cache.set(key, {
//       data,
//       timestamp: Date.now()
//     });
//   }

//   /**
//    * Limpiar cache
//    */
//   clearCache(): void {
//     this.cache.clear();
//   }
// }

// // Instancia singleton
// export const categoryService = new CategoryService();
// export default categoryService;





// // src/services/categoryService.ts - Actualizado para llamadas directas
// import axios from 'axios';
// import { 
//   Category, 
//   CategoryTreeNode, 
//   BreadcrumbItem, 
//   CategorySearchResult,
//   CategoryStats,
//   CategoryFilters 
// } from '@/types/categories';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// class CategoryService {
//   private apiClient = axios.create({
//     baseURL: `${API_BASE_URL}/categories`,
//     timeout: 10000
//   });

//   constructor() {
//     // Interceptor para incluir token de autenticación si existe
//     this.apiClient.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Interceptor para manejo de errores
//     this.apiClient.interceptors.response.use(
//       (response) => {
//         // Debug: Log de la respuesta completa
//         console.log('🔍 API Response Structure:', {
//           status: response.status,
//           data: response.data,
//           headers: response.headers
//         });

//         // El backend envía: { success: true, data: [...], message: "..." }
//         // Extraer solo los datos si la estructura es correcta
//         if (response.data && response.data.success && response.data.data !== undefined) {
//           return response.data.data.data; // Devolver solo el array de datos
//         }
        
//         // Si la respuesta no tiene la estructura esperada, devolver tal como está
//         return response.data.data;
//       },
//       (error) => {
//         console.error('CategoryService Error:', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'Error en el servicio de categorías');
//       }
//     );
//   }

//   /**
//    * 🚀 NUEVO: Obtener hijos directos de una categoría específica
//    * Este método salta el GET /root y va directo a la categoría
//    */
//   async getCategoryChildren(categoryId: string): Promise<Category[]> {
//     console.log(`🎯 Loading children for category: ${categoryId}`);
    
//     try {
//       const response = await this.apiClient.get(`/${categoryId}/children`);
      
//       console.log('✅ Raw response received:', response);
//       console.log('📊 Categories data type:', typeof response);
//       console.log('📋 Categories array length:', Array.isArray(response) ? response.length : 'Not an array');
      
//       // Validar que la respuesta sea un array
//       if (!Array.isArray(response)) {
//         console.warn('⚠️ Response is not an array:', response);
//         return [];
//       }
      
//       console.log('🎉 Successfully loaded categories:', response.length);
//       return response.data.data;
      
//     } catch (error) {
//       console.error('❌ Error in getCategoryChildren:', error);
//       throw error;
//     }
//   }

//   /**
//    * Obtener categorías raíz (mantener para compatibilidad)
//    */
//   async getRootCategories(type?: string): Promise<Category[]> {
//     const params: any = {};
//     if (type) params.type = type;

//     console.log('🌳 Loading root categories with params:', params);
//     const response = await this.apiClient.get('/root', { params });
//     return response.data;
//   }

//   /**
//    * Obtener árbol completo de categorías
//    */
//   async getCategoryTree(type?: string): Promise<CategoryTreeNode[]> {
//     const params: any = {};
//     if (type) params.type = type;

//     const response = await this.apiClient.get('/tree', { params });
//     return response.data;
//   }

//   /**
//    * Obtener categoría por ID con opciones
//    */
//   async getCategoryById(
//     categoryId: string, 
//     options: { 
//       includeChildren?: boolean; 
//       includeBreadcrumb?: boolean;
//       includeImages?: boolean;
//     } = {}
//   ): Promise<{
//     category: Category;
//     children?: Category[];
//     breadcrumb?: BreadcrumbItem[];
//   }> {
//     const params: any = {};
//     if (options.includeChildren) params.includeChildren = true;
//     if (options.includeBreadcrumb) params.includeBreadcrumb = true;
//     if (options.includeImages) params.includeImages = true;

//     const response = await this.apiClient.get(`/${categoryId}`, { params });
//     return response.data;
//   }

//   /**
//    * Obtener breadcrumb/path de una categoría
//    */
//   async getCategoryBreadcrumb(categoryId: string): Promise<BreadcrumbItem[]> {
//     const response = await this.apiClient.get(`/${categoryId}/breadcrumb`);
//     return response.data;
//   }

//   /**
//    * Buscar categorías
//    */
//   async searchCategories(
//     query: string, 
//     filters: CategoryFilters = {}
//   ): Promise<CategorySearchResult[]> {
//     const params: any = { q: query, ...filters };
    
//     const response = await this.apiClient.get('/search', { params });
//     return response.data;
//   }

//   /**
//    * Obtener categorías de tipo específico (todas, no solo raíz)
//    */
//   async getCategoriesByType(type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES'): Promise<Category[]> {
//     const response = await this.apiClient.get('/leaf', { 
//       params: { type } 
//     });
//     return response.data;
//   }

//   /**
//    * Obtener solo categorías finales (seleccionables)
//    */
//   async getLeafCategories(type?: string): Promise<Category[]> {
//     const params: any = {};
//     if (type) params.type = type;

//     const response = await this.apiClient.get('/leaf', { params });
//     return response.data;
//   }

//   /**
//    * Calcular precio estimado basado en categoría y condiciones
//    */
//   calculateEstimatedPrice(
//     category: Category,
//     weight: number,
//     condition: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' | 'FAIR' | 'POOR' = 'GOOD'
//   ): number {
//     if (!category.pricePerKg) return 0;

//     // Factores de ajuste según condición
//     const conditionMultipliers = {
//       EXCELLENT: 1.0,
//       VERY_GOOD: 0.85,
//       GOOD: 0.70,
//       FAIR: 0.50,
//       POOR: 0.30
//     };

//     const basePrice = category.pricePerKg * weight;
//     const multiplier = conditionMultipliers[condition];
    
//     return Math.round(basePrice * multiplier * 100) / 100;
//   }

//   /**
//    * Validar si una categoría puede ser seleccionada
//    */
//   validateCategorySelection(category: Category): { valid: boolean; message?: string } {
//     if (!category.isLeaf) {
//       return { 
//         valid: false, 
//         message: 'Debes seleccionar una categoría específica' 
//       };
//     }

//     if (category.status !== 'ACTIVE') {
//       return { 
//         valid: false, 
//         message: 'Esta categoría no está disponible actualmente' 
//       };
//     }

//     if (!category.pricePerKg || category.pricePerKg <= 0) {
//       return { 
//         valid: false, 
//         message: 'No hay precio disponible para esta categoría' 
//       };
//     }

//     return { valid: true };
//   }

//   /**
//    * Obtener estadísticas de una categoría
//    */
//   async getCategoryStats(categoryId: string): Promise<CategoryStats> {
//     const response = await this.apiClient.get(`/${categoryId}/stats`);
//     return response.data;
//   }

//   /**
//    * Obtener categorías populares/trending
//    */
//   async getPopularCategories(
//     type?: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES',
//     limit: number = 10
//   ): Promise<Category[]> {
//     const params: any = { limit };
//     if (type) params.type = type;

//     const response = await this.apiClient.get('/popular', { params });
//     return response.data;
//   }

//   /**
//    * 🆕 Método específico para SellPage - Carga directa de categorías por tipo
//    */
//   async getDirectCategoriesForSelling(type: 'COMPLETE_DEVICES' | 'DISMANTLED_DEVICES'): Promise<{
//     rootCategory: Category;
//     children: Category[];
//   }> {
//     // IDs hardcodeados - deberían venir de configuración o API
//     const rootIds = {
//       'COMPLETE_DEVICES': 'cmfr2mc1z00010py8ljs9os94',
//       'DISMANTLED_DEVICES': 'cmfr2mc1z00020py8ljs9os95'
//     };

//     const rootId = rootIds[type];
    
//     try {
//       // Cargar información del root y sus hijos en paralelo
//       const [rootInfo, children] = await Promise.all([
//         this.getCategoryById(rootId),
//         this.getCategoryChildren(rootId)
//       ]);

//       return {
//         rootCategory: rootInfo.category,
//         children: children
//       };
//     } catch (error) {
//       console.error(`Error loading direct categories for ${type}:`, error);
//       throw new Error(`No se pudieron cargar las categorías de ${type}`);
//     }
//   }

//   /**
//    * Cache simple para mejorar performance
//    */
//   private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

//   private getCacheKey(method: string, ...args: any[]): string {
//     return `${method}_${args.join('_')}`;
//   }

//   private setCache(key: string, data: any, ttlMinutes: number = 5): void {
//     this.cache.set(key, {
//       data,
//       timestamp: Date.now(),
//       ttl: ttlMinutes * 60 * 1000
//     });
//   }

//   private getCache(key: string): any | null {
//     const cached = this.cache.get(key);
//     if (!cached) return null;

//     const isExpired = Date.now() - cached.timestamp > cached.ttl;
//     if (isExpired) {
//       this.cache.delete(key);
//       return null;
//     }

//     return cached.data;
//   }

//   /**
//    * Versión con cache de getCategoryChildren
//    */
//   async getCategoryChildrenCached(categoryId: string): Promise<Category[]> {
//     const cacheKey = this.getCacheKey('children', categoryId);
//     const cached = this.getCache(cacheKey);
    
//     if (cached) {
//       console.log(`📦 Using cached children for category: ${categoryId}`);
//       return cached;
//     }

//     const children = await this.getCategoryChildren(categoryId);
//     this.setCache(cacheKey, children, 10); // Cache por 10 minutos
    
//     return children;
//   }

//   /**
//    * Limpiar cache
//    */
//   clearCache(): void {
//     this.cache.clear();
//     console.log('🗑️ Category cache cleared');
//   }

//   /**
//    * Obtener estimación de precio rápida sin validaciones
//    */
//   getQuickPriceEstimate(
//     pricePerKg: number, 
//     weight: number, 
//     condition: string = 'GOOD'
//   ): { min: number; max: number; estimated: number } {
//     const conditionRanges = {
//       'EXCELLENT': { min: 0.9, max: 1.0 },
//       'VERY_GOOD': { min: 0.8, max: 0.9 },
//       'GOOD': { min: 0.6, max: 0.8 },
//       'FAIR': { min: 0.4, max: 0.6 },
//       'POOR': { min: 0.2, max: 0.4 }
//     };

//     const range = conditionRanges[condition as keyof typeof conditionRanges] || conditionRanges.GOOD;
//     const basePrice = pricePerKg * weight;

//     return {
//       min: Math.round(basePrice * range.min * 100) / 100,
//       max: Math.round(basePrice * range.max * 100) / 100,
//       estimated: Math.round(basePrice * ((range.min + range.max) / 2) * 100) / 100
//     };
//   }

//   /**
//    * Obtener información de precios para mostrar rangos
//    */
//   getPriceRange(category: Category, weightRange: [number, number] = [0.5, 5]): {
//     minPrice: number;
//     maxPrice: number;
//     avgPrice: number;
//   } {
//     if (!category.pricePerKg) return { minPrice: 0, maxPrice: 0, avgPrice: 0 };

//     const [minWeight, maxWeight] = weightRange;
//     const pricePerKg = category.pricePerKg;

//     // Considerando el rango de condiciones (30% - 100%)
//     const minConditionMultiplier = 0.30; // POOR condition
//     const maxConditionMultiplier = 1.0;  // EXCELLENT condition

//     const minPrice = Math.round(pricePerKg * minWeight * minConditionMultiplier * 100) / 100;
//     const maxPrice = Math.round(pricePerKg * maxWeight * maxConditionMultiplier * 100) / 100;
//     const avgPrice = Math.round((minPrice + maxPrice) / 2 * 100) / 100;

//     return { minPrice, maxPrice, avgPrice };
//   }

//   /**
//    * Validar peso según categoría
//    */
//   validateWeight(category: Category, weight: number): { valid: boolean; message?: string } {
//     if (weight <= 0) {
//       return { valid: false, message: 'El peso debe ser mayor a 0' };
//     }

//     if (category.minWeight && weight < category.minWeight) {
//       return { 
//         valid: false, 
//         message: `El peso mínimo para esta categoría es ${category.minWeight}kg` 
//       };
//     }

//     if (category.maxWeight && weight > category.maxWeight) {
//       return { 
//         valid: false, 
//         message: `El peso máximo para esta categoría es ${category.maxWeight}kg` 
//       };
//     }

//     return { valid: true };
//   }

//   /**
//    * Obtener sugerencias de categorías similares
//    */
//   async getSimilarCategories(categoryId: string, limit: number = 5): Promise<Category[]> {
//     try {
//       const response = await this.apiClient.get(`/${categoryId}/similar`, { 
//         params: { limit } 
//       });
//       return response.data;
//     } catch (error) {
//       console.log('Similar categories not available:', error);
//       return [];
//     }
//   }

//   /**
//    * Obtener estimación de tiempo de procesamiento
//    */
//   getProcessingTimeEstimate(category: Category): {
//     evaluation: string;
//     payment: string;
//     total: string;
//   } {
//     // Tiempos base según tipo de categoría
//     const baseTime = {
//       'COMPLETE_DEVICES': {
//         evaluation: '1-2 días hábiles',
//         payment: '24 horas',
//         total: '2-3 días hábiles'
//       },
//       'DISMANTLED_DEVICES': {
//         evaluation: '2-4 horas',
//         payment: '24 horas', 
//         total: '1-2 días hábiles'
//       }
//     };

//     return baseTime[category.type] || baseTime['COMPLETE_DEVICES'];
//   }

//   /**
//    * Formatear información de categoría para display
//    */
//   formatCategoryForDisplay(category: Category): {
//     displayName: string;
//     shortDescription: string;
//     priceRange: string;
//     condition: string;
//   } {
//     const priceRange = this.getPriceRange(category);
    
//     return {
//       displayName: category.name,
//       shortDescription: category.description || 'Sin descripción disponible',
//       priceRange: priceRange.maxPrice > 0 
//         ? `${priceRange.minPrice} - ${priceRange.maxPrice}`
//         : 'Precio no disponible',
//       condition: category.status === 'ACTIVE' ? 'Disponible' : 'No disponible'
//     };
//   }

//   /**
//    * Métodos para manejo de imágenes
//    */
//   async uploadCategoryImages(categoryId: string, images: File[]): Promise<string[]> {
//     // Este método debería integrar con el servicio de upload
//     // Por ahora retorna URLs mock
//     const uploadedUrls = images.map((file, index) => 
//       `https://api.example.com/uploads/${categoryId}_${index}_${Date.now()}.jpg`
//     );
    
//     console.log('🖼️ Mock upload of images:', uploadedUrls);
//     return uploadedUrls;
//   }

//   /**
//    * Obtener categorías por ubicación (si aplica geolocalización)
//    */
//   async getCategoriesByLocation(
//     lat?: number, 
//     lng?: number, 
//     radius: number = 50
//   ): Promise<Category[]> {
//     try {
//       const params: any = { radius };
//       if (lat && lng) {
//         params.lat = lat;
//         params.lng = lng;
//       }

//       const response = await this.apiClient.get('/location', { params });
//       return response.data;
//     } catch (error) {
//       console.log('Location-based categories not available:', error);
//       return [];
//     }
//   }

//   /**
//    * Reportar problema con categoría
//    */
//   async reportCategoryIssue(
//     categoryId: string, 
//     issue: {
//       type: 'wrong_price' | 'wrong_description' | 'missing_image' | 'other';
//       description: string;
//       userEmail?: string;
//     }
//   ): Promise<boolean> {
//     try {
//       await this.apiClient.post(`/${categoryId}/report`, issue);
//       return true;
//     } catch (error) {
//       console.error('Error reporting category issue:', error);
//       return false;
//     }
//   }

//   /**
//    * Obtener métricas de rendimiento del servicio
//    */
//   getPerformanceMetrics(): {
//     cacheHitRate: number;
//     avgResponseTime: number;
//     errorRate: number;
//   } {
//     // Mock metrics - en producción esto vendría de un sistema de monitoreo
//     return {
//       cacheHitRate: 0.75,
//       avgResponseTime: 250, // ms
//       errorRate: 0.02
//     };
//   }

//   /**
//    * Configuración dinámica del servicio
//    */
//   updateConfiguration(config: {
//     cacheTTL?: number;
//     timeout?: number;
//     retries?: number;
//   }): void {
//     if (config.timeout) {
//       this.apiClient.defaults.timeout = config.timeout;
//     }
    
//     console.log('🔧 CategoryService configuration updated:', config);
//   }
// }

// // Crear instancia singleton del servicio
// export const categoryService = new CategoryService();

// // Exportar clase para casos especiales
// export default CategoryService;

// // Tipos de utilidad exportados
// export type PriceEstimate = {
//   min: number;
//   max: number;
//   estimated: number;
// };

// export type ValidationResult = {
//   valid: boolean;
//   message?: string;
// };

// export type ProcessingTime = {
//   evaluation: string;
//   payment: string;
//   total: string;
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
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Interceptor para incluir token de autenticación
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('📤 Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`
        });
        
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para manejo de respuestas
    this.apiClient.interceptors.response.use(
      (response) => {
        console.log('📥 Response received:', {
          status: response.status,
          data: response.data,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          hasSuccess: response.data?.success,
          hasData: response.data?.data !== undefined
        });
        
        // El backend envía: { success: true, data: [...], message: "..." }
        if (response.data && response.data.success && response.data.data !== undefined) {
          const extractedData = response.data.data;
          console.log('✅ Extracted data:', {
            type: typeof extractedData,
            isArray: Array.isArray(extractedData),
            length: Array.isArray(extractedData) ? extractedData.length : 'N/A',
            sample: Array.isArray(extractedData) ? extractedData[0] : extractedData
          });
          
          return extractedData; // Devolver directamente el array
        }
        
        console.warn('⚠️ Unexpected response structure, returning raw data');
        return response.data;
      },
      (error) => {
        console.error('❌ Response error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || error.message || 'Error en el servicio de categorías';
        throw new Error(errorMessage);
      }
    );
  }

  /**
   * Obtener hijos directos de una categoría específica
   */
  async getCategoryChildren(categoryId: string): Promise<Category[]> {
    console.log(`🎯 [getCategoryChildren] Loading children for: ${categoryId}`);
    
    try {
      // El interceptor ya extrae response.data.data y devuelve el array directamente
      const categories = await this.apiClient.get(`/${categoryId}/children`);
      
      console.log('✅ [getCategoryChildren] Categories received:', {
        type: typeof categories,
        isArray: Array.isArray(categories),
        length: Array.isArray(categories) ? categories.length : 'N/A',
        firstItem: Array.isArray(categories) && categories.length > 0 ? categories[0] : null
      });
      
      // Validar que sea un array
      if (!Array.isArray(categories)) {
        console.error('❌ [getCategoryChildren] Response is not an array:', categories);
        throw new Error('La respuesta del servidor no es un array de categorías');
      }
      
      console.log(`🎉 [getCategoryChildren] Successfully loaded ${categories.length} categories`);
      return categories;
      
    } catch (error) {
      console.error('❌ [getCategoryChildren] Error:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías raíz
   */
  async getRootCategories(type?: string): Promise<Category[]> {
    const params: any = {};
    if (type) params.type = type;

    console.log('🌳 Loading root categories with params:', params);
    const categories = await this.apiClient.get('/root', { params });
    return Array.isArray(categories) ? categories : [];
  }

  /**
   * Obtener árbol completo de categorías
   */
  async getCategoryTree(type?: string): Promise<CategoryTreeNode[]> {
    const params: any = {};
    if (type) params.type = type;

    const tree = await this.apiClient.get('/tree', { params });
    return Array.isArray(tree) ? tree : [];
  }

  /**
   * Obtener categoría por ID
   */
  async getCategoryById(
    categoryId: string, 
    options: { 
      includeChildren?: boolean; 
      includeBreadcrumb?: boolean;
      includeImages?: boolean;
    } = {}
  ): Promise<any> {
    const params: any = {};
    if (options.includeChildren) params.includeChildren = 'true';
    if (options.includeBreadcrumb) params.includeBreadcrumb = 'true';
    if (options.includeImages) params.includeImages = 'true';

    return await this.apiClient.get(`/${categoryId}`, { params });
  }

  /**
   * Obtener breadcrumb de una categoría
   */
  async getCategoryBreadcrumb(categoryId: string): Promise<BreadcrumbItem[]> {
    const breadcrumb = await this.apiClient.get(`/${categoryId}/breadcrumb`);
    return Array.isArray(breadcrumb) ? breadcrumb : [];
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

    const results = await this.apiClient.get('/search', { params });
    return Array.isArray(results) ? results : [];
  }

  /**
   * Limpiar cache
   */
  clearCache(): void {
    console.log('🧹 Cache cleared');
  }
}

// Exportar instancia singleton
export const categoryService = new CategoryService();
export default categoryService;