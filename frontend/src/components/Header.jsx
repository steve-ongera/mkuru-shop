import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const sidebarRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target) &&
          !event.target.closest('.user-menu-btn')) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const cartCount = getCartCount();

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <span className="welcome-text">Welcome to Mkuru Shop</span>
              <div className="header-top-links">
                {isAuthenticated ? (
                  <>
                    <span className="user-greeting">
                      <i className="fas fa-user"></i> Hi, {user?.username || 'User'}
                    </span>
                    <Link to="/orders" className="top-link">My Orders</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="top-link">Sign In</Link>
                    <Link to="/register" className="top-link">Register</Link>
                  </>
                )}
                <Link to="/help" className="top-link">Help</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="header-main">
          <div className="container">
            <div className="header-main-content">
              {/* Mobile Menu Toggle */}
              <button 
                className="menu-toggle" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
              </button>

              {/* Logo */}
              <Link to="/" className="logo">
                <span className="logo-text">Mkuru</span>
                <span className="logo-shop">Shop</span>
              </Link>

              {/* Desktop Search Bar */}
              <form className="search-bar desktop-search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <i className="fas fa-search"></i>
                </button>
              </form>

              {/* Mobile Search Toggle */}
              <button 
                className="search-toggle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                <i className="fas fa-search"></i>
              </button>

              {/* Desktop Actions */}
              <div className="desktop-actions">
                {/* Cart */}
                <Link to="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i>
                  <span className="cart-text">Cart</span>
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="user-menu-container" ref={userMenuRef}>
                    <button 
                      className="user-menu-btn"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <i className="fas fa-user-circle"></i>
                      <span className="user-name">{user?.username?.split(' ')[0] || 'User'}</span>
                      <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                    </button>
                    
                    {showUserMenu && (
                      <div className="user-dropdown">
                        <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                          <i className="fas fa-user"></i> My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setShowUserMenu(false)}>
                          <i className="fas fa-box"></i> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setShowUserMenu(false)}>
                          <i className="fas fa-heart"></i> Wishlist
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="login-btn">
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="mobile-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Sidebar */}
      <div className={`sidebar-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`mobile-sidebar ${isMenuOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <div className="sidebar-user">
            {isAuthenticated ? (
              <>
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-info">
                  <span className="welcome-back">Welcome back,</span>
                  <span className="user-name">{user?.username || 'User'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="guest-info">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  <span className="divider">/</span>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </div>
              </>
            )}
          </div>
          <button className="sidebar-close" onClick={() => setIsMenuOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-menu">
            <Link to="/" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link to="/products" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-box"></i>
              <span>Products</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-shopping-bag"></i>
                  <span>My Orders</span>
                </Link>
                <Link to="/wishlist" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-heart"></i>
                  <span>Wishlist</span>
                </Link>
              </>
            )}
            <Link to="/cart" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-shopping-cart"></i>
              <span>Cart</span>
              {cartCount > 0 && <span className="sidebar-badge">{cartCount}</span>}
            </Link>
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-menu">
            <Link to="/help" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-question-circle"></i>
              <span>Help Center</span>
            </Link>
            <Link to="/contact" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-envelope"></i>
              <span>Contact Us</span>
            </Link>
            <Link to="/about" className="sidebar-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-info-circle"></i>
              <span>About Us</span>
            </Link>
          </div>

          {isAuthenticated && (
            <>
              <div className="sidebar-divider"></div>
              <button className="sidebar-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;