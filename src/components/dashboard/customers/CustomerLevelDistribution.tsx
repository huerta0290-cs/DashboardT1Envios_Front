'use client';

import { Box } from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import { CustomerLevel } from '@/redux/features/dashboardSlice';

interface CustomerLevelDistributionProps {
  customerLevels: CustomerLevel[];
}

export default function CustomerLevelDistribution({ customerLevels }: CustomerLevelDistributionProps) {
  return (
    <CardComponent title="Distribución por Nivel" height={380}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={customerLevels}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={1}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {customerLevels.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
            <Legend 
              layout="vertical"
              verticalAlign="bottom"
              align="left"
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </CardComponent>
  );
}