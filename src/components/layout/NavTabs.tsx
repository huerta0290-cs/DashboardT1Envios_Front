'use client';

import { Box, Tab, Tabs } from '@mui/material';
import { 
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon, 
  People as PeopleIcon, 
  AttachMoney as AttachMoneyIcon, 
  Warning as WarningIcon 
} from '@mui/icons-material';
import { useDashboard } from '@/utils/dashboard-hooks';

export default function NavTabs() {
  const { activeTab, updateActiveTab } = useDashboard();
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    updateActiveTab(newValue as any);
  };
  
  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          px: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            minWidth: 'unset',
            py: 2,
            px: 2,
            fontSize: '0.875rem',
          },
          '& .Mui-selected': {
            color: 'primary.main',
            fontWeight: 600,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
          },
        }}
      >
        <Tab 
          value="overview" 
          label="Vista General" 
          icon={<InventoryIcon fontSize="small" />}
          iconPosition="start"
        />
        <Tab 
          value="carriers" 
          label="Transportistas" 
          icon={<LocalShippingIcon fontSize="small" />}
          iconPosition="start"
        />
        <Tab 
          value="customers" 
          label="Clientes" 
          icon={<PeopleIcon fontSize="small" />}
          iconPosition="start"
        />
        <Tab 
          value="finances" 
          label="Finanzas" 
          icon={<AttachMoneyIcon fontSize="small" />}
          iconPosition="start"
        />
        <Tab 
          value="incidents" 
          label="Incidencias" 
          icon={<WarningIcon fontSize="small" />}
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
}