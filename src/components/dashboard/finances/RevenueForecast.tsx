'use client';

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { formatCurrency } from '@/utils/formatters';

export default function RevenueForecast() {
  const [timeFrame, setTimeFrame] = useState('Mensual');
  
  // Datos simulados para proyección de ingresos
  const getDatosPorPeriodo = () => {
    if (timeFrame === 'Trimestral') {
      return [
        { name: 'Q1', actual: 850000, projected: 850000 },
        { name: 'Q2', actual: 960000, projected: 960000 },
        { name: 'Q3', actual: 0, projected: 1100000 },
        { name: 'Q4', actual: 0, projected: 1250000 },
      ];
    } else if (timeFrame === 'Anual') {
      return [
        { name: '2022', actual: 3200000, projected: 3200000 },
        { name: '2023', actual: 3950000, projected: 3950000 },
        { name: '2024', actual: 1810000, projected: 4500000 },
        { name: '2025', actual: 0, projected: 5200000 },
      ];
    }
    
    // Por defecto, datos mensuales
    return [
      { name: 'Ene', actual: 285000, projected: 285000 },
      { name: 'Feb', actual: 310000, projected: 310000 },
      { name: 'Mar', actual: 342000, projected: 342000 },
      { name: 'Abr', actual: 375000, projected: 375000 },
      { name: 'May', actual: 0, projected: 405000 },
      { name: 'Jun', actual: 0, projected: 430000 },
      { name: 'Jul', actual: 0, projected: 460000 },
      { name: 'Ago', actual: 0, projected: 485000 },
    ];
  };
  
  const data = getDatosPorPeriodo();
  
  return (
    <CardComponent 
      title="Proyección de Ingresos" 
      actions={
        <DropdownFilter 
          options={['Mensual', 'Trimestral', 'Anual']} 
          defaultValue="Mensual"
          onChange={setTimeFrame}
        />
      }
      height={350}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)} 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            name="Ingresos Reales" 
            stroke="#8884d8" 
            fillOpacity={0.3}
            fill="url(#colorActual)" 
          />
          <Area 
            type="monotone" 
            dataKey="projected" 
            name="Proyección" 
            stroke="#82ca9d" 
            fillOpacity={0.3}
            fill="url(#colorProjected)"
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}