// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import { Header } from './Header';
// import { Sidebar } from './Sidebar';
// import { Footer } from './Footer';
// import { useAuth } from '@/hooks/useAuth';
// import { env } from '@/utils/env';

// interface LayoutProps {
//   variant?: 'default' | 'auth' | 'dashboard';
//   showSidebar?: boolean;
//   showFooter?: boolean;
// }

// export const Layout: React.FC<LayoutProps> = ({ 
//   variant = 'default',
//   showSidebar = true,
//   showFooter = true
// }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { isAuthenticated } = useAuth();

//   // Para páginas de autenticación, usar layout simple
//   if (variant === 'auth') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
//         {/* Logo en la esquina superior izquierda */}
//         <div className="absolute top-4 left-4">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">CE</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900">
//               {env.APP_NAME}
//             </span>
//           </div>
//         </div>
        
//         {/* Contenido principal centrado */}
//         <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
//           <Outlet />
//         </div>
        
//         {/* Footer simple para auth */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//           <p className="text-xs text-gray-500 text-center">
//             &copy; {new Date().getFullYear()} {env.APP_NAME}. Todos los derechos reservados.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Layout para dashboard (con sidebar)
//   if (variant === 'dashboard' && isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Sidebar */}
//         <Sidebar 
//           isOpen={sidebarOpen} 
//           onClose={() => setSidebarOpen(false)} 
//         />
        
//         {/* Contenido principal con margen para sidebar */}
//         <div className="lg:pl-64">
//           <Header 
//             onMenuClick={() => setSidebarOpen(true)}
//             showMenuButton={true}
//           />
          
//           <main className="flex-1 min-h-0">
//             <div className="py-6">
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <Outlet />
//               </div>
//             </div>
//           </main>
          
//           {showFooter && <Footer />}
//         </div>
//       </div>
//     );
//   }

//   // Layout por defecto (sin sidebar) para páginas públicas
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header 
//         onMenuClick={() => setSidebarOpen(true)}
//         showMenuButton={false}
//       />
      
//       <main className="flex-1">
//         <Outlet />
//       </main>
      
//       {showFooter && <Footer />}
//     </div>
//   );
// };



// src/components/layout/Layout.tsx - Corregido para móvil

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  variant?: 'default' | 'auth' | 'dashboard';
  showSidebar?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  variant = 'default',
  showSidebar = true,
  showFooter = true
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Para páginas de autenticación, usar layout simple
  if (variant === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
          <Outlet />
        </div>
      </div>
    );
  }

  // Layout para dashboard (con sidebar)
  if (variant === 'dashboard' && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header fijo que ocupa todo el ancho - SIEMPRE VISIBLE */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={true}
        />
        
        {/* Container para sidebar y contenido principal - CON MARGEN TOP PARA EL HEADER */}
        <div className="flex pt-16"> {/* pt-16 = 64px para compensar el header fijo */}
          {/* Sidebar SOLO desktop - NO fijo, scrolleable, con margen top negativo para llegar hasta arriba */}
          <div className="w-64 hidden lg:block -mt-16"> {/* -mt-16 para que el sidebar llegue hasta arriba */}
            <Sidebar 
              isOpen={true} 
              onClose={() => {}} 
            />
          </div>
          
          {/* Contenido principal */}
          <main className="flex-1 min-w-0">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
            
            {showFooter && <Footer />}
          </main>
        </div>

        {/* Sidebar móvil - SEPARADO del desktop */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>
    );
  }

  // Layout por defecto (sin sidebar) para páginas públicas
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header fijo que ocupa todo el ancho */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        showMenuButton={false}
      />
      
      <main className="flex-1 pt-16"> {/* pt-16 para compensar el header fijo */}
        <Outlet />
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};