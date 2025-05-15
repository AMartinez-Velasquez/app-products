import { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Snackbar, Alert, Grid,  } from '@mui/material';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
import WarehouseList from './components/WarehouseList';
import WarehouseModal from './components/WarehouseModal';
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

function App() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [refreshList, setRefreshList] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [openWarehouseModal, setOpenWarehouseModal] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleOpenForm = (product?: Product | null) => {
        setSelectedProduct(product || null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedProduct(null);
    };

    const handleSave = () => {
        setRefreshList(prev => !prev);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
          const res = await axios.get('http://localhost:3000/warehouses');
          setWarehouses(res.data);
        } catch (error) {
          console.error('Error fetching warehouses:', error);
        }
      };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleDeleteWarehouse = async (id) => {
        try {
          await axios.delete(`http://localhost:3000/warehouses/${id}`);
          fetchWarehouses();
          setSnackbarMessage('Almacén eliminado');
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Error deleting warehouse:', error);
        }
      };

    useEffect(() => {
        fetchProducts();
        fetchWarehouses();
    }, [refreshList]);

    return (
        <Container maxWidth="xl">
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sistema de Inventario
                </Typography>
                <Grid container spacing={12}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6">Productos</Typography>
                            <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenForm()}
                            sx={{ mb: 2 }}
                            >
                            Agregar Producto
                            </Button>
                            <ProductList
                            products={products}
                            onEdit={handleOpenForm}
                            onDelete={handleDelete}
                            />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Almacenes</Typography>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setSelectedWarehouse(null);
                        setOpenWarehouseModal(true);
                    }}
                    sx={{ mb: 2 }}
                    >
                    Agregar Almacén
                    </Button>
                    <WarehouseList
                    warehouses={warehouses}
                    onEdit={(warehouse) => {
                        setSelectedWarehouse(warehouse);
                        setOpenWarehouseModal(true);
                    }}
                    onDelete={handleDeleteWarehouse}
                    />
                </Grid>
            </Grid>

                <ProductModal
                    open={openForm}
                    onClose={handleCloseForm}
                   // onSave={handleSave}
                    product={selectedProduct}
                    refresh={fetchProducts}
                />

                <WarehouseModal
                    open={openWarehouseModal}
                    onClose={() => {
                    setOpenWarehouseModal(false);
                    setSelectedWarehouse(null);
                    }}
                    refresh={fetchWarehouses}
                    warehouse={selectedWarehouse}
                />
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default App; 