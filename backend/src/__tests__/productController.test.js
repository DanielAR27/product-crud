// Mock del modelo ANTES de importar el controlador
jest.mock('../models/productModel');

const productModel = require('../models/productModel');
const productController = require('../controllers/productController');

describe('Product Controller - Unit Tests', () => {
  
  let req, res;

  // Configurar mocks de req y res antes de cada prueba
  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  // Limpiar mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // PRUEBA 7: getProducts() responde con status 200 y JSON
  // ============================================
  test('getProducts responde con status 200 y lista de productos', async () => {
    // Arrange
    const mockProducts = [
      { id: 1, name: 'Laptop', price: 500 },
      { id: 2, name: 'Mouse', price: 25 }
    ];
    productModel.getAllProducts.mockResolvedValue(mockProducts);

    // Act
    await productController.getProducts(req, res);

    // Assert
    expect(productModel.getAllProducts).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockProducts);
    expect(res.status).not.toHaveBeenCalled(); // No debe llamar status en caso exitoso
  });

  // ============================================
  // PRUEBA 8: getProduct() responde 404 si no existe
  // ============================================
  test('getProduct responde con 404 cuando el producto no existe', async () => {
    // Arrange
    req.params.id = '999';
    productModel.getProductById.mockResolvedValue(null);

    // Act
    await productController.getProduct(req, res);

    // Assert
    expect(productModel.getProductById).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
  });

  // ============================================
  // PRUEBA 9: createProduct() responde 400 si faltan campos requeridos
  // ============================================
  test('createProduct responde con 400 cuando falta el nombre', async () => {
    // Arrange - Solo enviar price, sin name
    req.body = { price: 100 };

    // Act
    await productController.createProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Nombre y precio son requeridos' });
    expect(productModel.createProduct).not.toHaveBeenCalled();
  });

  // ============================================
  // PRUEBA 10: createProduct() responde 201 con producto creado
  // ============================================
  test('createProduct responde con 201 y el producto creado', async () => {
    // Arrange
    req.body = {
      name: 'Teclado',
      description: 'Teclado mecánico',
      price: 80,
      stock: 15
    };
    const newProduct = { id: 3, ...req.body };
    productModel.createProduct.mockResolvedValue(newProduct);

    // Act
    await productController.createProduct(req, res);

    // Assert
    expect(productModel.createProduct).toHaveBeenCalledWith(
      'Teclado',
      'Teclado mecánico',
      80,
      15
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newProduct);
  });

  // ============================================
  // PRUEBA 11: updateProduct() responde 404 si no existe
  // ============================================
  test('updateProduct responde con 404 cuando el producto no existe', async () => {
    // Arrange
    req.params.id = '999';
    req.body = { name: 'Producto', price: 100 };
    productModel.updateProduct.mockResolvedValue(null);

    // Act
    await productController.updateProduct(req, res);

    // Assert
    expect(productModel.updateProduct).toHaveBeenCalledWith(
      '999',
      'Producto',
      undefined, // description no enviado
      100,
      undefined  // stock no enviado
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
  });

  // ============================================
  // PRUEBA 12: deleteProduct() responde con mensaje de éxito
  // ============================================
  test('deleteProduct responde con mensaje de éxito al eliminar', async () => {
    // Arrange
    req.params.id = '2';
    const deletedProduct = { id: 2, name: 'Mouse', price: 25 };
    productModel.deleteProduct.mockResolvedValue(deletedProduct);

    // Act
    await productController.deleteProduct(req, res);

    // Assert
    expect(productModel.deleteProduct).toHaveBeenCalledWith('2');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Producto eliminado correctamente',
      product: deletedProduct
    });
  });

  // ============================================
  // PRUEBA 13: getProducts() maneja errores del modelo
  // ============================================
  test('getProducts responde con 500 cuando hay error en el modelo', async () => {
    // Arrange
    productModel.getAllProducts.mockRejectedValue(new Error('DB Error'));

    // Act
    await productController.getProducts(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener productos' });
  });

  // ============================================
  // PRUEBA 14: createProduct() maneja errores del modelo
  // ============================================
  test('createProduct responde con 500 cuando hay error en el modelo', async () => {
    // Arrange
    req.body = { name: 'Test', price: 100 };
    productModel.createProduct.mockRejectedValue(new Error('DB Error'));

    // Act
    await productController.createProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el producto' });
  });

  // ============================================
  // PRUEBA 15: deleteProduct() maneja errores del modelo
  // ============================================
  test('deleteProduct responde con 500 cuando hay error en el modelo', async () => {
    // Arrange
    req.params.id = '1';
    productModel.deleteProduct.mockRejectedValue(new Error('DB Error'));

    // Act
    await productController.deleteProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar el producto' });
  });

  // ============================================
  // PRUEBA 16: getProduct() responde con 200 cuando el producto existe
  // ============================================
  test('getProduct responde con 200 cuando el producto existe', async () => {
    // Arrange
    req.params.id = '1';
    const mockProduct = { id: 1, name: 'Laptop', price: 500 };
    productModel.getProductById.mockResolvedValue(mockProduct);

    // Act
    await productController.getProduct(req, res);

    // Assert
    expect(productModel.getProductById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  // ============================================
  // PRUEBA 17: getProduct() maneja errores del modelo
  // ============================================
  test('getProduct responde con 500 cuando hay error en el modelo', async () => {
    // Arrange
    req.params.id = '1';
    productModel.getProductById.mockRejectedValue(new Error('DB Error'));

    // Act
    await productController.getProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener el producto' });
  });

  // ============================================
  // PRUEBA 18: updateProduct() responde con 200 cuando actualiza correctamente
  // ============================================
  test('updateProduct responde con 200 y el producto actualizado', async () => {
    // Arrange
    req.params.id = '1';
    req.body = { name: 'Laptop Pro', description: 'Nueva', price: 800, stock: 5 };
    const updatedProduct = { id: 1, ...req.body };
    productModel.updateProduct.mockResolvedValue(updatedProduct);

    // Act
    await productController.updateProduct(req, res);

    // Assert
    expect(productModel.updateProduct).toHaveBeenCalledWith('1', 'Laptop Pro', 'Nueva', 800, 5);
    expect(res.json).toHaveBeenCalledWith(updatedProduct);
  });

  // ============================================
  // PRUEBA 19: updateProduct() maneja errores del modelo
  // ============================================
  test('updateProduct responde con 500 cuando hay error en el modelo', async () => {
    // Arrange
    req.params.id = '1';
    req.body = { name: 'Test', price: 100 };
    productModel.updateProduct.mockRejectedValue(new Error('DB Error'));

    // Act
    await productController.updateProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al actualizar el producto' });
  });

  // ============================================
  // PRUEBA 20: deleteProduct() responde 404 cuando no existe
  // ============================================
  test('deleteProduct responde con 404 cuando el producto no existe', async () => {
    // Arrange
    req.params.id = '999';
    productModel.deleteProduct.mockResolvedValue(null);

    // Act
    await productController.deleteProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
  });

  // ============================================
  // PRUEBA 21: updateProduct() responde 400 si faltan campos requeridos
  // ============================================
  test('updateProduct responde con 400 cuando falta el nombre o precio', async () => {
    // Arrange - Solo enviar stock, sin name ni price
    req.params.id = '1';
    req.body = { stock: 10 };

    // Act
    await productController.updateProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Nombre y precio son requeridos' });
    expect(productModel.updateProduct).not.toHaveBeenCalled();
  });
});