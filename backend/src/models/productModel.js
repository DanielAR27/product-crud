const pool = require('../config/database');


// Obtener todos los productos
const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
  return result.rows;
};

// Obtener un producto por ID
const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear un nuevo producto
const createProduct = async (name, description, price, stock, stock_minimo = 5) => {
  const result = await pool.query(
    'INSERT INTO products (name, description, price, stock, stock_minimo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, stock, stock_minimo]
  );
  return result.rows[0];
};

// Actualizar un producto existente
const updateProduct = async (id, name, description, price, stock, stock_minimo) => {
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, stock_minimo = $5 WHERE id = $6 RETURNING *',
    [name, description, price, stock, stock_minimo, id]
  );
  return result.rows[0];
};

// Eliminar un producto
const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// ============================================================================
// NUEVAS FUNCIONES - CONTROL DE STOCK E INVENTARIO
// ============================================================================

/**
 * Obtener todos los productos con indicador de stock bajo
 * Agrega un campo 'stock_bajo' boolean a cada producto
 */
const getAllProductsWithStockStatus = async () => {
  const result = await pool.query(`
    SELECT 
      *,
      (stock < stock_minimo) as stock_bajo,
      (stock = 0) as sin_stock,
      CASE 
        WHEN stock = 0 THEN 'SIN_STOCK'
        WHEN stock < stock_minimo THEN 'STOCK_BAJO'
        ELSE 'OK'
      END as estado_stock
    FROM products 
    ORDER BY 
      CASE 
        WHEN stock = 0 THEN 1
        WHEN stock < stock_minimo THEN 2
        ELSE 3
      END,
      id ASC
  `);
  return result.rows;
};

/**
 * Obtener productos con stock bajo (stock < stock_minimo)
 */
const getProductsWithLowStock = async () => {
  const result = await pool.query(`
    SELECT 
      *,
      (stock_minimo - stock) as unidades_faltantes,
      ROUND((stock::numeric / stock_minimo::numeric * 100), 2) as porcentaje_stock
    FROM products 
    WHERE stock < stock_minimo AND stock > 0
    ORDER BY (stock_minimo - stock) DESC, stock ASC
  `);
  return result.rows;
};

/**
 * Obtener productos sin stock (stock = 0)
 */
const getProductsOutOfStock = async () => {
  const result = await pool.query(`
    SELECT * 
    FROM products 
    WHERE stock = 0
    ORDER BY id ASC
  `);
  return result.rows;
};

/**
 * Obtener dashboard de inventario con métricas generales
 */
const getInventoryDashboard = async () => {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total_productos,
      COUNT(CASE WHEN stock = 0 THEN 1 END) as productos_sin_stock,
      COUNT(CASE WHEN stock < stock_minimo AND stock > 0 THEN 1 END) as productos_stock_bajo,
      COUNT(CASE WHEN stock >= stock_minimo THEN 1 END) as productos_stock_ok,
      SUM(stock) as total_unidades_inventario,
      SUM(price * stock) as valor_total_inventario,
      ROUND(AVG(stock), 2) as promedio_stock,
      MIN(stock) as stock_minimo_actual,
      MAX(stock) as stock_maximo_actual
    FROM products
  `);
  
  const dashboard = result.rows[0];
  
  // Calcular porcentajes
  const total = parseInt(dashboard.total_productos);
  if (total > 0) {
    dashboard.porcentaje_sin_stock = ((dashboard.productos_sin_stock / total) * 100).toFixed(2);
    dashboard.porcentaje_stock_bajo = ((dashboard.productos_stock_bajo / total) * 100).toFixed(2);
    dashboard.porcentaje_stock_ok = ((dashboard.productos_stock_ok / total) * 100).toFixed(2);
  }
  
  return dashboard;
};

/**
 * Ajustar stock de un producto (incrementar o decrementar)
 * @param {number} id - ID del producto
 * @param {number} cantidad - Cantidad a ajustar (positivo para incrementar, negativo para decrementar)
 * @param {string} motivo - Razón del ajuste (opcional)
 */
const adjustProductStock = async (id, cantidad, motivo = 'No especificado') => {
  // Primero obtener el producto actual
  const currentProduct = await getProductById(id);
  
  if (!currentProduct) {
    throw new Error('Producto no encontrado');
  }
  
  const newStock = currentProduct.stock + cantidad;
  
  // Validar que el stock no sea negativo
  if (newStock < 0) {
    throw new Error(`Stock insuficiente. Stock actual: ${currentProduct.stock}, cantidad solicitada: ${Math.abs(cantidad)}`);
  }
  
  // Actualizar stock
  const result = await pool.query(
    'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
    [newStock, id]
  );
  
  const updatedProduct = result.rows[0];
  
  // Retornar información detallada del ajuste
  return {
    producto: updatedProduct,
    ajuste: {
      cantidad: cantidad,
      motivo: motivo,
      stock_anterior: currentProduct.stock,
      stock_nuevo: newStock,
      diferencia: cantidad
    },
    alerta: {
      stock_bajo: newStock < updatedProduct.stock_minimo,
      sin_stock: newStock === 0
    }
  };
};

/**
 * Obtener productos próximos a quedarse sin stock
 * (stock <= stock_minimo * 1.2, es decir, 20% por encima del mínimo)
 */
const getProductsNearLowStock = async () => {
  const result = await pool.query(`
    SELECT 
      *,
      stock_minimo * 1.2 as umbral_advertencia,
      (stock - stock_minimo) as margen_seguridad
    FROM products 
    WHERE stock <= (stock_minimo * 1.2) AND stock > stock_minimo
    ORDER BY (stock - stock_minimo) ASC
  `);
  return result.rows;
};

/**
 * Buscar productos por nombre con información de stock
 */
const searchProductsByName = async (searchTerm) => {
  const result = await pool.query(`
    SELECT 
      *,
      (stock < stock_minimo) as stock_bajo,
      (stock = 0) as sin_stock
    FROM products 
    WHERE LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)
    ORDER BY name ASC
  `, [`%${searchTerm}%`]);
  return result.rows;
};

/**
 * Obtener top productos con más stock
 */
const getTopProductsByStock = async (limit = 10) => {
  const result = await pool.query(`
    SELECT 
      *,
      (price * stock) as valor_inventario
    FROM products 
    ORDER BY stock DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

/**
 * Obtener productos críticos (sin stock o muy bajo)
 */
const getCriticalProducts = async () => {
  const result = await pool.query(`
    SELECT 
      *,
      CASE 
        WHEN stock = 0 THEN 'CRÍTICO - SIN STOCK'
        WHEN stock < (stock_minimo * 0.5) THEN 'CRÍTICO - MUY BAJO'
        WHEN stock < stock_minimo THEN 'ADVERTENCIA - BAJO'
        ELSE 'NORMAL'
      END as nivel_criticidad,
      (stock_minimo - stock) as unidades_para_reponer
    FROM products 
    WHERE stock < stock_minimo
    ORDER BY 
      CASE 
        WHEN stock = 0 THEN 1
        WHEN stock < (stock_minimo * 0.5) THEN 2
        ELSE 3
      END,
      stock ASC
  `);
  return result.rows;
};

/**
 * Actualizar stock_minimo de un producto
 */
const updateProductStockMinimo = async (id, newStockMinimo) => {
  if (newStockMinimo < 0) {
    throw new Error('El stock mínimo no puede ser negativo');
  }
  
  const result = await pool.query(
    'UPDATE products SET stock_minimo = $1 WHERE id = $2 RETURNING *',
    [newStockMinimo, id]
  );
  
  if (!result.rows[0]) {
    throw new Error('Producto no encontrado');
  }
  
  return result.rows[0];
};

// ============================================================================
// EXPORTAR TODAS LAS FUNCIONES
// ============================================================================

module.exports = {
  // Funciones originales
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Nuevas funciones de control de stock
  getAllProductsWithStockStatus,
  getProductsWithLowStock,
  getProductsOutOfStock,
  getInventoryDashboard,
  adjustProductStock,
  getProductsNearLowStock,
  searchProductsByName,
  getTopProductsByStock,
  getCriticalProducts,
  updateProductStockMinimo,
};