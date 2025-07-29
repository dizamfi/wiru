import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout';
import { 
  Card, 
  CardContent, 
  Button, 
  Input, 
  Badge,
  Select
} from '@/components/ui';
import {
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { WithdrawalModal } from '@/components/payments/WithdrawalModal';

// Mock data temporal hasta que tengas el hook funcionando
const mockData = {
  transactions: [
    {
      id: 'txn_001',
      orderId: 'ORD-2024-001',
      amount: 245.50,
      currency: 'USD',
      status: 'completed',
      type: 'sale',
      method: 'bank_transfer',
      description: 'Venta de iPhone 12 Pro',
      date: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-16T14:20:00Z',
      bankAccount: {
        name: 'Juan Pérez',
        bank: 'Banco Nacional',
        account: '****-4532'
      },
      metadata: {
        deviceType: 'smartphone',
        weight: 0.2
      }
    },
    {
      id: 'txn_002',
      orderId: 'ORD-2024-002',
      amount: 120.00,
      currency: 'USD',
      status: 'processing',
      type: 'sale',
      method: 'bank_transfer',
      description: 'Venta de laptop Dell',
      date: '2024-01-14T09:15:00Z',
      metadata: {
        deviceType: 'laptop',
        weight: 2.1
      }
    },
    {
      id: 'txn_003',
      orderId: 'REF-2024-001',
      amount: 25.00,
      currency: 'USD',
      status: 'completed',
      type: 'referral',
      method: 'bank_transfer',
      description: 'Bono por referido - María González',
      date: '2024-01-13T16:45:00Z',
      completedAt: '2024-01-14T10:30:00Z',
      metadata: {
        referralCode: 'REF-MG-001'
      }
    },
    {
      id: 'txn_004',
      orderId: 'ORD-2024-003',
      amount: 89.75,
      currency: 'USD',
      status: 'pending',
      type: 'sale',
      method: 'bank_transfer',
      description: 'Venta de tablet Samsung',
      date: '2024-01-12T14:20:00Z',
      metadata: {
        deviceType: 'tablet',
        weight: 0.5
      }
    },
    {
      id: 'txn_005',
      orderId: 'ORD-2024-004',
      amount: 156.30,
      currency: 'USD',
      status: 'failed',
      type: 'sale',
      method: 'bank_transfer',
      description: 'Venta de consola PlayStation',
      date: '2024-01-11T11:10:00Z',
      metadata: {
        deviceType: 'gaming',
        weight: 3.2
      }
    }
  ],
  stats: {
    totalEarnings: 1247.85,
    availableForWithdrawal: 845.60,
    pendingAmount: 209.75,
    completedThisMonth: 390.50,
    totalTransactions: 23
  }
};

const PaymentsPage: React.FC = () => {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data
  const { transactions, stats } = mockData;
  const loading = false;
  const canRequestWithdrawal = stats.availableForWithdrawal >= 10;

  // Filtrar transacciones
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [transactions, searchTerm, statusFilter, typeFilter]);

  // Helper functions
  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'failed':
        return 'danger';
      case 'cancelled':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <CreditCardIcon className="h-5 w-5 text-blue-500" />;
      case 'referral':
        return <span className="text-lg">👥</span>;
      case 'bonus':
        return <span className="text-lg">🎁</span>;
      case 'refund':
        return <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <BanknotesIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const exportToPDF = () => {
    console.log('Exportar a PDF');
    // Aquí iría la lógica de exportación
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos y Transferencias"
        description="Gestiona tus ganancias, historial de pagos y métodos de retiro"
        action={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={exportToPDF}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Exportar
            </Button>
            <Button
              onClick={() => setShowWithdrawalModal(true)}
              disabled={!canRequestWithdrawal}
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
            >
              Solicitar Retiro
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ganado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponible</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.availableForWithdrawal)}
                </p>
              </div>
              <CreditCardIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.completedThisMonth)}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transacciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTransactions}
                </p>
              </div>
              <DocumentArrowDownIcon className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por descripción u orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select 
                value={statusFilter} 
                onChange={(value) => setStatusFilter(value as string)}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'completed', label: 'Completados' },
                  { value: 'processing', label: 'Procesando' },
                  { value: 'pending', label: 'Pendientes' },
                  { value: 'failed', label: 'Fallidos' }
                ]}
              />

              <Select 
                value={typeFilter} 
                onChange={(value) => setTypeFilter(value as string)}
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'sale', label: 'Ventas' },
                  { value: 'referral', label: 'Referidos' },
                  { value: 'bonus', label: 'Bonos' },
                  { value: 'refund', label: 'Reembolsos' }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                  <div className="col-span-1">Tipo</div>
                  <div className="col-span-3">Descripción</div>
                  <div className="col-span-2">Fecha</div>
                  <div className="col-span-2">Monto</div>
                  <div className="col-span-2">Estado</div>
                  <div className="col-span-2">Acciones</div>
                </div>
              </div>

              {/* Transactions */}
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-500">Cargando transacciones...</p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-500">No se encontraron transacciones</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            {getTypeIcon(transaction.type)}
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">#{transaction.orderId}</p>
                            {transaction.metadata?.weight && (
                              <p className="text-xs text-gray-400">
                                Peso: {transaction.metadata.weight}kg
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div>
                            <p className="text-sm text-gray-900">{formatDate(transaction.date)}</p>
                            {transaction.completedAt && (
                              <p className="text-xs text-gray-500">
                                Completado: {formatDate(transaction.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </p>
                          {transaction.bankAccount && (
                            <p className="text-xs text-gray-500">
                              {transaction.bankAccount.bank} {transaction.bankAccount.account}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            <Badge variant={getStatusColor(transaction.status) as any}>
                              {transaction.status === 'completed' && 'Completado'}
                              {transaction.status === 'processing' && 'Procesando'}
                              {transaction.status === 'pending' && 'Pendiente'}
                              {transaction.status === 'failed' && 'Fallido'}
                              {transaction.status === 'cancelled' && 'Cancelado'}
                            </Badge>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<EyeIcon className="h-3 w-3" />}
                            >
                              Ver
                            </Button>
                            {transaction.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<DocumentArrowDownIcon className="h-3 w-3" />}
                              >
                                PDF
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredTransactions.length} de {transactions.length} transacciones
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        availableAmount={stats.availableForWithdrawal}
      />
    </div>
  );
};

export default PaymentsPage;