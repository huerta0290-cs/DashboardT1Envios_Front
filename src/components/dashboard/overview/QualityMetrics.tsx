'use client';

import { Box } from '@mui/material';
import CardComponent from '@/components/common/CardComponent';
import QualityBar from '@/components/common/QualityBar';
import { QualityMetrics as QualityMetricsType } from '@/redux/features/dashboardSlice';

interface QualityMetricsProps {
  metrics: QualityMetricsType;
}

export default function QualityMetrics({ metrics }: QualityMetricsProps) {
  return (
    <CardComponent title="Calidad del Servicio" height={400}>
      <Box sx={{ p: 1, mt: 2 }}>
        <QualityBar 
          label="Entregas a tiempo" 
          value={metrics.onTimeDelivery} 
          color="success"
        />
        
        <QualityBar 
          label="Satisfacción con transportista" 
          value={metrics.carrierSatisfaction} 
          color="primary"
        />
        
        <QualityBar 
          label="Resolución de incidencias" 
          value={metrics.incidentResolutionRate} 
          color="secondary"
        />
        
        <QualityBar 
          label="Retención de clientes" 
          value={metrics.customerRetention} 
          color="warning"
        />
      </Box>
    </CardComponent>
  );
}