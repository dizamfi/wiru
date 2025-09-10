import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Header con logo */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex justify-center">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-4 rounded-2xl shadow-xl">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              {/* Texto */}
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
                  WIRU
                </span>
                <div className="text-sm font-medium text-gray-500 -mt-1">
                  Recicla • Gana
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Contenido */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-200">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <Link to="/contact" className="text-[#a8c241] hover:text-[#8ea635] font-medium">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;