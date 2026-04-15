import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist } = useContext(WishlistContext);
  const { addItemToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addItemToCart(product, 1);
  };

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ minHeight: '400px', paddingTop: '20px' }}>
        <h1 className="section-title">My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="no-results" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                background: '#febd69',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#0f1111'
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
            <div className="product-grid">
              {wishlist.map(product => (
                <div key={product._id || product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
