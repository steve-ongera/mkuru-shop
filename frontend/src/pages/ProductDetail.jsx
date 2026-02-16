import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productsAPI.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to="/products">Products</Link>
        <span> / </span>
        <Link to={`/products?category=${product.category}`}>{product.category_name}</Link>
        <span> / </span>
        <span className="current">{product.name}</span>
      </div>

      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back to Products
      </button>

      <div className="product-detail-container">
        {/* Product Image Section */}
        <div className="product-image-section">
          <div className="product-main-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="no-image">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="#f3f4f6"/>
                  <path d="M30 40L50 60L70 40" stroke="#9ca3af" strokeWidth="2"/>
                  <circle cx="50" cy="30" r="5" fill="#9ca3af"/>
                </svg>
                <p>No Image Available</p>
              </div>
            )}
          </div>
          
          {/* Additional Info Badges */}
          <div className="product-badges">
            {product.in_stock && product.stock < 10 && (
              <span className="badge badge-warning">Only {product.stock} left!</span>
            )}
            {!product.in_stock && (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <Link to={`/products?category=${product.category}`} className="product-category">
                <span className="category-icon">📁</span>
                {product.category_name}
              </Link>
            </div>
          </div>

          {/* Price Section */}
          <div className="price-section">
            <div className="price-main">
              <span className="price-label">Price:</span>
              <span className="price-amount">{formatPrice(product.price)}</span>
            </div>
            {product.in_stock && (
              <div className="stock-badge in-stock">
                <span className="stock-icon">✓</span>
                <span>In Stock ({product.stock} available)</span>
              </div>
            )}
            {!product.in_stock && (
              <div className="stock-badge out-of-stock">
                <span className="stock-icon">✕</span>
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Product Details Table */}
          <div className="product-details-table">
            <h3>Product Details</h3>
            <table>
              <tbody>
                <tr>
                  <td className="detail-label">Category</td>
                  <td className="detail-value">{product.category_name}</td>
                </tr>
                <tr>
                  <td className="detail-label">Availability</td>
                  <td className="detail-value">
                    {product.in_stock ? (
                      <span className="text-success">In Stock ({product.stock} units)</span>
                    ) : (
                      <span className="text-danger">Out of Stock</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="detail-label">Product ID</td>
                  <td className="detail-value">#{product.id}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Section */}
          {product.in_stock && (
            <div className="product-actions">
              {/* Quantity Selector */}
              <div className="quantity-section">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1))
                      )
                    }
                    min="1"
                    max={product.stock}
                  />
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="subtotal">
                <span>Subtotal:</span>
                <span className="subtotal-amount">{formatPrice(product.price * quantity)}</span>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  onClick={handleAddToCart} 
                  className="btn btn-add-cart"
                  disabled={addedToCart}
                >
                  {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>
                {isAuthenticated ? (
                  <button onClick={handleBuyNow} className="btn btn-buy-now">
                    Buy Now
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-buy-now">
                    Login to Buy
                  </Link>
                )}
              </div>

              {/* Success Message */}
              {addedToCart && (
                <div className="success-message">
                  ✓ Product added to cart! <Link to="/cart">View Cart</Link>
                </div>
              )}
            </div>
          )}

          {/* Out of Stock Message */}
          {!product.in_stock && (
            <div className="out-of-stock-message">
              <p>This product is currently out of stock.</p>
              <Link to="/products" className="btn btn-secondary">
                Browse Similar Products
              </Link>
            </div>
          )}

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <span className="info-icon">🚚</span>
              <div>
                <strong>Free Delivery</strong>
                <p>Delivery within Nairobi & major towns</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">💳</span>
              <div>
                <strong>Secure Payment</strong>
                <p>M-Pesa & Card payments accepted</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">↩️</span>
              <div>
                <strong>Easy Returns</strong>
                <p>7-day return policy on all items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;