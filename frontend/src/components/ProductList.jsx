import ProductItem from './ProductItem';
import '../styles/ProductList.css';

// Componente para mostrar la lista de productos
const ProductList = ({ products, onEdit, onDelete }) => {
  // Si no hay productos, mostrar mensaje
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay productos registrados. Crea uno para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductList;