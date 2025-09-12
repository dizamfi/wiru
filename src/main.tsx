// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import { AuthProvider } from './components/auth/AuthProvider'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>,
// )



// // src/main.tsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from '@/contexts/AuthContext';
// import App from './App';
// import './index.css';

// // Configuración global de toast
// const toastConfig = {
//   duration: 4000,
//   position: 'top-right' as const,
//   style: {
//     borderRadius: '8px',
//     background: '#363636',
//     color: '#fff',
//   },
//   success: {
//     style: {
//       background: '#10B981',
//     },
//   },
//   error: {
//     style: {
//       background: '#EF4444',
//     },
//   },
// };

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//         <Toaster {...toastConfig} />
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );






// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import App from './App';
import './index.css';

// Configuración global de toast
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '8px',
    background: '#363636',
    color: '#fff',
  },
  success: {
    style: {
      background: '#10B981',
    },
  },
  error: {
    style: {
      background: '#EF4444',
    },
  },
};

// Renderizar sin StrictMode en desarrollo para evitar doble ejecución de efectos
// En producción, React.StrictMode no causa este comportamiento
const isDevelopment = import.meta.env.DEV;

const AppWrapper = () => (
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster {...toastConfig} />
    </AuthProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  isDevelopment ? (
    // Sin StrictMode en desarrollo
    <AppWrapper />
  ) : (
    // Con StrictMode en producción
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  )
);