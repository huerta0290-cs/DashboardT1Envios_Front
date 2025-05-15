'use client';

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
import { Carrier } from '@/redux/features/dashboardSlice';

interface DeliveryTimeProps {
  carriers: Carrier[];
}

export default function DeliveryTime({ carriers }: DeliveryTimeProps) {
  // Ordenar transportistas por tiempo de entrega (ascendente)
  const sortedCarriers = [...carriers].sort((a, b) => a.avgDeliveryTime - b.avgDeliveryTime);
  
  return (
    <CardComponent title="Tiempo de Entrega por Transportista" height={350}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedCarriers}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={[0, 'dataMax + 0.5']}
            tickFormatter={(value) => `${value} días`}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)} días`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Bar 
            dataKey="avgDeliveryTime" 
            name="Días Promedio" 
            background={{ fill: '#eee' }}
            radius={[0, 4, 4, 0]}
          >
            {sortedCarriers.map((entry) => (
              <Cell 
                key={`cell-${entry.id}`} 
                fill={entry.avgDeliveryTime < 2 ? '#10B981' : entry.avgDeliveryTime < 2.5 ? '#F59E0B' : '#EF4444'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}