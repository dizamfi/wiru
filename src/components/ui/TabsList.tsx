// src/components/ui/TabsList.tsx
import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-auto',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
};

export { TabsList };