import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import * as api from './services/api';
import './styles/global.css';

function App() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Función para cargar todos los productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar producto
  const handleSave = async (formData) => {
    try {
      if (productToEdit) {
        // Actualizar producto existente
        await api.updateProduct(productToEdit.id, formData);
      } else {
        // Crear nuevo producto
        await api.createProduct(formData);
      }
      
      // Recargar lista y limpiar formulario
      loadProducts();
      setProductToEdit(null);
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    }
  };

  // Preparar producto para edición
  const handleEdit = (product) => {
    setProductToEdit(product);
  };

  // Cancelar edición
  const handleCancel = () => {
    setProductToEdit(null);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestión de Productos</h1>
      </header>

      <main className="app-main">
        {error && <div className="error-message">{error}</div>}

        <div className="content-wrapper">
          <aside className="sidebar">
            <ProductForm
              productToEdit={productToEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </aside>

          <section className="main-content">
            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : (
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;