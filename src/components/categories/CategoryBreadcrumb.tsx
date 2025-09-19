// src/components/categories/CategoryBreadcrumb.tsx
import React from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { CategoryBreadcrumbProps } from '@/types/categories';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({
  items,
  onItemClick,
  className
}) => {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {items.map((item: typeof items[number], index: number) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onItemClick?.(item, index)}
            className={cn(
              'h-auto p-1 font-normal',
              index === 0 ? 'text-gray-500' : 'text-gray-700',
              index === items.length - 1 ? 'font-medium text-gray-900' : 'hover:text-gray-900'
            )}
          >
            {index === 0 && item.slug === 'inicio' ? (
              <div className="flex items-center space-x-1">
                <HomeIcon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
            ) : (
              item.name
            )}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};


export default CategoryBreadcrumb;