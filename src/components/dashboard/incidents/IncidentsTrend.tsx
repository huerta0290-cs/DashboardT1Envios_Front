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
import DropdownFilter from '@/components/common/DropdownFilter';
import { formatNumber } from '@/utils/formatters';

interface IncidentsTrendProps {
  incidentTrend: {
    day: string;
    total: number;
    automatic: number;
    manual: number;
  }[];
}

export default function IncidentsTrend({ incidentTrend }: IncidentsTrendProps) {
  return (
    <CardComponent 
      title="Tendencia de Incidencias" 
      actions={
        <DropdownFilter 
          options={['Diario', 'Semanal', 'Mensual']} 
          defaultValue="Diario"
        />
      }
      height={350}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={incidentTrend}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
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
          <Bar dataKey="total" name="Incidencias" fill="#FF8042" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}