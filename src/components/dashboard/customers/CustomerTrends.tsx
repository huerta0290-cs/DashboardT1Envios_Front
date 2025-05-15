'use client';

import { useState } from 'react';
import { 
  Stack, 
  ToggleButtonGroup, 
  ToggleButton,
  Box
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import { TopCustomer } from '@/redux/features/dashboardSlice';

interface CustomerTrendsProps {
  customers: TopCustomer[];
}

interface TrendDataPoint {
  name: string;
  [key: string]: string | number;
}

// Simular fechas del pasado
const getDateLabels = () => {
  const result = [];
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    result.push(days[d.getDay()]);
  }
  
  return result;
};

export default function CustomerTrends({ customers }: CustomerTrendsProps) {
  const [metric, setMetric] = useState<string>('nps');
  
  const handleMetricChange = (
    _: React.MouseEvent<HTMLElement>,
    newMetric: string | null,
  ) => {
    if (newMetric !== null) {
      setMetric(newMetric);
    }
  };
  
  // Preparar datos para el gráfico
  const dateLabels = getDateLabels();
  const transformData = (): TrendDataPoint[] => {
    return dateLabels.map((date, index) => {
      const dataPoint: TrendDataPoint = { name: date };
      
      customers.forEach(customer => {
        if (metric === 'nps') {
          // Simular datos de NPS para cada cliente en cada fecha
          dataPoint[customer.name] = customer.nps - Math.floor(Math.random() * 10 * (6 - index) / 6);
        } else if (metric === 'ingresos') {
          // Simular datos de ingresos para cada cliente en cada fecha
          dataPoint[customer.name] = customer.revenue * (0.8 + 0.4 * (index / 6));
        } else {
          // Simular datos de guías para cada cliente en cada fecha
          dataPoint[customer.name] = customer.guides * (0.8 + 0.4 * (index / 6));
        }
      });
      
      return dataPoint;
    });
  };
  
  const data = transformData();
  
  // Colores para las líneas
  const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  // Formatear tooltip según la métrica
  const formatTooltipValue = (value: number) => {
    if (metric === 'nps') return value.toFixed(1);
    if (metric === 'ingresos') return `$${value.toLocaleString()}`;
    return value.toLocaleString();
  };
  
  // Acciones para el card
  const metricSelector = (
    <ToggleButtonGroup
      value={metric}
      exclusive
      onChange={handleMetricChange}
      size="small"
      sx={{
        '& .MuiToggleButtonGroup-grouped': {
          fontSize: '0.75rem',
          textTransform: 'none',
        },
      }}
    >
      <ToggleButton value="nps" aria-label="NPS">
        NPS
      </ToggleButton>
      <ToggleButton value="ingresos" aria-label="Ingresos">
        Ingresos
      </ToggleButton>
      <ToggleButton value="guias" aria-label="Guías">
        Guías
      </ToggleButton>
    </ToggleButtonGroup>
  );
  
  return (
    <CardComponent 
      title="Tendencias de Clientes" 
      actions={metricSelector}
      height={400}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
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
            domain={['auto', 'auto']}
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
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
          />
          
          {customers.map((customer, index) => (
            <Line
              key={customer.id}
              type="monotone"
              dataKey={customer.name}
              stroke={lineColors[index % lineColors.length]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}