// import React from 'react';
// import { PageHeader } from '@/components/layout';
// import { Card, CardContent, Button, Input } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';

// const ProfilePage: React.FC = () => {
//   const { user } = useAuth();

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Mi Perfil"
//         description="Gestiona tu información personal"
//       />
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
//             <div className="space-y-4">
//               <Input 
//                 label="Nombre" 
//                 defaultValue={user?.firstName} 
//                 disabled 
//               />
//               <Input 
//                 label="Apellido" 
//                 defaultValue={user?.lastName} 
//                 disabled 
//               />
//               <Input 
//                 label="Email" 
//                 defaultValue={user?.email} 
//                 disabled 
//               />
//               <Button variant="outline">Editar Información</Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Configuración de Cuenta</h3>
//             <div className="space-y-4">
//               <Button variant="outline" fullWidth>Cambiar Contraseña</Button>
//               <Button variant="outline" fullWidth>Configurar Pagos</Button>
//               <Button variant="outline" fullWidth>Preferencias de Notificaciones</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;





// // src/pages/dashboard/ProfilePage.tsx
// import React, { useState } from 'react';
// import { 
//   UserIcon, 
//   BuildingOfficeIcon,
//   PencilIcon,
//   BanknotesIcon,
//   ShieldCheckIcon,
//   BellIcon,
//   GlobeAltIcon,
//   DevicePhoneMobileIcon,
//   EnvelopeIcon,
//   MapPinIcon,
//   IdentificationIcon,
//   CalendarIcon
// } from '@heroicons/react/24/outline';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { Switch } from '@/components/ui/Switch';
// import { useAuth } from '@/hooks/useAuth';
// import { useProfile } from '@/hooks/useProfile';
// import type { User, PersonProfile, CompanyProfile } from '@/types/user';
// import { isPersonProfile, isCompanyProfile } from '@/types/user';
// import { PersonProfileForm } from '@/components/profile/PersonProfileForm';
// import { CompanyProfileForm } from '@/components/profile/CompanyProfileForm';
// import { BankAccountsManager } from '@/components/profile/BankAccountsManager';
// import { NotificationSettings } from '@/components/profile/NotificationSettings';
// import { SecuritySettings } from '@/components/profile/SecuritySettings';

// export const ProfilePage: React.FC = () => {
//   const { user } = useAuth();
//   const { updateProfile, loading } = useProfile();
//   const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'notifications' | 'security'>('personal');
//   const [isEditing, setIsEditing] = useState(false);

//   if (!user) return null;

//   // Type guards and casting
//   const typedUser = user as unknown as User;
//   const isPerson = isPersonProfile(typedUser);
//   const isCompany = isCompanyProfile(typedUser);

//   type TabId = 'personal' | 'payment' | 'notifications' | 'security';

//   const tabs: { id: TabId; name: string; icon: React.ComponentType<any> }[] = [
//     { 
//       id: 'personal', 
//       name: isPerson ? 'Información Personal' : 'Información Empresarial', 
//       icon: isPerson ? UserIcon : BuildingOfficeIcon 
//     },
//     ...(isPerson ? [{ 
//       id: 'payment' as const, 
//       name: 'Métodos de Pago', 
//       icon: BanknotesIcon 
//     }] : []),
//     { 
//       id: 'notifications', 
//       name: 'Notificaciones', 
//       icon: BellIcon 
//     },
//     { 
//       id: 'security', 
//       name: 'Seguridad', 
//       icon: ShieldCheckIcon 
//     }
//   ];

//   const handleSave = async (data: any) => {
//     try {
//       await updateProfile(data);
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error saving profile:', error);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
//           <p className="text-gray-600">
//             {isPerson ? 'Gestiona tu información personal y configuraciones' : 'Gestiona la información de tu empresa'}
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Badge variant={user.isVerified ? 'success' : 'warning'}>
//             {user.isVerified ? 'Email Verificado' : 'Email Pendiente'}
//           </Badge>
//           <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
//             {user.status
//              === 'active' ? 'Cuenta Activa' : user.status}
//           </Badge>
//         </div>
//       </div>

//       {/* Profile Summary Card */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex items-center space-x-6">
//             {/* Avatar */}
//             <div className="relative">
//               {user.avatar ? (
//                 <img 
//                   src={user.avatar} 
//                   alt="Avatar"
//                   className="w-20 h-20 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
//                   {isPerson ? (
//                     <UserIcon className="h-10 w-10 text-gray-400" />
//                   ) : (
//                     <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
//                   )}
//                 </div>
//               )}
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="absolute -bottom-2 -right-2 rounded-full p-1 h-8 w-8"
//               >
//                 <PencilIcon className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* User Info */}
//             <div className="flex-1">
//               <div className="flex items-center space-x-3 mb-2">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   {isPerson ? 
//                     `${(typedUser as PersonProfile).firstName || ''} ${(typedUser as PersonProfile).lastName || ''}` : 
//                     (typedUser as CompanyProfile).companyName
//                   }
//                 </h2>
//                 <Badge variant="outline" className="text-xs">
//                   {isPerson ? 'PERSONA' : 'EMPRESA'}
//                 </Badge>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
//                 <div className="flex items-center space-x-2">
//                   <EnvelopeIcon className="h-4 w-4" />
//                   <span>{user.email}</span>
//                 </div>
                
//                 {user.phone && (
//                   <div className="flex items-center space-x-2">
//                     <DevicePhoneMobileIcon className="h-4 w-4" />
//                     <span>{user.phone}</span>
//                   </div>
//                 )}
                
//                 {isPerson && (typedUser as PersonProfile).address && (
//                   <div className="flex items-center space-x-2">
//                     <MapPinIcon className="h-4 w-4" />
//                     <span>
//                       {(typedUser as PersonProfile).address?.city}, {(typedUser as PersonProfile).address?.state}
//                     </span>
//                   </div>
//                 )}
                
//                 {isCompany && (typedUser as CompanyProfile).businessAddress && (
//                   <div className="flex items-center space-x-2">
//                     <MapPinIcon className="h-4 w-4" />
//                     <span>
//                       {(typedUser as CompanyProfile).businessAddress?.city}, {(typedUser as CompanyProfile).businessAddress?.state}
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex items-center space-x-2">
//                   <CalendarIcon className="h-4 w-4" />
//                   <span>Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Stats for Person */}
//             {isPerson && (typedUser as PersonProfile).wallet && (
//               <div className="grid grid-cols-1 gap-4 text-center">
//                 <div className="bg-primary-50 rounded-lg p-3">
//                   <p className="text-2xl font-bold text-primary-600">
//                     ${(typedUser as PersonProfile).wallet.balance.toFixed(2)}
//                   </p>
//                   <p className="text-xs text-gray-600">Balance</p>
//                 </div>
//                 {(typedUser as PersonProfile).rewards && (
//                   <div className="bg-yellow-50 rounded-lg p-3">
//                     <p className="text-2xl font-bold text-yellow-600">
//                       {(typedUser as PersonProfile).rewards.points}
//                     </p>
//                     <p className="text-xs text-gray-600">Puntos</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Navigation Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8">
//           {tabs.map((tab) => {
//             const IconComponent = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
//                   activeTab === tab.id
//                     ? 'border-primary-500 text-primary-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <IconComponent className="h-5 w-5" />
//                 <span>{tab.name}</span>
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Tab Content */}
//       <div className="space-y-6">
//         {activeTab === 'personal' && (
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold">
//                   {isPerson ? 'Información Personal' : 'Información Empresarial'}
//                 </h3>
//                 <Button 
//                   variant="outline"
//                   onClick={() => setIsEditing(!isEditing)}
//                   disabled={loading}
//                 >
//                   <PencilIcon className="h-4 w-4 mr-2" />
//                   {isEditing ? 'Cancelar' : 'Editar'}
//                 </Button>
//               </div>

//               {isEditing ? (
//                 isPerson ? (
//                   <PersonProfileForm 
//                     user={typedUser as PersonProfile}
//                     onSave={handleSave}
//                     onCancel={() => setIsEditing(false)}
//                   />
//                 ) : (
//                   <CompanyProfileForm 
//                     user={typedUser as CompanyProfile}
//                     onSave={handleSave}
//                     onCancel={() => setIsEditing(false)}
//                   />
//                 )
//               ) : (
//                 <ProfileDisplayInfo user={typedUser} />
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {activeTab === 'payment' && isPerson && (
//           <BankAccountsManager user={typedUser as PersonProfile} />
//         )}

//         {activeTab === 'notifications' && (
//           <NotificationSettings user={typedUser} />
//         )}

//         {activeTab === 'security' && (
//           <SecuritySettings user={typedUser} />
//         )}
//       </div>
//     </div>
//   );
// };

// // Componente para mostrar información del perfil
// const ProfileDisplayInfo: React.FC<{ user: User }> = ({ user }) => {
//   const isPerson = isPersonProfile(user);

//   if (isPerson) {
//     const personUser = user as PersonProfile;
    
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <h4 className="font-medium text-gray-900 mb-3">Información Personal</h4>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
//               <p className="text-sm text-gray-900">
//                 {personUser.firstName || ''} {personUser.lastName || ''}
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <p className="text-sm text-gray-900">{personUser.email}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Teléfono</label>
//               <p className="text-sm text-gray-900">{personUser.phone || 'No especificado'}</p>
//             </div>
//             {personUser.identificationNumber && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Identificación</label>
//                 <p className="text-sm text-gray-900">
//                   {personUser.identificationType}: {personUser.identificationNumber}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div>
//           <h4 className="font-medium text-gray-900 mb-3">Dirección</h4>
//           {personUser.address ? (
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Dirección</label>
//                 <p className="text-sm text-gray-900">{personUser.address.street}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Ciudad</label>
//                 <p className="text-sm text-gray-900">
//                   {personUser.address.city}, {personUser.address.state}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Código Postal</label>
//                 <p className="text-sm text-gray-900">{personUser.address.zipCode}</p>
//               </div>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-600">No hay dirección registrada</p>
//           )}
//         </div>

//         {/* Wallet Info */}
//         {personUser.wallet && (
//           <div>
//             <h4 className="font-medium text-gray-900 mb-3">Billetera Virtual</h4>
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Balance Actual</label>
//                 <p className="text-sm text-gray-900">${personUser.wallet.balance.toFixed(2)}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total Ganado</label>
//                 <p className="text-sm text-gray-900">${personUser.wallet.totalEarnings.toFixed(2)}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Estado</label>
//                 <Badge variant={personUser.wallet.isActive ? 'success' : 'secondary'}>
//                   {personUser.wallet.isActive ? 'Activa' : 'Inactiva'}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rewards Info */}
//         {personUser.rewards && (
//           <div>
//             <h4 className="font-medium text-gray-900 mb-3">Puntos y Recompensas</h4>
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Puntos Actuales</label>
//                 <p className="text-sm text-gray-900">{personUser.rewards.points}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Nivel</label>
//                 <Badge variant="outline">{personUser.rewards.tier.toUpperCase()}</Badge>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total Ganados</label>
//                 <p className="text-sm text-gray-900">{personUser.rewards.totalPointsEarned}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // Company profile display
//   const companyUser = user as CompanyProfile;
  
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <h4 className="font-medium text-gray-900 mb-3">Información de la Empresa</h4>
//         <div className="space-y-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Nombre Comercial</label>
//             <p className="text-sm text-gray-900">{companyUser.companyName}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Razón Social</label>
//             <p className="text-sm text-gray-900">{companyUser.legalName}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">RUC / Tax ID</label>
//             <p className="text-sm text-gray-900">{companyUser.taxId}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Industria</label>
//             <p className="text-sm text-gray-900">{companyUser.industry}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Tamaño</label>
//             <Badge variant="outline">{companyUser.companySize.toUpperCase()}</Badge>
//           </div>
//         </div>
//       </div>

//       {companyUser.legalRepresentative && (
//         <div>
//           <h4 className="font-medium text-gray-900 mb-3">Representante Legal</h4>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Nombre</label>
//               <p className="text-sm text-gray-900">
//                 {companyUser.legalRepresentative.firstName} {companyUser.legalRepresentative.lastName}
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Cargo</label>
//               <p className="text-sm text-gray-900">{companyUser.legalRepresentative.position}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <p className="text-sm text-gray-900">{companyUser.legalRepresentative.email}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Teléfono</label>
//               <p className="text-sm text-gray-900">{companyUser.legalRepresentative.phone}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {companyUser.businessAddress && (
//         <div>
//           <h4 className="font-medium text-gray-900 mb-3">Dirección Comercial</h4>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Dirección</label>
//               <p className="text-sm text-gray-900">{companyUser.businessAddress.street}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Ciudad</label>
//               <p className="text-sm text-gray-900">
//                 {companyUser.businessAddress.city}, {companyUser.businessAddress.state}
//               </p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Código Postal</label>
//               <p className="text-sm text-gray-900">{companyUser.businessAddress.zipCode}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {companyUser.businessSettings && (
//         <div>
//           <h4 className="font-medium text-gray-900 mb-3">Configuración Comercial</h4>
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Tipo de Contrato</label>
//               <Badge variant="outline">{companyUser.businessSettings.contractType.toUpperCase()}</Badge>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Términos de Pago</label>
//               <p className="text-sm text-gray-900">{companyUser.businessSettings.paymentTerms}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Peso Mínimo</label>
//               <p className="text-sm text-gray-900">{companyUser.businessSettings.minimumWeight} kg</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;







// src/pages/dashboard/ProfilePage.tsx - CÓDIGO COMPLETO
import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  BuildingOfficeIcon,
  PencilIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CalendarIcon,
  BanknotesIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Esquemas de validación dinámicos según tipo de usuario
const personProfileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'Ingresa un teléfono válido').optional().or(z.literal('')),
  companyName: z.string().optional(),
});

const companyProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().min(10, 'Ingresa un teléfono válido').optional().or(z.literal('')),
  companyName: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres'),
});

type ProfileFormData = z.infer<typeof personProfileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { profile, loading, error, updateProfile, uploadAvatar, isUpdating, refreshProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Determinar el tipo de perfil ANTES de usar en useForm
  const isPerson = profile?.type === 'PERSON';
  
  // Usar el esquema correcto según el tipo de usuario
  const validationSchema = isPerson ? personProfileSchema : companyProfileSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    // zodResolver puede inferir una unión; forzamos el tipo del resolver al del formulario
    resolver: zodResolver(validationSchema) as unknown as Resolver<ProfileFormData>,
    values: profile ? {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      companyName: profile.companyName || '',
    } : undefined
  });

  // Debug: Log cuando cambia el formulario
  useEffect(() => {
    console.log('📝 Form initialized with profile:', profile);
    console.log('📝 Form errors:', errors);
  }, [profile, errors]);

  // 🔍 DEBUG: Mostrar información de debug
  useEffect(() => {
    const debug = {
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!profile,
      loading,
      error,
      apiUrl: import.meta.env.VITE_API_BASE_URL || 'NOT SET',
      accessToken: localStorage.getItem('accessToken') ? 'EXISTS' : 'MISSING',
      refreshToken: localStorage.getItem('refreshToken') ? 'EXISTS' : 'MISSING',
    };
    setDebugInfo(debug);
    console.group('🔍 Profile Debug Info');
    console.table(debug);
    console.groupEnd();
  }, [isAuthenticated, user, profile, loading, error]);

  // Manejar guardado de perfil
  const onSubmit = async (data: ProfileFormData) => {
    console.group('💾 Form Submit');
    console.log('Form data received:', data);
    console.log('Current profile:', profile);
    
    try {
      // Filtrar solo campos que cambiaron y no están vacíos
      const changedData: any = {};
      if (profile?.type === 'PERSON') {
        if (data.firstName && data.firstName !== profile.firstName) {
          changedData.firstName = data.firstName;
          console.log('✅ firstName changed:', profile.firstName, '->', data.firstName);
        }
        if (data.lastName && data.lastName !== profile.lastName) {
          changedData.lastName = data.lastName;
          console.log('✅ lastName changed:', profile.lastName, '->', data.lastName);
        }
      } else {
        if (data.companyName && data.companyName !== profile?.companyName) {
          changedData.companyName = data.companyName;
          console.log('✅ companyName changed:', profile?.companyName, '->', data.companyName);
        }
      }
      if (data.phone && data.phone !== profile?.phone) {
        changedData.phone = data.phone;
        console.log('✅ phone changed:', profile?.phone, '->', data.phone);
      }

      console.log('Changed data to send:', changedData);
      console.log('Number of changes:', Object.keys(changedData).length);

      if (Object.keys(changedData).length === 0) {
        console.log('⚠️ No changes detected');
        toast('No hay cambios para guardar');
        setIsEditing(false);
        console.groupEnd();
        return;
      }

      console.log('📤 Calling updateProfile...');
      await updateProfile(changedData);
      console.log('✅ updateProfile completed');
      
      // Esperar un momento para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Closing edit mode');
      setIsEditing(false);
      console.groupEnd();
    } catch (error) {
      console.error('❌ Error in onSubmit:', error);
      console.groupEnd();
      // NO cerrar el modo de edición si hay error
    }
  };

  // Manejar cancelar edición
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Manejar cambio de avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      await uploadAvatar(file);
      await refreshProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Sesión No Activa
          </h3>
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para ver tu perfil
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Ir a Login
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 animate-pulse">Cargando perfil...</p>
        
        {/* Debug info mientras carga */}
        {debugInfo && (
          <details className="mt-8 p-4 bg-gray-50 rounded-lg text-xs">
            <summary className="cursor-pointer font-semibold">
              🔍 Debug Info (Click para ver)
            </summary>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 max-w-2xl mx-auto">
        <div className="rounded-full bg-red-100 p-4">
          <XCircleIcon className="h-12 w-12 text-red-600" />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar el perfil
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="flex space-x-3 justify-center">
            <Button onClick={refreshProfile} variant="outline">
              Reintentar
            </Button>
            <Button onClick={() => window.location.href = '/login'} variant="ghost">
              Ir a Login
            </Button>
          </div>
        </div>

        {/* Debug info detallada */}
        {debugInfo && (
          <details className="w-full mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-xs">
            <summary className="cursor-pointer font-semibold text-red-800">
              🔍 Información de Debug (Click para ver)
            </summary>
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Autenticado:</div>
                <div>{debugInfo.isAuthenticated ? '✅ Sí' : '❌ No'}</div>
                
                <div className="font-semibold">Usuario:</div>
                <div>{debugInfo.hasUser ? '✅ Existe' : '❌ No existe'}</div>
                
                <div className="font-semibold">Access Token:</div>
                <div>{debugInfo.accessToken === 'EXISTS' ? '✅ Existe' : '❌ Falta'}</div>
                
                <div className="font-semibold">Refresh Token:</div>
                <div>{debugInfo.refreshToken === 'EXISTS' ? '✅ Existe' : '❌ Falta'}</div>
                
                <div className="font-semibold">API URL:</div>
                <div className="break-all">{debugInfo.apiUrl}</div>
              </div>
            </div>
          </details>
        )}
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400" />
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se pudo cargar el perfil</p>
          <Button onClick={refreshProfile}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">
            {isPerson ? 'Gestiona tu información personal y configuraciones' : 'Gestiona la información de tu empresa'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={profile.isEmailVerified ? 'success' : 'warning'}>
            {profile.isEmailVerified ? (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Email Verificado
              </>
            ) : (
              <>
                <XCircleIcon className="h-4 w-4 mr-1" />
                Email Pendiente
              </>
            )}
          </Badge>
          <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'secondary'}>
            {profile.status === 'ACTIVE' ? 'Cuenta Activa' : profile.status}
          </Badge>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="relative w-24 h-24 group">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#a8c241] to-[#719428] rounded-full flex items-center justify-center border-4 border-gray-200">
                    {isPerson ? (
                      <UserIcon className="h-12 w-12 text-white" />
                    ) : (
                      <BuildingOfficeIcon className="h-12 w-12 text-white" />
                    )}
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingAvatar ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <CameraIcon className="h-6 w-6 text-white" />
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isPerson ? 
                    `${profile.firstName} ${profile.lastName}` : 
                    profile.companyName
                  }
                </h2>
                <Badge variant="outline" className="text-xs">
                  {isPerson ? 'PERSONA' : 'EMPRESA'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <DevicePhoneMobileIcon className="h-4 w-4 flex-shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {profile.wallet && (
              <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                <div className="text-center">
                  <BanknotesIcon className="h-5 w-5 text-[#a8c241] mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-900">
                    ${profile.wallet.balance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Balance</p>
                </div>
                
                <div className="text-center">
                  <ShoppingBagIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-900">
                    {profile._count.orders}
                  </p>
                  <p className="text-xs text-gray-600">Órdenes</p>
                </div>
                
                <div className="text-center">
                  <UserGroupIcon className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-gray-900">
                    {profile._count.referrals}
                  </p>
                  <p className="text-xs text-gray-600">Referidos</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {isPerson ? 'Información Personal' : 'Información de la Empresa'}
            </h3>
            <Button 
              variant={isEditing ? "ghost" : "outline"}
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              disabled={isUpdating}
            >
              {isEditing ? 'Cancelar' : <><PencilIcon className="h-4 w-4 mr-2" />Editar</>}
            </Button>
          </div>

          <form 
            onSubmit={(e) => {
              console.log('📋 Form onSubmit event triggered');
              handleSubmit(onSubmit)(e);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isPerson ? (
                <>
                  <Input 
                    label="Nombre" 
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    disabled={!isEditing || isUpdating}
                  />
                  <Input 
                    label="Apellido" 
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    disabled={!isEditing || isUpdating}
                  />
                </>
              ) : (
                <Input 
                  label="Nombre de la Empresa" 
                  {...register('companyName')}
                  error={errors.companyName?.message}
                  disabled={!isEditing || isUpdating}
                  className="md:col-span-2"
                />
              )}
              
              <Input 
                label="Email" 
                value={profile.email}
                disabled
                helperText="El email no se puede cambiar desde aquí"
              />
              
              <Input 
                label="Teléfono" 
                {...register('phone')}
                error={errors.phone?.message}
                disabled={!isEditing || isUpdating}
                placeholder="+593 99 999 9999"
              />

              <div className="md:col-span-2">
                <Input 
                  label="Código de Referido" 
                  value={profile.referralCode}
                  disabled
                  helperText="Comparte este código con tus amigos"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#a8c241] text-white rounded-lg hover:bg-[#8ea635] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  {isUpdating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Wallet Information */}
      {profile.wallet && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Información de Billetera
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#a8c241] to-[#719428] rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">Balance Total</p>
                <p className="text-3xl font-bold">${profile.wallet.balance.toFixed(2)}</p>
                <p className="text-xs opacity-75 mt-2">{profile.wallet.currency}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Balance Disponible</p>
                <p className="text-3xl font-bold text-blue-900">${profile.wallet.availableBalance.toFixed(2)}</p>
                <p className="text-xs text-blue-600 mt-2">Para retirar</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-700 mb-1">Balance Pendiente</p>
                <p className="text-3xl font-bold text-orange-900">${profile.wallet.pendingBalance.toFixed(2)}</p>
                <p className="text-xs text-orange-600 mt-2">En verificación</p>
              </div>
            </div>

            <div className="mt-4">
              <Badge variant={profile.wallet.status === 'ACTIVE' ? 'success' : 'secondary'}>
                Billetera {profile.wallet.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Panel (solo en desarrollo) */}
      {import.meta.env.DEV && debugInfo && (
        <details className="p-4 bg-gray-50 rounded-lg text-xs">
          <summary className="cursor-pointer font-semibold">
            🔧 Panel de Debug (Solo Desarrollo)
          </summary>
          <pre className="mt-4 overflow-auto bg-white p-4 rounded border">
            {JSON.stringify({ debugInfo, profile }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ProfilePage;