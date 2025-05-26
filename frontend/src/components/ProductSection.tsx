import { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import ProductList from './ProductList';
import ProductModal from './ProductModal';
import axios from 'axios';


const ProductSection = ({ setSnackbarOpen, setSnackbarMessage }) => {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      fetchProducts();
      setSnackbarMessage('Producto eliminado');
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Productos
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenForm(true)} sx={{ mb: 2 }}>
        Agregar Producto
      </Button>
      <ProductList products={products} onEdit={setSelectedProduct} onDelete={handleDelete} />
      <ProductModal
        open={openForm || !!selectedProduct}
        onClose={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        refresh={fetchProducts}
        product={selectedProduct}
      />
    </Box>
  );
};

export default ProductSection;
