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
import { formatNumber } from '@/utils/formatters';

interface IncidentsByTypeProps {
  incidentTypes: {
    name: string;
    value: number;
    color: string;
  }[];
}

export default function IncidentsByType({ incidentTypes }: IncidentsByTypeProps) {
  return (
    <CardComponent title="Incidencias por Tipo" height={350}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={incidentTypes}
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
              {incidentTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </CardComponent>
  );
}