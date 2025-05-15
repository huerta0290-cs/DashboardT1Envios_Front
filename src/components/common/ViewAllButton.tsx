// src/components/common/ViewAllButton.tsx
'use client';

import { Button, Typography } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

interface ViewAllButtonProps {
  onClick?: () => void;
}

export default function ViewAllButton({ onClick }: ViewAllButtonProps) {
  return (
    <Button 
      endIcon={<KeyboardArrowDownIcon fontSize="small" />}
      onClick={onClick}
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