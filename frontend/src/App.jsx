import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import InventoryDashboard from './components/InventoryDashboard';
import * as api from './services/api';
import './styles/global.css';

function App() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== NUEVOS ESTADOS =====
  const [viewMode, setViewMode] = useState('all'); // 'all', 'low-stock', 'out-of-stock', 'critical'
  const [showDashboard, setShowDashboard] = useState(false); // ⬅️ Oculto por defecto
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, [viewMode]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data;

      switch (viewMode) {
        case 'low-stock': {
          const res = await api.getProductsLowStock();
          data = res.products;
          break;
        }
        case 'out-of-stock': {
          const res = await api.getProductsOutOfStock();
          data = res.products;
          break;
        }
        case 'critical': {
          const res = await api.getCriticalProducts();
          data = res.products;
          break;
        }
        default:
          data = await api.getProducts();
      }

      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (productToEdit) {
        await api.updateProduct(productToEdit.id, formData);
      } else {
        await api.createProduct(formData);
      }
      loadProducts();
      setProductToEdit(null);
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    document.querySelector('.product-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancel = () => {
    setProductToEdit(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    }
  };

  // ===== NUEVO: Botón “Nuevo” requerido por Selenium (id="btnNuevo") =====
  const handleNew = () => {
    setProductToEdit(null); // limpia formulario
    document.querySelector('.product-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== AJUSTAR STOCK =====
  const handleAdjustStock = async (product) => {
    const cantidad = prompt(
      `Ajustar stock de "${product.name}"\n\n` +
      `Stock actual: ${product.stock}\n` +
      `Stock mínimo: ${product.stock_minimo}\n\n` +
      `Ingrese cantidad (positivo para sumar, negativo para restar):`
    );
    if (cantidad === null) return;
    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum === 0) {
      alert('Por favor ingrese un número válido diferente de cero');
      return;
    }
    const motivo = prompt('Motivo del ajuste (opcional):') || 'Ajuste manual';

    try {
      const result = await api.adjustProductStock(product.id, cantidadNum, motivo);
      const mensaje =
        `Stock ajustado correctamente\n\n` +
        `Stock anterior: ${result.ajuste.stock_anterior}\n` +
        `Ajuste: ${result.ajuste.diferencia > 0 ? '+' : ''}${result.ajuste.diferencia}\n` +
        `Stock nuevo: ${result.ajuste.stock_nuevo}\n` +
        `Motivo: ${result.ajuste.motivo}`;
      if (result.alerta.sin_stock) {
        alert(mensaje + '\n\nADVERTENCIA: El producto se quedó sin stock');
      } else if (result.alerta.stock_bajo) {
        alert(mensaje + '\n\nEl stock está por debajo del mínimo');
      } else {
        alert(mensaje);
      }
      loadProducts();
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    }
  };

  // ===== BÚSQUEDA =====
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await api.searchProducts(searchTerm);
      setProducts(response.products);
      setError(null);
    } catch (err) {
      setError('Error al buscar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadProducts();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestión de Productos</h1>

        {/* ===== BARRA DE HERRAMIENTAS ===== */}
        <div className="header-toolbar">
          {/* Botón NUEVO con id esperado por la suite */}
          <button id="btnNuevo" className="btn-new" onClick={handleNew}>
            Nuevo
          </button>

          <button
            className="btn-toggle-dashboard"
            onClick={() => setShowDashboard(!showDashboard)}
          >
            {showDashboard ? 'Ocultar Dashboard' : 'Mostrar Dashboard'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* ===== FILTROS Y BÚSQUEDA ===== */}
        <div className="filters-section">
          <div className="view-filters">
            <button
              className={`filter-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
            >
              Todos ({products.length})
            </button>
            <button
              className={`filter-btn ${viewMode === 'low-stock' ? 'active' : ''}`}
              onClick={() => setViewMode('low-stock')}
            >
              Stock Bajo
            </button>
            <button
              className={`filter-btn ${viewMode === 'out-of-stock' ? 'active' : ''}`}
              onClick={() => setViewMode('out-of-stock')}
            >
              Sin Stock
            </button>
            <button
              className={`filter-btn ${viewMode === 'critical' ? 'active' : ''}`}
              onClick={() => setViewMode('critical')}
            >
              Críticos
            </button>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">Buscar</button>
            {searchTerm && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={handleClearSearch}
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* ===== CONTENIDO PRINCIPAL: PRIMERO LISTA + FORM ===== */}
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
              <>
                {searchTerm && (
                  <div className="search-results-info">
                    Mostrando {products.length} resultado(s) para "{searchTerm}"
                  </div>
                )}
                <ProductList
                  products={products}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdjustStock={handleAdjustStock}
                />
              </>
            )}
          </section>
        </div>

        {/* ===== DASHBOARD AL FINAL ===== */}
        {showDashboard && (
          <section className="dashboard-wrapper">
            <InventoryDashboard />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Sistema de Gestión de Productos con Control de Inventario | {products.length} producto(s) cargado(s)
        </p>
      </footer>
    </div>
  );
}

export default App;
