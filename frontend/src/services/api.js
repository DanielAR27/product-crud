import { getApiUrl } from '../config/api.config';

const API_URL = getApiUrl();

// Obtener todos los productos
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
};

// Obtener un producto por ID
export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Error al obtener el producto');
  return response.json();
};

// Crear un nuevo producto
export const createProduct = async (product) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Error al crear producto');
  return response.json();
};

// Actualizar un producto
export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Error al actualizar producto');
  return response.json();
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar producto');
  return response.json();
};

// ============================================================================
// NUEVAS FUNCIONES - CONTROL DE STOCK E INVENTARIO
// ============================================================================

/**
 * Obtener dashboard de inventario con métricas generales
 * GET /api/products/dashboard/inventory
 */
export const getInventoryDashboard = async () => {
  const response = await fetch(`${API_URL}/products/dashboard/inventory`);
  if (!response.ok) throw new Error('Error al obtener dashboard');
  return response.json();
};

/**
 * Obtener productos con stock bajo (stock < stock_minimo)
 * GET /api/products/stock/low
 */
export const getProductsLowStock = async () => {
  const response = await fetch(`${API_URL}/products/stock/low`);
  if (!response.ok) throw new Error('Error al obtener productos con stock bajo');
  return response.json();
};

/**
 * Obtener productos sin stock (stock = 0)
 * GET /api/products/stock/out
 */
export const getProductsOutOfStock = async () => {
  const response = await fetch(`${API_URL}/products/stock/out`);
  if (!response.ok) throw new Error('Error al obtener productos sin stock');
  return response.json();
};

/**
 * Obtener productos próximos a stock bajo
 * GET /api/products/stock/near-low
 */
export const getProductsNearLowStock = async () => {
  const response = await fetch(`${API_URL}/products/stock/near-low`);
  if (!response.ok) throw new Error('Error al obtener productos próximos a stock bajo');
  return response.json();
};

/**
 * Obtener productos críticos (sin stock o muy bajo)
 * GET /api/products/stock/critical
 */
export const getCriticalProducts = async () => {
  const response = await fetch(`${API_URL}/products/stock/critical`);
  if (!response.ok) throw new Error('Error al obtener productos críticos');
  return response.json();
};

/**
 * Obtener top productos con más stock
 * GET /api/products/stock/top?limit=10
 */
export const getTopProductsByStock = async (limit = 10) => {
  const response = await fetch(`${API_URL}/products/stock/top?limit=${limit}`);
  if (!response.ok) throw new Error('Error al obtener top productos');
  return response.json();
};

/**
 * Ajustar stock de un producto (incrementar o decrementar)
 * POST /api/products/:id/adjust-stock
 * @param {number} id - ID del producto
 * @param {number} cantidad - Cantidad a ajustar (positivo para incrementar, negativo para decrementar)
 * @param {string} motivo - Razón del ajuste (opcional)
 */
export const adjustProductStock = async (id, cantidad, motivo = '') => {
  const response = await fetch(`${API_URL}/products/${id}/adjust-stock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad, motivo }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al ajustar stock');
  }
  return response.json();
};

/**
 * Actualizar solo el stock_minimo de un producto
 * PATCH /api/products/:id/stock-minimo
 */
export const updateStockMinimo = async (id, stock_minimo) => {
  const response = await fetch(`${API_URL}/products/${id}/stock-minimo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock_minimo }),
  });
  if (!response.ok) throw new Error('Error al actualizar stock mínimo');
  return response.json();
};

/**
 * Buscar productos por nombre o descripción
 * GET /api/products/search?q=termino
 */
export const searchProducts = async (searchTerm) => {
  const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(searchTerm)}`);
  if (!response.ok) throw new Error('Error al buscar productos');
  return response.json();
};