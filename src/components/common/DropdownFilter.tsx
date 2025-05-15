// src/components/common/DropdownFilter.tsx
'use client';

import { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem,
  Stack 
} from '@mui/material';
import { 
  FilterAlt as FilterIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

interface DropdownFilterProps {
  options: string[];
  defaultValue: string;
  onChange?: (value: string) => void;
}

export default function DropdownFilter({ 
  options, 
  defaultValue, 
  onChange 
}: DropdownFilterProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleSelect = (option: string) => {
    setSelected(option);
    handleClose();
    if (onChange) {
      onChange(option);
    }
  };
  
  return (
    <Stack direction="row" alignItems="center">
      <Button
        id="filter-button"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        startIcon={<FilterIcon fontSize="small" />}
        size="small"
        sx={{ 
          bgcolor: 'grey.100',
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'grey.200',
          },
          fontSize: '0.75rem',
          textTransform: 'none',
        }}
      >
        {selected}
      </Button>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={option} 
            onClick={() => handleSelect(option)}
            selected={option === selected}
            sx={{ fontSize: '0.875rem' }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}