// src/components/referrals/ReferralLeaderboardModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  Button,
  Badge,
  Select
} from '@/components/ui';
import {
  TrophyIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useReferralStore } from '@/stores/useReferralStore';
import { ReferralLeaderboard } from '@/types/referral';

interface ReferralLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralLeaderboardModal: React.FC<ReferralLeaderboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { fetchLeaderboard, leaderboard, loading } = useReferralStore();
  const [selectedPeriod, setSelectedPeriod] = useState<ReferralLeaderboard['period']>('monthly');

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard(selectedPeriod);
    }
  }, [isOpen, selectedPeriod, fetchLeaderboard]);

  const handlePeriodChange = (value: string | number) => {
    setSelectedPeriod(value as ReferralLeaderboard['period']);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">#{rank}</span>
          </div>
        );
    }
  };

  const getTierIcon = (tier: string) => {
    const tierIcons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎',
      diamond: '💍'
    };
    return tierIcons[tier as keyof typeof tierIcons] || '🥉';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const periodLabels = {
    weekly: 'Esta Semana',
    monthly: 'Este Mes',
    quarterly: 'Este Trimestre',
    yearly: 'Este Año',
    all_time: 'Todo el Tiempo'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ranking de Referidos" size="lg">
      <ModalContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tabla de Posiciones
            </h3>
            <p className="text-gray-600">
              Compite con otros usuarios y gana premios especiales
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex justify-center">
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              options={Object.entries(periodLabels).map(([value, label]) => ({
                value,
                label
              }))}
            />
          </div>

          {/* User Position Banner */}
          {leaderboard?.userPosition && (
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary-900">Tu Posición</h4>
                  <p className="text-sm text-primary-700">
                    #{leaderboard.userPosition} de {leaderboard.totalParticipants} participantes
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    #{leaderboard.userPosition}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Cargando ranking...</p>
              </div>
            ) : leaderboard?.entries?.length === 0 ? (
              <div className="text-center py-8">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay datos para este período</p>
              </div>
            ) : (
              leaderboard?.entries?.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    entry.userId === 'user_123' // Usuario actual
                      ? 'border-primary-200 bg-primary-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.userName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {entry.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {entry.userName}
                              {entry.userId === 'user_123' && (
                                <span className="text-primary-600"> (Tú)</span>
                              )}
                            </h4>
                            {entry.badge && (
                              <span className="text-lg">{entry.badge}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <span className="mr-1">{getTierIcon(entry.tier)}</span>
                              {entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mb-1">
                        <UserGroupIcon className="h-4 w-4 text-blue-500" />
                        <span>{entry.referralCount} referidos</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                        <span>{formatCurrency(entry.earnings)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rewards Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-yellow-600" />
              Premios del Ranking
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl mb-1">🥇</div>
                <div className="text-xs font-medium text-gray-900">1er Lugar</div>
                <div className="text-xs text-gray-600">$500 bonus</div>
              </div>
              <div>
                <div className="text-2xl mb-1">🥈</div>
                <div className="text-xs font-medium text-gray-900">2do Lugar</div>
                <div className="text-xs text-gray-600">$300 bonus</div>
              </div>
              <div>
                <div className="text-2xl mb-1">🥉</div>
                <div className="text-xs font-medium text-gray-900">3er Lugar</div>
                <div className="text-xs text-gray-600">$200 bonus</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Los premios se otorgan al final de cada mes
            </p>
          </div>

          {/* Competition Rules */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">📋 Reglas del Ranking</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Solo cuentan referidos activos (con al menos una venta)</li>
              <li>• El ranking se actualiza en tiempo real</li>
              <li>• Premios se pagan el primer día del mes siguiente</li>
              <li>• Los empates se resuelven por fecha de registro</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={onClose}
              leftIcon={<UserGroupIcon className="h-4 w-4" />}
            >
              ¡Invitar más amigos!
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};