// import React, { Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { LayoutWrapper } from '@/components/layout';
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
// import { LoadingSpinner } from '@/components/ui';
// import { 
//   publicRoutes, 
//   authRoutes, 
//   protectedRoutes, 
//   legalRoutes, 
//   helpRoutes, 
//   errorRoutes,
//   type RouteConfig 
// } from './routes';
// import { SEOHead } from '@/components/SEO/SEOHead';
// import { ScrollToTop } from '@/components/utils/ScrollToTop';

// // Loading fallback component
// const RouteFallback: React.FC<{ title?: string }> = ({ title }) => (
//   <div className="min-h-screen flex items-center justify-center">
//     <div className="text-center">
//       <LoadingSpinner size="lg" text={`Cargando ${title || 'página'}...`} />
//     </div>
//   </div>
// );

// // Route component wrapper
// const RouteWrapper: React.FC<{
//   route: RouteConfig;
//   children: React.ReactNode;
// }> = ({ route, children }) => (
//   <>
//     <SEOHead 
//       title={route.title}
//       description={route.description}
//     />
//     {children}
//   </>
// );

// // Generate route elements
// const generateRoutes = (routes: RouteConfig[]) => {
//   return routes.map((route) => {
//     const Component = route.component;
    
//     return (
//       <Route
//         key={route.path}
//         path={route.path}
//         element={
//           <Suspense fallback={<RouteFallback title={route.title} />}>
//             <RouteWrapper route={route}>
//               {route.requireAuth !== false ? (
//                 <ProtectedRoute
//                   requireAuth={route.requireAuth}
//                   requireEmailVerification={route.requireEmailVerification}
//                   allowedRoles={route.allowedRoles}
//                 >
//                   <Component />
//                 </ProtectedRoute>
//               ) : (
//                 <ProtectedRoute requireAuth={false}>
//                   <Component />
//                 </ProtectedRoute>
//               )}
//             </RouteWrapper>
//           </Suspense>
//         }
//       />
//     );
//   });
// };

// export const AppRouter: React.FC = () => {
//   return (
//     <Router>
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<LayoutWrapper />}>
//           {/* Public Routes */}
//           {generateRoutes(publicRoutes)}
          
//           {/* Auth Routes */}
//           {generateRoutes(authRoutes)}
          
//           {/* Protected Routes */}
//           {generateRoutes(protectedRoutes)}
          
//           {/* Legal Routes */}
//           {generateRoutes(legalRoutes)}
          
//           {/* Help Routes */}
//           {generateRoutes(helpRoutes)}
          
//           {/* Error Routes (must be last) */}
//           {generateRoutes(errorRoutes)}
//         </Route>
//       </Routes>
//     </Router>
//   );
// };


import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutWrapper } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui';
import { 
  publicRoutes, 
  authRoutes, 
  protectedRoutes, 
  legalRoutes, 
  helpRoutes, 
  errorRoutes,
  type RouteConfig 
} from './routes';
import { SEOHead } from '@/components/SEO/SEOHead';
import { ScrollToTop } from '@/utils/ScrollToTop';

// Loading fallback component
const RouteFallback: React.FC<{ title?: string }> = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" text={`Cargando ${title || 'página'}...`} />
    </div>
  </div>
);

// Route component wrapper with SEO
const RouteWrapper: React.FC<{
  route: RouteConfig;
  children: React.ReactNode;
}> = ({ route, children }) => (
  <>
    <SEOHead 
      title={route.title}
      description={route.description}
      noIndex={route.path === '/unauthorized' || route.path === '/server-error' || route.path === '*'}
    />
    {children}
  </>
);

// Generate route elements with proper protection
const generateRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    const Component = route.component;
    
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Suspense fallback={<RouteFallback title={route.title} />}>
            <RouteWrapper route={route}>
              {route.requireAuth !== false ? (
                <ProtectedRoute
                  requireAuth={route.requireAuth ?? true}
                  requireEmailVerification={route.requireEmailVerification}
                  allowedRoles={route.allowedRoles}
                >
                  <Component />
                </ProtectedRoute>
              ) : (
                <ProtectedRoute requireAuth={false}>
                  <Component />
                </ProtectedRoute>
              )}
            </RouteWrapper>
          </Suspense>
        }
      />
    );
  });
};

export const AppRouter: React.FC = () => {
  return (
    <Router>
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<LayoutWrapper />}>
          {/* Public Routes */}
          {generateRoutes(publicRoutes)}
          
          {/* Auth Routes */}
          {generateRoutes(authRoutes)}
          
          {/* Protected Routes */}
          {generateRoutes(protectedRoutes)}
          
          {/* Legal Routes */}
          {generateRoutes(legalRoutes)}
          
          {/* Help Routes */}
          {generateRoutes(helpRoutes)}
          
          {/* Error Routes (must be last) */}
          {generateRoutes(errorRoutes)}
        </Route>
      </Routes>
    </Router>
  );
};