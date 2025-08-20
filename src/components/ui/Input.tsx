// import React from 'react';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '@/utils/cn';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// const inputVariants = cva(
//   'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
//   {
//     variants: {
//       variant: {
//         default: 'focus:border-primary-500 focus:ring-primary-500',
//         error: 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
//         success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
//       },
//       size: {
//         sm: 'h-8 px-2 text-xs',
//         default: 'h-10 px-3',
//         lg: 'h-12 px-4 text-base',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// );

// export interface InputProps
//   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
//     VariantProps<typeof inputVariants> {
//   label?: string;
//   error?: string;
//   helperText?: string;
//   leftIcon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
//   showPasswordToggle?: boolean;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({
//     className,
//     variant,
//     size,
//     type = 'text',
//     label,
//     error,
//     helperText,
//     leftIcon,
//     rightIcon,
//     showPasswordToggle = false,
//     ...props
//   }, ref) => {
//     const [showPassword, setShowPassword] = React.useState(false);
//     const [inputType, setInputType] = React.useState(type);

//     // Manejar toggle de contraseña
//     React.useEffect(() => {
//       if (showPasswordToggle && type === 'password') {
//         setInputType(showPassword ? 'text' : 'password');
//       }
//     }, [showPassword, type, showPasswordToggle]);

//     const inputVariantToUse = error ? 'error' : variant;

//     return (
//       <div className="w-full">
//         {label && (
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {label}
//             {props.required && <span className="text-danger-500 ml-1">*</span>}
//           </label>
//         )}
        
//         <div className="relative">
//           {leftIcon && (
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//               {leftIcon}
//             </div>
//           )}
          
//           <input
//             type={inputType}
//             className={cn(
//               inputVariants({ variant: inputVariantToUse, size }),
//               leftIcon && 'pl-10',
//               (rightIcon || (showPasswordToggle && type === 'password')) && 'pr-10',
//               className
//             )}
//             ref={ref}
//             {...props}
//           />
          
//           {showPasswordToggle && type === 'password' && (
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <EyeSlashIcon className="h-4 w-4" />
//               ) : (
//                 <EyeIcon className="h-4 w-4" />
//               )}
//             </button>
//           )}
          
//           {rightIcon && !showPasswordToggle && (
//             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//               {rightIcon}
//             </div>
//           )}
//         </div>
        
//         {error && (
//           <p className="mt-1 text-sm text-danger-600">{error}</p>
//         )}
        
//         {helperText && !error && (
//           <p className="mt-1 text-sm text-gray-500">{helperText}</p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = 'Input';

// export { Input, inputVariants };




// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';