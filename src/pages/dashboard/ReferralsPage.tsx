import React, { useState } from 'react';
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
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  PlusIcon,
  QrCodeIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  TrophyIcon,
  GiftIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { useReferrals } from '@/hooks/useReferrals';
import { InviteFriendsModal } from '@/components/referrals/InviteFriendsModal';
import { ReferralLeaderboardModal } from '@/components/referrals/ReferralLeaderboardModal';

const ReferralsPage: React.FC = () => {
  const {
    stats,
    currentTierInfo,
    tierInfo,
    referralCode,
    referralLink,
    referrals,
    earnings,
    loading,
    copyReferralCode,
    copyReferralLink,
    shareOnPlatform,
    filterReferralsByStatus,
    searchReferrals,
    formatCurrency,
    formatDate,
    getStatusInfo
  } = useReferrals();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Referidos"
          description="Invita amigos y gana recompensas"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando datos de referidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programa de Referidos"
        description="Invita amigos y gana dinero por cada referido activo"
        action={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLeaderboardModal(true)}
              leftIcon={<TrophyIcon className="h-4 w-4" />}
            >
              Ranking
            </Button>
            <Button
              onClick={() => setShowInviteModal(true)}
              leftIcon={<UserPlusIcon className="h-4 w-4" />}
            >
              Invitar Amigos
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Referidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalReferrals || 0}
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.activeReferrals || 0}
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ganado</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats?.totalEarnings || 0)}
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats?.pendingEarnings || 0)}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code & Link Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GiftIcon className="h-5 w-5 text-primary-600" />
              Tu Código de Referido
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <code className="text-lg font-mono font-bold text-primary-600">
                    {referralCode?.code || 'LOADING...'}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyReferralCode}
                  leftIcon={<ClipboardDocumentIcon className="h-4 w-4" />}
                >
                  Copiar
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Usos:</strong> {referralCode?.usageCount || 0} / {referralCode?.maxUsage || 100}</p>
                <p className="mt-1">Comparte este código con tus amigos para que obtengan un bono de bienvenida.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShareIcon className="h-5 w-5 text-primary-600" />
              Enlace de Invitación
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border text-sm">
                  <span className="text-gray-700">
                    {referralLink?.shortUrl || 'Loading...'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyReferralLink}
                  leftIcon={<ClipboardDocumentIcon className="h-4 w-4" />}
                >
                  Copiar
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnPlatform('whatsapp')}
                  className="flex-1"
                >
                  <DevicePhoneMobileIcon className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnPlatform('email')}
                  className="flex-1"
                >
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnPlatform('facebook')}
                  className="flex-1"
                >
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  Redes
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Clicks:</strong> {referralLink?.clickCount || 0} | <strong>Conversiones:</strong> {referralLink?.conversionCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      {stats && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-2xl">{currentTierInfo.icon}</span>
                Nivel Actual: {currentTierInfo.name}
              </h3>
              <Badge variant="outline" className={`${currentTierInfo.color}`}>
                Bono {currentTierInfo.bonus}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progreso al siguiente nivel</span>
                <span>{stats.nextTierProgress.current} / {stats.nextTierProgress.required} referidos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.nextTierProgress.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Te faltan <strong>{stats.nextTierReferralsNeeded}</strong> referidos más para alcanzar el nivel{' '}
                <strong>{stats.nextTierName}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats?.conversionRateFormatted || '0%'}
            </div>
            <p className="text-sm text-gray-600">Tasa de Conversión</p>
            <p className="text-xs text-gray-500 mt-1">% de invitados que se registran</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats?.activationRateFormatted || '0%'}
            </div>
            <p className="text-sm text-gray-600">Tasa de Activación</p>
            <p className="text-xs text-gray-500 mt-1">% que hacen su primera venta</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(stats?.averageEarningsPerReferral || 0)}
            </div>
            <p className="text-sm text-gray-600">Promedio por Referido</p>
            <p className="text-xs text-gray-500 mt-1">Ganancia promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-lg font-semibold">Mis Referidos ({referrals.length})</h3>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:w-64">
                  <Input
                    placeholder="Buscar referido..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      searchReferrals(e.target.value);
                    }}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(String(value));
                    filterReferralsByStatus(String(value));
                  }}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'active', label: 'Activos' },
                    { value: 'registered', label: 'Registrados' },
                    { value: 'pending', label: 'Pendientes' }
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {referrals.length === 0 ? (
              <div className="p-12 text-center">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Aún no tienes referidos</p>
                <p className="text-sm text-gray-400 mb-4">
                  Invita a tus amigos y empieza a ganar dinero
                </p>
                <Button onClick={() => setShowInviteModal(true)}>
                  Invitar Amigos
                </Button>
              </div>
            ) : (
              referrals.map((referral) => {
                const statusInfo = getStatusInfo(referral.status);
                return (
                  <div key={referral.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          {referral.avatar ? (
                            <img
                              src={referral.avatar}
                              alt={`${referral.firstName} ${referral.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary-600 font-medium">
                              {referral.firstName[0]}{referral.lastName[0]}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {referral.firstName} {referral.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{referral.email}</p>
                          <p className="text-xs text-gray-400">
                            Registrado: {formatDate(referral.registeredAt)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={statusInfo.color as any}>
                            {statusInfo.label}
                          </Badge>
                          <span className="text-2xl">{tierInfo[referral.tier].icon}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(referral.totalEarnings)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.totalOrders} órdenes
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <InviteFriendsModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        referralCode={referralCode?.code || ''}
        referralLink={referralLink?.shortUrl || ''}
      />

      <ReferralLeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
      />
    </div>
  );
};

export default ReferralsPage;