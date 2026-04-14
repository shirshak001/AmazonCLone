import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import { FiSearch } from 'react-icons/fi';
import { MOCK_PRODUCTS } from '../services/mockData';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports'];

const HERO_BANNERS = [
  { bg: '#131921', text: 'Deals on Electronics', sub: 'Up to 40% off top brands', color: '#febd69' },
  { bg: '#232f3e', text: 'New Arrivals in Fashion', sub: 'Shop the latest trends', color: '#fff' },
  { bg: '#37475a', text: 'Home & Kitchen Sale', sub: 'Upgrade your space today', color: '#febd69' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [heroBanner, setHeroBanner] = useState(0);

  const loadProducts = useCallback(async (search, category) => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      const res = await fetchProducts(params);
      setProducts(res.data.data || []);
    } catch {
      // Backend unavailable – filter mock data client-side
      let data = MOCK_PRODUCTS;
      if (category && category !== 'All') data = data.filter(p => p.category === category);
      if (search) data = data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const search = searchParams.get('search') || '';
    setActiveCategory(cat);
    setSearchQuery(search);
    loadProducts(search, cat);
  }, [searchParams, loadProducts]);

  // Auto-rotate hero banner
  useEffect(() => {
    const id = setInterval(() => setHeroBanner(b => (b + 1) % HERO_BANNERS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setSearchParams({ ...(activeCategory !== 'All' ? { category: activeCategory } : {}), ...(q ? { search: q } : {}) });
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchParams({ ...(cat !== 'All' ? { category: cat } : {}), ...(searchQuery ? { search: searchQuery } : {}) });
  };

  const banner = HERO_BANNERS[heroBanner];

  return (
    <>
      <Navbar onSearch={handleSearch} />

      {/* Hero Banner */}
      <div className="hero-banner" style={{ background: banner.bg }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ color: banner.color }}>{banner.text}</h1>
          <p className="hero-sub">{banner.sub}</p>
          <button className="hero-cta" onClick={() => handleCategory('Electronics')}>Shop Now</button>
        </div>
        <div className="hero-dots">
          {HERO_BANNERS.map((_, i) => (
            <span key={i} className={`hero-dot ${i === heroBanner ? 'active' : ''}`} onClick={() => setHeroBanner(i)} />
          ))}
        </div>
      </div>

      <div className="page-container">
        {/* Category Chips */}
        <div className="category-chips">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="results-header">
          <h2 className="section-title">
            {activeCategory !== 'All' ? activeCategory : searchQuery ? `Results for "${searchQuery}"` : 'Featured Products'}
          </h2>
          <span className="results-count">{products.length} results</span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="no-results">
            <p><FiSearch size={18} style={{verticalAlign:'middle',marginRight:6}} /> No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {activeCategory === 'All' && !searchQuery ? (
              // Section-wise rendering for homepage default view
              CATEGORIES.filter(c => c !== 'All').map(cat => {
                const catProducts = products.filter(p => p.category === cat).slice(0, 5); // Take top 5 per category
                if (catProducts.length === 0) return null;
                
                return (
                  <div key={cat} className="category-section" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                    <h3 className="category-section-title" style={{ fontSize: '1.4rem', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>Top in {cat}</h3>
                    <div className="product-grid" style={{ marginTop: 0 }}>
                      {catProducts.map(p => <ProductCard key={p._id || p.id} product={p} />)}
                    </div>
                  </div>
                );
              })
            ) : (
              // Standard grid for search or specific category filters
              products.map(p => <ProductCard key={p._id || p.id} product={p} />)
            )}
          </div>
        )}
      </div>
    </>
  );
}
