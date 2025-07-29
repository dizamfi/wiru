import React, { useState } from 'react';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Modal,
  ModalContent,
  ModalFooter,
  Badge,
  LoadingSpinner,
  Alert
} from './index';
import { UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const ComponentShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Componentes UI</h1>
      
      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Botones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button leftIcon={<UserIcon className="h-4 w-4" />}>With Icon</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <Input 
              label="Email" 
              type="email" 
              placeholder="tu@email.com"
              leftIcon={<UserIcon className="h-4 w-4" />}
            />
            <Input 
              label="Contraseña" 
              type="password" 
              placeholder="••••••••"
              showPasswordToggle
            />
            <Input 
              label="Búsqueda" 
              placeholder="Buscar..."
              rightIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
            <Input 
              label="Campo con error" 
              error="Este campo es requerido"
              variant="error"
            />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Spinners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
            <LoadingSpinner text="Cargando datos..." />
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Card>
        <CardHeader>
          <CardTitle>Modal</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setModalOpen(true)}>
            Abrir Modal
          </Button>
          
          <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)}
            title="Modal de ejemplo"
          >
            <ModalContent>
              <p>Este es el contenido del modal. Puedes colocar cualquier cosa aquí.</p>
            </ModalContent>
            <ModalFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setModalOpen(false)}>
                Confirmar
              </Button>
            </ModalFooter>
          </Modal>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alertVisible && (
        <Alert 
          variant="success" 
          title="¡Éxito!" 
          dismissible
          onDismiss={() => setAlertVisible(false)}
        >
          Los componentes UI han sido creados correctamente.
        </Alert>
      )}
    </div>
  );
};