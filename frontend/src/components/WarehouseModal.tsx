import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import axios from 'axios';

interface Warehouse {
  id?: number;
  name: string;
  location: string;
  capacity: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  warehouse?: Warehouse | null;
}

const WarehouseModal: React.FC<Props> = ({ open, onClose, refresh, warehouse }) => {
  const [formData, setFormData] = useState<Warehouse>({
    name: '',
    location: '',
    capacity: 0,
  });

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
    } else {
      setFormData({ name: '', location: '', capacity: 0 });
    }
  }, [warehouse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (warehouse?.id) {
        await axios.put(`http://localhost:3000/warehouses/${warehouse.id}`, formData);
      } else {
        await axios.post('http://localhost:3000/warehouses', formData);
      }
      refresh();
      onClose();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{warehouse ? 'Editar Almacén' : 'Agregar Almacén'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Capacidad"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {warehouse ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WarehouseModal;