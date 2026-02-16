import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import '../Checkout.css'; // Import the CSS file

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone_number: '',
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="checkout-login">
        <div className="login-prompt">
          <div className="prompt-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>Please login to checkout</h2>
          <p>You need to be logged in to complete your purchase</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            <i className="fas fa-sign-in-alt"></i>
            Login
          </button>
          <p className="register-prompt">
            Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const order = await ordersAPI.create(orderData);
      clearCart();
      
      // Show success message
      alert('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span className="separator">›</span>
        <span onClick={() => navigate('/cart')}>Cart</span>
        <span className="separator">›</span>
        <span className="current">Checkout</span>
      </div>

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p className="checkout-subtitle">Complete your purchase by providing your details</p>
      </div>

      <div className="checkout-container">
        <div className="checkout-form-section">
          <div className="checkout-form">
            <div className="form-header">
              <div className="step-indicator">
                <span className="step-number">1</span>
                <span className="step-title">Shipping Information</span>
              </div>
              <i className="fas fa-truck step-icon"></i>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="shipping_address">
                  <i className="fas fa-map-marker-alt"></i>
                  Shipping Address <span className="required">*</span>
                </label>
                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter your complete shipping address (street, city, building, etc.)"
                  className={formData.shipping_address ? 'filled' : ''}
                />
                <span className="input-hint">We'll deliver to this address</span>
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">
                  <i className="fas fa-phone-alt"></i>
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 0712345678"
                  className={formData.phone_number ? 'filled' : ''}
                />
                <span className="input-hint">We'll contact you for delivery confirmation</span>
              </div>

              <div className="delivery-info">
                <i className="fas fa-info-circle"></i>
                <span>Delivery available within Nairobi & major towns (1-3 business days)</span>
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Place Order
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Secure Payment Info */}
          <div className="secure-payment-info">
            <h4>Secure Checkout</h4>
            <div className="secure-features">
              <div className="secure-feature">
                <i className="fas fa-lock"></i>
                <span>Your information is encrypted</span>
              </div>
              <div className="secure-feature">
                <i className="fas fa-shield-alt"></i>
                <span>Secure payment processing</span>
              </div>
              <div className="secure-feature">
                <i className="fas fa-undo-alt"></i>
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-summary-section">
          <div className="order-summary">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <span className="item-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <i className="fas fa-image"></i>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-category">{item.category_name}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-calculations">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-free">Free</span>
              </div>
              <div className="summary-row discount">
                <span>Discount</span>
                <span>- {formatPrice(0)}</span>
              </div>
            </div>

            <div className="summary-total">
              <div className="total-row">
                <span>Total</span>
                <span className="total-amount">{formatPrice(getCartTotal())}</span>
              </div>
              <p className="total-note">Inclusive of all taxes</p>
            </div>

            <div className="payment-methods">
              <p>Pay with:</p>
              <div className="payment-icons">
                <i className="fas fa-mobile-alt" title="M-Pesa"></i>
                <i className="fab fa-cc-mastercard" title="Mastercard"></i>
                <i className="fab fa-cc-visa" title="Visa"></i>
                <i className="fas fa-credit-card" title="Credit Card"></i>
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <i className="fas fa-truck"></i>
                <span>Free Delivery</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-undo-alt"></i>
                <span>7 Days Return</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Secure</span>
              </div>
            </div>
          </div>

          {/* Order Help */}
          <div className="order-help">
            <i className="fas fa-question-circle"></i>
            <span>Need help? <span className="contact-link">Contact us</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;