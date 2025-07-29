import React from 'react';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información personal"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
            <div className="space-y-4">
              <Input 
                label="Nombre" 
                defaultValue={user?.firstName} 
                disabled 
              />
              <Input 
                label="Apellido" 
                defaultValue={user?.lastName} 
                disabled 
              />
              <Input 
                label="Email" 
                defaultValue={user?.email} 
                disabled 
              />
              <Button variant="outline">Editar Información</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configuración de Cuenta</h3>
            <div className="space-y-4">
              <Button variant="outline" fullWidth>Cambiar Contraseña</Button>
              <Button variant="outline" fullWidth>Configurar Pagos</Button>
              <Button variant="outline" fullWidth>Preferencias de Notificaciones</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;