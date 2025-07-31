// src/components/orders/DocumentUploader.tsx
import React, { useState, useCallback } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';

interface DocumentFile {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
  type: 'image' | 'document';
  category: 'verification' | 'before' | 'after' | 'damage' | 'accessory';
  uploadedAt: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

interface DocumentCategory {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface DocumentUploaderProps {
  orderId: string;
  existingFiles?: DocumentFile[];
  allowedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // en bytes
  categories?: DocumentCategory[];
  onFilesChange?: (files: DocumentFile[]) => void;
  onUpload?: (files: File[], category: string) => Promise<void>;
  readonly?: boolean;
  className?: string;
}

const DEFAULT_CATEGORIES: DocumentCategory[] = [
  {
    id: 'verification',
    label: 'Fotos de Verificación',
    description: 'Fotos generales del estado del dispositivo',
    required: true,
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  {
    id: 'before',
    label: 'Estado Inicial',
    description: 'Fotos del dispositivo antes del procesamiento',
    required: false,
    maxFiles: 3,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  {
    id: 'damage',
    label: 'Daños Específicos',
    description: 'Fotos de daños específicos encontrados',
    required: false,
    maxFiles: 3,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  {
    id: 'accessory',
    label: 'Accesorios',
    description: 'Fotos de accesorios incluidos',
    required: false,
    maxFiles: 2,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
];

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  orderId,
  existingFiles = [],
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles = 15,
  maxSize = 5 * 1024 * 1024, // 5MB
  categories = DEFAULT_CATEGORIES,
  onFilesChange,
  onUpload,
  readonly = false,
  className = ''
}) => {
  const [files, setFiles] = useState<DocumentFile[]>(existingFiles);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'verification');
  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([selectedCategory]));

  const selectedCategoryConfig = categories.find(cat => cat.id === selectedCategory);
  const filesInCategory = files.filter(file => file.category === selectedCategory);
  const canAddMore = !readonly && (!selectedCategoryConfig?.maxFiles || filesInCategory.length < selectedCategoryConfig.maxFiles);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (readonly) return;

    // Manejar archivos rechazados
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ errors }) => errors[0]?.message).join(', ');
      toast({
        title: 'Archivos rechazados',
        description: errors,
        variant: 'destructive'
      });
    }

    // Verificar límites
    const currentCount = filesInCategory.length;
    const maxAllowed = selectedCategoryConfig?.maxFiles || maxFiles;
    const available = maxAllowed - currentCount;
    
    if (acceptedFiles.length > available) {
      toast({
        title: 'Límite excedido',
        description: `Solo puedes subir ${available} archivo(s) más en esta categoría`,
        variant: 'destructive'
      });
      acceptedFiles = acceptedFiles.slice(0, available);
    }

    if (acceptedFiles.length === 0) return;

    // Crear objetos DocumentFile temporales
    const newFiles: DocumentFile[] = acceptedFiles.map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      category: selectedCategory as any,
      uploadedAt: new Date().toISOString(),
      isUploading: true,
      uploadProgress: 0
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Subir archivos si hay handler
    if (onUpload) {
      setIsUploading(true);
      try {
        await onUpload(acceptedFiles, selectedCategory);
        
        // Simular progreso de subida
        for (const newFile of newFiles) {
          for (let progress = 0; progress <= 100; progress += 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setFiles(current => 
              current.map(f => 
                f.id === newFile.id 
                  ? { ...f, uploadProgress: progress }
                  : f
              )
            );
          }
        }

        // Marcar como completados
        setFiles(current => 
          current.map(f => 
            newFiles.some(nf => nf.id === f.id)
              ? { ...f, isUploading: false, uploadProgress: 100 }
              : f
          )
        );

        toast({
          title: 'Archivos subidos',
          description: `${acceptedFiles.length} archivo(s) subido(s) exitosamente`,
          variant: 'success'
        });
      } catch (error) {
        // Remover archivos que fallaron
        setFiles(current => current.filter(f => !newFiles.some(nf => nf.id === f.id)));
        
        toast({
          title: 'Error al subir',
          description: 'No se pudieron subir algunos archivos',
          variant: 'destructive'
        });
      } finally {
        setIsUploading(false);
      }
    }
  }, [files, selectedCategory, selectedCategoryConfig, maxFiles, onFilesChange, onUpload, readonly, filesInCategory.length]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    disabled: readonly || !canAddMore || isUploading
  });

  const removeFile = (fileId: string) => {
    if (readonly) return;
    
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    
    toast({
      title: 'Archivo eliminado',
      description: 'El archivo se eliminó correctamente',
      variant: 'success'
    });
  };

  const downloadFile = (file: DocumentFile) => {
    if (file.file) {
      // Archivo local
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    } else {
      // Archivo remoto
      window.open(file.url, '_blank');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryStats = () => {
    return categories.map(category => {
      const categoryFiles = files.filter(f => f.category === category.id);
      const required = category.required && categoryFiles.length === 0;
      const maxReached = category.maxFiles && categoryFiles.length >= category.maxFiles;
      
      return {
        ...category,
        count: categoryFiles.length,
        hasFiles: categoryFiles.length > 0,
        isRequired: required,
        isMaxReached: maxReached
      };
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Documentos y Fotos
            </h3>
            <p className="text-sm text-gray-600">
              {readonly 
                ? 'Archivos subidos para esta orden' 
                : 'Sube fotos y documentos de verificación'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline">
              {files.length} / {maxFiles} archivos
            </Badge>
            {isUploading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <LoadingSpinner size="sm" />
                <span className="text-sm">Subiendo...</span>
              </div>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {getCategoryStats().map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2
                    ${selectedCategory === category.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{category.label}</span>
                  <Badge 
                    size="sm" 
                    variant={category.hasFiles ? 'default' : 'outline'}
                  >
                    {category.count}
                  </Badge>
                  {category.isRequired && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          {selectedCategoryConfig && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedCategoryConfig.description}
              </p>
              {selectedCategoryConfig.maxFiles && (
                <p className="text-xs text-gray-500">
                  Máximo {selectedCategoryConfig.maxFiles} archivo(s)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upload area */}
        {!readonly && canAddMore && (
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive && !isDragReject
                  ? 'border-primary-300 bg-primary-50'
                  : isDragReject
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {isDragActive ? (
                    isDragReject ? (
                      'Tipo de archivo no válido'
                    ) : (
                      'Suelta los archivos aquí'
                    )
                  ) : (
                    <>
                      <span className="font-medium text-primary-600 hover:text-primary-500">
                        Haz clic para subir
                      </span>{' '}
                      o arrastra y suelta
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP hasta {formatFileSize(maxSize)}
                </p>
                {selectedCategoryConfig?.maxFiles && (
                  <p className="text-xs text-gray-500">
                    {filesInCategory.length} / {selectedCategoryConfig.maxFiles} archivos en esta categoría
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Files list */}
        {filesInCategory.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-medium text-gray-900">
              Archivos en {selectedCategoryConfig?.label}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filesInCategory.map((file) => (
                <div
                  key={file.id}
                  className="relative border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    {/* File icon/preview */}
                    <div className="flex-shrink-0">
                      {file.type === 'image' ? (
                        <div className="relative">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          {file.isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                              <div className="text-white text-xs font-medium">
                                {file.uploadProgress}%
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <DocumentIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      
                      {file.isUploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${file.uploadProgress || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {!file.isUploading && (
                        <div className="flex items-center space-x-2 mt-2">
                          <CheckCircleIcon className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Subido</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewFile(file)}
                        className="p-1 h-auto"
                        title="Vista previa"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file)}
                        className="p-1 h-auto"
                        title="Descargar"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </Button>
                      
                      {!readonly && !file.isUploading && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="p-1 h-auto text-red-500 hover:text-red-700"
                          title="Eliminar"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filesInCategory.length === 0 && (
          <div className="text-center py-8 mb-6">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600 mt-2">
              {readonly 
                ? 'No hay archivos en esta categoría'
                : `No hay archivos subidos en ${selectedCategoryConfig?.label}`
              }
            </p>
            {!readonly && selectedCategoryConfig?.required && (
              <p className="text-xs text-red-600 mt-1">
                Esta categoría es obligatoria
              </p>
            )}
          </div>
        )}

        {/* Category overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Resumen por Categorías
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const allExpanded = categories.every(cat => expandedCategories.has(cat.id));
                if (allExpanded) {
                  setExpandedCategories(new Set());
                } else {
                  setExpandedCategories(new Set(categories.map(cat => cat.id)));
                }
              }}
            >
              {expandedCategories.size === categories.length ? 'Contraer todo' : 'Expandir todo'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {getCategoryStats().map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryFiles = files.filter(f => f.category === category.id);
              
              return (
                <div
                  key={category.id}
                  className={`
                    border rounded-lg
                    ${category.hasFiles 
                      ? 'bg-green-50 border-green-200' 
                      : category.isRequired 
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => toggleCategoryExpansion(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {category.hasFiles ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : category.isRequired ? (
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <PhotoIcon className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              category.hasFiles 
                                ? 'text-green-800' 
                                : category.isRequired 
                                  ? 'text-red-800'
                                  : 'text-gray-700'
                            }`}>
                              {category.label}
                            </span>
                            {category.required && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                          </div>
                          {!isExpanded && (
                            <p className="text-xs text-gray-600">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          size="sm"
                          variant={category.hasFiles ? 'default' : 'outline'}
                        >
                          {category.count}
                          {category.maxFiles && ` / ${category.maxFiles}`}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-3 pb-3">
                      <p className="text-xs text-gray-600 mb-3">
                        {category.description}
                      </p>
                      
                      {categoryFiles.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {categoryFiles.map((file) => (
                            <div
                              key={file.id}
                              className="relative cursor-pointer"
                              onClick={() => setPreviewFile(file)}
                            >
                              {file.type === 'image' ? (
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-16 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center">
                                  <DocumentIcon className="h-6 w-6 text-gray-600" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          No hay archivos en esta categoría
                        </p>
                      )}
                      
                      {category.isRequired && !category.hasFiles && (
                        <p className="text-xs text-red-600 mt-2">
                          Esta categoría es obligatoria
                        </p>
                      )}
                      
                      {category.isMaxReached && (
                        <p className="text-xs text-amber-600 mt-2">
                          Límite máximo alcanzado
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* File preview modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-full p-4">
              <Button
                variant="ghost"
                onClick={() => setPreviewFile(null)}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
              
              {previewFile.type === 'image' ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {previewFile.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {formatFileSize(previewFile.size)}
                  </p>
                  <Button
                    onClick={() => downloadFile(previewFile)}
                    leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                  >
                    Descargar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help text */}
        {!readonly && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-2">
              💡 Consejos para mejores fotos
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Usa buena iluminación natural cuando sea posible</li>
              <li>• Toma fotos desde múltiples ángulos</li>
              <li>• Asegúrate de que el dispositivo esté limpio</li>
              <li>• Incluye fotos de números de serie si son visibles</li>
              <li>• Muestra claramente cualquier daño o defecto</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;