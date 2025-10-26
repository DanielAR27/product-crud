import '../styles/ProductItem.css';

// Componente para mostrar un producto individual en la lista
const ProductItem = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-item">
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description || 'Sin descripción'}</p>
        <div className="product-details">
          <span className="price">${parseFloat(product.price).toFixed(2)}</span>
          <span className="stock">Stock: {product.stock}</span>
        </div>
      </div>
      <div className="product-actions">
        <button className="btn-edit" onClick={() => onEdit(product)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(product.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductItem;