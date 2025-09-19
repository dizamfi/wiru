// src/hooks/useCategoryValidation.ts

import { useState, useCallback } from 'react';
import { Category } from '@/types/categories';
import categoryService from '@/services/categoryService';

export const useCategoryValidation = () => {
  const [validating, setValidating] = useState(false);

  const validateCategory = useCallback(async (category: Category): Promise<{
    valid: boolean;
    message?: string;
    warnings?: string[];
  }> => {
    try {
      setValidating(true);
      
      const result = await categoryService.validateCategorySelection(category.id);
      const warnings: string[] = [];
      
      // Validaciones adicionales
      if (!category.pricePerKg) {
        warnings.push('Esta categoría no tiene precio establecido. El valor se determinará durante la verificación.');
      }
      
      if (category.images.length === 0) {
        warnings.push('No hay imágenes de referencia disponibles para esta categoría.');
      }
      
      if (category.minWeight && category.minWeight > 10) {
        warnings.push(`Esta categoría requiere un peso mínimo de ${category.minWeight}kg.`);
      }

      return {
        ...result,
        warnings: warnings.length > 0 ? warnings : undefined
      };
    } catch (err) {
      console.error('Error validating category:', err);
      return {
        valid: false,
        message: 'Error al validar la categoría'
      };
    } finally {
      setValidating(false);
    }
  }, []);

  const validateCategoryPath = useCallback((path: Category[]): {
    valid: boolean;
    message?: string;
  } => {
    if (path.length === 0) {
      return {
        valid: false,
        message: 'Debe seleccionar una categoría'
      };
    }

    const lastCategory = path[path.length - 1];
    
    if (!lastCategory.isLeaf) {
      return {
        valid: false,
        message: 'Debe seleccionar una subcategoría específica'
      };
    }

    return { valid: true };
  }, []);

  return {
    validating,
    validateCategory,
    validateCategoryPath
  };
};