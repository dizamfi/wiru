// src/components/analytics/GoalsProgress.tsx
import React, { useState } from 'react';
import { Card, CardContent, Button, ProgressBar, CircularProgress, Badge } from '@/components/ui';
import {
  CalendarDaysIcon,
  TrophyIcon,
  PlusIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { GoalsProgress as GoalsProgressType } from '@/types/analytics';
import Skeleton from 'react-loading-skeleton';

interface GoalsProgressProps {
  goals: GoalsProgressType | undefined;
  loading: boolean;
  onUpdateGoal?: (type: 'monthly' | 'quarterly' | 'yearly', target: number) => void;
}

export const GoalsProgress: React.FC<GoalsProgressProps> = ({
  goals,
  loading,
  onUpdateGoal
}) => {
  const [editingGoal, setEditingGoal] = useState<'monthly' | 'quarterly' | 'yearly' | null>(null);
  const [newTarget, setNewTarget] = useState<number>(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGoalStatus = (percentage: number, onTrack: boolean) => {
    if (percentage >= 100) return { status: 'completed', color: 'green', icon: CheckCircleIcon };
    if (percentage >= 80 && onTrack) return { status: 'on-track', color: 'blue', icon: TagIcon };
    if (percentage >= 50 && onTrack) return { status: 'progressing', color: 'yellow', icon: ClockIcon };
    return { status: 'at-risk', color: 'red', icon: ExclamationTriangleIcon };
  };

  const getStatusBadge = (percentage: number, onTrack: boolean) => {
    const { status } = getGoalStatus(percentage, onTrack);

    type StatusKey = 'completed' | 'on-track' | 'progressing' | 'at-risk';

    const variants: Record<StatusKey, string> = {
      completed: 'bg-green-100 text-green-800',
      'on-track': 'bg-blue-100 text-blue-800',
      progressing: 'bg-yellow-100 text-yellow-800',
      'at-risk': 'bg-red-100 text-red-800'
    };

    const labels: Record<StatusKey, string> = {
      completed: 'Completada',
      'on-track': 'En camino',
      progressing: 'En progreso',
      'at-risk': 'En riesgo'
    };

    return (
      <Badge className={variants[status as StatusKey]}>
        {labels[status as StatusKey]}
      </Badge>
    );
  };

  const handleEditGoal = (type: 'monthly' | 'quarterly' | 'yearly', currentTarget: number) => {
    setEditingGoal(type);
    setNewTarget(currentTarget);
  };

  const handleSaveGoal = () => {
    if (editingGoal && onUpdateGoal) {
      onUpdateGoal(editingGoal, newTarget);
      setEditingGoal(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setNewTarget(0);
  };

  if (loading || !goals) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton height={24} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton height={200} />
                  <Skeleton height={100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const goalCards = [
    {
      type: 'monthly' as const,
      title: 'Meta Mensual',
      data: goals.monthly,
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      color: 'blue',
      period: 'este mes'
    },
    {
      type: 'quarterly' as const,
      title: 'Meta Trimestral',
      data: goals.quarterly,
      icon: <TagIcon className="h-6 w-6" />,
      color: 'purple',
      period: 'este trimestre'
    },
    {
      type: 'yearly' as const,
      title: 'Meta Anual',
      data: goals.yearly,
      icon: <TrophyIcon className="h-6 w-6" />,
      color: 'yellow',
      period: 'este año'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Metas y Objetivos</h2>
              <p className="text-gray-600">Sigue tu progreso hacia tus objetivos financieros</p>
            </div>
            <Button
              variant="default"
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Nueva Meta
            </Button>
          </div>

          {/* Overall Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-green-800">Metas Completadas</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {goalCards.filter(goal => goal.data.percentage >= 100).length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <TagIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-blue-800">En Camino</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {goalCards.filter(goal => goal.data.onTrack && goal.data.percentage < 100).length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800">Progreso Total</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {((goals.monthly.percentage + goals.quarterly.percentage + goals.yearly.percentage) / 3).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Goal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {goalCards.map((goal) => {
          const { status, color, icon: StatusIcon } = getGoalStatus(goal.data.percentage, goal.data.onTrack);
          const isEditing = editingGoal === goal.type;

          return (
            <Card key={goal.type} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${goal.color}-100`}>
                      <div className={`text-${goal.color}-600`}>
                        {goal.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">{goal.period}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditGoal(goal.type, goal.data.target)}
                    leftIcon={<PencilIcon className="h-3 w-3" />}
                  >
                    Editar
                  </Button>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    value={goal.data.percentage}
                    size={120}
                    variant={color === 'blue' ? 'info' : color === 'purple' ? 'default' : color as any}
                    showLabel
                  />
                </div>

                {/* Goal Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Meta:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newTarget}
                          onChange={(e) => setNewTarget(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-sm border rounded"
                        />
                        <Button size="sm" onClick={handleSaveGoal}>✓</Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>✕</Button>
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(goal.data.target)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Actual:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(goal.data.current)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Restante:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(goal.data.target - goal.data.current)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Días restantes:</span>
                    <span className="font-semibold text-gray-900">
                      {goal.data.remainingDays}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <ProgressBar
                    value={goal.data.percentage}
                    variant={
                      goal.data.percentage >= 100 ? 'success' :
                      goal.data.onTrack ? 'info' : 'warning'
                    }
                    showLabel
                    className="mb-2"
                  />
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mt-4">
                  {getStatusBadge(goal.data.percentage, goal.data.onTrack)}
                  <div className="flex items-center gap-1 text-gray-500">
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-xs">
                      {goal.data.onTrack ? 'Alcanzable' : 'Requiere esfuerzo'}
                    </span>
                  </div>
                </div>

                {/* Insights */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-600">
                    {goal.data.percentage >= 100 ? (
                      <span className="text-green-600 font-medium">
                        🎉 ¡Meta completada! Excelente trabajo.
                      </span>
                    ) : goal.data.onTrack ? (
                      <span className="text-blue-600">
                        📈 Vas por buen camino. Necesitas {formatCurrency((goal.data.target - goal.data.current) / goal.data.remainingDays)} por día.
                      </span>
                    ) : (
                      <span className="text-amber-600">
                        ⚡ Acelera el ritmo. Necesitas {formatCurrency((goal.data.target - goal.data.current) / goal.data.remainingDays)} por día.
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Goal Achievement Timeline */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Línea de Tiempo de Metas</h3>
          
          <div className="space-y-6">
            {goalCards.map((goal, index) => {
              const isCompleted = goal.data.percentage >= 100;
              const isOnTrack = goal.data.onTrack;
              
              return (
                <div key={goal.type} className="flex items-center gap-6">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      isCompleted ? 'bg-green-500' : 
                      isOnTrack ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    {index < goalCards.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                    )}
                  </div>
                  
                  {/* Goal info */}
                  <div className="flex-1 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(goal.data.current)} de {formatCurrency(goal.data.target)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {goal.data.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {goal.data.remainingDays} días restantes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority recommendation */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <TagIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Prioridad Alta</h4>
                  <p className="text-sm text-blue-700">
                    {goals.monthly.onTrack ? 
                      "Mantén el ritmo actual para alcanzar tu meta mensual." :
                      "Concéntrate en aumentar las ventas para la meta mensual."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Strategy recommendation */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Estrategia</h4>
                  <p className="text-sm text-green-700">
                    {goals.yearly.percentage < 50 ?
                      "Considera aumentar el volumen de dispositivos reciclados." :
                      "Excelente progreso en tus metas a largo plazo."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action items */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Acciones Sugeridas</h4>
            <ul className="space-y-2">
              {!goals.monthly.onTrack && (
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Incrementar frecuencia de reciclaje para cumplir meta mensual
                </li>
              )}
              {goals.quarterly.percentage > 80 && (
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  ¡Excelente progreso trimestral! Mantén el momentum
                </li>
              )}
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Revisa tus metas mensualmente para ajustar estrategias
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};