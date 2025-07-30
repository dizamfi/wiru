// import React, { useState } from 'react';
// import { 
//   ChartBarIcon,
//   CalendarIcon,
//   ArrowTrendingUpIcon,
//   ScaleIcon,
//   CurrencyDollarIcon,
//   DevicePhoneMobileIcon
// } from '@heroicons/react/24/outline';
// import { Card, CardContent, Badge, ProgressBar } from '@/components/ui';
// import { PageHeader } from '@/components/layout';

// // Mock data for charts
// const mockMonthlyData = [
//   { month: 'Jul', earnings: 450, orders: 6, kg: 12.5 },
//   { month: 'Ago', earnings: 650, orders: 8, kg: 18.2 },
//   { month: 'Sep', earnings: 820, orders: 10, kg: 22.1 },
//   { month: 'Oct', earnings: 920, orders: 12, kg: 28.4 },
//   { month: 'Nov', earnings: 1150, orders: 14, kg: 35.7 },
//   { month: 'Dic', earnings: 1234, orders: 15, kg: 45.6 },
// ];

// const mockCategoryData = [
//   { category: 'Smartphones', count: 8, earnings: 3200, percentage: 40 },
//   { category: 'Laptops', count: 4, earnings: 2800, percentage: 35 },
//   { category: 'Tablets', count: 3, earnings: 1200, percentage: 15 },
//   { category: 'Gaming', count: 2, earnings: 800, percentage: 10 },
// ];

// const mockEnvironmentalImpact = {
//   co2Avoided: 91.2, // kg CO2
//   energySaved: 450, // kWh
//   waterSaved: 2300, // litros
//   treesEquivalent: 4.1,
// };

// const SimpleBarChart: React.FC<{
//   data: Array<{ month: string; value: number }>;
//   color: string;
//   label: string;
// }> = ({ data, color, label }) => {
//   const maxValue = Math.max(...data.map(d => d.value));
  
//   return (
//     <div className="space-y-2">
//       <p className="text-sm font-medium text-gray-700">{label}</p>
//       <div className="flex items-end space-x-2 h-32">
//         {data.map((item, index) => (
//           <div key={item.month} className="flex-1 flex flex-col items-center">
//             <div 
//               className={`w-full ${color} rounded-t transition-all duration-300 hover:opacity-80`}
//               style={{ 
//                 height: `${(item.value / maxValue) * 100}%`,
//                 minHeight: '4px'
//               }}
//             />
//             <span className="text-xs text-gray-500 mt-1">{item.month}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const StatsPage: React.FC = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year'>('6months');

//   const totalEarnings = mockMonthlyData.reduce((sum, data) => sum + data.earnings, 0);
//   const totalOrders = mockMonthlyData.reduce((sum, data) => sum + data.orders, 0);
//   const totalKg = mockMonthlyData.reduce((sum, data) => sum + data.kg, 0);
//   const averagePerOrder = totalEarnings / totalOrders;

//   const earningsData = mockMonthlyData.map(d => ({ month: d.month, value: d.earnings }));
//   const ordersData = mockMonthlyData.map(d => ({ month: d.month, value: d.orders }));
//   const kgData = mockMonthlyData.map(d => ({ month: d.month, value: d.kg }));

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Estadísticas"
//         description="Análisis detallado de tu actividad de reciclaje"
//         action={
//           <select 
//             value={selectedPeriod}
//             onChange={(e) => setSelectedPeriod(e.target.value as any)}
//             className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//           >
//             <option value="3months">Últimos 3 meses</option>
//             <option value="6months">Últimos 6 meses</option>
//             <option value="1year">Último año</option>
//           </select>
//         }
//       />

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardContent className="p-6 text-center">
//             <CurrencyDollarIcon className="h-8 w-8 text-success-600 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
//             <p className="text-sm text-gray-600">Total ganado</p>
//             <p className="text-xs text-success-600 mt-1">+15.3% vs período anterior</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6 text-center">
//             <ChartBarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
//             <p className="text-sm text-gray-600">Órdenes completetas</p>
//             <p className="text-xs text-primary-600 mt-1">Promedio: ${Math.round(averagePerOrder)}/orden</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6 text-center">
//             <ScaleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-gray-900">{totalKg} kg</p>
//             <p className="text-sm text-gray-600">Total reciclado</p>
//             <p className="text-xs text-purple-600 mt-1">Promedio: {(totalKg / totalOrders).toFixed(1)} kg/orden</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6 text-center">
//             <ArrowTrendingUpIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
//             <p className="text-2xl font-bold text-gray-900">85%</p>
//             <p className="text-sm text-gray-600">Tasa de éxito</p>
//             <p className="text-xs text-orange-600 mt-1">+5% vs mes anterior</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <SimpleBarChart 
//               data={earningsData}
//               color="bg-success-600"
//               label="Ganancias mensuales ($)"
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <SimpleBarChart 
//               data={ordersData}
//               color="bg-primary-600"
//               label="Órdenes por mes"
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <SimpleBarChart 
//               data={kgData}
//               color="bg-purple-600"
//               label="Kg reciclados por mes"
//             />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Category Breakdown */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Categorías más rentables</h3>
//             <div className="space-y-4">
//               {mockCategoryData.map((category, index) => (
//                 <div key={category.category} className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">{category.category}</span>
//                     <div className="text-right">
//                       <span className="text-sm font-bold">${category.earnings}</span>
//                       <span className="text-xs text-gray-500 ml-2">({category.count} órdenes)</span>
//                     </div>
//                   </div>
//                   <ProgressBar 
//                     value={category.percentage} 
//                     max={100}
//                     variant={index === 0 ? 'success' : index === 1 ? 'default' : 'warning'}
//                   />
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Impacto ambiental 🌱</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">CO₂ evitado</span>
//                 <span className="font-semibold">{mockEnvironmentalImpact.co2Avoided} kg</span>
//               </div>
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">Energía ahorrada</span>
//                 <span className="font-semibold">{mockEnvironmentalImpact.energySaved} kWh</span>
//               </div>
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">Agua conservada</span>
//                 <span className="font-semibold">{mockEnvironmentalImpact.waterSaved.toLocaleString()} L</span>
//               </div>
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">Equivalente a árboles</span>
//                 <span className="font-semibold">{mockEnvironmentalImpact.treesEquivalent} árboles</span>
//               </div>
//             </div>
            
//             <div className="mt-6 p-4 bg-green-50 rounded-lg">
//               <p className="text-sm text-green-800">
//                 <strong>¡Increíble!</strong> Tu actividad de reciclaje ha evitado la emisión de 
//                 <strong> {mockEnvironmentalImpact.co2Avoided} kg de CO₂</strong> a la atmósfera. 
//                 ¡Sigues marcando la diferencia! 🌍
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Performance Trends */}
//       <Card>
//         <CardContent className="p-6">
//           <h3 className="text-lg font-semibold mb-4">Tendencias de rendimiento</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <ArrowTrendingUpIcon className="h-8 w-8 text-success-600" />
//               </div>
//               <p className="text-2xl font-bold text-success-600">+23%</p>
//               <p className="text-sm text-gray-600">Crecimiento en ganancias</p>
//               <p className="text-xs text-gray-500 mt-1">Últimos 3 meses</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <CalendarIcon className="h-8 w-8 text-primary-600" />
//               </div>
//               <p className="text-2xl font-bold text-primary-600">2.5</p>
//               <p className="text-sm text-gray-600">Órdenes por semana</p>
//               <p className="text-xs text-gray-500 mt-1">Promedio mensual</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <DevicePhoneMobileIcon className="h-8 w-8 text-purple-600" />
//               </div>
//               <p className="text-2xl font-bold text-purple-600">67%</p>
//               <p className="text-sm text-gray-600">Dispositivos móviles</p>
//               <p className="text-xs text-gray-500 mt-1">Categoría principal</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Goals Section */}
//       <Card>
//         <CardContent className="p-6">
//           <h3 className="text-lg font-semibold mb-4">Metas mensuales</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium">Meta de reciclaje</span>
//                 <Badge variant="success">91% completado</Badge>
//               </div>
//               <ProgressBar value={91} max={100} variant="success" className="mb-2" />
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>45.6 kg reciclados</span>
//                 <span>Meta: 50 kg</span>
//               </div>
//             </div>
            
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium">Meta de ganancias</span>
//                 <Badge variant="warning">77% completado</Badge>
//               </div>
//               <ProgressBar value={77} max={100} variant="warning" className="mb-2" />
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>$1,234 ganados</span>
//                 <span>Meta: $1,600</span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StatsPage;



// src/pages/dashboard/StatsPage.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/layout';
import { 
  Card, 
  CardContent, 
  Button, 
  Select,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  UserGroupIcon,
  // TreePineIcon,
  // TrendingUpIcon,
  // TrendingDownIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { EarningsChart } from '@/components/analytics/EarningsChart';
import { EnvironmentalImpact } from '@/components/analytics/EnvironmentalImpact';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { GoalsProgress } from '@/components/analytics/GoalsProgress';
import { InsightsPanel } from '@/components/analytics/InsightsPanel';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { ExportModal } from '@/components/analytics/ExportModal';
import { AdvancedAnalyticsModal } from '@/components/analytics/AdvancedAnalyticsModal';

const StatsPage: React.FC = () => {
  const {
    dashboard,
    comparison,
    loading,
    error,
    currentPeriod,
    selectedMetrics,
    chartType,
    setPresetPeriod,
    setPeriod,
    setChartType,
    refreshData,
    exportData
  } = useAnalytics();

  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handlePeriodChange = (value: string | number) => {
    setPresetPeriod(value as any);
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (loading && !dashboard) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Estadísticas"
          description="Análisis detallado de tu actividad"
        />
        <div className="text-center py-12">
          <ArrowPathIcon className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Estadísticas"
          description="Análisis detallado de tu actividad"
        />
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-medium">Error al cargar estadísticas</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  const periodOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const chartTypeOptions = [
    { value: 'line', label: 'Líneas' },
    { value: 'bar', label: 'Barras' },
    { value: 'area', label: 'Área' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Panel de Estadísticas"
        description="Análisis completo de tu actividad de reciclaje"
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              Filtros
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Exportar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              leftIcon={<ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
            >
              Actualizar
            </Button>
          </div>
        }
      />

      {/* Period and Chart Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Período:</span>
                <Select
                  value={currentPeriod.preset || 'month'}
                  onChange={handlePeriodChange}
                  options={periodOptions}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Gráfico:</span>
                <Select
                  value={chartType}
                  onChange={(value) => setChartType(value as any)}
                  options={chartTypeOptions}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedModal(true)}
                leftIcon={<Cog6ToothIcon className="h-4 w-4" />}
              >
                Análisis Avanzado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {/* {showFilters && (
        <AnalyticsFilters
          onClose={() => setShowFilters(false)}
          currentPeriod={currentPeriod}
          onPeriodChange={setPeriod}
        />
      )} */}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="earnings">Ganancias</TabsTrigger>
          <TabsTrigger value="environmental">Impacto</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverview 
            dashboard={dashboard}
            comparison={comparison}
            loading={loading}
          />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <EarningsChart 
                data={dashboard?.charts.earnings || []}
                type={chartType}
                period={currentPeriod}
                loading={loading}
              />
            </div>
            <div>
              <InsightsPanel 
                insights={dashboard?.insights || []}
                predictions={dashboard?.predictions || []}
                loading={loading}
              />
            </div>
          </div>

          {/* <DeviceBreakdown 
            categories={dashboard?.deviceCategories || []}
            loading={loading}
          /> */}
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <EarningsChart 
                data={dashboard?.charts.earnings || []}
                type={chartType}
                period={currentPeriod}
                loading={loading}
                showComparison={true}
              />
              
              {/* Orders Chart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Órdenes por Período</h3>
                  <EarningsChart 
                    data={dashboard?.charts.orders || []}
                    type={chartType}
                    period={currentPeriod}
                    loading={loading}
                    metric="orders"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Mejor Rendimiento</h3>
                  {dashboard?.topPerformance && (
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">Mejor Día</p>
                        <p className="text-lg font-bold text-green-800">
                          {dashboard.topPerformance.bestDay.earnings.toLocaleString('es-ES', { 
                            style: 'currency', 
                            currency: 'USD' 
                          })}
                        </p>
                        <p className="text-xs text-green-600">
                          {new Date(dashboard.topPerformance.bestDay.date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">Mejor Mes</p>
                        <p className="text-lg font-bold text-blue-800">
                          {dashboard.topPerformance.bestMonth.earnings.toLocaleString('es-ES', { 
                            style: 'currency', 
                            currency: 'USD' 
                          })}
                        </p>
                        <p className="text-xs text-blue-600">
                          {dashboard.topPerformance.bestMonth.month}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <InsightsPanel 
                insights={dashboard?.insights.filter(i => i.metric.includes('earning')) || []}
                predictions={dashboard?.predictions.filter(p => p.type === 'earnings') || []}
                loading={loading}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <EnvironmentalImpact 
            metrics={dashboard?.environmental}
            chartData={dashboard?.charts.weight || []}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalsProgress 
            goals={dashboard?.goalsProgress}
            loading={loading}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {/* <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={exportData}
        currentPeriod={currentPeriod}
      />

      <AdvancedAnalyticsModal
        isOpen={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
      /> */}
    </div>
  );
};

export default StatsPage;