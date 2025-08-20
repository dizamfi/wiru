import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={cn(
                  'w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                  sizeClasses[size]
                )}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between mb-4">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="ml-auto rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        <span className="sr-only">Cerrar</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Componentes auxiliares para estructurar el modal
export const ModalContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('text-sm text-gray-500', className)}>
    {children}
  </div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
);



// // src/components/ui/Modal.tsx
// import React from 'react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import { cn } from '@/utils/cn';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   size?: 'sm' | 'md' | 'lg' | 'xl';
//   children: React.ReactNode;
//   className?: string;
// }

// export const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   size = 'md',
//   children,
//   className
// }) => {
//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl'
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex min-h-screen items-center justify-center p-4">
//         {/* Backdrop */}
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//           onClick={onClose}
//         />
        
//         {/* Modal */}
//         <div className={cn(
//           'relative bg-white rounded-lg shadow-xl w-full',
//           sizeClasses[size],
//           className
//         )}>
//           {/* Header */}
//           {title && (
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>
//           )}
          
//           {/* Content */}
//           <div className="p-6">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };