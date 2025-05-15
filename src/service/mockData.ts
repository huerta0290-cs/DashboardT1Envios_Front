// src/services/mockData.ts
import { DashboardData } from '@/redux/features/dashboardSlice';

/**
 * Genera datos simulados para cuando la API no responde
 */
export const generateMockData = (timeRange: string): DashboardData => {
  // Datos base que cambian según el rango de tiempo
  const multiplier = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 14;
  const previousMultiplier = multiplier * 0.9; // Ligero crecimiento respecto al período anterior
  
  // Datos para KPIs
  const guidesGenerated = Math.floor(235 * multiplier);
  const previousGuidesGenerated = Math.floor(210 * previousMultiplier);
  const guidesChange = ((guidesGenerated - previousGuidesGenerated) / previousGuidesGenerated) * 100;
  
  const totalRevenue = Math.floor(18500 * multiplier);
  const previousRevenue = Math.floor(16800 * previousMultiplier);
  const revenueChange = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
  
  const averageMargin = 32 + (Math.random() * 4 - 2);
  const previousMargin = averageMargin - (Math.random() * 3 - 1);
  const marginChange = averageMargin - previousMargin;
  
  const npsScore = 65 + (Math.random() * 6 - 3);
  const previousNps = npsScore - (Math.random() * 4 - 1);
  const npsChange = npsScore - previousNps;

  // Datos de transportistas
  const carriers = [
    { 
      id: 1, 
      name: 'DHL', 
      guides: Math.floor(guidesGenerated * 0.35), 
      revenue: Math.floor(totalRevenue * 0.38), 
      cost: Math.floor(totalRevenue * 0.38 * 0.65), 
      margin: 35 + (Math.random() * 4 - 2),
      avgDeliveryTime: 1.8 + (Math.random() * 0.4 - 0.2),
      incidentRate: 4.2 + (Math.random() * 1 - 0.5),
      trend: [65, 68, 62, 70, 74, 78, 76],
      color: '#FFCC00'
    },
    { 
      id: 2, 
      name: 'FEDEX', 
      guides: Math.floor(guidesGenerated * 0.25), 
      revenue: Math.floor(totalRevenue * 0.27), 
      cost: Math.floor(totalRevenue * 0.27 * 0.68), 
      margin: 32 + (Math.random() * 4 - 2),
      avgDeliveryTime: 2.1 + (Math.random() * 0.4 - 0.2),
      incidentRate: 4.8 + (Math.random() * 1 - 0.5),
      trend: [55, 58, 62, 59, 63, 67, 65],
      color: '#4D148C'
    },
    { 
      id: 3, 
      name: 'UPS', 
      guides: Math.floor(guidesGenerated * 0.18), 
      revenue: Math.floor(totalRevenue * 0.17), 
      cost: Math.floor(totalRevenue * 0.17 * 0.7), 
      margin: 30 + (Math.random() * 4 - 2),
      avgDeliveryTime: 2.3 + (Math.random() * 0.4 - 0.2),
      incidentRate: 5.1 + (Math.random() * 1 - 0.5),
      trend: [42, 45, 44, 48, 46, 49, 52],
      color: '#351C15'
    },
    { 
      id: 4, 
      name: 'JT EXPRESS', 
      guides: Math.floor(guidesGenerated * 0.12), 
      revenue: Math.floor(totalRevenue * 0.1), 
      cost: Math.floor(totalRevenue * 0.1 * 0.72), 
      margin: 28 + (Math.random() * 4 - 2),
      avgDeliveryTime: 2.5 + (Math.random() * 0.4 - 0.2),
      incidentRate: 6.2 + (Math.random() * 1 - 0.5),
      trend: [32, 30, 35, 33, 38, 36, 39],
      color: '#E20000'
    },
    { 
      id: 5, 
      name: 'EXPRESS', 
      guides: Math.floor(guidesGenerated * 0.1), 
      revenue: Math.floor(totalRevenue * 0.08), 
      cost: Math.floor(totalRevenue * 0.08 * 0.75), 
      margin: 25 + (Math.random() * 4 - 2),
      avgDeliveryTime: 3.2 + (Math.random() * 0.4 - 0.2),
      incidentRate: 7.5 + (Math.random() * 1 - 0.5),
      trend: [20, 22, 24, 21, 23, 25, 24],
      color: '#00AEEF'
    }
  ];

  // Datos de clientes
  const customerLevels = [
    { name: 'Nivel 1', value: 65, color: '#8884d8' },
    { name: 'Nivel 10', value: 25, color: '#82ca9d' },
    { name: 'Nivel 26', value: 10, color: '#ffc658' }
  ];

  const topCustomers = [
    { id: 1, name: 'APLIN', level: 'Nivel 26', guides: Math.floor(guidesGenerated * 0.08), revenue: Math.floor(totalRevenue * 0.09), margin: 40.2, status: 'active' as 'active', nps: 82, trend: [60, 65, 68, 73, 75, 72, 78] },
    { id: 2, name: 'CHICOS OLÉ', level: 'Nivel 26', guides: Math.floor(guidesGenerated * 0.075), revenue: Math.floor(totalRevenue * 0.08), margin: 38.5, status: 'active' as 'active', nps: 79, trend: [58, 60, 65, 67, 70, 68, 71] },
    { id: 3, name: 'DESIGUALEX', level: 'Nivel 10', guides: Math.floor(guidesGenerated * 0.065), revenue: Math.floor(totalRevenue * 0.07), margin: 35.8, status: 'active' as 'active', nps: 76, trend: [52, 55, 58, 62, 60, 65, 67] },
    { id: 4, name: 'CLAROSHOP', level: 'Nivel 26', guides: Math.floor(guidesGenerated * 0.06), revenue: Math.floor(totalRevenue * 0.065), margin: 37.9, status: 'active' as 'active', nps: 81, trend: [55, 58, 62, 64, 67, 70, 73] },
    { id: 5, name: 'EMISSARY', level: 'Nivel 10', guides: Math.floor(guidesGenerated * 0.055), revenue: Math.floor(totalRevenue * 0.06), margin: 32.7, status: 'active' as 'active', nps: 72, trend: [48, 50, 52, 54, 53, 56, 58] },
    { id: 6, name: 'TECH GADGETS', level: 'Nivel 10', guides: Math.floor(guidesGenerated * 0.05), revenue: Math.floor(totalRevenue * 0.055), margin: 31.2, status: 'at_risk' as 'at_risk', nps: 68, trend: [46, 49, 51, 49, 52, 50, 51] },
    { id: 7, name: 'ZAPATERIA LÓPEZ', level: 'Nivel 1', guides: Math.floor(guidesGenerated * 0.045), revenue: Math.floor(totalRevenue * 0.05), margin: 28.5, status: 'active' as 'active', nps: 73, trend: [42, 45, 48, 50, 49, 51, 53] },
    { id: 8, name: 'SANBORNS', level: 'Nivel 26', guides: Math.floor(guidesGenerated * 0.04), revenue: Math.floor(totalRevenue * 0.045), margin: 36.8, status: 'active' as 'active', nps: 78, trend: [51, 54, 57, 60, 62, 61, 64] },
    { id: 9, name: 'PURPLIFY', level: 'Nivel 1', guides: Math.floor(guidesGenerated * 0.035), revenue: Math.floor(totalRevenue * 0.04), margin: 27.1, status: 'inactive' as 'inactive', nps: 65, trend: [40, 42, 44, 41, 43, 45, 42] },
    { id: 10, name: 'BOUTIQUE AMPM', level: 'Nivel 10', guides: Math.floor(guidesGenerated * 0.03), revenue: Math.floor(totalRevenue * 0.035), margin: 30.4, status: 'active' as 'active', nps: 70, trend: [44, 46, 49, 51, 50, 53, 55] }
  ];

  // Datos de incidencias
  const incidents = {
    total: Math.floor(guidesGenerated * 0.05),
    resolved: Math.floor(guidesGenerated * 0.05 * 0.85),
    byType: [
      { name: 'Retraso', value: Math.floor(guidesGenerated * 0.05 * 0.4), color: '#FFCC00' },
      { name: 'Daño', value: Math.floor(guidesGenerated * 0.05 * 0.25), color: '#FF8042' },
      { name: 'Pérdida', value: Math.floor(guidesGenerated * 0.05 * 0.15), color: '#FF0000' },
      { name: 'Dirección', value: Math.floor(guidesGenerated * 0.05 * 0.1), color: '#00C49F' },
      { name: 'Otros', value: Math.floor(guidesGenerated * 0.05 * 0.1), color: '#0088FE' }
    ],
    resolutionTime: {
      'DHL': 1.2 + (Math.random() * 0.2 - 0.1),
      'FEDEX': 1.5 + (Math.random() * 0.2 - 0.1),
      'UPS': 1.8 + (Math.random() * 0.2 - 0.1),
      'JT EXPRESS': 2.1 + (Math.random() * 0.2 - 0.1),
      'EXPRESS': 2.4 + (Math.random() * 0.2 - 0.1)
    },
    trend: [
      { day: 'Lun', count: Math.floor(guidesGenerated * 0.05 * 0.12) },
      { day: 'Mar', count: Math.floor(guidesGenerated * 0.05 * 0.14) },
      { day: 'Mié', count: Math.floor(guidesGenerated * 0.05 * 0.18) },
      { day: 'Jue', count: Math.floor(guidesGenerated * 0.05 * 0.15) },
      { day: 'Vie', count: Math.floor(guidesGenerated * 0.05 * 0.21) },
      { day: 'Sáb', count: Math.floor(guidesGenerated * 0.05 * 0.12) },
      { day: 'Dom', count: Math.floor(guidesGenerated * 0.05 * 0.08) }
    ]
  };

  // Datos de saldos
  const walletData = {
    availableBalance: Math.floor(totalRevenue * 0.75),
    consumedBalance: Math.floor(totalRevenue * 1.2),
    lowBalanceAlerts: [
      { customerId: 6, name: 'TECH GADGETS', availableBalance: Math.floor(1200 * (Math.random() * 0.3 + 0.1)), estimatedDays: Math.floor(Math.random() * 2 + 1) },
      { customerId: 9, name: 'PURPLIFY', availableBalance: Math.floor(800 * (Math.random() * 0.3 + 0.1)), estimatedDays: Math.floor(Math.random() * 3 + 1) }
    ]
  };

  // Datos de calidad
  const qualityMetrics = {
    onTimeDelivery: 87 + (Math.random() * 4 - 2),
    carrierSatisfaction: 82 + (Math.random() * 4 - 2),
    incidentResolutionRate: 92 + (Math.random() * 4 - 2),
    customerRetention: 95 + (Math.random() * 3 - 1.5)
  };

  // Datos de mapa (simplificado para demo)
  const mapData = [
    { state: 'CDMX', volume: Math.floor(guidesGenerated * 0.22), incidents: Math.floor(incidents.total * 0.25) },
    { state: 'Jalisco', volume: Math.floor(guidesGenerated * 0.14), incidents: Math.floor(incidents.total * 0.15) },
    { state: 'Nuevo León', volume: Math.floor(guidesGenerated * 0.13), incidents: Math.floor(incidents.total * 0.12) },
    { state: 'Estado de México', volume: Math.floor(guidesGenerated * 0.12), incidents: Math.floor(incidents.total * 0.14) },
    { state: 'Puebla', volume: Math.floor(guidesGenerated * 0.08), incidents: Math.floor(incidents.total * 0.09) },
    { state: 'Guanajuato', volume: Math.floor(guidesGenerated * 0.07), incidents: Math.floor(incidents.total * 0.06) },
    { state: 'Sonora', volume: Math.floor(guidesGenerated * 0.06), incidents: Math.floor(incidents.total * 0.05) },
    { state: 'Otros', volume: Math.floor(guidesGenerated * 0.18), incidents: Math.floor(incidents.total * 0.14) }
  ];

  return {
    kpis: {
      guidesGenerated,
      previousGuidesGenerated,
      guidesChange,
      totalRevenue,
      previousRevenue,
      revenueChange,
      averageMargin,
      previousMargin,
      marginChange,
      npsScore,
      previousNps,
      npsChange
    },
    carriers,
    customerLevels,
    topCustomers,
    incidents,
    walletData,
    qualityMetrics,
    mapData
  };
};
