import { useState, useEffect } from 'react';
import '../styles/ProductForm.css';

const ProductForm = ({ productToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',            // <- usar llaves con los nombres que espera el front/test
    descripcion: '',
    precio: '',
    stock: 0,
    stock_minimo: 5,
  });

  const [errors, setErrors] = useState({ nombre: '', precio: '', stock: '' });
  const isEdit = !!productToEdit;

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.name || '',
        descripcion: productToEdit.description || '',
        precio: productToEdit.price || '',
        stock: Number(productToEdit.stock ?? 0),
        stock_minimo: Number(productToEdit.stock_minimo ?? 5),
      });
      setErrors({ nombre: '', precio: '', stock: '' });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Normalizar números
    const v = ['precio', 'stock', 'stock_minimo'].includes(name)
      ? (value === '' ? '' : Number(value))
      : value;

    setFormData((s) => ({ ...s, [name]: v }));
    // Limpiar error del campo al tipear
    setErrors((s) => ({ ...s, [name.replace('descripcion','')]: '' }));
  };

  const validate = () => {
    const newErrors = { nombre: '', precio: '', stock: '' };

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
    if (formData.precio === '' || Number(formData.precio) < 0)
      newErrors.precio = 'El precio no puede ser negativo.';
    if (formData.stock !== '' && Number(formData.stock) < 0)
      newErrors.stock = 'El stock no puede ser negativo.';

    setErrors(newErrors);
    return !newErrors.nombre && !newErrors.precio && !newErrors.stock;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Adaptar a claves del backend
    const payload = {
      name: formData.nombre,
      description: formData.descripcion,
      price: String(formData.precio),
      stock: Number(formData.stock) || 0,
      stock_minimo: Number(formData.stock_minimo) || 0,
    };

    onSave(payload);

    // Reiniciar solo si era "Crear"
    if (!isEdit) {
      setFormData({ nombre: '', descripcion: '', precio: '', stock: 0, stock_minimo: 5 });
      setErrors({ nombre: '', precio: '', stock: '' });
    }
  };

  const isStockLow = Number(formData.stock) < Number(formData.stock_minimo);

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>

      <div className="form-group">
        <label htmlFor="nombre">Nombre *</label>
        <input
          type="text"
          id="nombre"            // <- ID que la suite busca
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        {errors.nombre && <div className="error-nombre">{errors.nombre}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"      // <- ID esperado
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="precio">Precio *</label>
          <input
            type="number"
            id="precio"          // <- ID esperado
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
          {errors.precio && <div className="error-precio">{errors.precio}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock Actual</label>
          <input
            type="number"
            id="stock"           // <- ID esperado
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={isStockLow ? 'input-warning' : ''}
          />
          {errors.stock && <div className="error-stock">{errors.stock}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stock_minimo">
            Stock Mínimo <span className="tooltip-icon" title="Umbral de alerta cuando el stock está bajo">ℹ️</span>
          </label>
          <input
            type="number"
            id="stock_minimo"    // <- ID esperado
            name="stock_minimo"
            value={formData.stock_minimo}
            onChange={handleChange}
            min="0"
          />
          <small className="help-text">Se mostrará alerta cuando stock {'<'} stock mínimo</small>
        </div>

        <div className="form-group">
          <label>Estado del Stock</label>
          <div className={`stock-indicator ${
            Number(formData.stock) === 0 ? 'no-stock' :
            isStockLow ? 'low-stock' : 'ok-stock'
          }`}>
            {Number(formData.stock) === 0 ? 'Sin Stock' : isStockLow ? 'Stock Bajo' : '✓ Stock OK'}
          </div>
        </div>
      </div>

      {isStockLow && Number(formData.stock) > 0 && (
        <div className="form-warning"><strong>Advertencia:</strong> El stock actual ({formData.stock}) está por debajo del mínimo ({formData.stock_minimo})</div>
      )}
      {Number(formData.stock) === 0 && (
        <div className="form-error"><strong>Crítico:</strong> Este producto no tiene stock disponible</div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          id={isEdit ? 'btnActualizar' : 'btnGuardar'}     // <- IDs que exige la suite
          className="btn-save"
        >
          {isEdit ? 'Actualizar' : 'Crear'}
        </button>
        {isEdit && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
