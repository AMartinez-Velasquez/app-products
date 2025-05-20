import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

interface Warehouse {
  id?: number;
  name: string;
  location: string;
  capacity: number;
}

interface Product {
  id: number;
  name: string;
}

interface Detail {
  id: number;
  stock: number;
  product: Product;
  warehouse: Warehouse;
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

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [details, setDetails] = useState<Detail[]>([]);

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
      fetchDetails(warehouse.id);
    } else {
      setFormData({ name: '', location: '', capacity: 0 });
      setDetails([]);
    }
    fetchProducts();
  }, [warehouse]);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3000/products');
    setProducts(res.data);
  };

  const fetchDetails = async (warehouseId?: number) => {
    if (!warehouseId) return;
    const res = await axios.get('http://localhost:3000/product-warehouse-detail');
    const filtered = res.data.filter((d: Detail) => d.warehouse.id === warehouseId);
    setDetails(filtered);
  };

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
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Asociar a un producto (informativo)"
                value={selectedProductId ?? ''}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
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