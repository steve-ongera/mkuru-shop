import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

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
        const params = { 
          category: selectedCategory,
          sort: sortBy 
        };
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
    setMobileFilterOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({});
    fetchProducts();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span>
        <span className="separator">›</span>
        <span className="current">Products</span>
        {selectedCategory && (
          <>
            <span className="separator">›</span>
            <span className="current">
              {categories.find(c => c.id === parseInt(selectedCategory))?.name}
            </span>
          </>
        )}
      </div>

      <div className="products-header">
        <h1>
          {selectedCategory 
            ? categories.find(c => c.id === parseInt(selectedCategory))?.name 
            : searchQuery 
              ? `Search Results for "${searchQuery}"`
              : 'All Products'
          }
        </h1>
        <p className="products-count">{products.length} products found</p>
      </div>

      {/* Mobile Filter Toggle */}
      <button 
        className="mobile-filter-toggle"
        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
      >
        <i className="fas fa-filter"></i>
        Filter & Sort
        <i className={`fas fa-chevron-${mobileFilterOpen ? 'up' : 'down'}`}></i>
      </button>

      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className={`sidebar ${mobileFilterOpen ? 'open' : ''}`}>
          <div className="filter-section">
            <h3>
              <i className="fas fa-list"></i>
              Categories
            </h3>
            <ul className="category-list">
              <li>
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={!selectedCategory ? 'active' : ''}
                >
                  <span>All Products</span>
                  <span className="count">
                    {categories.reduce((sum, cat) => sum + (cat.products_count || 0), 0)}
                  </span>
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={selectedCategory === String(category.id) ? 'active' : ''}
                  >
                    <span>{category.name}</span>
                    <span className="count">{category.products_count || 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h3>
              <i className="fas fa-tag"></i>
              Price Range
            </h3>
            <div className="price-range">
              <input type="number" placeholder="Min" className="price-input" />
              <span>-</span>
              <input type="number" placeholder="Max" className="price-input" />
              <button className="apply-btn">Apply</button>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h3>
              <i className="fas fa-star"></i>
              Customer Rating
            </h3>
            <div className="rating-filters">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="rating-option">
                  <input type="checkbox" />
                  <span className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star${i < rating ? '' : '-o'}`}></i>
                    ))}
                  </span>
                  <span className="rating-text">& up</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="sort-label">
              <i className="fas fa-sort"></i>
              Sort by:
            </div>
            <select 
              className="sort-select" 
              value={sortBy} 
              onChange={handleSortChange}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  handleCategoryChange(null);
                  setSearchQuery('');
                  setSortBy('popular');
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button className="pagination-prev" disabled>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="pagination-page active">1</button>
                <button className="pagination-page">2</button>
                <button className="pagination-page">3</button>
                <button className="pagination-page">4</button>
                <button className="pagination-page">5</button>
                <span className="pagination-dots">...</span>
                <button className="pagination-page">10</button>
                <button className="pagination-next">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Recently Viewed Section */}
      <section className="recently-viewed">
        <h2>Recently Viewed</h2>
        <div className="recently-viewed-grid">
          {products.slice(0, 6).map(product => (
            <div key={product.id} className="recently-viewed-item">
              <img src={product.image || 'https://via.placeholder.com/100x100'} alt={product.name} />
              <p className="recently-viewed-price">KSh {product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;