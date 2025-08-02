// src/components/ui/TextArea.tsx

import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
// Update the path below to the actual location of your 'cn' utility function
// Update the path below to the actual location of your 'cn' utility function
import { cn } from '../../utils/cn';

const textareaVariants = cva(
  [
    // Base styles
    'flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm',
    'placeholder:text-gray-500',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
    'resize-vertical',
  ],
  {
    variants: {
      variant: {
        default: [
          'border border-gray-300 bg-white',
          'hover:border-gray-400',
          'focus:border-primary-500 focus-visible:ring-primary-500',
        ],
        filled: [
          'border border-gray-200 bg-gray-50',
          'hover:bg-gray-100 hover:border-gray-300',
          'focus:bg-white focus:border-primary-500 focus-visible:ring-primary-500',
        ],
        outline: [
          'border-2 border-gray-300 bg-transparent',
          'hover:border-gray-400',
          'focus:border-primary-500 focus-visible:ring-primary-500',
        ],
        ghost: [
          'border-0 bg-transparent',
          'hover:bg-gray-100',
          'focus:bg-gray-50 focus-visible:ring-primary-500',
        ],
      },
      size: {
        sm: 'min-h-[60px] px-2 py-1 text-xs',
        default: 'min-h-[80px] px-3 py-2 text-sm',
        lg: 'min-h-[120px] px-4 py-3 text-base',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      resize: 'vertical',
    },
  }
);

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant,
      size,
      resize,
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      fullWidth = true,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;
    const hasError = !!error;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-red-700' : 'text-gray-700'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* TextArea Container */}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={cn(
              textareaVariants({ variant, size, resize }),
              hasError && [
                'border-red-300 text-red-900 placeholder-red-300',
                'focus:border-red-500 focus-visible:ring-red-500',
              ],
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${textareaId}-error` : 
              helperText ? `${textareaId}-helper` : undefined
            }
            {...props}
          />

          {/* Character Count */}
          {(showCount || maxLength) && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {showCount && (
                <span className={cn(
                  maxLength && currentLength > maxLength * 0.9 && 'text-orange-600',
                  maxLength && currentLength >= maxLength && 'text-red-600'
                )}>
                  {currentLength}
                </span>
              )}
              {maxLength && (
                <span>
                  {showCount ? '/' : ''}{maxLength}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {(error || helperText) && (
          <div className="min-h-[1.25rem]">
            {error ? (
              <p
                id={`${textareaId}-error`}
                className="text-sm text-red-600 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            ) : helperText ? (
              <p
                id={`${textareaId}-helper`}
                className="text-sm text-gray-600"
              >
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea, textareaVariants };

// Ejemplo de uso:
/*
// Básico
<TextArea placeholder="Escribe tu mensaje..." />

// Con label y helper text
<TextArea
  label="Descripción"
  placeholder="Describe tu dispositivo..."
  helperText="Incluye detalles sobre el estado y accesorios"
/>

// Con validación
<TextArea
  label="Comentarios"
  placeholder="Comentarios adicionales..."
  error={errors.comments?.message}
  required
/>

// Con contador de caracteres
<TextArea
  label="Notas"
  placeholder="Notas adicionales..."
  maxLength={500}
  showCount
/>

// Diferentes variantes y tamaños
<TextArea variant="filled" size="lg" />
<TextArea variant="outline" resize="none" />
<TextArea variant="ghost" size="sm" />

// Con valor controlado
<TextArea
  value={formData.description}
  onChange={(e) => setFormData({...formData, description: e.target.value})}
/>
*/