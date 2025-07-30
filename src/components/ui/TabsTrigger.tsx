// src/components/ui/TabsTrigger.tsx
import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useTabsContext } from './Tabs';

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  disabled = false
}) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm',
        isSelected && 'bg-white text-gray-950 shadow-sm',
        !isSelected && 'hover:bg-gray-200 hover:text-gray-900',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      data-state={isSelected ? 'active' : 'inactive'}
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      type="button"
    >
      {children}
    </button>
  );
};

export { TabsTrigger };