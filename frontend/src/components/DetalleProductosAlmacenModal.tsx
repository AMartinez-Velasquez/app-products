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

interface Product {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  refreshWarehouses: () => void;
  refreshProduct: () => void;
}

const DetalleProductosAlmacenModal: React.FC<Props> = ({ open, onClose, refresh, refreshWarehouses, refreshProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [productId, setProductId] = useState<number>(0);
  const [warehouseId, setWarehouseId] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  const fetchOptions = async () => {
    const [productsRes, warehousesRes] = await Promise.all([
      axios.get('http://localhost:3000/products'),
      axios.get('http://localhost:3000/warehouses'),
    ]);
    setProducts(productsRes.data);
    setWarehouses(warehousesRes.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/product-warehouse-detail', {
      product: { id: productId },
      warehouse: { id: warehouseId },
      stock,
    });
    refresh();
    refreshWarehouses();
    refreshProduct();
    onClose();
  };

  useEffect(() => {
    if (open) fetchOptions();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar Detalle Producto/Almacén</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Producto"
                value={productId}
                onChange={(e) => setProductId(Number(e.target.value))}
                required
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Almacén"
                value={warehouseId}
                onChange={(e) => setWarehouseId(Number(e.target.value))}
                required
              >
                {warehouses.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DetalleProductosAlmacenModal;