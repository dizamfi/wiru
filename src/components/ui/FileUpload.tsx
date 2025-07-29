import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';
import { Button } from './Button';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  selectedFiles?: File[];
  maxFiles?: number;
  maxSize?: number; // en bytes
  acceptedTypes?: string[];
  label?: string;
  error?: string;
  multiple?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelect,
  onFileRemove,
  selectedFiles = [],
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  label,
  error,
  multiple = true,
  className,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = maxFiles - selectedFiles.length;
    const filesToAdd = multiple 
      ? acceptedFiles.slice(0, remainingSlots)
      : [acceptedFiles[0]];
    
    onFilesSelect(filesToAdd);
  }, [onFilesSelect, selectedFiles.length, maxFiles, multiple]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple,
    disabled: selectedFiles.length >= maxFiles,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {selectedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragActive && !isDragReject && 'border-primary-500 bg-primary-50',
            isDragReject && 'border-danger-500 bg-danger-50',
            !isDragActive && 'border-gray-300 hover:border-gray-400',
            error && 'border-danger-500'
          )}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {isDragActive ? (
                isDragReject ? (
                  'Tipo de archivo no válido'
                ) : (
                  'Suelta las imágenes aquí'
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
            <p className="text-xs text-gray-500">
              Máximo {maxFiles} imagen{maxFiles > 1 ? 'es' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Archivos seleccionados ({selectedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {onFileRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemove(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};