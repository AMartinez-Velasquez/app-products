import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
} from '@mui/material';
import axios from 'axios';

interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    product?: Product | null;
}

const ProductModal: React.FC<ProductFormProps> = ({ open, onClose, refresh, product }) => {
    const [formData, setFormData] = useState<Product>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                stock: 0,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (product?.id) {
                await axios.put(`http://localhost:3000/products/${product.id}`, formData);
            } else {
                await axios.post('http://localhost:3000/products', formData);
            }
            refresh();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {product ? 'Editar Producto' : 'Agregar Producto'}
            </DialogTitle>
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
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
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