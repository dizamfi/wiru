// src/components/ui/Tabs.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { clsx } from 'clsx';

// Context for tabs
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

// Main Tabs component
export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className,
  orientation = 'horizontal'
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div 
        className={clsx(
          'tabs-root',
          orientation === 'vertical' && 'flex',
          className
        )}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export { Tabs };