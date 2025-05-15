'use client';

import { Box, Grid, Typography } from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { Incident } from '@/redux/features/dashboardSlice';
import { formatNumber } from '@/utils/formatters';

interface IncidentsSummaryProps {
  incidents: Incident;
}

export default function IncidentsSummary({ incidents }: IncidentsSummaryProps) {
  const { total, resolved, byType } = incidents;
  const pending = total - resolved;

  return (
    <CardComponent 
      title="Incidencias" 
      actions={
        <DropdownFilter 
          options={['Todos', 'Abiertos', 'Cerrados']} 
          defaultValue="Todos" 
        />
      }
      height={350}
    >
      <Grid container sx={{ height: '100%' }}>
        <Grid size={6}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byType}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
              >
                {byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatNumber(value)}
                labelFormatter={(_, payload) => payload[0]?.name || ''}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                iconType="circle"
                formatter={(value, entry, index) => (
                  <span style={{ color: '#1F2937', fontSize: '0.75rem' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        
        <Grid size={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium">
              {formatNumber(total)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de incidencias
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="medium" color="success.main">
              {formatNumber(resolved)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Incidencias resueltas
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" fontWeight="medium" color="error.main">
              {formatNumber(pending)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Incidencias pendientes
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </CardComponent>
  );
}