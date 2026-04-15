import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function RelatedProducts({ category, productId, onAddToCart }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [category, productId]);

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products?limit=20');
      const data = await response.json();

      // Filter products by category and exclude current product
      const filtered = data.data
        .filter((p) => p.category === category && p.id !== productId)
        .slice(0, 6); // Show 6 related products

      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      toast.error('Failed to load related products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading related products...</div>;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '48px',
        paddingTop: '32px',
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
        Recommended For You
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #eee',
                transition: 'all 0.2s',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  background: '#f7f8f8',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  overflow: 'hidden',
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=280&fit=crop"
                    alt="Product"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                )}
              </div>

              {/* Product Name */}
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '1.4',
                  marginBottom: '8px',
                  color: '#0f1111',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.name}
              </div>

              {/* Rating */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '1px' }}>
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={11}
                      fill={i < Math.round(product.rating || 4) ? '#f0a500' : '#ccc'}
                      color={i < Math.round(product.rating || 4) ? '#f0a500' : '#ccc'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '10px', color: '#0066c0' }}>
                  ({product.reviews || 100})
                </span>
              </div>

              {/* Price */}
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f1111',
                  marginBottom: '8px',
                }}
              >
                ₹{product.price?.toLocaleString()}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                  toast.success('Added to cart!');
                }}
                style={{
                  marginTop: 'auto',
                  background: '#febd69',
                  color: '#0f1111',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#f3a847')}
                onMouseLeave={(e) => (e.target.style.background = '#febd69')}
              >
                <FiShoppingCart size={12} />
                Add
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
