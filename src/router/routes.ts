import { lazy } from 'react';

// Lazy loading de páginas para mejor performance
const HomePage = lazy(() => import('@/pages/HomePage'));
// const AboutPage = lazy(() => import('@/pages/AboutPage'));
// const ContactPage = lazy(() => import('@/pages/ContactPage'));
// const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
// const PricingPage = lazy(() => import('@/pages/PricingPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
// const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage').then(module => ({ default: module.VerifyEmailPage })));

// // Dashboard pages

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const SellPage = lazy(() => import('@/pages/dashboard/SellPage'));
const OrdersPage = lazy(() => import('@/pages/dashboard/OrdersPage'));
// const OrderDetailPage = lazy(() => import('@/pages/dashboard/OrderDetailPage'));
const PaymentsPage = lazy(() => import('@/pages/dashboard/PaymentsPage'));
const ReferralsPage = lazy(() => import('@/pages/dashboard/ReferralsPage'));
// const RewardsPage = lazy(() => import('@/pages/dashboard/RewardsPage'));
const StatsPage = lazy(() => import('@/pages/dashboard/StatsPage'));
// const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
// const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
// const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage'));

// // Error pages
// const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
// const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'));
// const ServerErrorPage = lazy(() => import('@/pages/errors/ServerErrorPage'));

// // Legal pages
// const TermsPage = lazy(() => import('@/pages/legal/TermsPage'));
// const PrivacyPage = lazy(() => import('@/pages/legal/PrivacyPage'));
// const CookiesPage = lazy(() => import('@/pages/legal/CookiesPage'));

// // Help pages
// const HelpPage = lazy(() => import('@/pages/help/HelpPage'));
// const GuidesPage = lazy(() => import('@/pages/help/GuidesPage'));
// const FAQPage = lazy(() => import('@/pages/help/FAQPage'));

// Route configuration interface
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  allowedRoles?: string[];
  layout?: 'default' | 'auth' | 'dashboard';
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
}

// Public routes (no authentication required)
export const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    layout: 'default',
    title: 'Inicio - Chatarra Electrónica',
    description: 'Convierte tu chatarra electrónica en dinero'
  },
//   {
//     path: '/about',
//     component: AboutPage,
//     layout: 'default',
//     title: 'Sobre Nosotros',
//     description: 'Conoce más sobre nuestra misión y visión'
//   },
//   {
//     path: '/contact',
//     component: ContactPage,
//     layout: 'default',
//     title: 'Contacto',
//     description: 'Ponte en contacto con nosotros'
//   },
//   {
//     path: '/how-it-works',
//     component: HowItWorksPage,
//     layout: 'default',
//     title: 'Cómo Funciona',
//     description: 'Aprende cómo funciona nuestro proceso'
//   },
//   {
//     path: '/pricing',
//     component: PricingPage,
//     layout: 'default',
//     title: 'Precios',
//     description: 'Conoce nuestros precios por kilogramo'
//   },
];

// Auth routes (redirect if already authenticated)
export const authRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: LoginPage,
    requireAuth: false,
    layout: 'auth',
    title: 'Iniciar Sesión',
    description: 'Accede a tu cuenta'
  },
  {
    path: '/register',
    component: RegisterPage,
    requireAuth: false,
    layout: 'auth',
    title: 'Crear Cuenta',
    description: 'Únete a nuestra plataforma'
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
    requireAuth: false,
    layout: 'auth',
    title: 'Recuperar Contraseña',
    description: 'Recupera el acceso a tu cuenta'
  },
//   {
//     path: '/reset-password',
//     component: ResetPasswordPage,
//     requireAuth: false,
//     layout: 'auth',
//     title: 'Nueva Contraseña',
//     description: 'Establece una nueva contraseña'
//   },
  {
    path: '/verify-email',
    component: VerifyEmailPage,
    layout: 'auth',
    title: 'Verificar Email',
    description: 'Verifica tu dirección de email'
  },
];

// Protected routes (require authentication)
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    component: DashboardPage,
    requireAuth: true,
    layout: 'dashboard',
    title: 'Dashboard',
    description: 'Panel principal de tu cuenta',
    breadcrumbs: [
      { name: 'Inicio', href: '/' },
      { name: 'Dashboard', href: '/dashboard' }
    ]
  },
  {
    path: '/sell',
    component: SellPage,
    requireAuth: true,
    requireEmailVerification: true,
    layout: 'dashboard',
    title: 'Vender Chatarra',
    description: 'Crea una nueva orden de venta'
  },
  {
    path: '/orders',
    component: OrdersPage,
    requireAuth: true,
    layout: 'dashboard',
    title: 'Mis Órdenes',
    description: 'Gestiona todas tus órdenes'
  },
//   {
//     path: '/orders/:id',
//     component: OrderDetailPage,
//     requireAuth: true,
//     layout: 'dashboard',
//     title: 'Detalle de Orden',
//     description: 'Información completa de la orden'
//   },
  {
    path: '/payments',
    component: PaymentsPage,
    requireAuth: true,
    layout: 'dashboard',
    title: 'Pagos',
    description: 'Historial de pagos y transferencias'
  },
  {
    path: '/referrals',
    component: ReferralsPage,
    requireAuth: true,
    layout: 'dashboard',
    title: 'Referidos',
    description: 'Programa de referidos y recompensas'
  },
//   {
//     path: '/rewards',
//     component: RewardsPage,
//     requireAuth: true,
//     layout: 'dashboard',
//     title: 'Recompensas',
//     description: 'Puntos y beneficios acumulados'
//   },
  {
    path: '/stats',
    component: StatsPage,
    requireAuth: true,
    layout: 'dashboard',
    title: 'Estadísticas',
    description: 'Análisis de tu actividad'
  },
//   {
//     path: '/profile',
//     component: ProfilePage,
//     requireAuth: true,
//     layout: 'dashboard',
//     title: 'Mi Perfil',
//     description: 'Información personal y configuración'
//   },
//   {
//     path: '/settings',
//     component: SettingsPage,
//     requireAuth: true,
//     layout: 'dashboard',
//     title: 'Configuración',
//     description: 'Ajustes de cuenta y preferencias'
//   },
//   {
//     path: '/notifications',
//     component: NotificationsPage,
//     requireAuth: true,
//     layout: 'dashboard',
//     title: 'Notificaciones',
//     description: 'Centro de notificaciones'
//   },
];

// Admin routes (require admin role)
export const adminRoutes: RouteConfig[] = [
  // Se agregarán en futuras fases
];

// Legal and help routes
export const legalRoutes: RouteConfig[] = [
//   {
//     path: '/terms',
//     component: TermsPage,
//     layout: 'default',
//     title: 'Términos y Condiciones',
//     description: 'Términos de uso de la plataforma'
//   },
//   {
//     path: '/privacy',
//     component: PrivacyPage,
//     layout: 'default',
//     title: 'Política de Privacidad',
//     description: 'Cómo protegemos tu información'
//   },
//   {
//     path: '/cookies',
//     component: CookiesPage,
//     layout: 'default',
//     title: 'Política de Cookies',
//     description: 'Uso de cookies en nuestro sitio'
//   },
];

export const helpRoutes: RouteConfig[] = [
//   {
//     path: '/help',
//     component: HelpPage,
//     layout: 'default',
//     title: 'Centro de Ayuda',
//     description: 'Encuentra respuestas a tus preguntas'
//   },
//   {
//     path: '/guides',
//     component: GuidesPage,
//     layout: 'default',
//     title: 'Guías',
//     description: 'Guías paso a paso'
//   },
//   {
//     path: '/faq',
//     component: FAQPage,
//     layout: 'default',
//     title: 'Preguntas Frecuentes',
//     description: 'Respuestas a preguntas comunes'
//   },
];

// Error routes
export const errorRoutes: RouteConfig[] = [
//   {
//     path: '/unauthorized',
//     component: UnauthorizedPage,
//     layout: 'default',
//     title: 'No Autorizado',
//     description: 'No tienes permisos para acceder'
//   },
//   {
//     path: '/server-error',
//     component: ServerErrorPage,
//     layout: 'default',
//     title: 'Error del Servidor',
//     description: 'Ha ocurrido un error interno'
//   },
//   {
//     path: '*',
//     component: NotFoundPage,
//     layout: 'default',
//     title: 'Página No Encontrada',
//     description: 'La página que buscas no existe'
//   },
];

// All routes combined
export const allRoutes = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...adminRoutes,
  ...legalRoutes,
  ...helpRoutes,
  ...errorRoutes,
];