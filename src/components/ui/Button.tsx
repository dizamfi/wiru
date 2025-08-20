// import React from 'react';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '@/utils/cn';

// const buttonVariants = cva(
//   'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
//         secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500',
//         outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-primary-500',
//         ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
//         link: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
//         success: 'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500',
//         warning: 'bg-warning-600 text-white hover:bg-warning-700 focus-visible:ring-warning-500',
//         danger: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
//       },
//       size: {
//         sm: 'h-8 px-3 text-xs',
//         default: 'h-10 px-4 py-2',
//         lg: 'h-12 px-6 text-base',
//         xl: 'h-14 px-8 text-lg',
//         icon: 'h-10 w-10',
//       },
//       fullWidth: {
//         true: 'w-full',
//         false: '',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//       fullWidth: false,
//     },
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
//   loading?: boolean;
//   leftIcon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ 
//     className, 
//     variant, 
//     size, 
//     fullWidth,
//     loading = false,
//     leftIcon,
//     rightIcon,
//     children,
//     disabled,
//     ...props 
//   }, ref) => {
//     const isDisabled = disabled || loading;

//     return (
//       <button
//         className={cn(buttonVariants({ variant, size, fullWidth, className }))}
//         ref={ref}
//         disabled={isDisabled}
//         {...props}
//       >
//         {loading && (
//           <svg
//             className="mr-2 h-4 w-4 animate-spin"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             />
//           </svg>
//         )}
//         {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
//         {children}
//         {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
//       </button>
//     );
//   }
// );

// Button.displayName = 'Button';

// export { Button, buttonVariants };




// src/components/ui/Button.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';