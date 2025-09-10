// src/components/layout/PublicLayout.tsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Cómo Funciona', href: '/about' },
  { name: 'Precios', href: '/pricing' },
  { name: 'Contacto', href: '/contact' },
];

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-2 rounded-xl shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
                  WIRU
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-[#a8c241]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'text-[#a8c241] bg-green-50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2 text-base font-medium bg-[#a8c241] text-white rounded-md hover:bg-[#8ea635]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-2 rounded-xl">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-xl font-black text-white">WIRU</span>
              </div>
              <p className="text-gray-300 max-w-md">
                Plataforma líder en reciclaje de chatarra electrónica. 
                Convierte tus dispositivos usados en dinero de forma fácil y segura.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Empresa
              </h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white">Acerca de</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contacto</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white">Términos</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacidad</Link></li>
              </ul>
            </div>

            {/* Soporte */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Soporte
              </h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-300 hover:text-white">Centro de Ayuda</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                <li><a href="mailto:support@wiru.com" className="text-gray-300 hover:text-white">Email</a></li>
                <li><a href="tel:+1234567890" className="text-gray-300 hover:text-white">Teléfono</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Wiru. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};