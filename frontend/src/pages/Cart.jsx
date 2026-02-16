import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../Cart.css'; // Import the CSS file

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="empty-state-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button 
          onClick={() => navigate('/products')} 
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span className="separator">›</span>
        <span onClick={() => navigate('/products')}>Products</span>
        <span className="separator">›</span>
        <span className="current">Shopping Cart</span>
      </div>

      <div className="cart-header">
        <h1>Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          <i className="fas fa-trash-alt"></i>
          Clear Cart
        </button>
      </div>

      <div className="cart-container">
        <div className="cart-items-section">
          {/* Cart Items Header */}
          <div className="cart-items-header">
            <div className="header-product">Product</div>
            <div className="header-price">Price</div>
            <div className="header-quantity">Quantity</div>
            <div className="header-subtotal">Subtotal</div>
            <div className="header-actions"></div>
          </div>

          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <div className="item-image" onClick={() => navigate(`/products/${item.id}`)}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-image">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3 onClick={() => navigate(`/products/${item.id}`)}>{item.name}</h3>
                    <p className="item-category">{item.category_name}</p>
                    {item.stock < 10 && (
                      <span className="item-stock-warning">
                        <i className="fas fa-exclamation-circle"></i>
                        Only {item.stock} left in stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  {formatPrice(item.price)}
                </div>

                <div className="item-quantity">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Math.max(1, Math.min(item.stock, parseInt(e.target.value) || 1)))
                      }
                      min="1"
                      max={item.stock}
                    />
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                <div className="item-subtotal">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-amount">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="continue-shopping">
            <button onClick={() => navigate('/products')} className="continue-btn">
              <i className="fas fa-arrow-left"></i>
              Continue Shopping
            </button>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="shipping-estimate">Calculated at checkout</span>
            </div>
            
            <div className="summary-row discount-row">
              <span>Discount</span>
              <span className="discount-value">- {formatPrice(0)}</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">{formatPrice(getCartTotal())}</span>
            </div>

            <div className="checkout-actions">
              <button
                onClick={() => navigate('/checkout')}
                className="btn-checkout"
              >
                <i className="fas fa-lock"></i>
                Proceed to Checkout
              </button>
              
              <button onClick={clearCart} className="btn-clear">
                <i className="fas fa-trash-alt"></i>
                Clear Cart
              </button>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-visa"></i>
                <i className="fas fa-mobile-alt"></i>
                <span>M-Pesa</span>
              </div>
            </div>
          </div>

          {/* Free Shipping Banner */}
          <div className="free-shipping-banner">
            <i className="fas fa-truck"></i>
            <div>
              <strong>Free Shipping</strong>
              <p>On orders over KSh 5,000</p>
            </div>
          </div>

          {/* Secure Checkout Badge */}
          <div className="secure-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;