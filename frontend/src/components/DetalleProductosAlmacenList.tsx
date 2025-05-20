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
} from '@mui/material';

interface Product {
  id: number;
  name: string;
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

  const fetchDetails = async () => {
    try {
      const res = await axios.get('http://localhost:3000/product-warehouse-detail');
      setDetails(res.data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Almacén</TableCell>
            <TableCell>Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell>{detail.product.name}</TableCell>
              <TableCell>{detail.warehouse.name}</TableCell>
              <TableCell>{detail.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetalleProductosAlmacenList;