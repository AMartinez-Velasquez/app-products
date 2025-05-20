// components/ProductModal.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import axios from 'axios';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface Warehouse {
  id: number;
  name: string;
}

interface Detail {
  id: number;
  warehouse: Warehouse;
  product: Product;
  stock: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  product?: Product | null;
}

const ProductModal: React.FC<Props> = ({ open, onClose, refresh, product }) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [details, setDetails] = useState<Detail[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      fetchDetails(product.id);
    } else {
      setFormData({ name: '', description: '', price: 0, stock: 0 });
      setDetails([]);
    }
    fetchWarehouses();
  }, [product]);

  const fetchWarehouses = async () => {
    const res = await axios.get('http://localhost:3000/warehouses');
    setWarehouses(res.data);
  };

  const fetchDetails = async (productId?: number) => {
    if (!productId) return;
    const res = await axios.get(`http://localhost:3000/product-warehouse-detail`);
    const filtered = res.data.filter((d: Detail) => d.product.id === productId);
    setDetails(filtered);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product?.id) {
      await axios.put(`http://localhost:3000/products/${product.id}`, formData);
    } else {
      await axios.post('http://localhost:3000/products', formData);
    }
    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
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
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock total"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Asociar a un almacén (informativo)"
                value={selectedWarehouseId ?? ''}
                onChange={(e) => setSelectedWarehouseId(Number(e.target.value))}
              >
                {warehouses.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>        
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {product ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductModal;
