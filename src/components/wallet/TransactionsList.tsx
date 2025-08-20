// src/components/wallet/TransactionsList.tsx
import React, { useState } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/currency';

export interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'fee' | 'bonus' | 'refund';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  orderId?: string;
  withdrawalId?: string;
  metadata?: {
    bankAccount?: string;
    fee?: number;
    method?: string;
    reference?: string;
  };
}

interface TransactionsListProps {
  transactions: Transaction[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  loading = false,
  onLoadMore,
  hasMore = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filtros
  const typeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'earning', label: 'Ganancias' },
    { value: 'withdrawal', label: 'Retiros' },
    { value: 'fee', label: 'Comisiones' },
    { value: 'bonus', label: 'Bonos' },
    { value: 'refund', label: 'Reembolsos' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'completed', label: 'Completado' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'failed', label: 'Fallido' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const dateOptions = [
    { value: 'all', label: 'Todo el tiempo' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Últimos 3 meses' },
    { value: 'year', label: 'Este año' }
  ];

  // Función para filtrar transacciones
  const filteredTransactions = transactions.filter(transaction => {
    // Filtro por búsqueda
    const matchesSearch = !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por tipo
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;

    // Filtro por estado
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

    // Filtro por fecha
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          matchesDate = transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= quarterAgo;
          break;
        case 'year':
          matchesDate = transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Función para obtener el icono según el tipo
  const getTransactionIcon = (type: Transaction['type'], amount: number) => {
    const isPositive = amount > 0;
    
    switch (type) {
      case 'earning':
      case 'bonus':
      case 'refund':
        return <ArrowDownIcon className="h-5 w-5 text-green-600" />;
      case 'withdrawal':
      case 'fee':
        return <ArrowUpIcon className="h-5 w-5 text-red-600" />;
      default:
        return isPositive ? 
          <ArrowDownIcon className="h-5 w-5 text-green-600" /> :
          <ArrowUpIcon className="h-5 w-5 text-red-600" />;
    }
  };

  // Función para obtener el color del estado
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  // Función para obtener el texto del tipo
  const getTypeLabel = (type: Transaction['type']) => {
    const labels = {
      earning: 'Ganancia',
      withdrawal: 'Retiro',
      fee: 'Comisión',
      bonus: 'Bono',
      refund: 'Reembolso'
    };
    return labels[type] || type;
  };

  // Función para obtener el texto del estado
  const getStatusLabel = (status: Transaction['status']) => {
    const labels = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Historial de Transacciones</h3>
          <Badge variant="outline">
            {filteredTransactions.length} transacciones
          </Badge>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
          />
        </div>

        {/* Transactions list */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            {transactions.length === 0 ? (
              <>
                <ArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No tienes transacciones aún</p>
                <p className="text-sm text-gray-500">
                  Tus ganancias y retiros aparecerán aquí
                </p>
              </>
            ) : (
              <>
                <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No se encontraron transacciones</p>
                <p className="text-sm text-gray-500">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Left side - Icon and details */}
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTransactionIcon(transaction.type, transaction.amount)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(transaction.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>
                        {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                      {transaction.orderId && (
                        <span>Orden: {transaction.orderId}</span>
                      )}
                      
                      {transaction.metadata?.reference && (
                        <span>Ref: {transaction.metadata.reference}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Amount and status */}
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    {getStatusIcon(transaction.status)}
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    <Badge variant={
                      transaction.status === 'completed' ? 'success' :
                      transaction.status === 'pending' ? 'warning' :
                      'danger'
                    } className="text-xs">
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  </div>
                  
                  {/* Fee info */}
                  {transaction.metadata?.fee && (
                    <p className="text-xs text-gray-500 mt-1">
                      Comisión: {formatCurrency(transaction.metadata.fee)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={onLoadMore}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Cargar más transacciones'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};