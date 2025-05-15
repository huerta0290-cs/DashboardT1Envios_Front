'use client';

import { Button, Typography } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

export default function ViewAllButton() {
  return (
    <Button 
      endIcon={<KeyboardArrowDownIcon fontSize="small" />}
      sx={{ 
        color: 'primary.main', 
        p: 0,
        minWidth: 'auto',
        '&:hover': {
          backgroundColor: 'transparent',
        }
      }}
    >
      <Typography variant="caption">Ver todos</Typography>
    </Button>
  );
}