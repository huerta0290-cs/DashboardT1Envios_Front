'use client';

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

export default function MarginTrend() {
  // Datos simulados de tendencia de margen
  const data = [
    { name: 'Sem 1', value: 31.2 },
    { name: 'Sem 2', value: 32.5 },
    { name: 'Sem 3', value: 33.1 },
    { name: 'Sem 4', value: 32.8 },
    { name: 'Sem 5', value: 33.7 },
    { name: 'Sem 6', value: 35.2 },
    { name: 'Sem 7', value: 34.9 },
  ];
  
  return (
    <CardComponent title="Tendencia de Margen" height={350}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            domain={[30, 36]}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)}%`} 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Margen %" 
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}