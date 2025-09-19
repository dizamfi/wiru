// src/hooks/useCategoryPricing.ts

import { useMemo } from 'react';
import { Category } from '@/types/categories';

export const useCategoryPricing = (category: Category | null) => {
  const pricing = useMemo(() => {
    if (!category) {
      return {
        hasPrice: false,
        pricePerKg: 0,
        estimateValue: () => 0,
        formatPrice: () => 'No disponible'
      };
    }

    return {
      hasPrice: !!category.pricePerKg,
      pricePerKg: category.pricePerKg || 0,
      minWeight: category.minWeight,
      maxWeight: category.maxWeight,
      estimateValue: (weight: number) => {
        if (!category.pricePerKg) return 0;
        return category.pricePerKg * weight;
      },
      formatPrice: (weight?: number) => {
        if (!category.pricePerKg) return 'No disponible';
        
        if (weight) {
          const total = category.pricePerKg * weight;
          return `${total.toFixed(2)} (${weight}kg × ${category.pricePerKg}/kg)`;
        }
        
        return `${category.pricePerKg}/kg`;
      },
      getWeightRecommendation: () => {
        if (category.minWeight && category.maxWeight) {
          return `Recomendado: ${category.minWeight}kg - ${category.maxWeight}kg`;
        } else if (category.minWeight) {
          return `Peso mínimo: ${category.minWeight}kg`;
        } else if (category.maxWeight) {
          return `Peso máximo: ${category.maxWeight}kg`;
        }
        return null;
      }
    };
  }, [category]);

  return pricing;
};