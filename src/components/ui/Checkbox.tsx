// src/components/ui/Checkbox.tsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  className,
  id,
  name,
  value,
  required = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const getSizeStyles = () => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      default: {
        base: 'border-gray-300 text-primary-600 focus:ring-primary-500',
        checked: 'bg-primary-600 border-primary-600',
        disabled: 'bg-gray-100 border-gray-300'
      },
      primary: {
        base: 'border-gray-300 text-primary-600 focus:ring-primary-500',
        checked: 'bg-primary-600 border-primary-600',
        disabled: 'bg-gray-100 border-gray-300'
      },
      success: {
        base: 'border-gray-300 text-green-600 focus:ring-green-500',
        checked: 'bg-green-600 border-green-600',
        disabled: 'bg-gray-100 border-gray-300'
      },
      warning: {
        base: 'border-gray-300 text-yellow-600 focus:ring-yellow-500',
        checked: 'bg-yellow-600 border-yellow-600',
        disabled: 'bg-gray-100 border-gray-300'
      },
      danger: {
        base: 'border-gray-300 text-red-600 focus:ring-red-500',
        checked: 'bg-red-600 border-red-600',
        disabled: 'bg-gray-100 border-gray-300'
      }
    };
    return variants[variant];
  };

  const variantStyles = getVariantStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(event.target.checked);
    }
  };

  const getIconSize = () => {
    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };
    return iconSizes[size];
  };

  const checkboxClasses = clsx(
    'rounded border-2 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2',
    getSizeStyles(),
    disabled ? variantStyles.disabled : variantStyles.base,
    (checked || indeterminate) && !disabled && variantStyles.checked,
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    className
  );

  return (
    <div className="flex items-start gap-3">
      <div className="relative flex items-center">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className="sr-only"
          {...props}
        />
        
        <label
          htmlFor={checkboxId}
          className={clsx(
            'relative flex items-center justify-center',
            checkboxClasses
          )}
        >
          {/* Check icon */}
          {checked && !indeterminate && (
            <CheckIcon 
              className={clsx(
                'text-white',
                getIconSize()
              )}
            />
          )}
          
          {/* Indeterminate icon */}
          {indeterminate && (
            <MinusIcon 
              className={clsx(
                'text-white',
                getIconSize()
              )}
            />
          )}
        </label>
      </div>
      
      {/* Label and description */}
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              htmlFor={checkboxId}
              className={clsx(
                'block text-sm font-medium cursor-pointer',
                disabled ? 'text-gray-400' : 'text-gray-900'
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p 
              className={clsx(
                'text-sm mt-1',
                disabled ? 'text-gray-400' : 'text-gray-600'
              )}
              id={ariaDescribedBy}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;

// Checkbox Group component for handling multiple checkboxes
export interface CheckboxGroupProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  disabled?: boolean;
  size?: CheckboxProps['size'];
  variant?: CheckboxProps['variant'];
  className?: string;
  label?: string;
  description?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value = [],
  onChange,
  options,
  disabled = false,
  size = 'md',
  variant = 'default',
  className,
  label,
  description,
  required = false,
  orientation = 'vertical'
}) => {
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;
    
    const newValue = checked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);
    
    onChange(newValue);
  };

  const groupId = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('space-y-3', className)}>
      {/* Group label */}
      {label && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      {/* Checkbox options */}
      <div 
        className={clsx(
          'space-y-3',
          orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0'
        )}
        role="group"
        aria-labelledby={label ? groupId : undefined}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleOptionChange(option.value, checked)}
            disabled={disabled || option.disabled}
            size={size}
            variant={variant}
            label={option.label}
            description={option.description}
            value={option.value}
          />
        ))}
      </div>
    </div>
  );
};

// Example usage component (remove this in production)
export const CheckboxExample: React.FC = () => {
  const [singleChecked, setSingleChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [groupValue, setGroupValue] = React.useState<string[]>(['option1']);

  const groupOptions = [
    { value: 'option1', label: 'Opción 1', description: 'Descripción de la primera opción' },
    { value: 'option2', label: 'Opción 2', description: 'Descripción de la segunda opción' },
    { value: 'option3', label: 'Opción 3', disabled: true },
    { value: 'option4', label: 'Opción 4' }
  ];

  return (
    <div className="space-y-8 p-6 max-w-md mx-auto">
      {/* Single checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Checkboxes Individuales</h3>
        
        <Checkbox
          checked={singleChecked}
          onChange={setSingleChecked}
          label="Checkbox simple"
          description="Esta es una descripción del checkbox"
        />
        
        <Checkbox
          checked={indeterminate}
          indeterminate={true}
          onChange={setIndeterminate}
          label="Estado indeterminado"
        />
        
        <Checkbox
          checked={true}
          disabled
          label="Checkbox deshabilitado"
        />
      </div>

      {/* Different sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Diferentes Tamaños</h3>
        <Checkbox size="sm" checked label="Pequeño" />
        <Checkbox size="md" checked label="Mediano" />
        <Checkbox size="lg" checked label="Grande" />
      </div>

      {/* Different variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variantes de Color</h3>
        <Checkbox variant="primary" checked label="Primario" />
        <Checkbox variant="success" checked label="Éxito" />
        <Checkbox variant="warning" checked label="Advertencia" />
        <Checkbox variant="danger" checked label="Peligro" />
      </div>

      {/* Checkbox group */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Grupo de Checkboxes</h3>
        <CheckboxGroup
          label="Selecciona opciones"
          description="Puedes seleccionar múltiples opciones"
          value={groupValue}
          onChange={setGroupValue}
          options={groupOptions}
        />
      </div>
    </div>
  );
};