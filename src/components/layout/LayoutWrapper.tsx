import React from 'react';
import { Layout } from './Layout';
import { useLayout } from '@/hooks/useLayout';

export const LayoutWrapper: React.FC = () => {
  const { layoutVariant, showFooter } = useLayout();
  
  return (
    <Layout 
      variant={layoutVariant}
      showFooter={showFooter}
    />
  );
};