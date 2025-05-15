// src/components/dashboard/overview/SalesTrend.tsx
'use client';

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { formatNumber } from '@/utils/formatters';

interface SalesTrendProps {
  timeRange: '1d' | '7d' | '30d' | 'custom';
}

export default function SalesTrend({ timeRange }: SalesTrendProps) {
  const [metricType, setMetricType] = useState('Guías');
  
  // Datos simulados de tendencia
  const getDailyData = () => [
    { name: '00:00', value: 10 },
    { name: '04:00', value: 5 },
    { name: '08:00', value: 15 },
    { name: '12:00', value: 35 },
    { name: '16:00', value: 42 },
    { name: '20:00', value: 25 },
    { name: '23:59', value: 15 },
  ];
  
  const getWeeklyData = () => [
    { name: 'Lun', value: 35 },
    { name: 'Mar', value: 52 },
    { name: 'Mié', value: 46 },
    { name: 'Jue', value: 65 },
    { name: 'Vie', value: 58 },
    { name: 'Sáb', value: 42 },
    { name: 'Dom', value: 38 },
  ];
  
  const getMonthlyData = () => [
    { name: 'Sem 1', value: 190 },
    { name: 'Sem 2', value: 210 },
    { name: 'Sem 3', value: 195 },
    { name: 'Sem 4', value: 240 },
  ];
  
  const getCustomData = () => [
    { name: 'Inicio', value: 45 },
    { name: '', value: 52 },
    { name: '', value: 58 },
    { name: '', value: 62 },
    { name: '', value: 70 },
    { name: 'Fin', value: 65 },
  ];
  
  // Seleccionar datos según el rango de tiempo
  const getData = () => {
    switch (timeRange) {
      case '1d':
        return getDailyData();
      case '7d':
        return getWeeklyData();
      case '30d':
        return getMonthlyData();
      case 'custom':
        return getCustomData();
      default:
        return getWeeklyData();
    }
  };
  
  const data = getData();
  
  // Título basado en el rango de tiempo
  const getTimeRangeTitle = () => {
    switch (timeRange) {
      case '1d':
        return 'Hoy';
      case '7d':
        return 'Últimos 7 días';
      case '30d':
        return 'Últimos 30 días';
      case 'custom':
        return 'Período personalizado';
      default:
        return 'Últimos 7 días';
    }
  };

  // Factor de multiplicación para simular diferentes métricas
  const getScaleFactor = () => {
    if (metricType === 'Ingresos') return 500; // Simular ingresos
    if (metricType === 'Margen') return 0.35; // Simular margen porcentual
    return 1; // Factor para guías
  };
  
  // Formatear valores para el tooltip según el tipo de métrica
  const formatTooltipValue = (value: number) => {
    if (metricType === 'Ingresos') return `$${formatNumber(value * getScaleFactor())}`;
    if (metricType === 'Margen') return `${(value * getScaleFactor()).toFixed(1)}%`;
    return formatNumber(value);
  };

  const handleMetricChange = (value: string) => {
    setMetricType(value);
  };

  return (
    <CardComponent 
      title={`Tendencia de ${metricType} (${getTimeRangeTitle()})`}
      actions={
        <DropdownFilter 
          options={['Guías', 'Ingresos', 'Margen']} 
          defaultValue="Guías"
          onChange={handleMetricChange}
        />
      }
      height={350}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => {
              if (metricType === 'Ingresos') return `$${value * getScaleFactor() / 1000}k`;
              if (metricType === 'Margen') return `${(value * getScaleFactor()).toFixed(0)}%`;
              return value.toString();
            }}
          />
          <Tooltip 
            formatter={(value: number) => formatTooltipValue(value)} 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}
