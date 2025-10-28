// Mock del config para evitar import.meta
jest.mock('../config/api.config', () => ({
  getApiUrl: () => 'http://localhost:3000/api'
}));

import * as api from '../services/api';

// Mock global de fetch
global.fetch = jest.fn();

describe('API Service - Unit Tests', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // PRUEBA 30: getProducts() hace fetch a la URL correcta
  // ============================================
  test('getProducts hace fetch a /api/products', async () => {
    // Arrange
    const mockProducts = [
      { id: 1, name: 'Laptop', price: 500 },
      { id: 2, name: 'Mouse', price: 25 }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts
    });

    // Act
    const result = await api.getProducts();

    // Assert
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/products');
    expect(result).toEqual(mockProducts);
  });

// ============================================
  // PRUEBA 31: getProduct() hace fetch con ID específico
  // ============================================
  test('getProduct hace fetch a /api/products/:id', async () => {
    // Arrange
    const productId = 5;
    const mockProduct = { 
      id: 5, 
      name: 'Monitor', 
      description: 'Monitor 24"',
      price: 150, 
      stock: 8 
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct
    });

    // Act
    const result = await api.getProduct(productId);

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`http://localhost:3000/api/products/${productId}`);
    expect(result).toEqual(mockProduct);
  });

  // ============================================
  // PRUEBA 32: createProduct() envía POST con body correcto
  // ============================================
  test('createProduct envía POST con los datos del producto', async () => {
    // Arrange
    const newProduct = {
      name: 'Teclado',
      description: 'Teclado mecánico',
      price: 80,
      stock: 15
    };

    const mockResponse = { id: 3, ...newProduct };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Act
    const result = await api.createProduct(newProduct);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/products',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      }
    );
    expect(result).toEqual(mockResponse);
  });

  // ============================================
  // PRUEBA 33: updateProduct() envía PUT con ID correcto
  // ============================================
  test('updateProduct envía PUT al endpoint correcto con el ID', async () => {
    // Arrange
    const productId = 1;
    const updatedData = {
      name: 'Laptop Pro',
      description: 'Laptop actualizada',
      price: 800,
      stock: 5
    };

    const mockResponse = { id: productId, ...updatedData };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Act
    const result = await api.updateProduct(productId, updatedData);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/products/${productId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      }
    );
    expect(result).toEqual(mockResponse);
  });

  // ============================================
  // PRUEBA 34: deleteProduct() envía DELETE a endpoint correcto
  // ============================================
  test('deleteProduct envía DELETE al endpoint correcto', async () => {
    // Arrange
    const productId = 2;
    const mockResponse = { message: 'Producto eliminado' };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    // Act
    const result = await api.deleteProduct(productId);

    // Assert
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/products/${productId}`,
      { method: 'DELETE' }
    );
    expect(result).toEqual(mockResponse);
  });

// ============================================
  // PRUEBA 35: getProducts() lanza error cuando falla
  // ============================================
  test('getProducts lanza error cuando la respuesta no es ok', async () => {
    // Arrange
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    // Act & Assert
    await expect(api.getProducts()).rejects.toThrow('Error al obtener productos');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 36: getProduct() lanza error cuando falla
  // ============================================
  test('getProduct lanza error cuando la respuesta no es ok', async () => {
    // Arrange
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    // Act & Assert
    await expect(api.getProduct(999)).rejects.toThrow('Error al obtener el producto');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 37: createProduct() lanza error cuando falla
  // ============================================
  test('createProduct lanza error cuando la respuesta no es ok', async () => {
    // Arrange
    const newProduct = { name: 'Test', price: 100 };
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    // Act & Assert
    await expect(api.createProduct(newProduct)).rejects.toThrow('Error al crear producto');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 38: updateProduct() lanza error cuando falla
  // ============================================
  test('updateProduct lanza error cuando la respuesta no es ok', async () => {
    // Arrange
    const updatedData = { name: 'Test', price: 100 };
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    // Act & Assert
    await expect(api.updateProduct(1, updatedData)).rejects.toThrow('Error al actualizar producto');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // PRUEBA 39: deleteProduct() lanza error cuando falla
  // ============================================
  test('deleteProduct lanza error cuando la respuesta no es ok', async () => {
    // Arrange
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    // Act & Assert
    await expect(api.deleteProduct(1)).rejects.toThrow('Error al eliminar producto');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

});