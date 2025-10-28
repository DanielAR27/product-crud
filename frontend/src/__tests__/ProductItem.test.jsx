import { render, screen, fireEvent } from '@testing-library/react';
import ProductItem from '../components/ProductItem';

describe('ProductItem - Unit Tests', () => {
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockProduct = {
    id: 1,
    name: 'Laptop',
    description: 'Laptop HP',
    price: 500.00,
    stock: 10
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // PRUEBA 27: ProductItem llama a onEdit al hacer click en Editar
  // ============================================
  test('llama a onEdit con el producto al hacer click en Editar', () => {
    // Act
    render(
      <ProductItem 
        product={mockProduct} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByRole('button', { name: /editar/i });
    fireEvent.click(editButton);

    // Assert
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });

  // ============================================
  // PRUEBA 28: ProductItem llama a onDelete al hacer click en Eliminar
  // ============================================
  test('llama a onDelete con el ID del producto al hacer click en Eliminar', () => {
    // Act
    render(
      <ProductItem 
        product={mockProduct} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);

    // Assert
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProduct.id);
  });

  // ============================================
  // PRUEBA 29: ProductItem muestra "Sin descripción" cuando no hay descripción
  // ============================================
  test('muestra "Sin descripción" cuando el producto no tiene descripción', () => {
    // Arrange
    const productWithoutDescription = {
      id: 2,
      name: 'Mouse',
      description: null,
      price: 25.50,
      stock: 50
    };

    // Act
    render(
      <ProductItem 
        product={productWithoutDescription} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Assert
    expect(screen.getByText('Sin descripción')).toBeInTheDocument();
  });

});