import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-category">{item.category_name}</p>
                <p className="item-price">${item.price}</p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  max={item.stock}
                />
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-block"
          >
            Proceed to Checkout
          </button>

          <button onClick={clearCart} className="btn btn-secondary btn-block">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;