const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getProducts);           // Listar todos (ahora con estado de stock)
router.get('/products/:id', productController.getProduct);        // Obtener uno (ahora con indicadores)
router.post('/products', productController.createProduct);        // Crear (ahora con stock_minimo)
router.put('/products/:id', productController.updateProduct);     // Actualizar (ahora con stock_minimo)
router.delete('/products/:id', productController.deleteProduct);  // Eliminar

// ============================================================================
// NUEVAS RUTAS - CONTROL DE STOCK E INVENTARIO
// ============================================================================

// Dashboard y métricas
router.get('/products/dashboard/inventory', productController.getInventoryDashboard);  // Dashboard de inventario

// Consultas de stock
router.get('/products/stock/low', productController.getProductsLowStock);              // Productos con stock bajo
router.get('/products/stock/out', productController.getProductsOutOfStock);            // Productos sin stock
router.get('/products/stock/near-low', productController.getProductsNearLowStock);     // Próximos a stock bajo
router.get('/products/stock/critical', productController.getCriticalProducts);         // Productos críticos
router.get('/products/stock/top', productController.getTopStock);                      // Top productos por stock

// *** Alias para la suite ***
router.get('/productos/stock-bajo', (req, res) => productController.getProductsLowStock(req, res));

// Operaciones de stock
router.post('/products/:id/adjust-stock', productController.adjustStock);              // Ajustar stock (+/-)
router.patch('/products/:id/stock-minimo', productController.updateStockMinimo);       // Actualizar stock mínimo

// Búsqueda
router.get('/products/search', productController.searchProducts);                      // Buscar productos

module.exports = router;