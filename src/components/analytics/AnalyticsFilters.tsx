// src/components/analytics/AnalyticsFilters.tsx
import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Select, Checkbox } from '@/components/ui';
import {
  XMarkIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { DateRange } from '@/types/analytics';

interface AnalyticsFiltersProps {
  onClose: () => void;
  currentPeriod: DateRange;
  onPeriodChange: (period: DateRange) => void;
  onFiltersApply?: (filters: AnalyticsFilterData) => void;
}

interface AnalyticsFilterData {
  dateRange: DateRange;
  categories: string[];
  minOrderValue?: number;
  maxOrderValue?: number;
  includeReferrals: boolean;
  groupBy: 'day' | 'week' | 'month' | 'quarter';
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  onClose,
  currentPeriod,
  onPeriodChange,
  onFiltersApply
}) => {
  const [filters, setFilters] = useState<AnalyticsFilterData>({
    dateRange: currentPeriod,
    categories: [],
    minOrderValue: undefined,
    maxOrderValue: undefined,
    includeReferrals: true,
    groupBy: 'day'
  });

  const categoryOptions = [
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'accessories', label: 'Accesorios' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'audio', label: 'Audio' }
  ];

  const groupByOptions = [
    { value: 'day', label: 'Por día' },
    { value: 'week', label: 'Por semana' },
    { value: 'month', label: 'Por mes' },
    { value: 'quarter', label: 'Por trimestre' }
  ];

  const presetPeriods = [
    { label: 'Últimos 7 días', value: 'week' },
    { label: 'Últimos 30 días', value: 'month' },
    { label: 'Últimos 3 meses', value: 'quarter' },
    { label: 'Último año', value: 'year' },
    { label: 'Personalizado', value: 'custom' }
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handlePresetPeriod = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case 'week':
        from = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        from = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        from = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    const newPeriod: DateRange = {
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
      preset: preset as any
    };

    setFilters(prev => ({ ...prev, dateRange: newPeriod }));
  };

  const handleApplyFilters = () => {
    onPeriodChange(filters.dateRange);
    onFiltersApply?.(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: AnalyticsFilterData = {
      dateRange: currentPeriod,
      categories: [],
      minOrderValue: undefined,
      maxOrderValue: undefined,
      includeReferrals: true,
      groupBy: 'day'
    };
    setFilters(resetFilters);
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.minOrderValue !== undefined ||
    filters.maxOrderValue !== undefined ||
    !filters.includeReferrals ||
    filters.groupBy !== 'day';

  return (
    <Card className="border-l-4 border-l-primary-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Análisis</h3>
            {hasActiveFilters && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                Filtros activos
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            leftIcon={<XMarkIcon className="h-4 w-4" />}
          >
            Cerrar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Date Range */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium text-gray-900">Período de Tiempo</h4>
            </div>

            {/* Preset buttons */}
            <div className="space-y-2">
              {presetPeriods.map((preset) => (
                <Button
                  key={preset.value}
                  variant={filters.dateRange.preset === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresetPeriod(preset.value)}
                  className="w-full justify-start"
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Custom date inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha inicio
                </label>
                <Input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, from: e.target.value, preset: 'custom' }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha fin
                </label>
                <Input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, to: e.target.value, preset: 'custom' }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Categories and Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Categorías</h4>
            
            {/* Category checkboxes */}
            <div className="space-y-3">
              {categoryOptions.map((category) => (
                <div key={category.value} className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.categories.includes(category.value)}
                    onChange={(checked) => handleCategoryChange(category.value, checked)}
                  />
                  <label className="text-sm text-gray-700">
                    {category.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Include referrals */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={filters.includeReferrals}
                  onChange={(checked) => setFilters(prev => ({ ...prev, includeReferrals: checked }))}
                />
                <label className="text-sm text-gray-700">
                  Incluir ganancias de referidos
                </label>
              </div>
            </div>

            {/* Group by */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agrupar datos
              </label>
              <Select
                value={filters.groupBy}
                onChange={(value) => setFilters(prev => ({ ...prev, groupBy: value as any }))}
                options={groupByOptions}
              />
            </div>
          </div>

          {/* Value Ranges */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Rangos de Valor</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor mínimo ($)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filters.minOrderValue || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minOrderValue: e.target.value ? Number(e.target.value) : undefined
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor máximo ($)
                </label>
                <Input
                  type="number"
                  placeholder="999.99"
                  value={filters.maxOrderValue || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    maxOrderValue: e.target.value ? Number(e.target.value) : undefined
                  }))}
                />
              </div>
            </div>

            {/* Quick filters */}
            <div className="pt-4 border-t border-gray-200">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Filtros rápidos</h5>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    minOrderValue: 50,
                    maxOrderValue: undefined 
                  }))}
                  className="w-full justify-start"
                >
                  Órdenes {'>'} $50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    minOrderValue: 100,
                    maxOrderValue: undefined 
                  }))}
                  className="w-full justify-start"
                >
                  Órdenes {'>'} $100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    categories: ['smartphones', 'laptops'],
                    minOrderValue: undefined,
                    maxOrderValue: undefined 
                  }))}
                  className="w-full justify-start"
                >
                  Solo dispositivos principales
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            >
              Limpiar filtros
            </Button>
            {hasActiveFilters && (
              <span className="text-sm text-gray-500">
                {filters.categories.length} categorías, 
                {filters.minOrderValue || filters.maxOrderValue ? ' rango de valores' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              variant="default" 
              onClick={handleApplyFilters}
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};