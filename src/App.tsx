// import React, { useState } from 'react';
// import { 
//   Button, 
//   Input, 
//   Card, 
//   CardHeader, 
//   CardTitle, 
//   CardContent,
//   Select,
//   FileUpload,
//   ProgressBar,
//   Skeleton,
//   Badge,
//   Alert
// } from './components/ui';
// import { ComponentShowcase } from './components/ui/ComponentShowcase';

// function App() {
//   const [selectedCategory, setSelectedCategory] = useState<string | number>('');
//   const [files, setFiles] = useState<File[]>([]);
//   const [progress, setProgress] = useState(45);

//   const categoryOptions = [
//     { value: 'laptops', label: 'Laptops' },
//     { value: 'phones', label: 'Teléfonos' },
//     { value: 'tablets', label: 'Tablets' },
//     { value: 'accessories', label: 'Accesorios' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold text-gray-900">
//               Chatarra Electrónica
//             </h1>
//             <div className="flex items-center space-x-2">
//               <Badge variant="success">En línea</Badge>
//               <Button size="sm">Iniciar Sesión</Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Formulario de ejemplo */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Vender tu chatarra electrónica</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <Select
//                 label="Categoría del dispositivo"
//                 options={categoryOptions}
//                 value={selectedCategory}
//                 onChange={setSelectedCategory}
//                 placeholder="Selecciona una categoría"
//                 required
//               />

//               <Input
//                 label="Peso estimado (kg)"
//                 type="number"
//                 placeholder="1.5"
//                 step="0.1"
//                 min="0"
//                 required
//               />

//               <FileUpload
//                 label="Fotos del dispositivo"
//                 selectedFiles={files}
//                 onFilesSelect={(newFiles) => setFiles([...files, ...newFiles])}
//                 onFileRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
//                 maxFiles={5}
//               />

//               <div>
//                 <ProgressBar
//                   label="Progreso del formulario"
//                   value={progress}
//                   showPercentage
//                   variant="success"
//                 />
//                 <div className="flex gap-2 mt-2">
//                   <Button 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => setProgress(Math.max(0, progress - 10))}
//                   >
//                     -10%
//                   </Button>
//                   <Button 
//                     size="sm" 
//                     variant="outline"
//                     onClick={() => setProgress(Math.min(100, progress + 10))}
//                   >
//                     +10%
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <Button variant="outline" fullWidth>
//                   Guardar borrador
//                 </Button>
//                 <Button fullWidth>
//                   Continuar
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Panel de información */}
//           <div className="space-y-6">
//             <Alert variant="success" title="¡Bienvenido!">
//               Tu plataforma para reciclar dispositivos electrónicos de forma segura y obtener recompensas.
//             </Alert>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Cargando datos...</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Skeleton variant="text" lines={3} />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Estadísticas</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-primary-600">1,234</div>
//                     <div className="text-sm text-gray-500">Dispositivos reciclados</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-success-600">$45,678</div>
//                     <div className="text-sm text-gray-500">Pagos realizados</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Showcase de componentes */}
//         <div className="mt-12">
//           <ComponentShowcase />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;




// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { LayoutWrapper } from './components/layout';
// import { ProtectedRoute } from './components/auth/ProtectedRoute';
// // Update the import paths to point to the correct files for each auth page
// import { LoginPage } from './pages/auth/LoginPage';
// import { RegisterPage } from './pages/auth/RegisterPage';
// import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
// // import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
// import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
// import { Button, Card, CardContent, Badge } from './components/ui';

// // Página de inicio temporal
// const HomePage = () => (
//   <div className="py-12">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//       <h1 className="text-4xl font-bold text-gray-900 mb-8">
//         Bienvenido a Chatarra Electrónica
//       </h1>
//       <p className="text-xl text-gray-600 mb-8">
//         Convierte tus dispositivos electrónicos en dinero de forma segura
//       </p>
//       <div className="space-x-4">
//         <Button size="lg" asChild>
//           <a href="/login">Iniciar Sesión</a>
//         </Button>
//         <Button variant="outline" size="lg" asChild>
//           <a href="/register">Registrarse</a>
//         </Button>
//       </div>
//     </div>
//   </div>
// );

// // Dashboard temporal para testing
// const DashboardPage = () => (
//   <div>
//     <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       <Card>
//         <CardContent className="p-6 text-center">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Órdenes activas</h3>
//           <p className="text-3xl font-bold text-primary-600">3</p>
//           <Badge variant="success" className="mt-2">Activo</Badge>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardContent className="p-6 text-center">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Total ganado</h3>
//           <p className="text-3xl font-bold text-success-600">$1,234</p>
//           <Badge variant="default" className="mt-2">Este mes</Badge>
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardContent className="p-6 text-center">
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Kg reciclados</h3>
//           <p className="text-3xl font-bold text-gray-900">45.6</p>
//           <Badge variant="outline" className="mt-2">Total</Badge>
//         </CardContent>
//       </Card>
//     </div>
    
//     <Card className="mt-8">
//       <CardContent className="p-6">
//         <h3 className="text-lg font-bold mb-4">¡Autenticación funcionando! ✅</h3>
//         <p className="text-gray-600">
//           Si puedes ver esta página, significa que el sistema de autenticación está funcionando correctamente.
//         </p>
//       </CardContent>
//     </Card>
//   </div>
// );

// // Página de testing de componentes
// const TestPage = () => (
//   <div className="py-8">
//     <div className="max-w-4xl mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-8">Testing de Componentes</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-bold mb-4">Botones</h3>
//             <div className="space-y-3">
//               <Button fullWidth>Primario</Button>
//               <Button variant="secondary" fullWidth>Secundario</Button>
//               <Button variant="outline" fullWidth>Outline</Button>
//               <Button variant="ghost" fullWidth>Ghost</Button>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-bold mb-4">Badges</h3>
//             <div className="flex flex-wrap gap-2">
//               <Badge>Default</Badge>
//               <Badge variant="success">Success</Badge>
//               <Badge variant="warning">Warning</Badge>
//               <Badge variant="danger">Danger</Badge>
//               <Badge variant="outline">Outline</Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LayoutWrapper />}>
//           {/* Rutas públicas */}
//           <Route index element={<HomePage />} />
//           <Route path="test" element={<TestPage />} />
          
//           {/* Rutas de autenticación (no requieren login) */}
//           <Route 
//             path="login" 
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <LoginPage />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="register" 
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <RegisterPage />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="forgot-password" 
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <ForgotPasswordPage />
//               </ProtectedRoute>
//             } 
//           />
//           {/* <Route 
//             path="reset-password" 
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <ResetPasswordPage />
//               </ProtectedRoute>
//             } 
//           /> */}
//           <Route path="verify-email" element={<VerifyEmailPage />} />
          
//           {/* Rutas protegidas (requieren autenticación) */}
//           <Route 
//             path="dashboard" 
//             element={
//               <ProtectedRoute requireAuth={true}>
//                 <DashboardPage />
//               </ProtectedRoute>
//             } 
//           />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;




// // import React from 'react';
// import { AppRouter } from './router/AppRouter';
// import './index.css';

// function App() {
//   return <AppRouter />;
// }

// export default App;













import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutWrapper } from './components/layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SEOHead } from './components/SEO/SEOHead';
import { ScrollToTop } from './utils/ScrollToTop';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
// import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import SellPage from './pages/dashboard/SellPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import OrderDetailPage from './pages/dashboard/OrderDetailPage';
import StatsPage from './pages/dashboard/StatsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import ReferralsPage from './pages/dashboard/ReferralsPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorksPage';

// Error pages
import NotFoundPage from './pages/errors/NotFoundPage';

// Legal pages (temporary)
const TermsPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
    <p className="text-gray-600">Página en desarrollo...</p>
  </div>
);

const PrivacyPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
    <p className="text-gray-600">Página en desarrollo...</p>
  </div>
);

const HelpPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6">Centro de Ayuda</h1>
    <p className="text-gray-600">Página en desarrollo...</p>
  </div>
);

// Temporary placeholder pages
const RewardsPage = () => (
  <div className="space-y-6">
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Recompensas</h1>
      <p className="text-gray-600">Sistema de puntos y recompensas</p>
    </div>
    <div className="px-6">
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Página en desarrollo
        </h3>
        <p className="text-gray-600">
          Sistema de recompensas próximamente
        </p>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6">
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
      <p className="text-gray-600">Ajustes de cuenta y preferencias</p>
    </div>
    <div className="px-6">
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Página en desarrollo
        </h3>
        <p className="text-gray-600">
          Configuraciones próximamente
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LayoutWrapper />}>
          {/* Public Routes */}
          <Route 
            index 
            element={
              <>
                <SEOHead 
                  title="Inicio - Chatarra Electrónica"
                  description="Convierte tu chatarra electrónica en dinero de forma segura y sostenible"
                />
                <HomePage />
              </>
            } 
          />
          <Route 
            path="about" 
            element={
              <>
                <SEOHead title="Sobre Nosotros" />
                <AboutPage />
              </>
            } 
          />
          <Route 
            path="contact" 
            element={
              <>
                <SEOHead title="Contacto" />
                <ContactPage />
              </>
            } 
          />
          <Route 
            path="how-it-works" 
            element={
              <>
                <SEOHead title="Cómo Funciona" />
                <HowItWorksPage />
              </>
            } 
          />
          
          {/* Auth Routes (redirect if already authenticated) */}
          <Route 
            path="login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SEOHead title="Iniciar Sesión" noIndex />
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SEOHead title="Crear Cuenta" noIndex />
                <RegisterPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SEOHead title="Recuperar Contraseña" noIndex />
                <ForgotPasswordPage />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="reset-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SEOHead title="Nueva Contraseña" noIndex />
                <ResetPasswordPage />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="verify-email" 
            element={
              <>
                <SEOHead title="Verificar Email" noIndex />
                <VerifyEmailPage />
              </>
            } 
          />
          
          {/* Protected Routes (require authentication) */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Dashboard" noIndex />
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="sell" 
            element={
              <ProtectedRoute requireAuth={true} requireEmailVerification={true}>
                <SEOHead title="Vender" noIndex />
                <SellPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="orders" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Mis Órdenes" noIndex />
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="orders/:id" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Detalle de Orden" noIndex />
                <OrderDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="stats" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Estadísticas" noIndex />
                <StatsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="payments" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Pagos" noIndex />
                <PaymentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="referrals" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Referidos" noIndex />
                <ReferralsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="rewards" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Recompensas" noIndex />
                <RewardsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Mi Perfil" noIndex />
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute requireAuth={true}>
                <SEOHead title="Configuración" noIndex />
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Legal and Help Routes */}
          <Route 
            path="terms" 
            element={
              <>
                <SEOHead title="Términos y Condiciones" />
                <TermsPage />
              </>
            } 
          />
          <Route 
            path="privacy" 
            element={
              <>
                <SEOHead title="Política de Privacidad" />
                <PrivacyPage />
              </>
            } 
          />
          <Route 
            path="help" 
            element={
              <>
                <SEOHead title="Centro de Ayuda" />
                <HelpPage />
              </>
            } 
          />
          
          {/* Redirects */}
          <Route path="home" element={<Navigate to="/" replace />} />
          
          {/* 404 - Must be last */}
          <Route 
            path="*" 
            element={
              <>
                <SEOHead title="Página No Encontrada" noIndex />
                <NotFoundPage />
              </>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;