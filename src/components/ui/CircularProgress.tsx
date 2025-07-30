// src/components/ui/CircularProgress.tsx
import React from 'react';
import { clsx } from 'clsx';

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = false,
  label,
  className
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getVariantColor = () => {
    const colors = {
      default: '#3B82F6', // blue-500
      success: '#10B981', // green-500
      warning: '#F59E0B', // yellow-500
      danger: '#EF4444',  // red-500
      info: '#3B82F6'     // blue-500
    };
    return colors[variant];
  };

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // gray-200
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getVariantColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showLabel && (
          <span className="text-lg font-semibold text-gray-900">
            {Math.round(percentage)}%
          </span>
        )}
        {label && !showLabel && (
          <span className="text-sm font-medium text-gray-700 text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export { CircularProgress };