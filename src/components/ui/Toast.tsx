// src/components/ui/Toast.tsx
import React from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning';
  onDismiss?: (id: string) => void;
}

const variantStyles = {
  default: {
    container: 'bg-white border-gray-200',
    icon: 'text-blue-500',
    title: 'text-gray-900',
    description: 'text-gray-600'
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    title: 'text-green-800',
    description: 'text-green-700'
  },
  destructive: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    description: 'text-red-700'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    description: 'text-yellow-700'
  }
};

const getIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return CheckCircleIcon;
    case 'destructive':
      return ExclamationCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    default:
      return InformationCircleIcon;
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  onDismiss
}) => {
  const styles = variantStyles[variant];
  const Icon = getIcon(variant);

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg',
        styles.container
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', styles.icon)} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={cn('text-sm font-medium', styles.title)}>
                {title}
              </p>
            )}
            {description && (
              <p className={cn('mt-1 text-sm', styles.description)}>
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                styles.icon,
                'hover:opacity-75'
              )}
              onClick={() => onDismiss?.(id)}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer: React.FC<{
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Transition
            key={toast.id}
            show={true}
            as={React.Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Toast {...toast} onDismiss={onDismiss} />
          </Transition>
        ))}
      </div>
    </div>
  );
};