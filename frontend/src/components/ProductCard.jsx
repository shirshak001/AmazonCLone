import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { BsFillStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { AiOutlineShoppingCart, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useCart } from '../context/CartContext';
import LiveStockIndicator from './LiveStockIndicator';
import toast from 'react-hot-toast';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<BsFillStarFill key={i} className="star filled" />);
    else if (rating >= i - 0.5) stars.push(<BsStarHalf key={i} className="star filled" />);
    else stars.push(<BsStar key={i} className="star" />);
  }
  return <div className="stars">{stars}</div>;
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showQtySelector, setShowQtySelector] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    const pid = product._id || product.id;
    const ok = await addToCart(pid, quantity);
    setIsAdding(false);
    
    if (ok) {
      toast.success(`Added ${quantity} item(s) to cart`, { 

        duration: 2000
      });
      setQuantity(1);
      setShowQtySelector(false);
    } else {
      toast.error('Failed to add to cart');
    }
  };

  const handleQtyChange = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product.stock || 10)) {
      setQuantity(newQty);
    }
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const pid = product._id || product.id;
  const inStock = product.stock > 0;

  return (
    <Link to={`/product/${pid}`} className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      
      <div className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
        {!inStock && <div className="product-out-of-stock">Out of Stock</div>}
      </div>

      <div className="product-info">
        <p className="product-name">{product.name}</p>
        
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="product-reviews">({product.reviews.toLocaleString()})</span>
        </div>

        <LiveStockIndicator productId={pid} initialStock={product.stock || 0} />

        <div className="product-price-row">
          <span className="product-price">
            <span className="price-symbol">₹</span>
            {product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="product-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
          {discount && <span className="product-discount">({discount}% off)</span>}
        </div>

        {product.price > 499 && (
          <p className="product-delivery">[OK] FREE Delivery by Tomorrow</p>
        )}

        {showQtySelector ? (
          <div className="product-qty-selector" onClick={(e) => e.preventDefault()}>
            <button 
              className="qty-btn-minus" 
              onClick={(e) => handleQtyChange(e, -1)}
              disabled={quantity <= 1}
            >
              <AiOutlineMinus />
            </button>
            <span className="qty-display">{quantity}</span>
            <button 
              className="qty-btn-plus" 
              onClick={(e) => handleQtyChange(e, 1)}
              disabled={quantity >= (product.stock || 10)}
            >
              <AiOutlinePlus />
            </button>
          </div>
        ) : null}

        <button 
          className={`btn-add-cart ${isAdding ? 'loading' : ''} ${!inStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          onMouseEnter={() => inStock && setShowQtySelector(true)}
          onMouseLeave={() => setShowQtySelector(false)}
          disabled={!inStock || isAdding}
          id={`add-cart-${pid}`}
        >
          {isAdding ? (
            <>
              <span className="spinner-mini" /> Adding...
            </>
          ) : (
            <>
              <AiOutlineShoppingCart /> Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
