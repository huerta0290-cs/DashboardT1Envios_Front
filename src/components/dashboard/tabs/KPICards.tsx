// src/components/dashboard/overview/KPICards.tsx
'use client';

import { Stack, Box } from '@mui/material';
import {
  LocalShipping as PackageIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import KPICard from '@/components/common/KPICard';
import { KPI } from '@/redux/features/dashboardSlice';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface KPICardsProps {
  kpis: KPI;
}

export default function KPICards({ kpis }: KPICardsProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
      <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
        <KPICard 
          title="Guías Generadas"
          value={formatNumber(kpis.guidesGenerated)}
          previousValue={formatNumber(kpis.previousGuidesGenerated)}
          changePercentage={kpis.guidesChange}
          icon={<PackageIcon sx={{ color: 'primary.main' }} />}
          iconBgColor="#3B82F6"
          progress={75}
        />
      </Box>
      
      <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
        <KPICard 
          title="Ingresos Totales"
          value={formatCurrency(kpis.totalRevenue)}
          previousValue={formatCurrency(kpis.previousRevenue)}
          changePercentage={kpis.revenueChange}
          icon={<AttachMoneyIcon sx={{ color: 'success.main' }} />}
          iconBgColor="#10B981"
          progress={70}
        />
      </Box>
      
      <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
        <KPICard 
          title="Margen Promedio"
          value={`${kpis.averageMargin.toFixed(1)}%`}
          previousValue={`${kpis.previousMargin.toFixed(1)}%`}
          changeValue={kpis.marginChange}
          changeType="points"
          icon={<TrendingUpIcon sx={{ color: 'secondary.main' }} />}
          iconBgColor="#6366F1"
          progress={65}
        />
      </Box>
      
      <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
        <KPICard 
          title="NPS / Satisfacción"
          value={kpis.npsScore.toFixed(1)}
          previousValue={kpis.previousNps.toFixed(1)}
          changeValue={kpis.npsChange}
          changeType="points"
          icon={<GroupIcon sx={{ color: 'warning.main' }} />}
          iconBgColor="#F59E0B"
          progress={80}
        />
      </Box>
    </Stack>
  );
}
