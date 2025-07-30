// src/components/ui/TabsContent.tsx
import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useTabsContext } from './Tabs';

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  forceMount?: boolean;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
  forceMount = false
}) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected && !forceMount) {
    return null;
  }

  return (
    <div
      className={clsx(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        !isSelected && forceMount && 'hidden',
        className
      )}
      data-state={isSelected ? 'active' : 'inactive'}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export { TabsContent };