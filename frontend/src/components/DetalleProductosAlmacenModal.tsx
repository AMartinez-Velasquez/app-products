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
  Tooltip,
} from '@mui/material';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  stock?: number;
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
  editingDetail?: {
    id: number;
    product: { id: number; name: string };
    warehouse: { id: number; name: string };
    stock: number;
  } | null;
}

const DetalleProductosAlmacenModal: React.FC<Props> = ({
  open,
  onClose,
  refresh,
  refreshWarehouses,
  refreshProduct,
  editingDetail,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [productId, setProductId] = useState<number>(0);
  const [warehouseId, setWarehouseId] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [productStock, setProductStock] = useState<number>(0);

  const fetchOptions = async () => {
    const [productsRes, warehousesRes] = await Promise.all([
      axios.get('http://localhost:3000/products'),
      axios.get('http://localhost:3000/warehouses'),
    ]);
    setProducts(productsRes.data);
    setWarehouses(warehousesRes.data);
  };

  const handleProductChange = async (id: number) => {
    setProductId(id);
    const res = await axios.get(`http://localhost:3000/products/${id}`);
    setProductStock(res.data.stock);
  };

  const handleStockChange = (value: number) => {
    if (value < 0) {
      setStock(0);
    } else if (value > 100) {
      setStock(100);
    } else {
      setStock(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stock < 0) return;

    if (editingDetail) {
      await axios.put(`http://localhost:3000/product-warehouse-detail/${editingDetail.id}`, {
        product: { id: productId },
        warehouse: { id: warehouseId },
        stock,
      });
    } else {
      await axios.post('http://localhost:3000/product-warehouse-detail', {
        product: { id: productId },
        warehouse: { id: warehouseId },
        stock,
      });
    }

    refresh();
    refreshWarehouses();
    refreshProduct();
    onClose();
  };

  useEffect(() => {
    if (open) fetchOptions();
  }, [open]);

  useEffect(() => {
    if (open && editingDetail) {
      setProductId(editingDetail.product.id);
      setWarehouseId(editingDetail.warehouse.id);
      setStock(editingDetail.stock);
    }
    if (open && !editingDetail) {
      setProductId(0);
      setWarehouseId(0);
      setStock(0);
      setProductStock(0);
    }
  }, [open, editingDetail]);

  const isStockInvalid = stock > productStock || stock < 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingDetail ? 'Editar' : 'Agregar'} Detalle Producto/Almacén</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Producto"
                value={productId}
                onChange={(e) => handleProductChange(Number(e.target.value))}
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
              <Tooltip
                title={
                  stock < 0
                    ? 'No se puede ingresar un valor negativo'
                    : stock > productStock
                    ? 'No hay stock suficiente del producto seleccionado'
                    : ''
                }
                placement="top"
                arrow
                open={isStockInvalid && productId !== 0}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Stock"
                  value={stock}
                  onChange={(e) => handleStockChange(Number(e.target.value))}
                  required
                  error={stock > productStock}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isStockInvalid}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DetalleProductosAlmacenModal;
