import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Mkuru Shop</h1>
        <p>Discover amazing products at great prices</p>
        <Link to="/products" className="btn btn-primary">
          Shop Now
        </Link>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="category-card"
            >
              <h3>{category.name}</h3>
              <p>{category.products_count} products</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;