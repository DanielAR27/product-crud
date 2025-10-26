const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas del CRUD
router.get('/products', productController.getProducts);           // Listar todos
router.get('/products/:id', productController.getProduct);        // Obtener uno
router.post('/products', productController.createProduct);        // Crear
router.put('/products/:id', productController.updateProduct);     // Actualizar
router.delete('/products/:id', productController.deleteProduct);  // Eliminar

module.exports = router;