import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export const LoginExample: React.FC = () => {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    error, 
    login, 
    logout,
    clearError 
  } = useAuth();

  const handleLogin = async () => {
    clearError();
    await login({
      email: 'test@example.com',
      password: 'password123'
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isAuthenticated ? 'Autenticado' : 'No autenticado'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isAuthenticated && user ? (
        <div>
          <p className="mb-2">
            <strong>Nombre:</strong> {user.firstName} {user.lastName}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-4">
            <strong>Verificado:</strong> {user.isVerified ? 'Sí' : 'No'}
          </p>
          <button 
            onClick={handleLogout}
            className="btn-secondary w-full"
            disabled={isLoading}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button 
          onClick={handleLogin}
          className="btn-primary w-full"
          disabled={isLoading}
        >
          Iniciar Sesión (Demo)
        </button>
      )}
    </div>
  );
};