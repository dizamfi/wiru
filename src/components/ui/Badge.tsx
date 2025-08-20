// import React from 'react';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '@/utils/cn';

// const badgeVariants = cva(
//   'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary-100 text-primary-800 border border-primary-200',
//         secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
//         success: 'bg-success-100 text-success-800 border border-success-200',
//         warning: 'bg-warning-100 text-warning-800 border border-warning-200',
//         danger: 'bg-danger-100 text-danger-800 border border-danger-200',
//         outline: 'border border-gray-300 text-gray-700 bg-transparent',
//       },
//       size: {
//         sm: 'px-2 py-0.5 text-xs',
//         default: 'px-2.5 py-0.5 text-xs',
//         lg: 'px-3 py-1 text-sm',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// );

// export interface BadgeProps
//   extends React.HTMLAttributes<HTMLDivElement>,
//     VariantProps<typeof badgeVariants> {}

// function Badge({ className, variant, size, ...props }: BadgeProps) {
//   return (
//     <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
//   );
// }

// export { Badge, badgeVariants };





// src/components/ui/Badge.tsx
import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const variantClasses = {
    default: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 text-gray-700'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
};