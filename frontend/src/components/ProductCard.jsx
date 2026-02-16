import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-card-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
        <div className="product-card-content">
          <h3>{product.name}</h3>
          <p className="category">{product.category_name}</p>
          <p className="price">${product.price}</p>
          {product.in_stock ? (
            <span className="stock in-stock">In Stock</span>
          ) : (
            <span className="stock out-of-stock">Out of Stock</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;