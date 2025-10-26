import { useState, useEffect } from 'react';
import '../styles/ProductForm.css';

// Formulario para crear o editar productos
const ProductForm = ({ productToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
  });

  // Si hay un producto para editar, cargar sus datos
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        stock: productToEdit.stock,
      });
    }
  }, [productToEdit]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    
    // Limpiar formulario después de guardar
    setFormData({ name: '', description: '', price: '', stock: 0 });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Nombre *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Precio *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save">
          {productToEdit ? 'Actualizar' : 'Crear'}
        </button>
        {productToEdit && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;