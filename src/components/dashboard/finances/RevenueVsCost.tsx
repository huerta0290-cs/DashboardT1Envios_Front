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
import { formatCurrency } from '@/utils/formatters';

interface RevenueVsCostProps {
  carriers: Carrier[];
}

export default function RevenueVsCost({ carriers }: RevenueVsCostProps) {
  return (
    <CardComponent title="Ingresos vs Costos por Transportista" height={350}>
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
          <Bar dataKey="revenue" name="Ingresos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cost" name="Costos" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}