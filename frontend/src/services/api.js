// URL base de la API - construida con el puerto desde variable de entorno
const API_URL = `http://localhost:${import.meta.env.VITE_API_PORT}/api`;
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