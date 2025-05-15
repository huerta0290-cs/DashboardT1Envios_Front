'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import { Carrier } from '@/redux/features/dashboardSlice';

interface CarriersPerformanceProps {
  carriers: Carrier[];
}

export default function CarriersPerformance({ carriers }: CarriersPerformanceProps) {
  return (
    <CardComponent title="Comparación de Rendimiento" height={380}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={carriers}
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
            yAxisId="left" 
            orientation="left"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
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
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
          />
          <Bar 
            yAxisId="left" 
            dataKey="margin" 
            name="Margen (%)" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="right" 
            dataKey="incidentRate" 
            name="Incidencias (%)" 
            fill="#FF8042" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}