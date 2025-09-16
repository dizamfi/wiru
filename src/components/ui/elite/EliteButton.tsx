// src/components/ui/elite/EliteButton.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface EliteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const EliteButton = forwardRef<HTMLButtonElement, EliteButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}, ref) => {
  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center',
    'font-semibold rounded-xl',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-4',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    
    // Size variants
    {
      'px-3 py-2 text-sm gap-2': size === 'sm',
      'px-4 py-3 text-base gap-2': size === 'md', 
      'px-6 py-4 text-lg gap-3': size === 'lg',
      'px-8 py-5 text-xl gap-3': size === 'xl',
    },
    
    // Color variants
    {
      // Primary - Black with white text
      'bg-black text-white shadow-lg shadow-black/20 hover:bg-gray-800 hover:shadow-xl hover:shadow-black/30 focus:ring-black/20': 
        variant === 'primary',
      
      // Secondary - White with black text
      'bg-white text-black border-2 border-gray-200 shadow-lg shadow-gray-200/50 hover:bg-gray-50 hover:border-gray-300 hover:shadow-xl focus:ring-gray-200/50': 
        variant === 'secondary',
      
      // Outline - Transparent with border
      'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white focus:ring-black/20': 
        variant === 'outline',
      
      // Ghost - Minimal style
      'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-gray-200/50': 
        variant === 'ghost',
      
      // Danger - Red theme
      'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30 focus:ring-red-500/20': 
        variant === 'danger',
      
      // Success - Green theme (Wiru colors)
      'bg-gradient-to-r from-[#a8c241] to-[#719428] text-white shadow-lg shadow-green-500/20 hover:from-[#9bb73d] hover:to-[#658825] hover:shadow-xl hover:shadow-green-500/30 focus:ring-green-500/20': 
        variant === 'success',
    },
    
    // Full width
    {
      'w-full': fullWidth,
    },
    
    className
  );

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={baseClasses}
      {...props}
    >
      {/* Loading spinner */}
      {loading && <LoadingSpinner />}
      
      {/* Left icon */}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      
      {/* Content */}
      {children && (
        <span className={cn(
          'flex-1 text-center',
          { 'opacity-70': loading }
        )}>
          {children}
        </span>
      )}
      
      {/* Right icon */}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});