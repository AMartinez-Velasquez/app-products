import { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import WarehouseList from './WarehouseList';
import WarehouseModal from './WarehouseModal';
import axios from 'axios';

const WarehouseSection = ({ setSnackbarOpen, setSnackbarMessage }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/warehouses');
      setWarehouses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`http://localhost:3000/warehouses/${id}`);
      fetchWarehouses();
      setSnackbarMessage('Almacén eliminado');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Almacenes
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
        Agregar Almacén
      </Button>
      <WarehouseList
        warehouses={warehouses}
        onEdit={(w) => {
          setSelectedWarehouse(w);
          setOpenModal(true);
        }}
        onDelete={handleDelete}
      />
      <WarehouseModal
        open={openModal || !!selectedWarehouse}
        onClose={() => {
          setOpenModal(false);
          setSelectedWarehouse(null);
        }}
        refresh={fetchWarehouses}
        warehouse={selectedWarehouse}
      />
    </Box>
  );
};

export default WarehouseSection;
