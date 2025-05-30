import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DetalleProductosAlmacenModal from './DetalleProductosAlmacenModal';

interface Product {
  id: number;
  name: string;
  stock?: number;
}

interface Warehouse {
  id: number;
  name: string;
}

interface Detail {
  id: number;
  product: Product;
  warehouse: Warehouse;
  stock: number;
}

const DetalleProductosAlmacenList: React.FC = () => {
  const [details, setDetails] = useState<Detail[]>([]);
  const [refresh, setRefresh] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingDetail, setEditingDetail] = useState<Detail | null>(null);

  const fetchDetails = async () => {
    try {
      const res = await axios.get('http://localhost:3000/product-warehouse-detail');
      setDetails(res.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/product-warehouse-detail/${id}`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error deleting detail:', error);
    }
  };

  const handleEdit = (detail: Detail) => {
    setEditingDetail(detail);
    setOpenModal(true);
  };

  useEffect(() => {
    fetchDetails();
  }, [refresh]);

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Almacén</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.product.name}</TableCell>
                <TableCell>{detail.warehouse.name}</TableCell>
                <TableCell>{detail.stock}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdit(detail)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleDelete(detail.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DetalleProductosAlmacenModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingDetail(null);
        }}
        refresh={() => setRefresh((prev) => !prev)}
        refreshWarehouses={() => {}}
        refreshProduct={() => {}}
        editingDetail={editingDetail}
      />
    </>
  );
};

export default DetalleProductosAlmacenList;
