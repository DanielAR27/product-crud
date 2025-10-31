import '../styles/ProductItem.css';

// Componente para mostrar un producto individual en la lista
const ProductItem = ({ product, onEdit, onDelete, onAdjustStock }) => {
  
  // Determinar el estado del stock
  const isStockLow = product.stock < product.stock_minimo;
  const isOutOfStock = product.stock === 0;
  
  // Calcular el porcentaje de stock respecto al mínimo
  const stockPercentage = product.stock_minimo > 0 
    ? Math.round((product.stock / product.stock_minimo) * 100) 
    : 100;

  // Determinar la clase CSS según el estado
  const stockStatusClass = isOutOfStock ? 'out-of-stock' : isStockLow ? 'low-stock' : 'ok-stock';

  return (
    <div className={`product-item ${stockStatusClass}`}>
      {/* Indicador visual de alerta en la esquina */}
      {isOutOfStock && (
        <div className="stock-badge critical">
          <span>SIN STOCK</span>
        </div>
      )}
      {!isOutOfStock && isStockLow && (
        <div className="stock-badge warning">
          <span>STOCK BAJO</span>
        </div>
      )}
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description || 'Sin descripción'}</p>
        
        <div className="product-details">
          <span className="price">${Number.parseFloat(product.price).toFixed(2)}</span>
          
          {/* ===== SECCIÓN DE STOCK MEJORADA ===== */}
          <div className="stock-info">
            <div className="stock-numbers">
              <span className={`stock-value ${stockStatusClass}`}>
                Stock: {product.stock}
              </span>
              <span className="stock-min">
                Mín: {product.stock_minimo}
              </span>
            </div>
            
            {/* Barra de progreso visual */}
            <div className="stock-progress-bar">
              <div 
                className={`stock-progress-fill ${stockStatusClass}`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                title={`${stockPercentage}% del stock mínimo`}
              />
            </div>
            
            {/* Información adicional */}
            {isStockLow && !isOutOfStock && (
              <small className="stock-warning-text">
                Faltan {product.stock_minimo - product.stock} unidades para el mínimo
              </small>
            )}
          </div>
        </div>
      </div>
      
      {/* ===== ACCIONES MEJORADAS ===== */}
      <div className="product-actions">
        <button 
          className="btn-edit" 
          onClick={() => onEdit(product)}
          title="Editar producto"
        >
          Editar
        </button>
        
        {/* ===== NUEVO BOTÓN: AJUSTAR STOCK ===== */}
        {onAdjustStock && (
          <button 
            className="btn-adjust-stock" 
            onClick={() => onAdjustStock(product)}
            title="Ajustar stock (incrementar/decrementar)"
          >
            Ajustar Stock
          </button>
        )}
        
        <button 
          className="btn-delete" 
          onClick={() => onDelete(product.id)}
          title="Eliminar producto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductItem;