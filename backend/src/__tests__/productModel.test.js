// Mock del pool de PostgreSQL ANTES de importar el modelo
jest.mock('../config/database');

const pool = require('../config/database');
const productModel = require('../models/productModel');

describe('Product Model - Unit Tests', () => {
  
  // Limpiar mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // PRUEBA 1: getAllProducts() retorna array
  // ============================================
  test('getAllProducts retorna array de productos', async () => {
    // Arrange: Preparar datos mock
    const mockProducts = [
      { id: 1, name: 'Laptop', description: 'Laptop HP', price: 500.00, stock: 10 },
      { id: 2, name: 'Mouse', description: 'Mouse Logitech', price: 25.50, stock: 50 }
    ];

    // Simular que pool.query retorna estos productos
    pool.query.mockResolvedValue({ rows: mockProducts });

    // Act: Ejecutar la función
    const result = await productModel.getAllProducts();

    // Assert: Verificar resultados
    expect(result).toEqual(mockProducts);
    expect(result).toHaveLength(2);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products ORDER BY id ASC');
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 2: getProductById() retorna producto correcto
  // ============================================
  test('getProductById retorna producto cuando existe', async () => {
    // Arrange
    const mockProduct = { 
      id: 1, 
      name: 'Teclado', 
      description: 'Teclado mecánico', 
      price: 80.00, 
      stock: 15 
    };

    pool.query.mockResolvedValue({ rows: [mockProduct] });

    // Act
    const result = await productModel.getProductById(1);

    // Assert
    expect(result).toEqual(mockProduct);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = $1', [1]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 3: getProductById() retorna undefined si no existe
  // ============================================
  test('getProductById retorna undefined cuando el producto no existe', async () => {
    // Arrange
    pool.query.mockResolvedValue({ rows: [] }); // Sin resultados

    // Act
    const result = await productModel.getProductById(999);

    // Assert
    expect(result).toBeUndefined();
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = $1', [999]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

// ============================================
  // PRUEBA 4: createProduct() crea producto y retorna con ID
  // ============================================
  test('createProduct crea un nuevo producto y lo retorna', async () => {
    // Arrange
    const newProduct = {
      id: 3,
      name: 'Monitor',
      description: 'Monitor 24 pulgadas',
      price: 150.00,
      stock: 20
    };

    pool.query.mockResolvedValue({ rows: [newProduct] });

    // Act
    const result = await productModel.createProduct('Monitor', 'Monitor 24 pulgadas', 150.00, 20);

    // Assert
    expect(result).toEqual(newProduct);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      ['Monitor', 'Monitor 24 pulgadas', 150.00, 20]
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 5: updateProduct() actualiza producto correctamente
  // ============================================
  test('updateProduct actualiza un producto existente', async () => {
    // Arrange
    const updatedProduct = {
      id: 1,
      name: 'Laptop Actualizada',
      description: 'Laptop HP nueva versión',
      price: 600.00,
      stock: 5
    };

    pool.query.mockResolvedValue({ rows: [updatedProduct] });

    // Act
    const result = await productModel.updateProduct(1, 'Laptop Actualizada', 'Laptop HP nueva versión', 600.00, 5);

    // Assert
    expect(result).toEqual(updatedProduct);
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
      ['Laptop Actualizada', 'Laptop HP nueva versión', 600.00, 5, 1]
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 6: deleteProduct() elimina producto y lo retorna
  // ============================================
  test('deleteProduct elimina un producto y lo retorna', async () => {
    // Arrange
    const deletedProduct = {
      id: 2,
      name: 'Mouse',
      description: 'Mouse Logitech',
      price: 25.50,
      stock: 50
    };

    pool.query.mockResolvedValue({ rows: [deletedProduct] });

    // Act
    const result = await productModel.deleteProduct(2);

    // Assert
    expect(result).toEqual(deletedProduct);
    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [2]
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});