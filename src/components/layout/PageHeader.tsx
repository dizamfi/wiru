import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '@/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ name: string; href: string; current?: boolean }>;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'compact';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showBreadcrumbs = true,
  breadcrumbItems,
  action,
  children,
  className,
  variant = 'default',
}) => {
  return (
    <div className={cn(
      'bg-white border-b border-gray-200',
      variant === 'compact' && 'pb-4',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          variant === 'compact' ? 'py-4' : 'py-6'
        )}>
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <Breadcrumbs 
              items={breadcrumbItems} 
              className="mb-4"
            />
          )}
          
          {/* Header content */}
          <div className={cn(
            variant === 'centered' 
              ? 'text-center' 
              : 'md:flex md:items-center md:justify-between'
          )}>
            <div className="flex-1 min-w-0">
              <h1 className={cn(
                'font-bold leading-7 text-gray-900 sm:truncate',
                variant === 'compact' ? 'text-xl' : 'text-2xl sm:text-3xl'
              )}>
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            
            {/* Action buttons */}
            {action && (
              <div className={cn(
                'mt-4 flex',
                variant === 'centered' ? 'justify-center' : 'md:mt-0 md:ml-4'
              )}>
                {action}
              </div>
            )}
          </div>
          
          {/* Additional content */}
          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};