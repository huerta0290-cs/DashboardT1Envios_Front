'use client';

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
  // Datos simulados de tendencia
  const data = [
    { name: 'L', value: 35, amt: 2400 },
    { name: 'M', value: 52, amt: 2210 },
    { name: 'M', value: 46, amt: 2290 },
    { name: 'J', value: 65, amt: 2000 },
    { name: 'V', value: 58, amt: 2181 },
    { name: 'S', value: 42, amt: 2500 },
    { name: 'D', value: 38, amt: 2100 },
  ];
  
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

  return (
    <CardComponent 
      title={`Tendencia de Ventas (${getTimeRangeTitle()})`}
      actions={
        <DropdownFilter 
          options={['Guías', 'Ingresos', 'Margen']} 
          defaultValue="Guías" 
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
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip 
            formatter={(value: number) => formatNumber(value)} 
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