import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import DetalleProductosAlmacenList from './DetalleProductosAlmacenList';
import DetalleProductosAlmacenModal from './DetalleProductosAlmacenModal';
import axios from 'axios';

const DetailSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(false);

  const refresh = () => setRefreshKey((prev) => !prev);

  const fetchWarehouses = async () => {
    return await axios.get('http://localhost:3000/warehouses');
  };

  const fetchProducts = async () => {
    return await axios.get('http://localhost:3000/products');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detalle Productos - Almacenes
      </Typography>
      <Button variant="outlined" color="secondary" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
        Agregar Relación
      </Button>
      <DetalleProductosAlmacenList key={refreshKey ? '1' : '0'} />
      <DetalleProductosAlmacenModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refresh={refresh}
        refreshWarehouses={fetchWarehouses}
        refreshProduct={fetchProducts}
      />
    </Box>
  );
};

export default DetailSection;
