import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number; // Para variant="text"
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  className,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-gray-300 rounded';
  
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, 'h-4')}
            style={{
              width: width || (index === lines - 1 ? '75%' : '100%'),
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full', className)}
        style={{
          width: width || height || '40px',
          height: height || width || '40px',
        }}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(baseClasses, className)}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
      {...props}
    />
  );
};

// Componentes de skeleton predefinidos
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 border border-gray-200 rounded-lg bg-white', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className 
}) => (
  <div className={cn('border border-gray-200 rounded-lg overflow-hidden', className)}>
    {/* Header */}
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width="80px" height="16px" />
        ))}
      </div>
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="p-4 border-b border-gray-200 last:border-b-0">
        <div className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="80px" height="16px" />
          ))}
        </div>
      </div>
    ))}
  </div>
);