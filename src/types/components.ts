import { ReactNode, ComponentType } from 'react';

// Tipos para datos de testimoniales
export interface TestimonialData {
  name: string;
  location: string;
  amount: string;
  device: string;
  rating: number;
  date: string;
  image: string;
  quote: string;
}

// Tipos para dispositivos
export interface DeviceData {
  type: string;
  name: string;
  price: string;
  examples: string[];
  icon: ComponentType<{ className?: string }>;
}

// Tipos para características/features
export interface FeatureData {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight: string;
  benefits: string[];
}

// Tipos para pasos del proceso
export interface StepData {
  number: number;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  time: string;
}

// Tipos para estadísticas
export interface StatData {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

// Tipos para estadísticas en tiempo real
export interface LiveStatData {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  icon: string;
}

// Tipos para comparación de precios
export interface PriceComparisonData {
  [device: string]: {
    wiru: number;
    competitor1: number;
    competitor2: number;
    market: number;
  };
}

// Tipos para calculadora de precios
export interface DeviceType {
  name: string;
  basePrice: number;
}

export interface DeviceCondition {
  name: string;
  multiplier: number;
}

export interface PriceCalculatorData {
  devices: Record<string, DeviceType>;
  conditions: Record<string, DeviceCondition>;
}

// Props para componentes animados
export interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export interface FloatingDeviceProps {
  type: string;
  className?: string;
  delay?: number;
}

// Props para componentes de UI
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

export interface ButtonProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

// Tipos para hooks de animación
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement>;
  isIntersecting: boolean;
  hasBeenVisible: boolean;
  reset: () => void;
}

export interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasAnimated: boolean;
}

export interface UseStaggeredAnimationReturn {
  ref: React.RefObject<HTMLDivElement>;
  getItemProps: (index: number) => {
    className: string;
    style: { animationDelay: string };
  };
  isVisible: boolean;
}

// Tipos para utilidades de animación
export interface AnimationTarget {
  start: number;
  end: number;
  callback: (value: number) => void;
  delay?: number;
}

export type EasingFunction = 'linear' | 'easeOut' | 'easeInOut';

export interface ParticleEffectOptions {
  particleCount?: number;
  particleClass?: string;
  duration?: number;
}

export interface RippleEffectOptions {
  color?: string;
}

export interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
  callback?: () => void;
}

// Tipos para el auth context (si se necesita)
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Tipos para configuración de colores del tema
export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Tipos para configuración de animaciones
export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  delay: {
    short: number;
    medium: number;
    long: number;
  };
}

// Tipos para métricas y analytics
export interface MetricsData {
  totalUsers: number;
  devicesRecycled: number;
  totalEarned: number;
  co2Saved: number;
  satisfactionRate: number;
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Tipos para SEO
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

// Tipos para notificaciones
export interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Tipos para formularios
export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface SelectFieldProps extends Omit<FormFieldProps, 'type'> {
  options: Array<{
    value: string;
    label: string;
  }>;
}

// Tipos para modales
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

// Tipos para tooltips
export interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  className?: string;
}

// Tipos para breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

// Tipos para paginación
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

// Tipos para tablas
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  onRowClick?: (row: T) => void;
  className?: string;
}

// Tipos para filtros de búsqueda
export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  condition?: string;
  brand?: string;
  dateRange?: [Date, Date];
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// Tipos para configuración de la app
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    enableReferrals: boolean;
    enableRewards: boolean;
    enableChat: boolean;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para errores
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Export de todos los tipos para fácil importación
export type {
  ReactNode,
  ComponentType
} from 'react';