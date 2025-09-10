// src/components/ui/LoadingScreen.tsx
import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-[#a8c241]"></div>
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};