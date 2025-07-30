// import React from 'react';
// import { cn } from '@/utils/cn';

// interface ProgressBarProps {
//   value: number; // 0-100
//   max?: number;
//   label?: string;
//   showPercentage?: boolean;
//   size?: 'sm' | 'md' | 'lg';
//   variant?: 'default' | 'success' | 'warning' | 'danger';
//   className?: string;
// }

// const sizeClasses = {
//   sm: 'h-1',
//   md: 'h-2',
//   lg: 'h-3',
// };

// const variantClasses = {
//   default: 'bg-primary-600',
//   success: 'bg-success-600',
//   warning: 'bg-warning-600',
//   danger: 'bg-danger-600',
// };

// export const ProgressBar: React.FC<ProgressBarProps> = ({
//   value,
//   max = 100,
//   label,
//   showPercentage = false,
//   size = 'md',
//   variant = 'default',
//   className,
// }) => {
//   const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

//   return (
//     <div className={cn('w-full', className)}>
//       {(label || showPercentage) && (
//         <div className="flex justify-between items-center mb-1">
//           {label && (
//             <span className="text-sm font-medium text-gray-700">{label}</span>
//           )}
//           {showPercentage && (
//             <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
//           )}
//         </div>
//       )}
//       <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
//         <div
//           className={cn('h-full transition-all duration-300 ease-in-out', variantClasses[variant])}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// };



// src/components/ui/ProgressBar.tsx
import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  className,
  showLabel = false,
  label,
  animated = false,
  striped = false
}) => {
  // Ensure value is between 0 and max
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;

  // Get variant styles
  const getVariantStyles = () => {
    const variants = {
      default: 'bg-primary-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500'
    };
    return variants[variant];
  };

  // Get size styles
  const getSizeStyles = () => {
    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3'
    };
    return sizes[size];
  };

  // Get background variant for container
  const getBackgroundVariant = () => {
    const backgrounds = {
      default: 'bg-primary-100',
      success: 'bg-green-100',
      warning: 'bg-yellow-100',
      danger: 'bg-red-100',
      info: 'bg-blue-100'
    };
    return backgrounds[variant];
  };

  return (
    <div className={clsx('w-full', className)}>
      {/* Label */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar Container */}
      <div
        className={clsx(
          'w-full rounded-full overflow-hidden',
          getSizeStyles(),
          getBackgroundVariant()
        )}
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        {/* Progress Bar Fill */}
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            getVariantStyles(),
            striped && 'bg-stripe-pattern',
            animated && striped && 'animate-stripe'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { ProgressBar };