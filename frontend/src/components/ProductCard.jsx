import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { BsFillStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { useCart } from '../context/CartContext';
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const pid = product._id || product.id;
    const ok = await addToCart(pid);
    if (ok) toast.success(`"${product.name.slice(0, 30)}..." added to cart`);
    else toast.error('Failed to add to cart');
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const pid = product._id || product.id;
  return (
    <Link to={`/product/${pid}`} className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <div className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <div className="product-rating">
          <StarRating rating={product.rating} />
          <span className="product-reviews">({product.reviews.toLocaleString()})</span>
        </div>
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
          <p className="product-delivery">FREE Delivery by Tomorrow</p>
        )}
        <button className="btn-add-cart" onClick={handleAddToCart} id={`add-cart-${pid}`}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
