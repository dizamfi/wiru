// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import { 
//   Bars3Icon, 
//   BellIcon, 
//   UserCircleIcon,
//   Cog6ToothIcon,
//   ArrowRightOnRectangleIcon,
//   UserIcon,
//   ChevronDownIcon
// } from '@heroicons/react/24/outline';
// import { Button, Badge } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';
// import { cn } from '@/utils/cn';
// import { env } from '@/utils/env';

// interface HeaderProps {
//   onMenuClick?: () => void;
//   showMenuButton?: boolean;
// }

// export const Header: React.FC<HeaderProps> = ({ 
//   onMenuClick, 
//   showMenuButton = true 
// }) => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [notificationCount] = useState(3); // Simulado

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   const userInitials = user 
//     ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
//     : 'U';

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left side - Logo and Menu */}
//           <div className="flex items-center space-x-4">
//             {showMenuButton && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onMenuClick}
//                 className="lg:hidden"
//               >
//                 <Bars3Icon className="h-5 w-5" />
//               </Button>
//             )}
            
//             <Link to="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">CE</span>
//               </div>
//               <div className="hidden sm:block">
//                 <h1 className="text-xl font-bold text-gray-900">
//                   {env.APP_NAME}
//                 </h1>
//                 <p className="text-xs text-gray-500 -mt-1">
//                   Reciclaje inteligente
//                 </p>
//               </div>
//             </Link>
//           </div>

//           {/* Center - Search (Desktop) */}
//           <div className="hidden md:flex flex-1 max-w-md mx-8">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Buscar categorías, ayuda..."
//                 className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                 <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
//                   ⌘K
//                 </kbd>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Actions */}
//           <div className="flex items-center space-x-3">
//             {isAuthenticated ? (
//               <>
//                 {/* Notifications */}
//                 <div className="relative">
//                   <Button variant="ghost" size="icon">
//                     <BellIcon className="h-5 w-5" />
//                     {notificationCount > 0 && (
//                       <Badge 
//                         variant="danger" 
//                         className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
//                       >
//                         {notificationCount}
//                       </Badge>
//                     )}
//                   </Button>
//                 </div>

//                 {/* User Menu */}
//                 <Menu as="div" className="relative">
//                   <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
//                     {user?.avatar ? (
//                       <img
//                         src={user.avatar}
//                         alt={`${user.firstName} ${user.lastName}`}
//                         className="w-8 h-8 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
//                         <span className="text-white text-sm font-medium">
//                           {userInitials}
//                         </span>
//                       </div>
//                     )}
//                     <div className="hidden sm:block text-left">
//                       <p className="text-sm font-medium text-gray-900">
//                         {user?.firstName} {user?.lastName}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {user?.email}
//                       </p>
//                     </div>
//                     <ChevronDownIcon className="hidden sm:block w-4 h-4 text-gray-400" />
//                   </Menu.Button>

//                   <Transition
//                     as={React.Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                       <div className="px-1 py-1">
//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/profile"
//                               className={cn(
//                                 'group flex w-full items-center rounded-md px-2 py-2 text-sm',
//                                 active ? 'bg-primary-600 text-white' : 'text-gray-900'
//                               )}
//                             >
//                               <UserIcon className="mr-2 h-4 w-4" />
//                               Mi Perfil
//                             </Link>
//                           )}
//                         </Menu.Item>
//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/settings"
//                               className={cn(
//                                 'group flex w-full items-center rounded-md px-2 py-2 text-sm',
//                                 active ? 'bg-primary-600 text-white' : 'text-gray-900'
//                               )}
//                             >
//                               <Cog6ToothIcon className="mr-2 h-4 w-4" />
//                               Configuración
//                             </Link>
//                           )}
//                         </Menu.Item>
//                       </div>
//                       <div className="px-1 py-1">
//                         <Menu.Item>
//                           {({ active }) => (
//                             <button
//                               onClick={handleLogout}
//                               className={cn(
//                                 'group flex w-full items-center rounded-md px-2 py-2 text-sm',
//                                 active ? 'bg-danger-600 text-white' : 'text-gray-900'
//                               )}
//                             >
//                               <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
//                               Cerrar Sesión
//                             </button>
//                           )}
//                         </Menu.Item>
//                       </div>
//                     </Menu.Items>
//                   </Transition>
//                 </Menu>
//               </>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link to="/login">Iniciar Sesión</Link>
//                 </Button>
//                 <Button size="sm" asChild>
//                   <Link to="/register">Registrarse</Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };




// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { env } from '@/utils/env';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false 
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  
  // Mock notification count
  const notificationCount = 3;

  const userInitials = user ? 
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 
    'U';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Menu button for mobile */}
            {showMenuButton && (
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={onMenuClick}
              >
                <span className="sr-only">Abrir sidebar</span>
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

            {/* Logo for public pages */}
            {!showMenuButton && (
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CE</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {env.APP_NAME}
                </span>
              </Link>
            )}

            {/* Navigation for public pages */}
            {!isAuthenticated && (
              <nav className="hidden md:flex space-x-8 ml-10">
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Cómo Funciona
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Contacto
                </Link>
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge 
                        variant="danger" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {userInitials}
                        </span>
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                    <ChevronDownIcon className="hidden sm:block w-4 h-4 text-gray-400" />
                  </Menu.Button>

                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={cn(
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                              )}
                            >
                              <UserIcon className="mr-2 h-4 w-4" />
                              Mi Perfil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/settings"
                              className={cn(
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                              )}
                            >
                              <Cog6ToothIcon className="mr-2 h-4 w-4" />
                              Configuración
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => logout()}
                              className={cn(
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                active ? 'bg-red-100 text-red-900' : 'text-gray-900'
                              )}
                            >
                              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              /* Auth buttons for public pages */
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button>
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};