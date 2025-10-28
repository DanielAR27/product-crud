import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../components/ProductForm';

describe('ProductForm - Unit Tests', () => {
  
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  // Limpiar mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // PRUEBA 22: ProductForm renderiza correctamente en modo crear
  // ============================================
  test('renderiza correctamente en modo crear', () => {
    // Act
    render(<ProductForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Assert
    expect(screen.getByText('Nuevo Producto')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
  });

  // ============================================
  // PRUEBA 23: ProductForm renderiza con datos en modo editar
  // ============================================
  test('renderiza con datos del producto en modo editar', () => {
    // Arrange
    const productToEdit = {
      id: 1,
      name: 'Laptop',
      description: 'Laptop HP',
      price: 500,
      stock: 10
    };

    // Act
    render(
      <ProductForm 
        productToEdit={productToEdit} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    // Assert
    expect(screen.getByText('Editar Producto')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Laptop HP')).toBeInTheDocument();
    expect(screen.getByDisplayValue('500')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  // ============================================
  // PRUEBA 24: ProductForm valida campos requeridos
  // ============================================
  test('valida que los campos requeridos estén presentes al enviar', () => {
    // Arrange
    render(<ProductForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const submitButton = screen.getByRole('button', { name: /crear/i });

    // Act - Intentar enviar formulario vacío
    fireEvent.click(submitButton);

    // Assert - onSave NO debe ser llamado porque el HTML5 validation previene el submit
    expect(mockOnSave).not.toHaveBeenCalled();

    // Llenar campos requeridos y enviar
    const nameInput = screen.getByLabelText(/nombre/i);
    const priceInput = screen.getByLabelText(/precio/i);
    
    fireEvent.change(nameInput, { target: { value: 'Mouse' } });
    fireEvent.change(priceInput, { target: { value: '25' } });
    fireEvent.click(submitButton);

    // Assert - Ahora sí debe llamar onSave
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Mouse',
      description: '',
      price: '25',
      stock: 0
    });
  });

});