// // src/hooks/useCategories.ts
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { useCategoryService } from '@/services/categoryService';
// import { 
//   CategoryMainType, 
//   Category, 
//   CategoryType, 
//   PriceCalculationRequest,
//   PriceCalculationResult,
//   FieldValidation
// } from '@/types/categories';

// interface UseCategoriesState {
//   // Data
//   types: CategoryMainType[];
//   categories: Record<CategoryType, Category[]>;
//   selectedType?: CategoryType;
//   selectedCategory?: Category;
//   currentCategories: Category[]; // Added property
  
//   // Loading states
//   loading: boolean;
//   loadingTypes: boolean;
//   loadingCategories: boolean;
//   loadingDetails: boolean;
  
//   // Errors
//   error?: string;
  
//   // Search
//   searchResults: Category[];
//   searchLoading: boolean;
//   searchTerm: string;
// }

// interface UseCategoriesActions {
//   // Navigation
//   selectType: (type: CategoryType) => void;
//   selectCategory: (categoryId: string) => void;
//   clearSelection: () => void;
  
//   // Data fetching
//   loadTypes: () => Promise<void>;
//   loadCategoriesByType: (type: CategoryType) => Promise<void>;
//   loadCategoryDetails: (categoryId: string) => Promise<Category>;
  
//   // Search
//   searchCategories: (term: string, type?: CategoryType) => Promise<void>;
//   clearSearch: () => void;
  
//   // Calculations
//   calculatePrice: (categoryId: string, data: PriceCalculationRequest) => Promise<PriceCalculationResult>;
//   validateFields: (categoryId: string, data: Record<string, any>) => Promise<FieldValidation>;
  
//   // Utilities
//   refresh: () => Promise<void>;
//   clearCache: () => void;
// }

// export const useCategories = (): UseCategoriesState & UseCategoriesActions => {
//   const categoryService = useCategoryService();
  
//   const [state, setState] = useState<UseCategoriesState>({
//     types: [],
//     categories: {
//       [CategoryType.COMPLETE_DEVICES]: [],
//       [CategoryType.DISMANTLED_DEVICES]: []
//     },
//     selectedType: undefined,
//     selectedCategory: undefined,
//     currentCategories: [],
//     loading: false,
//     loadingTypes: false,
//     loadingCategories: false,
//     loadingDetails: false,
//     error: undefined,
//     searchResults: [],
//     searchLoading: false,
//     searchTerm: ''
//   });

//   // Load category types
//   const loadTypes = useCallback(async () => {
//     setState(prev => ({ ...prev, loadingTypes: true, error: undefined }));
    
//     try {
//       const types = await categoryService.getCategoryTypes();
//       setState(prev => ({ 
//         ...prev, 
//         types, 
//         loadingTypes: false 
//       }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error loading types',
//         loadingTypes: false 
//       }));
//     }
//   }, [categoryService]);

//   // Load categories by type
//   const loadCategoriesByType = useCallback(async (type: CategoryType) => {
//     setState(prev => ({ ...prev, loadingCategories: true, error: undefined }));
    
//     try {
//       const categories = await categoryService.getCategoriesByType(type);
//       setState(prev => ({
//         ...prev,
//         categories: {
//           ...prev.categories,
//           [type]: categories
//         },
//         loadingCategories: false
//       }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error loading categories',
//         loadingCategories: false 
//       }));
//     }
//   }, [categoryService]);

//   // Load category details
//   const loadCategoryDetails = useCallback(async (categoryId: string): Promise<Category> => {
//     setState(prev => ({ ...prev, loadingDetails: true, error: undefined }));
    
//     try {
//       const category = await categoryService.getCategoryDetails(categoryId);
//       setState(prev => ({ 
//         ...prev, 
//         selectedCategory: category,
//         loadingDetails: false 
//       }));
//       return category;
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error loading category details',
//         loadingDetails: false 
//       }));
//       throw error;
//     }
//   }, [categoryService]);

//   // Search categories
//   const searchCategories = useCallback(async (term: string, type?: CategoryType) => {
//     if (!term.trim()) {
//       setState(prev => ({ ...prev, searchResults: [], searchTerm: '' }));
//       return;
//     }
    
//     setState(prev => ({ 
//       ...prev, 
//       searchLoading: true, 
//       searchTerm: term,
//       error: undefined 
//     }));
    
//     try {
//       const results = await categoryService.searchCategories(term, type);
//       setState(prev => ({ 
//         ...prev, 
//         searchResults: results,
//         searchLoading: false 
//       }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error searching categories',
//         searchLoading: false 
//       }));
//     }
//   }, [categoryService]);

//   // Calculate price
//   const calculatePrice = useCallback(async (
//     categoryId: string, 
//     data: PriceCalculationRequest
//   ): Promise<PriceCalculationResult> => {
//     try {
//       return await categoryService.calculatePrice(categoryId, data);
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error calculating price' 
//       }));
//       throw error;
//     }
//   }, [categoryService]);

//   // Validate fields
//   const validateFields = useCallback(async (
//     categoryId: string, 
//     data: Record<string, any>
//   ): Promise<FieldValidation> => {
//     try {
//       return await categoryService.validateFields(categoryId, data);
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error validating fields' 
//       }));
//       throw error;
//     }
//   }, [categoryService]);

//   // Navigation actions
//   const selectType = useCallback((type: CategoryType) => {
//     setState(prev => ({ 
//       ...prev, 
//       selectedType: type,
//       selectedCategory: undefined 
//     }));
    
//     // Load categories for this type if not already loaded
//     if (state.categories[type].length === 0) {
//       loadCategoriesByType(type);
//     }
//   }, [loadCategoriesByType, state.categories]);

//   const selectCategory = useCallback(async (categoryId: string) => {
//     const existingCategory = Object.values(state.categories)
//       .flat()
//       .find(cat => cat.id === categoryId);
    
//     if (existingCategory) {
//       setState(prev => ({ ...prev, selectedCategory: existingCategory }));
//     }
    
//     // Load full details
//     await loadCategoryDetails(categoryId);
//   }, [loadCategoryDetails, state.categories]);

//   const clearSelection = useCallback(() => {
//     setState(prev => ({ 
//       ...prev, 
//       selectedType: undefined,
//       selectedCategory: undefined 
//     }));
//   }, []);

//   const clearSearch = useCallback(() => {
//     setState(prev => ({ 
//       ...prev, 
//       searchResults: [],
//       searchTerm: '',
//       searchLoading: false 
//     }));
//   }, []);

//   // Utility actions
//   const refresh = useCallback(async () => {
//     setState(prev => ({ ...prev, loading: true, error: undefined }));
    
//     try {
//       await loadTypes();
      
//       // Reload categories for selected type
//       if (state.selectedType) {
//         await loadCategoriesByType(state.selectedType);
//       }
      
//       setState(prev => ({ ...prev, loading: false }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error refreshing data',
//         loading: false 
//       }));
//     }
//   }, [loadTypes, loadCategoriesByType, state.selectedType]);

//   const clearCache = useCallback(() => {
//     categoryService.clearCache();
//   }, [categoryService]);

//   // Load initial data
//   useEffect(() => {
//     loadTypes();
//   }, [loadTypes]);

//   // Computed values
//   const currentCategories = useMemo(() => {
//     return state.selectedType ? state.categories[state.selectedType] : [];
//   }, [state.categories, state.selectedType]);

//   const isLoading = useMemo(() => {
//     return state.loading || state.loadingTypes || state.loadingCategories || state.loadingDetails;
//   }, [state.loading, state.loadingTypes, state.loadingCategories, state.loadingDetails]);

//   return {
//     // State
//     ...state,
//     loading: isLoading,
    
//     // Computed
//     currentCategories,
    
//     // Actions
//     selectType,
//     selectCategory,
//     clearSelection,
//     loadTypes,
//     loadCategoriesByType,
//     loadCategoryDetails,
//     searchCategories,
//     clearSearch,
//     calculatePrice,
//     validateFields,
//     refresh,
//     clearCache
//   };
// };

// // Hook especializado para dispositivos completos
// export const useCompleteDevices = () => {
//   const categories = useCategories();
  
//   useEffect(() => {
//     categories.selectType(CategoryType.COMPLETE_DEVICES);
//   }, []);
  
//   return {
//     ...categories,
//     categories: categories.categories[CategoryType.COMPLETE_DEVICES],
//     loading: categories.loadingCategories || categories.loadingTypes
//   };
// };

// // Hook especializado para dispositivos desarmables
// export const useDismantledDevices = () => {
//   const categories = useCategories();
  
//   useEffect(() => {
//     categories.selectType(CategoryType.DISMANTLED_DEVICES);
//   }, []);
  
//   return {
//     ...categories,
//     categories: categories.categories[CategoryType.DISMANTLED_DEVICES],
//     loading: categories.loadingCategories || categories.loadingTypes
//   };
// };






// // src/hooks/useCategories.ts - FIXED VERSION
// import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import { useCategoryService } from '@/services/categoryService';
// import { 
//   CategoryMainType, 
//   Category, 
//   CategoryType, 
//   PriceCalculationRequest,
//   PriceCalculationResult,
//   FieldValidation
// } from '@/types/categories';

// interface UseCategoriesState {
//   // Data
//   types: CategoryMainType[];
//   categories: Record<CategoryType, Category[]>;
//   selectedType?: CategoryType;
//   selectedCategory?: Category;
//   currentCategories: Category[]; // <-- Added property
  
//   // Loading states
//   loading: boolean;
//   loadingTypes: boolean;
//   loadingCategories: boolean;
//   loadingDetails: boolean;
  
//   // Errors
//   error?: string;
  
//   // Search
//   searchResults: Category[];
//   searchLoading: boolean;
//   searchTerm: string;
// }

// interface UseCategoriesActions {
//   // Navigation
//   selectType: (type: CategoryType) => void;
//   selectCategory: (categoryId: string) => void;
//   clearSelection: () => void;
  
//   // Data fetching
//   loadTypes: () => Promise<void>;
//   loadCategoriesByType: (type: CategoryType) => Promise<void>;
//   loadCategoryDetails: (categoryId: string) => Promise<Category>;
  
//   // Search
//   searchCategories: (term: string, type?: CategoryType) => Promise<void>;
//   clearSearch: () => void;
  
//   // Calculations
//   calculatePrice: (categoryId: string, data: PriceCalculationRequest) => Promise<PriceCalculationResult>;
//   validateFields: (categoryId: string, data: Record<string, any>) => Promise<FieldValidation>;
  
//   // Utilities
//   refresh: () => Promise<void>;
//   clearCache: () => void;
// }

// export const useCategories = (): UseCategoriesState & UseCategoriesActions => {
//   const categoryService = useCategoryService();
  
//   // 🔧 FIX: Usar ref para evitar re-renders innecesarios
//   const isInitialized = useRef(false);
//   const loadingTypes = useRef(false);
  
//   const [state, setState] = useState<UseCategoriesState>({
//     types: [],
//     categories: {
//       [CategoryType.COMPLETE_DEVICES]: [],
//       [CategoryType.DISMANTLED_DEVICES]: []
//     },
//     selectedType: undefined,
//     selectedCategory: undefined,
//     currentCategories: [],
//     loading: false,
//     loadingTypes: false,
//     loadingCategories: false,
//     loadingDetails: false,
//     error: undefined,
//     searchResults: [],
//     searchLoading: false,
//     searchTerm: ''
//   });

//   // 🔧 FIX: Load category types SIN dependencias problemáticas
//   const loadTypes = useCallback(async () => {
//     // Evitar múltiples llamadas simultáneas
//     if (loadingTypes.current) return;
    
//     loadingTypes.current = true;
//     setState(prev => ({ ...prev, loadingTypes: true, error: undefined }));
    
//     try {
//       const types = await categoryService.getCategoryTypes();
//       setState(prev => ({ 
//         ...prev, 
//         types, 
//         loadingTypes: false 
//       }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error loading category types',
//         loadingTypes: false 
//       }));
//     } finally {
//       loadingTypes.current = false;
//     }
//   }, []); // 🔧 SIN categoryService como dependencia

//   // 🔧 FIX: Load categories by type
//   const loadCategoriesByType = useCallback(async (type: CategoryType) => {
//     setState(prev => ({ ...prev, loadingCategories: true, error: undefined }));
    
//     try {
//       const categories = await categoryService.getCategoriesByType(type);
//       setState(prev => ({ 
//         ...prev, 
//         categories: {
//           ...prev.categories,
//           [type]: categories
//         },
//         loadingCategories: false 
//       }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error loading categories',
//         loadingCategories: false 
//       }));
//     }
//   }, []); // 🔧 SIN categoryService como dependencia

//   // Load category details
//   const loadCategoryDetails = useCallback(async (categoryId: string): Promise<Category> => {
//     setState(prev => ({ ...prev, loadingDetails: true, error: undefined }));
    
//     try {
//       const category = await categoryService.getCategoryDetails(categoryId);
//       setState(prev => ({ 
//         ...prev, 
//         selectedCategory: category,
//         loadingDetails: false 
//       }));
//       return category;
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error loading category details',
//         loadingDetails: false 
//       }));
//       throw error;
//     }
//   }, []);

//   // Search categories
//   const searchCategories = useCallback(async (term: string, type?: CategoryType) => {
//     setState(prev => ({ 
//       ...prev, 
//       searchLoading: true, 
//       searchTerm: term, 
//       error: undefined 
//     }));
    
//     try {
//       const results = await categoryService.searchCategories(term, type);
//       setState(prev => ({ 
//         ...prev, 
//         searchResults: results,
//         searchLoading: false 
//       }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error searching categories',
//         searchLoading: false 
//       }));
//     }
//   }, []);

//   // Calculate price
//   const calculatePrice = useCallback(async (
//     categoryId: string, 
//     data: PriceCalculationRequest
//   ): Promise<PriceCalculationResult> => {
//     try {
//       return await categoryService.calculatePrice(categoryId, data);
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error calculating price' 
//       }));
//       throw error;
//     }
//   }, []);

//   // Validate fields
//   const validateFields = useCallback(async (
//     categoryId: string, 
//     data: Record<string, any>
//   ): Promise<FieldValidation> => {
//     try {
//       return await categoryService.validateFields(categoryId, data);
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error validating fields' 
//       }));
//       throw error;
//     }
//   }, []);

//   // Navigation actions
//   const selectType = useCallback((type: CategoryType) => {
//     setState(prev => ({ 
//       ...prev, 
//       selectedType: type,
//       selectedCategory: undefined 
//     }));
    
//     // 🔧 FIX: Solo cargar si no están ya cargadas
//     setState(prev => {
//       if (prev.categories[type].length === 0) {
//         // Llamar loadCategoriesByType de forma async sin bloquear
//         setTimeout(() => {
//           loadCategoriesByType(type);
//         }, 0);
//       }
//       return prev;
//     });
//   }, [loadCategoriesByType]);

//   const selectCategory = useCallback(async (categoryId: string) => {
//     // Buscar en categorías existentes primero
//     const existingCategory = Object.values(state.categories)
//       .flat()
//       .find(cat => cat.id === categoryId);
    
//     if (existingCategory) {
//       setState(prev => ({ ...prev, selectedCategory: existingCategory }));
//     }
    
//     // Cargar detalles completos
//     try {
//       await loadCategoryDetails(categoryId);
//     } catch (error) {
//       console.error('Error loading category details:', error);
//     }
//   }, [loadCategoryDetails, state.categories]);

//   const clearSelection = useCallback(() => {
//     setState(prev => ({ 
//       ...prev, 
//       selectedType: undefined,
//       selectedCategory: undefined 
//     }));
//   }, []);

//   const clearSearch = useCallback(() => {
//     setState(prev => ({ 
//       ...prev, 
//       searchResults: [],
//       searchTerm: '',
//       searchLoading: false 
//     }));
//   }, []);

//   // Utility actions
//   const refresh = useCallback(async () => {
//     setState(prev => ({ ...prev, loading: true, error: undefined }));
    
//     try {
//       await loadTypes();
      
//       // Reload categories for selected type
//       if (state.selectedType) {
//         await loadCategoriesByType(state.selectedType);
//       }
      
//       setState(prev => ({ ...prev, loading: false }));
//     } catch (error) {
//       setState(prev => ({ 
//         ...prev, 
//         error: error instanceof Error ? error.message : 'Error refreshing data',
//         loading: false 
//       }));
//     }
//   }, [loadTypes, loadCategoriesByType, state.selectedType]);

//   const clearCache = useCallback(() => {
//     categoryService.clearCache();
//   }, []);

//   // 🔧 FIX: useEffect SIN dependencias problemáticas
//   useEffect(() => {
//     // Solo cargar una vez al montar
//     if (!isInitialized.current) {
//       isInitialized.current = true;
//       loadTypes().catch(error => {
//         console.error('Failed to load initial category types:', error);
//       });
//     }
//   }, []); // 🔧 Array vacío - solo se ejecuta una vez

//   // Computed values
//   const currentCategories = useMemo(() => {
//     return state.selectedType ? state.categories[state.selectedType] : [];
//   }, [state.categories, state.selectedType]);

//   const isLoading = useMemo(() => {
//     return state.loading || state.loadingTypes || state.loadingCategories || state.loadingDetails;
//   }, [state.loading, state.loadingTypes, state.loadingCategories, state.loadingDetails]);

//   return {
//     // State
//     ...state,
//     loading: isLoading,
    
//     // Computed
//     currentCategories,
    
//     // Actions
//     selectType,
//     selectCategory,
//     clearSelection,
//     loadTypes,
//     loadCategoriesByType,
//     loadCategoryDetails,
//     searchCategories,
//     clearSearch,
//     calculatePrice,
//     validateFields,
//     refresh,
//     clearCache
//   };
// };

// // 🔧 FIX: Hooks especializados SIMPLIFICADOS
// export const useCompleteDevices = () => {
//   const categories = useCategories();
  
//   // 🔧 Solo ejecutar una vez
//   useEffect(() => {
//     if (!categories.selectedType) {
//       categories.selectType(CategoryType.COMPLETE_DEVICES);
//     }
//   }, []); // 🔧 Array vacío
  
//   return {
//     ...categories,
//     categories: categories.categories[CategoryType.COMPLETE_DEVICES],
//     loading: categories.loadingCategories || categories.loadingTypes
//   };
// };

// // Hook especializado para dispositivos desarmables
// export const useDismantledDevices = () => {
//   const categories = useCategories();
  
//   // 🔧 Solo ejecutar una vez
//   useEffect(() => {
//     if (!categories.selectedType) {
//       categories.selectType(CategoryType.DISMANTLED_DEVICES);
//     }
//   }, []); // 🔧 Array vacío
  
//   return {
//     ...categories,
//     categories: categories.categories[CategoryType.DISMANTLED_DEVICES],
//     loading: categories.loadingCategories || categories.loadingTypes
//   };
// };




// src/hooks/useCategories.ts - SIMPLE DEBUG VERSION
import { useState, useEffect, useCallback } from 'react';
import { useCategoryService } from '@/services/categoryService';
import { 
  CategoryMainType, 
  Category, 
  CategoryType, 
  PriceCalculationRequest,
  PriceCalculationResult,
  FieldValidation
} from '@/types/categories';

interface UseCategoriesState {
  // Data
  types: CategoryMainType[];
  categories: Record<CategoryType, Category[]>;
  selectedType?: CategoryType;
  selectedCategory?: Category;
  currentCategories: Category[];
  
  // Loading states
  loading: boolean;
  loadingTypes: boolean;
  loadingCategories: boolean;
  loadingDetails: boolean;
  
  // Errors
  error?: string;
  
  // Search
  searchResults: Category[];
  searchLoading: boolean;
  searchTerm: string;
}

interface UseCategoriesActions {
  selectType: (type: CategoryType) => void;
  selectCategory: (categoryId: string) => void;
  clearSelection: () => void;
  loadTypes: () => Promise<void>;
  loadCategoriesByType: (type: CategoryType) => Promise<void>;
  loadCategoryDetails: (categoryId: string) => Promise<Category>;
  searchCategories: (term: string, type?: CategoryType) => Promise<void>;
  clearSearch: () => void;
  calculatePrice: (categoryId: string, data: PriceCalculationRequest) => Promise<PriceCalculationResult>;
  validateFields: (categoryId: string, data: Record<string, any>) => Promise<FieldValidation>;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

export const useCategories = (): UseCategoriesState & UseCategoriesActions => {
  console.log('🔄 useCategories hook initialized');
  
  const categoryService = useCategoryService();
  
  const [state, setState] = useState<UseCategoriesState>({
    types: [],
    categories: {
      [CategoryType.COMPLETE_DEVICES]: [],
      [CategoryType.DISMANTLED_DEVICES]: []
    },
    selectedType: undefined,
    selectedCategory: undefined,
    currentCategories: [],
    loading: false,
    loadingTypes: false,
    loadingCategories: false,
    loadingDetails: false,
    error: undefined,
    searchResults: [],
    searchLoading: false,
    searchTerm: ''
  });

  // 🔧 SIMPLE loadTypes function
  const loadTypes = useCallback(async () => {
    console.log('🔄 loadTypes called');
    
    // Prevent multiple simultaneous calls
    if (state.loadingTypes) {
      console.log('⏳ loadTypes already running, skipping');
      return;
    }
    
    setState(prev => {
      console.log('📝 Setting loadingTypes: true');
      return { ...prev, loadingTypes: true, error: undefined };
    });
    
    try {
      console.log('🚀 Calling categoryService.getCategoryTypes()');
      const types = await categoryService.getCategoryTypes();
      
      console.log('✅ Types received in hook:', types);
      console.log('📊 Types length:', types?.length);
      console.log('📊 Types is array:', Array.isArray(types));
      
      if (!types) {
        throw new Error('No types received from service');
      }
      
      if (!Array.isArray(types)) {
        throw new Error('Types is not an array');
      }
      
      setState(prev => {
        const newState = { 
          ...prev, 
          types, 
          loadingTypes: false,
          error: undefined
        };
        console.log('📝 Updated state with types:', newState);
        return newState;
      });
      
      console.log('✅ loadTypes completed successfully');
      
    } catch (error) {
      console.error('❌ Error in loadTypes:', error);
      
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error loading category types',
        loadingTypes: false 
      }));
      
      console.error('❌ loadTypes failed with error:', error instanceof Error ? error.message : error);
    }
  }, [categoryService, state.loadingTypes]); // Added state.loadingTypes to deps

  // Load categories by type
  const loadCategoriesByType = useCallback(async (type: CategoryType) => {
    console.log(`🔄 loadCategoriesByType called for: ${type}`);
    
    setState(prev => ({ ...prev, loadingCategories: true, error: undefined }));
    
    try {
      const categories = await categoryService.getCategoriesByType(type);
      setState(prev => ({ 
        ...prev, 
        categories: {
          ...prev.categories,
          [type]: categories
        },
        loadingCategories: false 
      }));
      
      console.log(`✅ Categories loaded for ${type}:`, categories.length);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error loading categories',
        loadingCategories: false 
      }));
      
      console.error(`❌ Error loading categories for ${type}:`, error);
    }
  }, [categoryService]);

  // Other functions (simplified)
  const loadCategoryDetails = useCallback(async (categoryId: string): Promise<Category> => {
    setState(prev => ({ ...prev, loadingDetails: true, error: undefined }));
    
    try {
      const category = await categoryService.getCategoryDetails(categoryId);
      setState(prev => ({ 
        ...prev, 
        selectedCategory: category,
        loadingDetails: false 
      }));
      return category;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error loading category details',
        loadingDetails: false 
      }));
      throw error;
    }
  }, [categoryService]);

  const searchCategories = useCallback(async (term: string, type?: CategoryType) => {
    setState(prev => ({ 
      ...prev, 
      searchLoading: true, 
      searchTerm: term, 
      error: undefined 
    }));
    
    try {
      const results = await categoryService.searchCategories(term, type);
      setState(prev => ({ 
        ...prev, 
        searchResults: results,
        searchLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error searching categories',
        searchLoading: false 
      }));
    }
  }, [categoryService]);

  // Navigation actions
  const selectType = useCallback((type: CategoryType) => {
    console.log(`🎯 selectType called: ${type}`);
    
    setState(prev => ({ 
      ...prev, 
      selectedType: type,
      selectedCategory: undefined,
      currentCategories: prev.categories[type] || []
    }));
    
    // Load categories for this type if not already loaded
    if (state.categories[type].length === 0) {
      console.log(`📥 Loading categories for type: ${type}`);
      loadCategoriesByType(type);
    }
  }, [loadCategoriesByType, state.categories]);

  const selectCategory = useCallback(async (categoryId: string) => {
    console.log(`🎯 selectCategory called: ${categoryId}`);
    
    const existingCategory = Object.values(state.categories)
      .flat()
      .find(cat => cat.id === categoryId);
    
    if (existingCategory) {
      setState(prev => ({ ...prev, selectedCategory: existingCategory }));
    }
    
    try {
      await loadCategoryDetails(categoryId);
    } catch (error) {
      console.error('Error loading category details:', error);
    }
  }, [loadCategoryDetails, state.categories]);

  const clearSelection = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      selectedType: undefined,
      selectedCategory: undefined,
      currentCategories: []
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      searchResults: [],
      searchTerm: '',
      searchLoading: false 
    }));
  }, []);

  // Utility actions (simplified)
  const refresh = useCallback(async () => {
    console.log('🔄 refresh called');
    setState(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      await loadTypes();
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error refreshing data',
        loading: false 
      }));
    }
  }, [loadTypes]);

  const clearCache = useCallback(() => {
    categoryService.clearCache();
  }, [categoryService]);

  // Placeholder functions
  const calculatePrice = useCallback(async (categoryId: string, data: PriceCalculationRequest): Promise<PriceCalculationResult> => {
    return await categoryService.calculatePrice(categoryId, data);
  }, [categoryService]);

  const validateFields = useCallback(async (categoryId: string, data: Record<string, any>): Promise<FieldValidation> => {
    return await categoryService.validateFields(categoryId, data);
  }, [categoryService]);

  // 🔧 Load types on mount
  useEffect(() => {
    console.log('🚀 useCategories useEffect triggered');
    console.log('📊 Current types length:', state.types.length);
    console.log('📊 Currently loading:', state.loadingTypes);
    
    if (state.types.length === 0 && !state.loadingTypes) {
      console.log('📥 Loading initial category types');
      loadTypes().catch(error => {
        console.error('❌ Failed to load initial types:', error);
      });
    }
  }, []); // Empty dependency array - only run on mount

  // Debug logging
  useEffect(() => {
    console.log('📊 State updated:', {
      typesLength: state.types.length,
      loadingTypes: state.loadingTypes,
      error: state.error,
      selectedType: state.selectedType,
      currentCategoriesLength: state.currentCategories.length
    });
  }, [state]);

  return {
    // State
    ...state,
    
    // Actions
    selectType,
    selectCategory,
    clearSelection,
    loadTypes,
    loadCategoriesByType,
    loadCategoryDetails,
    searchCategories,
    clearSearch,
    calculatePrice,
    validateFields,
    refresh,
    clearCache
  };
};