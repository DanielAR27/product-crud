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
const createProduct = async (name, description, price, stock) => {
  const result = await pool.query(
    'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, description, price, stock]
  );
  return result.rows[0];
};

// Actualizar un producto existente
const updateProduct = async (id, name, description, price, stock) => {
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
    [name, description, price, stock, id]
  );
  return result.rows[0];
};

// Eliminar un producto
const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};