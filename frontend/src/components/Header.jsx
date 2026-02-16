import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          Mkuru Shop
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/orders">Orders</Link>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Cart ({getCartCount()})
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <span>Hi, {user?.username}</span>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;