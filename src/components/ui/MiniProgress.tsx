// src/components/ui/MiniProgress.tsx
import React from 'react';
import { clsx } from 'clsx';

export interface MiniProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const MiniProgress: React.FC<MiniProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  className
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;

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

  return (
    <div className={clsx('w-full h-1 bg-gray-200 rounded-full overflow-hidden', className)}>
      <div
        className={clsx('h-full transition-all duration-300 ease-in-out', getVariantStyles())}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export { MiniProgress };