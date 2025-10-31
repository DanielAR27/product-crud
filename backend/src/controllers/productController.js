const productModel = require('../models/productModel');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    // Usar la nueva función que incluye estado de stock
    const products = await productModel.getAllProductsWithStockStatus();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Agregar indicador de stock bajo
    product.stock_bajo = product.stock < product.stock_minimo;
    product.sin_stock = product.stock === 0;
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, stock_minimo } = req.body;
    
    // Validación básica
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    
    // Validar que stock no sea negativo
    if (stock < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }
    
    // Validar que stock_minimo no sea negativo
    if (stock_minimo !== undefined && stock_minimo < 0) {
      return res.status(400).json({ error: 'El stock mínimo no puede ser negativo' });
    }
    
    const newProduct = await productModel.createProduct(
      name, 
      description, 
      price, 
      stock || 0, 
      stock_minimo || 5
    );
    
    // Agregar información de alerta
    newProduct.stock_bajo = newProduct.stock < newProduct.stock_minimo;
    newProduct.sin_stock = newProduct.stock === 0;
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, stock_minimo } = req.body;
    
    // Validación básica
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    
    // Validar que stock no sea negativo
    if (stock < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }
    
    // Validar que stock_minimo no sea negativo
    if (stock_minimo !== undefined && stock_minimo < 0) {
      return res.status(400).json({ error: 'El stock mínimo no puede ser negativo' });
    }
    
    const updatedProduct = await productModel.updateProduct(
      id, 
      name, 
      description, 
      price, 
      stock, 
      stock_minimo || 5
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Agregar información de alerta
    updatedProduct.stock_bajo = updatedProduct.stock < updatedProduct.stock_minimo;
    updatedProduct.sin_stock = updatedProduct.stock === 0;
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.deleteProduct(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// ============================================================================
// NUEVOS CONTROLADORES - CONTROL DE STOCK E INVENTARIO
// ============================================================================

/**
 * Obtener productos con stock bajo
 * GET /api/products/stock-bajo
 */
const getProductsLowStock = async (req, res) => {
  try {
    const products = await productModel.getProductsWithLowStock();
    res.json({
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos con stock bajo' });
  }
};

/**
 * Obtener productos sin stock
 * GET /api/products/sin-stock
 */
const getProductsOutOfStock = async (req, res) => {
  try {
    const products = await productModel.getProductsOutOfStock();
    res.json({
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos sin stock' });
  }
};

/**
 * Obtener dashboard de inventario con métricas
 * GET /api/products/dashboard
 */
const getInventoryDashboard = async (req, res) => {
  try {
    const dashboard = await productModel.getInventoryDashboard();
    res.json(dashboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener dashboard de inventario' });
  }
};

/**
 * Ajustar stock de un producto (incrementar/decrementar)
 * POST /api/products/:id/ajustar-stock
 * Body: { cantidad: number, motivo: string }
 */
const adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, motivo } = req.body;
    
    // Validación
    if (cantidad === undefined || cantidad === 0) {
      return res.status(400).json({ 
        error: 'La cantidad es requerida y debe ser diferente de cero' 
      });
    }
    
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad)) {
      return res.status(400).json({ 
        error: 'La cantidad debe ser un número entero' 
      });
    }
    
    const result = await productModel.adjustProductStock(id, cantidad, motivo);
    
    res.json({
      message: `Stock ajustado ${cantidad > 0 ? '+' : ''}${cantidad} unidades`,
      ...result
    });
    
  } catch (error) {
    console.error(error);
    
    // Errores específicos del modelo
    if (error.message.includes('Stock insuficiente')) {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al ajustar stock' });
  }
};

/**
 * Obtener productos próximos a stock bajo
 * GET /api/products/proximo-bajo-stock
 */
const getProductsNearLowStock = async (req, res) => {
  try {
    const products = await productModel.getProductsNearLowStock();
    res.json({
      count: products.length,
      products: products,
      mensaje: 'Productos con stock dentro del 20% por encima del mínimo'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos próximos a stock bajo' });
  }
};

/**
 * Buscar productos por nombre con estado de stock
 * GET /api/products/search?q=termino
 */
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const products = await productModel.searchProductsByName(q);
    res.json({
      count: products.length,
      searchTerm: q,
      products: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
};

/**
 * Obtener top productos con más stock
 * GET /api/products/top-stock?limit=10
 */
const getTopStock = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'El límite debe estar entre 1 y 100' });
    }
    
    const products = await productModel.getTopProductsByStock(limit);
    res.json({
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener top productos' });
  }
};

/**
 * Obtener productos críticos (sin stock o muy bajo)
 * GET /api/products/criticos
 */
const getCriticalProducts = async (req, res) => {
  try {
    const products = await productModel.getCriticalProducts();
    res.json({
      count: products.length,
      products: products,
      alerta: products.length > 0 ? 
        'Hay productos que requieren atención inmediata' : 
        'Todos los productos tienen stock adecuado'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos críticos' });
  }
};

/**
 * Actualizar solo el stock_minimo de un producto
 * PATCH /api/products/:id/stock-minimo
 * Body: { stock_minimo: number }
 */
const updateStockMinimo = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_minimo } = req.body;
    
    // Validación
    if (stock_minimo === undefined) {
      return res.status(400).json({ error: 'stock_minimo es requerido' });
    }
    
    if (typeof stock_minimo !== 'number' || stock_minimo < 0) {
      return res.status(400).json({ error: 'stock_minimo debe ser un número no negativo' });
    }
    
    const updatedProduct = await productModel.updateProductStockMinimo(id, stock_minimo);
    
    // Agregar indicadores
    updatedProduct.stock_bajo = updatedProduct.stock < updatedProduct.stock_minimo;
    updatedProduct.sin_stock = updatedProduct.stock === 0;
    
    res.json({
      message: 'Stock mínimo actualizado correctamente',
      product: updatedProduct
    });
    
  } catch (error) {
    console.error(error);
    
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('negativo')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Error al actualizar stock mínimo' });
  }
};

module.exports = {
  // Controladores originales (actualizados)
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Nuevos controladores de control de stock
  getProductsLowStock,
  getProductsOutOfStock,
  getInventoryDashboard,
  adjustStock,
  getProductsNearLowStock,
  searchProducts,
  getTopStock,
  getCriticalProducts,
  updateStockMinimo,
};