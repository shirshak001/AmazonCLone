import React, { useMemo } from 'react';
import ProductCard from './ProductCard';

export default function SmartRecommendations({ allProducts = [], cartItems = [], viewedProducts = [] }) {
  const recommendations = useMemo(() => {
    const recommendations = {
      recommendedForYou: [],
      peopleAlsoBought: [],
      trending: []
    };

    // Get categories from cart items
    const cartCategories = cartItems.map(item => item.product?.category || item.category);
    
    // "Recommended for You" - Same category as cart items
    if (cartCategories.length > 0) {
      recommendations.recommendedForYou = allProducts
        .filter(p => cartCategories.includes(p.category))
        .filter(p => !cartItems.find(c => (c.product?._id || c.product?.id) === (p._id || p.id)))
        .slice(0, 5)
        .sort(() => Math.random() - 0.5);
    }

    // "People Also Bought" - Same category but with high ratings
    recommendations.peopleAlsoBought = allProducts
      .filter(p => p.rating >= 4)
      .filter(p => !cartItems.find(c => (c.product?._id || c.product?.id) === (p._id || p.id)))
      .slice(0, 5)
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

    // "Trending" - Popular products (high reviews)
    recommendations.trending = allProducts
      .slice(0)
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      .filter(p => !cartItems.find(c => (c.product?._id || c.product?.id) === (p._id || p.id)))
      .slice(0, 5);

    return recommendations;
  }, [allProducts, cartItems]);

  const renderSection = (title, products) => {
    if (products.length === 0) return null;

    return (
      <div className="recommendation-section" style={{ marginBottom: '40px' }}>
        <h3 className="section-title" style={{ marginBottom: '20px' }}>{title}</h3>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="recommendations-container">
      {renderSection('Recommended For You', recommendations.recommendedForYou)}
      {renderSection('People Also Bought', recommendations.peopleAlsoBought)}
      {renderSection('Trending Now', recommendations.trending)}
    </div>
  );
}
