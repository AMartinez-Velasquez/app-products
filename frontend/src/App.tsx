import { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
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

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sistema de Inventario
                </Typography>
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
                <ProductModal
                    open={openForm}
                    onClose={handleCloseForm}
                   // onSave={handleSave}
                    product={selectedProduct}
                    refresh={fetchProducts}
                />
            </Box>
        </Container>
    );
}

export default App; 