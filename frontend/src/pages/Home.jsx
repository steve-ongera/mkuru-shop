import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getFeatured(),
        categoriesAPI.getAll(),
      ]);
      setFeaturedProducts(productsData);
      setCategories(categoriesData.results || categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Mkuru Shop</h1>
          <p className="hero-subtitle">Discover amazing products at great prices</p>
          <Link to="/products" className="hero-cta">
            Shop Now
          </Link>
        </div>
        <div className="hero-image">
          <img src="https://ke.jumia.is/cms/2026/W07/KE_ONS_CNY_Fashion_0226_S.gif" alt="Shopping" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/categories" className="view-all-link">
            View All <span>→</span>
          </Link>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="category-card"
            >
              <div className="category-icon">
                <i className={`category-icon-${category.id}`}></i>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.products_count || 0} products</p>
              </div>
              <span className="category-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all-link">
            View All <span>→</span>
          </Link>
        </div>

        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <h3>Special Offer!</h3>
          <p>Get up to 50% off on selected items</p>
          <Link to="/products?offer=special" className="promo-cta">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-item">
          <div className="feature-icon">🚚</div>
          <div className="feature-text">
            <h4>Free Delivery</h4>
            <p>On orders over $50</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">🛡️</div>
          <div className="feature-text">
            <h4>Secure Payment</h4>
            <p>100% secure transactions</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">↩️</div>
          <div className="feature-text">
            <h4>Easy Returns</h4>
            <p>30-day return policy</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon">💬</div>
          <div className="feature-text">
            <h4>24/7 Support</h4>
            <p>Dedicated customer service</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;