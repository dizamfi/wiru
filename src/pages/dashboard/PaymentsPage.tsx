import React from 'react';
import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';

const PaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        description="Historial de pagos y transferencias"
      />
      
      <Card>
        <CardContent className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Página en desarrollo
          </h3>
          <p className="text-gray-600">
            Esta página estará disponible próximamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;