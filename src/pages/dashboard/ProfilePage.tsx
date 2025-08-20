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





// src/pages/dashboard/ProfilePage.tsx
import React, { useState } from 'react';
import { 
  UserIcon, 
  BuildingOfficeIcon,
  PencilIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import type { User, PersonProfile, CompanyProfile } from '@/types/user';
import { isPersonProfile, isCompanyProfile } from '@/types/user';
import { PersonProfileForm } from '@/components/profile/PersonProfileForm';
import { CompanyProfileForm } from '@/components/profile/CompanyProfileForm';
import { BankAccountsManager } from '@/components/profile/BankAccountsManager';
import { NotificationSettings } from '@/components/profile/NotificationSettings';
import { SecuritySettings } from '@/components/profile/SecuritySettings';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { updateProfile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'notifications' | 'security'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  // Type guards and casting
  const typedUser = user as unknown as User;
  const isPerson = isPersonProfile(typedUser);
  const isCompany = isCompanyProfile(typedUser);

  type TabId = 'personal' | 'payment' | 'notifications' | 'security';

  const tabs: { id: TabId; name: string; icon: React.ComponentType<any> }[] = [
    { 
      id: 'personal', 
      name: isPerson ? 'Información Personal' : 'Información Empresarial', 
      icon: isPerson ? UserIcon : BuildingOfficeIcon 
    },
    ...(isPerson ? [{ 
      id: 'payment' as const, 
      name: 'Métodos de Pago', 
      icon: BanknotesIcon 
    }] : []),
    { 
      id: 'notifications', 
      name: 'Notificaciones', 
      icon: BellIcon 
    },
    { 
      id: 'security', 
      name: 'Seguridad', 
      icon: ShieldCheckIcon 
    }
  ];

  const handleSave = async (data: any) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">
            {isPerson ? 'Gestiona tu información personal y configuraciones' : 'Gestiona la información de tu empresa'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={user.isVerified ? 'success' : 'warning'}>
            {user.isVerified ? 'Email Verificado' : 'Email Pendiente'}
          </Badge>
          <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
            {user.status
             === 'active' ? 'Cuenta Activa' : user.status}
          </Badge>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {isPerson ? (
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  ) : (
                    <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full p-1 h-8 w-8"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isPerson ? 
                    `${(typedUser as PersonProfile).firstName || ''} ${(typedUser as PersonProfile).lastName || ''}` : 
                    (typedUser as CompanyProfile).companyName
                  }
                </h2>
                <Badge variant="outline" className="text-xs">
                  {isPerson ? 'PERSONA' : 'EMPRESA'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center space-x-2">
                    <DevicePhoneMobileIcon className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                {isPerson && (typedUser as PersonProfile).address && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>
                      {(typedUser as PersonProfile).address?.city}, {(typedUser as PersonProfile).address?.state}
                    </span>
                  </div>
                )}
                
                {isCompany && (typedUser as CompanyProfile).businessAddress && (
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>
                      {(typedUser as CompanyProfile).businessAddress?.city}, {(typedUser as CompanyProfile).businessAddress?.state}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats for Person */}
            {isPerson && (typedUser as PersonProfile).wallet && (
              <div className="grid grid-cols-1 gap-4 text-center">
                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-primary-600">
                    ${(typedUser as PersonProfile).wallet.balance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Balance</p>
                </div>
                {(typedUser as PersonProfile).rewards && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-yellow-600">
                      {(typedUser as PersonProfile).rewards.points}
                    </p>
                    <p className="text-xs text-gray-600">Puntos</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'personal' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {isPerson ? 'Información Personal' : 'Información Empresarial'}
                </h3>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>

              {isEditing ? (
                isPerson ? (
                  <PersonProfileForm 
                    user={typedUser as PersonProfile}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <CompanyProfileForm 
                    user={typedUser as CompanyProfile}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                  />
                )
              ) : (
                <ProfileDisplayInfo user={typedUser} />
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment' && isPerson && (
          <BankAccountsManager user={typedUser as PersonProfile} />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings user={typedUser} />
        )}

        {activeTab === 'security' && (
          <SecuritySettings user={typedUser} />
        )}
      </div>
    </div>
  );
};

// Componente para mostrar información del perfil
const ProfileDisplayInfo: React.FC<{ user: User }> = ({ user }) => {
  const isPerson = isPersonProfile(user);

  if (isPerson) {
    const personUser = user as PersonProfile;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Información Personal</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <p className="text-sm text-gray-900">
                {personUser.firstName || ''} {personUser.lastName || ''}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{personUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <p className="text-sm text-gray-900">{personUser.phone || 'No especificado'}</p>
            </div>
            {personUser.identificationNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Identificación</label>
                <p className="text-sm text-gray-900">
                  {personUser.identificationType}: {personUser.identificationNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Dirección</h4>
          {personUser.address ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <p className="text-sm text-gray-900">{personUser.address.street}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <p className="text-sm text-gray-900">
                  {personUser.address.city}, {personUser.address.state}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                <p className="text-sm text-gray-900">{personUser.address.zipCode}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No hay dirección registrada</p>
          )}
        </div>

        {/* Wallet Info */}
        {personUser.wallet && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Billetera Virtual</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Balance Actual</label>
                <p className="text-sm text-gray-900">${personUser.wallet.balance.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Ganado</label>
                <p className="text-sm text-gray-900">${personUser.wallet.totalEarnings.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <Badge variant={personUser.wallet.isActive ? 'success' : 'secondary'}>
                  {personUser.wallet.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Info */}
        {personUser.rewards && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Puntos y Recompensas</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Puntos Actuales</label>
                <p className="text-sm text-gray-900">{personUser.rewards.points}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nivel</label>
                <Badge variant="outline">{personUser.rewards.tier.toUpperCase()}</Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Ganados</label>
                <p className="text-sm text-gray-900">{personUser.rewards.totalPointsEarned}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Company profile display
  const companyUser = user as CompanyProfile;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Información de la Empresa</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Comercial</label>
            <p className="text-sm text-gray-900">{companyUser.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Razón Social</label>
            <p className="text-sm text-gray-900">{companyUser.legalName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">RUC / Tax ID</label>
            <p className="text-sm text-gray-900">{companyUser.taxId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Industria</label>
            <p className="text-sm text-gray-900">{companyUser.industry}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tamaño</label>
            <Badge variant="outline">{companyUser.companySize.toUpperCase()}</Badge>
          </div>
        </div>
      </div>

      {companyUser.legalRepresentative && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Representante Legal</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="text-sm text-gray-900">
                {companyUser.legalRepresentative.firstName} {companyUser.legalRepresentative.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cargo</label>
              <p className="text-sm text-gray-900">{companyUser.legalRepresentative.position}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{companyUser.legalRepresentative.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <p className="text-sm text-gray-900">{companyUser.legalRepresentative.phone}</p>
            </div>
          </div>
        </div>
      )}

      {companyUser.businessAddress && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Dirección Comercial</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <p className="text-sm text-gray-900">{companyUser.businessAddress.street}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <p className="text-sm text-gray-900">
                {companyUser.businessAddress.city}, {companyUser.businessAddress.state}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Postal</label>
              <p className="text-sm text-gray-900">{companyUser.businessAddress.zipCode}</p>
            </div>
          </div>
        </div>
      )}

      {companyUser.businessSettings && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Configuración Comercial</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Contrato</label>
              <Badge variant="outline">{companyUser.businessSettings.contractType.toUpperCase()}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Términos de Pago</label>
              <p className="text-sm text-gray-900">{companyUser.businessSettings.paymentTerms}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Peso Mínimo</label>
              <p className="text-sm text-gray-900">{companyUser.businessSettings.minimumWeight} kg</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;