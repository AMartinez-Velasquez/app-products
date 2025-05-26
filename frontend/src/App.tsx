import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import ProductSection from './components/ProductSection';
import WarehouseSection from './components/WarehouseSection';
import DetailSection from './components/DetailSection';

function App() {
  const [activeView, setActiveView] = useState<'productos' | 'almacen' | 'detalle'>('productos');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const renderContent = () => {
    switch (activeView) {
      case 'productos':
        return <ProductSection setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen} />;
      case 'almacen':
        return <WarehouseSection setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen} />;
      case 'detalle':
        return <DetailSection />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '220px', bgcolor: '#f5f5f5', p: 2, borderRight: '1px solid #ccc' }}>
        <Typography variant="h6" gutterBottom>
          Navegación
        </Typography>
        <List>
          <ListItemButton onClick={() => setActiveView('productos')}>PRODUCTOS</ListItemButton>
          <ListItemButton onClick={() => setActiveView('almacen')}>ALMACÉN</ListItemButton>
          <ListItemButton onClick={() => setActiveView('detalle')}>DETALLE PRODUCTO</ListItemButton>
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" mb={3} textAlign="center">
          {activeView.toUpperCase()}
        </Typography>
        <Container maxWidth="xl">
          {renderContent()}
        </Container>
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
    </Box>
  );
}

export default App;
