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
import { formatNumber } from '@/utils/formatters';

interface CarriersDistributionProps {
  carriers: Carrier[];
}

export default function CarriersDistribution({ carriers }: CarriersDistributionProps) {
  return (
    <CardComponent title="Distribución de Guías por Transportista" height={380}>
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
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
          />
          <Bar 
            dataKey="guides" 
            name="Guías Generadas" 
            radius={[4, 4, 0, 0]}
          >
            {carriers.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}