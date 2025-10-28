import { render, screen } from '@testing-library/react';
import ProductList from '../components/ProductList';

describe('ProductList - Unit Tests', () => {
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // PRUEBA 25: ProductList muestra mensaje cuando no hay productos
  // ============================================
  test('muestra mensaje cuando no hay productos', () => {
    // Arrange
    const emptyProducts = [];

    // Act
    render(
      <ProductList 
        products={emptyProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Assert
    expect(screen.getByText(/no hay productos registrados/i)).toBeInTheDocument();
    expect(screen.getByText(/crea uno para comenzar/i)).toBeInTheDocument();
  });

  // ============================================
  // PRUEBA 26: ProductList renderiza lista de productos correctamente
  // ============================================
  test('renderiza lista de productos correctamente', () => {
    // Arrange
    const mockProducts = [
      { id: 1, name: 'Laptop', description: 'Laptop HP', price: 500, stock: 10 },
      { id: 2, name: 'Mouse', description: 'Mouse Logitech', price: 25, stock: 50 }
    ];

    // Act
    render(
      <ProductList 
        products={mockProducts} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // Assert
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('Laptop HP')).toBeInTheDocument();
    expect(screen.getByText('Mouse Logitech')).toBeInTheDocument();
    
    // Verificar que no aparece el mensaje de vacío
    expect(screen.queryByText(/no hay productos registrados/i)).not.toBeInTheDocument();
  });

});