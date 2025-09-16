// src/components/ui/elite/EliteInput.tsx - VERSIÓN MEJORADA
import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

interface EliteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'floating';
  showPasswordToggle?: boolean;
}

export const EliteInput = forwardRef<HTMLInputElement, EliteInputProps>(({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  variant = 'floating',
  showPasswordToggle = false,
  className,
  type: propType = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const type = showPasswordToggle && propType === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : propType;

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  const inputClasses = cn(
    // Base styles - SIN backdrop-blur
    'w-full transition-all duration-300 ease-out',
    'border-2 rounded-xl font-medium',
    'bg-white', // Fondo blanco sólido
    
    // Variant-specific styles
    {
      // Default variant
      'px-4 py-4 text-base': variant === 'default',
      'pl-12 pr-4 py-4 text-base': variant === 'default' && leftIcon,
      'pl-4 pr-12 py-4 text-base': variant === 'default' && (rightIcon || showPasswordToggle),
      'pl-12 pr-12 py-4 text-base': variant === 'default' && leftIcon && (rightIcon || showPasswordToggle),
      
      // Floating variant
      'px-4 pt-6 pb-2 text-base': variant === 'floating',
      'pl-12 pr-4 pt-6 pb-2 text-base': variant === 'floating' && leftIcon,
      'pl-4 pr-12 pt-6 pb-2 text-base': variant === 'floating' && (rightIcon || showPasswordToggle),
      'pl-12 pr-12 pt-6 pb-2 text-base': variant === 'floating' && leftIcon && (rightIcon || showPasswordToggle),
    },
    
    // State styles - Más sutiles y profesionales
    {
      // Normal state
      'border-gray-200 text-gray-900 placeholder-gray-400': !error && !success && !isFocused,
      
      // Focused state - Más elegante
      'border-gray-900 ring-4 ring-gray-900/5 shadow-lg shadow-gray-900/10': 
        !error && !success && isFocused,
      
      // Error state
      'border-red-400 ring-4 ring-red-400/10 shadow-lg shadow-red-400/20': error,
      
      // Success state  
      'border-green-400 ring-4 ring-green-400/10 shadow-lg shadow-green-400/20': success,
    },
    
    // Hover effects - Más sutiles
    'hover:border-gray-300 hover:shadow-md hover:shadow-gray-300/30',
    
    // Focus effects
    'focus:outline-none',
    
    className
  );

  const labelClasses = cn(
    'block font-semibold text-sm transition-all duration-300',
    {
      // Default variant
      'text-gray-700 mb-2': variant === 'default',
      
      // Floating variant - Mejorado para mejor legibilidad
      'absolute left-4 transition-all duration-300 pointer-events-none select-none': variant === 'floating',
      'text-xs text-gray-500 top-2 font-medium': variant === 'floating' && (isFocused || hasValue),
      'text-base text-gray-400 top-4': variant === 'floating' && !isFocused && !hasValue,
      
      // Ajustes con íconos
      'left-12': variant === 'floating' && leftIcon,
      
      // Error state
      'text-red-600': error,
      
      // Success state
      'text-green-600': success,
    }
  );

  return (
    <div className="w-full">
      <div className="relative">
        {/* Label */}
        {label && (
          <label className={labelClasses}>
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {leftIcon}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          
          {/* Right Icon or Password Toggle */}
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Help text or error - Más elegante */}
      {(error || success || hint) && (
        <div className="mt-3 flex items-start space-x-2">
          {error && (
            <>
              <div className="flex-shrink-0 w-1 h-1 bg-red-500 rounded-full mt-2"></div>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </>
          )}
          
          {success && !error && (
            <>
              <div className="flex-shrink-0 w-1 h-1 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm text-green-600 font-medium">{success}</p>
            </>
          )}
          
          {hint && !error && !success && (
            <>
              <div className="flex-shrink-0 w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
              <p className="text-sm text-gray-500">{hint}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
});