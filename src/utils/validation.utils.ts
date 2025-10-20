// src/utils/validation.utils.ts
import { Category } from '@/types/categories';

export class ValidationUtils {
  /**
   * Validar si un objeto es una categoría válida
   */
  static isValidCategory(item: any): item is Category {
    return (
      item !== null &&
      item !== undefined &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.slug === 'string'
    );
  }

  /**
   * Limpiar y validar array de categorías
   */
  static cleanCategoryArray(data: any): Category[] {
    console.log('🧹 Cleaning category array:', data);
    
    // Si es null o undefined, devolver array vacío
    if (!data) {
      console.warn('⚠️ Received null/undefined data');
      return [];
    }

    // Si ya es un array válido, filtrarlo
    if (Array.isArray(data)) {
      const validCategories = data.filter(item => this.isValidCategory(item));
      
      console.log(`✅ Cleaned array: ${validCategories.length} valid categories from ${data.length} items`);
      return validCategories as Category[];
    }

    // Si tiene propiedad data que es array
    if (data.data && Array.isArray(data.data)) {
      console.log('📦 Found nested data array, extracting...');
      return this.cleanCategoryArray(data.data);
    }

    console.error('❌ Data is not an array:', typeof data, data);
    return [];
  }

  /**
   * Obtener mensaje de error seguro
   */
  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }
    return 'Error desconocido';
  }

  /**
   * Validar que un valor sea array
   */
  static ensureArray<T>(value: any): T[] {
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  }

  /**
   * Validar estructura de respuesta del API
   */
  static validateApiResponse(response: any): boolean {
    return (
      response &&
      typeof response === 'object' &&
      'success' in response &&
      'data' in response
    );
  }
}

// Funciones de utilidad adicionales
export const safeArray = <T>(value: any): T[] => {
  return Array.isArray(value) ? value : [];
};

export const safeArrayLength = (value: any): number => {
  return Array.isArray(value) ? value.length : 0;
};

export const isValidObject = (obj: any): boolean => {
  return obj !== null && obj !== undefined && typeof obj === 'object';
};