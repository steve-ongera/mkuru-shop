import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data.results || data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await productsAPI.search(searchQuery);
      } else {
        const params = selectedCategory ? { category: selectedCategory } : {};
        data = await productsAPI.getAll(params);
      }
      setProducts(data.results || data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({});
    fetchProducts();
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Products</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="products-container">
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            <li>
              <button
                onClick={() => handleCategoryChange(null)}
                className={!selectedCategory ? 'active' : ''}
              >
                All Products
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryChange(category.id)}
                  className={selectedCategory === String(category.id) ? 'active' : ''}
                >
                  {category.name} ({category.products_count})
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="products-main">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;