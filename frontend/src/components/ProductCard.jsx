import { Link } from 'react-router-dom';
import '../ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image-container">
          {product.image ? (
            <>
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-overlay">
                <button className="quick-view-btn">
                  <i className="bi bi-eye"></i> Quick View
                </button>
              </div>
            </>
          ) : (
            <div className="no-image">
              <i className="bi bi-image"></i>
              <span>No Image</span>
            </div>
          )}
          
          {!product.in_stock && (
            <span className="out-of-stock-badge">
              <i className="bi bi-exclamation-circle"></i> Out of Stock
            </span>
          )}
        </div>

        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-category">
            <i className="bi bi-tag"></i>
            <span>{product.category_name}</span>
          </div>

          <div className="product-price-section">
            <p className="product-price">
              <span className="currency">KSh</span>
              {product.price?.toLocaleString()}
            </p>
            
            {product.old_price && (
              <p className="product-old-price">
                KSh {product.old_price?.toLocaleString()}
              </p>
            )}
          </div>

          {product.free_shipping && (
            <span className="free-shipping">
              <i className="bi bi-truck"></i> Free Shipping
            </span>
          )}

          <div className="product-footer">
            {product.rating && (
              <div className="product-rating">
                <i className="bi bi-star-fill"></i>
                <span>{product.rating}</span>
              </div>
            )}
            
            {product.in_stock ? (
              <span className="stock-status in-stock">
                <i className="bi bi-check-circle-fill"></i>
                In Stock
              </span>
            ) : (
              <span className="stock-status out-of-stock">
                <i className="bi bi-x-circle-fill"></i>
                Out of Stock
              </span>
            )}
          </div>

          {product.in_stock && (
            <button className="add-to-cart-btn">
              <i className="bi bi-cart-plus"></i>
              Add to Cart
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;