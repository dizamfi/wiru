// import React from 'react';
// import { Listbox, Transition } from '@headlessui/react';
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
// import { cn } from '@/utils/cn';

// export interface SelectOption {
//   value: string | number;
//   label: string;
//   disabled?: boolean;
// }

// interface SelectProps {
//   options: SelectOption[];
//   value?: string | number;
//   onChange: (value: string | number) => void;
//   placeholder?: string;
//   label?: string;
//   error?: string;
//   disabled?: boolean;
//   required?: boolean;
//   className?: string;
// }

// export const Select: React.FC<SelectProps> = ({
//   options,
//   value,
//   onChange,
//   placeholder = 'Seleccionar...',
//   label,
//   error,
//   disabled = false,
//   required = false,
//   className,
// }) => {
//   const selectedOption = options.find(option => option.value === value);

//   return (
//     <div className={cn('w-full', className)}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//           {required && <span className="text-danger-500 ml-1">*</span>}
//         </label>
//       )}
      
//       <Listbox value={value} onChange={onChange} disabled={disabled}>
//         <div className="relative">
//           <Listbox.Button
//             className={cn(
//               'relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm',
//               error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
//               disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed'
//             )}
//           >
//             <span className="block truncate">
//               {selectedOption ? selectedOption.label : placeholder}
//             </span>
//             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//               <ChevronUpDownIcon
//                 className="h-5 w-5 text-gray-400"
//                 aria-hidden="true"
//               />
//             </span>
//           </Listbox.Button>

//           <Transition
//             as={React.Fragment}
//             leave="transition ease-in duration-100"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//               {options.map((option) => (
//                 <Listbox.Option
//                   key={option.value}
//                   className={({ active }) =>
//                     cn(
//                       'relative cursor-default select-none py-2 pl-10 pr-4',
//                       active ? 'bg-primary-600 text-white' : 'text-gray-900',
//                       option.disabled && 'opacity-50 cursor-not-allowed'
//                     )
//                   }
//                   value={option.value}
//                   disabled={option.disabled}
//                 >
//                   {({ selected, active }) => (
//                     <>
//                       <span
//                         className={cn(
//                           'block truncate',
//                           selected ? 'font-medium' : 'font-normal'
//                         )}
//                       >
//                         {option.label}
//                       </span>
//                       {selected ? (
//                         <span
//                           className={cn(
//                             'absolute inset-y-0 left-0 flex items-center pl-3',
//                             active ? 'text-white' : 'text-primary-600'
//                           )}
//                         >
//                           <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                         </span>
//                       ) : null}
//                     </>
//                   )}
//                 </Listbox.Option>
//               ))}
//             </Listbox.Options>
//           </Transition>
//         </div>
//       </Listbox>
      
//       {error && (
//         <p className="mt-1 text-sm text-danger-600">{error}</p>
//       )}
//     </div>
//   );
// };



// src/components/ui/Select.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          onChange={handleChange}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          <option value="">Seleccionar...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';