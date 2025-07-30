// src/components/analytics/ExportModal.tsx
import React, { useState } from 'react';
import { Modal, ModalContent, Button, Checkbox } from '@/components/ui';
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PhotoIcon,
  DocumentIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { DateRange, ExportOptions } from '@/types/analytics';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<string>;
  currentPeriod: DateRange;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  currentPeriod
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    sections: ['overview', 'earnings', 'environmental'],
    dateRange: currentPeriod,
    includeCharts: true,
    includeRawData: false,
    includeInsights: true
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const formatOptions = [
    { 
      value: 'pdf', 
      label: 'PDF', 
      icon: <DocumentTextIcon className="h-5 w-5" />,
      description: 'Reporte completo con gráficos'
    },
    { 
      value: 'excel', 
      label: 'Excel', 
      icon: <TableCellsIcon className="h-5 w-5" />,
      description: 'Datos tabulares para análisis'
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: <DocumentIcon className="h-5 w-5" />,
      description: 'Datos sin formato para importar'
    },
    { 
      value: 'png', 
      label: 'PNG', 
      icon: <PhotoIcon className="h-5 w-5" />,
      description: 'Imágenes de gráficos'
    }
  ];

  const sectionOptions = [
    { 
      value: 'overview', 
      label: 'Resumen General',
      description: 'Métricas principales y comparativas'
    },
    { 
      value: 'earnings', 
      label: 'Análisis de Ganancias',
      description: 'Gráficos y tendencias de ingresos'
    },
    { 
      value: 'environmental', 
      label: 'Impacto Ambiental',
      description: 'CO₂ ahorrado, árboles equivalentes'
    },
    { 
      value: 'devices', 
      label: 'Desglose de Dispositivos',
      description: 'Análisis por categorías de productos'
    },
    { 
      value: 'goals', 
      label: 'Progreso de Metas',
      description: 'Estado de objetivos y proyecciones'
    },
    { 
      value: 'referrals', 
      label: 'Programa de Referidos',
      description: 'Actividad y ganancias de referidos'
    }
  ];

  const handleSectionChange = (section: string, checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      sections: checked 
        ? [...prev.sections, section]
        : prev.sections.filter(s => s !== section)
    }));
  };

  const handleExport = async () => {
    if (exportOptions.sections.length === 0) {
      return;
    }

    setIsExporting(true);
    setExportComplete(false);

    try {
      await onExport(exportOptions);
      setExportComplete(true);
      
      // Auto close after successful export
      setTimeout(() => {
        onClose();
        setExportComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => {
    const baseSize = exportOptions.sections.length * 0.5; // MB per section
    const chartSize = exportOptions.includeCharts ? 2 : 0;
    const dataSize = exportOptions.includeRawData ? 1 : 0;
    
    return Math.max(baseSize + chartSize + dataSize, 0.1).toFixed(1);
  };

  const getEstimatedTime = () => {
    const baseTime = exportOptions.sections.length * 2; // seconds per section
    const chartTime = exportOptions.includeCharts ? 5 : 0;
    const dataTime = exportOptions.includeRawData ? 3 : 0;
    
    return Math.max(baseTime + chartTime + dataTime, 5);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exportar Datos de Analytics" size="lg">
      <ModalContent>
        {exportComplete ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Exportación Completada!
            </h3>
            <p className="text-gray-600 mb-4">
              Tu archivo se ha descargado exitosamente
            </p>
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Formato de Exportación</h3>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((format) => (
                  <div
                    key={format.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      exportOptions.format === format.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as any }))}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${
                        exportOptions.format === format.value ? 'text-primary-600' : 'text-gray-500'
                      }`}>
                        {format.icon}
                      </div>
                      <span className="font-medium text-gray-900">{format.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones a Incluir</h3>
              <div className="space-y-3">
                {sectionOptions.map((section) => (
                  <div key={section.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <Checkbox
                      checked={exportOptions.sections.includes(section.value)}
                      onChange={(checked) => handleSectionChange(section.value, checked)}
                    />
                    <div className="flex-1">
                      <label className="font-medium text-gray-900 block mb-1">
                        {section.label}
                      </label>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones Adicionales</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={exportOptions.includeCharts}
                    onChange={(checked) => setExportOptions(prev => ({ ...prev, includeCharts: checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4 text-gray-500" />
                    <label className="text-sm font-medium text-gray-900">
                      Incluir gráficos y visualizaciones
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={exportOptions.includeRawData}
                    onChange={(checked) => setExportOptions(prev => ({ ...prev, includeRawData: checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <TableCellsIcon className="h-4 w-4 text-gray-500" />
                    <label className="text-sm font-medium text-gray-900">
                      Incluir datos sin procesar
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={exportOptions.includeInsights}
                    onChange={(checked) => setExportOptions(prev => ({ ...prev, includeInsights: checked }))}
                  />
                  <div className="flex items-center gap-2">
                    <LightBulbIcon className="h-4 w-4 text-gray-500" />
                    <label className="text-sm font-medium text-gray-900">
                      Incluir insights y recomendaciones
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Range Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Período de Datos</h4>
              <p className="text-sm text-gray-600">
                Desde: {new Date(exportOptions.dateRange.from).toLocaleDateString('es-ES')} hasta {new Date(exportOptions.dateRange.to).toLocaleDateString('es-ES')}
              </p>
            </div>

            {/* Export Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Resumen de Exportación</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DocumentArrowDownIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">
                    Formato: <strong>{formatOptions.find(f => f.value === exportOptions.format)?.label}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">
                    Tiempo estimado: <strong>~{getEstimatedTime()}s</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DocumentIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">
                    Secciones: <strong>{exportOptions.sections.length}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TableCellsIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">
                    Tamaño estimado: <strong>~{getEstimatedSize()} MB</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Preview of selected content */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Vista Previa del Contenido</h4>
              <div className="space-y-2">
                {exportOptions.sections.map(section => {
                  const sectionInfo = sectionOptions.find(s => s.value === section);
                  return (
                    <div key={section} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{sectionInfo?.label}</span>
                    </div>
                  );
                })}
                
                {exportOptions.includeCharts && (
                  <div className="flex items-center gap-2 text-sm">
                    <ChartBarIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">Gráficos incluidos</span>
                  </div>
                )}
                
                {exportOptions.includeRawData && (
                  <div className="flex items-center gap-2 text-sm">
                    <TableCellsIcon className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-700">Datos sin procesar incluidos</span>
                  </div>
                )}
                
                {exportOptions.includeInsights && (
                  <div className="flex items-center gap-2 text-sm">
                    <LightBulbIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700">Insights y recomendaciones incluidos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick presets */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Configuraciones Rápidas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    format: 'pdf',
                    sections: ['overview', 'earnings'],
                    includeCharts: true,
                    includeRawData: false,
                    includeInsights: true
                  }))}
                  className="text-left flex-col items-start h-auto p-3"
                >
                  <span className="font-medium">Reporte Ejecutivo</span>
                  <span className="text-xs text-gray-500">PDF con resumen y ganancias</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    format: 'excel',
                    sections: ['earnings', 'devices', 'goals'],
                    includeCharts: false,
                    includeRawData: true,
                    includeInsights: false
                  }))}
                  className="text-left flex-col items-start h-auto p-3"
                >
                  <span className="font-medium">Datos para Análisis</span>
                  <span className="text-xs text-gray-500">Excel con datos detallados</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    format: 'pdf',
                    sections: ['overview', 'earnings', 'environmental', 'devices', 'goals', 'referrals'],
                    includeCharts: true,
                    includeRawData: true,
                    includeInsights: true
                  }))}
                  className="text-left flex-col items-start h-auto p-3"
                >
                  <span className="font-medium">Reporte Completo</span>
                  <span className="text-xs text-gray-500">Todo incluido</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {exportOptions.sections.length === 0 && (
                  <span className="text-red-500">Selecciona al menos una sección</span>
                )}
                {exportOptions.sections.length > 0 && (
                  <span>
                    {exportOptions.sections.length} sección{exportOptions.sections.length > 1 ? 'es' : ''} seleccionada{exportOptions.sections.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isExporting}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleExport}
                  disabled={exportOptions.sections.length === 0 || isExporting}
                  leftIcon={
                    isExporting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    )
                  }
                >
                  {isExporting ? 'Exportando...' : 'Exportar Datos'}
                </Button>
              </div>
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 font-medium">Generando tu exportación...</span>
                </div>
                <p className="text-sm text-blue-600">
                  Esto puede tomar unos segundos dependiendo de la cantidad de datos seleccionados.
                </p>
                
                {/* Progress steps */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-700">Recopilando datos...</span>
                  </div>
                  {exportOptions.includeCharts && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                      <span className="text-blue-600">Generando gráficos...</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                    <span className="text-blue-600">Creando archivo final...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">💡 Consejos para la exportación</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• El formato PDF es ideal para presentaciones y reportes ejecutivos</li>
                <li>• Excel/CSV son mejores para análisis detallados de datos</li>
                <li>• PNG es perfecto para insertar gráficos en documentos</li>
                <li>• Los datos sin procesar incluyen información granular para análisis avanzados</li>
              </ul>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};