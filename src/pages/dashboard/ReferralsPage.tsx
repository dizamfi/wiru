import React from 'react';
import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';

const ReferralsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Referidos"
        description="Invita amigos y gana recompensas"
      />
      
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Página en desarrollo
          </h3>
          <p className="text-gray-600">
            Sistema de referidos próximamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;