'use client';

import { useState } from 'react';
import { 
  Box,
  Stack
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { Carrier } from '@/redux/features/dashboardSlice';
import { formatCurrency } from '@/utils/formatters';

interface RevenueDistributionProps {
  carriers: Carrier[];
}

export default function RevenueDistribution({ carriers }: RevenueDistributionProps) {
  const [viewMode, setViewMode] = useState('Este Período');
  
  // Simulación de datos para "Período Anterior" y "Comparativo"
  const getCarriersData = () => {
    if (viewMode === 'Período Anterior') {
      // Retornar datos simulados para el período anterior (90% de los actuales)
      return carriers.map(carrier => ({
        ...carrier,
        revenue: carrier.revenue * 0.9,
        cost: carrier.cost * 0.9
      }));
    } else if (viewMode === 'Comparativo') {
      // Retornar datos con la estructura para gráfico comparativo
      return carriers.map(carrier => {
        return {
          name: carrier.name,
          actual: carrier.revenue,
          anterior: carrier.revenue * 0.9,
          color: carrier.color
        };
      });
    }
    
    // Por defecto, retornar datos actuales
    return carriers;
  };
  
  const data = getCarriersData();
  
  // Renderizar gráfico según el modo de vista
  const renderChart = () => {
    if (viewMode === 'Comparativo') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
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
            <Bar dataKey="actual" name="Este Período" fill="#3B82F6" />
            <Bar dataKey="anterior" name="Período Anterior" fill="#9CA3AF" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
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
          <Bar 
            dataKey="revenue" 
            name="Ingresos" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <CardComponent 
      title="Distribución de Ingresos por Transportista"
      actions={
        <DropdownFilter 
          options={['Este Período', 'Período Anterior', 'Comparativo']} 
          defaultValue="Este Período"
          onChange={setViewMode}
        />
      }
      height={400}
    >
      {renderChart()}
    </CardComponent>
  );
}