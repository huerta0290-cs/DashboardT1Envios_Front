// src/components/common/DateRangePicker.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Stack, 
  TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es as esLocale } from 'date-fns/locale';
import { format } from 'date-fns';

interface DateRangePickerProps {
  open: boolean;
  onClose: () => void;
  onApply: (fromDate: string, toDate: string) => void;
  initialFromDate?: string | null;
  initialToDate?: string | null;
}

export default function DateRangePicker({
  open,
  onClose,
  onApply,
  initialFromDate = null,
  initialToDate = null
}: DateRangePickerProps) {
  const [fromDate, setFromDate] = useState<Date | null>(
    initialFromDate ? new Date(initialFromDate) : new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [toDate, setToDate] = useState<Date | null>(
    initialToDate ? new Date(initialToDate) : new Date()
  );
  const [error, setError] = useState<string>('');

  // Actualizar fechas cuando cambien las props
  useEffect(() => {
    if (open) {
      setFromDate(initialFromDate ? new Date(initialFromDate) : new Date(new Date().setDate(new Date().getDate() - 30)));
      setToDate(initialToDate ? new Date(initialToDate) : new Date());
    }
  }, [open, initialFromDate, initialToDate]);

  // Validar rango de fechas
  const validateDateRange = () => {
    if (!fromDate || !toDate) {
      setError('Ambas fechas son requeridas');
      return false;
    }

    if (fromDate > toDate) {
      setError('La fecha inicial debe ser anterior a la fecha final');
      return false;
    }

    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 90) {
      setError('El rango máximo es de 90 días');
      return false;
    }

    setError('');
    return true;
  };

  // Aplicar rango de fechas
  const handleApply = () => {
    if (validateDateRange() && fromDate && toDate) {
      onApply(
        format(fromDate, 'yyyy-MM-dd'),
        format(toDate, 'yyyy-MM-dd')
      );
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Seleccionar rango de fechas</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <DatePicker
              label="Fecha inicial"
              value={fromDate}
              onChange={(newValue) => {
                setFromDate(newValue);
                setError('');
              }}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  error: !!error,
                }
              }}
            />
            
            <DatePicker
              label="Fecha final"
              value={toDate}
              onChange={(newValue) => {
                setToDate(newValue);
                setError('');
              }}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  error: !!error,
                }
              }}
            />
            
            {error && (
              <TextField
                error
                id="error-text"
                value={error}
                variant="standard"
                size="small"
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button onClick={handleApply} color="primary" variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
