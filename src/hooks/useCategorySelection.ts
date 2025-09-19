// src/hooks/useCategorySelection.ts

import { useState, useCallback } from 'react';
import { Category, CategorySelectionState } from '@/types/categories';
import categoryService from '@/services/categoryService';

export const useCategorySelection = () => {
  const [selectionState, setSelectionState] = useState<CategorySelectionState>({
    selectedPath: [],
    availableChildren: [],
    isComplete: false,
    canProceed: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar con categorías raíz
  const initialize = useCallback(async (type: string = 'DISMANTLED_DEVICES') => {
    try {
      setLoading(true);
      setError(null);
      
      const rootCategories = await categoryService.getRootCategories(type);
      
      setSelectionState({
        selectedPath: [],
        availableChildren: rootCategories,
        isComplete: false,
        canProceed: false
      });
    } catch (err) {
      setError('Error al inicializar las categorías');
      console.error('Error initializing categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Seleccionar categoría
  const selectCategory = useCallback(async (category: Category) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPath = [...selectionState.selectedPath, category];
      
      if (category.isLeaf) {
        // Es una categoría final
        setSelectionState({
          selectedPath: newPath,
          currentCategory: category,
          availableChildren: [],
          isComplete: true,
          canProceed: true
        });
      } else {
        // Cargar hijos
        const children = await categoryService.getCategoryChildren(category.id);
        
        setSelectionState({
          selectedPath: newPath,
          currentCategory: category,
          availableChildren: children,
          isComplete: false,
          canProceed: false
        });
      }
    } catch (err) {
      setError('Error al seleccionar la categoría');
      console.error('Error selecting category:', err);
    } finally {
      setLoading(false);
    }
  }, [selectionState.selectedPath]);

  // Retroceder
  const goBack = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectionState.selectedPath.length === 0) {
        return;
      }
      
      if (selectionState.selectedPath.length === 1) {
        // Volver al inicio
        await initialize();
        return;
      }

      // Volver al nivel anterior
      const newPath = selectionState.selectedPath.slice(0, -1);
      const parentCategory = newPath[newPath.length - 1];
  const children = await categoryService.getCategoryChildren(parentCategory.id);

      setSelectionState({
        selectedPath: newPath,
        currentCategory: parentCategory,
        availableChildren: children,
        isComplete: false,
        canProceed: false
      });
    } catch (err) {
      setError('Error al retroceder');
      console.error('Error going back:', err);
    } finally {
      setLoading(false);
    }
  }, [selectionState.selectedPath, initialize]);

  // Navegar a una categoría específica en el breadcrumb
  const navigateToCategory = useCallback(async (category: Category, index: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPath = selectionState.selectedPath.slice(0, index + 1);
      
      if (category.isLeaf) {
        setSelectionState({
          selectedPath: newPath,
          currentCategory: category,
          availableChildren: [],
          isComplete: true,
          canProceed: true
        });
      } else {
        const children = await categoryService.getCategoryChildren(category.id);
        
        setSelectionState({
          selectedPath: newPath,
          currentCategory: category,
          availableChildren: children,
          isComplete: false,
          canProceed: false
        });
      }
    } catch (err) {
      setError('Error al navegar a la categoría');
      console.error('Error navigating to category:', err);
    } finally {
      setLoading(false);
    }
  }, [selectionState.selectedPath]);

  // Resetear selección
  const reset = useCallback(async (type: string = 'DISMANTLED_DEVICES') => {
    await initialize(type);
  }, [initialize]);

  // Seleccionar desde búsqueda
  const selectFromSearch = useCallback(async (category: Category) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir el path completo
      const fullPath = await categoryService.buildCategoryPath(category.id);
      
      setSelectionState({
        selectedPath: fullPath,
        currentCategory: category,
        availableChildren: [],
        isComplete: true,
        canProceed: true
      });
    } catch (err) {
      setError('Error al seleccionar desde búsqueda');
      console.error('Error selecting from search:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    selectionState,
    loading,
    error,
    initialize,
    selectCategory,
    goBack,
    navigateToCategory,
    reset,
    selectFromSearch,
    clearError: () => setError(null)
  };
};