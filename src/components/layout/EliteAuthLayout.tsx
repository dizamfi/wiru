// src/components/layout/EliteAuthLayout.tsx - VERSIÓN MEJORADA
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EliteAuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackToHome?: boolean;
}

export const EliteAuthLayout: React.FC<EliteAuthLayoutProps> = ({ 
  children, 
  title,
  subtitle,
  showBackToHome = true 
}) => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background gradients - MUY sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8">
          {/* Logo Simple - Solo SVG */}
          <Link 
            to="/" 
            className="transition-all duration-300 hover:scale-105"
          >
            {/* AQUÍ VAS A PONER TU LOGO SVG - Reemplaza todo este div */}
            <div className="w-10 h-10">
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                fill="none"
              >
                {/* Placeholder - REEMPLAZAR con tu logo SVG */}
                <circle cx="50" cy="50" r="40" fill="#a8c241"/>
                <text x="50" y="55" textAnchor="middle" fontSize="24" fill="white" fontWeight="bold">W</text>
              </svg>
            </div>
          </Link>
          
          {/* Back to Home */}
          {showBackToHome && (
            <Link 
              to="/"
              className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-200 group"
            >
              <svg 
                className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al inicio</span>
            </Link>
          )}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Header Text */}
            {(title || subtitle) && (
              <div className="text-center mb-12">
                {title && (
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 text-lg font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            
            {/* Card Ultra Minimalista */}
            <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-2xl border border-gray-100 p-8 md:p-10">
              {children}
            </div>
            
            {/* Trust Indicators Minimalistas */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-8 text-xs text-gray-400">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Seguro</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Encriptado</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Minimalista */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-400">
            ¿Necesitas ayuda?{' '}
            <Link 
              to="/contact" 
              className="font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};